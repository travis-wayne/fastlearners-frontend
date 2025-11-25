import { SidebarNavItem, SiteConfig } from "types";
import { env } from "@/env.mjs";

const site_url = env.NEXT_PUBLIC_APP_URL;

export const siteConfig: SiteConfig = {
  name: "FastLearners",
  description:
    "Get your project off to an explosive start with FastLearners! Harness the power of Next.js 14, Prisma, Neon, Auth.js v5, Resend, React Email, Shadcn/ui and Stripe to build your next big thing.",
  url: site_url,
  ogImage: `${site_url}/_static/og.jpg`,
  links: {
    twitter: "https://fastlearnersapp.com/",
    github: "https://github.com/fastlearners",
  },
  mailSupport: "support@saas-starter.com",
};

export const footerLinks: SidebarNavItem[] = [
  {
    title: "Company",
    items: [
      { title: "About", href: "/about" },
      { title: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Product",
    items: [
      { title: "Features", href: "/features" },
      { title: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Docs",
    items: [
      { title: "Introduction", href: "#" },
      { title: "Installation", href: "#" },
      { title: "Components", href: "#" },
      { title: "Code Blocks", href: "#" },
    ],
  },
  {
    title: "Legal",
    items: [
      { title: "Terms of Service", href: "/terms-of-service" },
      { title: "Privacy Policy", href: "/privacy-policy" },
      { title: "Cookie Policy", href: "/cookie-policy" },
      { title: "Data Breach Policy", href: "/data-breach-policy" },
      { title: "Data Processing Addendum", href: "/data-processing-addendum" },
      { title: "Children's Data Protection Policy", href: "/childrens-data-protection-policy" },
    ],
  },
];
