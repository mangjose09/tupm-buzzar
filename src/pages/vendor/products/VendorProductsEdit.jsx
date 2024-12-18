import VendorSideBar from "../../../components/VendorSideBar";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  Typography,
  Breadcrumbs,
  Select,
  Option,
  Input,
  Textarea,
  Alert,
  Card,
  CardBody,
  IconButton,
} from "@material-tailwind/react";
import { useAuth } from "../../../context/authContext";
import buzzar_api from "../../../config/api-config";
import {
  QuestionMarkCircleIcon,
  ArchiveBoxXMarkIcon,
  MinusCircleIcon,
} from "@heroicons/react/24/outline";
const generateRandomString = (length = 5) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const VendorProductsEdit = () => {
  const { productId } = useParams(); // Get the productId from the route parameters
  const [existingVariants, setExistingVariants] = useState([]);
  const { categories, vendorData } = useAuth();
  const [variants, setVariants] = useState([
    {
      variant_type: "",
      options: [
        {
          name: "",
          variant_price: null, // Add initial variant price
        },
      ],
    },
  ]);
  const [formValues, setFormValues] = useState({
    category1: "",
    category2: "",
    name: "",
    description: "",
    price: "",
    stock: "",
  });
  const [errors, setErrors] = useState({});
  const [productImages, setProductImages] = useState([]);
  const [imageError, setImageError] = useState("");
  const [droppedFiles, setDroppedFiles] = useState([]);
  const [deletedImageIds, setDeletedImageIds] = useState([]);
  const [existingCategories, setExistingCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isProductAvailable, setIsProductAvailable] = useState(true);

  console.log("The existing variants are", existingVariants);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await buzzar_api.get(`/product/details/${productId}/`);
        const product = response.data;

        // Extracting categories and converting IDs to strings
        const category1 = product.categories[0]?.category_name || ""; // First category ID as string
        const category2 = product.categories[1]?.category_name || ""; // Second category ID as string if exists

        const extractedVariants = product.variants.map((variant) => ({
          id: variant.id, // Including the variant id
          variant_type: variant.variant_type, // Keeping the structure
          options: variant.options.map((option) => ({
            id: option.id, // Including the option id
            name: option.name, // Keeping option name
            variant_price: option.variant_price, // Including the variant price
          })),
        }));

        setExistingCategories(product.categories);
        // Setting form values
        setFormValues({
          category1: category1,
          category2: category2, // Can be empty if no second category
          name: product.product_name,
          description: product.product_description,
          price: product.price,
          stock: product.stock_qty.toString(),
        });

        // Setting variants with the correct structure
        if (extractedVariants.length > 0) {
          setExistingVariants(extractedVariants);
        }

        if (product.product_images.length > 0) {
          setProductImages(product.product_images); // Save product_images array as it is
        }
      } catch (error) {
        console.error("Failed to fetch product data:", error);
        setIsProductAvailable(false);
      }
    };

    fetchProductData();
  }, [productId]);

  const handleDrop = (e) => {
    e.preventDefault();
    handleFileChange("images", e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Prevent default behavior (Prevent file from being opened)
  };

  const handleFileChange = (field, files) => {
    const MAX_FILE_SIZE = 1 * 1024 * 1024; // 5 MB in bytes

    const validFiles = Array.from(files).filter((file) => {
      if (!file.type.startsWith("image/")) {
        setImageError("Please upload valid image files.");
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        setImageError(
          `File size must not exceed ${MAX_FILE_SIZE / (1024 * 1024)} MB.`
        );
        return false;
      }
      return true;
    });

    if (validFiles.length) {
      setImageError(""); // Clear error if valid files are found
    }
    setDroppedFiles(validFiles);
  };
  const validateField = (field, value) => {
    let error = "";

    if (field === "category1" && !value.trim()) {
      error = "This field is required.";
    } else if ((field === "name" || field === "description") && !value.trim()) {
      error = "This field is required.";
    } else if (field === "price" && Number(value) <= 0) {
      error = "Price must be greater than zero.";
    } else if (field === "stock") {
      if (value.trim() === "") {
        error = "This field is required.";
      } else if (!/^[0-9]+$/.test(value)) {
        // Check for whole numbers
        error = "Stock must be a whole number.";
      } else if (Number(value) <= 0) {
        error = "Stock must be greater than zero.";
      }
    } else if (field === "category2" && value.trim() && formValues.category1) {
      if (formValues.category1 === value) {
        error = "Both categories must not be the same.";
      }
    }

    return error;
  };

  // Updated handleBlur function to apply new validation
  const handleBlur = (field, value) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: validateField(field, value),
    }));
  };

  // Restrict input to positive numbers only in handleChange
  const handleChange = (field, value) => {
    if ((field === "price" || field === "stock") && value < 0) return;
    setFormValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };

  // Add a new variant with initial structure
  const addVariant = () => {
    setVariants([
      ...variants,
      { variant_type: "", options: [{ name: "", variant_price: null }] },
    ]);
  };

  // Handle removing a variant type
  const removeVariant = (index) => {
    const updatedVariants = [...variants];
    updatedVariants.splice(index, 1);
    setVariants(updatedVariants);
  };

  // Handle adding options to a variant
  const addOption = (variantIndex) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].options.push({
      name: "",
      variant_price: null,
    });
    setVariants(updatedVariants);
  };

  // Handle removing an option
  const removeOption = (variantIndex, optionIndex) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].options.splice(optionIndex, 1);
    setVariants(updatedVariants);
  };

  const removeExistingVariant = async (variantId) => {
    try {
      const response = await buzzar_api.delete(`/product/variant/${variantId}`);

      if (response.status === 204) {
        // Remove the variant from state
        setExistingVariants((prevVariants) =>
          prevVariants.filter((variant) => variant.id !== variantId)
        );

        // Alert for success
        alert("Variant deleted successfully");
      } else {
        console.error("Failed to delete variant");
      }
    } catch (error) {
      console.error(`Error deleting variant: ${error}`, error);
    }
  };

  // Handle input changes for variants
  const handleVariantChange = (variantIndex, field, value) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex][field] = value;
    setVariants(updatedVariants);
  };

  // Handle option input changes (name and variant_price)
  const handleOptionChange = (variantIndex, optionIndex, field, value) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].options[optionIndex][field] = value;
    setVariants(updatedVariants);
  };

  const handleDeleteImage = (index) => {
    const imageToDelete = productImages[index];
    const updatedImages = productImages.filter((_, i) => i !== index);

    setProductImages(updatedImages);
    setDeletedImageIds((prevIds) => [...prevIds, imageToDelete.id]);
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate each field in formValues
    for (const field in formValues) {
      newErrors[field] = validateField(field, formValues[field]);
    }

    // Check for image upload validation
    // const imageErrorMsg = droppedFiles.length
    //   ? ""
    //   : "Please upload at least one image.";
    // setImageError(imageErrorMsg); // Set image error state

    // Set errors to the state
    setErrors(newErrors);
    const isValid = Object.values(newErrors).every((error) => !error);

    // Check if any field has an error and also check imageError
    // const isValid =
    //   Object.values(newErrors).every((error) => !error) && !imageErrorMsg;

    return isValid; // Return the overall validation status
  };

  const handleSubmit = async () => {
    if (!validateForm()) return; // Early return if the form is invalid

    setLoading(true); // Optional: Set loading state to true

    try {
      const updatePromises = []; // Array to hold update promises

      // Retrieve initial category names for comparison
      const initialCategory1 = existingCategories[0]?.category_name;
      const initialCategory2 = existingCategories[1]?.category_name;

      // Check if formValues.category1 has changed
      if (formValues.category1 !== initialCategory1) {
        const category1Id = existingCategories[0]?.id; // Get ID for category1

        if (category1Id) {
          const updatedData1 = { category_name: formValues.category1 };
          updatePromises.push(updateCategory(category1Id, updatedData1));
        }
      }

      // Check if formValues.category2 has changed
      if (formValues.category2 !== initialCategory2) {
        const category2Id = existingCategories[1]?.id; // Get ID for category2
        if (category2Id) {
          const updatedData2 = { category_name: formValues.category2 };
          updatePromises.push(updateCategory(category2Id, updatedData2));
        }
      }

      // Await all category updates if there are any
      await Promise.all(updatePromises);

      await updateProduct();
      // Check if variants are not empty and do not contain empty strings
      const isVariantsValid = variants.every((variant) =>
        variant.options.every(
          (option) =>
            option.name.trim() !== "" && option.variant_price.trim() !== ""
        )
      );

      if (isVariantsValid) {
        await submitVariants(); // Call this only if variants are valid
      } 
      await deleteImages(); // Delete flagged images
      await uploadImages();

      alert("Successful product update");
      window.location.reload();
    } catch (error) {
      console.error("An error occurred during submission:", error.message);
      alert(`An error occurred: ${error.message || "Please try again."}`);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const submitVariants = async () => {
    try {
      // Step 1: Iterate over all variants and their options to create variant options.
      const variantOptionsPromises = variants.flatMap((variant) =>
        variant.options.map((option) =>
          buzzar_api.post("/product/variant/option/", {
            name: option.name,
            variant_price: option.variant_price,
          })
        )
      );

      // Step 2: Await all promises to resolve and collect responses.
      const variantOptionsResponses = await Promise.all(variantOptionsPromises);

      // Step 3: Group the variant option IDs by variant_type.
      const variantOptionsByType = {};
      let optionIndex = 0;
      for (const variant of variants) {
        const optionIds = variant.options.map(() => {
          const response = variantOptionsResponses[optionIndex++];
          return response.data.id;
        });
        variantOptionsByType[variant.variant_type] = optionIds;
      }

      // Step 4: Submit each variant type with its associated option IDs.
      const createVariantPromises = Object.entries(variantOptionsByType).map(
        ([variantType, optionIds]) =>
          buzzar_api.post("/product/variant/create/", {
            product: productId,
            variant_type: variantType,
            variant_option_ids: optionIds,
          })
      );

      const createVariantResponses = await Promise.all(createVariantPromises);

      // Step 5: Check if all variants were successfully created.
      if (
        !createVariantResponses.every((response) => response.status === 201)
      ) {
        throw new Error("Failed to submit one or more variants");
      }

      console.log("Variants submitted successfully!");
    } catch (error) {
      console.error("Error submitting variants:", error);
      throw error;
    }
  };

  const updateCategory = async (categoryId, updatedData) => {
    try {
      const response = await buzzar_api.put(
        `/product/category/${categoryId}/`,
        updatedData
      );
      return response.data; // Return the response data if needed
    } catch (error) {
      console.error("Error updating category:", error.message);
      throw new Error("Could not update category. Please try again."); // Optionally throw an error to be caught in handleSubmit
    }
  };

  const updateProduct = async () => {
    const requestBody = {
      vendor: vendorData.vendor_id,
      product_name: formValues.name,
      product_description: formValues.description,
      price: formValues.price,
      stock_qty: formValues.stock,
    };

    const response = await buzzar_api.put(
      `/product/details/${productId}/`,
      requestBody
    );

    if (response.status !== 200) {
      throw new Error("Failed to update product details");
    }
  };

  const deleteImages = async () => {
    const deletePromises = deletedImageIds.map(async (imageId) => {
      const response = await buzzar_api.delete(`/product/image/${imageId}/`);
      if (response.status !== 204) {
        // Assuming 204 No Content indicates success
        throw new Error(`Failed to delete image with ID: ${imageId}`);
      }
    });

    // Wait for all delete requests to complete
    await Promise.all(deletePromises);
  };

  const uploadImages = async () => {
    const imageUploadPromises = droppedFiles.map((file) => {
      const formData = new FormData();
      const randomString = generateRandomString();
      const fileExtension = file.name.split(".").pop();

      formData.append("image_upload", file);
      formData.append("product", productId); // Assuming productId is used as product ID
      formData.append(
        "image_name",
        `${formValues.name}_${randomString}.${fileExtension}`
      );

      return buzzar_api.post("/products/images/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    });

    const responses = await Promise.all(imageUploadPromises);
    if (!responses.every((response) => response.status === 201)) {
      throw new Error("Failed to upload one or more images");
    }
  };

  return (
    <main className="flex flex-col lg:flex-row min-h-screen">
      <VendorSideBar />
      <div className="flex flex-col w-full p-6 md:p-10">
        <header>
          <Breadcrumbs fullWidth className="bg-white text-left px-0">
            <a href="/vendor/products">Products</a>
            <a
              href="/vendor/products/add"
              className="text-[#F8B34B] font-semibold"
              disabled
            >
              Edit Existing Product
            </a>
          </Breadcrumbs>
          <Typography variant="h1">Edit Product</Typography>
          <Typography variant="paragraph">
            Enter the details of your product
          </Typography>
        </header>
        {isProductAvailable ? (
          <>
            <article className="mt-10 grid grid-cols-2 gap-2">
              {/* Product Categories */}
              <section className="col-span-2 flex flex-col gap-y-1">
                <Typography variant="lead">
                  Product Category (Up to two)
                </Typography>
                <div className="grid grid-cols-2 gap-2">
                  {["category1", "category2"].map((field, index) => (
                    <div
                      key={field}
                      className="w-full col-span-2 md:col-span-1"
                    >
                      <Select
                        label={`Select Category ${index + 1}`}
                        onBlur={() => handleBlur(field, formValues[field])}
                        error={errors[field]}
                        value={formValues[field]}
                        onChange={(value) => handleChange(field, value)}
                      >
                        {categories.map((categ) => (
                          <Option key={categ.value} value={categ.value}>
                            {categ.label}
                          </Option>
                        ))}
                      </Select>
                      {errors[field] && (
                        <Typography variant="small" color="red">
                          {errors[field]}
                        </Typography>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Product Name */}
              <section className="col-span-2 flex flex-col gap-y-1">
                <Typography variant="lead">Product Name</Typography>
                <Input
                  label="Enter name"
                  onBlur={(e) => handleBlur("name", e.target.value)}
                  error={errors.name}
                  value={formValues.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
                {errors.name && (
                  <Typography variant="small" color="red">
                    {errors.name}
                  </Typography>
                )}
              </section>

              {/* Product Description */}
              <section className="col-span-2 flex flex-col gap-y-1">
                <Typography variant="lead">Product Description</Typography>
                <Textarea
                  label="Enter description"
                  onBlur={(e) => handleBlur("description", e.target.value)}
                  error={errors.description}
                  value={formValues.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                />
                {errors.description && (
                  <Typography variant="small" color="red">
                    {errors.description}
                  </Typography>
                )}
              </section>

              {/* Price and Stock Quantity */}
              <section className="col-span-2 md:col-span-1 flex flex-col gap-y-1">
                <Typography variant="lead">Price (Phil. Peso)</Typography>
                <Input
                  icon={<span>₱</span>}
                  label="Enter amount"
                  type="number"
                  min="0"
                  onBlur={(e) => handleBlur("price", e.target.value)}
                  error={errors.price}
                  value={formValues.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                />
                {errors.price && (
                  <Typography variant="small" color="red">
                    {errors.price}
                  </Typography>
                )}
              </section>
              <section className="col-span-2 md:col-span-1 flex flex-col gap-y-1">
                <Typography variant="lead">Stock Quantity</Typography>
                <Input
                  label="Enter stock quantity"
                  type="number"
                  min="0"
                  onBlur={(e) => handleBlur("stock", e.target.value)}
                  error={errors.stock}
                  value={formValues.stock}
                  onChange={(e) => handleChange("stock", e.target.value)}
                />
                {errors.stock && (
                  <Typography variant="small" color="red">
                    {errors.stock}
                  </Typography>
                )}
              </section>

              <section className="col-span-2 flex flex-col gap-y-1">
                <Typography variant="lead">Product Images</Typography>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-2 shadow-md p-4 rounded-md">
                  {productImages.length > 0 ? (
                    productImages.map((image, index) => (
                      <figure key={index} className="relative">
                        <img
                          src={image.image_upload}
                          alt={image.image_name}
                          className="w-full h-[200px]"
                        />
                        <figcaption className="absolute right-2 bottom-2 ">
                          <Button
                            color="red"
                            size="sm"
                            onClick={() => handleDeleteImage(index)}
                          >
                            Delete
                          </Button>
                        </figcaption>
                      </figure>
                    ))
                  ) : (
                    <Alert variant="ghost" className="col-span-full">
                      <span>No images available for this product.</span>
                    </Alert>
                  )}
                </div>
              </section>

              <section className="col-span-2 flex flex-col gap-y-1">
                <Typography variant="lead">Upload Product Images</Typography>
                <div
                  className={`flex flex-col items-center justify-center border-2 border-dashed ${
                    imageError ? "border-red-500 " : "border-gray-400"
                  }  rounded-md p-6 text-center cursor-pointer hover:bg-gray-100`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => document.getElementById("file-input").click()} // Trigger file input
                >
                  <input
                    type="file"
                    id="file-input"
                    multiple
                    accept="image/jpeg, image/png, image/gif"
                    onChange={(e) => handleFileChange("images", e.target.files)}
                    className="hidden" // Hide the default file input
                    onBlur={() => handleFileChange("images", e.target.files)} // Validate on blur if needed
                  />
                  <Typography variant="paragraph" className="text-gray-500">
                    Drag and drop images here, or click to select files
                    <br />1 MB max size per file.
                  </Typography>
                  {droppedFiles.length > 0 && (
                    <ul className="mt-2">
                      {Array.from(droppedFiles).map((file, index) => (
                        <li key={index} className="text-sm text-gray-700">
                          {file.name}
                        </li>
                      ))}
                    </ul>
                  )}
                  <Typography variant="small" className="text-gray-500">
                    (JPEG, PNG, GIF) (1.00 Mb Max)
                  </Typography>
                </div>
                {imageError && (
                  <Typography variant="small" color="red">
                    {imageError}
                  </Typography>
                )}

                <div className="mt-5">
                  {droppedFiles.length > 0 && (
                    <>
                      <Typography variant="paragraph">Image Preview</Typography>

                      <ul className="flex gap-5 border p-5 rounded-md shadow-md flex-wrap">
                        {Array.from(droppedFiles).map((file, index) => (
                          <li key={index} className="text-sm text-gray-700">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="w-20 h-20 object-contain"
                            />
                            {file.name}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </section>
              {/* Product Variants */}
              <section className="col-span-2 flex flex-col gap-y-2 mt-6">
                <section className="col-span-2 flex flex-col gap-y-2 mt-6">
                  <div className="flex items-center justify-between p-0">
                    <Typography variant="lead">
                      Existing Product Variants
                    </Typography>
                  </div>

                  {/* Existing Variants (Read-Only with Delete Option) */}
                  {existingVariants.map((variant, variantIndex) => (
                    <div
                      key={variant.id}
                      className="shadow-md p-4 rounded-md space-y-2"
                    >
                      <div className="flex gap-2 mb-5">
                        <span className="w-3/4">
                          {/* Display variant type in read-only mode */}
                          <p>
                            <Typography className="text-xs font-semibold">
                              Variant Type
                            </Typography>
                            <Input
                              label="Variant Type"
                              value={variant.variant_type}
                              readOnly
                              disabled
                            />
                          </p>
                        </span>

                        {/* Remove variant button */}
                        <span className="hidden md:block w-1/4">
                          <Button
                            color="red"
                            onClick={() => removeExistingVariant(variant.id)} // Use variant ID for deletion
                            fullWidth
                            variant="outlined"
                          >
                            Remove Variant
                          </Button>
                        </span>
                        <span className="flex md:hidden w-1/4 justify-center ">
                          <IconButton
                            color="red"
                            onClick={() => removeExistingVariant(variant.id)} // Use variant ID for deletion
                            variant="outlined"
                          >
                            <ArchiveBoxXMarkIcon className="w-5 h-5" />
                          </IconButton>
                        </span>
                      </div>

                      {/* Display options within each variant */}
                      {variant.options.map((option, optionIndex) => (
                        <div key={option.id} className="flex gap-2">
                          <section className="w-3/4 grid md:grid-cols-2 gap-1">
                            {/* Display option name and price in read-only mode */}
                            <p>
                              <Typography className="text-xs font-semibold">
                                Option Name
                              </Typography>
                              <Input
                                label="Option Name"
                                value={option.name}
                                readOnly
                                disabled
                              />
                            </p>
                            <p>
                              <Typography className="text-xs font-semibold">
                                Variant Price
                              </Typography>
                              <Input
                                label="Variant Price"
                                type="number"
                                value={option.variant_price || ""}
                                readOnly
                                disabled
                              />
                            </p>
                          </section>
                        </div>
                      ))}
                    </div>
                  ))}
                </section>

                <div className="flex items-center justify-between p-0">
                  <Typography variant="lead">Product Variants</Typography>
                  <Button onClick={addVariant}>Add New Variant</Button>
                </div>
                {variants.map((variant, variantIndex) => (
                  <div
                    key={variantIndex}
                    className="shadow-md p-4 rounded-md space-y-2"
                  >
                    <div className="flex gap-2 mb-5">
                      <span className="w-3/4">
                        <Input
                          label="Variant Type"
                          value={variant.variant_type}
                          onChange={(e) =>
                            handleVariantChange(
                              variantIndex,
                              "variant_type",
                              e.target.value
                            )
                          }
                        />
                      </span>
                      <span className="hidden md:block w-1/4">
                        <Button
                          color="red"
                          onClick={() => removeVariant(variantIndex)}
                          fullWidth
                          variant="outlined"
                        >
                          Remove Variant
                        </Button>
                      </span>
                      <span className="flex md:hidden w-1/4 justify-center ">
                        <IconButton
                          color="red"
                          onClick={() => removeVariant(variantIndex)}
                          variant="outlined"
                        >
                          <ArchiveBoxXMarkIcon className="w-5 h-5" />
                        </IconButton>
                      </span>
                    </div>
                    {variant.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex gap-2">
                        <section className="w-3/4 grid md:grid-cols-2 gap-1">
                          <Input
                            label="Option Name"
                            value={option.name}
                            onChange={(e) =>
                              handleOptionChange(
                                variantIndex,
                                optionIndex,
                                "name",
                                e.target.value
                              )
                            }
                          />
                          <Input
                            label="Variant Price"
                            type="number"
                            value={option.variant_price || ""}
                            onChange={(e) =>
                              handleOptionChange(
                                variantIndex,
                                optionIndex,
                                "variant_price",
                                e.target.value
                              )
                            }
                          />
                        </section>
                        <span className="hidden md:block w-1/4">
                          <Button
                            color="red"
                            variant="gradient"
                            fullWidth
                            onClick={() =>
                              removeOption(variantIndex, optionIndex)
                            }
                          >
                            Remove Option
                          </Button>
                        </span>
                        <span className="flex md:hidden w-1/4 justify-center ">
                          <IconButton
                            color="red"
                            variant="gradient"
                            onClick={() =>
                              removeOption(variantIndex, optionIndex)
                            }
                          >
                            <MinusCircleIcon className="w-5 h-5" />
                          </IconButton>
                        </span>
                      </div>
                    ))}
                    <Button
                      size="sm"
                      color="amber"
                      variant="text"
                      onClick={() => addOption(variantIndex)}
                    >
                      Add Option
                    </Button>
                  </div>
                ))}
              </section>
              <section className="col-span-2 mt-6">
                <Button
                  onClick={handleSubmit}
                  fullWidth
                  loading={loading}
                  className="flex justify-center"
                >
                  {loading ? (
                    <span>Updating...</span> // Show a loading message or spinner
                  ) : (
                    "Update Product"
                  )}
                </Button>
                {Object.values(errors).some((error) => error) && (
                  <Typography
                    variant="small"
                    color="red"
                    className="mt-2 flex w-full justify-center text-center"
                  >
                    Please correct the highlighted fields before submitting.
                  </Typography>
                )}
              </section>
            </article>
          </>
        ) : (
          <>
            <article className="flex mt-10 w-full">
              <Card className="w-full text-center bg-[#FDF6E9]">
                <CardBody>
                  <Typography
                    variant="h4"
                    className="flex flex-col justify-center items-center gap-2"
                  >
                    <QuestionMarkCircleIcon className="w-20 h-20" />
                    No Product Existing with this ID
                  </Typography>
                </CardBody>
              </Card>
            </article>
          </>
        )}
      </div>
    </main>
  );
};

export default VendorProductsEdit;
