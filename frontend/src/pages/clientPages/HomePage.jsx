import Hero from "../../components/Hero";
import Categories from "../../components/Categories";
import ProductDisplay from "../../components/ProductDisplay";
import Footer from "../../components/footer";
import ProductDetailsNav from "../../components/ProductDetailsNav";

const HomePage = () => {
  return (
    <div>
      <ProductDetailsNav />
      <Hero />
      <Categories />
      <ProductDisplay />
      <Footer />
    </div>
  );
};

export default HomePage;
