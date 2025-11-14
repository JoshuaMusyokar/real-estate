import { Building2, Phone, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black">Bengal Property</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md font-medium">
              Your trusted partner in finding the perfect property. We connect
              buyers, sellers, and renters with premium real estate
              opportunities.
            </p>
            <div className="flex gap-4">
              <a
                href="tel:+1234567890"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="font-semibold">+1 (234) 567-890</span>
              </a>
              <a
                href="mailto:info@bengalproperty.com"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span className="font-semibold">info@bengalproperty.com</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-black text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {["About Us", "Properties", "Agents", "Blog", "Contact"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-gray-400 hover:text-white transition-colors font-semibold"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-black text-lg mb-4">Resources</h4>
            <ul className="space-y-3">
              {[
                "FAQ",
                "Privacy Policy",
                "Terms of Service",
                "Support",
                "Careers",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors font-semibold"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 font-semibold">
            © 2025 Bengal Property. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Facebook", "Twitter", "Instagram", "LinkedIn"].map((social) => (
              <a
                key={social}
                href="#"
                className="text-gray-400 hover:text-white transition-colors font-semibold"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
