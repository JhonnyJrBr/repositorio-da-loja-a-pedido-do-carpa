
const abrirCarrinho = document.getElementById("abrirCarrinho");
const fecharCarrinho = document.getElementById("fecharCarrinho");
const painelCarrinho = document.getElementById("painelCarrinho");
const fundoCarrinho = document.getElementById("fundoCarrinho");

const listaCarrinho = document.getElementById("listaCarrinho");
const totalCarrinho = document.getElementById("totalCarrinho");
const quantidadeCarrinho = document.getElementById("quantidadeCarrinho");
const finalizarCompra = document.getElementById("finalizarCompra");

const usuarioLogado = localStorage.getItem("usuarioLogado");

const chaveCarrinho = usuarioLogado
    ? "carrinho_" + usuarioLogado.toLowerCase()
    : "carrinho_visitante";

let carrinho = JSON.parse(localStorage.getItem(chaveCarrinho)) || [];


// FORMATAR PREÇO

function formatarPreco(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}


// SALVAR CARRINHO

function salvarCarrinho() {
    localStorage.setItem(chaveCarrinho, JSON.stringify(carrinho));
}


// ABRIR E FECHAR CARRINHO

function abrirPainel() {
    painelCarrinho.classList.add("ativo");
    fundoCarrinho.classList.add("ativo");
}

function fecharPainel() {
    painelCarrinho.classList.remove("ativo");
    fundoCarrinho.classList.remove("ativo");
}

abrirCarrinho.addEventListener("click", abrirPainel);
fecharCarrinho.addEventListener("click", fecharPainel);
fundoCarrinho.addEventListener("click", fecharPainel);


// ADICIONAR BOTÕES AOS PRODUTOS

const produtos = document.querySelectorAll(".card");

produtos.forEach(function(card) {

    const nome = card.querySelector("h3").textContent.trim();

    const precoTexto = card.querySelector(".preco").textContent;

    const preco = Number(
        precoTexto.replace(/[^\d,]/g, "").replace(",", ".")
    );

    const imagem = card.querySelector("img").src;

    const botao = document.createElement("button");

    botao.textContent = "🛒 Adicionar ao carrinho";

    botao.classList.add("adicionar-carrinho");

    botao.type = "button";

    botao.addEventListener("click", function() {

        const produtoExistente = carrinho.find(function(item) {
            return item.id === nome;
        });

        if (produtoExistente) {
            produtoExistente.quantidade++;
        } else {
            carrinho.push({
                id: nome,
                nome: nome,
                preco: preco,
                imagem: imagem,
                quantidade: 1
            });
        }

        salvarCarrinho();
        atualizarCarrinho();

        botao.textContent = "✓ Adicionado!";

        setTimeout(function() {
            botao.textContent = "🛒 Adicionar ao carrinho";
        }, 1000);

    });

    card.querySelector(".card-info").appendChild(botao);

});


// ATUALIZAR CARRINHO

function atualizarCarrinho() {

    listaCarrinho.innerHTML = "";

    let total = 0;
    let quantidadeTotal = 0;

    if (carrinho.length === 0) {

        listaCarrinho.innerHTML =
            '<p class="carrinho-vazio">Seu carrinho está vazio! 🛒</p>';

    }

    carrinho.forEach(function(item) {

        total += item.preco * item.quantidade;
        quantidadeTotal += item.quantidade;

        const elemento = document.createElement("div");

        elemento.classList.add("item-carrinho");

        const imagem = document.createElement("img");
        imagem.src = item.imagem;
        imagem.alt = item.nome;

        const informacoes = document.createElement("div");
        informacoes.classList.add("informacoes-item");

        const nome = document.createElement("h3");
        nome.textContent = item.nome;

        const preco = document.createElement("p");
        preco.textContent = formatarPreco(item.preco * item.quantidade);

        const controles = document.createElement("div");
        controles.classList.add("controle-quantidade");

        const diminuir = document.createElement("button");
        diminuir.textContent = "-";
        diminuir.type = "button";

        diminuir.addEventListener("click", function() {
            alterarQuantidade(item.id, -1);
        });

        const quantidade = document.createElement("span");
        quantidade.textContent = item.quantidade;

        const aumentar = document.createElement("button");
        aumentar.textContent = "+";
        aumentar.type = "button";

        aumentar.addEventListener("click", function() {
            alterarQuantidade(item.id, 1);
        });

        const remover = document.createElement("button");
        remover.textContent = "🗑";
        remover.classList.add("remover-item");
        remover.type = "button";
        remover.title = "Remover produto";

        remover.addEventListener("click", function() {
            removerProduto(item.id);
        });

        controles.appendChild(diminuir);
        controles.appendChild(quantidade);
        controles.appendChild(aumentar);

        informacoes.appendChild(nome);
        informacoes.appendChild(preco);
        informacoes.appendChild(controles);

        elemento.appendChild(imagem);
        elemento.appendChild(informacoes);
        elemento.appendChild(remover);

        listaCarrinho.appendChild(elemento);

    });

    totalCarrinho.textContent = formatarPreco(total);

    quantidadeCarrinho.textContent = quantidadeTotal;

    salvarCarrinho();

}


