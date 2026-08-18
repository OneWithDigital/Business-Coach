import { getAffiliateLink, getAffiliateUrl } from "@/lib/affiliateLinks";

/**
 * Server component (no "use client") — deliberately, so it can read
 * process.env directly for affiliate URLs server-side. Client components
 * can't reliably read arbitrary (non-NEXT_PUBLIC_) env vars, and these
 * links don't need any client interactivity anyway.
 */
export function AffiliatePanel({ linkIds }: { linkIds: string[] }) {
  const links = linkIds.map(getAffiliateLink).filter((l): l is NonNullable<typeof l> => Boolean(l));
  if (links.length === 0) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Options to consider
        </h3>
        <span className="text-[10px] text-slate-400">
          Advertising disclosure: we may earn a commission
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {links.map((link) => {
          const url = getAffiliateUrl(link);
          return (
            <div key={link.id} className="rounded-lg border border-slate-200 p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-sm text-slate-900">{link.name}</span>
                {url ? (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="text-xs font-medium text-emerald-700 hover:text-emerald-800 underline underline-offset-2"
                  >
                    Visit →
                  </a>
                ) : (
                  <span className="text-xs text-slate-400">Link coming soon</span>
                )}
              </div>
              <p className="mt-1 text-xs text-slate-500">{link.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
