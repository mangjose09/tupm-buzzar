import React, { useState, useEffect } from "react";
import buzzar_api from "../config/api-config";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CustomerLayout from "../components/customer/CustomerLayout";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
  Button,
} from "@material-tailwind/react";

function Icon({ id, open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`${
        id === open ? "rotate-180" : ""
      } h-5 w-5 transition-transform`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}

export default function ShopPage() {
  const [open, setOpen] = useState(0);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceSort, setPriceSort] = useState(""); // State for price sorting
  const [minPrice, setMinPrice] = useState(""); // State for minimum price
  const [maxPrice, setMaxPrice] = useState(""); // State for maximum price
  const navigate = useNavigate();
  const location = useLocation();

  const categories = [
    "Fashion & Apparel",
    "Food & Beverages",
    "Books & Stationery",
    "Gadgets & Electronics",
    "Arts & Crafts",
    "Health & Wellness",
    "Home & Living",
    "Services",
    "Sports & Recreation",
    "Events & Tickets",
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await buzzar_api.get("/products/list");
        const allProducts = response.data;
        setProducts(allProducts);
        setFilteredProducts(allProducts); // Initially display all products
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get("category");
    if (category) {
      setSelectedCategories([category]);
    }
  }, [location.search]);

  useEffect(() => {
    let filtered = [...products];

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        product.categories.some((cat) =>
          selectedCategories.includes(cat.category_name)
        )
      );
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      filtered = filtered.filter((product) => {
        const price = parseFloat(product.price);
        return (
          (minPrice ? price >= parseFloat(minPrice) : true) &&
          (maxPrice ? price <= parseFloat(maxPrice) : true)
        );
      });
    }

    // Sort products based on selected price sort option
    if (priceSort === "low-to-high") {
      filtered = filtered.sort(
        (a, b) => parseFloat(a.price) - parseFloat(b.price)
      );
    } else if (priceSort === "high-to-low") {
      filtered = filtered.sort(
        (a, b) => parseFloat(b.price) - parseFloat(a.price)
      );
    }

    setFilteredProducts(filtered);
  }, [selectedCategories, products, minPrice, maxPrice, priceSort]);

  const handleCheckboxChange = (category) => {
    setSelectedCategories((prevSelectedCategories) => {
      let updatedCategories = [...prevSelectedCategories];
      if (updatedCategories.includes(category)) {
        updatedCategories = updatedCategories.filter((c) => c !== category);
      } else {
        updatedCategories.push(category);
      }
      return updatedCategories;
    });
  };

  const handleResetFilters = () => {
    setSelectedCategories([]); // Clear selected categories
    setFilteredProducts(products); // Show all products
    setMinPrice(""); // Clear minimum price
    setMaxPrice(""); // Clear maximum price
    setPriceSort(""); // Clear price sorting
  };

  const handleOpen = (value) => setOpen(open === value ? 0 : value);

  return (
    <>
      <CustomerLayout>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <aside className="w-full md:w-64">
              <div className="flex justify-between">
                <h2 className="text-lg font-semibold mb-4">Filters</h2>
                <h2
                  className="text-gray-600 hover:text-[#F6962E] cursor-pointer"
                  onClick={handleResetFilters}
                >
                  Reset
                </h2>
              </div>

              {/* Categories Filter */}
              <Accordion open={open === 1} icon={<Icon id={1} open={open} />}>
                <AccordionHeader onClick={() => handleOpen(1)}>
                  Categories
                </AccordionHeader>
                <AccordionBody>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div
                        key={category}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          id={category}
                          value={category}
                          checked={selectedCategories.includes(category)}
                          onChange={() => handleCheckboxChange(category)}
                          className="w-4 h-4"
                        />
                        <label htmlFor={category} className="text-sm">
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </AccordionBody>
              </Accordion>
              <Accordion open={open === 2} icon={<Icon id={2} open={open} />}>
                <AccordionHeader onClick={() => handleOpen(2)}>
                  Price
                </AccordionHeader>
                <AccordionBody>
                  {/* Price Filter */}
                  <div className="mt-4">
                    <h2 className="text-md mb-2">Sort By:</h2>
                    <div>
                      <select
                        className="w-full bg-transparent placeholder:text-black text-slate-700 text-sm border border-black rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer"
                        onChange={(e) => setPriceSort(e.target.value)}
                        value={priceSort}
                        placeholder="Sort by Price"
                      >
                        <option value="low-to-high">Price: Low to High</option>
                        <option value="high-to-low">Price: High to Low</option>
                      </select>
                    </div>

                    <h2 className="text-md mt-4 mb-2">Price Range</h2>

                    <div className="flex space-x-2 ">
                      <input
                        type="number"
                        className="p-2 border border-1 border-black rounded-md w-1/2"
                        placeholder="Min Price"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                      />
                      <input
                        type="number"
                        className="p-2 border border-1 border-black rounded-md w-1/2"
                        placeholder="Max Price"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                      />
                    </div>
                  </div>
                </AccordionBody>
              </Accordion>
            </aside>

            <main className="flex-1 max-h-screen overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product, i) => (
                    <div
                      key={i}
                      className="rounded-lg border bg-card hover:shadow-lg hover:border-2 hover:border-[#F6962E] text-card-foreground shadow-sm flex flex-col"
                    >
                      <div className="aspect-square relative">
                        <img
                          src={
                            product.product_images.length > 0
                              ? product.product_images[0].image_upload
                              : "/placeholder.jpg"
                          }
                          alt={product.product_name}
                          className="object-cover w-full h-full aspect-square rounded-t-lg"
                        />
                      </div>
                      <div className="p-4 flex flex-col flex-grow">
                        <h3 className="font-semibold text-lg mb-2 text-center">
                          {product.product_name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 truncate text-center">
                          {product.product_description}
                        </p>
                        <div className="flex justify-between items-center mt-auto">
                          <span className="font-bold">
                            ₱{parseFloat(product.price).toFixed(2)}
                          </span>
                          <Button
                            onClick={() =>
                              navigate(`/product?id=${product.id}`)
                            }
                            className="bg-[#F6962E] text-white"
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No products match the selected categories.</p>
                )}
              </div>
            </main>
          </div>
        </div>
        <Footer />
      </CustomerLayout>
    </>
  );
}
