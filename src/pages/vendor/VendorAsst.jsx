import React from "react";
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
import { BuildingStorefrontIcon } from "@heroicons/react/24/outline";

function AccordionItem({ open, setOpen, title, content }) {
  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  return (
    <Accordion open={open === title} className="mt-4">
      <AccordionHeader onClick={() => handleOpen(title)}>
        {title}
      </AccordionHeader>
      <AccordionBody>{content}</AccordionBody>
    </Accordion>
  );
}

const VendorAsst = () => {
  const [open, setOpen] = React.useState(0); // Track which accordion is open

  return (
    <>
      <Header />
      <main className="min-h-screen px-6 py-5 md:px-24 md:py-10 space-y-10">
        <header className="w-full text-center">
          <Typography variant="h2">Vendor Assistance</Typography>
          <Typography variant="lead">
            Know more about being a vendor.
          </Typography>
        </header>

        <section>
          <Typography variant="h5" className="flex items-center">
            <BuildingStorefrontIcon className="w-8 h-8  mr-2 text-[#F8B34B]" />
            How to be a vendor?
          </Typography>
          <article className="mt-4 flex flex-col md:flex-row flex-start gap-x-3">
            <div className="md:w-2/3">
              <Typography variant="paragraph" className="mb-4">
                Follow these guidelines to become a vendor on BUZZAR.
              </Typography>
              <AccordionItem
                open={open}
                setOpen={setOpen}
                title="Eligibility Requirements"
                content="To register as a vendor, you must be a student or a campus-based business and agree to BUZZAR’s Terms and Conditions."
              />
              <AccordionItem
                open={open}
                setOpen={setOpen}
                title="Application Process"
                content={
                  <>
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>
                        Complete the Vendor Application Form: Provide
                        information about your business, product categories, and
                        agree to our terms.
                      </li>
                      <li>
                        Review Process: BUZZAR will verify your information and
                        notify you of your application status.
                      </li>
                      <li>
                        Onboarding: Approved vendors will receive onboarding
                        information to set up their profile and start listing
                        products.
                      </li>
                    </ul>
                  </>
                }
              />
              <AccordionItem
                open={open}
                setOpen={setOpen}
                title="Vendor Responsibilities"
                content={
                  <>
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>
                        Maintain Transparency: Ensure product details, pricing,
                        and availability are accurate.
                      </li>
                      <li>
                        Follow Platform Guidelines: Adhere to BUZZAR’s standards
                        for quality, professionalism, and user interaction.
                      </li>
                      <li>
                        Provide Customer Support: Vendors are responsible for
                        addressing customer queries and complaints.
                      </li>
                    </ul>
                  </>
                }
              />
            </div>
            <div className="md:w-1/3">
              <img
                src="HOW-TO-BE-A-VENDOR.png"
                alt="Vendor illustration"
                className="hidden md:inline-block rounded-lg  h-auto w-auto object-cover"
              ></img>
            </div>
          </article>
        </section>

        <section className="flex flex-col place-items-center">
          <Typography variant="paragraph">
            Interested in becoming a vendor?
          </Typography>
          <Link
            to="/vendor/register"
            state={{ headerTitle: "Vendor Registration" }}
          >
            <Button size="md" className="bg-[#F8B34B]">
              Register to be a vendor
            </Button>
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default VendorAsst;
