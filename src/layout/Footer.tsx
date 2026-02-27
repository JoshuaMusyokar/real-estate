// components/layout/Footer.tsx
import { Link } from "react-router-dom";
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Send,
} from "lucide-react";
import { useState } from "react";
import appLogo from "../assets/logomin.png";

export const Footer = () => {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Newsletter subscription:", email);
    setEmail("");
  };

  const quickLinks = [
    { name: "About Us", path: "#" },
    { name: "Properties", path: "/" },
    { name: "Agents", path: "/agents" },
    { name: "Blog", path: "/news" },
    { name: "Contact", path: "#" },
  ];

  const resources = [
    { name: "FAQ", path: "/faqs" },
    { name: "Privacy Policy", path: "#" },
    { name: "Terms of Service", path: "#" },
    { name: "Support", path: "#" },
    { name: "Careers", path: "#" },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      url: "https://facebook.com",
      color: "hover:text-blue-500",
    },
    {
      name: "Twitter",
      icon: Twitter,
      url: "https://twitter.com",
      color: "hover:text-sky-400",
    },
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://instagram.com",
      color: "hover:text-pink-500",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: "https://linkedin.com",
      color: "hover:text-blue-600",
    },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-10 md:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8 md:gap-10 lg:gap-12 mb-8 sm:mb-10 md:mb-12">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-5">
            <Link to="/" className="">
              <img
                src={appLogo}
                alt="Property4india Property"
                className="h-42 w-58 object-contain"
              />
              {/* <span className="text-xl sm:text-2xl font-black text-blue-500">
                BENGALPROPERTY
              </span>
              <span className="text-lg sm:text-xl font-bold text-gray-300">
                .COM
              </span> */}
            </Link>

            <p className="text-gray-400 mb-4 sm:mb-5 md:mb-6 text-sm sm:text-base max-w-md leading-relaxed">
              Your trusted partner in finding the perfect property. We connect
              buyers, sellers, and renters with premium real estate
              opportunities.
            </p>

            {/* Contact Info */}
            <div className="space-y-2.5 sm:space-y-3">
              <a
                href="tel:+1234567890"
                className="flex items-center gap-2 sm:gap-2.5 text-gray-400 hover:text-white transition-colors group"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                  <Phone className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </div>
                <span className="text-sm sm:text-base font-medium">
                  +1 (234) 567-890
                </span>
              </a>

              <a
                href="mailto:info@bengalproperty.com"
                className="flex items-center gap-2 sm:gap-2.5 text-gray-400 hover:text-white transition-colors group"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                  <Mail className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </div>
                <span className="text-sm sm:text-base font-medium">
                  info@bengalproperty.com
                </span>
              </a>

              <div className="flex items-start gap-2 sm:gap-2.5 text-gray-400">
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </div>
                <span className="text-sm sm:text-base font-medium leading-relaxed">
                  123 Property Street, Real Estate City, RE 12345
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-base sm:text-lg mb-3 sm:mb-4 text-white">
              Quick Links
            </h4>
            <ul className="space-y-2 sm:space-y-2.5">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base font-medium inline-block hover:translate-x-1 duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-base sm:text-lg mb-3 sm:mb-4 text-white">
              Resources
            </h4>
            <ul className="space-y-2 sm:space-y-2.5">
              {resources.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base font-medium inline-block hover:translate-x-1 duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="sm:col-span-2 lg:col-span-3">
            <h4 className="font-bold text-base sm:text-lg mb-3 sm:mb-4 text-white">
              Stay Updated
            </h4>
            <p className="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base">
              Subscribe to our newsletter for the latest properties and updates.
            </p>
            <form
              onSubmit={handleNewsletterSubmit}
              className="space-y-2.5 sm:space-y-3"
            >
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base transition-all"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <span>Subscribe</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6 sm:pt-7 md:pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            {/* Copyright */}
            <p className="text-gray-400 text-xs sm:text-sm font-medium text-center sm:text-left">
              © {new Date().getFullYear()} Bengal Property. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 sm:gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-9 h-9 sm:w-10 sm:h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-700 transition-all ${social.color}`}
                    aria-label={social.name}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Additional Links (Mobile) */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-gray-800 sm:hidden">
            <Link
              to="#"
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Privacy
            </Link>
            <span className="text-gray-700">•</span>
            <Link
              to="/#"
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Terms
            </Link>
            <span className="text-gray-700">•</span>
            <Link
              to="/#"
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Cookies
            </Link>
            <span className="text-gray-700">•</span>
            <Link
              to="/#"
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>

      {/* Trust Badges / Certifications (Optional) */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8">
            <div className="flex items-center gap-2 text-gray-500">
              <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-medium">
                Licensed Real Estate
              </span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-gray-800" />
            <div className="flex items-center gap-2 text-gray-500">
              <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center">
                ✓
              </div>
              <span className="text-xs sm:text-sm font-medium">
                Verified Properties
              </span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-gray-800" />
            <div className="flex items-center gap-2 text-gray-500">
              <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center">
                🏆
              </div>
              <span className="text-xs sm:text-sm font-medium">
                Award Winning
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
