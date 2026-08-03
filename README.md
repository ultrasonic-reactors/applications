# Ultrasonic Reactors — website

Static website for the **Ultrasonic Reactors** technology of the University of Alicante
(Research Results Transfer Office — OTRI). Migrated from the original WordPress site at
`ultrasonicreactors.com` on 2026-08-03.

Live site: https://ultrasonic-reactors.github.io/applications/

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

## Custom domain (optional)

To serve the site at `ultrasonicreactors.com` instead of github.io:

1. In the repo: **Settings → Pages → Custom domain**, enter `ultrasonicreactors.com`
   (this creates a `CNAME` file in the repo).
2. At the DNS provider, point the domain to GitHub Pages:
   - `A` records for the apex: `185.199.108.153`, `185.199.109.153`,
     `185.199.110.153`, `185.199.111.153`
   - `CNAME` record for `www` → `ultrasonic-reactors.github.io`
3. Enable **Enforce HTTPS** once the certificate is issued.
4. Update the "Back to home" link in `404.html` from `/applications/` to `/`
   (the 404 page is self-contained and uses an absolute path).

## Notes on the migration

- The WordPress contact form was replaced with a `mailto:` button — GitHub Pages cannot
  process form submissions. If a real form is wanted later, use a service such as
  Formspree and point the form's `action` at it.
- The contact email in the original site was obfuscated by Cloudflare; the decoded
  address `areaempresas@ua.es` is used in plain text here.
- The News page was empty on the original site and has a placeholder message.
