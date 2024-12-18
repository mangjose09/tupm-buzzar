import React from "react";
import { Typography, Card } from "@material-tailwind/react";

const FeaturedStores = () => {
  // Sample data for featured stores
  const stores = [
    {
      id: 1,
      name: "TUP GEAR",
      description: "Latest electronics and gadgets at unbeatable prices.",
      img: "https://via.placeholder.com/100x100?text=Tech+Haven",
    },
    {
      id: 2,
      name: "TUP Ukay-ukay",
      description: "Trendy fashion and accessories for every occasion.",
      img: "https://via.placeholder.com/100x100?text=Fashion+Hub",
    },
    {
      id: 3,
      name: "TUP Decors",
      description: "Top-quality home goods and decor items.",
      img: "https://via.placeholder.com/100x100?text=Home+Essentials",
    },
    {
      id: 4,
      name: "TUP Beauty Care",
      description: "All-natural beauty products and skincare.",
      img: "https://via.placeholder.com/100x100?text=Beauty+Bliss",
    },
  ];

  return (
    <section>
      <div className="container mx-auto">
        {/* Section Title */}
        <Typography variant="h4" className="text-[#F6911C] text-center mb-8">
          Featured Stores
        </Typography>

        {/* Stores Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {stores.map((store) => (
            <Card key={store.id} className="p-6 flex flex-col items-center">
              {/* Store Image */}
              <img
                src={store.img}
                alt={store.name}
                className="w-24 h-24 mb-4 object-cover rounded-full"
              />
              {/* Store Name */}
              <Typography variant="h6" className="mb-2">
                {store.name}
              </Typography>
              {/* Store Description */}
              <Typography className="text-center text-gray-600">
                {store.description}
              </Typography>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedStores;
