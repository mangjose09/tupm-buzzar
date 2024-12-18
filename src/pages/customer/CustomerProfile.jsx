import React, { useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Input,
  Chip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import {
  CheckBadgeIcon,
  ExclamationCircleIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/authContext";
import buzzar_api from "../../config/api-config";
import CustomerSideBar from "../../components/CustomerSideBar";
import Header from "../../components/Header";

const CustomerProfile = () => {
  const { user } = useAuth();

  // State for change password dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  // Set initial state with the editable fields only
  const [formData, setFormData] = useState({
    first_name: user.first_name || "",
    middle_name: user.middle_name || "",
    last_name: user.last_name || "",
    contact_num: user.contact_num || "",
  });

  const [errors, setErrors] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    contact_num: "",
  });

  const [loading, setLoading] = useState(false);

  // Handle input change for user information
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  console.log("password data is", passwordData);
  console.log("password errors are", passwordErrors);

  // Handle input change for password fields
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
    setPasswordErrors({ ...passwordErrors, [name]: "" });
  };

  const handleInputBlur = (e) => {
    validateForm(); // Validate on blur for user info
  };

  // Validate user information form
  const validateForm = () => {
    let valid = true;
    const newErrors = {
      first_name: "",
      middle_name: "",
      last_name: "",
      contact_num: "",
    };

    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required.";
      valid = false;
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required.";
      valid = false;
    }
    if (!formData.contact_num.trim()) {
      newErrors.contact_num = "Contact number is required.";
      valid = false;
    } else if (!/^\+63\d{10}$/.test(formData.contact_num)) {
      newErrors.contact_num =
        "Contact number must be in the format +63XXXXXXXXXX.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Validate password form
  const validatePasswordForm = () => {
    let valid = true;
    const newPasswordErrors = {
      old_password: "",
      new_password: "",
      confirm_password: "",
    };

    // Check if old password is provided
    if (!passwordData.old_password.trim()) {
      newPasswordErrors.old_password = "Old password is required.";
      valid = false;
    }

    const validationRules = [
      {
        test: () => passwordData.new_password.length >= 8,
        message: "New password must be at least 8 characters.",
      },
      {
        test: () => /[A-Z]/.test(passwordData.new_password),
        message: "New password must contain at least one uppercase letter.",
      },
      {
        test: () => /[a-z]/.test(passwordData.new_password),
        message: "New password must contain at least one lowercase letter.",
      },
      {
        test: () => /[0-9]/.test(passwordData.new_password),
        message: "New password must contain at least one number.",
      },
    ];

    // Validate new password against rules
    for (const rule of validationRules) {
      if (!rule.test()) {
        newPasswordErrors.new_password = rule.message;
        valid = false;
        break; // Exit the loop on the first failure
      }
    }

    // Check if passwords match
    if (passwordData.new_password !== passwordData.confirm_password) {
      newPasswordErrors.confirm_password = "Passwords do not match.";
      valid = false;
    }

    setPasswordErrors(newPasswordErrors);
    return valid;
  };

  const handleSave = async () => {
    if (!validateForm()) return; // Ensure form validation passes

    // Define the request body for the API call
    const requestBody = {
      email: user.email, // Use the current user's email
      first_name: formData.first_name,
      middle_name: formData.middle_name,
      last_name: formData.last_name,
      contact_num: formData.contact_num,
    };

    try {
      setLoading(true);

      // API call to update user information
      const response = await buzzar_api.put("/user/", requestBody);

      console.log("Response from user info update:", response.data);

      localStorage.setItem("user", JSON.stringify(response.data));
      alert("Account settings updated successfully!");

      window.location.reload();
    } catch (error) {
      console.error("Error updating account settings:", error);

      // Check for a 400 error and specific field errors in the response data
      if (error.response?.status === 400) {
        const responseErrors = error.response.data;

        // Update error state based on server response
        setErrors({
          email: responseErrors.email?.[0] || "",
          first_name: responseErrors.first_name?.[0] || "",
          middle_name: "", // Assume no error response for middle_name if not included
          last_name: responseErrors.last_name?.[0] || "",
          contact_num: responseErrors.contact_num?.[0] || "",
        });
      } else {
        alert("Failed to update account settings. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSave = async () => {
    if (!validatePasswordForm()) return;

    try {
      setLoading(true);
      // Call API to change password here
      const response = await buzzar_api.put("/change-password/", {
        old_password: passwordData.old_password,
        new_password: passwordData.new_password,
      });

      console.log("Response from password change:", response.data);
      alert("Password changed successfully!");
      setIsDialogOpen(false); // Close the dialog after saving

      // Reset password fields
      setPasswordData({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (error) {
      console.error("Error changing password:", error);
      console.error("Error changing password:", error);

      // Display specific error message based on API response
      const errorMessage =
        error.response?.data?.old_password ||
        "Failed to change password. Please try again.";

      alert(`An error occurred: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle blur for password fields
  const handlePasswordBlur = () => {
    validatePasswordForm(); // Validate on blur for password fields
  };

  // Handle dialog close and reset password fields
  const closeDialog = () => {
    setIsDialogOpen(false);
    setPasswordData({
      old_password: "",
      new_password: "",
      confirm_password: "",
    });
    setPasswordErrors({
      old_password: "",
      new_password: "",
      confirm_password: "",
    });
  };

  return (
    <>
    <Header/>
    <main className="flex flex-col lg:flex-row min-h-screen overflow-hidden">
      <CustomerSideBar />
      <div className="flex flex-col w-full p-6 md:p-10">
        <header>
          <Typography variant="h1">Account Settings</Typography>
          <Typography variant="paragraph">
            Edit your account information here.
          </Typography>
        </header>
        <section className="mt-10">
          <Card className="w-full">
            <CardHeader
              floated={false}
              className="rounded-none px-2 py-4 shadow-none space-y-5"
            >
              <Typography variant="h4">Personal Information</Typography>
              <header className="flex flex-col-reverse sm:flex-row justify-between gap-2">
                <div>
                  <Typography variant="small">Email Address</Typography>
                  <Typography variant="paragraph" className="text-black">
                    {user.email}
                  </Typography>
                </div>
                <div className="flex items-center">
                  {user.is_verified ? (
                    <Chip
                      variant="ghost"
                      color="green"
                      size="lg"
                      value="Verified Account"
                      icon={<CheckBadgeIcon className="h-6 w-6" />}
                      className="rounded-full"
                    />
                  ) : (
                    <Chip
                      variant="ghost"
                      color="red"
                      size="lg"
                      value="Not yet Verified"
                      icon={<ExclamationCircleIcon className="h-6 w-6" />}
                      className="rounded-full"
                    />
                  )}
                </div>
              </header>
            </CardHeader>
            <CardBody className="w-full border-t-2">
              {/* Editable Fields */}
              <article className="grid grid-cols-2 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <Input
                    label="First Name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    error={!!errors.first_name}
                    onBlur={handleInputBlur}
                  />
                  {errors.first_name && (
                    <Typography className="text-red-500 text-sm">
                      {errors.first_name}
                    </Typography>
                  )}
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <Input
                    label="Middle Name"
                    name="middle_name"
                    value={formData.middle_name}
                    onChange={handleInputChange}
                    error={!!errors.middle_name}
                  />
                  {errors.middle_name && (
                    <Typography className="text-red-500 text-sm">
                      {errors.middle_name}
                    </Typography>
                  )}
                </div>
                <div className="col-span-2">
                  <Input
                    label="Last Name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    error={!!errors.last_name}
                    onBlur={handleInputBlur}
                  />
                  {errors.last_name && (
                    <Typography className="text-red-500 text-sm">
                      {errors.last_name}
                    </Typography>
                  )}
                </div>
                <div className="col-span-2">
                  <Input
                    label="Contact Number"
                    name="contact_num"
                    value={formData.contact_num}
                    onChange={handleInputChange}
                    error={!!errors.contact_num}
                    onBlur={handleInputBlur}
                  />
                  {errors.contact_num && (
                    <Typography className="text-red-500 text-sm">
                      {errors.contact_num}
                    </Typography>
                  )}
                </div>
              </article>
            </CardBody>
            <CardFooter className="flex justify-between">
              <div className="w-full flex flex-col sm:flex-row justify-between gap-2">
                <Button
                  variant="outlined"
                  onClick={() => setIsDialogOpen(true)}
                  size="sm"
                  className="flex flex-row items-center justify-center gap-1"
                >
                  <LockClosedIcon className="w-6 h-6" />
                  Change Password
                </Button>
                <Button onClick={handleSave} loading={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </section>
        {/* Change Password Dialog */}
        <Dialog size="xs" open={isDialogOpen} handler={closeDialog}>
          <DialogHeader>
            <p>
              <Typography variant="h5">Change Password</Typography>
              <Typography variant="paragraph">
                Enter your old password and a new password to change your
                account password.
              </Typography>
            </p>
          </DialogHeader>
          <DialogBody>
            <article className="flex flex-col gap-4">
              <div>
                <Input
                  label="Old Password"
                  name="old_password"
                  type="password"
                  value={passwordData.old_password}
                  onChange={handlePasswordChange}
                  error={!!passwordErrors.old_password}
                  onBlur={handlePasswordBlur} // Add blur handling
                />
                {passwordErrors.old_password && (
                  <Typography className="text-red-500 text-sm">
                    {passwordErrors.old_password}
                  </Typography>
                )}
              </div>
              <div>
                <Input
                  label="New Password"
                  name="new_password"
                  type="password"
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                  error={!!passwordErrors.new_password}
                  onBlur={handlePasswordBlur} // Add blur handling
                />
                {passwordErrors.new_password ? (
                  <Typography className="text-red-500 text-sm">
                    {passwordErrors.new_password}
                  </Typography>
                ) : (
                  <Typography
                    variant="small"
                    color="gray"
                    className="mt-2 flex sm:items-center gap-x-2 font-normal"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="-mt-px h-4 w-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Use at least 8 characters, one uppercase, one lowercase and
                    one number.
                  </Typography>
                )}
              </div>
              <div>
                <Input
                  label="Confirm New Password"
                  name="confirm_password"
                  type="password"
                  value={passwordData.confirm_password}
                  onChange={handlePasswordChange}
                  error={!!passwordErrors.confirm_password}
                  onBlur={handlePasswordBlur} // Add blur handling
                />
                {passwordErrors.confirm_password && (
                  <Typography className="text-red-500 text-sm">
                    {passwordErrors.confirm_password}
                  </Typography>
                )}
              </div>
            </article>
          </DialogBody>
          <DialogFooter className="flex gap-x-2">
            <Button
              size="sm"
              variant="outlined"
              onClick={closeDialog}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handlePasswordSave} loading={loading}>
              {loading ? "Changing..." : "Change Password"}
            </Button>
          </DialogFooter>
        </Dialog>
      </div>
    </main>
    </>
  );
};

export default CustomerProfile;
