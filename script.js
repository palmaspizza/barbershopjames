// --- Inicialización de Firebase (asegúrate de que tus credenciales estén aquí) ---
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_AUTH_DOMAIN",
    databaseURL: "TU_DATABASE_URL",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_STORAGE_BUCKET",
    messagingSenderId: "TU_MESSAGING_SENDER_ID",
    appId: "TU_APP_ID"
};

// --- Asegúrate de que Firebase se haya inicializado solo una vez ---
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
// Ejemplo de cómo podrías desactivar el modo

document.getElementById("botonDesactivarGestionHorarios").onclick = () => {

    modoGestionHorarios = false;

    alert("Modo de gestión de horarios desactivado.");

};
// Ejemplo de cómo podrías activar el modo

document.getElementById("botonActivarGestionHorarios").onclick = () => {

    modoBloqueoDias = false;

    modoGestionHorarios = true;

    alert("Modo de gestión de horarios activado. Haz clic en un día para configurar.");

};


// --- Declaración de variables y referencias a Firebase ---
const reservasRef = firebase.database().ref("reservas");
const diasBloqueadosRef = firebase.database().ref("diasBloqueados");
const estadoRef = firebase.database().ref("estado");
const mensajeRef = firebase.database().ref("mensajeCierre");
const horariosRef = firebase.database().ref("horarios"); // Nueva referencia

// Variables para el calendario y la lógica
const fechaActualCalendario = new Date();
let reservasPorDia = {};
let diasBloqueados = [];
let modoBloqueoDias = false;
let modoGestionHorarios = false; // Variable clave para activar el nuevo modo
const bloquesHorarios = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];
const mesesTexto = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
let fechaSeleccionadaParaConfigurar = null;

// --- Referencias a elementos del DOM ---
const cuadroCalendario = document.getElementById("cuadroCalendario");
const tituloMes = document.getElementById("titulo-mes");
const botonAnterior = document.getElementById("mesAnterior");
const botonSiguiente = document.getElementById("mesSiguiente");
const fechaInput = document.getElementById("fecha");
const botonActivarBloqueo = document.getElementById("activarBloqueoDias");
const botonDesactivarBloqueo = document.getElementById("desactivarBloqueoDias");
const logoCerrado = document.getElementById("logo-cerrado");
const listaReservas = document.getElementById("reservas-lista");
const ventanaHorarios = document.getElementById("modal-horarios");
const cerrarVentana = document.getElementById("cerrarVentana");
const horariosDisponibles = document.getElementById("horariosDisponibles");
const tituloVentana = document.getElementById("tituloVentana");
const modalConfiguracionHorarios = document.getElementById("modal-configuracion-horarios"); // Nueva referencia

// --- Funciones del calendario y reservas ---

reservasRef.on("value", snapshot => {
    reservasPorDia = {};
    snapshot.forEach(child => {
        const { fecha, hora, nombre } = child.val();
        if (!reservasPorDia[fecha]) reservasPorDia[fecha] = [];
        reservasPorDia[fecha].push({ hora, key: child.key, nombre });
    });
    actualizarBarraMes();
});

diasBloqueadosRef.on("value", snapshot => {
    diasBloqueados = [];
    snapshot.forEach(child => {
        diasBloqueados.push(child.val().fecha);
    });
    actualizarBarraMes();
});

