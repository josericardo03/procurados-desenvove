import { useState, useEffect } from "react";
import { Pessoa } from "../types/api";
import { ApiService } from "../services/api";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { Alert, AlertDescription } from "./ui/alert";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  Info,
  Shirt,
  AlertCircle,
  Phone,
  MessageSquare,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface PessoaDetalhesProps {
  pessoaId: number;
  onBack: () => void;
  onEnviarInformacao: (
    pessoaId: number,
    pessoaNome: string,
    ocoId: number
  ) => void;
}

export function PessoaDetalhes({
  pessoaId,
  onBack,
  onEnviarInformacao,
}: PessoaDetalhesProps) {
  const [pessoa, setPessoa] = useState<Pessoa | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPessoa = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await ApiService.getPessoaById(pessoaId);

        if (!data) {
          setError("Pessoa não encontrada");
          return;
        }

        setPessoa(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    };

    loadPessoa();
  }, [pessoaId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateOnly = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-0">
                <Skeleton className="aspect-[3/4] w-full rounded-t-lg" />
                <div className="p-6 space-y-4">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error || !pessoa) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || "Pessoa não encontrada"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const isLocalizada = pessoa.ultimaOcorrencia.dataLocalizacao !== null;

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6 flex items-center gap-2 hover:bg-accent"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para a listagem
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna da Foto e Status */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardContent className="p-0">
              <div className="relative">
                <div className="aspect-[3/4] overflow-hidden rounded-t-lg">
                  {pessoa.urlFoto ? (
                    <ImageWithFallback
                      src={pessoa.urlFoto}
                      alt={`Foto de ${pessoa.nome}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <User className="w-24 h-24 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div className="absolute top-4 right-4">
                  <Badge
                    variant={isLocalizada ? "default" : "destructive"}
                    className={`${
                      isLocalizada
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-red-600 hover:bg-red-700 text-white"
                    } shadow-lg text-sm px-3 py-1`}
                  >
                    {isLocalizada ? "PESSOA LOCALIZADA" : "PESSOA DESAPARECIDA"}
                  </Badge>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    {pessoa.nome}
                  </h1>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <span>
                      {pessoa.idade > 0
                        ? `${pessoa.idade} anos`
                        : "Idade não informada"}
                    </span>
                    <span>•</span>
                    <span>{pessoa.sexo}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button
                    onClick={() => {
                      onEnviarInformacao(
                        pessoa.id,
                        pessoa.nome,
                        pessoa.ultimaOcorrencia.ocoId
                      );
                    }}
                    className="w-full flex items-center gap-2"
                    size="lg"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Enviar Informação
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Ajude com informações que possam ser úteis
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coluna de Informações Detalhadas */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informações do Desaparecimento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Informações do Desaparecimento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Data do Desaparecimento
                  </label>
                  <p className="text-foreground mt-1">
                    {formatDate(pessoa.ultimaOcorrencia.dtDesaparecimento)}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Local do Desaparecimento
                  </label>
                  <div className="flex items-start gap-2 mt-1">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-foreground">
                      {pessoa.ultimaOcorrencia.localDesaparecimentoConcat}
                    </p>
                  </div>
                </div>
              </div>

              {isLocalizada && pessoa.ultimaOcorrencia.dataLocalizacao && (
                <div className="pt-4 border-t bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <label className="text-sm font-medium text-green-700 dark:text-green-300">
                      Data da Localização
                    </label>
                  </div>
                  <p className="text-green-800 dark:text-green-200">
                    {formatDateOnly(pessoa.ultimaOcorrencia.dataLocalizacao)}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    {pessoa.ultimaOcorrencia.encontradoVivo
                      ? "Encontrada viva"
                      : "Encontrada"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Vestimentas */}
          {pessoa.ultimaOcorrencia.ocorrenciaEntrevDesapDTO
            ?.vestimentasDesaparecido && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shirt className="w-5 h-5" />
                  Vestimentas no Dia do Desaparecimento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">
                  {
                    pessoa.ultimaOcorrencia.ocorrenciaEntrevDesapDTO
                      ?.vestimentasDesaparecido
                  }
                </p>
              </CardContent>
            </Card>
          )}

          {/* Informações Adicionais */}
          {pessoa.ultimaOcorrencia.ocorrenciaEntrevDesapDTO?.informacao && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Informações Adicionais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">
                  {pessoa.ultimaOcorrencia.ocorrenciaEntrevDesapDTO?.informacao}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Informações da Ocorrência */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                Dados da Ocorrência
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Número da Ocorrência
                  </label>
                  <p className="text-foreground mt-1 font-mono">
                    {pessoa.ultimaOcorrencia.ocoId}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Status da Pessoa
                  </label>
                  <p className="text-foreground mt-1">
                    {pessoa.vivo ? "Viva" : "Não confirmado"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Aviso importante */}
          <Alert>
            <Phone className="h-4 w-4" />
            <AlertDescription>
              <strong>Importante:</strong> Se você possui informações sobre esta
              pessoa, entre em contato com a Polícia Civil do Estado de Mato
              Grosso através do telefone 197 ou utilize o botão "Enviar
              Informação" acima.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
