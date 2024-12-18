import Hero from "../components/landing-page/Hero";
import Header from "../components/Header";
import Footer from "../components/Footer";
// import FeaturedStores from "./../components/landing-page/FeaturedStores";
import CustomerLayout from "../components/customer/CustomerLayout";
import Categories from "../components/landing-page/Categories";
import LandingProducts from "../components/landing-page/LandingProducts";

export default function LandingPage() {
  return (
    <>
      <CustomerLayout>
        <Header />
        <div className="flex flex-col h-full  px-6 py-5 md:px-24 md:py-10 space-y-4">
          <Hero />

          <Categories />
          <LandingProducts />
          {/* <FeaturedStores /> */}
        </div>
        <Footer />
      </CustomerLayout>
    </>
  );
}
