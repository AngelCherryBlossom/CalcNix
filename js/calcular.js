async function calcCusto(alimentos) {
    await inflaCarre;

    let custoVar = 0;

    alimentos.forEach(alimento => {
        const custoOr = Number(alimento.custo);
        const custoKg = percentInfla !== null
            ? simReajuste(custoOr, percentInfla)
            : custoOr;
        const pesoG = Number(alimento.pesoGramas);

        const custoAli = (custoKg * pesoG) / 1000;

        custoVar += custoAli;

        console.log(`${alimento.nome}: R$ ${custoAli.toFixed(2)}`);
        console.log(`Custo Kg: R$ ${custoOr.toFixed(2)}`);

    });

    return custoVar;
}


function calcLucro(custoVar, custoFixo, margem) {
    const lucro = custoVar * (margem/100);
    const valorPra = custoVar + lucro

    console.log(`Custo fixo: R$ ${custoFixo.toFixed(2)}`);
    console.log(`Custo variável Prato: R$ ${custoVar.toFixed(2)}`);
    console.log(`Valor do prato: R$ ${valorPra.toFixed(2)}`);
    console.log(`Lucro do prato: R$ ${lucro.toFixed(2)}`);

    return {
        custoVar,
        custoFixo,
        valorPra,
        lucro
    };
}

function pontoEquilibrio(cFixo, cVar, vPrato) {
    const margemCont = vPrato - cVar;

    if (margemCont <=0) {
        alert("Valor de venda precisa ser maior que o custo variável.")
        return null;
    }

    const pEqui = cFixo / margemCont;

    return Math.ceil(pEqui);
}

// async function findProdCad() {
//     const resposta = await fetch("/api/produtos", {
//         credentials: "include"
//     });

//     if (!resposta.ok) {
//         throw new Error("Não foi possível encontrar os produtos.");
        
//     }

//     return await resposta.json();
// }

// async function findProdSelect(prodSelected) {
//     const prodCad = await findProdCad();
    
//     const ali = prodCad.filter(produto =>
//         prodSelected.some(alimento =>
//             alimento.id === produto.id
//         )
//     );

//     console.log("Alimentos selecionados:", ali);

//     return ali;
// }