import Link from "next/link";
import type { Metadata } from "next";
import { COMPANY_NAME, SUPPORT_EMAIL, LEGAL_LAST_UPDATED } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What Business Formation Coach collects, why, and how to control or delete it.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-900">
        ← Business Formation Coach
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">Privacy Policy</h1>
      <p className="mt-1 text-sm text-slate-400">Last updated {LEGAL_LAST_UPDATED}</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-slate-700">
        <section>
          <h2 className="text-base font-semibold text-slate-900">What we collect</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Account info: your email, name (optional), and a hashed password — we never store your password in plain text.</li>
            <li>What you enter in the guide: business plan questionnaire answers, calculator inputs, stage completion, and (if you fill it in) your entity type, state, and formation date.</li>
            <li>The business plan document generated for you, and any feedback you submit through the feedback widget.</li>
            <li>Standard technical data: IP address (used for rate limiting and spam prevention, not stored long-term in identifiable form beyond that), and, if analytics is enabled on this deployment, anonymous, aggregated usage data via Plausible Analytics — which doesn't use cookies or track you individually across sites.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">How we use it</h2>
          <p className="mt-2">
            To run the guide (save your progress, remember your answers, show your business plan), to generate your
            business plan using Anthropic's Claude API (your questionnaire answers are sent to Anthropic solely to
            generate that document — see{" "}
            <a href="https://www.anthropic.com/legal/privacy" className="underline underline-offset-2" target="_blank" rel="noreferrer">
              Anthropic's privacy policy
            </a>{" "}
            for how they handle it), to send account emails (password reset, email verification, and — only if you've
            filled in your entity type and formation date — compliance deadline reminders), and to improve the guide.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">What we don't do</h2>
          <p className="mt-2">
            We don't sell your data. We don't share your business plan answers with affiliate partners — affiliate
            links on this site are plain outbound links, not data-sharing integrations. If we ever add advertising
            (e.g. Google AdSense) to a page, that's disclosed on this policy at the time it's added.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">Your controls</h2>
          <p className="mt-2">
            From your{" "}
            <Link href="/account" className="underline underline-offset-2">
              account page
            </Link>
            , you can change your password, export a copy of everything we have on you as a JSON file, or delete your
            account and all associated data permanently. Deleting your account removes your profile, progress,
            business plan input and document, and orders — it does not remove feedback you submitted, which is kept
            in a form that's no longer linked to your account.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">Payments</h2>
          <p className="mt-2">
            If you purchase a paid business plan review, payment is processed by Stripe — we never see or store your
            card details directly.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">Contact</h2>
          <p className="mt-2">
            Questions about this policy, or a data request outside what your account page can do: {SUPPORT_EMAIL}.
          </p>
        </section>

        <p className="border-t border-slate-200 pt-4 text-xs text-slate-400">
          This policy describes what {COMPANY_NAME} actually does in this app as of the date above. It's written to
          be accurate, not to be a substitute for legal advice — if you're relying on this for compliance purposes
          (e.g. GDPR/CCPA), have it reviewed by an attorney.
        </p>
      </div>
    </div>
  );
}
