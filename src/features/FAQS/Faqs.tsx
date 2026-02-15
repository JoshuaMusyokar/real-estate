import { useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  Home,
  DollarSign,
  FileText,
  Users,
  Shield,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "../../components/ui/Card";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

interface FAQCategory {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
}

export const FAQ: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0]));

  const categories: FAQCategory[] = [
    {
      id: "all",
      name: "All Questions",
      icon: HelpCircle,
      color: "text-gray-600 dark:text-gray-400",
    },
    {
      id: "buying",
      name: "Buying Property",
      icon: Home,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      id: "selling",
      name: "Selling Property",
      icon: DollarSign,
      color: "text-green-600 dark:text-green-400",
    },
    {
      id: "renting",
      name: "Renting",
      icon: FileText,
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      id: "agents",
      name: "Agents & Services",
      icon: Users,
      color: "text-orange-600 dark:text-orange-400",
    },
    {
      id: "legal",
      name: "Legal & Documentation",
      icon: Shield,
      color: "text-red-600 dark:text-red-400",
    },
  ];

  const faqs: FAQItem[] = [
    // Buying Property
    {
      category: "buying",
      question: "How do I start the process of buying a property?",
      answer:
        "Start by determining your budget and getting pre-approved for a mortgage. Then, work with our agents to identify properties that match your criteria. We'll guide you through property visits, negotiations, and the entire purchasing process until you get the keys to your new home.",
    },
    {
      category: "buying",
      question: "What documents do I need to buy a property?",
      answer:
        "You'll typically need: proof of identity (passport/driver's license), proof of income (salary slips, tax returns), bank statements (last 6 months), credit report, and proof of address. Additional documents may be required depending on your financing method.",
    },
    {
      category: "buying",
      question: "How long does the buying process take?",
      answer:
        "The typical timeline is 30-60 days from offer acceptance to closing. This includes: property inspection (1-2 weeks), mortgage approval (2-4 weeks), title search and insurance (1-2 weeks), and final paperwork (1 week). However, this can vary based on financing and property conditions.",
    },
    {
      category: "buying",
      question: "What are closing costs and how much should I expect to pay?",
      answer:
        "Closing costs typically range from 2-5% of the property's purchase price. These include: loan origination fees, appraisal fees, title insurance, attorney fees, property taxes, and homeowner's insurance. We'll provide a detailed breakdown before closing.",
    },

    // Selling Property
    {
      category: "selling",
      question: "How do I determine the right price for my property?",
      answer:
        "Our agents conduct a comprehensive market analysis considering: recent sales of similar properties in your area, current market conditions, your property's unique features, and location. We'll provide a detailed report and recommend a competitive listing price that maximizes your return.",
    },
    {
      category: "selling",
      question: "What should I do to prepare my property for sale?",
      answer:
        "Key preparations include: deep cleaning and decluttering, minor repairs and touch-ups, enhancing curb appeal, staging key rooms, professional photography, and addressing any inspection issues proactively. We provide a detailed checklist and can recommend trusted service providers.",
    },
    {
      category: "selling",
      question: "How long will it take to sell my property?",
      answer:
        "The average time on market varies by location and market conditions, typically 30-90 days. Factors affecting timeline include: pricing strategy, property condition, location desirability, market activity, and marketing efforts. Well-priced properties in good condition often sell faster.",
    },
    {
      category: "selling",
      question: "What are the costs involved in selling a property?",
      answer:
        "Typical selling costs include: agent commission (5-6%), transfer taxes, title insurance, attorney fees, home warranty, and any repairs or improvements. Total costs usually range from 8-10% of the sale price. We'll provide a detailed estimate upfront.",
    },

    // Renting
    {
      category: "renting",
      question: "What is the rental application process?",
      answer:
        "The process includes: submitting an application with personal and employment details, providing proof of income (usually 3x monthly rent), authorizing credit and background checks, providing references, and paying application fees. Approval typically takes 1-3 business days.",
    },
    {
      category: "renting",
      question: "How much security deposit is required?",
      answer:
        "Security deposits typically equal one to two months' rent. This amount is held in a separate account and returned at lease end, minus any deductions for damages beyond normal wear and tear. Some landlords may offer alternatives like security deposit insurance.",
    },
    {
      category: "renting",
      question: "Can I break my lease early?",
      answer:
        "Lease terms vary, but most allow early termination with: 30-60 days notice, payment of an early termination fee (typically 1-2 months rent), or finding a qualified replacement tenant. Review your lease agreement or contact us for specific terms and options.",
    },
    {
      category: "renting",
      question: "What's included in the rent?",
      answer:
        "This varies by property. Typically, rent covers: the unit itself and common areas. Utilities (water, electricity, gas), internet, parking, and amenities may or may not be included. Always clarify what's included before signing the lease.",
    },

    // Agents & Services
    {
      category: "agents",
      question: "How do I choose the right real estate agent?",
      answer:
        "Look for agents with: strong local market knowledge, proven track record, good communication skills, professional certifications, positive client reviews, and availability. We match you with agents who specialize in your specific needs and area.",
    },
    {
      category: "agents",
      question: "What services do your agents provide?",
      answer:
        "Our agents provide comprehensive services including: property search and showing, market analysis, negotiation, paperwork handling, inspection coordination, mortgage guidance, closing support, and post-sale assistance. We're with you every step of the way.",
    },
    {
      category: "agents",
      question: "How are agent fees structured?",
      answer:
        "For buyers, agent fees are typically paid by the seller from the sale proceeds. For sellers, commission is usually 5-6% of the sale price, split between buyer's and seller's agents. We offer competitive rates and transparent fee structures.",
    },
    {
      category: "agents",
      question: "Can I work with multiple agents?",
      answer:
        "While you can initially meet with multiple agents, it's best to work exclusively with one agent once you've found the right fit. Exclusive representation allows your agent to dedicate resources and negotiate effectively on your behalf.",
    },

    // Legal & Documentation
    {
      category: "legal",
      question: "What is title insurance and do I need it?",
      answer:
        "Title insurance protects against ownership disputes and claims on your property. While not always required, it's highly recommended as it covers legal fees and losses if title issues arise. It's a one-time premium paid at closing.",
    },
    {
      category: "legal",
      question: "What happens during a home inspection?",
      answer:
        "A licensed inspector examines the property's: structure, roof, plumbing, electrical systems, HVAC, and more. The process takes 2-4 hours and results in a detailed report. You can request repairs or negotiate price based on findings before finalizing the purchase.",
    },
    {
      category: "legal",
      question: "What is an escrow account?",
      answer:
        "Escrow is a neutral third-party account holding funds during a transaction. It ensures all conditions are met before money changes hands. For ongoing mortgages, escrow accounts hold funds for property taxes and insurance, paid annually on your behalf.",
    },
    {
      category: "legal",
      question: "Do I need a real estate attorney?",
      answer:
        "While not required in all states, having an attorney is recommended for: reviewing contracts, title examination, handling closing, addressing legal issues, and protecting your interests. The cost is typically $500-$1,500 and provides valuable peace of mind.",
    },
  ];

  const filteredFAQs = faqs.filter((faq) => {
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    const matchesSearch =
      searchTerm === "" ||
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const expandAll = () => {
    setOpenItems(new Set(filteredFAQs.map((_, index) => index)));
  };

  const collapseAll = () => {
    setOpenItems(new Set());
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-12 sm:py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 text-center">
          <HelpCircle className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-4 sm:mb-5 md:mb-6" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
            Find answers to common questions about buying, selling, and renting
            properties
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12">
        {/* Search Bar */}
        <Card className="mb-6 sm:mb-8">
          <CardContent className="p-4 sm:p-5 md:p-6">
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 md:py-3.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
              />
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              Categories
            </h2>
            <div className="flex gap-2">
              <button
                onClick={expandAll}
                className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Expand All
              </button>
              <span className="text-gray-400">|</span>
              <button
                onClick={collapseAll}
                className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Collapse All
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all text-left ${
                    isActive
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 sm:w-6 sm:h-6 mb-1.5 sm:mb-2 ${category.color}`}
                  />
                  <div className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">
                    {category.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 sm:mb-6">
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Showing{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {filteredFAQs.length}
            </span>{" "}
            {filteredFAQs.length === 1 ? "question" : "questions"}
            {searchTerm && (
              <span>
                {" "}
                matching "<span className="font-semibold">{searchTerm}</span>"
              </span>
            )}
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-3 sm:space-y-4">
          {filteredFAQs.length === 0 ? (
            <Card>
              <CardContent className="p-8 sm:p-12 text-center">
                <HelpCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 dark:text-gray-600 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No questions found
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
                  Try adjusting your search or category filter
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base font-medium"
                >
                  Clear Filters
                </button>
              </CardContent>
            </Card>
          ) : (
            filteredFAQs.map((faq, index) => {
              const isOpen = openItems.has(index);
              const categoryInfo = categories.find(
                (cat) => cat.id === faq.category,
              );
              const Icon = categoryInfo?.icon || HelpCircle;

              return (
                <Card key={index} className="overflow-hidden">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full text-left p-4 sm:p-5 md:p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isOpen
                            ? "bg-blue-100 dark:bg-blue-900/30"
                            : "bg-gray-100 dark:bg-gray-800"
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 sm:w-5 sm:h-5 ${
                            isOpen
                              ? "text-blue-600 dark:text-blue-400"
                              : categoryInfo?.color ||
                                "text-gray-600 dark:text-gray-400"
                          }`}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-1 sm:mb-1.5 pr-8 sm:pr-10">
                          {faq.question}
                        </h3>
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
                          {categoryInfo?.name}
                        </span>
                      </div>

                      <div className="flex-shrink-0">
                        {isOpen ? (
                          <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 transition-transform" />
                        ) : (
                          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 transition-transform" />
                        )}
                      </div>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6 pt-0">
                      <div className="pl-11 sm:pl-14 pr-0 sm:pr-10">
                        <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })
          )}
        </div>

        {/* Contact Section */}
        <Card className="mt-8 sm:mt-10 md:mt-12 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6 sm:p-8 md:p-10 text-center">
            <MessageCircle className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-blue-600 dark:text-blue-400 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
              Still have questions?
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 max-w-2xl mx-auto">
              Can't find the answer you're looking for? Our support team is here
              to help you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <a
                href="/contact"
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm sm:text-base"
              >
                Contact Support
              </a>

              <a
                href="tel:+1234567890"
                className="w-full sm:w-auto px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-semibold text-sm sm:text-base"
              >
                Call Us: +1 (234) 567-890
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
