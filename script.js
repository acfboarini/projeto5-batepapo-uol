/******* funcoes que renderizam os dados da API ********/

function digitarNome(nome) { // funcao que pega o nome e joga no servidor dos participantes
    let enviarNome = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants",
    {
        name: nome
    });
    enviarNome.catch(erroNome);
}

function erroNome() { // funcao q envia mensagem de erro e pede p digitar o nome novamente
    alert("Esse nome ja esta em uso. Por favor, digite outro");
    digitarNome(prompt("qual seu nome?"));
}

function atualizaStatus() { // funcao que envia request para o servidor dizendo que estou online
    let online = axios.post("https://mock-api.driven.com.br/api/v4/uol/status",
    {
        name: nome
    });
    online.catch(erroStatus);
}

function erroStatus() {
    alert("Voce saiu da sala. Por favor, recarregue a pagina");
    window.location.reload();
}

function enviarMensagem() { // funcao apenas p mostrar o nome no console ao clicar no botao
    let texto_mensagem = document.querySelector("textarea").value;
    if(texto_mensagem !== ""){
        let objeto_mensagem = {
            from: nome,
            to: destinatario(),
            text: texto_mensagem,
            type: tipoMensagem()
        }
        let batepapo = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", objeto_mensagem);
        document.querySelector("textarea").value = "";
        batepapo.then(statusMensagem);
        batepapo.catch(erroMensagem);
    }
}

function statusMensagem() {
    console.log("mensagem enviada");
    carregarMensagens();
}

function erroMensagem() {
    alert("este usuario não esta mais online");
}

function carregarMensagens() {
    let batepapo = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    batepapo.then(renderizarMensagens);
}

function renderizarMensagens(request) {
    console.log("mensagens carregadas");
    let main = document.querySelector("main");
    main.innerHTML = "";
    let mensagens = request.data;
    for(let i = 0; i < mensagens.length; i++){
        if(mensagens[i].type === "status"){
            main.innerHTML += `
            <div class=${mensagens[i].type} data-identifier="message">
            (${mensagens[i].time}) <strong>${mensagens[i].from}</strong> ${mensagens[i].text}
            </div>
            `;
        }else if(mensagens[i].type === "message"){
            main.innerHTML += `
            <div class="${mensagens[i].type}" data-identifier="message">
            (${mensagens[i].time}) <strong>${mensagens[i].from}</strong> para <strong>${mensagens[i].to}</strong>: ${mensagens[i].text}
            </div>
            `;
        }else{
            main.innerHTML += `
            <div class="${mensagens[i].type}" data-identifier="message">
            (${mensagens[i].time}) <strong>${mensagens[i].from}</strong> reservadamente para <strong>${mensagens[i].to}</strong>: ${mensagens[i].text}
            </div>
            `;
        }    
    }
    let ultimoElemento = document.querySelectorAll("main div")[mensagens.length-1];
    ultimoElemento.scrollIntoView();
}

/******* funcoes de cliques ********/

function selecionarContato(div) {
    let selecionado = document.querySelector(".contato-selecionado");
    if(selecionado !== null){
        selecionado.classList.remove("contato-selecionado");
    }
    div.classList.add("contato-selecionado");

    visibilidade();
}

function selecionarVisibilidade(div) {
    let selecionado = document.querySelector(".tipo-selecionado");
    if(selecionado !== null){
        selecionado.classList.remove("tipo-selecionado");
    }
    div.classList.add("tipo-selecionado");

    visibilidade();
}
/****** outras funcoes *******/

function mostraBarraLateral() {
    let corpo = document.querySelector(".corpo");
    corpo.style.backgroundColor = "rgba(0, 0, 0, 0.05);";
    let aside = document.querySelector("aside");
    aside.style.display = "flex";
    carregarContatos();

}

function fechaBarraLateral() {
    let aside = document.querySelector("aside");
    aside.style.display = "none";
}

function visibilidade() {
    let visibilidade = document.querySelector(".tipo-selecionado h1").innerText;
    let paragrafo = document.querySelector("footer section p");

    if(visibilidade !== "Publico"){
        paragrafo.innerHTML = `Enviando para ${destinatario()} (reservadamente)`;
    }else{
        paragrafo.innerHTML = "";
    }
}

function destinatario() {
    let destinatario  = document.querySelector(".contato-selecionado h1").innerText;
    return destinatario;
}

function tipoMensagem() {
    let tipo = document.querySelector(".tipo-selecionado h1").innerText;
    if(tipo == "Publico"){
        return "message";
    }else if(tipo == "Privado"){
        return "private_message";
    }else{
        return "status";
    }
}

function carregarContatos() {
    let participantes = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants");
    participantes.then(contatosOnline);
}

function contatosOnline(resposta) {
    let contatos = document.querySelector("aside .contatos");
    contatos.innerHTML = "";
    contatos.innerHTML = `
        <section class="contato contato-selecionado" onclick="selecionarContato(this)" data-identifier="participant">
            <article>
                <ion-icon name="people"></ion-icon>
                <h1>Todos</h1>
            </article>
            <img src="images/Vector.png"></img>
        </section>
    `;
    renderizarNomes(resposta.data, contatos);
}

function renderizarNomes(nomes, contatos) {
    for(let i = 0; i < nomes.length; i++) {
        if(nomes[i].name !== nome){
            contatos.innerHTML += `
            <section class="contato" onclick="selecionarContato(this)">
                <article>
                    <ion-icon name="person-circle"></ion-icon>
                    <h1>${nomes[i].name}</h1>
                </article>
                <img src="images/Vector.png"></img>
            </section>
            `;
        }
    }
}

/****** variaveis e chamadas *******/
let nome = prompt("digite seu nome");

setInterval(atualizaStatus, 5000);

setInterval(carregarMensagens, 3000);

carregarContatos();

digitarNome(nome);