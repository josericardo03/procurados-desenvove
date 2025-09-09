"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { PessoasListagem } from "../components/PessoasListagem";

function PessoasListagemWrapper() {
  const router = useRouter();
  return (
    <PessoasListagem
      onPessoaClick={(id) => router.push(`/pessoa/${id}`)}
      onComoAjudar={() => router.push(`/como-ajudar`)}
    />
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">
                Carregando lista de pessoas...
              </p>
            </div>
          </div>
        </div>
      }
    >
      <PessoasListagemWrapper />
    </Suspense>
  );
}
