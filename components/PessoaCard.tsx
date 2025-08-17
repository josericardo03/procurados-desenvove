import { Pessoa } from '../types/api';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, MapPin, User, Clock, Info } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PessoaCardProps {
  pessoa: Pessoa;
  onClick: () => void;
}

export function PessoaCard({ pessoa, onClick }: PessoaCardProps) {
  const isLocalizada = pessoa.ultimaOcorrencia.dataLocalizacao !== null;
  const dataDesaparecimento = new Date(pessoa.ultimaOcorrencia.dtDesaparecimento);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const calcularDiasDesaparecida = () => {
    const hoje = new Date();
    const diffTime = Math.abs(hoje.getTime() - dataDesaparecimento.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const diasDesaparecida = calcularDiasDesaparecida();

  return (
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-gradient-to-br from-white to-slate-50/50 border-0 shadow-lg hover:shadow-slate-200/60 overflow-hidden"
      onClick={onClick}
    >
      <CardContent className="p-0">
        {/* Image Section */}
        <div className="relative overflow-hidden">
          <div className="aspect-[4/3] relative">
            {pessoa.urlFoto ? (
              <ImageWithFallback
                src={pessoa.urlFoto}
                alt={`Foto de ${pessoa.nome}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 flex items-center justify-center group-hover:from-slate-300 group-hover:to-slate-200 transition-all duration-300">
                <User className="w-20 h-20 text-slate-400 group-hover:text-slate-500 transition-colors duration-300" />
              </div>
            )}
            
            {/* Status Badge */}
            <div className="absolute top-4 right-4 z-10">
              <Badge 
                variant={isLocalizada ? "default" : "destructive"}
                className={`${
                  isLocalizada 
                    ? "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg" 
                    : "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-lg"
                } font-semibold px-3 py-1.5 text-xs tracking-wide border-0 backdrop-blur-sm`}
              >
                {isLocalizada ? "LOCALIZADA" : "DESAPARECIDA"}
              </Badge>
            </div>

            {/* Days Counter for Missing Persons */}
            {!isLocalizada && (
              <div className="absolute bottom-4 left-4 z-10">
                <div className="bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-medium border border-white/20">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{diasDesaparecida} {diasDesaparecida === 1 ? 'dia' : 'dias'}</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-4">
          {/* Name and Age */}
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-slate-700 transition-colors duration-200 line-clamp-2 leading-tight">
              {pessoa.nome}
            </h3>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <span className="font-medium">
                {pessoa.idade > 0 ? `${pessoa.idade} anos` : 'Idade não informada'}
              </span>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
              <span className="font-medium">{pessoa.sexo}</span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-slate-50/80 rounded-xl border border-slate-100 group-hover:bg-slate-100/80 transition-colors duration-200">
              <Calendar className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-slate-600 mb-1">Data do Desaparecimento</p>
                <p className="text-sm font-semibold text-slate-900">{formatDate(dataDesaparecimento)}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-slate-50/80 rounded-xl border border-slate-100 group-hover:bg-slate-100/80 transition-colors duration-200">
              <MapPin className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-slate-600 mb-1">Local</p>
                <p className="text-sm font-semibold text-slate-900 line-clamp-2">{pessoa.ultimaOcorrencia.localDesaparecimentoConcat}</p>
              </div>
            </div>
          </div>

          {/* Clothing Info */}
          {pessoa.ultimaOcorrencia.ocorrenciaEntrevDesapDTO.vestimentasDesaparecido && (
            <div className="pt-3 border-t border-slate-200">
              <div className="flex items-start gap-3">
                <Info className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-slate-600 mb-1">Vestimentas</p>
                  <p className="text-sm text-slate-700 line-clamp-2">
                    {pessoa.ultimaOcorrencia.ocorrenciaEntrevDesapDTO.vestimentasDesaparecido}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Hint */}
          <div className="pt-2">
            <div className="text-center p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105">
              <p className="text-xs font-medium text-blue-700">Clique para ver detalhes completos</p>
            </div>
          </div>
        </div>

        {/* Bottom Accent Line */}
        <div className={`h-1 bg-gradient-to-r ${
          isLocalizada 
            ? 'from-emerald-400 via-green-500 to-emerald-600' 
            : 'from-red-400 via-rose-500 to-red-600'
        } opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      </CardContent>
    </Card>
  );
}