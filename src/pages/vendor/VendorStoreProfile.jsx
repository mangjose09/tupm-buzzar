import React, { useState } from "react";
import VendorSideBar from "../../components/VendorSideBar";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Input,
  Chip,
} from "@material-tailwind/react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../context/authContext";
import buzzar_api from "../../config/api-config";

const VendorStoreProfile = () => {
  const { vendorData } = useAuth();

  const [formData, setFormData] = useState({
    store_name: vendorData.store_name || "",
    store_description: vendorData.store_description || "",
    store_logo: null, // Initialize as null for file handling
    qr_code: null, // Initialize as null for file handling
    mobile_number: vendorData.mobile_number || "",
  });

  const [logoPreview, setLogoPreview] = useState("");
  const [qrCodePreview, setQrCodePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    store_name: "",
    store_description: "",
    file_type: "",
    mobile_number: "",
  });

  // Input Change Handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear errors for the field
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.store_name.trim()) {
      newErrors.store_name = "Store name is required.";
      isValid = false;
    }
    if (!formData.store_description.trim()) {
      newErrors.store_description = "Store description is required.";
      isValid = false;
    }
    if (
      formData.mobile_number &&
      !/^09\d{9}$/.test(formData.mobile_number) // Mobile number must start with 09 and be exactly 11 digits long
    ) {
      newErrors.mobile_number =
        "Invalid mobile number format. Must be 11 digits and start with 09.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle Image Upload
  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "image/jpeg" || file.type === "image/png") {
        setFormData({ ...formData, [field]: file });
        if (field === "store_logo") {
          setLogoPreview(URL.createObjectURL(file));
        } else if (field === "qr_code") {
          setQrCodePreview(URL.createObjectURL(file));
        }
        setErrors({ ...errors, file_type: "" }); // Clear file type error
      } else {
        setErrors({
          ...errors,
          file_type: "Invalid file type. Only JPEG and PNG are allowed.",
        });
      }
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const formDataToSubmit = new FormData();
    if (formData.store_logo) {
      formDataToSubmit.append("store_logo", formData.store_logo);
    }
    if (formData.qr_code) {
      formDataToSubmit.append("qr_code", formData.qr_code);
    }
    formDataToSubmit.append("store_name", formData.store_name);
    formDataToSubmit.append("store_description", formData.store_description);
    formDataToSubmit.append("mobile_number", formData.mobile_number || "");
    formDataToSubmit.append("user", vendorData.user);
    formDataToSubmit.append("is_approved", vendorData.is_approved);

    try {
      setLoading(true);
      const response = await buzzar_api.put(
        `/vendors/${vendorData.user}/`,
        formDataToSubmit,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      localStorage.setItem("vendorData", JSON.stringify(response.data));
      alert("Store data updated successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error updating store data:", error);
      alert("Failed to update store data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col lg:flex-row min-h-screen">
      <VendorSideBar />
      <div className="flex flex-col w-full p-6 md:p-10">
        <header className="flex justify-between">
          <div>
            <Typography variant="h1">Store Profile</Typography>
            <Typography>Edit your store information here.</Typography>
          </div>
          <div className="items-center flex">
            <Chip
              variant="ghost"
              color={vendorData.is_approved ? "green" : "red"}
              size="lg"
              value={vendorData.is_approved ? "Approved" : "Pending Approval"}
              icon={
                vendorData.is_approved ? (
                  <CheckCircleIcon className="h-6 w-6" />
                ) : (
                  <XCircleIcon className="h-6 w-6" />
                )
              }
              className="rounded-full"
            />
          </div>
        </header>

        <section className="mt-10">
          <Card>
            <CardHeader
              floated={false}
              className="flex justify-center p-2 shadow-none"
            >
              <img
                src={vendorData.store_logo}
                alt={vendorData.store_name || "Store Image Logo"}
                className="w-60 h-60 rounded-full object-cover shadow-md"
              />
            </CardHeader>
            <CardBody className="flex flex-col gap-4">
              <section className=" items-center flex flex-col md:flex-row gap-2">
                <div className="py-2 px-4 border-2 rounded-md">
                  <Typography variant="small">Store QR Code</Typography>
                  <img
                    src={vendorData.qr_code}
                    alt="Store logo"
                    className="w-48 h-48 object-contain"
                  />
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <p>
                    <Input
                      label="Store Name"
                      name="store_name"
                      value={formData.store_name}
                      onChange={handleInputChange}
                      error={!!errors.store_name}
                    />
                    {errors.store_name && (
                      <Typography variant="small" className="text-red-500">
                        {errors.store_name}
                      </Typography>
                    )}
                  </p>
                  <p>
                    <Input
                      label="Store Description"
                      name="store_description"
                      value={formData.store_description}
                      onChange={handleInputChange}
                      error={!!errors.store_description}
                    />
                    {errors.store_description && (
                      <Typography variant="small" className="text-red-500">
                        {errors.store_description}
                      </Typography>
                    )}
                  </p>
                  <p>
                    <Input
                      label="Mobile Number"
                      name="mobile_number"
                      placeholder="ex. 09876543212"
                      value={formData.mobile_number}
                      onChange={handleInputChange}
                      error={!!errors.mobile_number}
                    />
                    {errors.mobile_number && (
                      <Typography variant="small" className="text-red-500">
                        {errors.mobile_number}
                      </Typography>
                    )}
                  </p>
                </div>
              </section>

              {/* Store Logo Upload */}
              <section className="flex justify-between">
                <div
                  className="border-2 border-gray-400 border-dashed rounded-md p-4 text-center cursor-pointer w-full"
                  onClick={() =>
                    document.getElementById("store-logo-input").click()
                  }
                >
                  <input
                    type="file"
                    id="store-logo-input"
                    accept="image/jpeg, image/png"
                    onChange={(e) => handleImageUpload(e, "store_logo")}
                    className="hidden"
                  />
                  <Typography>
                    Click or drag to upload a new store logo
                  </Typography>
                  {formData.store_logo && formData.store_logo.name ? (
                    <Typography className="text-gray-700">
                      {formData.store_logo.name}
                    </Typography>
                  ) : (
                    <Typography variant="paragraph" className="text-gray-500">
                      Drag and drop images here, or click to select files
                      <br />1 MB max size per file.
                    </Typography>
                  )}
                  {logoPreview && (
                    <div className="flex justify-center">
                      <img
                        src={logoPreview}
                        alt="Store Logo Preview"
                        className="w-20 h-20 mt-2 object-cover"
                      />
                    </div>
                  )}
                </div>
              </section>

              <div
                className="border-2 border-dashed  border-gray-400 rounded-md p-4 text-center cursor-pointer"
                onClick={() => document.getElementById("qr-code-input").click()}
              >
                <input
                  type="file"
                  id="qr-code-input"
                  accept="image/jpeg, image/png"
                  onChange={(e) => handleImageUpload(e, "qr_code")}
                  className="hidden"
                />
                <Typography>Click or drag to upload a QR Code</Typography>
                {formData.qr_code && formData.qr_code.name ? (
                  <Typography className="text-gray-700">
                    {formData.qr_code.name}
                  </Typography>
                ) : (
                  <Typography variant="paragraph" className="text-gray-500">
                    Drag and drop images here, or click to select files
                    <br />1 MB max size per file.
                  </Typography>
                )}
                {/* QR Code Upload */}
                {qrCodePreview && (
                  <div className="flex justify-center">
                    <img
                      src={qrCodePreview}
                      alt="QR Code Preview"
                      className="w-20 h-20 mt-2 object-cover"
                    />
                  </div>
                )}
              </div>
            </CardBody>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </section>
      </div>
    </main>
  );
};

export default VendorStoreProfile;
