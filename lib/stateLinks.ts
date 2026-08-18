export type LinkConfidence = "verified" | "uncertain" | "not-found";

export interface StateLink {
  state: string;
  abbreviation: string;
  agencyName: string;
  /** Empty when confidence is "not-found" — nothing to link to. */
  formationUrl: string;
  confidence: LinkConfidence;
  /** Extra context worth surfacing regardless of confidence level (e.g. "this state doesn't offer online filing at all"). */
  note?: string;
}

/**
 * Researched and verified state-by-state (each URL checked or corroborated
 * across multiple independent search results — not guessed; a wrong
 * government link is worse than an honest gap). "verified" means directly
 * fetched and confirmed; "uncertain" means the URL is very likely correct
 * but couldn't be directly confirmed live (state site blocked automated
 * fetches, a portal migration was in progress, etc.) — see each note.
 * Compiled August 2026; state portals do change, so if a link is ever dead,
 * that's a signal to update this file, not evidence the whole approach is
 * unreliable.
 */
export const STATE_LINKS: StateLink[] = [
  { state: "Alabama", abbreviation: "AL", agencyName: "Secretary of State", formationUrl: "https://www.alabamainteractive.org/sos/welcome.action", confidence: "verified" },
  { state: "Alaska", abbreviation: "AK", agencyName: "Division of Corporations, Business and Professional Licensing", formationUrl: "https://www.commerce.alaska.gov/web/cbpl/Corporations/OnlineFilingInstructionsLLCArticles.aspx", confidence: "uncertain", note: "Correct page per multiple sources, but the state site blocked automated verification — should still be right." },
  { state: "Arizona", abbreviation: "AZ", agencyName: "Arizona Corporation Commission", formationUrl: "https://arizonabusinesscenter.azcc.gov", confidence: "verified" },
  { state: "Arkansas", abbreviation: "AR", agencyName: "Secretary of State", formationUrl: "https://portal.arkansas.gov/service/ar-corp-doc-filing/", confidence: "verified" },
  { state: "California", abbreviation: "CA", agencyName: "Secretary of State", formationUrl: "https://bizfileonline.sos.ca.gov/", confidence: "verified" },
  { state: "Colorado", abbreviation: "CO", agencyName: "Secretary of State", formationUrl: "https://www.sos.state.co.us/pubs/business/fileAForm.html", confidence: "uncertain", note: "Correct page per multiple sources, but the state site blocked automated verification — should still be right." },
  { state: "Connecticut", abbreviation: "CT", agencyName: "Secretary of the State", formationUrl: "https://business.ct.gov/start-your-business/register-your-business", confidence: "verified" },
  { state: "Delaware", abbreviation: "DE", agencyName: "Division of Corporations", formationUrl: "https://corp.delaware.gov/document-upload-service-information/", confidence: "verified" },
  { state: "District of Columbia", abbreviation: "DC", agencyName: "Dept. of Licensing and Consumer Protection, Corporations Division", formationUrl: "https://boss.dc.gov/", confidence: "uncertain", note: "DC recently moved to this new \"BOSS\" portal (from the old CorpOnline system) — confirmed via DLCP's own announcement, but the live page only loaded a script shell during verification." },
  { state: "Florida", abbreviation: "FL", agencyName: "Division of Corporations (Department of State)", formationUrl: "https://dos.fl.gov/sunbiz/start-business/efile/", confidence: "verified" },
  { state: "Georgia", abbreviation: "GA", agencyName: "Corporations Division (Secretary of State)", formationUrl: "https://ecorp.sos.ga.gov/", confidence: "verified" },
  { state: "Hawaii", abbreviation: "HI", agencyName: "Business Registration Division (Dept. of Commerce and Consumer Affairs)", formationUrl: "https://hbe.dcca.hawaii.gov/", confidence: "uncertain", note: "Hawaii just moved to this new portal (from hbe.ehawaii.gov) — very recent change, worth double-checking you're in the right place once there." },
  { state: "Idaho", abbreviation: "ID", agencyName: "Secretary of State", formationUrl: "https://sosbiz.idaho.gov/", confidence: "verified" },
  { state: "Illinois", abbreviation: "IL", agencyName: "Secretary of State", formationUrl: "https://apps.ilsos.gov/llcarticles/index.jsp", confidence: "verified" },
  { state: "Indiana", abbreviation: "IN", agencyName: "Secretary of State (INBiz)", formationUrl: "https://inbiz.in.gov/", confidence: "verified" },
  { state: "Iowa", abbreviation: "IA", agencyName: "Secretary of State", formationUrl: "https://filings.sos.iowa.gov/", confidence: "uncertain", note: "Correct page per multiple sources, but the state site blocked automated verification — should still be right." },
  { state: "Kansas", abbreviation: "KS", agencyName: "Secretary of State", formationUrl: "https://www.sos.ks.gov/eforms/user_login.aspx?frm=BS", confidence: "verified" },
  { state: "Kentucky", abbreviation: "KY", agencyName: "Secretary of State", formationUrl: "https://web.sos.ky.gov/FastTrack/FileLLC.aspx", confidence: "verified" },
  { state: "Louisiana", abbreviation: "LA", agencyName: "Secretary of State", formationUrl: "https://geauxbiz.sos.la.gov/", confidence: "verified" },
  { state: "Maine", abbreviation: "ME", agencyName: "Bureau of Corporations, Elections and Commissions (Secretary of State)", formationUrl: "https://www.maine.gov/sos/corporations-commissions/corporations-business-services", confidence: "uncertain", note: "Maine does not currently offer online filing for a brand-new LLC/corporation — formation documents go in by mail (standard processing has run 40-55 business days). This page has the mail-in forms and instructions." },
  { state: "Maryland", abbreviation: "MD", agencyName: "State Department of Assessments and Taxation", formationUrl: "https://egov.maryland.gov/BusinessExpress", confidence: "verified" },
  { state: "Massachusetts", abbreviation: "MA", agencyName: "Corporations Division (Secretary of the Commonwealth)", formationUrl: "https://corp.sec.state.ma.us/corpweb/loginsystem/externallogin.aspx", confidence: "verified" },
  { state: "Michigan", abbreviation: "MI", agencyName: "Corporations Division, Dept. of Licensing and Regulatory Affairs", formationUrl: "https://mibusinessregistry.lara.state.mi.us/", confidence: "verified" },
  { state: "Minnesota", abbreviation: "MN", agencyName: "Secretary of State", formationUrl: "https://mblsportal.sos.state.mn.us/", confidence: "verified" },
  { state: "Mississippi", abbreviation: "MS", agencyName: "Secretary of State", formationUrl: "https://business.sos.ms.gov/", confidence: "verified" },
  { state: "Missouri", abbreviation: "MO", agencyName: "Secretary of State", formationUrl: "https://bsd.sos.mo.gov/", confidence: "uncertain", note: "Correct page per multiple sources, but the state site blocked automated verification — should still be right." },
  { state: "Montana", abbreviation: "MT", agencyName: "Secretary of State", formationUrl: "https://biz.sosmt.gov/", confidence: "verified" },
  { state: "Nebraska", abbreviation: "NE", agencyName: "Secretary of State", formationUrl: "https://www.nebraska.gov/apps-sos-edocs/", confidence: "verified" },
  { state: "Nevada", abbreviation: "NV", agencyName: "Secretary of State (SilverFlume)", formationUrl: "https://www.nvsilverflume.gov/", confidence: "uncertain", note: "Currently live, but Nevada is mid-rollout of a new system (\"Project ORION\") intended to replace this one for business formation around this time — if this link feels off, the state may have just switched over." },
  { state: "New Hampshire", abbreviation: "NH", agencyName: "Secretary of State (QuickStart)", formationUrl: "https://quickstart.sos.nh.gov/", confidence: "verified" },
  { state: "New Jersey", abbreviation: "NJ", agencyName: "Division of Revenue and Enterprise Services", formationUrl: "https://www.njportal.com/dor/businessformation/home/welcome", confidence: "verified" },
  { state: "New Mexico", abbreviation: "NM", agencyName: "Secretary of State", formationUrl: "https://enterprise.sos.nm.gov/", confidence: "verified" },
  { state: "New York", abbreviation: "NY", agencyName: "Department of State, Division of Corporations", formationUrl: "https://filings.dos.ny.gov/ords/corpanc/r/ecorp/ecorphome", confidence: "verified" },
  { state: "North Carolina", abbreviation: "NC", agencyName: "Secretary of State", formationUrl: "https://www.sosnc.gov/divisions/business_registration/online_business_services", confidence: "verified" },
  { state: "North Dakota", abbreviation: "ND", agencyName: "Secretary of State (FirstStop)", formationUrl: "https://firststop.sos.nd.gov/", confidence: "verified" },
  { state: "Ohio", abbreviation: "OH", agencyName: "Secretary of State", formationUrl: "https://bsportal.ohiosos.gov/", confidence: "verified" },
  { state: "Oklahoma", abbreviation: "OK", agencyName: "Secretary of State", formationUrl: "https://www.sos.ok.gov/business/default.aspx", confidence: "uncertain", note: "Correct page per multiple sources, but the state site returned an error during verification — should still be right." },
  { state: "Oregon", abbreviation: "OR", agencyName: "Secretary of State, Corporation Division", formationUrl: "https://sos.oregon.gov/business/Pages/register.aspx", confidence: "verified" },
  { state: "Pennsylvania", abbreviation: "PA", agencyName: "Department of State, Bureau of Corporations and Charitable Organizations", formationUrl: "https://file.dos.pa.gov/", confidence: "verified" },
  { state: "Rhode Island", abbreviation: "RI", agencyName: "Department of State (Business Services)", formationUrl: "https://business.sos.ri.gov/", confidence: "uncertain", note: "Right domain, but the exact starting point for a brand-new filing (vs. an annual report) couldn't be pinned down for certain." },
  { state: "South Carolina", abbreviation: "SC", agencyName: "Secretary of State", formationUrl: "https://businessfilings.sc.gov/businessfiling", confidence: "verified" },
  { state: "South Dakota", abbreviation: "SD", agencyName: "Secretary of State", formationUrl: "https://sosenterprise.sd.gov/BusinessServices/Default.aspx", confidence: "verified" },
  { state: "Tennessee", abbreviation: "TN", agencyName: "Secretary of State", formationUrl: "https://tnbear.tn.gov/NewBiz", confidence: "verified" },
  { state: "Texas", abbreviation: "TX", agencyName: "Secretary of State (SOSDirect)", formationUrl: "https://direct.sos.state.tx.us/", confidence: "verified" },
  { state: "Utah", abbreviation: "UT", agencyName: "Division of Corporations and Commercial Code", formationUrl: "https://businessregistration.utah.gov/", confidence: "uncertain", note: "Sources conflict on whether this exact portal is still current — worth confirming you're in the right place once there." },
  { state: "Vermont", abbreviation: "VT", agencyName: "Secretary of State", formationUrl: "https://bizfilings.vermont.gov/", confidence: "verified" },
  { state: "Virginia", abbreviation: "VA", agencyName: "State Corporation Commission (Clerk's Information System)", formationUrl: "https://cis.scc.virginia.gov/", confidence: "verified" },
  { state: "Washington", abbreviation: "WA", agencyName: "Secretary of State (Corporations & Charities Filing System)", formationUrl: "https://ccfs.sos.wa.gov/", confidence: "verified" },
  { state: "West Virginia", abbreviation: "WV", agencyName: "Secretary of State (One Stop Business Portal)", formationUrl: "https://business4.wv.gov/", confidence: "verified" },
  { state: "Wisconsin", abbreviation: "WI", agencyName: "Department of Financial Institutions", formationUrl: "https://dfi.wi.gov/Pages/BusinessServices/BusinessEntities/FileOnline.aspx", confidence: "verified" },
  { state: "Wyoming", abbreviation: "WY", agencyName: "Secretary of State (WyoBiz)", formationUrl: "https://wyobiz.wyo.gov/", confidence: "verified" },
];

export function getStateLink(abbreviation: string): StateLink | undefined {
  return STATE_LINKS.find((s) => s.abbreviation === abbreviation);
}
