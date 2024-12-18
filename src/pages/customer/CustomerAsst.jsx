import React, { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";
import {
  Button,
  Typography,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

function AccordionItem({ open, setOpen, title, content }) {
  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  return (
    <Accordion open={open === title} className="mt-4">
      <AccordionHeader
        onClick={() => handleOpen(title)}
        className="md:text-xl text-sm"
      >
        {title}
      </AccordionHeader>
      <AccordionBody className="md:text-xl text-sm">{content}</AccordionBody>
    </Accordion>
  );
}

const CustomerAsst = () => {
  const [open, setOpen] = useState(0); // Track which accordion is open

  return (
    <>
      <Header />
      <main className="min-h-screen px-6 py-5 md:px-24 md:py-10 space-y-10">
        <header className="w-full text-center">
          <Typography variant="h2">Customer Assistance</Typography>
          <Typography variant="lead">
            Know more about being a customer.
          </Typography>
        </header>

        <section>
          <Typography variant="h5" className="flex items-center">
            <QuestionMarkCircleIcon className="w-8 h-8 mr-2 text-[#F8B34B]" />
            What are my perks as a customer?
          </Typography>
          <article className="mt-4 flex flex-col md:flex-row flex-start gap-x-3">
            <div className="md:w-2/3">
              <AccordionItem
                open={open}
                setOpen={setOpen}
                title="Exclusive Access to Campus Products and Services"
                content={
                  <Typography className="md:text-xl text-sm">
                    BUZZAR provides an exclusive marketplace where you can
                    access unique products and services offered by fellow
                    students and campus-based businesses.
                  </Typography>
                }
              />
              <AccordionItem
                open={open}
                setOpen={setOpen}
                title="Safe, Verified Transactions"
                content={
                  <Typography className="md:text-xl text-sm">
                    Every vendor on BUZZAR is verified, ensuring a secure
                    transaction environment. You can trust that each vendor
                    meets our community standards for quality and
                    professionalism.
                  </Typography>
                }
              />
              <AccordionItem
                open={open}
                setOpen={setOpen}
                title="Enhanced Campus Experience"
                content={
                  <Typography className="md:text-xl text-sm">
                    BUZZAR connects you with products and services tailored to
                    your needs within the university community, promoting
                    student entrepreneurship and making it convenient to support
                    your campus peers.
                  </Typography>
                }
              />
              <AccordionItem
                open={open}
                setOpen={setOpen}
                title="Convenient Payment and Delivery Options"
                content={
                  <Typography className="md:text-xl text-sm">
                    BUZZAR offers flexible payment and campus-oriented delivery
                    or pickup options to suit your lifestyle and schedule.
                  </Typography>
                }
              />
              <AccordionItem
                open={open}
                setOpen={setOpen}
                title="Customer Support"
                content={
                  <Typography className="md:text-xl text-sm">
                    Our Support Team is ready to assist you with any issues or
                    questions you may have regarding transactions, vendor
                    interactions, or product quality.
                  </Typography>
                }
              />
            </div>
            <div className="md:w-1/3">
              <img
                src="HOW-TO-BE-A-VENDOR.png"
                alt="Vendor illustration"
                className="hidden md:inline-block rounded-lg h-auto w-auto object-cover"
              ></img>
            </div>
          </article>
        </section>

        <section className="flex flex-col place-items-center">
          <Typography variant="paragraph">Start buying now.</Typography>
          <Link
            to="/customer/register"
            state={{ headerTitle: "Customer Registration" }}
          >
            <Button size="md" className="bg-[#F8B34B]">
              Register to be a customer
            </Button>
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default CustomerAsst;
