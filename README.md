# Ultrasonic Reactors — website

Static website for the **Ultrasonic Reactors** technology of the University of Alicante
(Research Results Transfer Office — OTRI). Migrated from the original WordPress site at
`ultrasonicreactors.com` on 2026-08-03.

Live site: https://ultrasonicreactors.com (custom domain; also served at
https://ultrasonic-reactors.github.io/applications/)

## Structure

Plain HTML + CSS, no build step, no framework. Edit the files directly (by hand or with
Claude/Codex) and push to `main` — GitHub Pages redeploys automatically.

```
index.html                  Home ("Flow Chemistry")
our-experience/index.html   Our Experience
news/index.html             News
contact/index.html          Contact
404.html                    Not-found page
assets/css/style.css        Single stylesheet (CSS custom properties at the top)
assets/img/                 Images and animations from the original site
assets/favicon/             Favicons
```

All internal links and asset paths are **relative**, so the site works both at
`https://ultrasonic-reactors.github.io/applications/` and at a custom domain root
without changes.

## Local preview

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000

## Custom domain

The site is served at `ultrasonicreactors.com` (cutover from WordPress on
2026-08-03). DNS is on Cloudflare, records DNS-only (grey cloud, not proxied —
GitHub needs this to issue the HTTPS certificate):

- `A` records for the apex → `185.199.108.153`, `185.199.109.153`,
  `185.199.110.153`, `185.199.111.153` (plus the matching `AAAA` records)
- `CNAME` `www` → `ultrasonic-reactors.github.io`
- The custom domain is set in **Settings → Pages** (tracked by the `CNAME`
  file in this repo); **Enforce HTTPS** should stay enabled.

## Notes on the migration

- The WordPress contact form was replaced with a `mailto:` button — GitHub Pages cannot
  process form submissions. If a real form is wanted later, use a service such as
  Formspree and point the form's `action` at it.
- The contact email in the original site was obfuscated by Cloudflare; the decoded
  address `areaempresas@ua.es` is used in plain text here.
- The News page was empty on the original site and has a placeholder message.
