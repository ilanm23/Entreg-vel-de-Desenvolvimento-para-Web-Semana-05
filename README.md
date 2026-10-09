# Semana 05 — Objetos, Dados e Assincronismo

Mini projeto em JavaScript para praticar validação de objetos, métodos de arrays, consumo de APIs com `fetch` e `async/await`, manipulação do DOM e tratamento dos estados de carregamento, erro, vazio e sucesso.

## Arquivos

- `index.html`: estrutura da página, formulários e áreas de resultado.
- `app.js`: exercícios de pedidos, buscador de CEP, mini Pokédex e demonstração do Event Loop.

## Parte 1 — Pedidos

O array `pedidos` contém exemplos válidos e inválidos. Primeiro, `filter` mantém apenas pedidos com cliente não vazio e valor numérico finito maior que zero. Um segundo `filter` seleciona os pedidos com status `pago`. `reduce` soma os valores faturados e `map` gera as linhas com os valores formatados por `toFixed(2)`.

## Parte 2 — Buscador de CEP

O formulário valida o CEP com `trim()` e a expressão regular `/^\d{8}$/`. A busca usa `fetch` e `async/await` na API ViaCEP, com timeout de 5 segundos por `AbortSignal.timeout(5000)`. O código verifica `response.ok`, trata a resposta `erro` da API e exibe estados de carregamento, falha de conexão, CEP não encontrado e sucesso. Os dados são adicionados ao DOM com `createElement` e `textContent`, sem inserir dados externos usando `innerHTML`.

O bônus guarda o histórico de pesquisas em um array de objetos durante a sessão atual da página.

## Parte 3 — Mini Pokédex

O campo de Pokémon é validado para não ficar vazio, e o nome é convertido para minúsculo. O código consulta a PokéAPI, verifica `response.ok` e trata o status 404 como “Pokémon não encontrado”. No sucesso, exibe o nome, a imagem disponível e os tipos do Pokémon. Também apresenta mensagens de carregamento e falha de conexão.

## Parte 4 — Por que `Promise.all` pode ser mais rápido que vários `await` seguidos?

Com vários `await` sequenciais, cada operação só começa depois que a anterior termina, aumentando o tempo total quando as operações são independentes. Com `Promise.all`, todas as Promises podem ser iniciadas antes de aguardar o resultado conjunto, permitindo que as requisições de rede aconteçam em paralelo. Assim, o tempo de espera costuma se aproximar do tempo da requisição mais lenta, em vez da soma dos tempos individuais. `Promise.all` rejeita se qualquer Promise rejeitar; ele é útil quando precisamos que todas tenham sucesso.

## Como executar

1. Mantenha `index.html` e `app.js` na mesma pasta.
2. Abra `index.html` no navegador. Também pode usar a extensão Live Server no VS Code.
3. É necessária uma conexão com a internet para consultar as APIs.
4. Pressione **F12** e abra a aba **Console** para ver os resultados da Parte 1 e a demonstração do Event Loop.

## Observação

O histórico de CEPs fica em memória e é apagado ao recarregar a página. O projeto usa APIs públicas, então as respostas dependem da disponibilidade dos serviços e da conexão de internet.
