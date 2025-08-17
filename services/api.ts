import {
  ApiResponse,
  Pessoa,
  SearchFilters,
  NovaInformacao,
} from "../types/api";

const API_BASE_URL = "https://abitus-api.geia.vip";

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

  static async getPessoas(
    page: number = 0,
    size: number = 10,
    filters: SearchFilters = {}
  ): Promise<ApiResponse> {
    const query = this.buildQuery({
      pagina: page,
      porPagina: size,
      nome: filters.nome || undefined,
      // status: filters.status && filters.status !== 'todos' ? filters.status : undefined, // habilite se a API aceitar
      sexo: filters.sexo && filters.sexo !== "todos" ? filters.sexo : undefined,
    });
    const url = `${API_BASE_URL}/v1/pessoas/aberto/filtro${
      query ? `?${query}` : ""
    }`;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as ApiResponse;

      // Filtro de status (caso a API não suporte por query param)
      let content = data.content;
      if (filters.status && filters.status !== "todos") {
        content = content.filter((p) =>
          filters.status === "desaparecido"
            ? !p.ultimaOcorrencia.dataLocalizacao
            : Boolean(p.ultimaOcorrencia.dataLocalizacao)
        );
      }

      return {
        ...data,
        content,
      };
    } catch (error) {
      console.warn("Falha ao consultar API, usando mock:", error);
      // Fallback para mock para não quebrar a UI
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
      return {
        ...mockData,
        content: filteredContent.slice(0, size),
        totalElements: filteredContent.length,
        totalPages: Math.ceil(filteredContent.length / size),
        pageable: { ...mockData.pageable, pageNumber: page, pageSize: size },
      };
    }
  }

  static async getPessoaById(id: number): Promise<Pessoa | null> {
    // 1) Tenta por ID direto (se a API aceitar)
    const tryById = async (): Promise<Pessoa | null> => {
      try {
        const url = `${API_BASE_URL}/v1/pessoas/aberto/filtro?pagina=0&porPagina=1&id=${id}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("HTTP " + res.status);
        const data = (await res.json()) as ApiResponse;
        return data.content?.[0] ?? null;
      } catch {
        return null;
      }
    };

    // 2) Fallback: busca um lote e filtra
    const tryBatch = async (): Promise<Pessoa | null> => {
      try {
        const url = `${API_BASE_URL}/v1/pessoas/aberto/filtro?pagina=0&porPagina=50`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("HTTP " + res.status);
        const data = (await res.json()) as ApiResponse;
        return data.content.find((p) => p.id === id) ?? null;
      } catch {
        return null;
      }
    };

    const byId = await tryById();
    if (byId) return byId;

    const batch = await tryBatch();
    if (batch) return batch;

    // Último fallback: mock
    return mockData.content.find((p) => p.id === id) ?? null;
  }

  static async enviarInformacao(informacao: NovaInformacao): Promise<boolean> {
    try {
      // Aqui você pode trocar por POST real para sua API quando disponível
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.log("Informação enviada:", informacao);
      return true;
    } catch (error) {
      console.error("Erro ao enviar informação:", error);
      throw new Error("Erro ao enviar informação");
    }
  }
}
