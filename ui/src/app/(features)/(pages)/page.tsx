import RelatedProducts from "../_components/related-products";
import Category from "../_components/category";
import { LandingSection } from "../_components/carousel";



export default function Home() {
  return (
    <main className="max-w-6xl mx-auto px-2 md:px-4 py-4">
      <LandingSection />
      <Category />
      <RelatedProducts />
    </main>
  );
};

