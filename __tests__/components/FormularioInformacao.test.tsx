import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormularioInformacao } from "@/components/FormularioInformacao";
import { ApiService } from "@/services/api";

// Mock the API service
jest.mock("@/services/api", () => ({
  ApiService: {
    enviarInformacao: jest.fn(),
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

// Mock geolocation
const mockGeolocation = {
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(),
  clearWatch: jest.fn(),
};

Object.defineProperty(navigator, "geolocation", {
  value: mockGeolocation,
});

// Mock fetch for geocoding
global.fetch = jest.fn();

describe("FormularioInformacao", () => {
  const defaultProps = {
    pessoaId: 1,
    pessoaNome: "João Silva",
    ocoId: 123,
    onBack: jest.fn(),
    onSuccess: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (ApiService.enviarInformacao as jest.Mock).mockResolvedValue(true);
    (global.fetch as jest.Mock).mockResolvedValue({
      json: () =>
        Promise.resolve({
          city: "Cuiabá",
          principalSubdivision: "MT",
        }),
    });
  });

  it("renders form fields correctly", () => {
    render(<FormularioInformacao {...defaultProps} />);

    expect(screen.getByText("Enviar Informação")).toBeInTheDocument();
    expect(screen.getByText("Sobre: João Silva")).toBeInTheDocument();
    expect(screen.getByLabelText(/Data do avistamento/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Informação/)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Local onde a pessoa foi vista/)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Telefone para contato/)).toBeInTheDocument();
  });

  it("validates required fields", async () => {
    const user = userEvent.setup();
    render(<FormularioInformacao {...defaultProps} />);

    const submitButton = screen.getByText("Enviar Informação");
    await user.click(submitButton);

    expect(screen.getByText("Data é obrigatória")).toBeInTheDocument();
    expect(screen.getByText("Este campo é obrigatório")).toBeInTheDocument();
  });

  it("validates information length", async () => {
    const user = userEvent.setup();
    render(<FormularioInformacao {...defaultProps} />);

    const informationField = screen.getByLabelText(/Informação/);
    await user.type(informationField, "Test");

    expect(
      screen.getByText("Informação deve ter pelo menos 10 caracteres")
    ).toBeInTheDocument();
  });

  it("validates phone number format", async () => {
    const user = userEvent.setup();
    render(<FormularioInformacao {...defaultProps} />);

    const phoneField = screen.getByLabelText(/Telefone para contato/);
    await user.type(phoneField, "123");

    expect(
      screen.getByText("Telefone deve ter 10 ou 11 dígitos")
    ).toBeInTheDocument();
  });

  it("formats phone number correctly", async () => {
    const user = userEvent.setup();
    render(<FormularioInformacao {...defaultProps} />);

    const phoneField = screen.getByLabelText(/Telefone para contato/);
    await user.type(phoneField, "65999999999");

    expect(phoneField).toHaveValue("(65) 99999-9999");
  });

  it("validates date range", async () => {
    const user = userEvent.setup();
    render(<FormularioInformacao {...defaultProps} />);

    const dateField = screen.getByLabelText(/Data do avistamento/);
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    await user.type(dateField, futureDate.toISOString().split("T")[0]);

    expect(
      screen.getByText("Data deve ser entre 1 ano atrás e hoje")
    ).toBeInTheDocument();
  });

  it("handles geolocation success", async () => {
    const user = userEvent.setup();
    mockGeolocation.getCurrentPosition.mockImplementation((success: any) => {
      success({
        coords: {
          latitude: -15.7801,
          longitude: -47.9292,
        },
      });
    });

    render(<FormularioInformacao {...defaultProps} />);

    const locationButton = screen.getByRole("button", { name: /mapPin/i });
    await user.click(locationButton);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Cuiabá, MT")).toBeInTheDocument();
    });
  });

  it("handles geolocation error", async () => {
    const user = userEvent.setup();
    mockGeolocation.getCurrentPosition.mockImplementation(
      (success: any, error: any) => {
        error({ code: 1, message: "Permission denied" });
      }
    );

    render(<FormularioInformacao {...defaultProps} />);

    const locationButton = screen.getByRole("button", { name: /mapPin/i });
    await user.click(locationButton);

    await waitFor(() => {
      expect(
        screen.getByText("Permissão de localização negada")
      ).toBeInTheDocument();
    });
  });

  it("submits form successfully", async () => {
    const user = userEvent.setup();
    render(<FormularioInformacao {...defaultProps} />);

    // Fill required fields
    const dateField = screen.getByLabelText(/Data do avistamento/);
    await user.type(dateField, "2024-01-01");

    const informationField = screen.getByLabelText(/Informação/);
    await user.type(informationField, "Vi a pessoa na rua principal");

    const submitButton = screen.getByText("Enviar Informação");
    await user.click(submitButton);

    await waitFor(() => {
      expect(ApiService.enviarInformacao).toHaveBeenCalledWith({
        ocoId: 123,
        informacao: "Vi a pessoa na rua principal",
        descricao: "",
        data: "2024-01-01",
        fotos: undefined,
      });
    });
  });

  it("handles file upload", async () => {
    const user = userEvent.setup();
    render(<FormularioInformacao {...defaultProps} />);

    const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
    const fileInput = screen.getByLabelText(/Fotos/);

    await user.upload(fileInput, file);

    expect(screen.getByText("test.jpg")).toBeInTheDocument();
  });

  it("validates file size", async () => {
    const user = userEvent.setup();
    render(<FormularioInformacao {...defaultProps} />);

    // Create a large file (>5MB)
    const largeFile = new File(["x".repeat(6 * 1024 * 1024)], "large.jpg", {
      type: "image/jpeg",
    });
    const fileInput = screen.getByLabelText(/Fotos/);

    await user.upload(fileInput, largeFile);

    expect(
      screen.getByText("A imagem large.jpg é muito grande. Máximo 5MB.")
    ).toBeInTheDocument();
  });

  it("validates file type", async () => {
    const user = userEvent.setup();
    render(<FormularioInformacao {...defaultProps} />);

    const invalidFile = new File(["test"], "test.txt", { type: "text/plain" });
    const fileInput = screen.getByLabelText(/Fotos/);

    await user.upload(fileInput, invalidFile);

    expect(
      screen.getByText("O arquivo test.txt não é uma imagem válida.")
    ).toBeInTheDocument();
  });

  it("shows loading state during submission", async () => {
    const user = userEvent.setup();
    (ApiService.enviarInformacao as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    );

    render(<FormularioInformacao {...defaultProps} />);

    // Fill required fields
    const dateField = screen.getByLabelText(/Data do avistamento/);
    await user.type(dateField, "2024-01-01");

    const informationField = screen.getByLabelText(/Informação/);
    await user.type(informationField, "Vi a pessoa na rua principal");

    const submitButton = screen.getByText("Enviar Informação");
    await user.click(submitButton);

    expect(screen.getByText("Enviando...")).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it("handles submission error", async () => {
    const user = userEvent.setup();
    (ApiService.enviarInformacao as jest.Mock).mockRejectedValue(
      new Error("API Error")
    );

    render(<FormularioInformacao {...defaultProps} />);

    // Fill required fields
    const dateField = screen.getByLabelText(/Data do avistamento/);
    await user.type(dateField, "2024-01-01");

    const informationField = screen.getByLabelText(/Informação/);
    await user.type(informationField, "Vi a pessoa na rua principal");

    const submitButton = screen.getByText("Enviar Informação");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Erro ao enviar informação")).toBeInTheDocument();
    });
  });
});
