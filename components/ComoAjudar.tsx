import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Phone,
  MessageSquare,
  Share2,
  Eye,
  MapPin,
  Camera,
  Clock,
  Shield,
  Users,
  AlertTriangle,
  CheckCircle,
  Heart,
  Zap,
  FileText,
  Search,
} from "lucide-react";

interface ComoAjudarProps {
  onBack: () => void;
}

export function ComoAjudar({ onBack }: ComoAjudarProps) {
  const handleLigarPolicia = () => {
    window.open("tel:197", "_self");
  };

  const handleCompartilharWhatsApp = () => {
    const url = window.location.origin;
    const texto =
      `Confira o sistema de Pessoas Desaparecidas da Polícia Civil de Mato Grosso. Sua informação pode ajudar a reunir famílias! ${url}`.trim();
    const mensagem = encodeURIComponent(texto);
    window.open(`https://wa.me/?text=${mensagem}`, "_blank");
  };

  const passos = [
    {
      numero: 1,
      titulo: "Analise Cuidadosamente",
      descricao:
        "Observe com atenção as fotos e características das pessoas desaparecidas.",
      icone: Eye,
      cor: "blue",
    },
    {
      numero: 2,
      titulo: "Avalie suas Informações",
      descricao:
        "Certifique-se de que suas informações são relevantes e verdadeiras.",
      icone: Search,
      cor: "purple",
    },
    {
      numero: 3,
      titulo: "Entre em Contato",
      descricao: "Ligue imediatamente para 197 ou use nosso formulário online.",
      icone: Phone,
      cor: "green",
    },
    {
      numero: 4,
      titulo: "Forneça Detalhes",
      descricao:
        "Compartilhe local, data, hora e circunstâncias do avistamento.",
      icone: FileText,
      cor: "orange",
    },
  ];

  const dicas = [
    {
      titulo: "Seja Específico com Localizações",
      descricao:
        "Forneça endereços completos, pontos de referência ou coordenadas GPS quando possível.",
      icone: MapPin,
    },
    {
      titulo: "Documente com Fotos",
      descricao:
        "Se possível, tire fotos discretas que possam ajudar na identificação ou localização.",
      icone: Camera,
    },
    {
      titulo: "Anote Data e Hora",
      descricao:
        "Registre com precisão quando e onde você viu a pessoa desaparecida.",
      icone: Clock,
    },
    {
      titulo: "Mantenha Discrição",
      descricao:
        "Não aborde diretamente a pessoa. Entre em contato com as autoridades primeiro.",
      icone: Shield,
    },
  ];

  const contatos = [
    {
      titulo: "Polícia Civil",
      numero: "197",
      descricao: "Atendimento 24h especializado em pessoas desaparecidas",
      cor: "red",
      prioridade: "Emergencial",
      link: "https://www.pjc.mt.gov.br",
    },
    {
      titulo: "Polícia Militar",
      numero: "190",
      descricao: "Para situações de emergência e apoio imediato",
      cor: "blue",
      prioridade: "Emergencial",
      link: "https://www.pm.mt.gov.br",
    },
    {
      titulo: "Delegacia da Mulher",
      numero: "(65) 3901-4277",
      descricao: "Atendimento da Delegacia da Mulher",
      cor: "purple",
      prioridade: "Normal",
      link: "https://www.pjc.mt.gov.br",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button - Garantindo que seja visível e clicável */}
        <div className="mb-8 relative z-10">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-6 flex items-center gap-2 hover:bg-accent bg-white shadow-sm border border-slate-200 text-slate-700 hover:text-slate-900 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para a listagem
          </Button>

          {/* Header Content */}
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200 mb-6">
              <Heart className="w-4 h-4" />
              Guia Completo de Colaboração
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
              Como
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Ajudar{" "}
              </span>
              a Encontrar Pessoas
            </h1>

            <p className="text-xl text-slate-600 leading-relaxed">
              Sua colaboração pode ser fundamental para reunir famílias e salvar
              vidas. Saiba como contribuir de forma efetiva e responsável.
            </p>
          </div>
        </div>

        {/* Alert Importante */}
        <Alert className="mb-12 max-w-4xl mx-auto border-amber-200 bg-amber-50">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Importante:</strong> Se você possui informações urgentes
            sobre uma pessoa desaparecida, ligue imediatamente para{" "}
            <strong>197</strong>. Não espere para preencher formulários online.
          </AlertDescription>
        </Alert>

        {/* Passo a Passo */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-white/60 rounded-full text-sm font-medium text-slate-700 mb-4">
              <Zap className="w-4 h-4 text-blue-600" />
              Processo Simplificado
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Como Proceder
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Siga estes passos simples para contribuir de forma efetiva com as
              investigações
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {passos.map((passo, index) => (
              <Card
                key={index}
                className="relative bg-white/80 backdrop-blur-sm border-white/60 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden"
              >
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
                    passo.cor === "blue"
                      ? "from-blue-400 to-blue-600"
                      : passo.cor === "purple"
                      ? "from-purple-400 to-purple-600"
                      : passo.cor === "green"
                      ? "from-green-400 to-green-600"
                      : "from-orange-400 to-orange-600"
                  }`}
                />

                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                      passo.cor === "blue"
                        ? "bg-blue-100"
                        : passo.cor === "purple"
                        ? "bg-purple-100"
                        : passo.cor === "green"
                        ? "bg-green-100"
                        : "bg-orange-100"
                    } group-hover:scale-110 transition-transform duration-300`}
                  >
                    <passo.icone
                      className={`w-7 h-7 ${
                        passo.cor === "blue"
                          ? "text-blue-600"
                          : passo.cor === "purple"
                          ? "text-purple-600"
                          : passo.cor === "green"
                          ? "text-green-600"
                          : "text-orange-600"
                      }`}
                    />
                  </div>

                  <div
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-full mb-3 ${
                      passo.cor === "blue"
                        ? "bg-blue-600"
                        : passo.cor === "purple"
                        ? "bg-purple-600"
                        : passo.cor === "green"
                        ? "bg-green-600"
                        : "bg-orange-600"
                    } text-white text-sm font-bold`}
                  >
                    {passo.numero}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {passo.titulo}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {passo.descricao}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Dicas Importantes */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-white/60 rounded-full text-sm font-medium text-slate-700 mb-4">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Melhores Práticas
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Dicas Importantes
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Orientações essenciais para tornar sua colaboração mais efetiva
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {dicas.map((dica, index) => (
              <Card
                key={index}
                className="bg-white/80 backdrop-blur-sm border-white/60 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center flex-shrink-0">
                      <dica.icone className="w-6 h-6 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">
                        {dica.titulo}
                      </h3>
                      <p className="text-slate-600 leading-relaxed">
                        {dica.descricao}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contatos de Emergência */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-white/60 rounded-full text-sm font-medium text-slate-700 mb-4">
              <Phone className="w-4 h-4 text-red-600" />
              Contatos de Emergência
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Canais de Atendimento
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Diferentes canais para diferentes tipos de situações
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {contatos.map((contato, index) => (
              <Card
                key={index}
                className="bg-white/80 backdrop-blur-sm border-white/60 shadow-lg hover:shadow-xl transition-all duration-300 group h-full flex flex-col"
              >
                <CardHeader className="text-center pb-4">
                  <div
                    className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                      contato.cor === "red"
                        ? "bg-red-100"
                        : contato.cor === "blue"
                        ? "bg-blue-100"
                        : "bg-purple-100"
                    } group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Phone
                      className={`w-7 h-7 ${
                        contato.cor === "red"
                          ? "text-red-600"
                          : contato.cor === "blue"
                          ? "text-blue-600"
                          : "text-purple-600"
                      }`}
                    />
                  </div>

                  <Badge
                    variant={
                      contato.prioridade === "Emergencial"
                        ? "destructive"
                        : "secondary"
                    }
                    className="mb-2"
                  >
                    {contato.prioridade}
                  </Badge>

                  <CardTitle className="text-xl">{contato.titulo}</CardTitle>
                  <div
                    className={`text-2xl font-bold tabular-nums leading-none ${
                      contato.cor === "red"
                        ? "text-red-600"
                        : contato.cor === "blue"
                        ? "text-blue-600"
                        : "text-purple-600"
                    }`}
                  >
                    {contato.numero}
                  </div>
                </CardHeader>
                <CardContent className="pt-0 text-center mt-auto">
                  <p className="text-slate-600 text-sm mb-4">
                    {contato.descricao}
                  </p>
                  <Button
                    onClick={() =>
                      contato.link
                        ? window.open(contato.link, "_blank")
                        : window.open(`tel:${contato.numero}`, "_self")
                    }
                    className={`w-full ${
                      contato.cor === "red"
                        ? "bg-red-600 hover:bg-red-700"
                        : contato.cor === "blue"
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-purple-600 hover:bg-purple-700"
                    }`}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    {contato.link ? "Acessar Site" : "Ligar Agora"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Compartilhamento */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-indigo-50 via-white to-purple-50 border-indigo-200 shadow-xl max-w-4xl mx-auto">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Share2 className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Divulgue e Ajude a Espalhar a Palavra
              </h3>
              <p className="text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto">
                Compartilhe este sistema com familiares e amigos. Quanto mais
                pessoas souberem, maiores são as chances de encontrarmos quem
                precisamos.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleCompartilharWhatsApp}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                >
                  <MessageSquare className="w-5 h-5" />
                  Compartilhar no WhatsApp
                </Button>

                <Button
                  onClick={() =>
                    navigator.clipboard.writeText(window.location.origin)
                  }
                  variant="outline"
                  size="lg"
                  className="border-slate-300 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Share2 className="w-5 h-5" />
                  Copiar Link
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Call to Action Final */}
        <section className="text-center">
          <Card className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white border-0 shadow-2xl max-w-4xl mx-auto overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)]" />
            <CardContent className="relative p-12 z-10">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 border border-white/20">
                <Users className="w-10 h-10 text-white" />
              </div>

              <h3 className="text-3xl font-bold mb-4">
                Juntos Somos Mais Fortes
              </h3>
              <p className="text-slate-300 mb-8 leading-relaxed max-w-2xl mx-auto text-lg">
                Cada informação, por menor que pareça, pode ser a chave para
                reunir uma família. Sua colaboração faz a diferença.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() =>
                    window.open(
                      "https://delegaciadigital.pjc.mt.gov.br",
                      "_blank"
                    )
                  }
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  Delegacia Digital
                </Button>

                <Button
                  onClick={onBack}
                  variant="outline"
                  size="lg"
                  className="border-white/30 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm flex items-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  Ver Pessoas Desaparecidas
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
