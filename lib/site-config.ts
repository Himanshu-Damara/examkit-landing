export const siteConfig = {
  name: "ExamKit",
  brand: "OMEN",
  description:
    "ExamKit is a focused browser extension from OMEN, built to give your browsing experience a sharper edge.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://examkit.example.com",
  listingUrl: process.env.NEXT_PUBLIC_EXAMKIT_LISTING_URL ?? "",
  downloadUrl: process.env.NEXT_PUBLIC_EXAMKIT_DOWNLOAD_URL ?? "",
  links: {
    privacy: "",
    contact: "",
    github: "https://github.com/Himanshu-Damara",
  },
} as const;

export const listingConfigured = Boolean(siteConfig.listingUrl);
export const downloadConfigured = Boolean(siteConfig.downloadUrl);
