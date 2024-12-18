import React from "react";

const BrandImage = () => {
  return (
    <div className="hidden lg:flex h-full w-full items-center justify-center">
      <img
        className="h-3/4 w-3/4 object-cover object-center "
        src="/BUZZAR_BRAND_LOGO.png"
        alt="nature image"
      />
      {/* <img
        className="h-1/2 w-1/2  object-fill object-left"
        src="/BUZZAR_BRAND_NAME.png"
        alt="buzzar branding"
      /> */}
    </div>
  );
};

export default BrandImage;
