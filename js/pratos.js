const areaChoosen = document.querySelector(".selectAlimento");
const btnCalcul = document.getElementById("calcular");

let aliChoosen = [];

function normalizarNome(nome) {
    return nome
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

// Adicionar alimento à lista de escolhidos
function addAlimento(produto) {
    const jaEscolhido = aliChoosen.some(alimento =>
        normalizarNome(alimento.nome) === normalizarNome(produto.nome)
    );

    if (jaEscolhido) {
        return;
    }

    produto.pesoGramas = 100;

    aliChoosen.push(produto);

    const item = document.createElement("div");
    item.classList.add("ingrediente-escolhido");

    const nome = document.createElement("span");
    nome.textContent = produto.nome;

    const inputPe = document.createElement("input");
    inputPe.type = "number";
    inputPe.min = "0";
    inputPe.step = "10";
    inputPe.value = produto.pesoGramas;
    inputPe.classList.add("input-peso");

    const uni = document.createElement("span");
    uni.textContent = "g";

    const btnMe = document.createElement("button");
    btnMe.textContent = "-";
    btnMe.type = "button";
    btnMe.classList.add("btn-less");

    const btnMa = document.createElement("button");
    btnMa.textContent = "+";
    btnMa.type = "button";
    btnMa.classList.add("btn-more");

    inputPe.addEventListener("input", () => {
        produto.pesoGramas = Number(inputPe.value);
    });

    btnMa.addEventListener("click", () => {
        produto.pesoGramas += 1;
        inputPe.value = produto.pesoGramas;
    });

    btnMe.addEventListener("click", () => {
        produto.pesoGramas = Math.max(
            0,
            produto.pesoGramas - 1
        );

        inputPe.value = produto.pesoGramas;
    });
    
    item.appendChild(nome);
    item.appendChild(btnMe);
    item.appendChild(inputPe);
    item.appendChild(uni);
    item.appendChild(btnMa);

    areaChoosen.appendChild(item);
}

function aChoosed(produto) {
    return aliChoosen.some(alimento => 
        normalizarNome(alimento.nome) === normalizarNome(produto.nome)
    );
}

btnCalcul.addEventListener("click", async () => {
    const nome = document.getElementById("nomePrato").value.trim();
    const porcoes = Number(document.getElementById("porcoes").value);
    const lucro = Number(document.getElementById("lucro").value);

    if (!nome) {
        alert("Digite o nome do prato.");
        return;
    }

    if (aliChoosen.length === 0) {
        alert("Adicione ao menos um alimento.");
        return;
    }

    if (porcoes < 1 || !Number.isInteger(porcoes)) {
        alert("Ao menos 1 porção inteira.");
        return;
    }

    if (lucro <= 0 || !Number.isFinite(lucro) ) {
        alert("Informe valores válidos.");
        return;
    }
    const custTotal = calcCusto(aliChoosen);
    calcLucro(custTotal, lucro);

    const prato = {
        nome: nome,
        porcoes: porcoes,
        lucro: lucro,
        alimentos: aliChoosen
    };

    try {
        const answer = await fetch("/api/pratos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(prato)
        });

        const dados = await answer.json();

        if (!answer.ok) {
            throw new Error(dados.erro || "Erro ao salvar o prato.");
        }

        alert("Prato cadastrado com sucesso!");

    } catch (erro) {
       console.error("Erro ao salvar prato:", erro);
       alert(erro.message);
    }
});