import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Typography } from "@material-tailwind/react";

const PrivacyPolicyPage = () => {
  return (
    <>
      <Header />
      <main className="min-h-screen px-6 py-5 md:px-24 md:py-10 space-y-10">
        <header className="w-full text-center">
          <Typography variant="h2">Privacy Policy</Typography>
        </header>
        <section>
          <Typography variant="h4">1. Introduction</Typography>
          <Typography variant="paragraph">
            Welcome to Buzzar&apos;s Privacy Policy. This policy describes how
            we collect, use, and protect your personal information when you use
            our website and services.
          </Typography>
        </section>

        <section>
          <Typography variant="h4"> 2. Information We Collect</Typography>
          <Typography variant="paragraph" className="mb-4">
            We collect the following types of information:
          </Typography>
          <ul className="list-disc list-inside mb-4">
            <li>
              Personal information (e.g., name, email address, contact
              information)
            </li>
            <li>Payment information</li>
            <li>Order history</li>
          </ul>
        </section>

        <section>
          <Typography variant="h4"> 3. How We Use Your Information</Typography>
          <Typography variant="paragraph" className="mb-4">
            We use your information to:
          </Typography>
          <ul className="list-disc list-inside mb-4">
            <li>Process and fulfill your orders</li>
            <li>Communicate with you about your orders and our services</li>
            <li>Improve our website and services</li>
          </ul>
        </section>

        <section>
          <Typography variant="h4"> 4. Data Security</Typography>
          <Typography variant="paragraph" className="mb-4">
            We implement appropriate technical and organizational measures to
            protect your personal information against unauthorized or unlawful
            processing, accidental loss, destruction, or damage.
          </Typography>
        </section>

        <section>
          <Typography variant="h4"> 5. Your Rights</Typography>
          <Typography variant="paragraph" className="mb-4">
            You have the right to:
          </Typography>
          <ul className="list-disc list-inside mb-4">
            <li>Access your personal information</li>
            <li>Correct inaccurate personal information</li>
            <li>Request deletion of your personal information</li>
            <li>Object to processing of your personal information</li>
            <li>Request restriction of processing your personal information</li>
          </ul>
        </section>

        <section>
          <Typography variant="h4">6. Cookies</Typography>
          <Typography variant="paragraph" className="mb-4">
            We use cookies to enhance your browsing experience and analyze
            website traffic. You can manage your cookie preferences through your
            browser settings.
          </Typography>
        </section>

        <section>
          <Typography variant="h4"> 7. Changes to This Policy</Typography>
          <Typography variant="paragraph" className="mb-4">
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page.
          </Typography>
        </section>

        <section>
          <Typography variant="h4"> 8. Contact Us</Typography>

          <p className="mb-4">
            If you have any questions about this Privacy Policy, please contact
            us at:
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

export default PrivacyPolicyPage;
