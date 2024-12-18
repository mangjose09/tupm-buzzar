import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
  Typography,
} from "@material-tailwind/react";

function Icon({ id, open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`${
        id === open ? "rotate-180" : ""
      } h-5 w-5 transition-transform`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}

const FAQPage = () => {
  const [open, setOpen] = useState(0);

  const handleOpen = (value) => setOpen(open === value ? 0 : value);

  const faqs = [
    {
      id: 1,
      question: "What is BUZZAR?",
      answer:
        "Bridging University Zones for Zero-cost Access to Resources, BUZZAR is an online marketplace exclusive to our university, designed to support student entrepreneurs and campus-based vendors by offering a secure, user-friendly platform for buying and selling products and services within the campus community.",
    },
    {
      id: 2,
      question: "Who can use BUZZAR?",
      answer:
        "BUZZAR is open to students, faculty, and authorized campus-based vendors.",
    },
    {
      id: 3,
      question: "What payment methods are available?",
      answer:
        "Currently, BUZZAR accepts cash payments only. We understand the desire for more flexible options and are actively working toward including digital payment methods in the near future to enhance convenience and accessibility for all users. We appreciate your patience and understanding as we prioritize creating a secure and user-friendly experience on BUZZAR.",
    },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen px-6 py-5 md:px-24 md:py-10 space-y-10">
        <header className="w-full text-center">
          <Typography variant="h2">Frequently Asked Questions</Typography>
          <Typography variant="lead">
            Find answers to common questions about our site.
          </Typography>
        </header>
        <section>
          {faqs.map((faq) => (
            <Accordion
              key={faq.id}
              open={open === faq.id}
              icon={<Icon id={faq.id} open={open} />}
            >
              <AccordionHeader
                className="hover:text-[#F8B34B] hover:underline transition-all duration-300"
                onClick={() => handleOpen(faq.id)}
              >
                {faq.question}
              </AccordionHeader>
              <AccordionBody>{faq.answer}</AccordionBody>
            </Accordion>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default FAQPage;
