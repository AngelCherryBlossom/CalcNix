const areaCh = document.querySelector(".selectPrato");
const bCriar = document.getElementById("criarCardapio");
const pnnCardapios = document.getElementById("pannelCardapio");

let pratChoosen = [];

function normalTexto(text) {
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

function cleanCard() {
    areaCh.innerHTML = "";
    pratChoosen = [];

    document.getElementById("nomeCardapio").value = "";
}

function addPrato(prato) {
    const aEscolhido = pratChoosen.some(receita => 
        normalTexto(receita.nome) === normalTexto(prato.nome)
    );

    if (aEscolhido) {
        return;
    }

    pratChoosen.push(prato);

    const item = document.createElement("div");
    item.classList.add("prato-ecolhido");
    item.textContent = prato.nome;

    const nome = document.createElement("span");
    nome.textContent = prato.nome;

    const valor = document.createElement("span");
    valor.textContent = Number(prato.valorFinal).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    item.appendChild(nome);
    item.appendChild(valor);

    areaCh.appendChild(item);
}

function jaEscolhido(prato) {
    return pratChoosen.some(receita => 
        normalTexto(receita.nome) === normalTexto(prato.nome)
    );
}

bCriar.addEventListener("click", async () => {
    const nome = document.getElementById("nomeCardapio").value.trim();
    // const preIdeal = "..."

    if (!nome) {
        alert("Nomeie o cardápio.")
        return;
    }

    if (pratChoosen.length === 0) {
        alert("Adicione ao p=menos um prato.");
        return;
    }

    try {
        const anwser = await fetch("/api/cardapios", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                nome,
                pratos: pratChoosen
                // preIdeal
            })
        });

        const dadosCard = await anwser.json();

        if (!anwser.ok) {
            alert(dadosCard.erro || "Não foi possível criar o cardápio");
            return;
        }

        alert("Cardápio criado com sucesso!");
        await carregarCardapios();
        cleanCard();

    } catch (erro) {
        console.error("Erro ao criar cardápio:", erro);
        alert(erro.message);
    }
});


function exibeCard(cardapios) {
    pnnCardapios.innerHTML = "";

    const modelCard = document.getElementById("modelCardapio");

    cardapios.forEach(cardapio => {
        const item = document.createElement("div");
        item.classList.add("card-item");

        const nome = document.createElement("h3");
        nome.classList.add("cardapio-nome");
        nome.textContent = cardapio.nome;

        const lista = document.createElement("div");
        lista.classList.add("cardapio-pratos");

        const pratos = cardapio.pratos || [];

        pratos.forEach(prato => {
            const linha = document.createElement("div");
            linha.classList.add("cardapio-prato");

            const nomePrato = document.createElement("span");
            nomePrato.textContent = prato.nome;

            const valorPrato = document.createElement("span");
            valorPrato.textContent = Number(prato.valorFinal).toLocaleString(
                "pt-BR",
                {
                    style: "currency",
                    currency: "BRL"
                }
            );

            linha.appendChild(nomePrato);
            linha.appendChild(valorPrato);

            lista.appendChild(linha);
        });

        item.appendChild(nome);
        item.appendChild(lista);

        pnnCardapios.appendChild(item);
    });
}

async function carregarCardapios() {
    try {
        const anwser = await fetch("/api/cardapios", {
            credentials: "include"
        });

        if (!anwser.ok) {
            throw new Error("Não foi possível carregar os cardápios.");
        }

        const cardapios = await anwser.json();
        exibeCard(cardapios);
    } catch (erro) {
        console.error("Erro ao carregar cardápios:", erro);
    }
}

carregarCardapios();