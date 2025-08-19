"use client";

import { ReactNode } from "react";
import { Toaster } from "./ui/sonner";
import { Shield, Phone, Mail, MapPin, Home } from "lucide-react";
import Link from "next/link";

interface RootShellProps {
  children: ReactNode;
}

export function RootShell({ children }: RootShellProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b shadow-xl sticky top-0 z-50 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="relative container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg border border-white/20">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
              </Link>

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

            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/20 hover:border-white/30"
                aria-label="Voltar ao início"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Início</span>
              </Link>

              <a
                href="https://delegaciadigital.pjc.mt.gov.br"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all duration-200 shadow-sm border border-white/10"
                aria-label="Delegacia Digital - Registrar ocorrência"
              >
                <Shield className="w-4 h-4" />
                <span>Delegacia Digital</span>
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      </header>

      {/* Main */}
      <main className="relative">{children}</main>

      {/* Footer */}
      <footer className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white mt-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.2),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.05),transparent_50%)]" />
        <div className="relative">
          <div className="h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
          <div className="container mx-auto px-4 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
              <div className="lg:col-span-1 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">PC Mato Grosso</h3>
                    <a
                      href="https://delegaciadigital.pjc.mt.gov.br"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-300 text-sm underline-offset-2 hover:underline"
                    >
                      Delegacia Digital (Registrar ocorrência)
                    </a>
                  </div>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Trabalhamos incansavelmente para reunir famílias e trazer
                  esperança através da tecnologia e colaboração da sociedade.
                </p>
              </div>

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

      <Toaster position="top-right" richColors />
    </div>
  );
}
