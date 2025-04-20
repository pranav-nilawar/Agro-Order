// app/protected/layout.tsx
"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) router.push("/login");
  }, [token]);

  if (!token) return null;

  return <>{children}</>;
}
