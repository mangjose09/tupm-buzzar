import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Typography } from "@material-tailwind/react";

const TermsAndConditionPage = () => {
  return (
    <>
      <Header />
      <main className="min-h-screen px-6 py-5 md:px-24 md:py-10 space-y-10">
        <header className="w-full text-center">
          <Typography variant="h2">Terms and Conditions</Typography>
        </header>
        <section>
          <Typography variant="h4">1. User Agreement</Typography>
          <Typography variant="paragraph">
            By using BUZZAR, you agree to comply with these terms. BUZZAR
            provides a platform for students and campus-based vendors to sell
            products and services within a university setting, with the aim of
            creating a secure and supportive environment for transactions.
          </Typography>
        </section>

        <section>
          <Typography variant="h4"> 2. Vendor and Customer Conduct</Typography>
          <>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>
                Vendors must provide accurate information about their products
                and services.
              </li>
              <li>
                Customers and vendors are expected to engage professionally and
                respectfully.
              </li>
              <li>
                Any inappropriate, fraudulent, or prohibited activities will
                lead to account suspension or termination.
              </li>
            </ul>
          </>
        </section>

        <section>
          <Typography variant="h4">
            {" "}
            3. Product Listings and Transactions
          </Typography>
          <Typography variant="paragraph" className="mb-4">
            BUZZAR reserves the right to monitor, approve, or reject listings to
            maintain platform integrity. Both vendors and customers acknowledge
            that they are responsible for the fulfillment and accuracy of
            transactions made on BUZZAR.
          </Typography>
        </section>

        <section>
          <Typography variant="h4"> 4. Liability Disclaimer</Typography>
          <Typography variant="paragraph" className="mb-4">
            BUZZAR is not liable for any direct or indirect damages resulting
            from transactions on the platform, including product quality or
            delivery issues. All transactions are completed at the users’ risk.
          </Typography>
        </section>

        <section>
          <Typography variant="h4">5. Privacy and Data Security</Typography>
          <Typography variant="paragraph" className="mb-4">
            All users’ personal information will be protected under our Privacy
            Policy. User data will only be used to improve user experience,
            provide services, and maintain security on BUZZAR.
          </Typography>
        </section>
        <section>
          <Typography variant="h4">6. Contact Us </Typography>
          <p className="mb-4">
            If you have any questions about this Terms and Condition, please
            contact us at:
          </p>
          <address className="not-italic">
            <Typography variant="paragraph">
              San Marcelino St, Ayala Blvd, Ermita, Manila, 1000, Philippines
            </Typography>
            <Typography as="a" href="mailto:info@buzzar.com" className="">
              Email:{" "}
              <span className="text-blue-gray-400 hover:underline hover:text-black transition-all duration-300">
                info@buzzar.com
              </span>
            </Typography>
            <Typography as="a" href="tel:+1234567890" variant="paragraph">
              Call us:{" "}
              <span className="text-blue-gray-400 hover:underline hover:text-black transition-all duration-300">
                +123 456 7890
              </span>
            </Typography>
          </address>
        </section>

        <Typography variant="small" color="blue-gray" className="mt-8">
          Last updated: October 08, 2024
        </Typography>
      </main>
      <Footer />
    </>
  );
};

export default TermsAndConditionPage;
