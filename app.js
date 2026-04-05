// ============================================
// NOTIFICACIONES PUSH PARA BARBERÍA
// Usando ntfy.sh (GRATIS, sin registro complicado)
// ============================================

// Cambia este nombre por el que configuraste en la app ntfy
const NTFY_TOPIC = 'james-barber-shop-2026';

/**
 * FUNCIÓN PRINCIPAL: Enviar notificación cuando hay nueva reserva
 */
async function notificarNuevaReserva(datosReserva) {
    const mensaje = `💈 Nueva Reserva
👤 ${datosReserva.nombre}
📅 ${datosReserva.fecha} a las ${datosReserva.hora}
✂️ ${datosReserva.servicios || 'Sin servicio'}
💰 ${datosReserva.total || 'No especificado'}`;

    try {
        const respuesta = await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
            method: 'POST',
            body: mensaje,
            headers: {
                'Title': '🔔 Nueva Reserva - Barbería',
                'Priority': 'high',
                'Tags': 'scissors,calendar'
            }
        });

        if (respuesta.ok) {
            console.log('✅ Notificación enviada al barbero');
            return true;
        } else {
            console.error('❌ Error al enviar notificación');
            return false;
        }
    } catch (error) {
        console.error('❌ Error de red:', error);
        return false;
    }
}

/**
 * FUNCIÓN: Notificación de cancelación
 */
async function notificarCancelacion(datosReserva) {
    const mensaje = `❌ Reserva Cancelada
👤 ${datosReserva.nombre}
📅 ${datosReserva.fecha} a las ${datosReserva.hora}`;

    await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
        method: 'POST',
        body: mensaje,
        headers: {
            'Title': 'Reserva Cancelada',
            'Priority': 'default',
            'Tags': 'warning'
        }
    });
}

/**
 * FUNCIÓN: Recordatorio (conceptual, requiere backend/cron)
 */
async function enviarRecordatorio(datosReserva, minutosAntes = 60) {
    const mensaje = `⏰ Recordatorio
Tienes cita en la barbería en ${minutosAntes} minutos
📅 ${datosReserva.fecha} a las ${datosReserva.hora}`;

    console.log('Recordatorio programado:', mensaje);
}

/**
 * INTEGRACIÓN CON index.html
 * La función reservarHora() ahora se encuentra en index.html para mayor control
 * pero llama a notificarNuevaReserva() de este archivo.
 */

// ============================================
// ALTERNATIVA: TELEGRAM
// ============================================

const TELEGRAM_TOKEN = 'COPIA_AQUI_TU_TOKEN';
const TELEGRAM_CHAT_ID = 'COPIA_AQUI_TU_CHAT_ID';

async function notificarPorTelegram(datosReserva) {
    const mensaje = `💈 *Nueva Reserva*%0A%0A` +
                   `👤 *Cliente:* ${datosReserva.nombre}%0A` +
                   `📅 *Fecha:* ${datosReserva.fecha}%0A` +
                   `⏰ *Hora:* ${datosReserva.hora}%0A` +
                   `✂️ *Servicio:* ${datosReserva.servicios || 'No especificado'}%0A` +
                   `💰 *Total:* ${datosReserva.total || 'No especificado'}`;

    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage?` +
                `chat_id=${TELEGRAM_CHAT_ID}&` +
                `parse_mode=Markdown&` +
                `text=${mensaje}`);
}

// Exportar funciones si usas Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { notificarNuevaReserva, notificarCancelacion, notificarPorTelegram };
}
