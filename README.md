# ExamKit · OMEN

Premium landing page for the ExamKit browser extension. This is a standalone Next.js App Router site for Vercel; it does not contain or modify the extension source or self-host extension files.

Project profile: https://github.com/Himanshu-Damara

## Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React

## Local development

Requirements: Node.js 18.17+ (Node 20 LTS is recommended) and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Then open `http://localhost:3000`.

## Production configuration

Set these environment variables in the deployment environment:

```env
NEXT_PUBLIC_SITE_URL=https://your-real-domain.example
NEXT_PUBLIC_EXAMKIT_LISTING_URL=https://microsoftedge.microsoft.com/addons/detail/your-real-listing
NEXT_PUBLIC_EXAMKIT_DOWNLOAD_URL=https://drive.google.com/your-verified-release-link
```

The install and download links remain disabled until their corresponding verified URLs are configured. Replace the example site URL before deploying so canonical metadata, the sitemap, and robots directives use the real domain.

## Checks

```bash
npm run typecheck
npm run lint
npm run build
```

## Deploy to Vercel

Import the repository into Vercel, configure the production environment variables above, and deploy. Vercel detects the Next.js build automatically.

There is no database, extension self-hosting, CRX download flow, `updates.xml`, or extension `update_url` in this project. Microsoft Edge Add-ons remains the distribution channel.

## Content note

Product copy is limited to the currently verified brief: ExamKit is an OMEN browser extension distributed through Microsoft Edge Add-ons. Add further feature, pricing, and support claims only when verified product documentation is available.
