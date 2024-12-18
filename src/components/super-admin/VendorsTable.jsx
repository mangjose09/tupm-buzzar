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
import buzzar_api from "../../config/api-config";
import { useNavigate } from "react-router-dom";

const VendorsTable = ({ vendors }) => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [filteredVendors, setFilteredVendors] = useState(vendors);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      const lowercasedTerm = searchTerm.toLowerCase();
      const filtered = vendors.filter((vendor) =>
        vendor.user_email.toLowerCase().includes(lowercasedTerm)
      );
      setFilteredVendors(filtered);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(debounceTimeout); // Cleanup on component unmount or searchTerm change
  }, [searchTerm, vendors]);

  const sortedVendors = useMemo(() => {
    return [...filteredVendors].sort((a, b) => {
      if (sortConfig.key) {
        if (sortConfig.direction === "asc") {
          return a[sortConfig.key] < b[sortConfig.key] ? -1 : 1;
        } else if (sortConfig.direction === "desc") {
          return a[sortConfig.key] > b[sortConfig.key] ? -1 : 1;
        }
      }
      return 0;
    });
  }, [filteredVendors, sortConfig]);

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

  const handleViewVendor = (vendor) => {
    console.log("View vendor:", vendor);
    navigate(`/admin/vendor-profile/${vendor.user}`);
  };

  const totalFilteredVendors = sortedVendors.length;
  const paginatedVendors = sortedVendors.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(totalFilteredVendors / rowsPerPage);

  const headers = [
    { key: "vendor_id", label: "Vendor ID" },
    { key: "user_email", label: "Email" },
    { key: "store_name", label: "Store Name" },
    { key: "is_approved", label: "Approval Status" },
    { key: "actions", label: "Actions" },
  ];

  return (
    <section>
      <header className=" w-full sm:w-[250px] mb-5 ">
        <Input
          label="Search Email"
          value={searchTerm}
          icon={<MagnifyingGlassIcon className="h-5 w-5" />}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="lg"
          className="w-auto"
        />
      </header>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100 border-b">
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
            {totalFilteredVendors > 0 ? (
              paginatedVendors.map((vendor) => (
                <tr
                  key={vendor.vendor_id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-2 w-20">{vendor.vendor_id}</td>
                  <td className="p-2 w-60">{vendor.user_email}</td>
                  <td className="p-2 w-60">
                    {vendor.store_name || "No Store Name"}
                  </td>
                  <td className="p-2 w-40">
                    {vendor.is_approved ? "Approved" : "Pending"}
                  </td>
                  <td className="p-2 w-10">
                    <div className="flex items-center justify-center gap-x-2">
                      <IconButton
                        variant="text"
                        onClick={() => handleViewVendor(vendor)}
                      >
                        <PencilIcon className="h-5 w-5 text-black" />
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
                    No vendors found
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalFilteredVendors > 0 && (
        <div className="mt-4 flex justify-center">
          <DefaultPagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        </div>
      )}
    </section>
  );
};

export default VendorsTable;
