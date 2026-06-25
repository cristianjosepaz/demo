const chat = document.getElementById("chat");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

let mode = "official";

let waitingAlternativeTurn = false;
let waitingAlternativeSurvey = false;

document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {


        document.querySelectorAll(".tab").forEach(t => {
            t.classList.remove("active");
        });

        tab.classList.add("active");

        mode = tab.dataset.mode;

        waitingAlternativeTurn = false;
        waitingAlternativeSurvey = false;

        clearChat();

        if (mode === "official") {
            botMessage("Demo API Oficial activa.");
        } else {
            botMessage("Demo API Alternativa activa.");
        }
    });


});

sendBtn.addEventListener("click", processMessage);

input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        processMessage();
    }
});

function processMessage() {


    const text = input.value.trim();

    if (!text) return;

    userMessage(text);

    input.value = "";

    handleBot(text);


}

function userMessage(text) {


    const div = document.createElement("div");

    div.className = "message user";

    div.innerHTML =
        '<div class="bubble">' +
        text +
        '</div>';

    chat.appendChild(div);

    scrollBottom();


}

function botMessage(text) {


    const div = document.createElement("div");

    div.className = "message bot";

    div.innerHTML =
        '<div class="bubble">' +
        text +
        '</div>';

    chat.appendChild(div);

    scrollBottom();

    return div;


}

function handleBot(message) {


    const msg = message.toLowerCase().trim();

    if (msg === "1" || msg === "2" || msg === "3") {

        let tipoTurno = "";

        if (msg === "1") tipoTurno = "consulta";
        if (msg === "2") tipoTurno = "vacunación";
        if (msg === "3") tipoTurno = "control";

        waitingAlternativeTurn = false;
        waitingAlternativeSurvey = true;

        botMessage(
            "✅ Su turno para " +
            tipoTurno +
            " se ha reservado correctamente."
        );

        botMessage(
            "¿La atención ha sido satisfactoria?<br><br>" +
            "👍 Escriba SI<br>" +
            "👎 Escriba NO"
        );

        return;
    }

    if (mode === "alternative" && waitingAlternativeSurvey) {

        debugger;
        if (msg === "si") {

            waitingAlternativeSurvey = false;

            botMessage(
                "Gracias por su respuesta."
            );

            return;
        }

        if (msg === "no") {

            waitingAlternativeSurvey = false;

            botMessage(
                "Gracias, tendremos en cuenta sus comentarios."
            );

            return;
        }

        botMessage(
            "❌ Debe responder SI o NO."
        );

        return;
    }

    if (msg.includes("hola")) {

        botMessage(
            "Hola bienvenido a nuestra veterinaria, soy VetBot ¿en qué puedo ayudarle?"
        );

        return;
    }

    if (
        msg.includes("atencion") ||
        msg.includes("atendiendo")
    ) {

        botMessage(
            "El horario de atención es de 7:00hs a 13:00hs de Lunes a Viernes."
        );

        return;
    }

    if (msg.includes("turno")) {

        if (mode === "official") {
            showOfficialMenu();
        } else {
            showAlternativeMenu();
        }

        return;
    }

    botMessage(
        "No entendí tu consulta."
    );


}

function showOfficialMenu() {


    const wrapper = botMessage(
        "Seleccione el tipo de turno:"
    );

    const options = document.createElement("div");

    options.className = "option-container";

    const turnos = [
        "Turno Consulta",
        "Turno Vacunación",
        "Turno Control"
    ];

    turnos.forEach(function (turno) {

        const btn = document.createElement("button");

        btn.className = "option-btn";
        btn.textContent = turno;

        btn.onclick = function () {
            reserveOfficialTurn(turno);
        };

        options.appendChild(btn);
    });

    wrapper.querySelector(".bubble").appendChild(options);


}

function reserveOfficialTurn(turno) {

    userMessage(turno);

    let descripcion = "";

    if (turno === "Turno Consulta") {
        descripcion = "consulta";
    }

    if (turno === "Turno Vacunación") {
        descripcion = "vacunación";
    }

    if (turno === "Turno Control") {
        descripcion = "control";
    }

    botMessage(
        "✅ Su turno para " + descripcion + " se ha reservado correctamente."
    );

    showOfficialSurvey();
}

function showOfficialSurvey() {


    const wrapper = botMessage(
        "¿La atención ha sido satisfactoria?"
    );

    const options = document.createElement("div");

    options.className = "option-container";

    ["SI", "NO"].forEach(function (answer) {

        const btn = document.createElement("button");

        btn.className = "option-btn";
        btn.textContent = answer;

        btn.onclick = function () {

            userMessage(answer);

            if (answer === "SI") {
                botMessage(
                    "Gracias por su respuesta."
                );
            } else {
                botMessage(
                    "Gracias, tendremos en cuenta sus comentarios."
                );
            }
        };

        options.appendChild(btn);
    });

    wrapper.querySelector(".bubble").appendChild(options);


}

function showAlternativeMenu() {


    waitingAlternativeTurn = true;

    botMessage(
        "📅 Seleccione un tipo de turno<br><br>" +
        "1️⃣ Consulta<br>" +
        "2️⃣ Vacunación<br>" +
        "3️⃣ Control<br><br>" +
        "Escriba 1, 2 o 3"
    );


}

function clearChat() {
    chat.innerHTML = "";
}

function scrollBottom() {
    chat.scrollTop = chat.scrollHeight;
}

botMessage(
    "Escriba 'Hola', 'Atención' o 'Turno'."
);
