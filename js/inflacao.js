let percentInfla = null;

async function carregarInfla() {
    const vInflacao = document.getElementById("vInfla");
    const dInflacao = document.getElementById("dataInfla");

    try {
        const resposta = await fetch("/api/pratos/inpc", {
            credentials: "include"
        });

        if (!resposta.ok) {
            throw new Error("Erro ao consultar inflação.");
        }

        const dados = await resposta.json();

        percentInfla = Number(dados.valor);

        vInflacao.textContent = `${dados.valor.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}%`;

        dInflacao.textContent = dados.data;

    } catch (erro) {
        console.error("Erro ao carregar API:", erro);

        vInflacao.textContent = "Indisponível";
        dInflacao.textContent = "";
    }
}

const inflaCarre = carregarInfla();

function simReajuste(custoA, infla) {
    const custo = Number(custoA);
    const percent = Number(infla);

    if (!Number.isFinite(custo) ||
        !Number.isFinite(percent) ||
        custo < 0
    ) {
        return null;
    }

    const custoEst = custo * (1 + (percent / 100));

    return Number(custoEst.toFixed(2));
}