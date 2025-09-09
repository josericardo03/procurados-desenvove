"use client";

import { useParams, useRouter } from "next/navigation";
import { PessoaDetalhes } from "../../../components/PessoaDetalhes";

export default function Page() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  if (Number.isNaN(id)) return null;

  return (
    <PessoaDetalhes
      pessoaId={id}
      onBack={() => router.push("/")}
      onEnviarInformacao={(pessoaId, pessoaNome, ocoId) =>
        router.push(
          `/informar/${ocoId}?pessoaId=${pessoaId}&pessoaNome=${encodeURIComponent(
            pessoaNome
          )}`
        )
      }
    />
  );
}
