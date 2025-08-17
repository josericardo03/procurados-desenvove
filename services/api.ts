import { ApiResponse, Pessoa, SearchFilters, NovaInformacao } from '../types/api';

const API_BASE_URL = 'https://abitus-api.geia.vip';

// Mock data para desenvolvimento
const mockData: ApiResponse = {
  totalElements: 535,
  totalPages: 54,
  pageable: {
    pageNumber: 0,
    pageSize: 10,
    sort: {
      unsorted: false,
      sorted: true,
      empty: false
    },
    offset: 0,
    unpaged: false,
    paged: true
  },
  numberOfElements: 10,
  first: true,
  last: false,
  size: 10,
  content: [
    {
      id: 2387,
      nome: "ASASD",
      idade: 0,
      sexo: "MASCULINO",
      vivo: true,
      urlFoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      ultimaOcorrencia: {
        dtDesaparecimento: "2025-04-02T22:22:00",
        dataLocalizacao: null,
        encontradoVivo: false,
        localDesaparecimentoConcat: "asdasd - Cuiabá/MT",
        ocorrenciaEntrevDesapDTO: {
          informacao: null,
          vestimentasDesaparecido: "vestido branco"
        },
        listaCartaz: null,
        ocoId: 1527
      }
    },
    {
      id: 2366,
      nome: "JONATHAN GABRIEL ALVES VALIENTE",
      idade: 47,
      sexo: "MASCULINO",
      vivo: true,
      urlFoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      ultimaOcorrencia: {
        dtDesaparecimento: "2025-04-02T11:11:00",
        dataLocalizacao: null,
        encontradoVivo: false,
        localDesaparecimentoConcat: "centro - Várzea Grande/MT",
        ocorrenciaEntrevDesapDTO: {
          informacao: null,
          vestimentasDesaparecido: "estava vestida."
        },
        listaCartaz: null,
        ocoId: 1526
      }
    },
    {
      id: 2386,
      nome: "ALINA DA SOUZA",
      idade: 0,
      sexo: "FEMININO",
      vivo: true,
      urlFoto: null,
      ultimaOcorrencia: {
        dtDesaparecimento: "2025-04-01T15:00:00",
        dataLocalizacao: null,
        encontradoVivo: false,
        localDesaparecimentoConcat: "terra nova - Cuiabá/MT",
        ocorrenciaEntrevDesapDTO: {
          informacao: null,
          vestimentasDesaparecido: "sdada"
        },
        listaCartaz: null,
        ocoId: 1525
      }
    },
    {
      id: 2364,
      nome: "JOANA DA SILVA",
      idade: 40,
      sexo: "FEMININO",
      vivo: false,
      urlFoto: "https://images.unsplash.com/photo-1494790108755-2616b52c97e1?w=300&h=300&fit=crop&crop=face",
      ultimaOcorrencia: {
        dtDesaparecimento: "2025-03-27T14:00:00",
        dataLocalizacao: "2025-04-10T10:00:00",
        encontradoVivo: false,
        localDesaparecimentoConcat: "CPAV - Cuiabá/MT",
        ocorrenciaEntrevDesapDTO: {
          informacao: "asdas",
          vestimentasDesaparecido: "SHORT PRETO E CAMISA BRANCA"
        },
        listaCartaz: null,
        ocoId: 1524
      }
    },
    {
      id: 2384,
      nome: "KAIO ALVES LACERDA",
      idade: 40,
      sexo: "MASCULINO",
      vivo: true,
      urlFoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
      ultimaOcorrencia: {
        dtDesaparecimento: "2025-03-26T15:30:00",
        dataLocalizacao: null,
        encontradoVivo: false,
        localDesaparecimentoConcat: "PEDRA NOVENTA - Cuiabá/MT",
        ocorrenciaEntrevDesapDTO: {
          informacao: null,
          vestimentasDesaparecido: "CALÇA BRANCA E CAMISETA AZUL DE MANGA LONGA"
        },
        listaCartaz: null,
        ocoId: 1522
      }
    },
    {
      id: 2385,
      nome: "HUGO DA SILVA",
      idade: 0,
      sexo: "MASCULINO",
      vivo: true,
      urlFoto: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=face",
      ultimaOcorrencia: {
        dtDesaparecimento: "2025-03-26T15:00:00",
        dataLocalizacao: null,
        encontradoVivo: false,
        localDesaparecimentoConcat: "terra nova - Cuiabá/MT",
        ocorrenciaEntrevDesapDTO: {
          informacao: null,
          vestimentasDesaparecido: ""
        },
        listaCartaz: null,
        ocoId: 1523
      }
    }
  ]
};

export class ApiService {
  static async getPessoas(
    page: number = 0,
    size: number = 10,
    filters: SearchFilters = {}
  ): Promise<ApiResponse> {
    try {
      // Para desenvolvimento, usa mock data
      // Em produção, descomente a linha abaixo:
      // const response = await fetch(`${API_BASE_URL}/pessoas?page=${page}&size=${size}`);
      
      // Simula delay da API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filtra os dados mock baseado nos filtros
      let filteredContent = [...mockData.content];
      
      if (filters.nome) {
        filteredContent = filteredContent.filter(pessoa =>
          pessoa.nome.toLowerCase().includes(filters.nome!.toLowerCase())
        );
      }
      
      if (filters.status && filters.status !== 'todos') {
        if (filters.status === 'desaparecido') {
          filteredContent = filteredContent.filter(pessoa => 
            !pessoa.ultimaOcorrencia.dataLocalizacao
          );
        } else if (filters.status === 'localizado') {
          filteredContent = filteredContent.filter(pessoa => 
            pessoa.ultimaOcorrencia.dataLocalizacao
          );
        }
      }
      
      if (filters.sexo && filters.sexo !== 'todos') {
        filteredContent = filteredContent.filter(pessoa => 
          pessoa.sexo === filters.sexo
        );
      }
      
      return {
        ...mockData,
        content: filteredContent,
        totalElements: filteredContent.length,
        totalPages: Math.ceil(filteredContent.length / size)
      };
    } catch (error) {
      console.error('Erro ao buscar pessoas:', error);
      throw new Error('Erro ao carregar dados das pessoas desaparecidas');
    }
  }

  static async getPessoaById(id: number): Promise<Pessoa | null> {
    try {
      // Para desenvolvimento, usa mock data
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const pessoa = mockData.content.find(p => p.id === id);
      return pessoa || null;
    } catch (error) {
      console.error('Erro ao buscar pessoa:', error);
      throw new Error('Erro ao carregar dados da pessoa');
    }
  }

  static async enviarInformacao(informacao: NovaInformacao): Promise<boolean> {
    try {
      // Simula envio para a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Informação enviada:', informacao);
      return true;
    } catch (error) {
      console.error('Erro ao enviar informação:', error);
      throw new Error('Erro ao enviar informação');
    }
  }
}