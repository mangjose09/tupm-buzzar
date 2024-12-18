import React from "react";
import { Button } from "@material-tailwind/react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-muted overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Welcome to Buzzar
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Discover amazing products at unbeatable prices. Start shopping now
              and experience the ease of online shopping.
            </p>
          </div>
          <div className="space-x-4">
            <Button className="bg-[#F6962E]">
              <Link to="/shop">Shop Now </Link>
            </Button>
            <Button variant="outline">
              <Link to="/about-us">Learn More </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Honeycomb shapes */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Honeycomb 1 */}
        <div
          className="absolute top-10 left-10 w-24 h-24 bg-[#F6962E] opacity-30 rounded-full filter blur-xl animate-float"
          style={{
            clipPath:
              "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          }}
        ></div>

        {/* Honeycomb 2 */}
        <div
          className="absolute top-1/3 right-10 w-36 h-36 bg-[#F6962E] opacity-60 rounded-full filter blur-md"
          style={{
            clipPath:
              "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          }}
        ></div>

        {/* Honeycomb 3 */}
        <div
          className="absolute bottom-10 left-20 w-28 h-28 bg-[#F6A43E] opacity-40 rounded-full filter blur-sm animate-float-slow"
          style={{
            clipPath:
              "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          }}
        ></div>

        {/* Honeycomb 4 */}
        <div
          className="absolute top-1/4 left-1/3 w-20 h-20 bg-[#F6A43E] opacity-50 rounded-full filter blur-sm"
          style={{
            clipPath:
              "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          }}
        ></div>

        {/* Honeycomb 5 */}
        <div
          className="absolute bottom-10 right-1/4 w-40 h-40 bg-[#F6962E] opacity-70 rounded-full filter blur-lg animate-float"
          style={{
            clipPath:
              "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          }}
        ></div>

        {/* Honeycomb 6 */}
        <div
          className="absolute top-5 right-1/3 w-16 h-16 bg-[#F6A43E] opacity-60 rounded-full filter blur-md"
          style={{
            clipPath:
              "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          }}
        ></div>
      </div>
    </section>
  );
};

export default Hero;
