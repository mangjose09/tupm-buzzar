import React, { useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Button,
} from "@material-tailwind/react";
import PasswordOtp from "../components/PasswordOtp";
import buzzar_api from "../config/api-config";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (type) => {
    const errors = {};

    if (type === "email") {
      if (!email.trim()) {
        errors.email = "Email is required.";
      } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        errors.email = "Please enter a valid email address.";
      }
    }

    if (type === "password") {
      if (newPassword.length < 8) {
        errors.new_password = "Password must be at least 8 characters long.";
      } else if (!/[A-Z]/.test(newPassword)) {
        errors.new_password =
          "Password must contain at least one uppercase letter.";
      } else if (!/[a-z]/.test(newPassword)) {
        errors.new_password =
          "Password must contain at least one lowercase letter.";
      } else if (!/[0-9]/.test(newPassword)) {
        errors.new_password = "Password must contain at least one number.";
      }

      if (confirmPassword !== newPassword) {
        errors.confirm_password = "Passwords do not match.";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEmailSubmit = async () => {
    if (!validateForm("email")) return;
    setIsLoading(true);
    setFormErrors({});
    try {
      await buzzar_api.post("/forgot-pass/email/", { email });
      setIsOtpSent(true);
      alert("OTP has been sent to your email.");
    } catch (error) {
      setFormErrors({
        ...formErrors,
        email:
          error.response?.data?.email ||
          "Failed to send OTP. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!validateForm("password")) return;

    setIsLoading(true);

    const passwordPayload = {
      email: email,
      password: newPassword,
      re_password: confirmPassword,
    };

    
    try {
      console.log("The payload is", passwordPayload);

      await buzzar_api.post("/forgot-pass/", passwordPayload, {
        withCredentials: true, // Ensure credentials are included
      });

      alert("Password reset successful!");
      navigate("/");
    } catch (error) {
      console.error("Error resetting password", error.response);
      alert("Password reset failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSuccess = () => {
    setIsOtpVerified(true);
  };

  const handleNewPasswordBlur = () => {
    const errors = { ...formErrors };
    if (newPassword.length < 8) {
      errors.new_password = "Password must be at least 8 characters long.";
    } else if (!/[A-Z]/.test(newPassword)) {
      errors.new_password =
        "Password must contain at least one uppercase letter.";
    } else if (!/[a-z]/.test(newPassword)) {
      errors.new_password =
        "Password must contain at least one lowercase letter.";
    } else if (!/[0-9]/.test(newPassword)) {
      errors.new_password = "Password must contain at least one number.";
    } else {
      delete errors.new_password;
    }
    setFormErrors(errors);
  };

  const handleConfirmPasswordBlur = () => {
    const errors = { ...formErrors };
    if (confirmPassword !== newPassword) {
      errors.confirm_password = "Passwords do not match.";
    } else {
      delete errors.confirm_password;
    }
    setFormErrors(errors);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#FDF6E9] px-4">
      <img
        className="h-20 w-auto object-cover p-0"
        src="/LONG-TEXT-NO-BG.png"
        alt="buzzar branding"
      />

      {isOtpVerified ? (
        <Card className="mt-10 w-auto">
          <CardHeader floated={true} className="grid h-auto p-5">
            <header className="flex flex-col items-center">
              <Typography variant="h3">Set New Password</Typography>
              <Typography variant="small" className="text-center">
                Enter your desired password.
              </Typography>
            </header>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <div>
              <Input
                label="New Password"
                size="lg"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onBlur={handleNewPasswordBlur}
                error={!!formErrors.new_password}
              />
              {formErrors.new_password && (
                <Typography className="text-red-500 text-sm">
                  {formErrors.new_password}
                </Typography>
              )}
            </div>
            <div>
              <Input
                label="Confirm Password"
                size="lg"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={handleConfirmPasswordBlur}
                error={!!formErrors.confirm_password}
              />
              {formErrors.confirm_password && (
                <Typography className="text-red-500 text-sm">
                  {formErrors.confirm_password}
                </Typography>
              )}
            </div>
          </CardBody>
          <CardFooter className="pt-0">
            <Button
              size="md"
              className="bg-[#F8B34B]"
              fullWidth
              loading={isLoading}
              onClick={handlePasswordReset}
            >
              Reset Password
            </Button>
          </CardFooter>
        </Card>
      ) : isOtpSent ? (
        <PasswordOtp emailSubmitted={email} onOtpSuccess={handleOtpSuccess} />
      ) : (
        <Card className="mt-10 w-auto">
          <CardHeader floated={true} className="grid h-auto p-5">
            <header className="flex flex-col items-center">
              <Typography variant="h3">Forgot Password</Typography>
              <Typography variant="small" className="text-center">
                Enter your email address to reset your password.
              </Typography>
            </header>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <div>
              <Input
                label="Email"
                size="lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => {
                  if (!email.trim()) {
                    setFormErrors((prevErrors) => ({
                      ...prevErrors,
                      email: "Email is required.",
                    }));
                  } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
                    setFormErrors((prevErrors) => ({
                      ...prevErrors,
                      email: "Please enter a valid email address.",
                    }));
                  }
                }}
                error={!!formErrors.email}
              />
              {formErrors.email && (
                <Typography className="text-red-500 text-sm">
                  {formErrors.email}
                </Typography>
              )}
            </div>
          </CardBody>
          <CardFooter className="pt-0">
            <Button
              size="md"
              className="bg-[#F8B34B]"
              onClick={handleEmailSubmit}
              fullWidth
              loading={isLoading}
            >
              {isLoading ? "Sending OTP..." : "Reset Password"}
            </Button>
          </CardFooter>
        </Card>
      )}
    </main>
  );
};

export default ForgotPassword;
