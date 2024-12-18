import React, { useState } from "react";
import AuthNavBar from "../../components/auth-page/AuthNavBar";
import BrandImage from "../../components/auth-page/BrandImage";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Checkbox,
  Button,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import buzzar_api from "../../config/api-config";
import Footer from "../../components/Footer";
import { useAuth } from "../../context/authContext";


const VendorLogin = () => {
  // const [loading, setLoading] = useState(false); // State to manage loading
  const { login, loading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm({
    mode: "onBlur", // Trigger validation on blur
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const CARDINFO = [
    {
      icon: "/NON-PROFIT.png",
      title: "Non-profit Platform",
      desc: "BUZZAR is a community-driven, non-profit platform dedicated to empowering students and campus-based businesses. No fees are charged for transactions, ensuring full value to vendors and buyers alike.",
    },
    {
      icon: "/SECURE-AND-SAFETY.png",
      title: "Secure and Safe",
      desc: "With verified vendors and secure transaction protocols, BUZZAR offers a safe shopping experience, prioritizing user security and trust in every transaction.",
    },
    {
      icon: "/ONE-STOP-SHOP.png",
      title: "One-stop Shop",
      desc: "BUZZAR provides a single, comprehensive platform for all campus-related products and services, simplifying the search and supporting all your academic and entrepreneurial needs in one place.",
    },
  ];

  const onLoginSubmit = (data) => {
    login(data, "vendor");
  };

  return (
    <>
      <AuthNavBar />
      <section className="min-h-screen ">
        <article className="grid grid-cols-1 lg:grid-cols-2 px-6 py-5 md:px-24 md:py-10  gap-x-4 md:items-center">
          <BrandImage />
          <Card className="w-full border outline outline-[#F8B34B] outline-1">
            {/* <Card className="shadow-2xl w-full outline outline-[#F8B34B] outline-1"> */}
            <CardHeader
              variant="gradient"
              floated={false}
              className="mb-4 grid h-auto place-items-center shadow-none rounded-none"
            >
              <Typography variant="h3">Log In</Typography>
            </CardHeader>
            <form onSubmit={handleSubmit(onLoginSubmit)}>
              <CardBody className="flex flex-col gap-4">
                <div>
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
                </div>
                <div>
                  <Input
                    type="password"
                    label="Password"
                    {...register("password", {
                      required: "Password is required",
                      // minLength: {
                      //   value: 8,
                      //   message: "Password must be at least 8 characters long",
                      // },
                      // validate: validateEmail,
                    })}
                    onBlur={() => trigger("password")} // Trigger validation onBlur
                    error={errors.password}
                  />
                  {errors.password && (
                    <Typography color="red" variant="small">
                      {errors.password.message}
                    </Typography>
                  )}
                </div>

                <Typography variant="small" className="px-2 underline">
                  <Link to="/forgot-password">Forgot your password?</Link>
                </Typography>
              </CardBody>
              <CardFooter className="pt-0">
                <Button
                  fullWidth
                  className="bg-[#F8B34B] flex items-center justify-center"
                  type="submit"
                  loading={loading}
                >
                  Log In
                </Button>
                <Typography
                  variant="small"
                  className="mt-6 flex justify-center"
                >
                  Don&apos;t have an account?
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="ml-1 font-bold"
                  >
                    <Link
                      to="/vendor/register"
                      state={{ headerTitle: "Vendor Registration" }}
                    >
                      Register
                    </Link>
                  </Typography>
                </Typography>
              </CardFooter>
            </form>
          </Card>
        </article>
        <article className="bg-[#F6962E] grid px-6 py-5 md:px-24 md:py-10 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <Typography
            variant="h3"
            color="white"
            className="md:col-span-2 lg:col-span-3 text-center font-semibold"
          >
            WHY USE THIS SITE?
          </Typography>
          {CARDINFO.map((card, index) => (
            <div key={index} className="flex flex-col items-center">
              {card.icon && (
                <img
                  src={card.icon}
                  alt={`Icon for ${card.title}`}
                  className="w-24 h-24 mb-2 rounded-full object-cover"
                />
              )}
              <Typography variant="h5" className="text-white">
                {card.title}
              </Typography>
              <Typography variant="small" className="text-white text-center ">
                {card.desc}
              </Typography>
            </div>
          ))}
        </article>

        <article className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-6 py-5 md:px-24 md:py-20 gap-3">
          <Typography
            variant="h3"
            className="sm:col-span-2 lg:col-span-4 text-center font-semibold"
          >
            HOW TO START SELLING
          </Typography>
          <div className="flex flex-col text-center">
            <Typography variant="h1">01</Typography>
            <p className="mt-2">
              <Typography variant="h5">Sign up for an account</Typography>
              <Typography variant="small" color="blue-gray">
                Create a free account to start selling products
              </Typography>
            </p>
          </div>
          <div className="flex flex-col text-center">
            <Typography variant="h1">02</Typography>
            <p className="mt-2">
              <Typography variant="h5">
                Complete account verification
              </Typography>
              <Typography variant="small" color="blue-gray">
                Verify your email address to complete your account registration.
              </Typography>
            </p>
          </div>
          <div className="flex flex-col text-center">
            <Typography variant="h1">03</Typography>
            <p className="mt-2">
              <Typography variant="h5">Wait for store approval</Typography>
              <Typography variant="small" color="blue-gray">
                Once your account is verified, wait for your store to be
                approved by the school administrator.
              </Typography>
            </p>
          </div>
          <div className="flex flex-col text-center">
            <Typography variant="h1">04</Typography>
            <p className="mt-2">
              <Typography variant="h5">Upload your products</Typography>
              <Typography variant="small" color="blue-gray">
                Upload your products to your store to start selling them.
              </Typography>
            </p>
          </div>
        </article>
      </section>
      <Footer />
    </>
  );
};

export default VendorLogin;
