import RelatedProducts from "../_components/related-products";
import Category from "../_components/category";
import Carousel from "../_components/carousel";
import BrandSlider from "../_components/brand-slider";



export default function Home() {
  return (
    <main className="max-w-6xl mx-auto px-2 md:px-4 py-4">
      <Carousel />
      <Category />
      <RelatedProducts />
      {/* <BrandSlider /> */}
    </main>
  );
};

