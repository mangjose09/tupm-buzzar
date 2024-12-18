import React, { useState, useEffect } from "react";
import VendorSideBar from "../../components/VendorSideBar";
import { Button, Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import buzzar_api from "../../config/api-config";
import ProductsTable from "../../components/vendor/ProductsTable";
const VendorProducts = () => {
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await buzzar_api.get("/products/list/owned/");
        const productsWithNumberPrice = response.data
          .map((product) => ({
            ...product,
            price: parseFloat(product.price), // Convert price to a number
          }))
          .sort((a, b) => b.id - a.id);

        setProductList(productsWithNumberPrice);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []); // <-- Add empty dependency array to run only once on mount

  return (
    <>
      <main className="flex flex-col lg:flex-row min-h-screen">
        <VendorSideBar />
        <section className="flex flex-col w-full p-6 md:p-10">
          <header>
            <Typography variant="h1">Products</Typography>
            <Typography variant="paragraph">
              Welcome to your products
            </Typography>
          </header>
          <article className="mt-10">
            <div className="flex justify-end">
              <Link to="/vendor/products/add">
                <Button variant="filled">Add New Product</Button>
              </Link>
            </div>
            <div className="mt-5">
              <ProductsTable products={productList} />
            </div>
          </article>
        </section>
      </main>
    </>
  );
};

export default VendorProducts;
