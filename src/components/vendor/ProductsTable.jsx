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
} from "@material-tailwind/react";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { DefaultPagination } from "../ui/pagination";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import buzzar_api from "../../config/api-config";

const PlaceholderImage = "https://placehold.co/600x400/png";

const ProductsTable = ({ products }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  console.log("THE PRODUCTS ARE", products);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState([]); // For managing selected rows
  const [openDialog, setOpenDialog] = useState(false); // Dialog state
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null); // Product to delete
  const rowsPerPage = 5;

  console.log("The selected products are", selectedProducts);

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

  const handleEdit = (product) => {
    console.log("Edit product:", product);

    navigate(`/vendor/products/edit/${product.id}`);
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
      setDeleteDialog(false);
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
            size="lg"
            className="w-auto"
          />
        </div>
        <Button
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
        </IconButton>
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
                      <IconButton
                        variant="text"
                        onClick={() => confirmDelete(product)} // Open dialog for deletion
                      >
                        <TrashIcon className="h-5 w-5 text-red-500" />
                      </IconButton>
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

      {/* Delete Selected Dialog */}

      <Dialog open={deleteDialog} handler={() => setDeleteDialog(false)}>
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
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} handler={() => setOpenDialog(false)}>
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
      </Dialog>
    </section>
  );
};

export default ProductsTable;
