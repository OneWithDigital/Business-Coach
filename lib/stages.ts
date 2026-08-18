import type { Stage } from "./types";

export const STAGES: Stage[] = [
  {
    id: 0,
    slug: "idea-validation",
    title: "Idea Validation",
    tagline: "Before you spend a dollar forming anything, make sure someone will actually pay for this.",
    monetization: "none",
    monetizationNote:
      "Nothing to buy here on purpose. Most people who fail at business fail because they built something nobody wanted badly enough to pay for — not because they picked the wrong LLC state. Get this right first.",
    tool: "idea-validation-checklist",
    content: [
      {
        heading: "Who exactly pays, and why?",
        paragraphs: [
          "\"Small businesses\" or \"people who like coffee\" is not a customer. You need a specific enough answer that you could go find 10 of these people this week and talk to them.",
          "Write down: who has this problem, how are they solving it today (even a bad workaround counts), and why would they switch to paying you instead?",
          "Example: \"people who like coffee\" is too broad to act on. \"Office managers at 20-50 person companies who currently run out to a coffee shop before client meetings\" is specific enough that you could name 10 actual companies and call them this week.",
        ],
        checklist: [
          { text: "I can name a specific type of person/business who has this problem" },
          { text: "I know how they currently deal with the problem without me" },
          { text: "I've actually talked to at least 5-10 of them about it (not just family/friends)" },
        ],
      },
      {
        heading: "How much, and how often?",
        paragraphs: [
          "Figure out roughly what this is worth to the person who has the problem, and how often they'd need to pay (one-time, monthly, per job). This is a gut estimate at this stage, not a spreadsheet — that comes in Stage 1.",
          "Example: a house cleaner might charge $120 per visit, every two weeks — so the real question isn't just \"would you pay $120,\" it's \"would you pay $120 every two weeks, indefinitely.\" That recurring framing changes how people answer.",
        ],
        checklist: [
          { text: "I have a rough price point in mind, based on what people already pay for alternatives" },
          { text: "I understand whether this is a one-time purchase or recurring need" },
        ],
      },
      {
        heading: "A simple competitor scan",
        paragraphs: [
          "If literally nobody else does anything like this, that's a yellow flag, not a green one — it usually means either the market is too small to attract competition, or it's been tried and didn't work. A crowded market with an angle you can win on is usually a better sign than an empty one.",
          "List 3-5 alternatives (direct competitors or the workaround people use today) and one honest sentence on why someone would pick you over each.",
        ],
      },
      {
        heading: "Go / no-go checkpoint",
        paragraphs: [
          "Before moving to Stage 1, you should be able to answer yes to most of the checklist items above. If you can't, that's useful information now — it's expensive information later, after you've paid filing fees and signed a lease.",
        ],
        callout: {
          tone: "trust",
          text: "If this checkpoint makes you rethink the idea, that's the system working, not failing. Come back when you've talked to more real people.",
        },
      },
    ],
  },

  {
    id: 1,
    slug: "business-plan",
    title: "Business Plan",
    tagline: "A one-page plan you'll actually use, not a 40-page document that sits in a drawer.",
    monetization: "upsell",
    monetizationNote:
      "If you need a full SBA-style plan for financing, that's a different, more detailed document — we can point you to a template and a paid review if you want a second set of eyes before you submit it to a lender.",
    tool: "startup-costs-worksheet",
    content: [
      {
        heading: "Lean plan vs. bank-style plan",
        paragraphs: [
          "Most businesses don't need a 40-page plan. You need one page that forces you to answer: what you sell, who buys it, how you price it, what it costs to run, and when you break even.",
          "The exception: if you're applying for SBA financing or a bank loan, most lenders want a fuller plan with financial projections, personal financial statements, and sometimes 2-3 years of projected statements. That's a heavier document — flag it now if financing is part of your plan, so you don't have to redo this work later.",
        ],
        callout: {
          tone: "info",
          text: "Need financing? A full lending packet (loan application prep, personal financial statement template, projections workbook) is worth building properly rather than rushing — ask about the commercial lending packet.",
        },
      },
      {
        heading: "Revenue model and pricing",
        paragraphs: [
          "Write down exactly how money comes in: one-time sales, subscriptions, hourly billing, retainers, commission. Then your pricing, and — importantly — why that price (cost-plus, competitor-based, value-based).",
          "Example of the three approaches on the same product: a candle that costs you $8 to make. Cost-plus says charge $16 (2x cost). Competitor-based says charge $22 because that's what similar handmade candles sell for at your local market. Value-based says charge $30 because yours solves a specific problem (allergy-friendly, for people who can't use scented candles) that competitors don't — and that problem is worth more to the right buyer than the raw materials suggest.",
        ],
      },
      {
        heading: "Startup costs and break-even",
        paragraphs: [
          "Use the worksheet below to list every one-time cost to get open (equipment, licenses, initial inventory, website, deposits) and every recurring monthly cost (rent, software, insurance, your own draw if you need one). The break-even calculator then tells you how much revenue you need before this is a real business instead of an expensive hobby.",
        ],
      },
    ],
  },

  {
    id: 2,
    slug: "entity-selection",
    title: "Entity Selection & Registration",
    tagline: "Sole prop, LLC, S-corp, or C-corp — the right answer depends on liability exposure, taxes, owners, and funding plans.",
    monetization: "affiliate",
    monetizationNote:
      "We earn a commission if you use a formation service through the links below — that never changes the recommendation itself. If your situation is more complex than the decision tree can responsibly answer (multiple owners splitting equity, IP-heavy business, anyone raising outside money), talk to a business attorney instead of relying on a web tool for that.",
    tool: "entity-selector",
    affiliateLinkIds: ["legalzoom", "zenbusiness", "northwest-registered-agent", "incfile"],
    content: [
      {
        heading: "The four common structures, in plain terms",
        paragraphs: [
          "Sole proprietorship: no separate legal entity — you and the business are the same for liability and tax purposes. Fastest and cheapest to start, but your personal assets aren't shielded from business debts or lawsuits.",
          "LLC (Limited Liability Company): a separate legal entity that shields your personal assets in most circumstances, with flexible tax treatment (by default taxed like a sole prop/partnership, but can elect S-corp or C-corp tax treatment). The default choice for most first-time founders who want liability protection without corporate complexity.",
          "S-corp: not actually a separate entity type — it's a tax election (an LLC or corporation can elect S-corp status) that can reduce self-employment tax once the business is profitable enough, in exchange for payroll requirements and more paperwork.",
          "C-corp: a separate entity taxed independently from its owners (the \"double taxation\" people mention — the corporation pays tax, then shareholders pay tax again on dividends). Standard structure for businesses planning to raise venture capital or eventually go public.",
        ],
      },
      {
        heading: "State filing basics",
        paragraphs: [
          "Every state requires filing formation documents (commonly called Articles of Organization for an LLC, or Articles of Incorporation for a corporation) with the state's business filing agency, along with a filing fee that varies significantly by state.",
          "Most states also require a registered agent — a person or company with a physical address in that state who can accept legal documents on the business's behalf. You can often be your own registered agent if you have a physical address in the state, or use a registered agent service for privacy and reliability (especially if you work from home and don't want your home address on public record).",
        ],
      },
      {
        heading: "When to use a formation service vs. a lawyer",
        paragraphs: [
          "A formation service (below) is generally fine for a straightforward single-owner or simple multi-owner LLC with no unusual complications.",
          "Get an actual business attorney involved — not a formation service — if: you have multiple owners splitting equity in ways that need a real operating agreement, your business is built around intellectual property, or you're planning to raise money from investors. The cost of a lawyer up front is small compared to the cost of an ambiguous ownership agreement later.",
        ],
      },
    ],
  },

  {
    id: 3,
    slug: "ein",
    title: "EIN (Employer Identification Number)",
    tagline: "Free, direct from the IRS, takes about 10 minutes. Don't let anyone sell this to you.",
    monetization: "none",
    monetizationNote:
      "This is free and always will be. If a formation service tries to upsell you an EIN as a paid add-on, that's the one place to say no — everything else they offer might be worth it, this specific thing never is. We're telling you this so our other recommendations are worth trusting.",
    content: [
      {
        heading: "What it is",
        paragraphs: [
          "An EIN is like a Social Security number for your business — the IRS uses it to identify your business for tax purposes. You need one to open a business bank account, hire employees, and file most business tax returns.",
        ],
      },
      {
        heading: "How to get it yourself, free",
        paragraphs: [
          "The official application is a free online form that issues your EIN immediately upon completion if you're a US-based applicant with a valid Social Security Number or ITIN. It's available Monday-Friday, roughly 6am-1am Eastern (it also runs part of the weekend — the form itself will tell you if it's closed when you visit).",
          "You'll need your business's legal name, the entity type you chose in Stage 2, and your own SSN/ITIN as the responsible party. Example: if you formed \"Riverside Landscaping LLC\" as a single-member LLC, you'd enter that exact legal name, select \"Limited Liability Company\" as the entity type, and list yourself as the sole member/responsible party.",
        ],
        externalLink: {
          label: "Apply for your EIN on IRS.gov",
          url: "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
          note: "Official IRS.gov page — links directly to the free application. The page itself warns: \"You never have to pay a fee for an EIN.\"",
        },
        callout: {
          tone: "warning",
          text: "Only apply through the official IRS.gov site above. There are third-party sites that charge a fee to \"process\" your EIN application — they're not doing anything you can't do yourself for free in the same amount of time.",
        },
      },
    ],
  },

  {
    id: 4,
    slug: "state-local-compliance",
    title: "State & Local Compliance",
    tagline: "Sales tax permits, industry licenses, and beneficial ownership reporting — the part that varies the most by what and where you're doing this.",
    monetization: "referral",
    monetizationNote:
      "This is genuinely the stage where a local business attorney or compliance service earns their fee — the requirements below vary enormously by state, city, and industry, and getting them wrong can mean fines or a forced shutdown. We'll flag categories to check; verify specifics for your situation.",
    tool: "state-registration",
    content: [
      {
        heading: "Sales tax / seller's permit",
        paragraphs: [
          "If you sell physical products (and in some states, certain services), you likely need to register for a sales tax permit with your state's department of revenue before you make your first sale, then collect and remit sales tax on an ongoing basis.",
          "Requirements and rates vary by state, and some cities/counties add their own local sales tax on top. Check your specific state's department of revenue site directly — use the state selector below to jump straight to your state's business portal.",
        ],
      },
      {
        heading: "Industry-specific licenses and permits",
        paragraphs: [
          "This is the category that varies the most: contractor licenses, food service permits and health inspections, cosmetology/salon licenses, liquor licenses, professional licenses (real estate, insurance, healthcare, legal, financial services), childcare licensing, and dozens more depending on what you're doing.",
          "There's no single national database that reliably covers all of these — your state's business licensing office (often part of the Secretary of State or a dedicated licensing board) and your city/county clerk's office are the two places to check specifically for your industry and location.",
        ],
        checklist: [
          { text: "Checked whether my specific industry requires a state-level professional/occupational license" },
          { text: "Checked city/county requirements (these are often separate from state requirements)" },
          { text: "Checked zoning if I'll operate from a physical location, including a home-based business" },
        ],
      },
      {
        heading: "Beneficial Ownership Information (BOI) reporting",
        paragraphs: [
          "The Corporate Transparency Act created a federal requirement for many entities to report their beneficial owners to FinCEN. This requirement has changed multiple times through rulemaking and litigation since it took effect — as of our last review, FinCEN had narrowed the requirement so that most U.S.-formed companies with U.S. beneficial owners were no longer required to report, with the requirement instead focused on foreign-formed entities registered to do business in the U.S.",
        ],
        callout: {
          tone: "warning",
          text: "This status has changed before and could change again — do not treat the paragraph above as current fact. Before you rely on it, search \"FinCEN beneficial ownership information reporting\" and check the current requirement directly on FinCEN's site, or ask a business attorney. We'd rather send you to verify than have you rely on something that was accurate when we wrote it but isn't anymore.",
        },
      },
    ],
  },

  {
    id: 5,
    slug: "business-bank-account",
    title: "Business Bank Account",
    tagline: "Separate your finances before your first sale, not after your first audit.",
    monetization: "affiliate",
    monetizationNote:
      "Some of the options below pay us a referral bonus if you open an account through them. Use the comparison tool to pick the one that actually fits how you'll use it — the numbers below are the same regardless of which one you choose.",
    tool: "bank-comparison",
    affiliateLinkIds: ["mercury", "bluevine", "novo", "relay"],
    content: [
      {
        heading: "Why this matters beyond convenience",
        paragraphs: [
          "Mixing personal and business money (\"commingling funds\") is one of the fastest ways to lose the liability protection an LLC is supposed to give you — a court can decide to disregard the LLC (\"pierce the corporate veil\") if you never treated it as a separate entity financially.",
          "It also makes bookkeeping dramatically easier and gives you a clean audit trail if you're ever questioned by the IRS or a lender.",
        ],
      },
      {
        heading: "Online-first banks vs. traditional banks vs. credit unions",
        paragraphs: [
          "Online-first business banks (Mercury, Bluevine, Novo, Relay) typically offer better software, faster account opening, and sometimes better rates — but usually can't accept large cash deposits and don't have an existing relationship for SBA lending.",
          "Traditional banks (Chase, Bank of America, etc.) are the better fit if you handle meaningful cash volume, want a single relationship for both banking and an eventual SBA loan, or just prefer being able to walk into a branch.",
          "Credit unions are their own category, not just a smaller version of a traditional bank — they're member-owned rather than shareholder-owned, which often means lower fees and better rates, and they can handle cash deposits and branch visits just like a traditional bank. The tradeoffs: fewer branches/ATMs nationally, and sometimes a membership requirement to join. They're also often more willing to have an actual relationship-based conversation about small business lending than a large bank's standardized underwriting — worth knowing given what the section below says about startup lending.",
        ],
      },
      {
        heading: "Startups usually can't borrow on the business alone",
        paragraphs: [
          "Most banks and credit unions won't lend to a business based on its own track record until it has real revenue history — often 2+ years of it. Until then, what they're actually underwriting is you: your personal credit score and history, and often a personal guarantee, even though the loan or credit line is in the business's name.",
          "This isn't a flaw in your plan — it's just how startup lending works almost everywhere. The practical implication: your personal credit is a business asset right now, not just a personal one, and it's worth understanding and strengthening it before you need it. We're planning a dedicated tool for this (understanding your credit, building it from scratch, fixing damage, and establishing it if you have none) — not built yet, but flagging it now so this isn't a surprise later, in Stage 7 (Business Credit) especially.",
        ],
      },
      {
        heading: "What to bring to open the account",
        paragraphs: [
          "Requirements vary slightly by bank, but this covers what almost every bank or credit union will ask for when you open a business account in person or online.",
        ],
        checklist: [
          { text: "EIN confirmation letter (IRS Form CP 575), or your EIN number at minimum", detail: "From Stage 3" },
          { text: "Formation documents", detail: "Articles of Organization (LLC) or Articles of Incorporation (corporation), from Stage 2" },
          { text: "Operating Agreement (LLC) or bylaws (corporation)", detail: "Not always legally required to have one, but most banks ask for it" },
          { text: "A government-issued photo ID for every authorized signer on the account" },
          { text: "Business license, if your city/state/industry requires one", detail: "From Stage 4, if applicable" },
          { text: "Initial deposit", detail: "Amount varies by bank, often $0-100 for online-first banks, more for some traditional banks" },
        ],
      },
      {
        heading: "Use the comparison tool",
        paragraphs: [
          "Answer a few questions about cash deposits, transaction volume, fundraising plans, and what matters most to you, and we'll narrow down which category fits — then compare the specific options within it.",
        ],
      },
    ],
  },

  {
    id: 6,
    slug: "bookkeeping-accounting",
    title: "Bookkeeping & Accounting Setup",
    tagline: "Pick a system before the shoebox of receipts becomes a real problem.",
    monetization: "affiliate",
    monetizationNote:
      "Affiliate links to accounting software below. The CPA referral network mentioned here is a flat lead-generation fee paid by the CPA, not a cut of what they charge you — that distinction matters for how professional referral fees are regulated, and we'd rather over-explain it than have it seem shady.",
    affiliateLinkIds: ["quickbooks", "xero", "wave"],
    content: [
      {
        heading: "QuickBooks vs. Wave vs. Xero",
        paragraphs: [
          "QuickBooks: the most widely used option, which mostly matters because it means it's easiest to find a bookkeeper or CPA who already knows it. More expensive than the alternatives.",
          "Wave: free for core bookkeeping/invoicing, paid add-ons for payroll and payment processing. A reasonable starting point if you're pre-revenue or very low transaction volume.",
          "Xero: a clean, well-regarded alternative to QuickBooks, popular with bookkeepers who prefer its interface — similar price range to QuickBooks.",
        ],
      },
      {
        heading: "Chart of accounts basics",
        paragraphs: [
          "Your chart of accounts is the categorized list every transaction gets sorted into (income by type, expenses by category, assets, liabilities, equity). Most accounting software starts you with a reasonable default template for your industry — customize it, but don't over-engineer it on day one. You can always split a category later once you see you actually need the detail.",
          "Example for a small service business: income might just be \"Service Revenue.\" Expenses might start as broad categories like \"Supplies,\" \"Software,\" \"Vehicle/Travel,\" \"Insurance,\" and \"Marketing\" — five categories, not fifty. If \"Supplies\" later turns out to be your biggest expense and you want more detail, split it into subcategories then, once you know what's actually worth tracking separately.",
        ],
      },
      {
        heading: "DIY vs. bookkeeper vs. CPA",
        paragraphs: [
          "DIY bookkeeping is fine at low transaction volume if you're disciplined about doing it weekly, not \"whenever tax season panics me.\"",
          "A bookkeeper (not necessarily a CPA) handles ongoing categorization and reconciliation — worth it once volume gets tedious or error-prone to do yourself.",
          "A CPA is worth involving for tax strategy (especially around the S-corp election decision from Stage 2) and for actually filing your business tax return — this is a different skill from bookkeeping, and a good bookkeeper will tell you when you've outgrown DIY tax filing.",
        ],
      },
    ],
  },

  {
    id: 7,
    slug: "business-credit",
    title: "Business Credit",
    tagline: "Build credit under your EIN so your personal credit stops being the ceiling on what your business can borrow.",
    monetization: "affiliate",
    monetizationNote: "Credit card affiliate links below — approval odds and terms depend entirely on your actual application, not on which link you click.",
    tool: "credit-card-comparison",
    content: [
      {
        heading: "How EIN-based business credit works",
        paragraphs: [
          "Business credit is tracked separately from your personal credit, primarily through Dun & Bradstreet (which issues a DUNS number), Experian Business, and Equifax Business. Establishing a DUNS number and getting a few vendors/trade lines to report payment history to these bureaus is how a business starts building its own credit profile, separate from your personal score.",
          "In practice, most early-stage businesses start with a business credit card, since it's the fastest way to establish a track record — and most early-stage card approvals still rely on your personal credit and a personal guarantee, since the business itself has no history yet.",
        ],
      },
      {
        heading: "Cards by stage",
        paragraphs: [
          "No-revenue startup cards (often from online-first banks like Mercury or Brex) typically underwrite based on cash in the bank rather than personal credit or revenue — useful before you have revenue history.",
          "Revenue-based business cards (Chase Ink, Amex Business, Capital One Spark) typically want to see some combination of personal credit history, time in business, and revenue, in exchange for stronger rewards programs.",
        ],
      },
      {
        heading: "Your personal credit is the real underlying asset right now",
        paragraphs: [
          "Worth saying plainly, since it surprises a lot of first-time founders: almost no bank, credit union, or card issuer will lend to a brand-new business on the business's own merit. Until you have real revenue history (often 2+ years), what's actually being evaluated is your personal credit score, your personal credit history, and often a personal guarantee — even for a card or account that's technically in the business's name.",
          "That makes your personal credit health a business planning input, not just a personal finance topic. If you know your credit needs work — building it from nothing, fixing past damage, or just understanding what's actually in your report — that's worth doing in parallel with the rest of this process, not after you're turned down for financing.",
        ],
        callout: {
          tone: "info",
          text: "We're planning a dedicated personal credit tool for this guide — understanding your credit report, building credit from scratch, fixing damage, and establishing credit if you have none. Not built yet; flagging it now so you know it's coming rather than assuming this is out of scope.",
        },
      },
    ],
  },

  {
    id: 8,
    slug: "insurance",
    title: "Insurance",
    tagline: "The coverage that matters depends entirely on what could actually go wrong in your specific business.",
    monetization: "affiliate",
    monetizationNote: "Insurance marketplace affiliate links below — get an actual quote for your situation rather than assuming you need (or don't need) a specific policy based on general guidance.",
    affiliateLinkIds: ["next-insurance", "simply-business", "thimble"],
    content: [
      {
        heading: "The core coverage types",
        paragraphs: [
          "General liability: covers third-party bodily injury, property damage, and some advertising-related claims. The baseline most businesses need, and often required by landlords or clients before they'll sign a lease or contract with you.",
          "Professional liability / Errors & Omissions (E&O): covers claims that your professional advice or service caused a client financial harm. Relevant if you provide services, advice, or expertise (consulting, design, tech, financial services, etc.) rather than just selling a physical product.",
          "Workers' compensation: covers employee injuries on the job. Required by law in most states once you have any employees (thresholds vary by state — some require it starting with your first employee).",
        ],
      },
      {
        heading: "When each one actually triggers",
        paragraphs: [
          "A good rule of thumb: general liability if you interact with clients/customers/public in person or on their property; E&O if your value is advice/expertise rather than a physical product or fixed deliverable; workers' comp the moment you have your first employee, no matter how part-time.",
        ],
      },
    ],
  },

  {
    id: 9,
    slug: "brand-website-marketing",
    title: "Brand, Website & Marketing Foundation",
    tagline: "Domain, logo, a real website, and the basic profiles that make you findable.",
    monetization: "none",
    monetizationNote:
      "No third-party affiliate here — if you want help with this, it's a direct conversation about working with One With Digital, the agency behind this guide, not a commission-driven recommendation. We'll flag it as an option, not push it.",
    content: [
      {
        heading: "The basics, in order",
        paragraphs: [
          "Domain name — register the .com if it's available and reasonably priced; a close alternative is fine if not.",
          "A real website — even a simple one beats no website. At minimum: what you do, who it's for, how to contact/buy, and enough credibility signals (photos, testimonials, clear pricing where appropriate) that a stranger trusts you enough to act.",
          "Google Business Profile — free, and directly affects whether you show up in local search and Google Maps. Set this up even if you're not primarily a local/storefront business.",
          "The social profiles that actually matter for your specific audience — not all of them. Pick where your actual customers spend time rather than maintaining five platforms half-heartedly.",
          "Example: a mobile dog groomer's customers are mostly local pet owners scrolling Facebook and Instagram — that's two platforms worth maintaining well, not five done poorly. A B2B bookkeeper's clients are more likely to search Google or check LinkedIn than scroll Instagram — different audience, different two platforms.",
        ],
      },
      {
        heading: "If you want help with this part",
        paragraphs: [
          "This is squarely what a digital agency does day to day. If you'd rather have this built professionally than DIY it, One With Digital — the agency behind this guide — handles website design, SEO, branding, and digital marketing strategy directly. That's a direct working relationship, not an affiliate referral, so there's no commission shaping this recommendation.",
        ],
        externalLink: {
          label: "See what One With Digital does",
          url: "https://onewithdigital.com",
          note: "Direct link to their site — not an affiliate link.",
        },
      },
    ],
  },

  {
    id: 10,
    slug: "ongoing-compliance-growth",
    title: "Ongoing Compliance & Growth",
    tagline: "The business doesn't stop needing paperwork once it's formed — this is what keeps it in good standing.",
    monetization: "affiliate",
    monetizationNote:
      "Payroll and CPA/tax-prep referrals apply once relevant (payroll the moment you hire; CPA referral is a flat lead fee, same disclosure as Stage 6). Sign up for a free account and add your business details to get estimated annual report and quarterly tax reminders.",
    affiliateLinkIds: ["gusto"],
    content: [
      {
        heading: "The recurring obligations",
        paragraphs: [
          "Annual report / periodic filing — most states require an annual or biennial report (sometimes called a franchise tax report) to keep your LLC/corporation in good standing, with its own filing fee. Miss it and the state can administratively dissolve your business.",
          "Estimated quarterly taxes — if you expect to owe more than a small threshold in tax for the year, the IRS (and most states with income tax) expect quarterly estimated payments rather than one lump sum at filing time. Underpaying enough can trigger a penalty even if you pay in full by the deadline.",
          "License/permit renewals — anything from Stage 4 that has an expiration date needs to be tracked and renewed on its own schedule.",
        ],
      },
      {
        heading: "Reminders",
        paragraphs: [
          "If you have an account, add your entity type, state, and formation date on your account page and we'll estimate your next annual report deadline and upcoming quarterly estimated tax dates — these are estimates to plan around, not a substitute for confirming the actual deadline with your state.",
        ],
      },
      {
        heading: "Payroll, once you hire",
        paragraphs: [
          "The moment you have your first employee, payroll software (versus doing it by hand) becomes worth it fast — it handles tax withholding, filings, and the workers' comp trigger from Stage 8 in one place.",
        ],
      },
    ],
  },
];

export function getStageBySlug(slug: string): Stage | undefined {
  return STAGES.find((s) => s.slug === slug);
}

export function getStageById(id: number): Stage | undefined {
  return STAGES.find((s) => s.id === id);
}
