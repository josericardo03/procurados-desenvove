import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PessoasListagem } from "@/components/PessoasListagem";
import { ApiService } from "@/services/api";

// Mock the API service
jest.mock("@/services/api", () => ({
  ApiService: {
    getPessoas: jest.fn(),
    getTotais: jest.fn(),
  },
}));

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

const mockApiResponse = {
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

const mockTotais = {
  desaparecidas: 20,
  localizadas: 5,
};

describe("PessoasListagem", () => {
  const defaultProps = {
    onPessoaClick: jest.fn(),
    onComoAjudar: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (ApiService.getPessoas as jest.Mock).mockResolvedValue(mockApiResponse);
    (ApiService.getTotais as jest.Mock).mockResolvedValue(mockTotais);
  });

  it("renders loading state initially", () => {
    render(<PessoasListagem {...defaultProps} />);

    expect(screen.getByText("Total de Registros")).toBeInTheDocument();
    expect(screen.getByText("Desaparecidas")).toBeInTheDocument();
    expect(screen.getByText("Localizadas")).toBeInTheDocument();
  });

  it("renders statistics cards", async () => {
    render(<PessoasListagem {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText("25")).toBeInTheDocument(); // totalElements
      expect(screen.getByText("20")).toBeInTheDocument(); // desaparecidas
      expect(screen.getByText("5")).toBeInTheDocument(); // localizadas
    });
  });

  it("renders pagination controls", async () => {
    render(<PessoasListagem {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText("Itens por página:")).toBeInTheDocument();
      expect(screen.getByText("Página 1 de 3")).toBeInTheDocument();
    });
  });

  it("handles page size change", async () => {
    render(<PessoasListagem {...defaultProps} />);

    await waitFor(() => {
      // Test that the select trigger is rendered
      const selectTrigger = screen.getByRole("combobox");
      expect(selectTrigger).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();
    });
  });

  it("handles page navigation", async () => {
    render(<PessoasListagem {...defaultProps} />);

    await waitFor(() => {
      const nextButton = screen.getByText("Próxima");
      fireEvent.click(nextButton);

      expect(ApiService.getPessoas).toHaveBeenCalledWith(1, 10, {});
    });
  });

  it("renders person cards", async () => {
    render(<PessoasListagem {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText("João Silva")).toBeInTheDocument();
      expect(screen.getByText("30 anos")).toBeInTheDocument();
      expect(screen.getByText("MASCULINO")).toBeInTheDocument();
    });
  });

  it("handles person card click", async () => {
    render(<PessoasListagem {...defaultProps} />);

    await waitFor(() => {
      const personCard = screen.getByText("João Silva");
      fireEvent.click(personCard);

      expect(defaultProps.onPessoaClick).toHaveBeenCalledWith(1);
    });
  });

  it("renders empty state when no results", async () => {
    (ApiService.getPessoas as jest.Mock).mockResolvedValue({
      ...mockApiResponse,
      content: [],
      totalElements: 0,
    });

    render(<PessoasListagem {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText("Nenhuma pessoa encontrada")).toBeInTheDocument();
      expect(screen.getByText("Limpar Filtros")).toBeInTheDocument();
    });
  });

  it("handles clear filters", async () => {
    render(<PessoasListagem {...defaultProps} />);

    await waitFor(() => {
      const clearButton = screen.getByText("Limpar Filtros");
      fireEvent.click(clearButton);

      expect(ApiService.getPessoas).toHaveBeenCalledWith(0, 10, {});
    });
  });

  it("shows correct page information", async () => {
    render(<PessoasListagem {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText("10 de 25 registros")).toBeInTheDocument();
      expect(screen.getByText("Página 1 de 3")).toBeInTheDocument();
    });
  });

  it("handles API errors gracefully", async () => {
    (ApiService.getPessoas as jest.Mock).mockRejectedValue(
      new Error("API Error")
    );

    render(<PessoasListagem {...defaultProps} />);

    await waitFor(() => {
      expect(
        screen.getByText("Ocorreu um erro inesperado. Tente novamente.")
      ).toBeInTheDocument();
      expect(screen.getByText("Tentar Novamente")).toBeInTheDocument();
    });
  });
});
