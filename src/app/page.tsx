"use client";

import { Button } from "@/components/ui/button";
import { Navbar } from "./components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-8">
            <h1 className="text-5xl font-bold mb-4">
              Revolutionizing Car Rentals in Vietnam
            </h1>
            <p className="text-xl mb-8">
              Connecting you to a seamless rental experience with traditional
              and automated self-service options.
            </p>
            <Link href="/search">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 text-lg">
                Find Your Perfect Ride
              </Button>
            </Link>
          </div>
        </div>

        {/* Platform Features */}
        <div className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-8">
            <h2 className="text-4xl font-bold mb-4 text-center">
              Our <span className="text-blue-600">Platform Features</span>
            </h2>
            <p className="text-center text-gray-600 mb-16">
              A comprehensive marketplace designed for convenience, efficiency,
              and scalability, catering to both customers and dealers.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-blue-600 mb-4">
                  <svg
                    className="w-12 h-12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Advanced Booking Engine
                </h3>
                <p className="text-gray-600">
                  Real-time availability from all connected dealers, dynamic
                  pricing, and seamless reservation management.
                </p>
              </div>

              <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-blue-600 mb-4">
                  <svg
                    className="w-12 h-12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Comprehensive Inventory
                </h3>
                <p className="text-gray-600">
                  A wide array of vehicles from diverse dealer networks, all
                  accessible in one place.
                </p>
              </div>

              <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-blue-600 mb-4">
                  <svg
                    className="w-12 h-12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      d="M12 15v2m0 0v2m0-2h2m-2 0H8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Secure User Management
                </h3>
                <p className="text-gray-600">
                  Dedicated portals for customers, dealers, and administrators
                  with role-based access.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Automated Rentals Section */}
        <div className="py-20 bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-4">
                  The Future:{" "}
                  <span className="text-blue-400">Automated Rentals</span>
                </h2>
                <p className="text-gray-300 mb-8">
                  Experience the ultimate convenience with our self-service
                  automated rental depots. Pick up and drop off your vehicle on
                  your schedule, 24/7.
                </p>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="text-blue-400">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">
                        Keyless Entry Solutions
                      </h3>
                      <p className="text-gray-400">
                        Access vehicles using your smartphone via Bluetooth or
                        NFC.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="text-blue-400">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">
                        Remote Vehicle Control
                      </h3>
                      <p className="text-gray-400">
                        Lock/unlock and manage your rental remotely through our
                        secure app.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-w-16 aspect-h-9 rounded-xl bg-gray-800 p-8">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-4">
                      Automated Rental Depot
                    </h3>
                    <p className="text-gray-400">
                      Our pilot programs in Binh Dinh and Phu Quoc are paving
                      the way for a nationwide rollout.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Business Model Section */}
        <div className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-8">
            <h2 className="text-4xl font-bold mb-4 text-center">
              Our <span className="text-blue-600">Business Model</span>
            </h2>
            <p className="text-center text-gray-600 mb-16">
              We're building a thriving ecosystem that benefits both car rental
              providers and customers across Vietnam.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-blue-600">
                    A Centralized Marketplace for All
                  </h3>
                  <p className="text-gray-600">
                    AutoRent Connect operates as a dynamic central marketplace.
                    We unite a wide network of car rental dealers with a broad
                    spectrum of customers.
                  </p>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <svg
                      className="w-6 h-6 text-green-500 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-600">
                      Empowering Dealers: Providing a unified platform to
                      showcase their fleet.
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <svg
                      className="w-6 h-6 text-green-500 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-600">
                      Delighting Customers: Offering a one-stop-shop to compare
                      vehicles and prices.
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <svg
                      className="w-6 h-6 text-green-500 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-600">
                      Facilitating Connections: Our technology enables smooth
                      transactions.
                    </span>
                  </li>
                </ul>
              </div>
              <div className="bg-blue-50 p-8 rounded-xl">
                <h3 className="text-2xl font-bold mb-4 text-center">
                  Marketplace Ecosystem
                </h3>
                <p className="text-center text-gray-600">
                  Our platform acts as the central hub, connecting customers
                  with a diverse range of vehicle providers.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Contact Section */}
        <div className="py-20 bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-8">
            <h2 className="text-4xl font-bold mb-4 text-center">
              Get In <span className="text-blue-400">Touch</span>
            </h2>
            <p className="text-center text-gray-300 mb-12">
              We're excited to hear from potential partners, dealers, and
              customers. Reach out to learn more about AutoRent Connect.
            </p>

            <div className="max-w-2xl mx-auto bg-white rounded-xl p-8 shadow-lg">
              <form className="space-y-6">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Inquiry about..."
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your message..."
                  ></textarea>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors">
                  Send Message
                </Button>
                <p className="text-center text-sm text-gray-500 mt-4">
                  This is a demo form. Submissions are not monitored.
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
