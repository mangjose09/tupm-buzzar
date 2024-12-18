import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { RocketLaunchIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import CustomerLayout from "../components/customer/CustomerLayout";
const DEVELOPERS = [
  {
    name: "Jose Virgilio Domingo",
    image: "/Madman.jpg",
    role: "Project Manager/Full Stack Developer",
  },
  {
    name: "Miles Joseph Bacay",
    image: "/Bacay.png",
    role: "Backend Developer",
  },
  {
    name: "Charles Hendrick Garcia",
    image: "/Garcia.png",
    role: "UI/UX Designer",
  },
  {
    name: "Federico Cadorna",
    image: "/Cadorna.png",
    role: "Quality Analyst I",
  },
  {
    name: "Carl Jason Baon",
    image: "/Baon.png",
    role: "Quality Analyst II",
  },
  {
    name: "Luiz Valentine Cristobal",
    image: "/Cristobal.png",
    role: "Content Strategist",
  },
];

const AboutUsPage = () => {
  return (
    <>
      <Header />
      <CustomerLayout>
        <main className="min-h-screen px-6 py-5 md:px-24 md:py-10 space-y-10">
          <header className="w-full text-center">
            <Typography variant="h2">About Us</Typography>
            <Typography variant="lead">
              One-Stop site for all your college needs.
            </Typography>
          </header>
          <section className="grid md:grid-cols-2 gap-5">
            <Card className="w-full">
              <CardBody>
                <Typography
                  variant="h4"
                  color="blue-gray"
                  className="flex items-center mb-2"
                >
                  <RocketLaunchIcon className="h-5 w-5 mr-2" />
                  Our mission
                </Typography>
                <Typography variant="paragraph">
                  To empower the entrepreneurial spirit within the Technological
                  University of the Philippines (TUP) by providing a secure,
                  innovative, and user-friendly platform for student-run
                  businesses and campus-based entrepreneurs. We aim to foster a
                  collaborative marketplace that promotes growth, transparency,
                  and accessibility, enabling our users to thrive in their
                  business ventures while contributing to the university
                  community’s economic and social development.
                </Typography>
              </CardBody>
            </Card>
            <Card className="w-full">
              <CardBody>
                <Typography
                  variant="h4"
                  color="blue-gray"
                  className="flex items-center mb-2"
                >
                  <GlobeAltIcon className="h-5 w-5 mr-2" />
                  Our vision
                </Typography>
                <Typography variant="paragraph">
                  To become the leading e-commerce platform in academic
                  institutions, setting the standard for innovation and
                  entrepreneurial excellence. We strive to create a dynamic and
                  sustainable ecosystem that connects students, faculty, and
                  campus entrepreneurs, driving economic empowerment and
                  fostering a culture of entrepreneurship within TUP-Manila.
                  BUZZAR envisions a future where every student entrepreneur has
                  the tools and support needed to succeed in a competitive
                  marketplace.
                </Typography>
              </CardBody>
            </Card>
          </section>
          <section className="space-y-4">
            <Typography variant="h3" className="text-center">
              Meet Our Team
            </Typography>
            <article className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {DEVELOPERS.map((developer) => (
                <div className="flex justify-center">
                  <Card key={developer.name} className="w-72">
                    <CardHeader floated={false}>
                      <img
                        className="object-cover object-top w-full h-[150px]"
                        src={developer.image}
                        alt={developer.name}
                      />
                    </CardHeader>
                    <CardBody>
                      <Typography variant="h5" color="blue-gray">
                        {developer.name}
                      </Typography>
                      <Typography variant="subtitle2" color="gray-600">
                        {developer.role}
                      </Typography>
                    </CardBody>
                  </Card>
                </div>
              ))}
            </article>
          </section>
        </main>
        <Footer />
      </CustomerLayout>
    </>
  );
};

export default AboutUsPage;
