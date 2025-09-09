import { Card, CardContent, CardHeader } from "./card";
import { Skeleton } from "./skeleton";
import { Button } from "./button";
import { AlertCircle, RefreshCw } from "lucide-react";

// Skeleton para lista de pessoas
export function PessoasListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {Array.from({ length: 8 }).map((_, index) => (
        <Card key={index} className="overflow-hidden shadow-lg">
          <CardContent className="p-0">
            <Skeleton className="aspect-[4/3] w-full" />
            <div className="p-6 space-y-4">
              <div className="space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-16 w-full rounded-xl" />
                <Skeleton className="h-16 w-full rounded-xl" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Skeleton para estatísticas
export function StatisticsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card
          key={index}
          className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 shadow-lg"
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </div>
              <Skeleton className="w-12 h-12 rounded-xl" />
            </div>
            <div className="mt-4">
              <Skeleton className="h-4 w-32" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Skeleton para detalhes da pessoa
export function PessoaDetalhesSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <Card>
          <CardContent className="p-0">
            <Skeleton className="aspect-[3/4] w-full rounded-t-lg" />
            <div className="p-6 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-12 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Estado de erro com retry
interface ErrorStateProps {
  message: string;
  onRetry: () => void;
  isLoading?: boolean;
}

export function ErrorState({
  message,
  onRetry,
  isLoading = false,
}: ErrorStateProps) {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardContent className="flex flex-col items-center justify-center py-16 px-8">
          <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">
            Ops! Algo deu errado
          </h3>
          <p className="text-slate-600 text-center mb-6 leading-relaxed">
            {message}
          </p>
          <Button
            onClick={onRetry}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            size="lg"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Tentando novamente...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Tentar Novamente
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Estado vazio
interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <Card className="max-w-2xl mx-auto shadow-xl">
      <CardContent className="flex flex-col items-center justify-center py-16 px-8">
        <div className="w-24 h-24 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-12 h-12 text-slate-500" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-600 text-center mb-6 leading-relaxed">
          {description}
        </p>
        {actionLabel && onAction && (
          <Button
            onClick={onAction}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            size="lg"
          >
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
