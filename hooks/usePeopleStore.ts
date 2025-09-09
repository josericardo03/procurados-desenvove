import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchFilters } from "@/types/api";

interface PeopleStoreState {
  currentPage: number;
  pageSize: number;
  filters: SearchFilters;
  isLoading: boolean;
  error: string | null;
}

export function usePeopleStore() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [state, setState] = useState<PeopleStoreState>({
    currentPage: 0,
    pageSize: 10,
    filters: {},
    isLoading: false,
    error: null,
  });

  // Carregar estado inicial da URL
  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "0");
    const size = parseInt(searchParams.get("size") || "10");
    const nome = searchParams.get("nome") || undefined;
    const status = searchParams.get("status") as
      | "desaparecido"
      | "localizado"
      | "todos"
      | null;
    const sexo = searchParams.get("sexo") as
      | "MASCULINO"
      | "FEMININO"
      | "todos"
      | null;
    const dataDe = searchParams.get("dataDe") || undefined;
    const dataAte = searchParams.get("dataAte") || undefined;

    const urlFilters: SearchFilters = {};
    if (nome) urlFilters.nome = nome;
    if (status && status !== "todos") urlFilters.status = status;
    if (sexo && sexo !== "todos") urlFilters.sexo = sexo;
    if (dataDe) urlFilters.dataDesaparecimentoDe = dataDe;
    if (dataAte) urlFilters.dataDesaparecimentoAte = dataAte;

    setState((prev) => ({
      ...prev,
      currentPage: page,
      pageSize: size,
      filters: urlFilters,
    }));
  }, [searchParams]);

  // Atualizar URL com estado atual
  const updateURL = useCallback(
    (newState: Partial<PeopleStoreState>) => {
      const params = new URLSearchParams();

      const page = newState.currentPage ?? state.currentPage;
      const size = newState.pageSize ?? state.pageSize;
      const filters = newState.filters ?? state.filters;

      if (page > 0) params.set("page", page.toString());
      if (size !== 10) params.set("size", size.toString());

      if (filters.nome) params.set("nome", filters.nome);
      if (filters.status && filters.status !== "todos")
        params.set("status", filters.status);
      if (filters.sexo && filters.sexo !== "todos")
        params.set("sexo", filters.sexo);
      if (filters.dataDesaparecimentoDe)
        params.set("dataDe", filters.dataDesaparecimentoDe);
      if (filters.dataDesaparecimentoAte)
        params.set("dataAte", filters.dataDesaparecimentoAte);

      const newURL = params.toString() ? `?${params.toString()}` : "/";
      router.replace(newURL, { scroll: false });
    },
    [state, router]
  );

  // Ações do store
  const setPage = useCallback(
    (page: number) => {
      setState((prev) => ({ ...prev, currentPage: page }));
      updateURL({ currentPage: page });
    },
    [updateURL]
  );

  const setPageSize = useCallback(
    (size: number) => {
      setState((prev) => ({ ...prev, pageSize: size, currentPage: 0 }));
      updateURL({ pageSize: size, currentPage: 0 });
    },
    [updateURL]
  );

  const setFilters = useCallback(
    (filters: SearchFilters) => {
      setState((prev) => ({ ...prev, filters, currentPage: 0 }));
      updateURL({ filters, currentPage: 0 });
    },
    [updateURL]
  );

  const clearFilters = useCallback(() => {
    setState((prev) => ({ ...prev, filters: {}, currentPage: 0 }));
    router.replace("/", { scroll: false });
  }, [router]);

  const setLoading = useCallback((isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  return {
    ...state,
    actions: {
      setPage,
      setPageSize,
      setFilters,
      clearFilters,
      setLoading,
      setError,
    },
  };
}
