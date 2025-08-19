"use client";

import { useRouter } from "next/navigation";
import { ComoAjudar } from "@/components/ComoAjudar";

export default function Page() {
  const router = useRouter();
  return <ComoAjudar onBack={() => router.push("/")} />;
}
