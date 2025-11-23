import HeroLanding from "@/components/sections/hero-landing";
import StatsSection from "@/components/sections/stats-section";
import WhyChooseUs from "@/components/sections/why-choose-us";
import HowItWorks from "@/components/sections/how-it-works";
import WhoBenefits from "@/components/sections/who-benefits";

export default function IndexPage() {
  return (
    <>
      <HeroLanding />
      <StatsSection />
      <WhyChooseUs />
      <HowItWorks />
      <WhoBenefits />
    </>
  );
}
