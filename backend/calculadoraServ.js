
// const funcoes = require("../js/funcoes");
// const produtos = require("../dados/produtos.json");

// const API_URL = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.13522/dados/ultimos/1?formato=json";

// async function calcular(idProduto) {
//     try {
//         // Busca valor da API do Banco Central
//         const anwserAPI = await fetch(API_URL);

//         if (!anwserAPI.ok) {
//             throw new Error("Não foi possível consultar a API.");
//         }

//         const dadosAPI = await anwserAPI.json();

//         if (!dadosAPI.length) {
//             throw new Error("A API não retornou nenhum valor.");
//         }

//         const valorAPI = Number(dadosAPI[0].valor);

//         if (!Number.isFinite(valorAPI) || valorAPI === 0) {
//             throw new Error("O valor recebido da API é inválido.");
//         }

//         // Busca os alimentos cadastrados
//         const produtos = funcoes.readPro();

//         // Localiza o produto pelo ID
//         const produto = produtos.find(
//             item => item.id === idProduto
//         );

//         if (!produto) {
//             throw new Error("Produto não encontrado.");
//         }

//         const precoOriginal = produto.custo;
//         const pesoOriginal = produto.peso;

//         const preco = Number(
//             String(precoOriginal ?? "").trim().replace(",", ".")
//         );

//         const peso = Number(
//             String(pesoOriginal ?? "").trim().replace(",", ".")
//         );

//         if (
//             !Number.isFinite(preco) ||
//             !Number.isFinite(peso)
//         ) {
//             throw new Error("Preço ou peso inválido.");
//         }

//         // Calcula o resultado
//         const resultado = (preco * peso) + (valorAPI**2);

//         // console.log("Produto:", produto.nome);
//         // console.log("Inflação:", valorAPI);
//         // console.log("Preço por kg:", `R$ ${Number(produto.custo).toFixed(2)}`);
//         // console.log("Peso:", peso, "kg");
//         // console.log("Preço Ideal:", `R$ ${Number(resultado).toFixed(2)}`);

//         return resultado;

//     } catch (erro) {
//         console.error("Erro na calculadora:", erro.message);
//     }
// }

// module.exports = calcular;

// calcular("38eb233d-5003-4caf-99c4-ebee3bdeebb9");

const express = require("express");
const crypto = require("crypto");
const funcoes = require("../js/funcoes");

module.exports = function (exigirLogin) {
    const router = express.Router();

    // Pratos da conta conectada
    router.get("/", exigirLogin, (req, res) => {
        const pratos = funcoes.readPlate();

        const myPlates = pratos.filter(
            prato => prato.usuarioId === req.session.usuarioId
        );

        res.status(200).json(myPlates);
    });

    // Add novo prato
    router.post("/", exigirLogin, (req, res) => {
        const { nome, porcoes, lucro, alimentos } = req.body;

        if (
            typeof nome !== "string" ||
            !nome.trim() ||
            !Number.isInteger(Number(porcoes)) ||
            Number(porcoes) < 1 ||
            !Number.isFinite(Number(lucro)) ||
            Number(lucro) <= 0 ||
            !Array.isArray(alimentos) ||
            alimentos.length === 0
        ) {
            return res.status(400).json({
                erro: "Preencha os dados corretamente."
            });
        }

        const pratos = funcoes.readPlate();

        const newPlate = {
            id: crypto.randomUUID(),
            usuarioId: req.session.usuarioId,
            nome: nome.trim(),
            porcoes: Number(porcoes),
            lucro: Number(lucro),
            alimentos: alimentos
        };

        pratos.push(newPlate);
        funcoes.savePlate(pratos);

        res.status(201).json({
            msg: "Prato cadastrado!",
            prato: newPlate
        });
    });

    return router;
}