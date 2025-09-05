import Hero from "../../components/Hero";
import Categories from "../../components/Categories";
import ProductDisplay from "../../components/ProductDisplay";
import ClientNav from "../../components/ClientNav";
import Footer from "../../components/footer";

const HomePage = () => {
  return (
    <div>
      <ClientNav />
      <Hero />
      <Categories />
      <ProductDisplay />
      <Footer />
    </div>
  );
};

export default HomePage;
