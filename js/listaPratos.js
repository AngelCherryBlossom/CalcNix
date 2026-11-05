
const findPratos = document.getElementById("inputBuscapratos");
const listaPratos = document.getElementById("listaResultadosPratos");

let pratosDisp = [];
let pratosCarreg = false;

async function carregarPratos() {
    try {
        const anwser = await fetch("/api/pratos", {
            credentials: "include"
        });

        if (!anwser.ok) {
            throw new Error("Não foi possível carregar os pratos.");
        }

        pratosDisp = await anwser.json();

        // Ordenar em ordem alfabética
        pratosDisp.sort((a, b) =>
            a.nome.localeCompare(b.nome, "pt-BR", {
                sensitivity: "base"
            })
        );

        pratosCarreg = true;

    } catch (erro) {
        console.error("Erro ao carregar pratos:", erro);
    }
}

function normalText(text) {
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

function exibePratos(buscaPratos = "") {
    listaPratos.innerHTML = "";

    const buscar = normalText(buscaPratos);

    // Filtrar os pratos pelo nome
    const pratFiltr = pratosDisp.filter(prato => {
        const nomeN = normalText(prato.nome);

        const corresp = nomeN.includes(buscar);
        const aChoosen = jaEscolhido(prato);

        return corresp && !aChoosen;
    });

    if (pratFiltr.length === 0) {
        const msg = document.createElement("li");

        msg.textContent = "Não há pratos cadastrados.";
        msg.classList.add("msg-vazia");

        listaPratos.appendChild(msg);

        listaPratos.style.display = "block";
        return;
    }

    pratFiltr.forEach(prato => {
        const item = document.createElement("li");

        const nome = document.createElement("span");
        nome.textContent = prato.nome;

        // Exibir o valor do prato
        const valor = document.createElement("span");
        valor.textContent = Number(prato.valorFinal).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

        valor.classList.add("valor-prato");

        const btnAddPra = document.createElement("button");
        btnAddPra.textContent = "Adicionar";
        btnAddPra.type = "button";
        btnAddPra.classList.add("btn-addPra");

        btnAddPra.addEventListener("click", evento => {
            evento.stopPropagation();
            selectPrato(prato);
            exibePratos(btnAddPra.value);
        });

        item.appendChild(nome);
        item.appendChild(valor);
        item.appendChild(btnAddPra);

        listaPratos.appendChild(item);
    });

    listaPratos.style.display = "block";
}

function selectPrato(prato) {
    addPrato(prato);
    findPratos.value = "";

    hideListaP();
}

findPratos.addEventListener("click", async () => {
    if (!pratosCarreg) {
        await carregarPratos();
    }

    exibePratos(findPratos.value);
});

findPratos.addEventListener("input", async () => {
    if (!pratosCarreg) {
        await carregarPratos();
    }

    exibePratos(findPratos.value);
});

function hideListaP() {
    listaPratos.style.display = "none";
}

document.addEventListener("click", evento => {
    const campTrue = findPratos.contains(evento.target);
    const lisTrue = listaPratos.contains(evento.target);

    if (!campTrue && !lisTrue) {
        hideListaP();
    }
});

const btnNav = [
    document.getElementById("jnlAlimento"),
    document.getElementById("jnlCalc"),
    document.getElementById("jnlCardapio")
];

btnNav.forEach(btn => {
    btn.addEventListener("click", () => {
        hideListaP();

        pratosCarreg = false;
    });
});
