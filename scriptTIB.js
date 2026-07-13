// Datos reales extraídos de tib.org (líneas de la zona Raiguer-Nord / Ponent)
// Estructura: cada línea tiene un nombre y una lista de ciudades en orden,
// y cada ciudad tiene su propia lista de paradas (en el orden real de paso).
const lines = {
    "301": {
        name: "Port de Pollença - Palma",
        cities: [
            { name: "Port de Pollença", stops: ["Llenaire 1", "Gotmar 1", "Port de Pollença centre", "Gotmar - Las Palmeras 1"] },
            { name: "El Vilar", stops: ["El Vilar 1"] },
            { name: "Pollença", stops: ["Polígon de Pollença 1", "La Font 1", "CEIP Joan Mas", "Pollença 1"] },
            { name: "Crestatx", stops: ["Crestatx 1"] },
            { name: "Sa Pobla", stops: ["Ronda nord 1"] },
            { name: "Inca", stops: ["Inca nord 1", "Sant Joan de Déu 1", "Inca Llevant 1", "Hospital d'Inca 1"] },
            { name: "Palma", stops: ["Aragó-Can Capes 1", "Estació Intermodal"] }
        ]
    },
    "302": {
        name: "Can Picafort - Palma",
        cities: [
            { name: "Can Picafort", stops: ["Son Bauló", "Can Picafort sud 1", "Can Picafort centre 1", "Platja de Can Picafort 1"] },
            { name: "Platja de Muro", stops: ["Casetes des Capellans 1", "Els Pins 1", "S'Albufera 1", "Los Troncos 1", "Ses Fotges 1", "Las Gaviotas 1"] },
            { name: "Platja d'Alcúdia", stops: ["Platja dels Francesos 1", "Estany dels Ponts 1", "Ciutat Blanca 1", "Pla del Pinar 1"] },
            { name: "Port d'Alcúdia", stops: ["Entre-mar-i-estany 1", "Port d'Alcúdia 1"] },
            { name: "Alcúdia", stops: ["Centre històric"] },
            { name: "Sa Pobla", stops: ["Ronda nord 1"] },
            { name: "Inca", stops: ["Inca nord 1", "Sant Joan de Déu 1", "Inca Llevant 1", "Hospital d'Inca 1"] },
            { name: "Palma", stops: ["Aragó-Can Capes 1", "Estació Intermodal"] }
        ]
    },
    "304": {
        name: "Inca - Sencelles - Palma",
        cities: [
            { name: "Inca", stops: ["Estació d'autobusos", "Gran Via de Colom 1", "Inca Llevant 1", "Hospital d'Inca 2"] },
            { name: "Ma-3241", stops: ["Camí de s'Estepar"] },
            { name: "Costitx", stops: ["Costitx 1"] },
            { name: "Ma-3121", stops: ["Camí d'Establiments"] },
            { name: "Sencelles", stops: ["Sencelles 1"] },
            { name: "Biniali", stops: ["Biniali"] },
            { name: "Ma-3020", stops: ["Camps de vinyes 1"] },
            { name: "Ses Alqueries", stops: ["Ses Alqueries 1"] },
            { name: "Santa Eugènia", stops: ["Santa Eugènia 1"] },
            { name: "Ma-3011", stops: ["Natura Parc 1"] },
            { name: "Ses Olleries", stops: ["Ses Olleries 1"] },
            { name: "S'Hostalot", stops: ["S'Hostalot 1"] },
            { name: "Son Ferriol", stops: ["Sa Creu Vermella 1"] },
            { name: "Palma", stops: ["Hospital Son Llàtzer", "Aragó-Can Capes 1", "Estació Intermodal"] }
        ]
    },
    "311": {
        name: "Mancor de la Vall - Inca",
        cities: [
            { name: "Inca", stops: ["Estació d'autobusos"] },
            { name: "Lloseta", stops: ["Lloseta"] },
            { name: "Biniamar", stops: ["Biniamar"] },
            { name: "Mancor de la Vall", stops: ["Mancor de la Vall"] }
        ]
    },
    "312": {
        name: "Lluc - Inca - Muro",
        cities: [
            { name: "Lluc", stops: ["Lluc"] },
            { name: "Es Guix", stops: ["Coll de sa Batalla 1"] },
            { name: "Caimari", stops: ["Caimari 1"] },
            { name: "Selva", stops: ["Camarata 1", "Selva 1"] },
            { name: "Inca", stops: ["Mandrava 1", "Estació d'autobusos", "Inca Llevant 1", "Hospital d'Inca 2"] },
            { name: "Muro", stops: ["Santa Anna"] }
        ]
    },
    "313": {
        name: "Selva - Inca",
        cities: [
            { name: "Inca", stops: ["Estació d'autobusos", "Mandrava 2"] },
            { name: "Selva", stops: ["Selva 2", "Camarata 2"] },
            { name: "Moscari", stops: ["Moscari"] },
            { name: "Caimari", stops: ["Caimari 1"] }
        ]
    },
    "314": {
        name: "Campanet / Búger",
        cities: [
            { name: "Sa Pobla", stops: ["Ronda nord 2"] },
            { name: "Búger", stops: ["Búger"] },
            { name: "Campanet", stops: ["Campanet"] },
            { name: "Inca", stops: ["Hospital d'Inca 2", "Inca Llevant 2", "Gran Via de Colom 2", "Estació d'autobusos"] }
        ]
    }
    // Puedes seguir añadiendo el resto de líneas del documento con el mismo formato
};

