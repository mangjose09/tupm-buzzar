import React from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Input,
} from "@material-tailwind/react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/authContext";

const AdminLogin = () => {
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

  const onSubmit = (data) => {
    console.log(data);
    // Handle form submission (e.g., API call)
    login(data, "admin");

  };

  return (
    <main className="flex flex-col justify-center items-center min-h-screen bg-[#FDF6E9]">
      <header>
        <img
          src="/BUZZAR_BRAND_NAME_NO_BG.png"
          className="w-48 sm:w-auto h-20 object-contain"
          alt="Brand Logo"
        />
      </header>
      <section className="mt-10">
        <Card className="w-full sm:w-96">
          <CardHeader
            floated={false}
            className="shadow-none rounded-none text-center"
          >
            <Typography variant="h3">Admin Login</Typography>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardBody className="flex flex-col gap-5">
              <div>
                <Input
                  type="text"
                  label="Email"
                  {...register("email", { required: "Email is required" })}
                  onBlur={() => trigger("email")}
                  error={!!errors.email}
                />
                {errors.email && (
                  <Typography variant="small" color="red">
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
                  })}
                  onBlur={() => trigger("password")}
                  error={!!errors.password}
                />
                {errors.password && (
                  <Typography variant="small" color="red">
                    {errors.password.message}
                  </Typography>
                )}
              </div>
            </CardBody>
            <CardFooter className="pt-0">
              <Button type="submit"  fullWidth className="flex justify-center bg-[#F8B34B]" loading={loading}>
                Login
              </Button>
            </CardFooter>
          </form>
        </Card>
      </section>
    </main>
  );
};

export default AdminLogin;
