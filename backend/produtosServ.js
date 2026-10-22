const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const funcoes = require("../js/funcoes");

module.exports = function (exigirLogin) {
    const router = express.Router();

    const pathProduct = path.join(__dirname, "..", "dados", "produtos.json");

    router.get("/", exigirLogin, (req, res) => {
        const prod = funcoes.readPro();

        const myPro = prod.filter(
            prod => prod.usuarioId === req.session.usuario.id
        );

        res.status(200).json(myPro);
    });

    router.post("/", exigirLogin, (req, res) => {
        const { nome, peso, custo, caloria, image } = req.body;

        if (
            typeof nome !== "string" || !nome.trim() ||
            typeof peso !== "string" ||
            !peso.trim() ||
            custo === "" ||
            custo === null ||
            custo === undefined ||
            !Number.isFinite(Number(custo)) ||
            Number(custo) < 0 || 
            caloria === "" ||
            caloria === null ||
            caloria === undefined ||
            !Number.isFinite(Number(caloria)) ||
            Number(caloria) < 0
        ) {
            return res.status(400).json({
                erro: "Preencha todos os campos."
            });
        }

        const produtos = funcoes.readPro();

        const newProd = {
            id: crypto.randomUUID(),
            usuarioId: req.session.usuario.id,
            nome: nome.trim(),
            peso: peso.trim(),
            custo: Number(custo),
            caloria: Number(caloria),
            image: image || ""
        };

        produtos.push(newProd);
        funcoes.savePro(produtos);

        res.status(201).json({
            msg: "Produto cadastrado!",
            produto: newProd
        });
    });

    return router;
};
