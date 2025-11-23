import { NavMobile } from "@/components/layout/mobile-nav";
import { NavBar } from "@/components/layout/navbar";
import FooterSection from "@/components/sections/footer-section";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <NavMobile />
      <NavBar scroll={true} />
      <main className="flex-1">{children}</main>
      <FooterSection />
    </div>
  );
}
