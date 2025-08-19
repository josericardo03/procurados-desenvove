import { useState } from "react";
import { PessoasListagem } from "./components/PessoasListagem";
import { ComoAjudar } from "./components/ComoAjudar";
import { PessoaDetalhes } from "./components/PessoaDetalhes";
import { FormularioInformacao } from "./components/FormularioInformacao";
import { Toaster } from "./components/ui/sonner";
import { Shield, Home, Phone, Mail, MapPin } from "lucide-react";

type AppState =
  | { view: "listagem" }
  | { view: "detalhes"; pessoaId: number }
  | { view: "formulario"; pessoaId: number; pessoaNome: string; ocoId: number }
  | { view: "comoAjudar" };

export default function App() {
  const [appState, setAppState] = useState<AppState>({ view: "listagem" });

  const navegarParaDetalhes = (pessoaId: number) => {
    setAppState({ view: "detalhes", pessoaId });
  };

  const navegarParaFormulario = (
    pessoaId: number,
    pessoaNome: string,
    ocoId: number
  ) => {
    setAppState({ view: "formulario", pessoaId, pessoaNome, ocoId });
  };

  const voltarParaListagem = () => {
    setAppState({ view: "listagem" });
  };

  const navegarParaComoAjudar = () => {
    setAppState({ view: "comoAjudar" });
  };

  const voltarParaDetalhes = (pessoaId: number) => {
    setAppState({ view: "detalhes", pessoaId });
  };

  const handleFormularioSuccess = () => {
    setAppState({ view: "listagem" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header Premium */}
      <header className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b shadow-xl sticky top-0 z-50 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.1),transparent_50%)]" />

        {/* Header Content */}
        <div className="relative container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Logo Premium */}
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg border border-white/20">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
              </div>

              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  Pessoas Desaparecidas
                </h1>
                <p className="text-slate-300 text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Polícia Civil do Estado de Mato Grosso
                </p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-4">
              {appState.view !== "listagem" && (
                <button
                  onClick={voltarParaListagem}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/20 hover:border-white/30"
                >
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline">Voltar ao início</span>
                </button>
              )}

              <div className="hidden md:flex items-center gap-6 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>197</span>
                </div>
                <div className="w-1 h-4 bg-white/20 rounded-full" />
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>Emergência</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      </header>

      {/* Hero Section for Homepage */}
      {appState.view === "listagem" && (
        <div className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50/30 border-b">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(59,130,246,0.1),transparent_50%)]" />
          <div className="relative container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                Sistema Ativo 24/7
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                Ajude-nos a
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {" "}
                  encontrar{" "}
                </span>
                quem precisamos
              </h1>

              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Sua informação pode ser a peça que falta para reunir uma
                família. Consulte registros e contribua com dados que podem
                salvar vidas.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-xl p-6 shadow-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    Dados Oficiais
                  </h3>
                  <p className="text-slate-600 text-sm">
                    Informações verificadas pela Polícia Civil de MT
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-xl p-6 shadow-lg">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    Suporte 24h
                  </h3>
                  <p className="text-slate-600 text-sm">
                    Atendimento emergencial através do 197
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-xl p-6 shadow-lg">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    Envio Seguro
                  </h3>
                  <p className="text-slate-600 text-sm">
                    Suas informações são tratadas com confidencialidade
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative">
        {appState.view === "listagem" && (
          <PessoasListagem
            onPessoaClick={navegarParaDetalhes}
            onComoAjudar={navegarParaComoAjudar}
          />
        )}

        {appState.view === "detalhes" && (
          <PessoaDetalhes
            pessoaId={appState.pessoaId}
            onBack={voltarParaListagem}
            onEnviarInformacao={(
              pessoaId: number,
              pessoaNome: string,
              ocoId: number
            ) => {
              navegarParaFormulario(pessoaId, pessoaNome, ocoId);
            }}
          />
        )}

        {appState.view === "formulario" && (
          <FormularioInformacao
            pessoaId={appState.pessoaId}
            pessoaNome={appState.pessoaNome}
            ocoId={appState.ocoId}
            onBack={() => voltarParaDetalhes(appState.pessoaId)}
            onSuccess={handleFormularioSuccess}
          />
        )}

        {appState.view === "comoAjudar" && (
          <ComoAjudar onBack={voltarParaListagem} />
        )}
      </main>

      {/* Footer Premium */}
      <footer className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white mt-24 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.2),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.05),transparent_50%)]" />

        <div className="relative">
          {/* Top gradient line */}
          <div className="h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

          <div className="container mx-auto px-4 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
              {/* Brand Section */}
              <div className="lg:col-span-1 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">PC Mato Grosso</h3>
                    <p className="text-slate-400 text-sm">
                      Pessoas Desaparecidas
                    </p>
                  </div>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Trabalhamos incansavelmente para reunir famílias e trazer
                  esperança através da tecnologia e colaboração da sociedade.
                </p>
              </div>

              {/* Emergency Contacts */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg mb-6 text-white">
                  Contatos de Emergência
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                      <Phone className="w-4 h-4 text-red-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-300">Polícia Civil</p>
                      <p className="font-bold text-white">197</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Phone className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-300">Polícia Militar</p>
                      <p className="font-bold text-white">190</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <Phone className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-300">Emergências</p>
                      <p className="font-bold text-white">192/193</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* System Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg mb-6 text-white">
                  Informações do Sistema
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-slate-300">API Status</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-green-400">Online</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-slate-300">Estado</span>
                    <span className="text-white">Mato Grosso</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-slate-300">Última Atualização</span>
                    <span className="text-white">
                      {new Date().toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Help Section */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg mb-6 text-white">
                  Como Contribuir
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-400 text-xs font-bold">1</span>
                    </div>
                    <p className="text-slate-300 text-sm">
                      Compartilhe apenas informações verdadeiras e relevantes
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-400 text-xs font-bold">
                        2
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm">
                      Entre em contato imediatamente com a polícia se tiver
                      informações
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-purple-400 text-xs font-bold">
                        3
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm">
                      Divulgue casos em suas redes sociais responsavelmente
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="border-t border-white/10 pt-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left">
                  <p className="text-slate-400 text-sm">
                    © 2025 Polícia Civil do Estado de Mato Grosso. Todos os
                    direitos reservados.
                  </p>
                  <p className="text-slate-500 text-xs mt-1">
                    Sistema desenvolvido para auxiliar na localização de pessoas
                    desaparecidas.
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>Versão 2.1.0</span>
                  <span>•</span>
                  <span>API: abitus-api.geia.vip</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Toast notifications */}
      <Toaster position="top-right" richColors />
    </div>
  );
}
