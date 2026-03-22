import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Send,
  Building2,
  ShieldCheck,
  Award,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import appLogo from "../assets/p4i.png";

export const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [disclaimerExpanded, setDisclaimerExpanded] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter subscription:", email);
    setEmail("");
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 3000);
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
      hoverBg: "hover:bg-blue-600",
    },
    {
      name: "Twitter",
      icon: Twitter,
      url: "https://twitter.com",
      hoverBg: "hover:bg-sky-500",
    },
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://instagram.com",
      hoverBg: "hover:bg-pink-500",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: "https://linkedin.com",
      hoverBg: "hover:bg-blue-700",
    },
    {
      name: "YouTube",
      icon: Youtube,
      url: "https://youtube.com",
      hoverBg: "hover:bg-red-600",
    },
  ];

  const trustBadges = [
    { icon: Building2, label: "Licensed Real Estate" },
    { icon: ShieldCheck, label: "Verified Properties" },
    { icon: Award, label: "Award Winning" },
  ];

  return (
    <footer className="bg-gray-950 text-white">
      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-12">
          {/* Company info — full width on xs, 2 cols on sm, 5 cols on lg */}
          <div className="col-span-2 lg:col-span-5">
            {/* Logo */}
            <Link to="/" className="inline-block mb-3 sm:mb-4">
              <img
                src={appLogo}
                alt="Property4India"
                className="h-8 sm:h-10 w-auto object-contain"
                style={{
                  filter: "brightness(0) invert(1)",
                }} /* white on dark bg */
              />
            </Link>

            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-5 max-w-sm">
              Your trusted partner in finding the perfect property. We connect
              buyers, sellers, and renters with premium real estate
              opportunities across India.
            </p>

            {/* Contact details */}
            <div className="space-y-2 sm:space-y-2.5">
              {[
                {
                  href: "tel:+1234567890",
                  icon: Phone,
                  label: "+91 (234) 567-890",
                },
                {
                  href: "mailto:info@property4india.in",
                  icon: Mail,
                  label: "info@property4india.in",
                },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={href}
                  href={href}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-800 group-hover:bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium">
                    {label}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 lg:col-span-2">
            <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider mb-3 sm:mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 sm:space-y-2.5">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-gray-400 hover:text-white text-xs sm:text-sm font-medium transition-colors inline-flex items-center gap-1 group"
                  >
                    <span className="w-0 group-hover:w-2 overflow-hidden transition-all duration-200 text-blue-400">
                      ›
                    </span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="col-span-1 lg:col-span-2">
            <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider mb-3 sm:mb-4">
              Resources
            </h4>
            <ul className="space-y-2 sm:space-y-2.5">
              {resources.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-gray-400 hover:text-white text-xs sm:text-sm font-medium transition-colors inline-flex items-center gap-1 group"
                  >
                    <span className="w-0 group-hover:w-2 overflow-hidden transition-all duration-200 text-blue-400">
                      ›
                    </span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter — full width on xs/sm, 3 cols on lg */}
          <div className="col-span-2 lg:col-span-3">
            <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider mb-1 sm:mb-2">
              Stay Updated
            </h4>
            <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
              Get the latest property listings and market insights.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="
                  w-full px-3 py-2 sm:py-2.5
                  bg-gray-800 border border-gray-700
                  text-white placeholder-gray-500
                  text-xs sm:text-sm rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  transition-all
                "
              />
              <button
                type="submit"
                className="
                  w-full flex items-center justify-center gap-2
                  py-2 sm:py-2.5
                  bg-blue-600 hover:bg-blue-700
                  text-white font-bold text-xs sm:text-sm
                  rounded-lg transition-colors
                "
              >
                {subscribed ? (
                  "Subscribed ✓"
                ) : (
                  <>
                    <span>Subscribe</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* Social icons */}
            <div className="flex items-center gap-2 mt-4 sm:mt-5">
              {socialLinks.map(({ name, icon: Icon, url, hoverBg }) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className={`w-8 h-8 sm:w-9 sm:h-9 bg-gray-800 ${hoverBg} rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all`}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Disclaimer box ───────────────────────────────────────────────── */}
        <div className="border-t border-gray-800 pt-5 sm:pt-6 mb-4 sm:mb-5">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-3.5 sm:p-4">
            {/* Always-visible: first 2 lines */}
            <p
              className={`text-gray-500 text-[10px] sm:text-xs leading-relaxed ${disclaimerExpanded ? "" : "line-clamp-2"}`}
            >
              Property4india.com provides an advertising platform for sellers to
              list their properties. We act solely as an intermediary and are
              not involved in, nor do we control, any transactions between
              sellers and users/buyers visiting our website. Any offers or
              discounts displayed are directly from the
              builders/developers/Brokers or Sellers advertising their products.
              Property4india.com facilitates communication of these offers but
              does not sell or provide the actual products or services. We do
              not guarantee or make any representations regarding the offers
              presented. Property4india.com is not responsible for mediating or
              resolving any disputes between sellers and users/buyers; all such
              matters should be settled directly between the parties involved
              without Property4india.com participation.
            </p>

            {/* Toggle */}
            <button
              onClick={() => setDisclaimerExpanded((s) => !s)}
              className="mt-1.5 flex items-center gap-1 text-[10px] sm:text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            >
              {disclaimerExpanded ? (
                <>
                  <ChevronUp className="w-3 h-3" /> Show less
                </>
              ) : (
                <>
                  <ChevronDown className="w-3 h-3" /> More
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── Bottom bar ───────────────────────────────────────────────────── */}
        <div className="border-t border-gray-800 pt-5 sm:pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <p className="text-gray-500 text-[10px] sm:text-xs font-medium text-center sm:text-left">
              Trademarks, logos and names belong to their respective owners. All
              rights reserved. &copy; {new Date().getFullYear()}{" "}
              Property4india.com
            </p>

            {/* Legal links */}
            <div className="flex items-center gap-3 sm:gap-4">
              {["Privacy", "Terms", "Cookies", "Sitemap"].map(
                (label, i, arr) => (
                  <span
                    key={label}
                    className="flex items-center gap-3 sm:gap-4"
                  >
                    <Link
                      to="#"
                      className="text-[10px] sm:text-xs text-gray-500 hover:text-white transition-colors"
                    >
                      {label}
                    </Link>
                    {i < arr.length - 1 && (
                      <span className="text-gray-700">·</span>
                    )}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Trust badges ─────────────────────────────────────────────────── */}
      <div className="border-t border-gray-800 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            {trustBadges.map(({ icon: Icon, label }, i) => (
              <span key={label} className="flex items-center">
                <span className="flex items-center gap-1.5 text-gray-500">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gray-800 rounded flex items-center justify-center">
                    <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium">
                    {label}
                  </span>
                </span>
                {i < trustBadges.length - 1 && (
                  <span className="hidden sm:block w-px h-4 bg-gray-800 ml-4 sm:ml-8" />
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