function generarCuadroCalendario() {
    const mesStr = `${fechaActualCalendario.getFullYear()}-${String(fechaActualCalendario.getMonth() + 1).padStart(2, "0")}`;
    cuadroCalendario.innerHTML = "";
    const [anio, mes] = mesStr.split("-");
    const fechaInicio = new Date(anio, mes - 1, 1);
    const primerDiaSemana = fechaInicio.getDay();
    const totalDias = new Date(anio, mes, 0).getDate();
    const offset = primerDiaSemana === 0 ? 6 : primerDiaSemana - 1;

    for (let i = 0; i < offset; i++) {
        const vacio = document.createElement("div");
        cuadroCalendario.appendChild(vacio);
    }

    for (let dia = 1; dia <= totalDias; dia++) {
        const fechaActual = `${anio}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
        const celda = document.createElement("div");
        celda.classList.add("diaCalendario");
        celda.textContent = dia;

        const horasReservadas = reservasPorDia[fechaActual] || [];
        const estaBloqueado = diasBloqueados.includes(fechaActual);
        const estaOcupado = horasReservadas.length >= bloquesHorarios.length;

        if (estaBloqueado) {
            celda.classList.add("diaBloqueado");
            celda.title = "Día bloqueado por el administrador";
        } else if (estaOcupado) {
            celda.classList.add("diaOcupado");
            celda.title = "Día con todas las horas reservadas";
        } else {
            celda.classList.add("diaLibre");
            celda.title = "Día disponible";
        }

        celda.onclick = () => {
            if (modoBloqueoDias) {
                if (estaBloqueado) {
                    diasBloqueadosRef.once("value", snapshot => {
                        snapshot.forEach(child => {
                            if (child.val().fecha === fechaActual) {
                                child.ref.remove();
                            }
                        });
                    });
                } else {
                    diasBloqueadosRef.push({ fecha: fechaActual });
                }
            } else if (modoGestionHorarios) {
                // Aquí se llama a la función para abrir el modal de configuración
                abrirModalConfiguracionHorarios(fechaActual);
            } else {
                if (!estaBloqueado) {
                    fechaInput.value = fechaActual;
                    abrirVentanaHorarios(fechaActual);
                }
            }
        };

        if (!modoBloqueoDias && estaBloqueado) {
            celda.style.pointerEvents = "none";
        }

        cuadroCalendario.appendChild(celda);
    }
}
function abrirModalConfiguracionHorarios(fecha) {
    fechaSeleccionadaParaConfigurar = fecha;
    tituloVentana.textContent = `Configurar Horarios para ${fecha}`;
    horariosDisponibles.innerHTML = "";

    bloquesHorarios.forEach(hora => {
        const botonHora = document.createElement("button");
        botonHora.textContent = hora;
        botonHora.classList.add("hora-boton");
        botonHora.classList.add("hora-inactiva");
        
        botonHora.onclick = () => {
            botonHora.classList.toggle("hora-activa");
            botonHora.classList.toggle("hora-inactiva");
        };

        horariosDisponibles.appendChild(botonHora);
    });

    modalConfiguracionHorarios.style.display = "block";
}
function actualizarBarraMes() {
    const mes = fechaActualCalendario.getMonth();
    const año = fechaActualCalendario.getFullYear();
    tituloMes.textContent = `${mesesTexto[mes]} ${año}`;
    generarCuadroCalendario();
}

botonAnterior.onclick = () => {
    fechaActualCalendario.setMonth(fechaActualCalendario.getMonth() - 1);
    actualizarBarraMes();
};

botonSiguiente.onclick = () => {
    fechaActualCalendario.setMonth(fechaActualCalendario.getMonth() + 1);
    actualizarBarraMes();
};

fechaInput.addEventListener("change", () => {
    const fechaElegida = new Date(fechaInput.value);
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    const fechaFormateada = fechaElegida.toLocaleDateString('es-CL', opciones);
    document.getElementById("boton").innerHTML = `📅 ${fechaFormateada}`;
    document.getElementById("botonCambiar").classList.remove("oculto");
});

// --- Funciones del administrador ---

function ingresarllave() {
    document.getElementById("clave-input").value = '';
}

function validarClave() {
    const claveInput = document.getElementById("clave-input");
    if (claveInput.value === "1234") {
        document.getElementById("modal-acceso").classList.add("fantasma");
        document.getElementById("modal-control").classList.remove("fantasma");
        claveInput.value = "";
    } else {
        alert("Clave incorrecta");
    }
}

function cerrarBarberia() {
    estadoRef.set("cerrado");
    document.getElementById("modal-control").classList.add("fantasma");
}

function abrirBarberia() {
    estadoRef.set("abierto");
    document.getElementById("modal-control").classList.add("fantasma");
}

estadoRef.on("value", snapshot => {
    const estado = snapshot.val();
    if (estado === "cerrado") {
        document.getElementById("modal-cerrado").style.display = "flex";
    } else {
        document.getElementById("modal-cerrado").style.display = "none";
    }
});
