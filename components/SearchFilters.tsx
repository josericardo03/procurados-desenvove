import { useEffect, useState } from "react";
import { SearchFilters as SearchFiltersType } from "@/types/api";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "@/components/ui/button";
import { Search, X, Filter, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onFiltersChange: (filters: SearchFiltersType) => void;
  onClearFilters: () => void;
  isLoading?: boolean;
}

export function SearchFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  isLoading = false,
}: SearchFiltersProps) {
  // Estados locais para evitar travar a digitação e debounciar as requisições
  const [nome, setNome] = useState<string>(filters.nome || "");
  const [status, setStatus] = useState<"desaparecido" | "localizado" | "todos">(
    filters.status || "todos"
  );
  const [sexo, setSexo] = useState<"MASCULINO" | "FEMININO" | "todos">(
    filters.sexo || "todos"
  );
  const [dataDe, setDataDe] = useState<string>(
    filters.dataDesaparecimentoDe || ""
  );
  const [dataAte, setDataAte] = useState<string>(
    filters.dataDesaparecimentoAte || ""
  );

  // Sincroniza quando filtros são limpos/alterados de fora
  useEffect(() => {
    setNome(filters.nome || "");
    setStatus(filters.status || "todos");
    setSexo(filters.sexo || "todos");
    setDataDe(filters.dataDesaparecimentoDe || "");
    setDataAte(filters.dataDesaparecimentoAte || "");
  }, [filters.nome, filters.sexo, filters.status]);

  // Debounce para reduzir chamadas à API enquanto digita
  useEffect(() => {
    const handler = setTimeout(() => {
      onFiltersChange({
        nome: nome.trim() || undefined,
        status: status === "todos" ? undefined : status,
        sexo: sexo === "todos" ? undefined : sexo,
        dataDesaparecimentoDe: dataDe || undefined,
        dataDesaparecimentoAte: dataAte || undefined,
      });
    }, 450);
    return () => clearTimeout(handler);
    // Intencionalmente não dependemos de onFiltersChange para evitar loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nome, status, sexo, dataDe, dataAte]);

  const hasActiveFilters = Boolean(
    nome || (status && status !== "todos") || (sexo && sexo !== "todos")
  );

  return (
    <div className="mb-8">
      <Card className="bg-white/80 backdrop-blur-sm border-white/60 shadow-xl overflow-hidden">
        <CardContent className="p-0">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    Filtros de Busca
                  </h2>
                  <p className="text-slate-300 text-sm">
                    Refine sua pesquisa para encontrar pessoas específicas
                  </p>
                </div>
              </div>

              {hasActiveFilters && (
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Sparkles className="w-4 h-4" />
                  <span>Filtros ativos</span>
                </div>
              )}
            </div>
          </div>

          {/* Filters Content */}
          <div className="p-6 bg-gradient-to-br from-slate-50/50 to-white">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Name Filter */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Nome da Pessoa
                </label>
                <div className="relative">
                  <Input
                    placeholder="Digite o nome para buscar..."
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    disabled={isLoading}
                    className="bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500 pl-10 h-11 shadow-sm"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>
              </div>

              {/* Status Filter */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  Status da Pessoa
                </label>
                <Select
                  value={status}
                  onValueChange={(v) => setStatus(v as any)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 h-11 shadow-sm">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200 shadow-xl">
                    <SelectItem value="todos" className="hover:bg-slate-50">
                      Todas as Pessoas
                    </SelectItem>
                    <SelectItem
                      value="desaparecido"
                      className="hover:bg-red-50 text-red-700"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        Desaparecidas
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="localizado"
                      className="hover:bg-green-50 text-green-700"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Localizadas
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Gender Filter */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Sexo
                </label>
                <Select
                  value={sexo}
                  onValueChange={(v) => setSexo(v as any)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="bg-white border-slate-200 focus:border-purple-500 focus:ring-purple-500 h-11 shadow-sm">
                    <SelectValue placeholder="Selecione o sexo" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200 shadow-xl">
                    <SelectItem value="todos" className="hover:bg-slate-50">
                      Todos
                    </SelectItem>
                    <SelectItem value="MASCULINO" className="hover:bg-blue-50">
                      Masculino
                    </SelectItem>
                    <SelectItem value="FEMININO" className="hover:bg-pink-50">
                      Feminino
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro por Data de Desaparecimento */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Data do Desaparecimento
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="date"
                    value={dataDe}
                    onChange={(e) => setDataDe(e.target.value)}
                    className="h-11 px-3 rounded-md border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="A partir de"
                  />
                  <input
                    type="date"
                    value={dataAte}
                    onChange={(e) => setDataAte(e.target.value)}
                    className="h-11 px-3 rounded-md border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Até"
                  />
                </div>
              </div>

              {/* Clear Button */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                  Ações
                </label>
                <Button
                  variant="outline"
                  onClick={onClearFilters}
                  disabled={!hasActiveFilters || isLoading}
                  className="w-full h-11 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 disabled:opacity-50"
                >
                  <X className="w-4 h-4 mr-2" />
                  Limpar Filtros
                </Button>
              </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="mt-6 pt-6 border-t border-slate-200">
                <div className="flex items-center gap-2 mb-3">
                  <Filter className="w-4 h-4 text-slate-600" />
                  <span className="text-sm font-semibold text-slate-700">
                    Filtros Aplicados:
                  </span>
                </div>

                <div className="flex flex-wrap gap-3">
                  {filters.nome && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg border border-blue-200 shadow-sm">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-sm font-medium">
                        Nome: {filters.nome}
                      </span>
                    </div>
                  )}

                  {filters.status && (
                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border shadow-sm ${
                        filters.status === "desaparecido"
                          ? "bg-red-100 text-red-800 border-red-200"
                          : "bg-green-100 text-green-800 border-green-200"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          filters.status === "desaparecido"
                            ? "bg-red-600"
                            : "bg-green-600"
                        }`}
                      ></div>
                      <span className="text-sm font-medium">
                        Status:{" "}
                        {filters.status === "desaparecido"
                          ? "Desaparecidas"
                          : "Localizadas"}
                      </span>
                    </div>
                  )}

                  {filters.sexo && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-lg border border-purple-200 shadow-sm">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      <span className="text-sm font-medium">
                        Sexo: {filters.sexo}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="mt-6 pt-6 border-t border-slate-200">
                <div className="flex items-center justify-center gap-3 py-2">
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-slate-600 font-medium">
                    Aplicando filtros...
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
