import { useState, useEffect } from "react";
import { ApiResponse, SearchFilters as SearchFiltersType } from "../types/api";
import { ApiService } from "../services/api";
import { PessoaCard } from "./PessoaCard";
import { SearchFilters } from "./SearchFilters";
import { Pagination } from "./ui/pagination";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { AlertCircle, Users, TrendingUp, Clock, Search } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { TimeoutError, NetworkError, HttpError } from "../services/api";

interface PessoasListagemProps {
  onPessoaClick: (id: number) => void;
  onComoAjudar: () => void;
}

export function PessoasListagem({
  onPessoaClick,
  onComoAjudar,
}: PessoasListagemProps) {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState<SearchFiltersType>({});

  const loadPessoas = async (
    page: number = 0,
    newFilters?: SearchFiltersType
  ) => {
    try {
      setLoading(true);
      setError(null);
      const filtersToUse = newFilters !== undefined ? newFilters : filters;
      const response = await ApiService.getPessoas(page, 10, filtersToUse);
      setData(response);
      setCurrentPage(page);
    } catch (err) {
      let message = "Erro desconhecido";
      if (err instanceof TimeoutError)
        message = "Tempo esgotado. Tente novamente.";
      else if (err instanceof NetworkError)
        message = "Falha de rede. Verifique sua conexão.";
      else if (err instanceof HttpError)
        message = `Erro do servidor (HTTP ${err.status}).`;
      else if (err instanceof Error) message = err.message;
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPessoas(0);
  }, []);

  const handleFiltersChange = (newFilters: SearchFiltersType) => {
    setFilters(newFilters);
    loadPessoas(0, newFilters);
  };

  const handleClearFilters = () => {
    const emptyFilters: SearchFiltersType = {};
    setFilters(emptyFilters);
    loadPessoas(0, emptyFilters);
  };

  const handlePageChange = (page: number) => {
    loadPessoas(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getStatistics = () => {
    if (!data) return { total: 0, desaparecidas: 0, localizadas: 0 };

    const desaparecidas = data.content.filter(
      (p) => !p.ultimaOcorrencia.dataLocalizacao
    ).length;
    const localizadas = data.content.filter(
      (p) => p.ultimaOcorrencia.dataLocalizacao
    ).length;

    return {
      total: data.totalElements,
      desaparecidas,
      localizadas,
    };
  };

  const stats = getStatistics();

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className="text-base">
            {error}
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadPessoas(0)}
              className="ml-4"
            >
              Tentar Novamente
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="container mx-auto px-4 py-12">
        {/* Statistics Section */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 font-semibold text-sm tracking-wide uppercase">
                      Total de Registros
                    </p>
                    <p className="text-3xl font-bold text-blue-900 mt-2">
                      {stats.total}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-blue-700">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  <span>Atualizado em tempo real</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-rose-100 border-red-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-600 font-semibold text-sm tracking-wide uppercase">
                      Desaparecidas
                    </p>
                    <p className="text-3xl font-bold text-red-900 mt-2">
                      {stats.desaparecidas}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-red-700">
                  <Search className="w-4 h-4 mr-2" />
                  <span>Busca ativa em andamento</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-50 to-green-100 border-emerald-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-600 font-semibold text-sm tracking-wide uppercase">
                      Localizadas
                    </p>
                    <p className="text-3xl font-bold text-emerald-900 mt-2">
                      {stats.localizadas}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-emerald-700">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  <span>Histórico de sucesso</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Results Header */}
        <div className="mb-8">
          <div
            className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-2xl p-6 shadow-lg"
            aria-live="polite"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Registros de Pessoas
                </h2>
                {data && (
                  <p className="text-slate-600 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      <Users className="w-4 h-4" />
                      {data.numberOfElements} de {data.totalElements} registros
                    </span>
                    <span className="text-slate-400">•</span>
                    <span>
                      Página {currentPage + 1} de {data.totalPages}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Search Filters */}
        <SearchFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
          isLoading={loading}
        />

        {/* Results Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="overflow-hidden shadow-lg">
                <CardContent className="p-0">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <div className="p-6 space-y-4">
                    <div className="space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                    <div className="space-y-3">
                      <Skeleton className="h-16 w-full rounded-xl" />
                      <Skeleton className="h-16 w-full rounded-xl" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : data && data.content.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
              {data.content.map((pessoa) => (
                <PessoaCard
                  key={pessoa.id}
                  pessoa={pessoa}
                  onClick={() => onPessoaClick(pessoa.id)}
                />
              ))}
            </div>

            {data.totalPages > 1 && (
              <div className="flex justify-center mb-8">
                <div className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-2xl p-4 shadow-lg">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={data.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <Card className="max-w-2xl mx-auto shadow-xl">
            <CardContent className="flex flex-col items-center justify-center py-16 px-8">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center mb-6">
                <Users className="w-12 h-12 text-slate-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Nenhuma pessoa encontrada
              </h3>
              <p className="text-slate-600 text-center mb-6 leading-relaxed">
                Não encontramos nenhum registro que corresponda aos filtros
                aplicados. Tente ajustar os critérios de busca para ver mais
                resultados.
              </p>
              <Button
                onClick={handleClearFilters}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                size="lg"
              >
                Limpar Filtros
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 border border-blue-100 shadow-lg">
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Precisa de Ajuda?
            </h3>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Se você possui informações sobre qualquer pessoa listada aqui, não
              hesite em entrar em contato. Sua contribuição pode ser fundamental
              para reunir famílias.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() =>
                  window.open(
                    "https://delegaciadigital.pjc.mt.gov.br",
                    "_blank"
                  )
                }
              >
                Delegacia Digital
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-colors duration-200"
                onClick={onComoAjudar}
              >
                Como Ajudar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
