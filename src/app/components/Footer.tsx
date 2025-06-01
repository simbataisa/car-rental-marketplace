import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p className="text-gray-600">
              AutoRent Connect is your trusted platform for car rentals in
              Vietnam, connecting car owners with renters seamlessly.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/find-a-car"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Find a Car
                </Link>
              </li>
              <li>
                <Link
                  href="/automated-rentals"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Automated Rentals
                </Link>
              </li>
              <li>
                <Link
                  href="/business-model"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Business Model
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-gray-900">
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="space-y-2 text-gray-600">
              <p>Email: contact@autorentconnect.com</p>
              <p>Phone: +84 123 456 789</p>
              <p>Address: Ho Chi Minh City, Vietnam</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-gray-600">
          <p>© {currentYear} AutoRent Connect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
