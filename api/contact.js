// Contact form endpoint (Vercel serverless function).
// Sends the message by e-mail through Resend (https://resend.com).
// Required environment variables in the Vercel project:
//   RESEND_API_KEY  – API key from Resend
//   CONTACT_TO      – recipient address (the Ocean Briefs team / editors)
//   CONTACT_FROM    – sender, e.g. "Ocean Briefs <contact@your-verified-domain>"
const MAX = { name: 120, email: 200, org: 160, topic: 120, message: 5000 };
const hits = new Map(); // simple in-memory rate limit per IP (best effort on serverless)

function clean(v, n) { return String(v == null ? '' : v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, n); }
function esc(s) { return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ ok: false, error: 'method' }); }

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  const now = Date.now(), list = (hits.get(ip) || []).filter(t => now - t < 10 * 60 * 1000);
  if (list.length >= 5) return res.status(429).json({ ok: false, error: 'rate' });
  list.push(now); hits.set(ip, list);

  let b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch { b = {}; } }
  b = b || {};
  if (b.website) return res.status(200).json({ ok: true }); // honeypot: silently drop bots

  const d = {
    name: clean(b.name, MAX.name), email: clean(b.email, MAX.email), org: clean(b.org, MAX.org),
    topic: clean(b.topic, MAX.topic), message: clean(b.message, MAX.message), lang: clean(b.lang, 5), consent: b.consent === true
  };
  if (!d.name || !d.message || d.message.length < 10 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email) || !d.consent)
    return res.status(400).json({ ok: false, error: 'invalid' });

  const key = process.env.RESEND_API_KEY, to = process.env.CONTACT_TO, from = process.env.CONTACT_FROM;
  if (!key || !to || !from) return res.status(503).json({ ok: false, error: 'not_configured' });

  const subject = `[Ocean Briefs] ${d.topic || 'Contact'} – ${d.name}`;
  const text = `Name: ${d.name}\nE-mail: ${d.email}\nOrganisation: ${d.org || '-'}\nTopic: ${d.topic || '-'}\nLanguage: ${d.lang || '-'}\n\n${d.message}\n`;
  const html = `<p><b>Name:</b> ${esc(d.name)}<br><b>E-mail:</b> ${esc(d.email)}<br><b>Organisation:</b> ${esc(d.org || '-')}<br><b>Topic:</b> ${esc(d.topic || '-')}<br><b>Language:</b> ${esc(d.lang || '-')}</p><p style="white-space:pre-wrap">${esc(d.message)}</p>`;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: to.split(',').map(s => s.trim()).filter(Boolean), reply_to: d.email, subject, text, html })
    });
    if (!r.ok) return res.status(502).json({ ok: false, error: 'send_failed' });
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(502).json({ ok: false, error: 'send_failed' });
  }
};
