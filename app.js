// Semana 05 — Objetos, Dados e Assincronismo
// Abra o Console do navegador (F12) para ver os resultados da Parte 1.

// ==============================
// PARTE 1 — MANIPULAÇÃO E VALIDAÇÃO DE DADOS
// ==============================

const pedidos = [
  { cliente: "Bia", valor: 120, status: "pago" },
  { cliente: "Caio", valor: 75.5, status: "pago" },
  { cliente: "Duda", valor: 40, status: "pendente" },
  { cliente: "   ", valor: 30, status: "pago" },
  { cliente: "Enzo", valor: -10, status: "pago" },
  { cliente: "Lia", valor: "50", status: "pago" }
];

function processarPedidos() {
  // Cliente deve ser texto não vazio e valor deve ser número maior que zero.
  const pedidosValidos = pedidos.filter(pedido =>
    typeof pedido.cliente === "string" &&
    pedido.cliente.trim() !== "" &&
    typeof pedido.valor === "number" &&
    Number.isFinite(pedido.valor) &&
    pedido.valor > 0
  );

  const pedidosPagos = pedidosValidos.filter(pedido => pedido.status === "pago");
  const totalFaturado = pedidosPagos.reduce((total, pedido) => total + pedido.valor, 0);
  const linhas = pedidosPagos.map(pedido =>
    `${pedido.cliente.trim()} — R$ ${pedido.valor.toFixed(2)}`
  );

  console.log("Pedidos válidos:", pedidosValidos);
  console.log('Pedidos válidos com status "pago":', pedidosPagos);
  console.log("Total faturado: R$", totalFaturado.toFixed(2));
  console.log("Textos formatados:", linhas);

  const resultado = document.querySelector("#resultadoPedidos");
  resultado.textContent = [
    "Pedidos pagos:",
    ...linhas,
    "",
    `Total faturado: R$ ${totalFaturado.toFixed(2)}`
  ].join("\n");
}

document.querySelector("#mostrarPedidos").addEventListener("click", processarPedidos);
processarPedidos();


// ==============================
// PARTE 2 — BUSCADOR DE CEP (VIACEP)
// ==============================

const formCep = document.querySelector("#formCep");
const campoCep = document.querySelector("#cep");
const botaoCep = document.querySelector("#buscarCep");
const statusCep = document.querySelector("#statusCep");
const resultadoCep = document.querySelector("#resultadoCep");
const historicoCepLista = document.querySelector("#historicoCep");

// Histórico em memória durante o uso da página.
const historicoCeps = [];

function mostrarStatusCep(mensagem) {
  statusCep.textContent = mensagem;
}

function renderizarHistoricoCep() {
  historicoCepLista.replaceChildren();

  if (historicoCeps.length === 0) {
    const itemVazio = document.createElement("li");
    itemVazio.textContent = "Nenhuma pesquisa ainda.";
    historicoCepLista.append(itemVazio);
    return;
  }

  historicoCeps.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.cep} — ${item.cidade}/${item.uf}`;
    historicoCepLista.append(li);
  });
}

function renderizarResultadoCep(endereco) {
  resultadoCep.replaceChildren();

  const campos = [
    ["Rua", endereco.logradouro || "Não informado"],
    ["Bairro", endereco.bairro || "Não informado"],
    ["Cidade", endereco.localidade || "Não informado"],
    ["UF", endereco.uf || "Não informado"]
  ];

  campos.forEach(([rotulo, valor]) => {
    const dt = document.createElement("dt");
    dt.textContent = rotulo;
    const dd = document.createElement("dd");
    dd.textContent = valor;
    resultadoCep.append(dt, dd);
  });
}

formCep.addEventListener("submit", async event => {
  event.preventDefault();

  const cep = campoCep.value.trim();

  // Apenas oito dígitos, sem hífen ou outros caracteres.
  if (!/^\d{8}$/.test(cep)) {
    resultadoCep.replaceChildren();
    mostrarStatusCep("Digite um CEP válido com exatamente 8 dígitos.");
    return;
  }

  botaoCep.disabled = true;
  resultadoCep.replaceChildren();
  mostrarStatusCep("Buscando...");

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
      throw new Error(`Falha HTTP: ${response.status}`);
    }

    const endereco = await response.json();

    if (endereco.erro) {
      mostrarStatusCep("CEP não encontrado.");
      return;
    }

    renderizarResultadoCep(endereco);
    mostrarStatusCep("");

    historicoCeps.unshift({
      cep,
      cidade: endereco.localidade || "Cidade não informada",
      uf: endereco.uf || "--"
    });
    renderizarHistoricoCep();
  } catch (erro) {
    console.error("Erro ao buscar CEP:", erro);
    mostrarStatusCep("Falha na conexão. Verifique sua internet e tente novamente.");
  } finally {
    botaoCep.disabled = false;
  }
});


// ==============================
// PARTE 3 — MINI POKÉDEX (POKÉAPI)
// ==============================

const formPokemon = document.querySelector("#formPokemon");
const campoPokemon = document.querySelector("#pokemon");
const botaoPokemon = document.querySelector("#buscarPokemon");
const statusPokemon = document.querySelector("#statusPokemon");
const resultadoPokemon = document.querySelector("#resultadoPokemon");

formPokemon.addEventListener("submit", async event => {
  event.preventDefault();

  const nomePokemon = campoPokemon.value.trim().toLowerCase();

  if (!nomePokemon) {
    resultadoPokemon.replaceChildren();
    statusPokemon.textContent = "Digite o nome de um Pokémon.";
    return;
  }

  botaoPokemon.disabled = true;
  resultadoPokemon.replaceChildren();
  statusPokemon.textContent = "Buscando Pokémon...";

  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(nomePokemon)}`,
      { signal: AbortSignal.timeout(5000) }
    );

    if (response.status === 404) {
      throw new Error("NOT_FOUND");
    }
    if (!response.ok) {
      throw new Error(`HTTP_${response.status}`);
    }

    const pokemon = await response.json();

    const card = document.createElement("div");
    card.classList.add("pokemon-card");

    const imagem = document.createElement("img");
    imagem.alt = `Imagem de ${pokemon.name}`;
    imagem.src = pokemon.sprites.front_default || "";
    if (!pokemon.sprites.front_default) {
      imagem.hidden = true;
    }

    const detalhes = document.createElement("div");
    const titulo = document.createElement("h3");
    titulo.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

    const tipos = document.createElement("p");
    tipos.textContent = `Tipos: ${pokemon.types.map(item => item.type.name).join(", ")}`;

    detalhes.append(titulo, tipos);
    card.append(imagem, detalhes);
    resultadoPokemon.replaceChildren(card);
    statusPokemon.textContent = "";
  } catch (erro) {
    console.error("Erro ao buscar Pokémon:", erro);
    resultadoPokemon.replaceChildren();

    if (erro.message === "NOT_FOUND") {
      statusPokemon.textContent = "Pokémon não encontrado.";
    } else {
      statusPokemon.textContent = "Falha na conexão. Verifique sua internet e tente novamente.";
    }
  } finally {
    botaoPokemon.disabled = false;
  }
});


// ==============================
// DEMONSTRAÇÃO SIMPLES DO EVENT LOOP
// ==============================

console.log("Event Loop: início síncrono");
Promise.resolve().then(() => console.log("Event Loop: microtarefa (Promise)"));
setTimeout(() => console.log("Event Loop: tarefa (setTimeout)"), 0);
console.log("Event Loop: fim síncrono");
