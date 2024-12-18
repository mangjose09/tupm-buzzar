import React from "react";

const TermsAndConditions = () => {
  const termsList = [
    {
      title: "User Agreement",
      content:
        "By using BUZZAR, you agree to comply with these terms. BUZZAR provides a platform for students and campus-based vendors to sell products and services within a university setting, with the aim of creating a secure and supportive environment for transactions.",
    },
    {
      title: "Vendor and Customer Conduct",
      content:
        "Vendors must provide accurate information about their products and services. Customers and vendors are expected to engage professionally and respectfully. Any inappropriate, fraudulent, or prohibited activities will lead to account suspension or termination.",
    },
    {
      title: "Product Listings and Transactions",
      content:
        "BUZZAR reserves the right to monitor, approve, or reject listings to maintain platform integrity. Both vendors and customers acknowledge that they are responsible for the fulfillment and accuracy of transactions made on BUZZAR.",
    },
    {
      title: "Liability Disclaimer",
      content:
        "BUZZAR is not liable for any direct or indirect damages resulting from transactions on the platform, including product quality or delivery issues. All transactions are completed at the users’ risk.",
    },
    {
      title: "Privacy and Data Security",
      content:
        "All users’ personal information will be protected under our Privacy Policy. User data will only be used to improve user experience, provide services, and maintain security on BUZZAR.",
    },
    {
      title: "Contact Us",
      content:
        "If you have any questions about this Terms and Condition, please contact us at: San Marcelino St, Ayala Blvd, Ermita, Manila, 1000, Philippines. Email: info@buzzar.com. Call us: +123 456 7890. Last updated: October 08, 2024.",
    },
  ];

  return (
    <div>
      <ul className="h-[300px] overflow-auto space-y-4">
        {termsList.map((term, index) => (
          <li key={index}>
            <h3 className="font-semibold text-lg">{term.title}</h3>
            <p className="text-sm text-gray-700 mt-1">{term.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TermsAndConditions;
