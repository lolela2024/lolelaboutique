import { CategoriesSelection } from "../components/storefront/CategorySelection";
import { FeaturedProducts } from "../components/storefront/FeaturedProducts";
import { Hero } from "../components/storefront/Hero";
import HeroText from "../components/storefront/HeroText";

export default function IndexPage() {
  return (
    <div>
      <Hero />
      <HeroText />
      <CategoriesSelection />
      <FeaturedProducts />
    </div>
  );
}
