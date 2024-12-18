import React, { useState, useRef, Fragment } from "react";
import buzzar_api from "../config/api-config";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Button,
} from "@material-tailwind/react";

const PasswordOtp = ({ emailSubmitted, onOtpSuccess }) => {
  const inputRefs = useRef([]);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
    setErrorMessage("");

    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setErrorMessage("Please enter a valid 6-digit OTP.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await buzzar_api.post("/forgot-pass/otp/", {
        email: emailSubmitted,
        otp: otpCode,
      });

      console.log("Successfull OTP", response.data);

      // Notify parent component of successful OTP verification
      alert(response.data.message);
      onOtpSuccess();
    } catch (error) {
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
        <Card className="mt-10 w-auto">
          <CardHeader floated={true} className="grid h-auto p-5">
            <header className="flex flex-col items-center gap-y-3">
              <Typography variant="h3" className="text-center">
                Verify your email address
              </Typography>
              <Typography variant="small" className="text-center">
                We've sent an OTP to your email. Please enter it below to
                continue.
              </Typography>
            </header>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
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
                  <Typography
                    variant="small"
                    color="red"
                    className="text-center"
                  >
                    {errorMessage}
                  </Typography>
                )}
              </div>
            </article>
          </CardBody>
          <CardFooter className="pt-0">
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
          </CardFooter>
        </Card>
      </section>
    </>
  );
};

export default PasswordOtp;
