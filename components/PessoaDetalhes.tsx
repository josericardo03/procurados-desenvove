import { useState, useEffect } from "react";
import { Pessoa } from "@/types/api";
import { ApiService } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  Share2,
  Copy,
  Check,
} from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

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
  const [copied, setCopied] = useState(false);

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

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Informações sobre ${pessoa?.nome}`,
          text: `Veja as informações sobre ${pessoa?.nome} no sistema de pessoas desaparecidas.`,
          url: url,
        });
      } catch (err) {
        // Usuário cancelou ou erro no compartilhamento
        console.log("Erro ao compartilhar:", err);
      }
    } else {
      // Fallback para cópia
      handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erro ao copiar link:", err);
    }
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

      {/* Status Banner */}
      <div
        className={`mb-8 p-4 rounded-xl border-2 ${
          isLocalizada
            ? "bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200"
            : "bg-gradient-to-r from-red-50 to-rose-50 border-red-200"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-3 h-3 rounded-full ${
              isLocalizada ? "bg-emerald-500" : "bg-red-500"
            }`}
          />
          <div>
            <h2
              className={`text-lg font-bold ${
                isLocalizada ? "text-emerald-800" : "text-red-800"
              }`}
            >
              {isLocalizada ? "Pessoa Localizada" : "Pessoa Desaparecida"}
            </h2>
            <p
              className={`text-sm ${
                isLocalizada ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {isLocalizada
                ? "Esta pessoa foi encontrada e está segura."
                : "Esta pessoa ainda está desaparecida. Qualquer informação é valiosa."}
            </p>
          </div>
        </div>
      </div>

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
                        ? "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg border-0"
                        : "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-lg border-0"
                    } text-sm px-4 py-2 font-bold tracking-wide backdrop-blur-sm`}
                  >
                    {isLocalizada ? "✓ LOCALIZADA" : "⚠ DESAPARECIDA"}
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

                <div className="pt-4 border-t space-y-3">
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

                  <div className="flex gap-2">
                    <Button
                      onClick={handleShare}
                      variant="outline"
                      className="flex-1 flex items-center gap-2"
                      size="sm"
                    >
                      <Share2 className="w-4 h-4" />
                      Compartilhar
                    </Button>
                    <Button
                      onClick={handleCopyLink}
                      variant="outline"
                      className="flex-1 flex items-center gap-2"
                      size="sm"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      {copied ? "Copiado!" : "Copiar Link"}
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground text-center">
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
