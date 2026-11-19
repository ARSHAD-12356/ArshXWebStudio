import SmoothScroll from "@/components/SmoothScroll";
import Header from "@/components/header/Header";
import Hero from "@/components/Hero";
import UseAiFaster from "@/components/UseAiFaster";
import Benefits from "@/components/Benefits";
import GlobalNetwork from "@/components/GlobalNetwork";
import Playground from "@/components/Playground";
import UseCases from "@/components/UseCases";
import Pricing from "@/components/Pricing";
import Faq from "@/components/Faq";
import Cta from "@/components/Cta";
import Products from "@/components/Products";
import Footer from "@/components/Footer";
import PageEffects from "@/components/PageEffects";

export default function Home() {
  return (
    <SmoothScroll>
      <Header />
      <main>
        <Hero />
        <UseAiFaster />
        <Benefits />
        <GlobalNetwork />
        <Playground />
        <UseCases />
        <Pricing />
        <Faq />
        <Cta />
        <Products />
      </main>
      <Footer />
      <PageEffects />
    </SmoothScroll>
  );
}
