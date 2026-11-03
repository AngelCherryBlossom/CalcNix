function calcCusto(alimentos) {
    let custoT = 0;

    alimentos.forEach(alimento => {
        const custoKg = Number(alimento.custo);
        const pesoG = Number(alimento.pesoGramas);

        const custoAli = (custoKg * pesoG) / 1000;

        custoT += custoAli;

        console.log(`${alimento.nome}: R$ ${custoAli.toFixed(2)}`);
    });

    console.log(`Custo total: R$ ${custoT.toFixed(2)}`);

    return custoT;
}

function calcLucro(custoT, margem,) {
    const lucroT = custoT * (margem/100);

    console.log(`Lucro do prato: R$ ${lucroT.toFixed(2)}`);

    const vFinal = custoT + lucroT;
    console.log(`Valor do prato: R$ ${vFinal.toFixed(2)}`);

    return lucroT;
}