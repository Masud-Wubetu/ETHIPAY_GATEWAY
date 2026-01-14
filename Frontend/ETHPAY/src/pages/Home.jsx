// pages/Home.jsx
import { Link } from "react-router-dom";



export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">

      <header className="flex flex-col items-center justify-center text-center py-32 bg-indigo-50">
        <h1 className="text-5xl font-bold text-indigo-600 mb-4">Welcome to ETHPAY</h1>
        <p className="text-gray-700 max-w-xl mb-6">
          Simplifying payments, secure transactions, and real-time notifications for merchants and users alike.
        </p>

        <div className="space-x-4">
          <Link
            to="/register"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Create Account
          </Link>

          <a
            href="#contact"
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Contact Us
          </a>
        </div>
      </header>

      {/* Quotes / About Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-bold text-indigo-600">Why Choose ETHPAY?</h2>
          <p className="text-gray-700">
            "ETHPAY empowers businesses and individuals with fast, secure, and reliable payment processing."
          </p>
          <p className="text-gray-700">
            "Seamless transactions, real-time updates, and comprehensive dashboards for smarter financial management."
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 bg-indigo-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-indigo-600 mb-4">Contact Us</h2>
          <p className="text-gray-700 mb-6">
            Email: support@ethpay.com | Phone: +251 911 000000
          </p>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <textarea
              placeholder="Message"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            ></textarea>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
