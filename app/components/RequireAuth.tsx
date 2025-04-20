// app/components/RequireAuth.tsx
"use client";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/Login");
    }
  }, [token]);

  if (!token) {
    return <p>Redirecting to login...</p>;
  }

  return <>{children}</>;
}