let currentLineNumber = "";
let currentLineName = "";
let currentCities = [];
let flatStops = [];   // paradas "aplanadas" en orden, cada una con su ciudad
let currentIndex = 0;
let peopleCount = 1;  // personas seleccionadas para el próximo cobro

function login() {
    const u = document.getElementById("user").value;
    const p = document.getElementById("pass").value;

    if (u === "" || p === "") return alert("Rellena usuario y contraseña");

    document.getElementById("login").classList.add("hidden");
    document.getElementById("linePanel").classList.remove("hidden");
}

// Rellena el desplegable de líneas a partir de las claves de "lines"
function populateLineSelect() {
    const select = document.getElementById("lineSelect");

    Object.keys(lines).forEach((key) => {
        const opt = document.createElement("option");
        opt.value = key;
        opt.innerText = `${key} - ${lines[key].name}`;
        select.appendChild(opt);
    });
}

// Convierte la lista de ciudades (con sus paradas) en una lista plana
// de paradas individuales, cada una recordando a qué ciudad pertenece.
function buildFlatStops(cities) {
    const flat = [];
    cities.forEach((city, cityIndex) => {
        city.stops.forEach((stop) => {
            flat.push({ cityIndex, cityName: city.name, stopName: stop });
        });
    });
    return flat;
}

function loadLine() {
    const line = document.getElementById("lineSelect").value;
    const data = lines[line];

    if (!data) {
        alert("Selecciona una línea primero");
        return;
    }

    currentLineNumber = line;
    currentLineName = data.name;
    currentCities = data.cities;
    flatStops = buildFlatStops(currentCities);
    currentIndex = 0;
    peopleCount = 1;

    document.getElementById("lastCharge").innerText = "";

    document.getElementById("linePanel").classList.add("hidden");
    document.getElementById("routePanel").classList.remove("hidden");

    render();
}

// Vuelve a la pantalla de selección de línea y resetea el estado de la ruta.
// Se puede llamar en cualquier momento (a mitad de ruta o al terminarla).
function backToLineSelection() {
    currentLineNumber = "";
    currentLineName = "";
    currentCities = [];
    flatStops = [];
    currentIndex = 0;
    peopleCount = 1;

    document.getElementById("lineSelect").value = "";
    document.getElementById("routePanel").classList.add("hidden");
    document.getElementById("linePanel").classList.remove("hidden");
}

function render() {
    const actual = flatStops[currentIndex];
    const proxima = flatStops[currentIndex + 1];

    document.getElementById("paradaActual").innerText = actual
        ? `${actual.stopName} (${actual.cityName})`
        : "-";
    document.getElementById("paradaProxima").innerText = proxima
        ? `${proxima.stopName} (${proxima.cityName})`
        : "Fin de línea";

    renderCities();

    const btn = document.getElementById("btnSiguiente");
    if (currentIndex >= flatStops.length - 1) {
        btn.disabled = true;
        btn.innerText = "Fin de ruta";
    } else {
        btn.disabled = false;
        btn.innerText = "Siguiente ▶";
    }
}

// Ahora solo se muestra un botón por CIUDAD (no por parada individual).
// Una ciudad deja de aparecer en cuanto se ha pasado su última parada.
function renderCities() {
    const container = document.getElementById("cities");
    container.innerHTML = "";

    const remaining = flatStops.slice(currentIndex);

    if (remaining.length === 0) {
        container.innerHTML = "<h2>Fin de ruta</h2>";
        return;
    }

    const groups = [];
    remaining.forEach((item) => {
        const lastGroup = groups[groups.length - 1];
        if (lastGroup && lastGroup.cityIndex === item.cityIndex) {
            lastGroup.stops.push(item.stopName);
        } else {
            groups.push({ cityIndex: item.cityIndex, cityName: item.cityName, stops: [item.stopName] });
        }
    });

    groups.forEach((group, gi) => {
        const btn = document.createElement("button");
        btn.className = "cityBtn" + (gi === 0 ? " current" : "");
        btn.innerText = group.cityName;
        btn.onclick = () => chargeTicket(group.cityName);
        container.appendChild(btn);
    });
}

function nextStop() {
    if (currentIndex >= flatStops.length - 1) return;
    currentIndex++;
    render();
}

function incPeople() {
    peopleCount++;
    document.getElementById("peopleCount").innerText = peopleCount;
}

function decPeople() {
    if (peopleCount > 1) peopleCount--;
    document.getElementById("peopleCount").innerText = peopleCount;
}

// Se llama al pulsar una ciudad: "cobra" el billete para el nº de
// personas seleccionado y reinicia el contador a 1 para el siguiente cliente.
function chargeTicket(cityName) {
    const count = peopleCount;
    const label = count === 1 ? "persona" : "personas";

    document.getElementById("lastCharge").innerText =
        `✔ Cobrado: ${count} ${label} → ${cityName}`;

    peopleCount = 1;
    document.getElementById("peopleCount").innerText = peopleCount;
}

populateLineSelect();
