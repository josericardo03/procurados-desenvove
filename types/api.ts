export interface OcorrenciaEntrevDesapDTO {
  informacao: string | null;
  vestimentasDesaparecido: string;
}

export interface UltimaOcorrencia {
  dtDesaparecimento: string;
  dataLocalizacao: string | null;
  encontradoVivo: boolean;
  localDesaparecimentoConcat: string;
  ocorrenciaEntrevDesapDTO: OcorrenciaEntrevDesapDTO;
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
  status?: 'desaparecido' | 'localizado' | 'todos';
  sexo?: 'MASCULINO' | 'FEMININO' | 'todos';
}

export interface NovaInformacao {
  pessoaId: number;
  informacao: string;
  localizacao?: string;
  telefone?: string;
  fotos?: File[];
}