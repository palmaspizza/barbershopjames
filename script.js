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
const listaReservas = document.getElementById("reservas-lista");
const cuadroCalendario = document.getElementById("cuadroCalendario");
const ventanaHorarios = document.getElementById("ventanaHorarios");
const cerrarVentana = document.getElementById("cerrarVentana");
const tituloVentana = document.getElementById("tituloVentana");
const horariosDisponibles = document.getElementById("horariosDisponibles");
const selectorMesTexto = document.getElementById("selectorMesTexto");
const tituloMes = document.getElementById("tituloMes");
const botonAnterior = document.getElementById("mesAnterior");
const botonSiguiente = document.getElementById("mesSiguiente");
const botonActivarBloqueo = document.getElementById("activarBloqueoDias");
const botonDesactivarBloqueo = document.getElementById("desactivarBloqueoDias");

let modoBloqueoDias = false;
let diasBloqueados = [];
let reservasPorDia = {};
let fechaActualCalendario = new Date();

const bloquesHorarios = [
  "09:00", "10:00", "11:00", "12:00",
  "14:00", "15:00", "16:00", "17:00"
];

const mesesTexto = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const estadoRef = firebase.database().ref("estadoBarberia");
const mensajeRef = firebase.database().ref("mensajeCierre");
const diasBloqueadosRef = firebase.database().ref("diasBloqueados");

// Escuchar reservas en tiempo real
reservasRef.on("value", snapshot => {
  reservasPorDia = {};
  snapshot.forEach(child => {
    const { fecha, hora } = child.val();
    if (!reservasPorDia[fecha]) reservasPorDia[fecha] = [];
    reservasPorDia[fecha].push(hora);
  });
  actualizarBarraMes();
});

// Escuchar días bloqueados en tiempo real
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

    // Asignar clases de estilo
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

    // Lógica del clic
    celda.onclick = () => {
      if (modoBloqueoDias) {
        // En modo de bloqueo, clic alterna el estado
        if (estaBloqueado) {
          // Si está bloqueado, lo desbloquea
          diasBloqueadosRef.once("value", snapshot => {
            snapshot.forEach(child => {
              if (child.val().fecha === fechaActual) {
                child.ref.remove();
                console.log("Día desbloqueado:", fechaActual);
              }
            });
          });
        } else {
          // Si no está bloqueado, lo bloquea
          diasBloqueadosRef.push({
            fecha: fechaActual
          });
          console.log("Día bloqueado:", fechaActual);
        }
      } else {
        // En modo normal, clic abre los horarios
        if (!estaBloqueado) {
          fechaInput.value = fechaActual;
          abrirVentanaHorarios(fechaActual);
        }
      }
    };
    
    // Deshabilita el clic para usuarios normales en días bloqueados
    if (!modoBloqueoDias && estaBloqueado) {
        celda.style.pointerEvents = "none";
    }

    cuadroCalendario.appendChild(celda);
  }
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

window.addEventListener("DOMContentLoaded", () => {
  actualizarBarraMes();
  // Ocultar el botón de desactivar bloqueo al iniciar la página
  botonDesactivarBloqueo.style.display = 'none';
});

botonActivarBloqueo.onclick = () => {
  modoBloqueoDias = true;
  botonActivarBloqueo.style.display = 'none';
  botonDesactivarBloqueo.style.display = 'block';
  generarCuadroCalendario();
  console.log("Modo bloqueo ACTIVADO");
};

botonDesactivarBloqueo.onclick = () => {
  modoBloqueoDias = false;
  botonActivarBloqueo.style.display = 'block';
  botonDesactivarBloqueo.style.display = 'none';
  generarCuadroCalendario();
  console.log("Modo bloqueo DESACTIVADO");
};

fechaInput.addEventListener("change", () => {
  const fechaElegida = new Date(fechaInput.value);
  const opciones = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  const fechaFormateada = fechaElegida.toLocaleDateString('es-CL', opciones);
  document.getElementById("boton").innerHTML = `📅 ${fechaFormateada}`;
  document.getElementById("botonCambiar").classList.remove("oculto");
});

document.getElementById("buscadorGlobal").addEventListener("input", () => {
  const filtro = document.getElementById("buscadorGlobal").value.trim();
  const contenedor = document.getElementById("reservas-lista");
  if (!contenedor) return;
  contenedor.querySelectorAll(".resaltado").forEach(span => {
    const parent = span.parentNode;
    if (parent) {
      parent.replaceChild(document.createTextNode(span.textContent), span);
      parent.normalize();
    }
  });
  if (filtro === "") return;
  const elementos = contenedor.querySelectorAll("*");
  let primeraCoincidencia = null;
  elementos.forEach(el => {
    el.childNodes.forEach(node => {
      if (node.nodeType === 3 && node.textContent.includes(filtro)) {
        const partes = node.textContent.split(filtro);
        const fragmento = document.createDocumentFragment();
        partes.forEach((parte, i) => {
          fragmento.appendChild(document.createTextNode(parte));
          if (i < partes.length - 1) {
            const span = document.createElement("span");
            span.className = "resaltado";
            span.textContent = filtro;
            fragmento.appendChild(span);
          }
        });
        el.replaceChild(fragmento, node);
        if (!primeraCoincidencia) primeraCoincidencia = el;
      }
    });
  });
  if (primeraCoincidencia) {
    setTimeout(() => {
      primeraCoincidencia.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }, 50);
  }
});

setTimeout(() => {
  const primeraCoincidencia = document.querySelector(".resaltado");
  if (primeraCoincidencia) {
    primeraCoincidencia.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }
}, 100);

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

