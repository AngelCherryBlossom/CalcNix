const areaCh = document.querySelector(".selectPrato");
const bCriar = document.getElementById("criarCardapio");
// const pnnCardapios = document.getElementById("pannelCardapio");

let pratChoosen = [];

function normalTexto(text) {
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
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
                nome
                // preIdeal
            })
        });

        const dadosCard = await anwser.json();

        if (!anwser.ok) {
            alert(dadosCard.erro || "Não foi possível criar o cardápio");
            return;
        }

        alert("Cardápio criado com sucesso!");

    } catch (erro) {
        console.error("Erro ao criar cardápio:", erro);
        alert(erro.message);
    }
});


// function exibeCard(cardapios) {
//     pnnCardapios.querySelectorAll(".card-item").forEach(item => {
//         item.remove();
//     });

//     const modelCard = document.getElementById("modelCardapio");

//     if (!modelCard) {
//         console.error("Template não encontrado.");
//         return;
//     }

//     cardapios.forEach(cardapio => {
//         const copiaCard = modelCard.content.cloneNode(true);

//         copiaCard.querySelector(".cardapio-nome").textContent = cardapio.nome;

//         pnnCardapios.appendChild(copiaCard);
//     });
// }

// async function carregarCardapios() {
//     try {
//         const anwser = await fetch("/api/cardapios", {
//             credentials: "include"
//         });

//         if (!anwser.ok) {
//             throw new Error("Não foi possível carregar os cardápios.");
//         }

//         const cardapios = await anwser.json();
//         exibeCard(cardapios);
//     } catch (erro) {
//         console.error("Erro ao carregar cardápios:", erro);
//     }
// }

// carregarCardapios();