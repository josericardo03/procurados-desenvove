import {
  ApiService,
  HttpError,
  TimeoutError,
  NetworkError,
} from "@/services/api";
import { makeRequest } from "@/services/apiClient";

// Mock fetch
global.fetch = jest.fn();

// Mock the apiClient module
jest.mock("@/services/apiClient", () => ({
  makeRequest: jest.fn(),
  createCancelToken: jest.fn(() => ({ token: "mock-token" })),
  isCancelError: jest.fn(),
  default: {
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  },
}));

describe("ApiService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
    (makeRequest as jest.Mock).mockClear();
  });

  describe("getPessoas", () => {
    const mockResponse = {
      totalElements: 25,
      totalPages: 3,
      pageable: {
        pageNumber: 0,
        pageSize: 10,
        sort: { unsorted: false, sorted: true, empty: false },
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
          id: 1,
          nome: "João Silva",
          idade: 30,
          sexo: "MASCULINO",
          vivo: true,
          urlFoto: null,
          ultimaOcorrencia: {
            dtDesaparecimento: "2024-01-01T10:00:00",
            dataLocalizacao: null,
            encontradoVivo: false,
            localDesaparecimentoConcat: "Cuiabá/MT",
            ocorrenciaEntrevDesapDTO: {
              informacao: "Teste",
              vestimentasDesaparecido: "Camisa azul",
            },
            listaCartaz: null,
            ocoId: 123,
          },
        },
      ],
    };

    it("fetches pessoas successfully", async () => {
      (makeRequest as jest.Mock).mockResolvedValue(mockResponse);

      const result = await ApiService.getPessoas(0, 10, {});

      expect(result).toEqual(mockResponse);
      expect(makeRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "GET",
          url: expect.stringContaining("/v1/pessoas/aberto/filtro"),
        }),
        undefined
      );
    });

    it("handles filters correctly", async () => {
      (makeRequest as jest.Mock).mockResolvedValue(mockResponse);

      const filters = {
        nome: "João",
        status: "desaparecido" as const,
        sexo: "MASCULINO" as const,
        dataDesaparecimentoDe: "2024-01-01",
        dataDesaparecimentoAte: "2024-12-31",
      };

      await ApiService.getPessoas(0, 10, filters);

      expect(makeRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "GET",
          url: expect.stringContaining("nome=Jo%C3%A3o"),
        }),
        undefined
      );
    });

    it("handles HTTP errors", async () => {
      const httpError = new HttpError(404);
      (makeRequest as jest.Mock).mockRejectedValue(httpError);

      await expect(ApiService.getPessoas(0, 10, {})).rejects.toThrow(HttpError);
    });

    it("handles timeout errors", async () => {
      const timeoutError = new TimeoutError();
      (makeRequest as jest.Mock).mockRejectedValue(timeoutError);

      await expect(ApiService.getPessoas(0, 10, {})).rejects.toThrow(
        TimeoutError
      );
    });

    it("handles network errors", async () => {
      const networkError = new NetworkError();
      (makeRequest as jest.Mock).mockRejectedValue(networkError);

      await expect(ApiService.getPessoas(0, 10, {})).rejects.toThrow(
        NetworkError
      );
    });
  });

  describe("getPessoaById", () => {
    const mockPessoa = {
      id: 1,
      nome: "João Silva",
      idade: 30,
      sexo: "MASCULINO",
      vivo: true,
      urlFoto: null,
      ultimaOcorrencia: {
        dtDesaparecimento: "2024-01-01T10:00:00",
        dataLocalizacao: null,
        encontradoVivo: false,
        localDesaparecimentoConcat: "Cuiabá/MT",
        ocorrenciaEntrevDesapDTO: {
          informacao: "Teste",
          vestimentasDesaparecido: "Camisa azul",
        },
        listaCartaz: null,
        ocoId: 123,
      },
    };

    it("fetches pessoa by id successfully", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockPessoa),
      });

      const result = await ApiService.getPessoaById(1);

      expect(result).toEqual(mockPessoa);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/v1/pessoas/1"),
        expect.any(Object)
      );
    });

    it("returns null when pessoa not found", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
      });

      const result = await ApiService.getPessoaById(999);

      expect(result).toBeNull();
    });
  });

  describe("enviarInformacao", () => {
    it("sends information successfully", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
      });

      const informacao = {
        ocoId: 123,
        informacao: "Vi a pessoa na rua",
        descricao: "Teste",
        data: "2024-01-01",
        fotos: [new File(["test"], "test.jpg", { type: "image/jpeg" })],
      };

      const result = await ApiService.enviarInformacao(informacao);

      expect(result).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/v1/ocorrencias/informacoes-desaparecido"),
        expect.objectContaining({
          method: "POST",
          body: expect.any(FormData),
        })
      );
    });

    it("handles HTTP errors", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 400,
      });

      const informacao = {
        ocoId: 123,
        informacao: "Vi a pessoa na rua",
        descricao: "Teste",
        data: "2024-01-01",
      };

      await expect(ApiService.enviarInformacao(informacao)).rejects.toThrow(
        HttpError
      );
    });
  });

  describe("getTotais", () => {
    it("calculates totals correctly", async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ totalElements: 100 }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ totalElements: 20 }),
        })
        .mockResolvedValue({
          ok: true,
          json: () =>
            Promise.resolve({
              content: [
                { ultimaOcorrencia: { dataLocalizacao: "2024-01-01" } },
                { ultimaOcorrencia: { dataLocalizacao: "2024-01-02" } },
              ],
            }),
        });

      const result = await ApiService.getTotais({});

      expect(result).toEqual({
        desaparecidas: 98, // 100 - 2
        localizadas: 2,
      });
    });
  });

  describe("checkApiStatus", () => {
    it("returns online status when API is available", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
      });

      const result = await ApiService.checkApiStatus();

      expect(result.isOnline).toBe(true);
      expect(result.responseTime).toBeGreaterThanOrEqual(0);
    });

    it("returns offline status when API is unavailable", async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

      const result = await ApiService.checkApiStatus();

      expect(result.isOnline).toBe(false);
      expect(result.error).toBe("Network error");
    });
  });
});
