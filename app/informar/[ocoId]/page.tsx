"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { FormularioInformacao } from "../../../components/FormularioInformacao";

export default function Page() {
  const router = useRouter();
  const params = useParams<{ ocoId: string }>();
  const search = useSearchParams();

  const ocoId = Number(params.ocoId);
  const pessoaId = Number(search.get("pessoaId"));
  const pessoaNome = search.get("pessoaNome") || "";

  if (Number.isNaN(ocoId) || Number.isNaN(pessoaId)) return null;

  return (
    <FormularioInformacao
      pessoaId={pessoaId}
      pessoaNome={pessoaNome}
      ocoId={ocoId}
      onBack={() => router.push(`/pessoa/${pessoaId}`)}
      onSuccess={() => router.push("/")}
    />
  );
}
