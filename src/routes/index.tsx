import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/portfolio/Nav";
import { Hero } from "@/components/portfolio/Hero";
import { About } from "@/components/portfolio/About";
import { Services } from "@/components/portfolio/Services";
import { Experience } from "@/components/portfolio/Experience";
import { Work } from "@/components/portfolio/Work";
import { Skills } from "@/components/portfolio/Skills";
import { Certifications } from "@/components/portfolio/Certifications";
import { Contact } from "@/components/portfolio/Contact";
import { Footer } from "@/components/portfolio/Footer";
import { FloatingOrbs } from "@/components/portfolio/FloatingOrbs";

const TITLE = "Fahad Al Noman | Full-Stack Web Developer & Digital Marketer";
const DESCRIPTION =
  "Fahad Al Noman — Full-Stack Web Developer & Digital Marketer based in Malta. React, Laravel, SEO, and paid campaigns that drive real growth.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Fahad Al Noman",
          jobTitle: "Full-Stack Web Developer & Digital Marketer",
          address: { "@type": "PostalAddress", addressLocality: "Qormi", addressCountry: "MT" },
          email: "fahadnomanofficial@gmail.com",
          telephone: "+356 9978 4477",
          url: "/",
          sameAs: ["https://www.linkedin.com/in/fahad-al-noman-555039411/"],
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-background text-foreground">
      <FloatingOrbs />
      <Nav />
      <main>
        <Hero />
        <About />
        <Services />
        <Experience />
        <Work />
        <Skills />
        <Certifications />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
