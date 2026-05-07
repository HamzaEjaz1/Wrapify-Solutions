import { getSiteContent } from "../lib/siteContentStore";
import HomePageClient from "./HomePageClient";

export default async function HomePage() {
  const content = await getSiteContent();
  return (
    <HomePageClient
      testimonials={content.testimonials}
      services={content.services}
      portfolioCategories={content.portfolioCategories}
      partners={content.partners}
    />
  );
}
