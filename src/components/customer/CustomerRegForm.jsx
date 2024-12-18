import { useState } from "react";
import {
  Stepper,
  Step,
  Button,
  Typography,
  Card,
  CardBody,
  Input,
  Select,
  Option,
  Checkbox,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import {
  CogIcon,
  UserIcon,
  CheckIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";
import buzzar_api from "../../config/api-config";
import TermsAndConditions from "../TermsAndConditions";

const CustomerRegForm = ({ emailSubmitted, backToPhaseOne, onSuccess }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isLastStep, setIsLastStep] = useState(false);
  const [isFirstStep, setIsFirstStep] = useState(false);

  const [showPass, setShowPass] = useState(false);
  const [showConfPass, setShowConfPass] = useState(false);

  const togglePass = () => setShowPass((prev) => !prev);
  const toggleConfPass = () => setShowConfPass((prev) => !prev);

  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [departmentError, setDepartmentError] = useState("");

  const [isDialogOpen, setDialogOpen] = useState(false); // State for dialog visibility

  const handleAcceptTerms = () => {
    setValue("terms", true); // Set form value to true when terms are accepted
    setDialogOpen(false); // Close the dialog
  };

  const handleDeclineTerms = () => {
    setValue("terms", false); // Set form value to false when terms are declined
    setDialogOpen(false); // Close the dialog
    alert("You must accept the terms to proceed."); // Show alert when terms are declined
  };

  // Department options, add more departments as needed
  const departments = [
    { name: "College of Architecture and Fine Arts", value: "CAFA" },
    { name: "College of Engineering", value: "COE" },
    { name: "College of Industrial Education", value: "CIE" },
    { name: "College of Industrial Technology", value: "CIT" },
    { name: "College of Liberal Arts", value: "CLA" },
    { name: "College of Science", value: "COS" },
    { name: "Non-College", value: "NON-COLLEGE" },
  ];

  // Initialize useForm
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue, // To manually set form values (e.g., terms acceptance)
    trigger,
    watch, // Added watch to observe form values
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      password: "",
      confirmPassword: "",
      firstName: "",
      middleName: "",
      lastName: "",
      contactNumber: "",
      terms: "",
    },
  });

  // Use watch to get form data
  const formData = watch();
  const maskedPassword = "*".repeat(formData.password.length);

  const registerCustomer = async (data) => {
    console.log("All form data:", data);
    console.log("Selected Department:", selectedDepartment);

    if (activeStep === 2) {
      const finalData = {
        email: emailSubmitted,
        password: data.password,
        first_name: data.firstName,
        middle_name: data.middleName,
        last_name: data.lastName,
        contact_num: data.contactNumber,
        is_vendor: false,
        user_dept: selectedDepartment,
        // Add other fields as needed
      };

      console.log("Submit data to API:", finalData);

      try {
        // Make the API request to /api/register
        const response = await buzzar_api.post("/register/", finalData);

        // If the request is successful, log or handle success response
        console.log("Registration successful:", response.data);
        onSuccess(); // Call the onSuccess callback function when the registration is successful
        setIsLastStep(true); // Set the last step flag to true
      } catch (error) {
        if (error.response) {
          // Extract the first error message from the response
          const errorMessage = Object.keys(error.response.data)
            .map((key) => `${key}: ${error.response.data[key].join(", ")}`)
            .join("\n");

          // Add a custom message before the detailed errors
          const alertMessage = `There's an error on the following:\n${errorMessage}`;

          alert(alertMessage); // Display the error message in an alert
          console.error("Error response:", error.response.data);
          backToPhaseOne(false); // Go back to email validation
        } else if (error.request) {
          alert("No response from the server. Please try again.");
          console.error("No response from the server:", error.request);
          backToPhaseOne(false); // Go back to email validation
        } else {
          alert("An error occurred. Please try again.");
          console.error("Error:", error.message);
          backToPhaseOne(false); // Go back to email validation
        }
      }
    } else {
      handleNext(); // Proceed to the next step if it's not the last one
    }
  };

  const handleNext = async () => {
    const isStepValid = await trigger(); // Check if current step fields are valid

    // Validate department selection only on Step 1 (Profile Information)
    if (activeStep === 1 && !selectedDepartment) {
      setDepartmentError("Please select a department.");
      return; // Prevent moving to the next step
    }

    if (isStepValid) {
      setActiveStep((cur) => cur + 1);
      setDepartmentError(""); // Clear error when valid
    }
  };

  const handlePrev = () => {
    if (isFirstStep) {
      backToPhaseOne(false); // Go back to email validation
    } else {
      setActiveStep((cur) => cur - 1);
    }
  };

  // Render form content for each step
  const renderFormContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <>
            <Typography variant="h5" className="mb-4">
              Account Details
            </Typography>
            <div className="grid gap-2 grid-cols-2">
              <span className="col-span-2">
                <Input
                  label="Email"
                  type="text"
                  value={emailSubmitted}
                  placeholder="Enter your email"
                  disabled
                />
              </span>
              <span className="col-span-2 lg:col-span-1">
                <Input
                  type={showPass ? "text" : "password"}
                  label="Password"
                  placeholder="Enter password"
                  autoComplete="off"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters long",
                    },
                    validate: (value) => {
                      const errors = [];

                      if (!/[a-z]/.test(value)) {
                        errors.push("one lowercase letter");
                      }
                      if (!/[A-Z]/.test(value)) {
                        errors.push("one uppercase letter");
                      }
                      if (!/\d/.test(value)) {
                        errors.push("one number");
                      }

                      if (errors.length > 0) {
                        return `Password must contain at least ${errors.join(
                          ", "
                        )}.`;
                      }

                      return true; // No errors, validation passed
                    },
                  })}
                  error={errors.password}
                  icon={
                    showPass ? (
                      <EyeSlashIcon
                        className="h-5 w-5 cursor-pointer"
                        onMouseDown={togglePass}
                        onMouseUp={togglePass}
                      />
                    ) : (
                      <EyeIcon
                        className="h-5 w-5 cursor-pointer"
                        onMouseDown={togglePass}
                        onMouseUp={togglePass}
                      />
                    )
                  }
                />

                {errors.password ? (
                  <Typography color="red" variant="small">
                    {errors.password.message}
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
              </span>
              <span className="col-span-2 lg:col-span-1">
                <Input
                  type={showConfPass ? "text" : "password"}
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) => {
                      if (value !== watch("password")) {
                        return "Passwords do not match.";
                      }
                      return true; // No errors, validation passed
                    },
                  })}
                  error={errors.confirmPassword}
                  icon={
                    showConfPass ? (
                      <EyeSlashIcon
                        className="h-5 w-5 cursor-pointer"
                        onMouseDown={toggleConfPass}
                        onMouseUp={toggleConfPass}
                      />
                    ) : (
                      <EyeIcon
                        className="h-5 w-5 cursor-pointer"
                        onMouseDown={toggleConfPass}
                        onMouseUp={toggleConfPass}
                      />
                    )
                  }
                />
                {errors.confirmPassword && (
                  <Typography color="red" variant="small">
                    {errors.confirmPassword.message}
                  </Typography>
                )}
              </span>
            </div>
          </>
        );
      case 1:
        return (
          <>
            <Typography variant="h5" className="mb-4">
              Personal Details
            </Typography>
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
              <div>
                <Input
                  label="First Name"
                  type="text"
                  placeholder="Enter your first name"
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                  error={errors.firstName}
                />
                {errors.firstName && (
                  <Typography color="red" variant="small">
                    {errors.firstName.message}
                  </Typography>
                )}
              </div>
              <div>
                <Input
                  label="Middle Name (Optional)"
                  type="text"
                  placeholder="Enter your middle name"
                  {...register("middleName")}
                />
              </div>
              <div className="col-span-1 lg:col-span-2">
                <Input
                  label="Last Name"
                  type="text"
                  placeholder="Enter your last name"
                  {...register("lastName", {
                    required: "Last name is required",
                  })}
                  error={errors.lastName}
                />
                {errors.lastName && (
                  <Typography color="red" variant="small">
                    {errors.lastName.message}
                  </Typography>
                )}
              </div>
              <div className="w-full">
                <Input
                  label="Contact Number"
                  placeholder="e.g., +639987654321"
                  {...register("contactNumber", {
                    required: "Contact number is required",
                    pattern: {
                      value: /^\+63\d{10}$/,
                      message:
                        "Contact number must be in the format +639XXXXXXXXX",
                    },
                  })}
                  error={errors.contactNumber}
                />
                {errors.contactNumber && (
                  <Typography color="red" variant="small">
                    {errors.contactNumber.message}
                  </Typography>
                )}
              </div>
              <div className="w-full">
                <Select
                  label="Select Department"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e)}
                  error={departmentError ? true : false}
                >
                  {departments.map((department) => (
                    <Option key={department.value} value={department.value}>
                      {department.name}
                    </Option>
                  ))}
                </Select>
                {departmentError && (
                  <Typography color="red" variant="small">
                    {departmentError}
                  </Typography>
                )}
              </div>
            </div>
          </>
        );
      case 2:
        // Step 3: Confirm Information
        return (
          <>
            <div>
              <Typography variant="h5">Confirm Details</Typography>
              <Typography variant="small">
                Please review your details before submitting.
              </Typography>
            </div>
            {/* Display form data */}
            <div className="grid md:grid-cols-2 mt-4 gap-y-4 ">
              <div>
                <Typography variant="h6">Account Information</Typography>
                <Typography>
                  <strong>Email:</strong> {emailSubmitted}
                </Typography>
                <Typography>
                  <strong>Password:</strong> {maskedPassword} (Hidden for
                  security)
                </Typography>
              </div>

              <div>
                <Typography variant="h6">Personal Information</Typography>
                <Typography>
                  <strong>First Name:</strong> {formData.firstName}
                </Typography>
                <Typography>
                  <strong>Middle Name:</strong>{" "}
                  {formData.middleName ? formData.middleName : "None"}
                </Typography>
                <Typography>
                  <strong>Last Name:</strong> {formData.lastName}
                </Typography>
                <Typography>
                  <strong>Contact Number:</strong> {formData.contactNumber}
                </Typography>
                <Typography>
                  <strong>Department:</strong>{" "}
                  {selectedDepartment
                    ? departments.find(
                        (dep) => dep.value === selectedDepartment
                      )?.name || "None"
                    : "None"}
                </Typography>
              </div>
            </div>
            <div className="-ml-2.5 flex items-center text-gray-700 text-sm italic mt-4">
              <Checkbox
                color="amber"
                {...register("terms", { required: true })}
              />
              <Typography
                className="underline cursor-pointer"
                onClick={() => setDialogOpen(true)} // Open dialog on click
              >
                By submitting this information you are agreeing to the site's
                terms and conditions.
              </Typography>
            </div>
            {/* <Typography
              variant="small"
              color="blue-gray"
              className="mt-4 italic "
            >
              By submitting this information you are agreeing to the site's
              terms and conditions.
            </Typography> */}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full lg:px-24 lg:py-4 z-0">
      <Stepper
        activeStep={activeStep}
        isLastStep={(value) => setIsLastStep(value)}
        isFirstStep={(value) => setIsFirstStep(value)}
        activeLineClassName="bg-[#F6962E]"
      >
        <Step activeClassName="bg-[#F6962E]" completedClassName="bg-[#F6962E]">
          <UserIcon className="h-5 w-5" />
          <div className="hidden sm:inline-block absolute -bottom-[4.5rem] w-max text-center">
            <Typography
              variant="h6"
              color={activeStep === 0 ? "blue-gray" : "gray"}
            >
              Step 1
            </Typography>
            <Typography
              color={activeStep === 0 ? "blue-gray" : "gray"}
              className="font-normal"
            >
              Account Information
            </Typography>
          </div>
        </Step>
        <Step activeClassName="bg-[#F6962E]" completedClassName="bg-[#F6962E]">
          <CogIcon className="h-5 w-5" />
          <div className="hidden sm:inline-block absolute -bottom-[4.5rem] w-max text-center">
            <Typography
              variant="h6"
              color={activeStep === 1 ? "blue-gray" : "gray"}
            >
              Step 2
            </Typography>
            <Typography
              color={activeStep === 1 ? "blue-gray" : "gray"}
              className="font-normal"
            >
              Profile Information
            </Typography>
          </div>
        </Step>
        <Step activeClassName="bg-[#F6962E]" completedClassName="bg-[#F6962E]">
          <CheckIcon className="h-5 w-5" />
          <div className="hidden sm:inline-block absolute -bottom-[4.5rem] w-max text-center">
            <Typography
              variant="h6"
              color={activeStep === 2 ? "blue-gray" : "gray"}
            >
              Step 3
            </Typography>
            <Typography
              color={activeStep === 2 ? "blue-gray" : "gray"}
              className="font-normal"
            >
              Confirm Information
            </Typography>
          </div>
        </Step>
      </Stepper>

      <div className="flex mt-8 sm:mt-28 justify-center">
        <Card className="w-full  p-0 sm:p-6 border border-gray-300">
          <CardBody>
            <form onSubmit={handleSubmit(registerCustomer)}>
              {renderFormContent()}
              <div className="mt-8 flex justify-between">
                <Button onClick={handlePrev} className="bg-[#F6962E]">
                  Prev
                </Button>
                <Button
                  type="submit"
                  className="bg-[#F6962E]"
                  disabled={isLastStep && !watch("terms")} // Disabled only if on activeStep 2 and terms are not checked
                >
                  {activeStep === 2 ? "Submit" : "Next"}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>

        {/* Terms and Conditions Dialog */}
        <Dialog open={isDialogOpen} handler={() => setDialogOpen(false)}>
          <DialogHeader>Terms and Conditions</DialogHeader>
          <DialogBody>
            <TermsAndConditions />
          </DialogBody>
          <DialogFooter className="space-x-2">
            <Button
              color="red"
              variant="outlined"
              onClick={handleDeclineTerms} // Decline button
              size="sm"
            >
              Decline
            </Button>
            <Button
              color="amber"
              onClick={handleAcceptTerms} // Accept button
              size="sm"
            >
              Accept
            </Button>
          </DialogFooter>
        </Dialog>
      </div>
    </div>
  );
};

export { CustomerRegForm };
