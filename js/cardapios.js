const listaPrato = document.getElementById("listaAlimentos");
const alimentosPrato = document.getElementById("alimentosPrato");
const tCalorias = document.getElementById("totalCalorias");
const tCusto = document.getElementById("totalCusto");

let alimDisp = [];
let alimSele = [];

async function carregarPrato() {
    try {
        const resposta = await fetch("/api/produtos", {
            credentials: "include"
        });

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar os alimentos.");
        }

        alimDisp = await resposta.json();
        showAlimDisp();

    } catch (erro) {
        console.error("Erro ao carregar alimentos para o prato:", erro);
        listaPrato.textContent = "Erro ao carregar os alimentos.";
    }
}

function showAlimDisp() {
    listaPrato.innerHTML = "";

    if (alimDisp.length === 0) {
        listaPrato.textContent = "Nenhum alimento cadastrado.";
        return;
    }

    alimDisp.forEach(alimento => {
        const linha = document.createElement("label");
        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.value = alimento.id;

        checkbox.addEventListener("change", () => {
            if (checkbox.checked) {
                alimSele.push({
                    ...alimento,
                    quantidade: 100
                });
            } else {
                alimSele = alimSele.filter(
                    item => item.id !== alimento.id
                );
            }

            showSelected();
            calcularTotais();
        });

        linha.append(checkbox, document.createTextNode(` ${alimento.nome}`));
        listaPrato.appendChild(linha);
        listaPrato.appendChild(document.createElement("br"));
    });
}

function showSelected() {
    alimentosPrato.innerHTML = "";

    alimSele.forEach(alimento => {
        const linha = document.createElement("div");
        const nome = document.createElement("span");
        const quantidade = document.createElement("input");

        nome.textContent = `${alimento.nome} — Quantidade (g): `;
        quantidade.type = "number";
        quantidade.min = "0";
        quantidade.step = "1";
        quantidade.value = alimento.quantidade;

        quantidade.addEventListener("input", () => {
            alimento.quantidade = Math.max(0, Number(quantidade.value) || 0);
            calcularTotais();
        });

        linha.append(nome, quantidade);
        alimentosPrato.appendChild(linha);
    });
}

function calcularTotais() {
    let calorias = 0;
    let custo = 0;

    alimSele.forEach(alimento => {
        const qtdKg = alimento.quantidade / 1000;

        calorias += Number(alimento.caloria) * qtdKg;
        custo += Number(alimento.custo) * qtdKg;
    });

    tCalorias.textContent = calorias.toFixed(2);
    tCusto.textContent = custo.toFixed(2).replace(".", ",");
}

carregarPrato();
