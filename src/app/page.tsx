"use client";

import { StoreProvider } from "@/lib/store";
import { AppShell } from "@/components/AppShell";

export default function Page() {
  return (
    <StoreProvider>
      <AppShell />
    </StoreProvider>
  );
}
