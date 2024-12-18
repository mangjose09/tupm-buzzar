import React, { useState, useRef, Fragment } from "react";
import { Input, Typography, Button } from "@material-tailwind/react";
import buzzar_api from "../../config/api-config";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const OtpForm = ({ emailSubmitted }) => {
  const inputRefs = useRef([]);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate(); // Initialize navigate

  const handleChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value.replace(/[^0-9]/g, "");
    setOtp(newOtp);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleBackspace = (event, index) => {
    if (event.key === "Backspace" && !event.target.value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Function to mask the email
  const maskEmail = (email) => {
    const [localPart, domain] = email.split("@");
    if (localPart.length > 3) {
      const visiblePart = localPart.substring(0, 3);
      const maskedPart = "*".repeat(localPart.length - 3);
      return `${visiblePart}${maskedPart}@${domain}`;
    }
    return email;
  };

  const handleVerifyOtp = async () => {
    setIsLoading(true);
    setErrorMessage(""); // Reset error message

    const otpCode = otp.join(""); // Combine the 6 digits into a single string
    if (otpCode.length !== 6) {
      setErrorMessage("Please enter a valid 6-digit OTP.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await buzzar_api.post("/verify-otp/", {
        email: emailSubmitted,
        otp: otpCode,
      });

      // Handle success (e.g., navigate to the next page or show a success message)
      console.log("OTP verified successfully", response.data);
      alert(response.data.message);
      navigate("/"); // Redirect to /vendor/login

      // You can redirect the user or show a success notification
    } catch (error) {
      // Handle error (e.g., incorrect OTP or network issues)
      console.error("Failed to verify OTP", error);
      setErrorMessage(
        error.response?.data?.message ||
          "Failed to verify OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className="flex flex-col w-full space-y-4 justify-center items-center">
        <article className="flex flex-col items-center">
          <Typography
            variant="h3"
            color="blue-gray"
            className="text-xl md:text-3xl font-bold"
          >
            Verify your email address
          </Typography>
          <Typography color="blue-gray" className="text-sm md:text-lg">
            We've sent an OTP to your email. Please enter it below to continue.
          </Typography>
        </article>
        <article className="flex flex-col space-y-2">
          <div className="w-full max-w-screen-sm">
            <Typography
              variant="small"
              color="blue-gray"
              className="flex flex-col sm:flex-row items-center justify-center gap-1 text-center font-medium"
            >
              Enter the 6-digit OTP sent to{" "}
              <span className="font-bold">{maskEmail(emailSubmitted)}</span>
            </Typography>

            <div className="my-4 flex items-center justify-center gap-2">
              {otp.map((digit, index) => (
                <Fragment key={index}>
                  <Input
                    type="text"
                    maxLength={1}
                    className="!w-10 appearance-none !border-t-blue-gray-200 text-center !text-lg placeholder:text-blue-gray-300 placeholder:opacity-100 focus:!border-t-gray-900"
                    labelProps={{
                      className: "before:content-none after:content-none",
                    }}
                    containerProps={{
                      className: "!min-w-0 !w-10 !shrink-0",
                    }}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleBackspace(e, index)}
                    inputRef={(el) => (inputRefs.current[index] = el)}
                  />
                  {index === 2 && (
                    <span className="text-2xl text-slate-700">-</span>
                  )}
                </Fragment>
              ))}
            </div>

            {errorMessage && (
              <Typography variant="small" color="red" className="text-center">
                {errorMessage}
              </Typography>
            )}

            <Typography
              variant="small"
              className="text-center font-normal text-blue-gray-500"
            >
              Did not receive the code?{" "}
              <span className="font-bold">Resend</span>
            </Typography>
          </div>
          <span className="flex justify-center">
            <Button
              variant="outlined"
              className="w-36 border-2 text-[#F6962E] border-[#F6962E]"
              onClick={handleVerifyOtp}
              disabled={isLoading} // Disable button while loading
            >
              {isLoading ? "Verifying..." : "Verify"}
            </Button>
          </span>
        </article>
      </section>
    </>
  );
};

export { OtpForm };
