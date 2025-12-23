function normalizarHora(h) {
  if (!h) return "";
  const hh = String(parseInt(h.split(":")[0], 10)).padStart(2, "0");
  return hh + ":00";
}
function horasNecesarias(min) {
  const m = parseInt(min || "0", 10);
  const n = Math.ceil(m / 60);
  return n > 0 ? n : 1;
}
function marcarSlotsPorDuracion(baseHora, tiempoMin, scope) {
  const s = scope || document;
  const n = horasNecesarias(tiempoMin);
  const hh = parseInt((baseHora || "00:00").split(":")[0], 10);
  for (let i = 0; i < n; i++) {
    const target = String(hh + i).padStart(2, "0") + ":00";
    s.querySelectorAll(`.hora-slot[data-hora="${target}"]`).forEach(el => {
      el.classList.remove("horaLibre");
      el.classList.add("horaOcupada");
      el.classList.add("ocupada");
      el.setAttribute("disabled", "");
      el.textContent = `⛔ ${target}`;
      el.onclick = null;
    });
  }
}
function reservarConDuracion(ref, fecha, baseHora, nombre, tiempoMin, done) {
  const n = horasNecesarias(tiempoMin);
  const hh = parseInt((baseHora || "00:00").split(":")[0], 10);
  ref.once("value", snapshot => {
    const ocupadas = {};
    snapshot.forEach(child => {
      const r = child.val();
      if (r && r.fecha) {
        ocupadas[r.fecha + "|" + r.hora] = true;
      }
    });
    for (let i = 0; i < n; i++) {
      const h = String(hh + i).padStart(2, "0") + ":00";
      const k = fecha + "|" + h;
      if (!ocupadas[k]) {
        ref.push({ fecha, hora: h, nombre });
      }
    }
    if (typeof done === "function") done();
  });
}
