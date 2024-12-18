"use client";

import { useState } from "react";

const ProductImageGallery = ({ images = [] }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [hoveredImage, setHoveredImage] = useState(null);

  if (!Array.isArray(images) || images.length === 0) {
    return <p>No images available</p>;
  }

  const nextImage = () => {
    setSelectedImage((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  console.log("Images:", images);

  return (
    <div className="flex gap-4">
      {/* Thumbnail buttons */}
      <div className="flex flex-col gap-4">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            onMouseEnter={() => setHoveredImage(index)}
            onMouseLeave={() => setHoveredImage(null)}
            className={`relative aspect-square w-20 overflow-hidden rounded-lg border-2 hover:ring-2 hover:ring-[#F6962E] ${
              selectedImage === index
                ? "border-primary ring-2 ring-[#F6962E]"
                : "border-gray-300"
            }`}
          >
            <img
              src={image.image_upload}
              alt={`Product Image ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main image carousel */}
      <div className="relative w-full">
        <div className="relative aspect-square min-w-[200px] overflow-hidden rounded-lg">
          <img
            src={
              images[hoveredImage !== null ? hoveredImage : selectedImage]
                .image_upload
            }
            alt="Product Image"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevImage}
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-gray-800 bg-opacity-50 p-2 text-white hover:bg-opacity-75"
        >
          &#8592;
        </button>
        <button
          onClick={nextImage}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-gray-800 bg-opacity-50 p-2 text-white hover:bg-opacity-75"
        >
          &#8594;
        </button>
      </div>
    </div>
  );
};

export default ProductImageGallery;
