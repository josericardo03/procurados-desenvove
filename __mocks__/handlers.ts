import { rest } from "msw";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://abitus-api.geia.vip";

export const handlers = [
  // Listagem de pessoas
  rest.get(`${API_BASE_URL}/v1/pessoas/aberto/filtro`, (req, res, ctx) => {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("pagina") || "0");
    const size = parseInt(url.searchParams.get("porPagina") || "10");
    const nome = url.searchParams.get("nome");
    const status = url.searchParams.get("status");
    const sexo = url.searchParams.get("sexo");

    // Simular dados mock
    const mockData = {
      totalElements: 150,
      totalPages: 15,
      pageable: {
        pageNumber: page,
        pageSize: size,
        sort: { unsorted: false, sorted: true, empty: false },
        offset: page * size,
        unpaged: false,
        paged: true,
      },
      numberOfElements: size,
      first: page === 0,
      last: page === 14,
      size: size,
      content: Array.from({ length: size }, (_, index) => ({
        id: page * size + index + 1,
        nome: nome
          ? `Pessoa ${nome} ${index + 1}`
          : `Pessoa ${page * size + index + 1}`,
        idade: 20 + (index % 50),
        sexo: sexo === "FEMININO" ? "FEMININO" : "MASCULINO",
        vivo: true,
        urlFoto:
          index % 3 === 0
            ? `https://picsum.photos/300/400?random=${index}`
            : null,
        ultimaOcorrencia: {
          dtDesaparecimento: new Date(
            Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
          ).toISOString(),
          dataLocalizacao:
            status === "LOCALIZADO" ? new Date().toISOString() : null,
          encontradoVivo: status === "LOCALIZADO",
          localDesaparecimentoConcat: `Local ${index + 1} - Cuiabá/MT`,
          ocorrenciaEntrevDesapDTO: {
            informacao: `Informação adicional ${index + 1}`,
            vestimentasDesaparecido: `Roupa ${index + 1}`,
          },
          listaCartaz: null,
          ocoId: 1000 + index,
        },
      })),
    };

    return res(ctx.json(mockData));
  }),

  // Detalhes de pessoa
  rest.get(`${API_BASE_URL}/v1/pessoas/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const pessoaId = parseInt(id as string);

    const mockPessoa = {
      id: pessoaId,
      nome: `Pessoa ${pessoaId}`,
      idade: 30,
      sexo: "MASCULINO",
      vivo: true,
      urlFoto: `https://picsum.photos/300/400?random=${pessoaId}`,
      ultimaOcorrencia: {
        dtDesaparecimento: new Date().toISOString(),
        dataLocalizacao: null,
        encontradoVivo: false,
        localDesaparecimentoConcat: "Cuiabá/MT",
        ocorrenciaEntrevDesapDTO: {
          informacao: "Informação adicional",
          vestimentasDesaparecido: "Camisa azul",
        },
        listaCartaz: null,
        ocoId: 1000 + pessoaId,
      },
    };

    return res(ctx.json(mockPessoa));
  }),

  // Envio de informações
  rest.post(
    `${API_BASE_URL}/v1/ocorrencias/informacoes-desaparecido`,
    (req, res, ctx) => {
      // Simular sucesso
      return res(ctx.status(200), ctx.json({ success: true }));
    }
  ),

  // Totais
  rest.get(`${API_BASE_URL}/v1/pessoas/aberto/filtro`, (req, res, ctx) => {
    const url = new URL(req.url);
    const status = url.searchParams.get("status");

    if (status === "LOCALIZADO") {
      return res(ctx.json({ totalElements: 50 }));
    }

    return res(ctx.json({ totalElements: 150 }));
  }),
];

// Handlers para cenários de erro
export const errorHandlers = [
  rest.get(`${API_BASE_URL}/v1/pessoas/aberto/filtro`, (req, res, ctx) => {
    return res(ctx.status(500), ctx.json({ error: "Internal Server Error" }));
  }),

  rest.get(`${API_BASE_URL}/v1/pessoas/:id`, (req, res, ctx) => {
    return res(ctx.status(404), ctx.json({ error: "Not Found" }));
  }),

  rest.post(
    `${API_BASE_URL}/v1/ocorrencias/informacoes-desaparecido`,
    (req, res, ctx) => {
      return res(ctx.status(400), ctx.json({ error: "Bad Request" }));
    }
  ),
];

// Handlers para timeout
export const timeoutHandlers = [
  rest.get(`${API_BASE_URL}/v1/pessoas/aberto/filtro`, (req, res, ctx) => {
    return res(ctx.delay("infinite"));
  }),
];
