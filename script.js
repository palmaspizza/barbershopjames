// Inicializar Firebase
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "barbershop-4b936.firebaseapp.com",
  databaseURL: "https://barbershop-4b936-default-rtdb.firebaseio.com",
  projectId: "barbershop-4b936",
  storageBucket: "barbershop-4b936.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const reservasRef = db.ref("reservas");

const fechaInput = document.getElementById("fecha");
const horaInput = document.getElementById("hora");
const listaReservas = document.getElementById("reservas-lista");

// Mostrar calendario al hacer clic
function abrirCalendario() {
  fechaInput.showPicker?.() || fechaInput.click();
}


let temporizadorPresion;
const logoCerrado = document.getElementById("logo-cerrado");

iniciarPresionLenta(logoCerrado, () => {
  document.getElementById("modal-acceso").classList.remove("fantasma");
});

function iniciarPresionLenta(objeto, accion, milisegundos = 5000) {
  if (!objeto) return;

  objeto.addEventListener("mousedown", () => {
    temporizadorPresion = setTimeout(accion, milisegundos);
  });

  objeto.addEventListener("mouseup", () => clearTimeout(temporizadorPresion));
  objeto.addEventListener("mouseleave", () => clearTimeout(temporizadorPresion));

  objeto.addEventListener("touchstart", () => {
    temporizadorPresion = setTimeout(accion, milisegundos);
  });

  objeto.addEventListener("touchend", () => clearTimeout(temporizadorPresion));
}

const idBloque = `${fecha}-${hora}`;

reservasRef.on("child_removed", (snapshot) => {
  const { fecha, hora } = snapshot.val();
  const idBloque = `${fecha}-${hora}`;
  console.log("Eliminando visualmente:", idBloque);
  const div = document.getElementById(idBloque);
  if (div) div.remove();
});

// Reservar hora
function reservarHora() {
  const fecha = fechaInput.value;
  const hora = horaInput.value;

  if (!fecha || !hora) {
    alert("Selecciona fecha y hora");
    return;
  }

  const idBloque = `${fecha}-${hora}`;

  // Verificar si ya está ocupada
  reservasRef.once("value", snapshot => {
    let ocupada = false;
    snapshot.forEach(child => {
      const r = child.val();
      if (`${r.fecha}-${r.hora}` === idBloque) {
        ocupada = true;
      }
    });

    if (ocupada) {
      document.getElementById("modal-ocupado").classList.remove("hidden");
    } else {
      reservasRef.push({ fecha, hora });
      document.getElementById("modal-reservada").classList.remove("hidden");
    }
  });
}

// Cerrar modales
function cerrarModal(id) {
  document.getElementById(id).classList.add("hidden");
}


function validarClave() {
  const claveInput = document.getElementById("clave-input");
  const clave = claveInput.value;

  if (clave === "1234") {
    document.getElementById("modal-acceso").classList.add("fantasma");
    document.getElementById("modal-control").classList.remove("fantasma");
    claveInput.value = ""; // limpia el campo
  } else {
    alert("Clave incorrecta");
  }
}


// 🟠 Cerrar barbería
function cerrarBarberia() {
  estadoRef.set("cerrado");
  modalControl.classList.add("fantasma");
}

// ✅ Referencia única
const estadoRef = firebase.database().ref("estadoBarberia");

// ✅ Elemento del modal
const modalControl = document.getElementById("modal-control");

// ✅ Función única y funcional
function abrirBarberia() {
  estadoRef.set("abierto");
  modalControl.classList.add("fantasma");
}



// ✅ Asegúrate de que esta línea esté antes del listener
const modalCerrado = document.getElementById("modal-cerrado");

estadoRef.on("value", snapshot => {
  const estado = snapshot.val();
  console.log("Estado actualizado:", estado);

  if (estado === "cerrado") {
    modalCerrado.style.display = "flex"; // ✅ mostrar pantalla negra
  } else {
    modalCerrado.style.display = "none"; // ✅ ocultar pantalla negra
  }
});




// ❌ Cerrar cualquier modal
function cerrarModal(id) {
  document.getElementById(id).classList.add("fantasma");
}

const logo = document.getElementById("logo");
let presionarTimer;

logo.addEventListener("mousedown", () => {
  presionarTimer = setTimeout(() => {
    document.getElementById("modal-acceso").classList.remove("fantasma");
  }, 5000);
});

function activarPresionProlongada(elemento, accion, tiempo = 5000) {
  elemento.addEventListener("mousedown", () => {
    presionarTimer = setTimeout(accion, tiempo);
  });
  elemento.addEventListener("mouseup", () => clearTimeout(presionarTimer));
  elemento.addEventListener("mouseleave", () => clearTimeout(presionarTimer));
  elemento.addEventListener("touchstart", () => {
    presionarTimer = setTimeout(accion, tiempo);
  });
  elemento.addEventListener("touchend", () => clearTimeout(presionarTimer));
}


logo.addEventListener("mouseup", () => clearTimeout(presionarTimer));
logo.addEventListener("mouseleave", () => clearTimeout(presionarTimer));

