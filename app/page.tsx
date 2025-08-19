"use client";

import { useRouter } from "next/navigation";
import { PessoasListagem } from "@/components/PessoasListagem";

export default function Page() {
  const router = useRouter();
  return (
    <PessoasListagem
      onPessoaClick={(id) => router.push(`/pessoa/${id}`)}
      onComoAjudar={() => router.push(`/como-ajudar`)}
    />
  );
}
