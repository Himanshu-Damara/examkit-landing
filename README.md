# ExamKit · OMEN

Premium landing page for the ExamKit browser extension. This is a standalone Next.js App Router site for Vercel; it does **not** contain or modify the extension source, self-host extension files, or implement an update service.

Project profile: https://github.com/Himanshu-Damara

## Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React
- Vercel-compatible static/server-rendered frontend

## Local development

Requirements: Node.js 18.17+ (Node 20 LTS is recommended) and npm.

```bash
npm install
copy .env.example .env.local
npm run dev
```

Then open `http://localhost:3000`.

## Required production configuration

The official Microsoft Edge Add-ons URL is intentionally not invented. Set it only after the real ExamKit listing exists:

```env
NEXT_PUBLIC_SITE_URL=https://your-real-domain.example
NEXT_PUBLIC_EXAMKIT_LISTING_URL=https://microsoftedge.microsoft.com/addons/detail/your-real-listing
NEXT_PUBLIC_EXAMKIT_DOWNLOAD_URL=https://drive.google.com/your-verified-release-link
```

Until `NEXT_PUBLIC_EXAMKIT_LISTING_URL` is set, every install CTA remains visibly disabled and explains which variable is missing. This avoids presenting a fake or broken production destination as a working link.

`NEXT_PUBLIC_SITE_URL` is used for canonical metadata, Open Graph URLs, `sitemap.xml`, and `robots.txt`. Replace the example value before deployment.

`NEXT_PUBLIC_EXAMKIT_DOWNLOAD_URL` powers the **Download package** buttons. It can point to a verified Google Drive share URL or another release host. Until it is set, the buttons remain visibly disabled rather than presenting a fake destination.

## Checks

```bash
npm run typecheck
npm run lint
npm run build
```

## Deploy to Vercel

1. Push this project to a Git provider.
2. Import the repository into Vercel.
3. Add `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_EXAMKIT_LISTING_URL`, and (when ready) `NEXT_PUBLIC_EXAMKIT_DOWNLOAD_URL` in the Vercel project environment variables for Production.
4. Deploy. Vercel detects the Next.js build automatically.

There is no database, backend, extension self-hosting, CRX download flow, `updates.xml`, or extension `update_url` in this project. Microsoft Edge Add-ons remains the distribution channel.

## Content note

No ExamKit extension repository or README was present in the workspace when this site was created. Product copy is therefore limited to the verified brief: ExamKit is an OMEN browser extension distributed through Microsoft Edge Add-ons. Replace the intentionally conservative FAQ and feature copy with verified extension details once the extension README/listing is available.
