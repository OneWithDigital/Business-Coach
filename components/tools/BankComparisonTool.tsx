"use client";

import { useMemo, useState } from "react";
import { recommendBank } from "@/lib/calc/bankSelector";

export function BankComparisonTool() {
  const [handlesCashDeposits, setHandlesCashDeposits] = useState(false);
  const [wantsBranchAccess, setWantsBranchAccess] = useState(false);
  const [planningToRaiseOutsideMoney, setPlanningToRaiseOutsideMoney] = useState(false);
  const [wantsSubAccounts, setWantsSubAccounts] = useState(false);
  const [wantsInterestBearingChecking, setWantsInterestBearingChecking] = useState(false);

  const result = useMemo(
    () =>
      recommendBank({
        handlesCashDeposits,
        wantsBranchAccess,
        planningToRaiseOutsideMoney,
        wantsSubAccounts,
        wantsInterestBearingChecking,
      }),
    [handlesCashDeposits, wantsBranchAccess, planningToRaiseOutsideMoney, wantsSubAccounts, wantsInterestBearingChecking]
  );

  const options: [string, boolean, (v: boolean) => void][] = [
    ["I regularly deposit cash", handlesCashDeposits, setHandlesCashDeposits],
    ["I want to be able to walk into a physical branch", wantsBranchAccess, setWantsBranchAccess],
    ["I'm planning to raise money from investors", planningToRaiseOutsideMoney, setPlanningToRaiseOutsideMoney],
    ["I want separate sub-accounts for taxes/payroll/profit", wantsSubAccounts, setWantsSubAccounts],
    ["Earning interest on my checking balance matters to me", wantsInterestBearingChecking, setWantsInterestBearingChecking],
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-4">
      <h3 className="text-sm font-semibold text-slate-900">Bank comparison</h3>
      <div className="space-y-2 text-sm">
        {options.map(([label, value, setter]) => (
          <label key={label} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => setter(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            <span>{label}</span>
          </label>
        ))}
      </div>
      <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-sm space-y-2">
        <p className="font-semibold text-slate-900">Suggested: {result.name}</p>
        <ul className="space-y-1 text-slate-600">
          {result.reasoning.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
