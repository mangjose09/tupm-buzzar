import React, { useState } from "react";
import AuthNavBar from "../../components/auth-page/AuthNavBar";
import Footer from "../../components/Footer";
import BrandImage from "../../components/auth-page/BrandImage";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Button,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { VendorRegForm } from "../../components/vendor/VendorRegForm";
import { useForm } from "react-hook-form";
import { OtpForm } from "../../components/auth-page/OtpForm";

const validateEmail = (email) => {
  const domain = "@tup.edu.ph";
  if (!email.endsWith(domain)) {
    return `Email must end with ${domain}`;
  }
  return true;
};

const VendorRegister = () => {
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [email, setEmail] = useState("");
  const [isOtpFormVisible, setIsOtpFormVisible] = useState(false); // Change default to false

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm({
    mode: "onBlur", // Trigger validation onBlur
    defaultValues: {
      email: "",
    },
  });

  const onEmailSubmit = (data) => {
    console.log("Form Submitted:", data);
    setIsEmailValid(true); // Proceed to next step if email is valid
    setEmail(data.email); // Store the email for further use in the next step
  };

  // Callback function to show OtpForm when VendorRegForm is successfully submitted
  const handleFormSuccess = () => {
    setIsOtpFormVisible(true);
  };

  return (
    <>
      <AuthNavBar />
      <section className="min-h-screen px-6 py-5 md:px-24 md:py-10 ">
        {/* <section className="min-h-screen px-6 py-5 md:px-24 md:py-10 grid grid-cols-1 lg:grid-cols-2 gap-x-4"> */}
        {isOtpFormVisible ? (
          // Show OTP Form if form is successfully submitted

          <article className="flex flex-col w-full h-auto col-span-2">
            <div className="flex w-full h-auto">
              <OtpForm emailSubmitted={email} />
            </div>
          </article>
        ) : (
          <>
            {isEmailValid ? (
              <article className="flex flex-col w-full h-auto col-span-2">
                <div className="flex w-full h-auto">
                  {/* Pass handleFormSuccess to VendorRegForm */}
                  <VendorRegForm
                    emailSubmitted={email}
                    backToPhaseOne={setIsEmailValid}
                    onSuccess={handleFormSuccess} // Pass the success handler here
                  />
                </div>
              </article>
            ) : (
              <>
                <article className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 md:items-center">
                  <BrandImage />
                  <Card className="w-full border  h-[300px] md:h-auto outline outline-[#F8B34B] outline-1">
                    <CardHeader
                      variant="gradient"
                      floated={false}
                      className="mb-4 grid h-auto place-items-center shadow-none rounded-none"
                    >
                      <Typography variant="h3">Register</Typography>
                    </CardHeader>
                    <CardBody className="flex flex-col gap-4">
                      <form onSubmit={handleSubmit(onEmailSubmit)}>
                        <Input
                          type="email"
                          label="Email"
                          placeholder="email@example.com"
                          {...register("email", {
                            required: "Email is required",
                            // validate: validateEmail,
                          })}
                          onBlur={() => trigger("email")} // Trigger validation onBlur
                          error={errors.email}
                        />
                        {errors.email && (
                          <Typography color="red" variant="small">
                            {errors.email.message}
                          </Typography>
                        )}
                        <Button
                          fullWidth
                          className="mt-5 bg-[#F6962E]"
                          type="submit"
                        >
                          Next
                        </Button>
                      </form>
                    </CardBody>
                    <CardFooter className="pt-0">
                      <Typography
                        variant="small"
                        className="mt-6 flex justify-center"
                      >
                        Already have an account?
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="ml-1 font-bold"
                        >
                          <Link
                            to="/vendor/login"
                            state={{ headerTitle: "Vendor Login" }}
                          >
                            Login
                          </Link>
                        </Typography>
                      </Typography>
                    </CardFooter>
                  </Card>
                </article>
              </>
            )}
          </>
        )}
      </section>
      <Footer />
    </>
  );
};

export default VendorRegister;
