window.DEMO_BRAND = Object.freeze({
  name: 'James Barbershop',
  shortName: 'James',
  slogan: 'CORTE & ESTILO',
  professional: 'James',
  phone: '+56 9 5452 7837',
  whatsappUrl: 'https://wa.me/56954527837',
  supportWhatsappUrl: 'https://wa.me/56954998792',
  address: 'Av. Alejandro Fleming 9099, Las Condes, Santiago.',
  supportEmail: 'palmacodes@palmacodes.cl',
  adminEmails: ['james@palmacodes.cl', 'palmacodes@palmacodes.cl'],
  logoUrl: 'https://i.ibb.co/JFrnTqWc/c4497cf0-2f10-43bf-b5ac-6c232c4d0e18.jpg',
  websiteUrl: 'https://barberiajames.cl',
  reviewUrl: 'https://barberiajames.cl/bot?resena=1#jbReviews',
  tvVideos: [
'/tv_bg_4_1.mp4',
'/tv_bg_2.mp4',
'/tv_bg_4_2.mp4',
'/tv_bg_3.mp4'

  ],
  firebase: {
    apiKey: 'AIzaSyBHLlV9HDfa1v-Uz4YVcbt3vQGByhNFYus',
    authDomain: 'jeisonstyle-1530f.firebaseapp.com',
    databaseURL: 'https://jeisonstyle-1530f-default-rtdb.firebaseio.com',
    projectId: 'jeisonstyle-1530f',
    storageBucket: 'jeisonstyle-1530f.firebasestorage.app',
    messagingSenderId: '40159402096',
    appId: '1:40159402096:web:d54b2d9a2dd990c1203cb5',
    measurementId: 'G-3RGRBSQ9QG'
  },
  groq: {
    model: 'llama-3.1-8b-instant',
    url: 'https://api.groq.com/openai/v1/chat/completions'
  },
  themes: {
    clasico: { bg: '#111111', surface: '#1d1d1d', text: '#f7f1e3', muted: '#c4bda9', accent: '#c99b45', accentText: '#17120a', danger: '#c94c4c' },
    minimal: { bg: '#f5f6f7', surface: '#ffffff', text: '#1f2933', muted: '#52606d', accent: '#334e68', accentText: '#ffffff', danger: '#b42318' },
    urbano: { bg: '#101318', surface: '#1c222b', text: '#f4f7fb', muted: '#aeb8c6', accent: '#00c2ff', accentText: '#061018', danger: '#ff5c5c' },
    vintage: { bg: '#efe3cf', surface: '#fff8ec', text: '#35251b', muted: '#725b49', accent: '#8b4e35', accentText: '#fff8ec', danger: '#9e2f2f' },
    streetwear: { bg: '#0a0a0a', surface: '#171717', text: '#fafafa', muted: '#b5b5b5', accent: '#ef3340', accentText: '#ffffff', danger: '#ffb000' }
  },
  services: [
    { nombre: 'Barba Express', label: 'Barba Express', precio: 6000, tiempo: 20, grupo: 'barba' },
    { nombre: 'Barba Premium', label: 'Barba Premium', precio: 12000, tiempo: 60, grupo: 'barba' },
    { nombre: 'Corte Clásico', label: 'Corte Clásico', precio: 10000, tiempo: 45, grupo: 'corte' },
    { nombre: 'Corte Degradado', label: 'Corte Degradado', precio: 12000, tiempo: 45, grupo: 'corte' },
    { nombre: 'Corte Degradado + Lavado', label: 'Corte Degradado + Lavado', precio: 15000, tiempo: 60, grupo: 'corte' },
    { nombre: 'Color Global', label: 'Color Global', precio: 70000, tiempo: 60, grupo: 'color' },
    { nombre: 'Rizos/Ondulaciones', label: 'Rizos/Ondulaciones', precio: 50000, tiempo: 60, grupo: 'ondulaciones' }
  ],
  schedule: ['11:00', '12:00', '13:00', '14:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:30'],
  storageKeys: {
    reservations: 'demo_reservas_cliente',
    chatId: 'demoChatId'
  }
});
