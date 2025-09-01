import {
  ApiResponse,
  Pessoa,
  SearchFilters,
  NovaInformacao,
  ApiStatus,
} from "../types/api";

const API_BASE_URL = "https://abitus-api.geia.vip";

// Erros tipados para tratamento na UI
export class HttpError extends Error {
  status: number;
  constructor(status: number, message = "Erro HTTP") {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}
export class TimeoutError extends Error {
  constructor(message = "Tempo de requisição esgotado") {
    super(message);
    this.name = "TimeoutError";
  }
}
export class NetworkError extends Error {
  constructor(message = "Falha de rede. Verifique sua conexão") {
    super(message);
    this.name = "NetworkError";
  }
}

// Mock de segurança/caso a API esteja indisponível
const mockData: ApiResponse = {
  totalElements: 535,
  totalPages: 54,
  pageable: {
    pageNumber: 0,
    pageSize: 10,
    sort: {
      unsorted: false,
      sorted: true,
      empty: false,
    },
    offset: 0,
    unpaged: false,
    paged: true,
  },
  numberOfElements: 10,
  first: true,
  last: false,
  size: 10,
  content: [
    {
      id: 2387,
      nome: "ASASD",
      idade: 0,
      sexo: "MASCULINO",
      vivo: true,
      urlFoto:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      ultimaOcorrencia: {
        dtDesaparecimento: "2025-04-02T22:22:00",
        dataLocalizacao: null,
        encontradoVivo: false,
        localDesaparecimentoConcat: "asdasd - Cuiabá/MT",
        ocorrenciaEntrevDesapDTO: {
          informacao: null,
          vestimentasDesaparecido: "vestido branco",
        },
        listaCartaz: null,
        ocoId: 1527,
      },
    },
    {
      id: 2366,
      nome: "JONATHAN GABRIEL ALVES VALIENTE",
      idade: 47,
      sexo: "MASCULINO",
      vivo: true,
      urlFoto:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      ultimaOcorrencia: {
        dtDesaparecimento: "2025-04-02T11:11:00",
        dataLocalizacao: null,
        encontradoVivo: false,
        localDesaparecimentoConcat: "centro - Várzea Grande/MT",
        ocorrenciaEntrevDesapDTO: {
          informacao: null,
          vestimentasDesaparecido: "estava vestida.",
        },
        listaCartaz: null,
        ocoId: 1526,
      },
    },
    {
      id: 2386,
      nome: "ALINA DA SOUZA",
      idade: 0,
      sexo: "FEMININO",
      vivo: true,
      urlFoto: null,
      ultimaOcorrencia: {
        dtDesaparecimento: "2025-04-01T15:00:00",
        dataLocalizacao: null,
        encontradoVivo: false,
        localDesaparecimentoConcat: "terra nova - Cuiabá/MT",
        ocorrenciaEntrevDesapDTO: {
          informacao: null,
          vestimentasDesaparecido: "sdada",
        },
        listaCartaz: null,
        ocoId: 1525,
      },
    },
    {
      id: 2364,
      nome: "JOANA DA SILVA",
      idade: 40,
      sexo: "FEMININO",
      vivo: false,
      urlFoto:
        "https://images.unsplash.com/photo-1494790108755-2616b52c97e1?w=300&h=300&fit=crop&crop=face",
      ultimaOcorrencia: {
        dtDesaparecimento: "2025-03-27T14:00:00",
        dataLocalizacao: "2025-04-10T10:00:00",
        encontradoVivo: false,
        localDesaparecimentoConcat: "CPAV - Cuiabá/MT",
        ocorrenciaEntrevDesapDTO: {
          informacao: "asdas",
          vestimentasDesaparecido: "SHORT PRETO E CAMISA BRANCA",
        },
        listaCartaz: null,
        ocoId: 1524,
      },
    },
    {
      id: 2384,
      nome: "KAIO ALVES LACERDA",
      idade: 40,
      sexo: "MASCULINO",
      vivo: true,
      urlFoto:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
      ultimaOcorrencia: {
        dtDesaparecimento: "2025-03-26T15:30:00",
        dataLocalizacao: null,
        encontradoVivo: false,
        localDesaparecimentoConcat: "PEDRA NOVENTA - Cuiabá/MT",
        ocorrenciaEntrevDesapDTO: {
          informacao: null,
          vestimentasDesaparecido:
            "CALÇA BRANCA E CAMISETA AZUL DE MANGA LONGA",
        },
        listaCartaz: null,
        ocoId: 1522,
      },
    },
    {
      id: 2385,
      nome: "HUGO DA SILVA",
      idade: 0,
      sexo: "MASCULINO",
      vivo: true,
      urlFoto:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=face",
      ultimaOcorrencia: {
        dtDesaparecimento: "2025-03-26T15:00:00",
        dataLocalizacao: null,
        encontradoVivo: false,
        localDesaparecimentoConcat: "terra nova - Cuiabá/MT",
        ocorrenciaEntrevDesapDTO: {
          informacao: null,
          vestimentasDesaparecido: "",
        },
        listaCartaz: null,
        ocoId: 1523,
      },
    },
  ],
};

export class ApiService {
  private static buildQuery(
    params: Record<string, string | number | undefined>
  ) {
    const usp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== "") usp.append(k, String(v));
    });
    return usp.toString();
  }

  static async getTotais(
    filters: SearchFilters = {}
  ): Promise<{ desaparecidas: number; localizadas: number }> {
    // Estratégia paginada e leve:
    // - Busca total geral (sem status)
    // - Busca total de "LOCALIZADO" e pagina esses resultados para contar somente
    //   aqueles com dataLocalizacao preenchida; desaparecidas = totalGeral - localizadasValidas
    const makeUrl = (
      page: number,
      size: number,
      status?: "DESAPARECIDO" | "LOCALIZADO"
    ) => {
      const q = this.buildQuery({
        pagina: page,
        porPagina: size,
        nome: filters.nome || undefined,
        status,
        sexo:
          filters.sexo && filters.sexo !== "todos" ? filters.sexo : undefined,
        dataDesaparecimentoDe:
          (filters as any).dataDesaparecimentoDe || undefined,
        dataDesaparecimentoAte:
          (filters as any).dataDesaparecimentoAte || undefined,
      });
      return `${API_BASE_URL}/v1/pessoas/aberto/filtro?${q}`;
    };

    try {
      // 1) Total geral (sem status)
      const ctrlTotal = new AbortController();
      const tTotal = setTimeout(() => ctrlTotal.abort(), 10000);
      const resTotal = await fetch(makeUrl(0, 1, undefined), {
        signal: ctrlTotal.signal,
      });
      clearTimeout(tTotal);
      if (!resTotal.ok) throw new HttpError(resTotal.status);
      const totalData = (await resTotal.json()) as ApiResponse;
      const totalGeral = totalData.totalElements;

      // 2) Total de LOCALIZADO (pelo backend)
      const ctrlHeadLoc = new AbortController();
      const tHeadLoc = setTimeout(() => ctrlHeadLoc.abort(), 10000);
      const resHeadLoc = await fetch(makeUrl(0, 1, "LOCALIZADO"), {
        signal: ctrlHeadLoc.signal,
      });
      clearTimeout(tHeadLoc);
      if (!resHeadLoc.ok) throw new HttpError(resHeadLoc.status);
      const headLoc = (await resHeadLoc.json()) as ApiResponse;
      const totalLocalizadoBackend = headLoc.totalElements;

      // 3) Pagina LOCALIZADO para descontar inconsistências (sem dataLocalizacao)
      const pageSize = 50;
      const totalPages = Math.max(
        1,
        Math.ceil(totalLocalizadoBackend / pageSize)
      );
      let localizadasValidas = 0;
      for (let page = 0; page < totalPages; page++) {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 12000);
        const res = await fetch(makeUrl(page, pageSize, "LOCALIZADO"), {
          signal: ctrl.signal,
        });
        clearTimeout(t);
        if (!res.ok) throw new HttpError(res.status);
        const data = (await res.json()) as ApiResponse;
        localizadasValidas += data.content.filter((p) =>
          Boolean(
            p.ultimaOcorrencia.dataLocalizacao &&
              String(p.ultimaOcorrencia.dataLocalizacao).trim() !== ""
          )
        ).length;
      }

      const localizadas = localizadasValidas;
      const desaparecidas = Math.max(0, totalGeral - localizadas);
      return { desaparecidas, localizadas };
    } catch (error: any) {
      const useMock = process.env.NEXT_PUBLIC_USE_API_MOCK === "true";
      if (useMock) {
        // Fallback: conta em cima do mock aplicando filtros
        let items = [...mockData.content];
        if (filters.nome) {
          items = items.filter((p) =>
            p.nome.toLowerCase().includes(filters.nome!.toLowerCase())
          );
        }
        if (filters.sexo && filters.sexo !== "todos") {
          items = items.filter((p) => p.sexo === filters.sexo);
        }
        if ((filters as any).dataDesaparecimentoDe) {
          const de = new Date((filters as any).dataDesaparecimentoDe);
          items = items.filter(
            (p) => new Date(p.ultimaOcorrencia.dtDesaparecimento) >= de
          );
        }
        if ((filters as any).dataDesaparecimentoAte) {
          const ate = new Date((filters as any).dataDesaparecimentoAte);
          ate.setHours(23, 59, 59, 999);
          items = items.filter(
            (p) => new Date(p.ultimaOcorrencia.dtDesaparecimento) <= ate
          );
        }
        const desaparecidas = items.filter(
          (p) => !p.ultimaOcorrencia.dataLocalizacao
        ).length;
        const localizadas = items.filter((p) =>
          Boolean(p.ultimaOcorrencia.dataLocalizacao)
        ).length;
        return { desaparecidas, localizadas };
      }
      if (error?.name === "AbortError") throw new TimeoutError();
      if (error instanceof HttpError) throw error;
      throw new NetworkError();
    }
  }

  static async getPessoas(
    page: number = 0,
    size: number = 10,
    filters: SearchFilters = {}
  ): Promise<ApiResponse> {
    // Mapeia o status da UI para o esperado pela API (ex.: LOCALIZADO | DESAPARECIDO)
    const statusParam =
      filters.status && filters.status !== "todos"
        ? filters.status === "localizado"
          ? "LOCALIZADO"
          : "DESAPARECIDO"
        : undefined;

    const query = this.buildQuery({
      pagina: page,
      porPagina: size,
      nome: filters.nome || undefined,
      status: statusParam,
      sexo: filters.sexo && filters.sexo !== "todos" ? filters.sexo : undefined,
      dataDesaparecimentoDe: filters.dataDesaparecimentoDe || undefined,
      dataDesaparecimentoAte: filters.dataDesaparecimentoAte || undefined,
    });
    const url = `${API_BASE_URL}/v1/pessoas/aberto/filtro${
      query ? `?${query}` : ""
    }`;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (!res.ok) throw new HttpError(res.status, `HTTP ${res.status}`);
      const data = (await res.json()) as ApiResponse;

      // Normalização extra no cliente: aplicar filtros que a API pode não respeitar 100%
      // - Status "localizado": exige dataLocalizacao preenchida
      // - Intervalo de data do desaparecimento: baseado em ultimaOcorrencia.dtDesaparecimento
      const hasDateRange = Boolean(
        (filters as any).dataDesaparecimentoDe ||
          (filters as any).dataDesaparecimentoAte
      );
      if (filters.status === "localizado" || hasDateRange) {
        const applyLocalFilters = (list: typeof data.content) => {
          let result = [...list];
          if (filters.status === "localizado") {
            result = result.filter((p) =>
              Boolean(
                p.ultimaOcorrencia.dataLocalizacao &&
                  String(p.ultimaOcorrencia.dataLocalizacao).trim() !== ""
              )
            );
          }
          if ((filters as any).dataDesaparecimentoDe) {
            const de = new Date((filters as any).dataDesaparecimentoDe);
            result = result.filter(
              (p) => new Date(p.ultimaOcorrencia.dtDesaparecimento) >= de
            );
          }
          if ((filters as any).dataDesaparecimentoAte) {
            const ate = new Date((filters as any).dataDesaparecimentoAte);
            ate.setHours(23, 59, 59, 999);
            result = result.filter(
              (p) => new Date(p.ultimaOcorrencia.dtDesaparecimento) <= ate
            );
          }
          return result;
        };

        const filteredPage = applyLocalFilters(data.content);

        // Recontagem global: busca o conjunto completo e aplica os mesmos filtros localmente
        try {
          const queryAll = this.buildQuery({
            pagina: 0,
            porPagina: Math.max(data.totalElements, size),
            nome: filters.nome || undefined,
            status: statusParam,
            sexo:
              filters.sexo && filters.sexo !== "todos"
                ? filters.sexo
                : undefined,
            dataDesaparecimentoDe:
              (filters as any).dataDesaparecimentoDe || undefined,
            dataDesaparecimentoAte:
              (filters as any).dataDesaparecimentoAte || undefined,
          });
          const urlAll = `${API_BASE_URL}/v1/pessoas/aberto/filtro?${queryAll}`;
          const controllerAll = new AbortController();
          const timeoutAll = setTimeout(() => controllerAll.abort(), 15000);
          const resAll = await fetch(urlAll, { signal: controllerAll.signal });
          clearTimeout(timeoutAll);
          if (resAll.ok) {
            const allData = (await resAll.json()) as ApiResponse;
            const validAcrossAll = applyLocalFilters(allData.content);
            const adjustedTotalElements = validAcrossAll.length;
            const adjustedTotalPages = Math.max(
              1,
              Math.ceil(adjustedTotalElements / size)
            );
            return {
              ...data,
              content: filteredPage,
              numberOfElements: filteredPage.length,
              totalElements: adjustedTotalElements,
              totalPages: adjustedTotalPages,
            };
          }
        } catch {}

        // Fallback: ajuste mínimo com base na página atual
        const removedInPage = data.content.length - filteredPage.length;
        const adjustedTotalElements = Math.max(
          0,
          data.totalElements - removedInPage
        );
        const adjustedTotalPages = Math.max(
          1,
          Math.ceil(adjustedTotalElements / size)
        );
        return {
          ...data,
          content: filteredPage,
          numberOfElements: filteredPage.length,
          totalElements: adjustedTotalElements,
          totalPages: adjustedTotalPages,
        };
      }

      // Sem filtros adicionais: retorna o payload original
      return data;
    } catch (error: any) {
      const useMock = process.env.NEXT_PUBLIC_USE_API_MOCK === "true";
      if (useMock) {
        console.warn("Falha ao consultar API, usando mock:", error);
        // Fallback para mock (apenas quando habilitado por flag)
        let filteredContent = [...mockData.content];
        if (filters.nome) {
          filteredContent = filteredContent.filter((p) =>
            p.nome.toLowerCase().includes(filters.nome!.toLowerCase())
          );
        }
        if (filters.status && filters.status !== "todos") {
          filteredContent = filteredContent.filter((p) =>
            filters.status === "desaparecido"
              ? !p.ultimaOcorrencia.dataLocalizacao
              : Boolean(p.ultimaOcorrencia.dataLocalizacao)
          );
        }
        if (filters.sexo && filters.sexo !== "todos") {
          filteredContent = filteredContent.filter(
            (p) => p.sexo === filters.sexo
          );
        }
        if (filters.dataDesaparecimentoDe) {
          const de = new Date(filters.dataDesaparecimentoDe);
          filteredContent = filteredContent.filter(
            (p) => new Date(p.ultimaOcorrencia.dtDesaparecimento) >= de
          );
        }
        if (filters.dataDesaparecimentoAte) {
          const ate = new Date(filters.dataDesaparecimentoAte);
          ate.setHours(23, 59, 59, 999);
          filteredContent = filteredContent.filter(
            (p) => new Date(p.ultimaOcorrencia.dtDesaparecimento) <= ate
          );
        }
        return {
          ...mockData,
          content: filteredContent.slice(0, size),
          totalElements: filteredContent.length,
          totalPages: Math.ceil(filteredContent.length / size),
          pageable: { ...mockData.pageable, pageNumber: page, pageSize: size },
        };
      }
      if (error?.name === "AbortError") throw new TimeoutError();
      if (error instanceof HttpError) throw error;
      throw new NetworkError();
    }
  }

  static async getPessoaById(id: number): Promise<Pessoa | null> {
    // 1) Tenta endpoint direto por id: /v1/pessoas/{id}
    const tryDirect = async (): Promise<Pessoa | null> => {
      try {
        const url = `${API_BASE_URL}/v1/pessoas/${id}`;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeout);
        if (!res.ok) throw new HttpError(res.status, "HTTP " + res.status);
        const data = (await res.json()) as Pessoa;
        return data ?? null;
      } catch (err) {
        if ((err as any)?.name === "AbortError") throw new TimeoutError();
        return null;
      }
    };

    // 2) Fallback: busca um lote e filtra
    const tryBatch = async (): Promise<Pessoa | null> => {
      try {
        const url = `${API_BASE_URL}/v1/pessoas/aberto/filtro?pagina=0&porPagina=50`;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeout);
        if (!res.ok) throw new HttpError(res.status, "HTTP " + res.status);
        const data = (await res.json()) as ApiResponse;
        return data.content.find((p) => p.id === id) ?? null;
      } catch (err) {
        if ((err as any)?.name === "AbortError") throw new TimeoutError();
        return null;
      }
    };

    const byId = await tryDirect();
    if (byId) return byId;

    const batch = await tryBatch();
    if (batch) return batch;

    // Último fallback: mock
    return mockData.content.find((p) => p.id === id) ?? null;
  }

  static async enviarInformacao(informacao: NovaInformacao): Promise<boolean> {
    try {
      // Query params obrigatórios devem ir na URL
      const query = new URLSearchParams({
        informacao: informacao.informacao,
        descricao: informacao.descricao ?? "",
        data: informacao.data,
        ocoId: String(informacao.ocoId),
      });

      // Body multipart: somente os arquivos (0..N) com a mesma key 'files'
      // Mesmo sem arquivos, enviar multipart vazio
      const form = new FormData();
      if (informacao.fotos && informacao.fotos.length > 0) {
        informacao.fotos.forEach((f) => form.append("files", f, f.name));
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);
      const res = await fetch(
        `${API_BASE_URL}/v1/ocorrencias/informacoes-desaparecido?${query.toString()}`,
        {
          method: "POST",
          body: form,
          signal: controller.signal,
        }
      );
      clearTimeout(timeout);

      if (!res.ok) throw new HttpError(res.status, `HTTP ${res.status}`);
      return true;
    } catch (error: any) {
      console.error("Erro ao enviar informação:", error);
      if (error?.name === "AbortError") throw new TimeoutError();
      if (error instanceof HttpError) throw error;
      throw new NetworkError();
    }
  }

  static async checkApiStatus(): Promise<ApiStatus> {
    const startTime = Date.now();

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000); // Timeout mais curto para verificação de status

      const res = await fetch(
        `${API_BASE_URL}/v1/pessoas/aberto/filtro?pagina=0&porPagina=1`,
        {
          signal: controller.signal,
        }
      );

      clearTimeout(timeout);
      const responseTime = Date.now() - startTime;

      if (!res.ok) {
        return {
          isOnline: false,
          lastChecked: new Date(),
          responseTime,
          error: `HTTP ${res.status}`,
        };
      }

      return {
        isOnline: true,
        lastChecked: new Date(),
        responseTime,
      };
    } catch (error: any) {
      const responseTime = Date.now() - startTime;

      if (error?.name === "AbortError") {
        return {
          isOnline: false,
          lastChecked: new Date(),
          responseTime,
          error: "Timeout",
        };
      }

      return {
        isOnline: false,
        lastChecked: new Date(),
        responseTime,
        error: error?.message || "Erro de conexão",
      };
    }
  }
}
