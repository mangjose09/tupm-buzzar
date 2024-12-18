import React, { useState, useEffect, useMemo } from "react";
import {
  Button,
  Input,
  IconButton,
  Checkbox,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
  Carousel,
} from "@material-tailwind/react";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  XCircleIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import { DefaultPagination } from "../ui/pagination";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import buzzar_api from "../../config/api-config";

const PlaceholderImage = "https://placehold.co/600x400/png";

const VendorProductsTable = ({ products }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  const [filteredProducts, setFilteredProducts] = useState(products);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState([]); // For managing selected rows
  const [openDialog, setOpenDialog] = useState(false); // Dialog state
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null); // Product to delete
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [isApproved, setIsApproved] = useState(false);
  const [approveDialog, setApproveDialog] = useState(false);

  const rowsPerPage = 5;

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      const lowercasedTerm = searchTerm.toLowerCase();
      const filtered = products.filter((product) =>
        product.product_name.toLowerCase().includes(lowercasedTerm)
      );
      setFilteredProducts(filtered);
      setCurrentPage(1); // Reset to the first page when the search term changes
    }, 300); // 300ms delay for debounce

    return () => clearTimeout(debounceTimeout); // Cleanup on component unmount or searchTerm change
  }, [searchTerm, products]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      if (sortConfig.key) {
        if (sortConfig.direction === "asc") {
          return a[sortConfig.key] < b[sortConfig.key] ? -1 : 1;
        } else if (sortConfig.direction === "desc") {
          return a[sortConfig.key] > b[sortConfig.key] ? -1 : 1;
        }
      }
      return 0;
    });
  }, [filteredProducts, sortConfig]);

  const handleSort = (columnKey) => {
    setSortConfig((prevState) => {
      if (prevState.key === columnKey) {
        if (prevState.direction === "asc") {
          return { key: columnKey, direction: "desc" };
        } else if (prevState.direction === "desc") {
          return { key: null, direction: null };
        }
      }
      return { key: columnKey, direction: "asc" };
    });
  };

  // Open the Edit Dialog
  const handleEdit = (product) => {
    setProductToEdit(product);
    setIsApproved(product.is_approved);
    setOpenEditDialog(true);
  };

  const handleSaveEdit = async () => {
    try {
      // You can send the updated is_approved value to the server here if needed
      await buzzar_api.put(`/products/approved/${productToEdit.id}/`, {
        is_approved: isApproved,
      });
      alert(`Successfully updated product approval status.`);
      window.location.reload();
    } catch (error) {
      console.error("Failed to update product:", error);
      alert("Failed to update product. Please try again.");
    } finally {
      setOpenEditDialog(false); // Close the dialog
    }
  };

  const handleApproveSelected = async () => {
    try {
      // Use Promise.all to approve selected products
      await Promise.all(
        selectedProducts.map((id) =>
          buzzar_api.put(`/products/approved/${id}/`, { is_approved: true })
        )
      );

      // Update the filteredProducts state to reflect the approved status
      setFilteredProducts((prev) =>
        prev.map((product) =>
          selectedProducts.includes(product.id)
            ? { ...product, approved: true }
            : product
        )
      );

      // Clear the selected products after approval
      setSelectedProducts([]);

      alert("Successfully approved selected products.");
      window.location.reload();
    } catch (error) {
      console.error("Failed to approve selected products:", error);
      alert("Failed to approve selected products. Please try again.");
    }
  };

  const confirmDelete = (product) => {
    setProductToDelete(product);
    setOpenDialog(true); // Open the dialog
  };

  const handleDelete = async (product) => {
    try {
      await buzzar_api.delete(`/product/details/${product.id}`);
      setFilteredProducts((prev) =>
        prev.filter((item) => item.id !== product.id)
      );
      alert(`Successfully deleted product: ${product.product_name}`);
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Failed to delete product. Please try again.");
    } finally {
      setOpenDialog(false);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(
        selectedProducts.map((id) =>
          buzzar_api.delete(`/product/details/${id}`)
        )
      );
      setFilteredProducts((prev) =>
        prev.filter((product) => !selectedProducts.includes(product.id))
      );
      setSelectedProducts([]);
      alert("Successfully deleted selected products.");
    } catch (error) {
      console.error("Failed to delete selected products:", error);
      alert("Failed to delete selected products. Please try again.");
    }
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };

  const handleSelectAllProducts = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]); // Deselect all if all are selected
    } else {
      setSelectedProducts(filteredProducts.map((product) => product.id)); // Select all
    }
  };

  const totalFilteredProducts = sortedProducts.length;
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(totalFilteredProducts / rowsPerPage);
  const formatPrice = (price) => `₱ ${price.toFixed(2)}`;

  const headers = [
    { key: "product_name", label: "Product Name" },
    { key: "price", label: "Price" },
    { key: "stock_qty", label: "Stock Quantity" },
    { key: "is_approved", label: "Is Approved" },
    { key: "created_at", label: "Created Date" },
    { key: "actions", label: "Actions" },
  ];

  return (
    <section>
      <header className="flex w-full mb-5 items-center justify-between gap-2">
        <div className="w-full sm:w-[250px]">
          <Input
            label="Search Product Name"
            value={searchTerm}
            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="md"
            className="w-auto"
          />
        </div>
        <Button
          onClick={() => setApproveDialog(true)} // Open the delete dialog for selected products
          disabled={selectedProducts.length === 0}
          color="amber"
          size="md"
          className="hidden sm:inline-block"
        >
          Approve Selected
        </Button>
        <IconButton
          color="amber"
          onClick={() => setApproveDialog(true)} // Open the delete dialog for selected products
          disabled={selectedProducts.length === 0}
          className="inline-block sm:hidden"
          size="lg"
          fullWidth
        >
          <CheckBadgeIcon className="h-5 w-5" />
        </IconButton>
        {/* <Button
          onClick={() => setDeleteDialog(true)} // Open the delete dialog for selected products
          disabled={selectedProducts.length === 0}
          color="red"
          size="md"
          className="hidden sm:inline-block"
        >
          Delete Selected
        </Button>
        <IconButton
          color="red"
          onClick={() => setDeleteDialog(true)} // Open the delete dialog for selected products
          disabled={selectedProducts.length === 0}
          className="inline-block sm:hidden"
          size="lg"
          fullWidth
        >
          <TrashIcon className="h-5 w-5" />
        </IconButton> */}
      </header>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-0">
                <Checkbox
                  onChange={handleSelectAllProducts}
                  checked={selectedProducts.length === filteredProducts.length}
                />
              </th>
              {headers.map(({ key, label }) => (
                <th
                  key={key}
                  className={`p-4 text-left hover:bg-gray-600 hover:text-white ${
                    key === "actions" ? "" : "cursor-pointer"
                  }`}
                  onClick={() => key !== "actions" && handleSort(key)}
                >
                  <p className="flex flex-row items-center">
                    <span>{label}</span>
                    {key !== "actions" && sortConfig.key === key && (
                      <span>
                        {sortConfig.direction === "asc" ? (
                          <ChevronDownIcon className="h-4 w-4 inline-block ml-1" />
                        ) : (
                          <ChevronUpIcon className="h-4 w-4 inline-block ml-1" />
                        )}
                      </span>
                    )}
                  </p>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {totalFilteredProducts > 0 ? (
              paginatedProducts.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="p-0">
                    <Checkbox
                      onChange={() => handleSelectProduct(product.id)}
                      checked={selectedProducts.includes(product.id)}
                    />
                  </td>
                  <td className="p-2">
                    <div className="flex items-center w-60">
                      <img
                        src={
                          product.product_images.length > 0
                            ? product.product_images[0].image_upload
                            : PlaceholderImage
                        }
                        alt={
                          product.product_images.length > 0
                            ? product.product_images[0].image_name
                            : "product"
                        }
                        className="hidden md:block w-10 h-10 rounded-full mr-2"
                      />
                      <span className="text-wrap w-auto">
                        {product.product_name}
                      </span>
                    </div>
                  </td>
                  <td className="p-2 w-28">{formatPrice(product.price)}</td>
                  <td className="p-2 w-28">{product.stock_qty}</td>
                  <td className="p-2 w-40">
                    {product.is_approved ? "Yes" : "No"}
                  </td>
                  <td className="p-2 w-40">
                    {new Date(product.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-2 ">
                    <div className="flex items-center justify-center gap-x-2">
                      <IconButton
                        variant="text"
                        onClick={() => handleEdit(product)}
                      >
                        <PencilIcon className="h-5 w-5 text-black" />
                      </IconButton>
                      {/* <IconButton
                        variant="text"
                        onClick={() => confirmDelete(product)} // Open dialog for deletion
                      >
                        <TrashIcon className="h-5 w-5 text-red-500" />
                      </IconButton> */}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headers.length + 1} className="p-4 text-center">
                  <span className="flex items-center gap-x-2 justify-center">
                    <XCircleIcon className="h-5 w-5" />
                    No products found
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalFilteredProducts > 0 && (
        <footer className="flex flex-col-reverse md:flex-row  justify-between items-center mt-4 gap-y-2">
          <div>
            <span className="text-sm text-gray-600">
              Showing {rowsPerPage * (currentPage - 1) + 1} to{" "}
              {Math.min(rowsPerPage * currentPage, totalFilteredProducts)} of{" "}
              {totalFilteredProducts} entries
            </span>
          </div>

          <div className="mt-4 flex justify-center">
            <DefaultPagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
            />
          </div>
        </footer>
      )}

      <Dialog open={openEditDialog} handler={() => setOpenEditDialog(false)}>
        <DialogHeader>Edit Product Details</DialogHeader>
        <DialogBody className="max-h-[60vh] overflow-y-auto">
          {productToEdit && (
            <div className="space-y-4">
              {/* Product Images Carousel */}
              <div>
                <Typography
                  variant="small"
                  color="gray"
                  className="font-semibold"
                >
                  Product Images:
                </Typography>
                {productToEdit.product_images.length > 0 ? (
                  <Carousel
                    autoplay={true}
                    autoplayDelay={3000}
                    loop={true}
                    prevArrow={({ handlePrev }) => (
                      <IconButton
                        variant="text"
                        color="amber"
                        size="lg"
                        onClick={handlePrev}
                        className="!absolute top-2/4 left-4 -translate-y-2/4"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="h-6 w-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                          />
                        </svg>
                      </IconButton>
                    )}
                    nextArrow={({ handleNext }) => (
                      <IconButton
                        variant="text"
                        color="amber"
                        size="lg"
                        onClick={handleNext}
                        className="!absolute top-2/4 !right-4 -translate-y-2/4"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="h-6 w-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                          />
                        </svg>
                      </IconButton>
                    )}
                    navigation={({ setActiveIndex, activeIndex, length }) => (
                      <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
                        {new Array(length).fill("").map((_, i) => (
                          <span
                            key={i}
                            className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${
                              activeIndex === i
                                ? "w-8 bg-[#F6962E]"
                                : "w-4 bg-[#F6962E]/50"
                            }`}
                            onClick={() => setActiveIndex(i)}
                          />
                        ))}
                      </div>
                    )}
                  >
                    {productToEdit.product_images.map((image) => (
                      <div key={image.id}>
                        <img
                          src={image.image_upload}
                          alt={image.image_name}
                          className="object-cover w-full h-56 rounded-lg"
                        />
                      </div>
                    ))}
                  </Carousel>
                ) : (
                  <div className="flex justify-center items-center w-full h-28 bg-gray-200 rounded-lg ">
                    <Typography variant="small">No Images Available</Typography>
                  </div>
                )}
              </div>
              {/* Product Name */}
              <div>
                <Typography
                  variant="small"
                  color="gray"
                  className="font-semibold"
                >
                  Product Name:
                </Typography>
                <Input
                  value={productToEdit.product_name}
                  disabled
                  size="md"
                  className="w-full"
                />
              </div>

              {/* Product Description */}
              <div>
                <Typography
                  variant="small"
                  color="gray"
                  className="font-semibold"
                >
                  Product Description:
                </Typography>
                <Input
                  value={productToEdit.product_description}
                  disabled
                  size="md"
                  className="w-full"
                />
              </div>

              {/* Price */}
              <div>
                <Typography
                  variant="small"
                  color="gray"
                  className="font-semibold"
                >
                  Price:
                </Typography>
                <Input
                  value={productToEdit.price}
                  disabled
                  size="md"
                  className="w-full"
                />
              </div>

              {/* Stock Quantity */}
              <div>
                <Typography
                  variant="small"
                  color="gray"
                  className="font-semibold"
                >
                  Stock Quantity:
                </Typography>
                <Input
                  value={productToEdit.stock_qty}
                  disabled
                  size="md"
                  className="w-full"
                />
              </div>

              {/* Is Approved */}
              <div>
                <Typography
                  variant="small"
                  color="gray"
                  className="font-semibold"
                >
                  Is Approved:
                </Typography>
                <Checkbox
                  checked={isApproved}
                  onChange={() => setIsApproved(!isApproved)}
                />
              </div>

              {/* Variants Section */}
              <div>
                <Typography
                  variant="small"
                  color="gray"
                  className="font-semibold"
                >
                  Variants:
                </Typography>
                {productToEdit.variants && productToEdit.variants.length > 0 ? (
                  productToEdit.variants.map((variant) => (
                    <div key={variant.variant_type} className="space-y-2">
                      <Typography
                        variant="small"
                        color="gray"
                        className="font-medium"
                      >
                        {variant.variant_type}:
                      </Typography>
                      <ul className="list-disc pl-5">
                        {variant.options.map((option) => (
                          <li key={option.id}>
                            <Typography variant="small" color="gray">
                              {option.name}
                            </Typography>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                ) : (
                  <Typography variant="small" color="gray">
                    No variants available.
                  </Typography>
                )}
              </div>
            </div>
          )}
        </DialogBody>
        <DialogFooter className="flex gap-2">
          <Button onClick={handleSaveEdit}>Save Changes</Button>
          <Button variant="outlined" onClick={() => setOpenEditDialog(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog open={approveDialog} handler={() => setApproveDialog(false)}>
        <DialogHeader>Confirm Approval</DialogHeader>
        <DialogBody>
          Are you sure you want to approve the {selectedProducts.length}{" "}
          selected products?
        </DialogBody>
        <DialogFooter className="flex gap-2">
          <Button onClick={handleApproveSelected}>Confirm Approval</Button>
          <Button
            variant="outlined"
            onClick={() => setApproveDialog(false)} // Close dialog without deletion
          >
            Cancel
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Delete Selected Dialog */}
      {/* <Dialog open={deleteDialog} handler={() => setDeleteDialog(false)}>
        <DialogHeader>Confirm Deletion</DialogHeader>
        <DialogBody>
          Are you sure you want to delete the {selectedProducts.length} selected
          products?
        </DialogBody>
        <DialogFooter className="flex gap-2">
          <Button color="red" onClick={handleDeleteSelected}>
            Confirm Delete
          </Button>
          <Button
            variant="outlined"
            onClick={() => setDeleteDialog(false)} // Close dialog without deletion
          >
            Cancel
          </Button>
        </DialogFooter>
      </Dialog> */}

      {/* Confirmation Dialog */}
      {/* <Dialog open={openDialog} handler={() => setOpenDialog(false)}>
        <DialogHeader>Confirm Deletion</DialogHeader>
        <DialogBody>
          Are you sure you want to delete the product:{" "}
          {productToDelete?.product_name}?
        </DialogBody>
        <DialogFooter className="flex gap-2">
          <Button
            color="red"
            onClick={() => {
              handleDelete(productToDelete); // Call handleDelete with the selected product ID
            }}
          >
            Confirm Delete
          </Button>
          <Button
            variant="outlined"
            onClick={() => setOpenDialog(false)} // Close dialog without deletion
          >
            Cancel
          </Button>
        </DialogFooter>
      </Dialog> */}
    </section>
  );
};

export default VendorProductsTable;
