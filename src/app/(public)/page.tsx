import { AboutUs } from "@/components/about-us";
import { CategoriesSection } from "@/components/categories-section";
import { CTABanner } from "@/components/cta-banner";
import { FAQ } from "@/components/faq";
import { FeaturedOpportunities } from "@/components/featured-opportunities";
import { HeroSection } from "@/components/hero-section";
import { HowItWorks } from "@/components/how-it-works";
import { WhyInternQuest } from "@/components/why-intern-quest";

export default function Home() {
  return (
    <main>
          <HeroSection />
          <CategoriesSection />
          <HowItWorks />
          <FeaturedOpportunities />
          <WhyInternQuest />
          <AboutUs />
          <FAQ />
          <CTABanner />
    </main>
  );
}
