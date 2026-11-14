/*
 * Interruptores para servicios con cobro único.
 *
 * Para conectar un servicio nuevo:
 * 1. Elige una clave única en minúsculas, por ejemplo "opiniones-premium".
 * 2. Carga este archivo después del SDK de Firebase en la página del servicio.
 * 3. Después de iniciar Firebase, conecta el módulo con:
 *    JBFeatureAccess.watch('opiniones-premium', activo => {
 *      const modulo = document.querySelector('#opiniones-premium');
 *      if (!modulo) return console.error('No se encontró el módulo de opiniones.');
 *      modulo.style.display = activo ? '' : 'none';
 *    });
 * 4. En el panel de desarrollador, crea el cobro usando exactamente esa clave.
 * 5. Oculta solo el módulo cobrado; no incluyas reservas ni la mensualidad del bot.
 */
(function(global){
  const RUTA_COBROS = 'config/asistente_cargos';
  const FORMATO_FECHA = /^\d{4}-\d{2}-\d{2}$/;
  const FORMATO_CLAVE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  function accesoPermitido(cargo){
    if (!cargo || cargo.estado === 'pagado' || cargo.estado === 'eliminado') return true;
    if (!FORMATO_FECHA.test(cargo.fechaLimite || '')) return null;
    const hoy = new Date().toLocaleDateString('sv-SE', { timeZone:'America/Santiago' });
    return cargo.fechaLimite >= hoy;
  }

  function watch(clave, alCambiar){
    if (!FORMATO_CLAVE.test(clave || '')) throw new Error('La clave del interruptor no es válida.');
    if (typeof alCambiar !== 'function') throw new TypeError('El interruptor necesita una función para activar u ocultar el servicio.');
    if (!global.firebase || !global.firebase.database) throw new Error('Firebase Database debe estar iniciado antes de usar el interruptor.');

    const referencia = global.firebase.database().ref(RUTA_COBROS).child(clave);
    let cargo = null;
    let cargado = false;
    let ultimoAcceso = null;
    let fechaInvalidaReportada = false;
    const revisar = () => {
      if (!cargado) return;
      const resultado = accesoPermitido(cargo);
      if (resultado === null && !fechaInvalidaReportada) {
        console.error(`El cobro del interruptor "${clave}" no tiene una fecha límite válida.`);
        fechaInvalidaReportada = true;
      }
      const permitido = resultado !== false;
      if (permitido === ultimoAcceso) return;
      ultimoAcceso = permitido;
      alCambiar(permitido);
    };
    const alRecibirCargo = snapshot => {
      cargo = snapshot.val();
      cargado = true;
      fechaInvalidaReportada = false;
      revisar();
    };
    const alFallar = error => {
      console.error(`No se pudo leer el interruptor "${clave}":`, error);
      cargo = null;
      cargado = true;
      revisar();
    };
    const alVolver = () => {
      if (!document.hidden) revisar();
    };

    referencia.on('value', alRecibirCargo, alFallar);
    const temporizador = global.setInterval(revisar, 30000);
    document.addEventListener('visibilitychange', alVolver);

    return function detener(){
      referencia.off('value', alRecibirCargo);
      global.clearInterval(temporizador);
      document.removeEventListener('visibilitychange', alVolver);
    };
  }

  global.JBFeatureAccess = Object.freeze({ watch });
})(window);
