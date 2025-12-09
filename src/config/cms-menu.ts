export type MenuItem = {
  label: string; // Name shown in header
  url?: string; // Link (optional if dropdown)
  icon?: string; // Optional icon
  type?: "link" | "dropdown" | "mega"; // Default: "link"
  order?: number; // Sorting
  group?: string; // For grouping inside mega menu
  children?: MenuItem[]; // Sub-menu items
};

export const MENU: MenuItem[] = [
  {
    label: "Home",
    url: "/",
    type: "link",
    order: 1,
  },
  {
    label: "Property Trends",
    type: "mega",
    order: 2,
    children: [
      {
        group: "Insights",
        label: "Price Trends",
        url: "/price-trends",
      },
      {
        group: "Insights",
        label: "Demand & Supply",
        url: "/demand-supply",
      },
      {
        group: "Tools",
        label: "Heatmap",
        url: "/heatmap",
      },
    ],
  },
  {
    label: "Rent",
    type: "dropdown",
    order: 3,
    children: [
      { label: "Flats for Rent", url: "/rent/flats" },
      { label: "PG/Co-living", url: "/rent/pg" },
    ],
  },
  {
    label: "Lifestyle",
    type: "dropdown",
    order: 4,
    children: [
      { label: "Home Decor", url: "/lifestyle/decor" },
      { label: "Vastu Tips", url: "/lifestyle/vastu" },
    ],
  },
  {
    label: "Podcast",
    url: "/podcasts",
    type: "link",
    order: 5,
  },
  {
    label: "Useful Tools",
    type: "mega",
    order: 6,
    children: [
      {
        group: "Calculators",
        label: "EMI Calculator",
        url: "/tools/emi",
      },
      {
        group: "Calculators",
        label: "Affordability Calculator",
        url: "/tools/affordability",
      },
      {
        group: "Guides",
        label: "Loan Eligibility",
        url: "/tools/loan",
      },
    ],
  },
  {
    label: "Web Stories",
    url: "/web-stories",
    type: "link",
    order: 7,
  },
];
