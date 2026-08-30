import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { BRANCHES, getBranch, type Branch, type BranchId } from "@/data/branches";

const STORAGE_KEY = "ozon.branch";

type BranchContextValue = {
  branchId: BranchId;
  branch: Branch;
  setBranchId: (id: BranchId) => void;
  /** True once the stored preference has been read on the client. */
  hydrated: boolean;
};

const BranchContext = createContext<BranchContextValue | null>(null);

export function BranchProvider({ children }: { children: React.ReactNode }) {
  const [branchId, setBranch] = useState<BranchId>("triprayar");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored && BRANCHES.some((b) => b.id === stored)) {
        setBranch(stored as BranchId);
      }
    } catch {
      /* storage unavailable — keep the default branch */
    }
    setHydrated(true);
  }, []);

  const setBranchId = useCallback((id: BranchId) => {
    setBranch(id);
    try {
      window.localStorage.setItem(STORAGE_KEY, id);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(
    () => ({ branchId, branch: getBranch(branchId), setBranchId, hydrated }),
    [branchId, setBranchId, hydrated],
  );

  return <BranchContext.Provider value={value}>{children}</BranchContext.Provider>;
}

export function useBranch(): BranchContextValue {
  const ctx = useContext(BranchContext);
  if (!ctx) throw new Error("useBranch must be used inside BranchProvider");
  return ctx;
}
