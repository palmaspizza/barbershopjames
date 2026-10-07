// Router de Barbería James — Palma Codes
// Entrega bot.html o calendario.html según config/asistente en Firebase.
// La URL que ven los clientes NO cambia (rewrite, no redirect).

const DB = "https://jeisonstyle-1530f-default-rtdb.firebaseio.com/config/asistente.json";

export default async (request, context) => {
  let usarBot = true; // si Firebase falla, se mantiene el bot para no romper la página

  try {
    const r = await fetch(DB, { cache: "no-store" });
    const lic = await r.json();
    const hoy = new Date().toLocaleDateString("sv-SE", { timeZone: "America/Santiago" });

    if (lic && (lic.activo === false || (lic.vencimiento && hoy > lic.vencimiento))) {
      usarBot = false;
    }
  } catch (e) {
    // sin cambios: queda el bot
  }

  const res = await context.rewrite(usarBot ? "/bot.html" : "/calendario.html");
  res.headers.set("Cache-Control", "no-store");
  return res;
};

export const config = { path: ["/", "/index.html"] };
