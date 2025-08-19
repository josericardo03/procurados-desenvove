"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error boundary:", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Ocorreu um erro inesperado. Tente novamente.
        </AlertDescription>
      </Alert>
      <Button onClick={reset} className="flex items-center gap-2">
        <RotateCcw className="w-4 h-4" />
        Tentar novamente
      </Button>
    </div>
  );
}