// Para móviles
logo.addEventListener("touchstart", () => {
  presionarTimer = setTimeout(() => {
    document.getElementById("modal-acceso").classList.remove("fantasma");
  }, 5000);
});

logo.addEventListener("touchend", () => clearTimeout(presionarTimer));



const reservasRefMostrar = firebase.database().ref("reservas");

reservasRefMostrar.on("child_added", (snapshot) => {
  const { fecha, hora } = snapshot.val();
  const idBloque = `${fecha}-${hora}`;

  if (document.getElementById(idBloque)) return;

  const div = document.createElement("div");
  div.className = "reserva-item";
  div.id = idBloque;

  const texto = document.createElement("span");
  texto.textContent = `📅 ${fecha} ⏰ ${hora}`;

  const botonX = document.createElement("span");
  botonX.textContent = " | ❌";
  botonX.className = "boton-x";
  botonX.title = "Eliminar esta hora";
  botonX.onclick = () => {
    snapshot.ref.remove();
    ocultarBotonesX(); // 🔥 elimina en Firebase → todos los usuarios lo ven
  };

  div.appendChild(texto);
  div.appendChild(botonX);
  document.getElementById("reservas-lista").appendChild(div);
});

reservasRef.on("child_removed", (snapshot) => {
  const { fecha, hora } = snapshot.val();
  const idBloque = `${fecha}-${hora}`;
  const div = document.getElementById(idBloque);
  if (div) div.remove(); // 🔄 se borra en pantalla para todos
});

// Referencias únicas
const reservasRefSemana = firebase.database().ref("reservas");
const reservasRefMes = firebase.database().ref("reservas");
const mensajeRef = firebase.database().ref("mensajeCierre");


function mostrarBotonesX() {
  document.querySelectorAll(".boton-x").forEach(b => {
    b.style.display = "inline";
  });
}

function ocultarBotonesX() {
  document.querySelectorAll(".boton-x").forEach(b => {
    b.style.display = "none";
  });
}



// Mostrar modal para dejar mensaje antes de cerrar
function mostrarModalMensaje() {
  document.getElementById("modal-control").classList.add("fantasma");
  document.getElementById("modal-mensaje").classList.remove("fantasma");
}

// Guardar mensaje y cerrar barbería
function guardarMensajeCierre() {
  const mensaje = document.getElementById("mensaje-cierre").value;
  mensajeRef.set(mensaje);
  estadoRef.set("cerrado");
  document.getElementById("modal-mensaje").classList.add("fantasma");
}

// Mostrar mensaje en pantalla cerrada
mensajeRef.on("value", snapshot => {
  const mensaje = snapshot.val();
  document.getElementById("mensaje-cerrado").textContent = mensaje || "";
});
function borrarHorasSemana() {
  const hoy = new Date();
  const inicioSemana = new Date(hoy);
  inicioSemana.setDate(hoy.getDate() - hoy.getDay());
  const finSemana = new Date(inicioSemana);
  finSemana.setDate(inicioSemana.getDate() + 6);

  const formato = fecha => fecha.toISOString().split("T")[0];
  const inicioStr = formato(inicioSemana);
  const finStr = formato(finSemana);

  reservasRef.once("value", snapshot => {
    snapshot.forEach(child => {
      const { fecha } = child.val();
      if (fecha >= inicioStr && fecha <= finStr) {
        reservasRef.child(child.key).remove(); // ✅ dispara child_removed
      }
    });
  });

  modalControl.classList.add("fantasma");
}

// Borrar horas del mes actual
function borrarHorasMes() {
  const hoy = new Date();
  const mesActual = hoy.getMonth();
  const añoActual = hoy.getFullYear();

  reservasRef.once("value", snapshot => {
    snapshot.forEach(child => {
      const { fecha } = child.val();
      const [año, mes] = fecha.split("-").map(Number);
      if (año === añoActual && mes === mesActual + 1) {
        reservasRef.child(child.key).remove();
      }
    });
  });

  modalControl.classList.add("fantasma");
}



const fechaReserva = new Date(fecha);


function borrarHorasMesHastaHoy() {
  const hoy = new Date();
  const diaActual = hoy.getDate();
  const mesActual = hoy.getMonth() + 1;
  const añoActual = hoy.getFullYear();

  reservasRef.once("value", snapshot => {
    snapshot.forEach(child => {
      const { fecha } = child.val();
      const [año, mes, dia] = fecha.split("-").map(Number);

      if (año === añoActual && mes === mesActual && dia < diaActual) {
        reservasRef.child(child.key).remove();
      }
    });
  });

  modalControl.classList.add("fantasma");
}

function miFuncion() {
  const valor = document.getElementById("nombre").value;
  console.log("Escribiendo:", valor);
  // Aquí puedes hacer lo que quieras con el valor
  document.getElementById("reservar-button").style.display = 'block';
}



const imagen = document.getElementById("logo");
let presionando = false;
let temporizador;

imagen.addEventListener("touchstart", () => {
  presionando = true;
  temporizador = setTimeout(() => {
    if (presionando) {
      abrirModalAcceso(); // tu función secreta
    }
  }, 5000);
});

imagen.addEventListener("touchend", () => {
  presionando = false;
  clearTimeout(temporizador);
});
