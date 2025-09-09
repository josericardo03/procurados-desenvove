import axios, {
  AxiosInstance,
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

// Configuração base da API
const apiClient: AxiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://abitus-api.geia.vip",
  timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || "15000"),
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de requisição
apiClient.interceptors.request.use(
  (config) => {
    // Adicionar timestamp para cache busting
    if (config.method === "get") {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de resposta
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    const status = error.response?.status;
    const config = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Mapeamento de erros para mensagens amigáveis
    let userMessage = "Falha na solicitação.";

    if (error.code === "ECONNABORTED") {
      userMessage = "Tempo limite excedido. Tente novamente.";
    } else if (error.code === "ERR_NETWORK") {
      userMessage = "Problema de conexão. Verifique sua internet.";
    } else if (status) {
      switch (status) {
        case 400:
          userMessage = "Dados inválidos. Verifique as informações enviadas.";
          break;
        case 401:
          userMessage = "Não autorizado. Faça login novamente.";
          break;
        case 403:
          userMessage = "Acesso negado. Você não tem permissão para esta ação.";
          break;
        case 404:
          userMessage = "Recurso não encontrado.";
          break;
        case 408:
          userMessage = "Tempo limite da requisição excedido.";
          break;
        case 429:
          userMessage =
            "Muitas requisições. Tente novamente em alguns minutos.";
          break;
        case 500:
          userMessage = "Erro interno do servidor. Tente novamente mais tarde.";
          break;
        case 502:
          userMessage = "Serviço temporariamente indisponível.";
          break;
        case 503:
          userMessage = "Serviço em manutenção. Tente novamente mais tarde.";
          break;
        case 504:
          userMessage = "Tempo limite do gateway excedido.";
          break;
        default:
          if (status >= 500) {
            userMessage = "Serviço indisponível. Tente novamente mais tarde.";
          } else if (status >= 400) {
            userMessage = "Falha na solicitação. Verifique os dados enviados.";
          }
      }
    }

    // Adicionar mensagem amigável ao erro
    (error as any).userMessage = userMessage;
    (error as any).originalStatus = status;
    (error as any).isRetryable =
      (status !== undefined && status >= 500) || error.code === "ERR_NETWORK";

    // Retry automático para erros 5xx (apenas uma vez)
    if (config && !config._retry && (error as any).isRetryable) {
      config._retry = true;
      return apiClient(config);
    }

    return Promise.reject(error);
  }
);

// Função para cancelar requisições
export const createCancelToken = () => axios.CancelToken.source();

// Função para verificar se erro é de cancelamento
export const isCancelError = (error: any) => axios.isCancel(error);

// Função para fazer requisições com cancelamento
export const makeRequest = async <T>(
  config: AxiosRequestConfig,
  cancelToken?: any
): Promise<T> => {
  try {
    const response = await apiClient({
      ...config,
      cancelToken: cancelToken?.token,
    });
    return response.data;
  } catch (error) {
    if (isCancelError(error)) {
      throw new Error("Requisição cancelada");
    }
    throw error;
  }
};

export default apiClient;
