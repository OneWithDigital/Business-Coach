import type { ContentBlock } from "@/lib/types";

const CALLOUT_STYLES: Record<string, string> = {
  info: "bg-sky-50 border-sky-200 text-sky-900",
  warning: "bg-amber-50 border-amber-200 text-amber-900",
  success: "bg-emerald-50 border-emerald-200 text-emerald-900",
  trust: "bg-indigo-50 border-indigo-200 text-indigo-900",
};

export function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-8">
      {blocks.map((block) => (
        <section key={block.heading}>
          <h2 className="text-lg font-bold text-slate-900 mb-2">{block.heading}</h2>
          <div className="space-y-3">
            {block.paragraphs.map((p, i) => (
              <p key={i} className="text-sm text-slate-600 leading-relaxed">
                {p}
              </p>
            ))}
          </div>
          {block.checklist && (
            <ul className="mt-3 space-y-2">
              {block.checklist.map((item) => (
                <li key={item.text} className="flex items-start gap-2 text-sm">
                  <span className="mt-0.5 h-4 w-4 shrink-0 rounded border border-slate-300" />
                  <span className="text-slate-700">
                    {item.text}
                    {item.detail && <span className="block text-xs text-slate-400">{item.detail}</span>}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {block.callout && (
            <div
              className={`mt-3 rounded-lg border px-4 py-3 text-sm ${CALLOUT_STYLES[block.callout.tone]}`}
            >
              {block.callout.text}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