reservasRef.on("child_removed", (snapshot) => {
  const {
    fecha,
    hora
  } = snapshot.val();
  const idBloque = `${fecha}-${hora}`;
  console.log("Eliminando visualmente:", idBloque);
  const div = document.getElementById(idBloque);
  if (div) div.remove();
});

function reservarHora() {
  const fecha = fechaInput.value;
  const hora = document.getElementById("hora").value;
  const nombre = document.getElementById("nombre").value.trim();

  if (!fecha || !hora || !nombre) {
    alert("Completa todos los campos: nombre, fecha y hora");
    return;
  }

  const idBloque = `${fecha}-${hora}`;

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
      reservasRef.push({
        fecha,
        hora,
        nombre
      });
      document.getElementById("modal-reservada").classList.remove("hidden");
      enviarMensajeWhatsApp(nombre, fecha, hora);
    }
  });
}

function cerrarModal(id) {
  document.getElementById(id).classList.add("fantasma");
}

function validarClave() {
  const claveInput = document.getElementById("clave-input");
  const clave = claveInput.value;
  if (clave === "1234") {
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
  console.log("Estado actualizado:", estado);
  if (estado === "cerrado") {
    document.getElementById("modal-cerrado").style.display = "flex";
  } else {
    document.getElementById("modal-cerrado").style.display = "none";
  }
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

const reservasRefMostrar = firebase.database().ref("reservas");
reservasRefMostrar.on("child_added", (snapshot) => {
  const {
    fecha,
    hora,
    nombre
  } = snapshot.val();
  const idBloque = `${fecha}-${hora}`;
  if (document.getElementById(idBloque)) return;
  const div = document.createElement("div");
  div.className = "reserva-item";
  div.id = idBloque;
  const texto = document.createElement("span");
  texto.textContent = `📅 ${fecha} ⏰ ${hora} - ${nombre}`;
  const botonX = document.createElement("span");
  botonX.textContent = " | ❌";
  botonX.className = "boton-x";
  botonX.title = "Eliminar esta hora";
  botonX.onclick = () => {
    snapshot.ref.remove();
    ocultarBotonesX();
  };
  div.appendChild(texto);
  div.appendChild(botonX);
  listaReservas.appendChild(div);
});

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

function mostrarModalMensaje() {
  document.getElementById("modal-control").classList.add("fantasma");
  document.getElementById("modal-mensaje").classList.remove("fantasma");
}

function guardarMensajeCierre() {
  const mensaje = document.getElementById("mensaje-cierre").value;
  mensajeRef.set(mensaje);
  estadoRef.set("cerrado");
  document.getElementById("modal-mensaje").classList.add("fantasma");
}

mensajeRef.on("value", snapshot => {
  const mensaje = snapshot.val();
  document.getElementById("mensaje-cerrado").textContent = mensaje || "";
});

function borrarTodasLasHorasEnPantalla() {
  reservasRef.remove()
    .then(() => {
      console.log("Todas las reservas han sido eliminadas de Firebase");
      const lista = document.getElementById("reservas-lista");
      if (!lista) {
        console.warn("No se encontró el contenedor de reservas");
        return;
      }
      while (lista.firstChild) {
        lista.removeChild(lista.firstChild);
      }
      console.log("Todas las horas en pantalla han sido eliminadas");
    })
    .catch(error => {
      console.error("Error al borrar las reservas:", error);
    });
}

function borrarHorasMesHastaHoy() {
  const hoy = new Date();
  const diaActual = hoy.getDate();
  const mesActual = hoy.getMonth() + 1;
  const añoActual = hoy.getFullYear();

  reservasRef.once("value", snapshot => {
    snapshot.forEach(child => {
      const {
        fecha
      } = child.val();
      const [año, mes, dia] = fecha.split("-").map(Number);
      if (año === añoActual && mes === mesActual && dia < diaActual) {
        reservasRef.child(child.key).remove();
      }
    });
  });
  document.getElementById("modal-control").classList.add("fantasma");
}

function miFuncion() {
  document.getElementById("reservar-button").style.display = 'block';
}

function abrirVentanaHorarios(fecha) {
  tituloVentana.textContent = `Horarios para ${fecha}`;
  horariosDisponibles.innerHTML = "";
  const horasReservadas = reservasPorDia[fecha] || [];
  bloquesHorarios.forEach(hora => {
    const bloque = document.createElement("div");
    bloque.classList.add("bloqueHora");
    if (horasReservadas.includes(hora)) {
      bloque.classList.add("horaOcupada");
      bloque.textContent = `⛔ ${hora}`;
    } else {
      bloque.classList.add("horaLibre");
      bloque.textContent = `✅ ${hora}`;
      bloque.onclick = () => {
        document.getElementById("hora").value = hora;
        fechaInput.value = fecha;
        document.getElementById("modal-hora-personalizada").classList.remove("hidden");
        ventanaHorarios.style.display = "none";
      };
    }
    horariosDisponibles.appendChild(bloque);
  });
  ventanaHorarios.style.display = "block";
}

cerrarVentana.onclick = () => {
  ventanaHorarios.style.display = "none";
};

window.onclick = (e) => {
  if (e.target === ventanaHorarios) ventanaHorarios.style.display = "none";
};

function enviarMensajeWhatsApp() {
  const nombre = document.getElementById("nombre")?.value.trim();
  const fecha = fechaInput.value;
  const hora = document.getElementById("hora").value;

  if (!nombre || !fecha || !hora) {
    alert("Faltan datos: asegúrate de ingresar nombre, fecha y hora");
    return;
  }
  const numeroDestino = "56954527837";
  const mensaje = `Hola, soy ${nombre}. Quiero reservar para el día ${fecha} a las ${hora}.`;
  const url = `https://wa.me/${numeroDestino}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
}
