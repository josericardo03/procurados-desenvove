"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";
import { Alert, AlertDescription } from "../components/ui/alert";
import { AlertCircle, Home, Clock } from "lucide-react";
import {
  setupAutoRedirect,
  ErrorHandlerService,
} from "../services/errorHandler";

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const errorService = ErrorHandlerService.getInstance();

  useEffect(() => {
    const cleanup = setupAutoRedirect(router, "/", 5, () => {
      console.log("Redirecionando para página principal...");
    });

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      cleanup();
      clearInterval(timer);
    };
  }, [router]);

  const handleGoHome = () => {
    router.push("/");
  };

  const errorContent = errorService.getErrorContent("404");

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-gray-900">
            {errorContent.title}
          </h1>
          <h2 className="text-2xl font-semibold text-gray-700">
            {errorContent.subtitle}
          </h2>
          <p className="text-gray-600">{errorContent.description}</p>
        </div>

        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Você será redirecionado para a página principal em{" "}
            <span className="font-bold text-blue-600">{countdown}</span>{" "}
            segundos.
          </AlertDescription>
        </Alert>

        <div className="flex items-center justify-center gap-4">
          <Button onClick={handleGoHome} className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            {errorContent.buttonText}
          </Button>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            Redirecionamento automático
          </div>
        </div>
      </div>
    </div>
  );
}
