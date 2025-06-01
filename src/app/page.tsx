"use client";

import { Button } from "@/components/ui/button";
import { Navbar } from "./components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Navbar />
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

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center">
            <p className="mb-4">
              © 2025 AutoRent Connect Vietnam. All Rights Reserved.
            </p>
            <p className="mb-8">
              Pioneering the future of car rentals in Vietnam.
            </p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="hover:text-white transition-colors">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
