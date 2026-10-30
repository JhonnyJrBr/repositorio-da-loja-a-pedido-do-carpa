let carrinho = JSON.parse(localStorage.getItem('kadabra_carrinho')) || [];

const contadorCarrinho = document.getElementById('contador-carrinho');
const elementoItensCarrinho = document.getElementById('itens-carrinho');
const elementoValorTotal = document.getElementById('valor-total-carrinho');

function atualizarCarrinho() {
    localStorage.setItem('kadabra_carrinho', JSON.stringify(carrinho));

    if (contadorCarrinho) {
        const quantidadeTotal = carrinho.reduce(
            (acumulador, item) => acumulador + item.quantidade, 0
        );

        contadorCarrinho.textContent = quantidadeTotal;
    }

    if (!elementoItensCarrinho || !elementoValorTotal) return;

    elementoItensCarrinho.innerHTML = '';
    let totalAcumulado = 0;

    if (carrinho.length === 0) {
        elementoItensCarrinho.innerHTML = `
            <li class="item-carrinho" style="color: #64748b;">
                Seu carrinho está vazio no momento.
            </li>
        `;

        elementoValorTotal.textContent = "0,00";
        return;
    }

    carrinho.forEach(item => {
        const subtotalItem = item.preco * item.quantidade;
        totalAcumulado += subtotalItem;

        const elementoItem = document.createElement('li');
        elementoItem.classList.add('item-carrinho');

        elementoItem.innerHTML = `
            <div class="informacoes-item-carrinho">
                <h4>${item.nome}</h4>
                <small>
                    Preço unitário: R$ ${item.preco.toFixed(2).replace('.', ',')}
                    | Quantidade: ${item.quantidade}
                </small>
            </div>

            <div class="acoes-item-carrinho">
                <span>R$ ${subtotalItem.toFixed(2).replace('.', ',')}</span>

                <button class="botao-remover"
                    onclick="removerItemCarrinho(${item.id})">
                    Remover
                </button>
            </div>
        `;

        elementoItensCarrinho.appendChild(elementoItem);
    });

    elementoValorTotal.textContent = totalAcumulado.toFixed(2).replace('.', ',');
}

function adicionarItemCarrinho(id, nome, preco) {
    const itemEncontrado = carrinho.find(item => item.id === id);

    if (itemEncontrado) {
        itemEncontrado.quantidade += 1;
    } else {
        carrinho.push({
            id: id,
            nome: nome,
            preco: preco,
            quantidade: 1
        });
    }

    atualizarCarrinho();

    alert(`"${nome}" foi adicionado ao seu carrinho!`);
}

function removerItemCarrinho(id) {
    carrinho = carrinho.filter(item => item.id !== id);
    atualizarCarrinho();
}

document.querySelectorAll('.botao-adicionar-carrinho').forEach(botao => {
    botao.addEventListener('click', (evento) => {
        const cartaoProduto = evento.target.closest('.cartao-produto');

        const id = parseInt(cartaoProduto.getAttribute('data-id'));
        const nome = cartaoProduto.getAttribute('data-nome');
        const preco = parseFloat(cartaoProduto.getAttribute('data-preco'));

        adicionarItemCarrinho(id, nome, preco);
    });
});

function finalizarCompra(evento) {
    evento.preventDefault();

    if (carrinho.length === 0) {
        alert("Erro: não existem produtos no carrinho para finalizar a compra.");
        return;
    }

    alert(
        "Processando pagamento...\n\n" +
        "Parabéns! Sua compra nas Lojas Kadabra foi concluída!"
    );

    carrinho = [];
    atualizarCarrinho();

    window.location.href = "index.html";
}

atualizarCarrinho();