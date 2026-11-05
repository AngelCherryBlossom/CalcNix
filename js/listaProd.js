const btnBusca = document.getElementById("inputBusca");
const lista = document.getElementById("listaResultados");

let prod = [];
let prodCarreg = false;


// Carregar os produtos do servidor
async function carregarProdutos() {
    try {
        const answer = await fetch("/api/produtos", {
            credentials: "include"
        });

        if (!answer.ok) {
            throw new Error("Não foi possível carregar os produtos.");
        }

        prod = await answer.json();

        // Ordenar em ordem alfabética
        prod.sort((a, b) =>
            a.nome.localeCompare(b.nome, "pt-BR", {
                sensitivity: "base"
            })
        );

        prodCarreg = true;

    } catch (erro) {
        console.error("Erro ao carregar alimentos:", erro);
    }
}

function normalizeTexto(texto) {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

// Exibir produtos
function showLista(textoBusca = "") {
    lista.innerHTML = "";

    const busca = normalizeTexto(textoBusca);

    // Filtrar os alimentos pelo nome
    const prodFiltrados = prod.filter(produto =>{
        const nomeNormal = normalizeTexto(produto.nome);

        const corresponde = nomeNormal.includes(busca);
        const jaChoosed = aChoosed(produto);

        return corresponde && !jaChoosed;
    });

    if (prodFiltrados.length === 0) {
        const msg = document.createElement("li");

        msg.textContent = "Não há alimentos cadastrados.";
        msg.classList.add("msg-vazia");

        lista.appendChild(msg);

        lista.style.display = "block";
        return;
    }

    // Recriar lista
    prodFiltrados.forEach(produto => {
        const item = document.createElement("li");

        const nome = document.createElement("span");
        nome.textContent = produto.nome;

        const btnAdd = document.createElement("button");
        btnAdd.textContent = "Adicionar";
        btnAdd.type = "button";
        btnAdd.classList.add("btn-add");

        btnAdd.addEventListener("click", evento => {
            evento.stopPropagation();
            selectProd(produto);
            showLista(btnBusca.value);
        });

        item.appendChild(nome);
        item.appendChild(btnAdd);

        lista.appendChild(item);
    });

    lista.style.display = "block";
}

function selectProd(produto) {
    addAlimento(produto);
    btnBusca.value = "";

    hideLista();
}


// Clicar campo: mostrar os alimentos
btnBusca.addEventListener("click", async () => {
    if (!prodCarreg) {
        await carregarProdutos();
    }

    showLista(btnBusca.value);
});


// Buscar conforme o usuário digita
btnBusca.addEventListener("input", async () => {
    if (!prodCarreg) {
        await carregarProdutos();
    }

    showLista(btnBusca.value);
});


// Esconder lista
function hideLista() {
    lista.style.display = "none";
}


// Clicar fora campo e lista
document.addEventListener("click", (evento) => {
    const campoTrue = btnBusca.contains(evento.target);
    const listaTrue = lista.contains(evento.target);

    if (!campoTrue && !listaTrue) {
        hideLista();
    }
});


// Esconder lista ao trocar de página
const botoesNavegacao = [
    document.getElementById("jnlAlimento"),
    document.getElementById("jnlCalc"),
    document.getElementById("jnlCardapio")
];

botoesNavegacao.forEach(botao => {
    botao.addEventListener("click", () => {
        hideLista();

        prodCarreg = false;
    });
});