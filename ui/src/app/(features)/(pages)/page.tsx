import { ProductsGird } from "../_components/products-grid";
import { LandingSection } from "../_components/carousel";
import { CategorySlider } from "@/components/category-slider";



export default function Home() {
  return (
    <main className="max-w-6xl mx-auto px-2 md:px-4 py-4">
      <LandingSection />
      <CategorySlider />
      <ProductsGird />
    </main>
  );
};

