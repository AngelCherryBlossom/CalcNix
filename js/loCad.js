document.getElementById("cadastro").addEventListener("click", async () => {
    const nome = document.getElementById("cadNome").value.trim();
    const email = document.getElementById("cadEmail").value.trim();
    const senha = document.getElementById("cadSenha").value;
    
    if (!nome || !email || !senha) {
        alert("Preencha todos os campos.");
        return;
    }

    try {
        const resposta = await fetch("/cadastro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nome, email, senha })
        });

        const resultado = await resposta.json();

        if (resposta.ok) {
            alert("Cadastro realizado com sucesso!");

            document.getElementById("cadNome").value = "";
            document.getElementById("cadEmail").value = "";
            document.getElementById("cadSenha").value = "";
    
        } else {
            alert(resultado.msg || resultado.erro || resultado.error || 
                "Falha ao Cadastrar");
        }

    
    } catch (erro) {
        console.error("Errroou", erro);
        alert("Erro ao conectar com o servidor.");
    }
});

document.getElementById("enter").addEventListener("click", async () => {
    const email = document.getElementById("loginEmail").value.trim();
    const senha = document.getElementById("loginSenha").value;

    if (!email || !senha) {
        alert("Preencha o e-mail e a senha.");
        return;
    }

    try {
        const resposta = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, senha })
        });

        const resultado = await resposta.json();

        if (resposta.ok) {
            window.location.href = "/calcnix.html";
        } else {
            alert(
                resultado.msg ||
                resultado.erro ||
                resultado.error ||
                "Email ou senha incorretos."
            );
        }
    } catch (erro) {
        console.error("Erro no login:", erro);
        alert("Não foi possível conectar ao servidor CalcNix.");
    }
});