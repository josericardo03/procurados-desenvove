export interface OcorrenciaEntrevDesapDTO {
  informacao: string | null;
  vestimentasDesaparecido: string;
}

export interface UltimaOcorrencia {
  dtDesaparecimento: string;
  dataLocalizacao: string | null;
  encontradoVivo: boolean;
  localDesaparecimentoConcat: string;
  ocorrenciaEntrevDesapDTO: OcorrenciaEntrevDesapDTO | null;
  listaCartaz: any | null;
  ocoId: number;
}

export interface Pessoa {
  id: number;
  nome: string;
  idade: number;
  sexo: "MASCULINO" | "FEMININO";
  vivo: boolean;
  urlFoto: string | null;
  ultimaOcorrencia: UltimaOcorrencia;
}

export interface Sort {
  unsorted: boolean;
  sorted: boolean;
  empty: boolean;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  unpaged: boolean;
  paged: boolean;
}

export interface ApiResponse {
  totalElements: number;
  totalPages: number;
  pageable: Pageable;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  size: number;
  content: Pessoa[];
}

export interface SearchFilters {
  nome?: string;
  status?: "desaparecido" | "localizado" | "todos";
  sexo?: "MASCULINO" | "FEMININO" | "todos";
  dataDesaparecimentoDe?: string; // formato yyyy-MM-dd
  dataDesaparecimentoAte?: string; // formato yyyy-MM-dd
}

export interface NovaInformacao {
  ocoId: number; // ID da ocorrência (obrigatório)
  informacao: string; // texto da observação (obrigatório)
  descricao: string; // legenda/descrição do(s) anexo(s) (obrigatório – pode ser vazio se sem anexo?)
  data: string; // formato yyyy-MM-dd (obrigatório)
  fotos?: File[]; // arquivos (opcional)
  // Campos extras opcionais da UI (não enviados na API atual, mas mantidos para futuras evoluções)
  localizacao?: string;
  telefone?: string;
}

export interface ApiStatus {
  isOnline: boolean;
  lastChecked: Date;
  responseTime?: number;
  error?: string;
}
