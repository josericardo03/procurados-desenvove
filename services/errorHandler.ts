import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export interface ErrorConfig {
  autoRedirect?: boolean;
  redirectDelay?: number;
  redirectPath?: string;
  onError?: (error: Error) => void;
  onRedirect?: () => void;
}

export interface ErrorState {
  hasError: boolean;
  error: Error | null;
  countdown: number;
  isRedirecting: boolean;
}

export class ErrorHandlerService {
  private static instance: ErrorHandlerService;
  private errorListeners: Array<(error: Error) => void> = [];
  private redirectListeners: Array<() => void> = [];

  static getInstance(): ErrorHandlerService {
    if (!ErrorHandlerService.instance) {
      ErrorHandlerService.instance = new ErrorHandlerService();
    }
    return ErrorHandlerService.instance;
  }

  logError(error: Error, context?: string): void {
    console.error(`[${context || "ErrorHandler"}]`, error);

    // Notificar todos os listeners
    this.errorListeners.forEach((listener) => listener(error));
  }

  addErrorListener(listener: (error: Error) => void): () => void {
    this.errorListeners.push(listener);
    return () => {
      const index = this.errorListeners.indexOf(listener);
      if (index > -1) {
        this.errorListeners.splice(index, 1);
      }
    };
  }

  addRedirectListener(listener: () => void): () => void {
    this.redirectListeners.push(listener);
    return () => {
      const index = this.redirectListeners.indexOf(listener);
      if (index > -1) {
        this.redirectListeners.splice(index, 1);
      }
    };
  }

  notifyRedirect(): void {
    this.redirectListeners.forEach((listener) => listener());
  }

  getErrorContent(type: "404" | "error") {
    switch (type) {
      case "404":
        return {
          title: "404",
          subtitle: "Página não encontrada",
          description:
            "A página que você está procurando não existe ou foi movida.",
          buttonText: "Ir para página principal",
          variant: "default" as const,
        };
      case "error":
        return {
          title: "Erro",
          subtitle: "Ocorreu um erro inesperado",
          description: "Algo deu errado. Tente novamente.",
          buttonText: "Tentar novamente",
          variant: "destructive" as const,
        };
    }
  }
}

// Hook para usar o serviço de tratamento de erros
export function useErrorHandler(config: ErrorConfig = {}) {
  const router = useRouter();
  const [errorState, setErrorState] = useState<ErrorState>({
    hasError: false,
    error: null,
    countdown: config.redirectDelay || 5,
    isRedirecting: false,
  });

  const errorService = ErrorHandlerService.getInstance();

  useEffect(() => {
    const unsubscribe = errorService.addErrorListener((error) => {
      setErrorState((prev) => ({
        ...prev,
        hasError: true,
        error,
      }));
    });

    return unsubscribe;
  }, [errorService]);

  useEffect(() => {
    if (!config.autoRedirect || !errorState.hasError) return;

    const timer = setInterval(() => {
      setErrorState((prev) => {
        if (prev.countdown <= 1) {
          errorService.notifyRedirect();
          router.push(config.redirectPath || "/");
          return {
            ...prev,
            countdown: 0,
            isRedirecting: true,
          };
        }
        return {
          ...prev,
          countdown: prev.countdown - 1,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [
    errorState.hasError,
    config.autoRedirect,
    config.redirectPath,
    router,
    errorService,
  ]);

  const handleError = (error: Error, context?: string) => {
    errorService.logError(error, context);
    setErrorState((prev) => ({
      ...prev,
      hasError: true,
      error,
    }));
  };

  const handleRedirect = () => {
    errorService.notifyRedirect();
    router.push(config.redirectPath || "/");
  };

  const resetError = () => {
    setErrorState({
      hasError: false,
      error: null,
      countdown: config.redirectDelay || 5,
      isRedirecting: false,
    });
  };

  return {
    errorState,
    handleError,
    handleRedirect,
    resetError,
    errorService,
  };
}

// Função utilitária para tratamento rápido de erros
export function handleQuickError(error: Error, context?: string) {
  const errorService = ErrorHandlerService.getInstance();
  errorService.logError(error, context);
}

// Função para configurar redirecionamento automático
export function setupAutoRedirect(
  router: any,
  path: string = "/",
  delay: number = 5,
  onRedirect?: () => void
) {
  let countdown = delay;

  const timer = setInterval(() => {
    countdown--;
    if (countdown <= 0) {
      clearInterval(timer);
      if (onRedirect) onRedirect();
      router.push(path);
    }
  }, 1000);

  return () => clearInterval(timer);
}
