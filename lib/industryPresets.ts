export interface CostLineItem {
  label: string;
  amount: number;
}

export interface IndustryPreset {
  id: string;
  name: string;
  /** What one "unit" means for this business — shown next to the price/variable-cost fields so they're concrete instead of abstract. */
  unitLabel: string;
  startupItems: CostLineItem[];
  monthlyItems: CostLineItem[];
  pricePerUnit: number;
  variableCostPerUnit: number;
  expectedMonthlyUnits: number;
}

/**
 * Ballpark, illustrative numbers only — meant to give someone who has never
 * priced this out before a realistic starting point to edit, not a
 * prediction of what their business will actually cost. Real costs vary a
 * lot by region, scale, and used-vs-new equipment. Every field here is
 * editable once loaded.
 */
export const INDUSTRY_PRESETS: IndustryPreset[] = [
  {
    id: "residential-cleaning",
    name: "Residential cleaning service",
    unitLabel: "cleaning job",
    startupItems: [
      { label: "Vacuum, mop, and cleaning equipment", amount: 800 },
      { label: "General liability insurance (first year)", amount: 500 },
      { label: "LLC filing fee", amount: 150 },
      { label: "Flyers / initial marketing", amount: 200 },
    ],
    monthlyItems: [
      { label: "Insurance", amount: 50 },
      { label: "Gas / vehicle wear", amount: 150 },
      { label: "Scheduling & invoicing software", amount: 30 },
      { label: "Marketing", amount: 100 },
    ],
    pricePerUnit: 120,
    variableCostPerUnit: 15,
    expectedMonthlyUnits: 40,
  },
  {
    id: "mobile-pet-grooming",
    name: "Mobile pet grooming",
    unitLabel: "grooming appointment",
    startupItems: [
      { label: "Grooming table, tub, clippers, dryer", amount: 3500 },
      { label: "Liability insurance (first year)", amount: 600 },
      { label: "Business license", amount: 150 },
      { label: "Website", amount: 300 },
    ],
    monthlyItems: [
      { label: "Insurance", amount: 50 },
      { label: "Gas / travel", amount: 150 },
      { label: "Scheduling software", amount: 30 },
      { label: "Marketing", amount: 150 },
    ],
    pricePerUnit: 75,
    variableCostPerUnit: 10,
    expectedMonthlyUnits: 60,
  },
  {
    id: "food-truck",
    name: "Food truck",
    unitLabel: "meal sold",
    startupItems: [
      { label: "Used food truck", amount: 60000 },
      { label: "Kitchen equipment", amount: 10000 },
      { label: "Permits & health inspection fees", amount: 2000 },
      { label: "Initial inventory", amount: 2000 },
      { label: "POS system", amount: 1500 },
    ],
    monthlyItems: [
      { label: "Commissary kitchen rental", amount: 500 },
      { label: "Insurance", amount: 300 },
      { label: "Propane / fuel", amount: 400 },
      { label: "POS software fees", amount: 50 },
    ],
    pricePerUnit: 12,
    variableCostPerUnit: 4,
    expectedMonthlyUnits: 1200,
  },
  {
    id: "freelance-design",
    name: "Freelance graphic design",
    unitLabel: "project",
    startupItems: [
      { label: "Laptop + design software", amount: 2500 },
      { label: "Portfolio website", amount: 300 },
      { label: "LLC filing fee", amount: 150 },
      { label: "Errors & omissions insurance", amount: 300 },
    ],
    monthlyItems: [
      { label: "Software subscriptions", amount: 60 },
      { label: "Website hosting", amount: 20 },
      { label: "Marketing", amount: 100 },
    ],
    pricePerUnit: 800,
    variableCostPerUnit: 30,
    expectedMonthlyUnits: 4,
  },
  {
    id: "ecommerce",
    name: "E-commerce (handmade or small-batch products)",
    unitLabel: "item sold",
    startupItems: [
      { label: "Initial inventory / materials", amount: 3000 },
      { label: "Online store setup", amount: 500 },
      { label: "Product photography", amount: 300 },
      { label: "LLC filing fee", amount: 150 },
      { label: "Packaging supplies", amount: 300 },
    ],
    monthlyItems: [
      { label: "Store platform subscription", amount: 30 },
      { label: "Ad spend", amount: 300 },
      { label: "Shipping supplies", amount: 100 },
    ],
    pricePerUnit: 35,
    variableCostPerUnit: 15,
    expectedMonthlyUnits: 150,
  },
  {
    id: "personal-training",
    name: "Personal training / fitness coaching",
    unitLabel: "session",
    startupItems: [
      { label: "Certification (if needed)", amount: 600 },
      { label: "Liability insurance", amount: 300 },
      { label: "Equipment (bands, mats, weights)", amount: 800 },
      { label: "LLC filing fee", amount: 150 },
      { label: "Website", amount: 300 },
    ],
    monthlyItems: [
      { label: "Insurance", amount: 40 },
      { label: "Gym space rental (by the hour)", amount: 200 },
      { label: "Scheduling software", amount: 30 },
      { label: "Marketing", amount: 100 },
    ],
    pricePerUnit: 65,
    variableCostPerUnit: 5,
    expectedMonthlyUnits: 60,
  },
  {
    id: "landscaping",
    name: "Landscaping / lawn care",
    unitLabel: "job",
    startupItems: [
      { label: "Mower, trimmer, blower", amount: 2500 },
      { label: "Trailer", amount: 2000 },
      { label: "Liability insurance", amount: 600 },
      { label: "LLC filing fee", amount: 150 },
      { label: "Marketing", amount: 200 },
    ],
    monthlyItems: [
      { label: "Insurance", amount: 50 },
      { label: "Gas & equipment maintenance", amount: 200 },
      { label: "Scheduling software", amount: 30 },
      { label: "Marketing", amount: 100 },
    ],
    pricePerUnit: 55,
    variableCostPerUnit: 8,
    expectedMonthlyUnits: 80,
  },
  {
    id: "bookkeeping",
    name: "Bookkeeping services",
    unitLabel: "monthly client retainer",
    startupItems: [
      { label: "Accounting software / certification", amount: 500 },
      { label: "Laptop", amount: 1200 },
      { label: "LLC filing fee", amount: 150 },
      { label: "Errors & omissions insurance", amount: 300 },
      { label: "Website", amount: 300 },
    ],
    monthlyItems: [
      { label: "Software", amount: 50 },
      { label: "Insurance", amount: 40 },
      { label: "Marketing", amount: 100 },
    ],
    pricePerUnit: 400,
    variableCostPerUnit: 10,
    expectedMonthlyUnits: 8,
  },
  {
    id: "photography",
    name: "Photography (events & portraits)",
    unitLabel: "shoot",
    startupItems: [
      { label: "Camera + lenses", amount: 3500 },
      { label: "Editing software", amount: 250 },
      { label: "Portfolio website", amount: 300 },
      { label: "LLC filing fee", amount: 150 },
      { label: "Liability insurance", amount: 300 },
    ],
    monthlyItems: [
      { label: "Software subscription", amount: 30 },
      { label: "Marketing", amount: 150 },
      { label: "Cloud storage", amount: 20 },
    ],
    pricePerUnit: 350,
    variableCostPerUnit: 30,
    expectedMonthlyUnits: 6,
  },
  {
    id: "handyman",
    name: "Handyman services",
    unitLabel: "job",
    startupItems: [
      { label: "Tools", amount: 3000 },
      { label: "Work vehicle signage", amount: 500 },
      { label: "Liability insurance", amount: 600 },
      { label: "LLC filing fee", amount: 150 },
      { label: "Marketing", amount: 200 },
    ],
    monthlyItems: [
      { label: "Insurance", amount: 60 },
      { label: "Gas / vehicle wear", amount: 200 },
      { label: "Scheduling software", amount: 30 },
      { label: "Marketing", amount: 150 },
    ],
    pricePerUnit: 200,
    variableCostPerUnit: 40,
    expectedMonthlyUnits: 30,
  },
];

export function getIndustryPreset(id: string): IndustryPreset | undefined {
  return INDUSTRY_PRESETS.find((p) => p.id === id);
}
