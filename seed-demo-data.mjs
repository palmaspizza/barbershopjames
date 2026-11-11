import { writeFile } from 'node:fs/promises';

const now = Date.now();
const daysFromToday = (days) => {
  const date = new Date(now + days * 86400000);
  return date.toISOString().slice(0, 10);
};

const services = [
  { nombre: 'Corte Clasico', label: 'Corte Clasico', precio: 10000, grupo: 'corte' },
  { nombre: 'Barba Express', label: 'Barba Express', precio: 6000, grupo: 'barba' },
  { nombre: 'Corte Degradado', label: 'Corte Degradado', precio: 12000, grupo: 'corte' }
];

const clients = {
  demo_cliente_001: { nombre: 'Catalina Soto', nombreDisplay: 'Catalina Soto', nombreNormalizado: 'catalina soto', telefono: '+56 9 0000 0000', ultimaReservaServicio: 'Corte Clasico', ultimaReservaFecha: daysFromToday(1) },
  demo_cliente_002: { nombre: 'Matias Rojas', nombreDisplay: 'Matias Rojas', nombreNormalizado: 'matias rojas', telefono: '+56 9 0000 0001', ultimaReservaServicio: 'Barba Express', ultimaReservaFecha: daysFromToday(2) },
  demo_cliente_003: { nombre: 'Valentina Perez', nombreDisplay: 'Valentina Perez', nombreNormalizado: 'valentina perez', telefono: '+56 9 0000 0002', ultimaReservaServicio: 'Corte Degradado', ultimaReservaFecha: daysFromToday(4) }
};

const makeReservation = (id, client, date, time, service) => ({
  [id]: {
    nombre: clients[client].nombre,
    fecha: date,
    hora: time,
    servicios: service.nombre,
    total: String(service.precio),
    telefono: clients[client].telefono,
    acepta_contacto_whatsapp: true,
    createdAt: now,
    timestamp: now,
    updatedAt: now,
    updatedBy: 'seed-demo'
  }
});

const reservations = {
  ...makeReservation('demo_reserva_001', 'demo_cliente_001', daysFromToday(1), '11:00', services[0]),
  ...makeReservation('demo_reserva_002', 'demo_cliente_002', daysFromToday(2), '16:00', services[1]),
  ...makeReservation('demo_reserva_003', 'demo_cliente_003', daysFromToday(4), '18:00', services[2])
};

const bloqueos = Object.fromEntries(Object.values(reservations).map((reservation, index) => [
  reservation.fecha,
  { [reservation.hora.replace(':', '-')]: { reservaId: `demo_reserva_00${index + 1}`, timestamp: now } }
]));

const data = {
  config: {
    horarioSemana: ['11:00', '12:00', '13:00', '14:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:30'],
    horarioDomingo: [],
    horariosEspecificos: {},
    diasSemanaCerrados: [0],
    contadorAdmin: 3,
    suscripcion: {
      activo: true,
      monto: 30000,
      periodoDias: 30,
      graciaDias: 3,
      ultimoPago: '',
      proximoPago: ''
    }
  },
  estadoBarberia: 'abierto',
  mensajeCierre: '',
  reservas: reservations,
  reservas_archivadas: {},
  bloqueos,
  clientes: clients,
  chats: {},
  resenas: {},
  galeria: {},
  metricas_experiencia: { facilidad: {}, dificultad: {}, tiempos: {} }
};

await writeFile(new URL('./demo-seed.json', import.meta.url), `${JSON.stringify(data, null, 2)}\n`, 'utf8');
console.log('Generado demo-seed.json para Barberia Demo.');