// AUMENTAR OU DIMINUIR QUANTIDADE

function alterarQuantidade(id, valor) {

    const produto = carrinho.find(function(item) {
        return item.id === id;
    });

    if (produto) {

        produto.quantidade += valor;

        if (produto.quantidade <= 0) {
            removerProduto(id);
            return;
        }

    }

    atualizarCarrinho();

}


// REMOVER PRODUTO

function removerProduto(id) {

    carrinho = carrinho.filter(function(item) {
        return item.id !== id;
    });

    atualizarCarrinho();

}


// FINALIZAR COMPRA


/* ==============================
   SISTEMA DE PAGAMENTO
============================== */

const etapaPagamento = document.getElementById("etapaPagamento");
const rodapeCarrinho = document.querySelector(".rodape-carrinho");
const detalhesPagamento = document.getElementById("detalhesPagamento");

const confirmarPagamento = document.getElementById("confirmarPagamento");
const voltarCarrinho = document.getElementById("voltarCarrinho");

let formaPagamento = "";


/* ABRIR ETAPA DE PAGAMENTO */

finalizarCompra.addEventListener("click", function() {

    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    rodapeCarrinho.style.display = "none";
    etapaPagamento.style.display = "block";

    formaPagamento = "";

    document.querySelectorAll(".opcao-pagamento").forEach(function(botao) {
        botao.classList.remove("selecionado");
    });

    detalhesPagamento.innerHTML =
        "<p>Selecione uma forma de pagamento acima.</p>";

});


/* ESCOLHER FORMA DE PAGAMENTO */

document.querySelectorAll(".opcao-pagamento").forEach(function(botao) {

    botao.addEventListener("click", function() {

        formaPagamento = botao.dataset.pagamento;

        document.querySelectorAll(".opcao-pagamento").forEach(function(item) {
            item.classList.remove("selecionado");
        });

        botao.classList.add("selecionado");


        /* PAGAMENTO PIX */

        if (formaPagamento === "pix") {

            detalhesPagamento.innerHTML = `
                <h3>Pagamento via PIX</h3>

                <p>Utilize a chave PIX demonstrativa abaixo:</p>

                <div class="chave-pix" id="chavePix">
                    pix@kadabrashop.com
                </div>

                <button type="button" class="botao-copiar" id="copiarPix">
                    Copiar chave PIX
                </button>

                <p style="font-size: 12px; color: #aaa;">
                    Chave fictícia para demonstração.
                    Configure uma chave real através de um provedor de pagamentos.
                </p>
            `;

            document.getElementById("copiarPix").addEventListener("click", function() {

                const chave = document.getElementById("chavePix").textContent.trim();

                navigator.clipboard.writeText(chave)
                    .then(function() {
                        alert("Chave PIX copiada!");
                    })
                    .catch(function() {
                        alert("Não foi possível copiar. Copie a chave manualmente.");
                    });

            });

        }


        /* CARTÃO DE CRÉDITO */

        else if (formaPagamento === "credito") {

            detalhesPagamento.innerHTML = `
                <h3>Cartão de crédito</h3>

                <p>
                    Você selecionou o pagamento com cartão de crédito.
                </p>

                <p>
                    O pagamento deverá ser realizado em um ambiente
                    seguro de um intermediador de pagamentos.
                </p>

                <p style="color: #a77aff;">
                    💳 Crédito selecionado.
                </p>
            `;

        }


        /* CARTÃO DE DÉBITO */

        else if (formaPagamento === "debito") {

            detalhesPagamento.innerHTML = `
                <h3>Cartão de débito</h3>

                <p>
                    Você selecionou o pagamento com cartão de débito.
                </p>

                <p>
                    O pagamento deverá ser realizado em um ambiente
                    seguro de um intermediador de pagamentos.
                </p>

                <p style="color: #a77aff;">
                    💳 Débito selecionado.
                </p>
            `;

        }

    });

});


/* VOLTAR AO CARRINHO */

voltarCarrinho.addEventListener("click", function() {

    etapaPagamento.style.display = "none";
    rodapeCarrinho.style.display = "block";

});


/* CONFIRMAR PEDIDO */

confirmarPagamento.addEventListener("click", function() {

    if (!formaPagamento) {
        alert("Escolha uma forma de pagamento!");
        return;
    }

    const total = carrinho.reduce(function(soma, item) {
        return soma + item.preco * item.quantidade;
    }, 0);

    const nomeForma = {
        pix: "PIX",
        credito: "Cartão de crédito",
        debito: "Cartão de débito"
    };

    alert(
        "Pedido demonstrativo realizado!\n\n" +
        "Pagamento escolhido: " + nomeForma[formaPagamento] +
        "\nTotal: " + formatarPreco(total) +
        "\n\nA Kadabra Shop agradece sua preferência!"
    );

    carrinho = [];

    atualizarCarrinho();

    etapaPagamento.style.display = "none";
    rodapeCarrinho.style.display = "block";

    fecharPainel();

});



// INICIAR CARRINHO

atualizarCarrinho();


