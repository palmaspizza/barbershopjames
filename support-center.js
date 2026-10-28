(function (root, factory) {
    const support = factory();
    if (typeof module === 'object' && module.exports) module.exports = support;
    if (root) root.JBSupport = support;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    const SERVICE_POLICY = Object.freeze({
        provider: 'Palma Codes',
        developer: 'Diego',
        monthlyReference: '$20.000 CLP mensuales',
        monthlyAnswer: 'La mantención busca conservar el funcionamiento de los componentes incluidos en el acuerdo vigente. Los nuevos desarrollos, integraciones y servicios adicionales se evalúan según el alcance contratado. La referencia informada para la mantención es de $20.000 CLP mensuales.',
        newWork: 'Las nuevas funciones y los cambios que amplían el alcance del sistema se evalúan y cotizan por separado de la mantención mensual, salvo que ya estén incluidos en el acuerdo vigente. Enviar esta solicitud no implica aceptar el desarrollo ni su precio.',
        issueScope: 'Primero revisaremos qué está ocurriendo. La clasificación inicial no sustituye la evaluación técnica ni confirma por sí sola la cobertura contractual.',
        timezone: 'America/Santiago',
        hours: 'Puedes preparar tu solicitud en cualquier momento. La atención humana depende del horario de atención acordado.'
    });

    const ISSUE_TYPES = [
        { id: 'login', label: 'No puedo entrar o no tengo acceso', area: 'Inicio de sesión o permisos' },
        { id: 'agenda', label: 'No aparecen las reservas o falla la agenda', area: 'Calendario de Reservas' },
        { id: 'clients', label: 'Faltan datos de un cliente', area: 'Datos de clientes en reservas' },
        { id: 'stats', label: 'Los ingresos o las estadísticas parecen incorrectos', area: 'Estadísticas e ingresos' },
        { id: 'assistant', label: 'El asistente de reservas o el chat falla', area: 'Chat o asistente de reservas' },
        { id: 'android', label: 'La aplicación Android o sus reservas fallan', area: 'Integración con Android' },
        { id: 'slow', label: 'La página está lenta o muestra un error', area: 'Panel de Administración' },
        { id: 'other', label: 'Tengo otro problema', area: 'Otra sección' }
    ];

    const SYMPTOMS = {
        login: {
            question: '¿Qué ocurre cuando intentas entrar?',
            options: ['Me rechaza el acceso', 'La pantalla queda cargando', 'Aparece un mensaje de error', 'Prefiero explicarlo con mis palabras']
        },
        agenda: {
            question: '¿Qué problema ves en la agenda?',
            options: ['No aparece ninguna reserva', 'Falta una reserva concreta', 'Una reserva aparece duplicada', 'No se pueden guardar reservas', 'La información parece incorrecta', 'Prefiero explicarlo con mis palabras']
        },
        clients: {
            question: '¿Qué problema ves con los datos del cliente?',
            options: ['Faltan datos en una reserva', 'La información parece incorrecta', 'Un cliente aparece más de una vez', 'Prefiero explicarlo con mis palabras']
        },
        stats: {
            question: '¿Qué dato parece incorrecto?',
            options: ['Ingresos del mes', 'Cantidad de reservas', 'Un dato no se actualiza', 'Prefiero explicarlo con mis palabras']
        },
        assistant: {
            question: '¿Qué parte del asistente no funciona?',
            options: ['No responde', 'No muestra las opciones esperadas', 'El chat no carga', 'Prefiero explicarlo con mis palabras']
        },
        android: {
            question: '¿Qué ocurre en la aplicación Android?',
            options: ['No aparecen mis reservas', 'El código de una reserva da error', 'La información no se actualiza', 'Prefiero explicarlo con mis palabras']
        },
        slow: {
            question: '¿Qué está ocurriendo?',
            options: ['La página tarda mucho en abrir', 'Una sección queda cargando', 'Aparece un mensaje de error', 'Prefiero explicarlo con mis palabras']
        }
    };

    const HELP_TOPICS = [
        { id: 'login', label: 'Entrar al administrador' },
        { id: 'agenda', label: 'Revisar la agenda y las reservas' },
        { id: 'clients', label: 'Datos de clientes en una reserva' },
        { id: 'stats', label: 'Consultar ingresos y estadísticas' },
        { id: 'assistant', label: 'Utilizar el asistente de reservas' },
        { id: 'android', label: 'Aplicación Android y reservas locales' },
        { id: 'hours', label: 'Horarios y días cerrados' },
        { id: 'backup', label: 'Aviso de copia de seguridad' },
        { id: 'service', label: 'Mantención y atención' },
        { id: 'other', label: 'Otra consulta' }
    ];

    const CHANGE_TYPES = [
        { id: 'feature', label: 'Agregar una nueva función' },
        { id: 'design', label: 'Cambiar el diseño o los colores' },
        { id: 'workflow', label: 'Modificar cómo funciona una sección' },
        { id: 'integration', label: 'Incorporar una integración' },
        { id: 'video', label: 'Solicitar un trabajo audiovisual' },
        { id: 'other', label: 'Otra mejora' }
    ];

    const ICON_PATHS = {
        alert: '<path d="M12 3 2.8 19a1.4 1.4 0 0 0 1.2 2h16a1.4 1.4 0 0 0 1.2-2L12 3Z"/><path d="M12 9v4m0 3h.01"/>',
        android: '<rect x="5" y="2.5" width="14" height="19" rx="2.5"/><path d="M10 18h4M9 5h6"/>',
        arrow: '<path d="M4 7h12m0 0-3-3m3 3-3 3M20 17H8m0 0 3-3m-3 3 3 3"/>',
        back: '<path d="m14 18-6-6 6-6M8 12h12"/>',
        book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 1 4 17.5z"/><path d="M4 16.5A2.5 2.5 0 0 1 6.5 14H20M8 7h8m-8 3h6"/>',
        calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18m-13 4h3m-3 3h7"/>',
        chart: '<path d="M4 20V10m5 10V4m5 16v-7m5 7V7"/>',
        check: '<circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16.5 9"/>',
        chat: '<path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H6l-3 2v-6a7.5 7.5 0 1 1 17-3.5Z"/><path d="M8 11h8m-8 3h5"/>',
        clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
        copy: '<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h2"/>',
        help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.6 2.6 0 1 1 4.7 1.5c-1 1.2-2.2 1.4-2.2 3m0 3h.01"/>',
        home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
        lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v3"/>',
        picture: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="m21 15-5-5L5 20"/>',
        plug: '<path d="M8 3v5m8-5v5M6 8h12v3a6 6 0 0 1-6 6v4m-3-9h6"/>',
        plus: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8m-4-4h8"/>',
        palette: '<path d="M12 3a9 9 0 1 0 0 18h1.2a2 2 0 0 0 1.4-3.4 1.5 1.5 0 0 1 1.1-2.6H18a3 3 0 0 0 3-3c0-5-4-9-9-9Z"/><circle cx="7.5" cy="11" r=".8"/><circle cx="10" cy="7.5" r=".8"/><circle cx="15" cy="8" r=".8"/>',
        phone: '<rect x="5" y="2.5" width="14" height="19" rx="2.5"/><path d="M10 18h4"/>',
        save: '<path d="M4 3h14l3 3v15H3V4a1 1 0 0 1 1-1Z"/><path d="M7 3v6h9V3m-9 18v-8h10v8"/>',
        search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
        settings: '<circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.2 1-1.4 2.4-1.5-.5a8 8 0 0 1-1.7 1l-.3 1.6h-2.8l-.3-1.6a8 8 0 0 1-1.7-1l-1.5.5-1.4-2.4 1.2-1a8 8 0 0 1 0-2l-1.2-1 1.4-2.4 1.5.5a8 8 0 0 1 1.7-1l.3-1.6h2.8l.3 1.6a8 8 0 0 1 1.7 1l1.5-.5 1.4 2.4-1.2 1a8 8 0 0 1 0 2Z"/>',
        sparkle: '<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Zm7 12 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15ZM5 15l.8 2.2L8 18l-2.2.8L5 21l-.8-2.2L2 18l2.2-.8L5 15Z"/>',
        speed: '<path d="M4 19a9 9 0 1 1 16 0M12 13l4-4m-9 8h10"/>',
        user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
        video: '<rect x="3" y="5" width="13" height="14" rx="2"/><path d="m16 10 5-3v10l-5-3z"/>',
        exit: '<path d="M10 17l5-5-5-5m5 5H3"/><path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7"/>',
        skip: '<path d="M5 5v14l11-7L5 5Zm12 0v14"/>'
    };

    function iconMarkup(name) {
        const path = ICON_PATHS[name] || ICON_PATHS.help;
        return `<svg class="jb-support-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${path}</svg>`;
    }

    function optionIcon(value, title) {
        const choices = {
            'start:issue': 'alert', 'start:help': 'book', 'start:change': 'sparkle', 'start:contact': 'chat',
            'issue:login': 'lock', 'issue:agenda': 'calendar', 'issue:clients': 'user', 'issue:stats': 'chart',
            'issue:assistant': 'chat', 'issue:android': 'android', 'issue:slow': 'speed', 'issue:other': 'help',
            'help:login': 'lock', 'help:agenda': 'calendar', 'help:clients': 'user', 'help:stats': 'chart',
            'help:assistant': 'chat', 'help:android': 'android', 'help:hours': 'clock', 'help:backup': 'save',
            'help:service': 'settings', 'help:other': 'help',
            'change:feature': 'plus', 'change:design': 'palette', 'change:workflow': 'arrow',
            'change:integration': 'plug', 'change:video': 'video', 'change:other': 'help',
            'change-clarify:issue': 'alert', 'change-clarify:quote': 'plus',
            'check:tried': 'check', 'check:skip': 'skip',
            'outcome:yes': 'check', 'outcome:no': 'alert', 'outcome:unsure': 'help',
            'help:done': 'check', 'help:issue': 'alert', 'help:contact': 'chat',
            'exit:cancel': 'back', 'exit:confirm': 'exit'
        };
        if (choices[value]) return choices[value];
        const text = normalizeText(title);
        if (/\b(?:palabras|explicarlo|escribir|cuentanos|duda|pregunta)\b/.test(text)) return 'chat';
        if (/\b(?:reserva|agenda|fecha|dia|cita|calendario)\b/.test(text)) return 'calendar';
        if (/\b(?:ingreso|estadistica|dato|numero|cantidad)\b/.test(text)) return 'chart';
        if (/\b(?:error|rechaza|falla|duplicada|incorrecta|no aparece|no llega)\b/.test(text)) return 'alert';
        if (/\b(?:guardar|guardada|guardar|registrada)\b/.test(text)) return 'save';
        if (/\b(?:cargar|cargando|tarda|lenta)\b/.test(text)) return 'speed';
        if (/\b(?:cliente|persona)\b/.test(text)) return 'user';
        if (/\b(?:seguir|funciona|gracias|comprobe|comprobado)\b/.test(text)) return 'check';
        return 'help';
    }

    function headingMarkup(title, icon) {
        return `<h3 class="jb-support-screen-heading" tabindex="-1">${iconMarkup(icon)}<span>${escapeHtml(title)}</span></h3>`;
    }

    function fieldLabel(id, title, icon) {
        return `<label class="jb-support-label" for="${escapeHtml(id)}">${iconMarkup(icon)}<span>${escapeHtml(title)}</span></label>`;
    }

    function actionButtonMarkup(action, title, className, icon) {
        return `<button type="button" class="jb-support-button ${className || ''}" data-action="${escapeHtml(action)}">${iconMarkup(icon)}<span>${escapeHtml(title)}</span></button>`;
    }

    const SERVICE_ANSWER = [
        'La referencia informada para la mantención es de $20.000 CLP mensuales.',
        'La mantención busca conservar el funcionamiento de los componentes incluidos en el acuerdo vigente. Los nuevos desarrollos, integraciones y servicios adicionales se evalúan según el alcance contratado.',
        `Zona horaria: ${SERVICE_POLICY.timezone}. ${SERVICE_POLICY.hours}`
    ];

    const HELP_ANSWERS = {
        login: [
            'Usa el correo autorizado para el panel.',
            'Escribe la contraseña con cuidado. No la compartas por el Centro de Ayuda.',
            'Si el acceso sigue siendo rechazado o la pantalla queda cargando, puedes preparar un reporte para Diego.'
        ],
        agenda: [
            'Busca la sección «Calendario de Reservas».',
            'Selecciona el día que quieres revisar y consulta la lista de reservas de ese día.',
            'Si una reserva falta, no la vuelvas a crear hasta confirmar si se guardó; prepara un reporte indicando solo el día y la sección.'
        ],
        stats: [
            'En el panel, busca la sección «Estadísticas» o los indicadores de ingresos.',
            'Comprueba el período que muestra el indicador (día, semana o mes).',
            'Si el número sigue pareciendo incorrecto, anota el indicador y el período; no incluyas datos de clientes.'
        ],
        assistant: [
            'El asistente y el chat del sitio atienden el flujo de reservas de clientes; no son este Centro de Ayuda.',
            'Describe qué esperabas que hiciera el asistente y qué ocurrió.',
            'No copies conversaciones ni datos personales de clientes en el reporte.'
        ],
        clients: [
            'Describe qué dato falta o parece incorrecto y en qué sección lo notaste.',
            'No incluyas nombres, teléfonos, identificadores ni capturas con datos de clientes en el mensaje.',
            'No crees ni modifiques registros para corregirlo; prepara un reporte para que se revise.'
        ],
        android: [
            'El sitio incluye una integración con Android para consultar y gestionar reservas locales, pero esta carpeta no contiene la aplicación Android ni sus instrucciones de uso.',
            'Indica qué esperabas ver y qué ocurrió; no borres datos de la aplicación ni repitas una operación de reserva.',
            'Diego debe confirmar si la aplicación y esa integración forman parte del soporte vigente.'
        ],
        hours: [
            'En «Configuración Rápida», revisa «Horarios de atención». Allí aparecen los horarios de lunes a sábado y los del domingo.',
            'Para editar un horario, usa el botón «Editar HORARIO» que corresponde a ese grupo.',
            'Estos son los horarios de la barbería para las reservas; no indican el horario de atención humana de Palma Codes.'
        ],
        backup: [
            'Si aparece «Aviso anual de copia de seguridad», revisa el mensaje que muestra el panel.',
            'Si corresponde enviar el aviso, usa «Abrir WhatsApp y enviar aviso» y envíalo desde WhatsApp.',
            'Vuelve al panel y pulsa «Ya envié el aviso» solo después de haberlo enviado. Palma Codes gestiona la descarga de la copia; no elimines ni modifiques datos.'
        ],
        service: SERVICE_ANSWER
    };

    const FLOW_STEPS = {
        issue: ['issue-type', 'symptom', 'check', 'outcome', 'review'],
        help: ['help-topic', 'help-answer'],
        change: ['change-type', 'change-details'],
        contact: ['contact-message']
    };

    const LABELS = {
        technical: 'Posible problema de una función existente',
        usage: 'Consulta sobre una función existente',
        improvement: 'Mejora adicional por evaluar',
        design: 'Diseño o servicio audiovisual por evaluar',
        mixed: 'Dos temas por revisar por separado',
        service: 'Consulta sobre el servicio',
        commercial: 'Consulta comercial',
        ambiguous: 'Pendiente de aclaración',
        other: 'Pendiente de evaluación'
    };

    function normalizeText(value) {
        return String(value || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/\bcarja\b/g, 'carga')
            .replace(/\breserbas?\b/g, match => match.replace('b', 'v'))
            .replace(/[^\p{L}\p{N}\s]/gu, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function correctedText(text) {
        const markers = /\b(?:me corrijo|quise decir|en realidad|correccion)\b/g;
        let lastMarker = null;
        let match;
        while ((match = markers.exec(text)) !== null) lastMarker = match.index + match[0].length;
        return lastMarker === null ? text : text.slice(lastMarker).trim();
    }

    function splitMixedRequest(input) {
        const separator = /[.,;]?\s+(?:y\s+)?(?:(?:adem[aá]s|tambi[eé]n)\s+)?(?:(?:yo\s+)?(?:quiero|necesito|me gustar[ií]a)|agregar|agrega|añadir|añade|incorporar|incorpora|integrar|crear|cambiar|modificar|rediseñar|editar)\s+/i;
        const match = separator.exec(String(input || ''));
        if (!match) return null;
        const issue = String(input).slice(0, match.index).trim();
        const improvement = String(input).slice(match.index + match[0].length).trim();
        return issue && improvement ? { issue, improvement } : null;
    }

    function classifyRequest(input) {
        const original = normalizeText(input);
        const text = correctedText(original);
        const result = (category, reason, followUp, responseType) => ({
            category,
            label: LABELS[category],
            reason,
            followUp,
            responseType
        });

        if (!text) return result('ambiguous', 'No se describió la solicitud.', 'Cuéntanos qué esperabas que ocurriera y qué pasó.', 'ask');
        if (/\b(?:galer[ií]as?|notificaciones?|web\s*push|push)\b/i.test(String(input || ''))) {
            return result('ambiguous', 'La solicitud se refiere a una función fuera de las rutas de soporte disponibles para este plan.', 'Puedes consultar con Palma Codes si es posible evaluar esa función por separado.', 'scope_review');
        }
        if (/\b(?:que incluye|incluye|mantencion mensual|tarifa mensual|pago mensual|servicio contratado|costo mensual|valor mensual|cuanto cuesta)\b/.test(text)) {
            return result('service', 'Pregunta sobre el alcance o la tarifa del servicio.', '', 'service_scope');
        }
        if (/\b(?:agendapro|otra plataforma|otro sistema|competencia|comparar|comparacion|por que tengo que pagar)\b/.test(text)) {
            return result('commercial', 'Consulta comercial; no se interpreta como fallo técnico.', '¿Qué función concreta necesitas evaluar?', 'evaluate_request');
        }
        if (/^(?:no funciona|esta malo|esta fallando|arregla esto|necesito un cambio|quiero un cambio|esta malo el sistema|el sistema esta fallando)$/.test(text)) {
            return result('ambiguous', 'Falta identificar la función o el cambio solicitado.', '¿Una función que ya existe dejó de funcionar o necesitas que el sistema haga algo nuevo?', 'ask');
        }
        if (/\b(?:no se(?: bien)? como|no se que decir|no se explicar)\b/.test(text)) {
            return result('ambiguous', 'La solicitud necesita una aclaración antes de clasificarla.', 'Cuéntanos qué esperabas que ocurriera y qué pasó, sin usar palabras técnicas.', 'ask');
        }

        const design = /\b(?:diseno|colores|visual|redisen|reel|video|grafica|campana|audiovisual|editar)\b/.test(text);
        const feature = /\b(?:agregar|agrega|anadir|anade|incorporar|incorpora|integrar|crear|nueva funcion|funcionalidad|integracion|mejora(?:s)?|filtro nuevo|automatizacion|que el bot envie|bot envie|nuevo modulo|nuevo informe|modificar como funciona|modificar funcionamiento|cambiar el flujo|cambiar como funciona|cambio importante)\b/.test(text)
            && !/\b(?:no quiero|no necesito|no solicito|no estoy pidiendo)\b/.test(text);
        const technical = /\b(?:no funciona|no anda|anda mal|no carga|no se guarda|no se guardan|no se puede guardar|no quedan guardadas|no se registra|no se registran|no aparecen|no aparece|no muestra|no muestran|no se muestran|no puedo reservar|no envia|no manda|deja de enviar|dejo de funcionar|dejo de cargar|error|falla|fallando|se cae|caida|cayo|desaparec|duplic\w*|faltan datos|dato faltante|no puedo acceder|no puedo entrar|no puedo iniciar sesion|perdida de datos|datos incorrectos|lenta|muy lento|queda cargando|se queda cargando|no avanza|no responde|bloquead)\b/.test(text)
            || (/\b(?:no llega|no llegan|no recibo|no recibe|notificacion(?:es)?|aviso(?:s)?)\b/.test(text) && /\b(?:no|falla|error|duplic|problema|repite|repetid)\b/.test(text))
            || /\b(?:no tengo permisos|sin permisos|no tiene permisos)\b/.test(text)
            || /\b(?:falta|faltan|faltante|faltantes)\b.{0,25}\b(?:reserva|dato|informacion|cliente|ingreso|mensaje|notificacion)\b/.test(text)
            || /\b(?:reserva|dato|informacion|cliente|ingreso|mensaje|notificacion)\b.{0,25}\b(?:falta|faltan|faltante|faltantes)\b/.test(text)
            || /\b(?:arreglar|arregla|reparar|repara|solucionar|soluciona)\b.{0,30}\b(?:agenda|reserva|calendario|panel|sistema|funcion)\b/.test(text)
            || /\b(?:agenda|reserva|calendario)\b.{0,30}\b(?:mal|incorrect|vacia|vacio|desaparec)\b/.test(text);
        const multiple = /\b(?:ademas|tambien|y quiero|y necesito|junto con)\b/.test(text);

        if (technical && (feature || (design && multiple))) {
            return result('mixed', 'Se describen un posible fallo y una solicitud nueva; conviene separarlos.', '¿Qué parte dejó de funcionar y qué mejora adicional te gustaría solicitar?', 'separate_requests');
        }
        if (technical) {
            return result('technical', 'Se describe un posible fallo de una función existente; la causa y el alcance aún deben revisarse.', '¿En qué sección sucede y qué pasos realizaste antes?', 'review_fault');
        }
        if (design) return result('design', 'Se solicita diseño, contenido o material audiovisual.', '¿Qué resultado necesitas y en qué sección?', 'evaluate_additional_work');
        if (feature) return result('improvement', 'Se solicita una función, integración o cambio nuevo.', '¿Qué problema resolvería la mejora?', 'evaluate_additional_work');
        if (/\b(?:cambiar|modificar|mover|reagendar|editar)\b.{0,35}\b(?:hora|fecha|reserva|cita)\b/.test(text)) {
            return result('usage', 'Parece una operación sobre una reserva existente, no una función nueva.', '¿En qué parte del panel no encuentras la opción?', 'verified_usage');
        }
        if (/\b(?:como|donde|ayuda|no se usar|no entiendo|que hago|no puedo usar|no puedo utilizar|no puedo ver|no puedo abrir|no puedo subir|no encuentro|consultar|ver mis|buscar)\b/.test(text)) {
            return result('usage', 'Parece una consulta sobre una función existente.', '¿Qué sección estás intentando utilizar?', 'verified_usage');
        }
        return result('ambiguous', 'El mensaje no permite distinguir con seguridad entre un fallo, una consulta o una mejora.', '¿Una función que ya existe dejó de funcionar o necesitas que el sistema haga algo nuevo?', 'ask');
    }

    function answerQuestion(question) {
        const text = normalizeText(question);
        if (!text) return 'No tengo información suficiente para responder con seguridad. Puedes preparar una consulta para Diego.';
        if (/\b(?:galer[ií]as?|notificaciones?|web\s*push|push)\b/i.test(String(question || ''))) {
            return ['No tengo una guía verificada para esta función en el plan actual.', 'Si quieres, puedes consultar a Palma Codes si es posible evaluarla por separado.'];
        }
        if (/\b(?:palma codes|diego|atencion humana|horario de soporte|cuando atiende|cuando responde)\b/.test(text)) {
            return [`${SERVICE_POLICY.hours} Zona horaria: ${SERVICE_POLICY.timezone}.`];
        }
        if (/\b(?:respaldo|copia de seguridad|aviso anual)\b/.test(text)) return HELP_ANSWERS.backup;
        if (/\b(?:cliente|clientes|datos personales|historial de cliente)\b/.test(text)) return HELP_ANSWERS.clients;
        if (/\b(?:android|aplicacion movil|app movil|reservas locales)\b/.test(text)) return HELP_ANSWERS.android;
        const result = classifyRequest(text);
        if (result.category === 'service') return SERVICE_ANSWER;
        if (result.category === 'mixed') return ['Parece que hay dos temas distintos: un posible fallo de una función existente y una mejora nueva.', 'Conviene describirlos por separado. La mejora no descarta que el posible fallo se revise.'];
        if (result.category === 'improvement') return [SERVICE_POLICY.newWork, 'No se genera una cotización ni una fecha de entrega automáticamente.'];
        if (result.category === 'design') return ['Podemos preparar tu solicitud para que Palma Codes evalúe el alcance y la cotización correspondiente.', 'Si se trata de un defecto en una función existente, descríbelo como un problema para revisarlo antes de clasificarlo.'];
        if (result.category === 'commercial') return ['Podemos evaluar las funciones que necesitas y compararlas con el alcance actual del sistema.', 'Las funciones nuevas se revisan por separado de la mantención mensual.'];
        if (result.category === 'technical') return [SERVICE_POLICY.issueScope, 'Indica qué sección falla y qué esperabas que ocurriera.'];
        if (result.category === 'ambiguous') return [`Necesito un poco más de contexto. ${result.followUp}`];

        if (/\b(?:contraseña|clave|login|acceder|entrar|inicio de sesion|correo)\b/.test(text)) return HELP_ANSWERS.login;
        if (/\b(?:estadistica|ingreso|total)\b/.test(text)) return HELP_ANSWERS.stats;
        if (/\b(?:agenda|calendario|reserva|cita|fecha|hora)\b/.test(text)) return HELP_ANSWERS.agenda;
        if (/\b(?:chat|bot|asistente|whatsapp|mensaje)\b/.test(text)) return HELP_ANSWERS.assistant;
        return 'No tengo información suficiente para responder con seguridad. Puedes preparar una consulta para Diego.';
    }

    function validateText(value, maximum) {
        const text = String(value || '').trim()
            .replace(/([\uD800-\uDBFF][\uDC00-\uDFFF])|[\uD800-\uDFFF]/g, (character, pair) => pair || '\uFFFD');
        if (!text) return { valid: false, error: 'Escribe un poco de información para continuar.' };
        if (text.length < 10) return { valid: false, error: 'Añade un poco más de detalle para que Diego pueda orientarte.' };
        if (text.length > maximum) return { valid: false, error: `El texto no puede superar ${maximum} caracteres.` };
        if (/\b(?:password|contrase(?:n|ñ)a|clave|pin|token|api[\s_-]?key|cvv|cvc|codigo de acceso|codigo de verificacion|codigo sms)\s*(?::|=|\bes\b)\s*\S+/i.test(text)
            || /\b(?:\d[ -]?){13,19}\b/.test(text)
            || /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(text)
            || /(?:\+?56[\s.-]?)?9(?:[\s.-]?\d){8}\b/.test(text)
            || /\b\d{7,8}-[\dkK]\b/.test(text)) {
            return { valid: false, error: 'El texto parece incluir una contraseña, código, dato bancario o dato de contacto personal. Elimínalo antes de continuar.' };
        }
        return { valid: true, value: text };
    }

    function validateRequest(fields) {
        const subject = String(fields.subject || '').trim();
        const description = String(fields.description || '').trim();
        const steps = String(fields.steps || '').trim();
        if (!subject) return { valid: false, error: 'Escribe un asunto breve.' };
        if (subject.length > 120) return { valid: false, error: 'El asunto no puede superar 120 caracteres.' };
        const checked = validateText(description, 2000);
        if (!checked.valid) return checked;
        if (steps.length > 800) return { valid: false, error: 'Los pasos no pueden superar 800 caracteres.' };
        if (steps && !validateText(steps, 800).valid) return validateText(steps, 800);
        return { valid: true, subject, description: checked.value, steps };
    }

    function createWizardState() {
        return { view: 'home', flow: null, step: null, answers: {}, history: [] };
    }

    function startFlow(state, flow, preserveAnswers) {
        if (!Object.prototype.hasOwnProperty.call(FLOW_STEPS, flow)) throw new Error('Flujo de ayuda desconocido.');
        return {
            view: 'step',
            flow,
            step: FLOW_STEPS[flow][0],
            answers: preserveAnswers ? Object.assign({}, state.answers) : {},
            history: preserveAnswers && state.view === 'step'
                ? state.history.concat([{ flow: state.flow, step: state.step }])
                : []
        };
    }

    function advance(state, nextStep, updates) {
        if (state.view !== 'step' || !nextStep) throw new Error('No se puede avanzar desde la pantalla actual.');
        return {
            view: 'step',
            flow: state.flow,
            step: nextStep,
            answers: Object.assign({}, state.answers, updates || {}),
            history: state.history.concat([{ flow: state.flow, step: state.step }])
        };
    }

    function goBack(state) {
        if (state.view !== 'step' || !state.history.length) return state;
        const history = state.history.slice();
        const previous = history.pop();
        return Object.assign({}, state, { flow: previous.flow, step: previous.step, history });
    }

    function requestExit(state) {
        if (state.view === 'home') return state;
        return Object.assign({}, state, { view: 'confirm-exit' });
    }

    function cancelExit(state) {
        if (state.view !== 'confirm-exit') return state;
        return Object.assign({}, state, { view: 'step' });
    }

    function confirmExit(state) {
        if (state.view !== 'confirm-exit') return state;
        return createWizardState();
    }

    function escapeHtml(value) {
        return String(value || '').replace(/[&<>"']/g, character => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        })[character]);
    }

    function optionButton(title, description, value, primary) {
        return `<button type="button" class="jb-support-option${primary ? ' is-primary' : ''}" data-choice="${escapeHtml(value)}">${iconMarkup(optionIcon(value, title))}<span class="jb-support-option-copy"><strong>${escapeHtml(title)}</strong>${description ? `<span>${escapeHtml(description)}</span>` : ''}</span></button>`;
    }

    function actionsMarkup(state) {
        const backLabel = state.history.length ? 'Volver' : 'Volver al inicio';
        return `<div class="jb-support-actions">${actionButtonMarkup('back', backLabel, 'is-quiet', 'back')}${actionButtonMarkup('exit', 'Salir', 'is-quiet', 'exit')}</div>`;
    }

    function progressMarkup(state) {
        const steps = FLOW_STEPS[state.flow] || [];
        const dynamicIndex = state.step === 'other-details' || state.step === 'symptom-other' ? 1 : -1;
        const index = dynamicIndex >= 0 ? dynamicIndex : Math.max(0, steps.indexOf(state.step));
        const total = steps.length;
        const percent = total ? Math.round(((index + 1) / total) * 100) : 0;
        return `<div class="jb-support-step-top">${iconMarkup('search')}<span class="jb-support-progress-label">Paso ${index + 1} de ${total}</span><span class="jb-support-progress-label">${percent}%</span></div><div class="jb-support-progress-track" role="progressbar" aria-label="Avance de la ayuda" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}"><div class="jb-support-progress-value" style="width:${percent}%"></div></div>`;
    }

    function getIssueCheckGuidance(answers) {
        const symptomText = normalizeText(`${answers.symptom || ''} ${answers.symptomOther || ''} ${answers.otherProblem || ''}`);
        if (answers.issue === 'agenda' && /\b(?:duplic\w*|guardar|reserva concreta)\b/.test(symptomText)) {
            return 'Revisa el día y la lista de reservas para confirmar qué aparece. No vuelvas a guardar ni cancelar una reserva si no sabes si ya quedó registrada. Si sigue igual, prepara el reporte.';
        }
        if (answers.issue === 'agenda') {
            return 'Comprueba el día seleccionado. Si no hay cambios pendientes de guardar, puedes recargar la página una sola vez. No vuelvas a enviar una reserva si no sabes si ya quedó guardada.';
        }
        if (answers.issue === 'login') {
            return 'Comprueba tu conexión y que estés usando el correo autorizado. Evita probar muchas veces una contraseña si el acceso sigue rechazándose.';
        }
        if (answers.issue === 'clients') {
            return 'Comprueba la sección y el período que estás revisando. No compartas datos del cliente ni crees o edites registros para intentar corregirlo.';
        }
        if (answers.issue === 'android') {
            return 'Comprueba si el teléfono tiene conexión. No borres datos de la aplicación, no la reinstales y no repitas una operación de reserva.';
        }
        return 'Comprueba si la conexión a internet es estable. Si no hay cambios pendientes de guardar, puedes recargar la página una sola vez y volver a abrir la sección.';
    }

    function renderStep(state) {
        const answers = state.answers;
        if (state.flow === 'issue') {
            if (state.step === 'issue-type') {
                return `${headingMarkup('¿Qué está pasando?', 'alert')}<p class="jb-support-screen-description">Elige lo que más se parece a tu situación.</p><div class="jb-support-options">${ISSUE_TYPES.map(item => optionButton(item.label, '', `issue:${item.id}`)).join('')}</div>`;
            }
            if (state.step === 'symptom') {
                const issue = ISSUE_TYPES.find(item => item.id === answers.issue);
                const symptom = SYMPTOMS[answers.issue];
                return `${headingMarkup(symptom.question, optionIcon(`issue:${answers.issue}`, symptom.question))}<p class="jb-support-screen-description">No necesitas usar palabras técnicas.</p><div class="jb-support-options">${symptom.options.map((label, index) => optionButton(label, '', `symptom:${index === symptom.options.length - 1 ? 'other' : index}`)).join('')}</div><p class="jb-support-status">${iconMarkup('calendar')}<span>Sección: ${escapeHtml(issue.area)}.</span></p>`;
            }
            if (state.step === 'other-details' || state.step === 'symptom-other') {
                const isOther = state.step === 'other-details';
                return `${headingMarkup(isOther ? 'Cuéntanos brevemente cuál es el problema' : '¿Qué está ocurriendo?', 'chat')}<p class="jb-support-screen-description">Describe lo que esperabas y lo que pasó. No incluyas datos privados.</p>${fieldLabel('jbSupportDetailInput', 'Tu explicación', 'chat')}<textarea id="jbSupportDetailInput" data-field="${isOther ? 'otherProblem' : 'symptomOther'}" maxlength="1000" placeholder="Escribe aquí">${escapeHtml(answers[isOther ? 'otherProblem' : 'symptomOther'] || '')}</textarea><p id="jbSupportError" class="jb-support-field-error" role="alert"></p><div class="jb-support-actions">${actionButtonMarkup('continue-detail', 'Continuar', 'is-primary', 'arrow')}</div>`;
            }
            if (state.step === 'check') {
                const message = getIssueCheckGuidance(answers);
                return `${headingMarkup('Hagamos una comprobación sencilla', 'search')}<div class="jb-support-guidance">${iconMarkup('settings')}<span>${escapeHtml(message)}</span></div><p class="jb-support-screen-description">Si prefieres no hacerlo, puedes continuar igualmente.</p><div class="jb-support-options">${optionButton('Ya lo comprobé', '', 'check:tried', true)}${optionButton('Prefiero saltar este paso', '', 'check:skip')}</div>`;
            }
            if (state.step === 'outcome') {
                return `${headingMarkup('¿Se solucionó?', 'help')}<p class="jb-support-screen-description">Elige la opción que mejor describe lo que ves ahora.</p><div class="jb-support-options">${optionButton('Sí, ya funciona', '', 'outcome:yes', true)}${optionButton('No, sigue fallando', '', 'outcome:no')}${optionButton('No estoy seguro', '', 'outcome:unsure')}</div>`;
            }
            if (state.step === 'review') {
                const issue = ISSUE_TYPES.find(item => item.id === answers.issue);
                const symptom = answers.symptom || answers.symptomOther || answers.otherProblem || 'No se indicó más detalle.';
                const summary = answers.reportText || [
                    `Sección afectada: ${issue ? issue.area : 'No especificada'}`,
                    `Problema: ${symptom}`,
                    ...(answers.pendingIssueDescription ? [`Detalle adicional: ${answers.pendingIssueDescription}`] : []),
                    'Resultado esperado: que la función opere correctamente.',
                    `Comprobaciones realizadas: ${answers.check === 'tried' ? 'se realizó la comprobación indicada' : 'se omitió la comprobación sugerida'}`,
                    'Resultado observado: sigue fallando o no está claro si se solucionó.'
                ].join('\n');
                const mixed = answers.mixedDetected || classifyRequest(summary).category === 'mixed';
                return `${headingMarkup('Ya tengo el resumen', 'chat')}<p class="jb-support-screen-description">Vamos a enviarle a Diego los detalles para que pueda revisar el problema. WhatsApp abrirá el mensaje preparado y tú decides si lo envías.</p>${mixed ? `<div class="jb-support-notice">${iconMarkup('alert')}<span>Detecté un fallo y una mejora. Primero enviaremos el fallo; luego podrás pedir la cotización por separado.</span></div>` : ''}${fieldLabel('jbSupportReportText', 'Resumen (puedes corregirlo)', 'search')}<textarea id="jbSupportReportText" data-field="reportText" maxlength="2000">${escapeHtml(summary)}</textarea>${fieldLabel('jbSupportErrorText', 'Error en pantalla (opcional)', 'alert')}<textarea id="jbSupportErrorText" data-field="errorText" maxlength="500" placeholder="Copia el texto, si aparece">${escapeHtml(answers.errorText || '')}</textarea>${mixed ? `${fieldLabel('jbSupportSeparateImprovement', 'Mejora para cotizar después (opcional)', 'sparkle')}<textarea id="jbSupportSeparateImprovement" data-field="separateImprovement" maxlength="1000" placeholder="¿Qué mejora quieres pedir?">${escapeHtml(answers.separateImprovement || '')}</textarea>` : ''}<p id="jbSupportError" class="jb-support-field-error" role="alert"></p><div class="jb-support-actions">${actionButtonMarkup('prepare-issue', 'Enviar detalles a Diego por WhatsApp', 'is-primary', 'chat')}</div>`;
            }
        }

        if (state.flow === 'help') {
            if (state.step === 'help-topic') {
                return `${headingMarkup('¿Con qué necesitas ayuda?', 'book')}<p class="jb-support-screen-description">Elige la parte del sistema que quieres usar.</p><div class="jb-support-options">${HELP_TOPICS.map(item => optionButton(item.label, '', `help:${item.id}`)).join('')}</div>`;
            }
            if (state.step === 'help-question') {
                return `${headingMarkup('¿Qué te gustaría saber?', 'help')}${fieldLabel('jbSupportQuestion', 'Cuéntanos tu duda', 'chat')}<textarea id="jbSupportQuestion" data-field="helpQuestion" maxlength="1200" placeholder="Escribe tu pregunta con tus palabras">${escapeHtml(answers.helpQuestion || '')}</textarea><p id="jbSupportError" class="jb-support-field-error" role="alert"></p><div class="jb-support-actions">${actionButtonMarkup('answer-question', 'Ver orientación', 'is-primary', 'search')}</div>`;
            }
            if (state.step === 'help-answer') {
                const response = answers.helpAnswer || HELP_ANSWERS[answers.helpTopic] || [];
                const lines = Array.isArray(response) ? response : [response];
                const classification = classifyRequest(`${answers.helpQuestion || ''} ${answers.helpTopic || ''}`);
                const issueHint = classification.category === 'technical' || /\b(?:fall|no funciona|no aparece|no carga|error)\b/.test(normalizeText(answers.helpQuestion || ''));
                return `${headingMarkup(answers.helpQuestion ? 'Orientación para tu consulta' : 'Prueba estos pasos', 'book')}${answers.helpQuestion ? '' : `<p class="jb-support-screen-description">${iconMarkup(optionIcon(`help:${answers.helpTopic}`, ''))}<span>${escapeHtml((HELP_TOPICS.find(item => item.id === answers.helpTopic) || { label: 'Esta función' }).label)}</span></p>`}<div class="jb-support-guidance"><ol>${lines.map(line => `<li>${iconMarkup('check')}<span>${escapeHtml(line)}</span></li>`).join('')}</ol></div>${issueHint ? `<div class="jb-support-notice">${iconMarkup('alert')}<span>Si una función que ya existía dejó de funcionar, podemos pasar al reporte de un posible problema.</span></div>` : ''}<p class="jb-support-screen-description">La orientación no modifica reservas ni confirma que el problema esté resuelto.</p><div class="jb-support-options">${optionButton('Sí, gracias', '', 'help:done', true)}${optionButton(issueHint ? 'Sigue fallando' : 'Necesito más ayuda', '', issueHint ? 'help:issue' : 'help:contact')}${optionButton('Quiero hablar con Diego', '', 'help:contact')}</div>`;
            }
        }

        if (state.flow === 'change') {
            if (state.step === 'change-type') {
                return `${headingMarkup('¿Qué te gustaría hacer?', 'sparkle')}<p class="jb-support-screen-description">Elige la opción más cercana a tu idea.</p><div class="jb-support-options">${CHANGE_TYPES.map(item => optionButton(item.label, '', `change:${item.id}`)).join('')}</div>`;
            }
            if (state.step === 'change-details') {
                const response = classifyChangeRequest(answers.changeType, answers.changeDescription || '', answers.changeClarification);
                const mixedNotice = `<div id="jbSupportChangeNotice" class="jb-support-notice"${response.category === 'mixed' ? '' : ' hidden'}>${iconMarkup('alert')}<span>Tu descripción parece incluir un fallo y una mejora. El mensaje los señalará para que se revisen por separado.</span></div>`;
                const extraNote = getChangeGuidance(answers.changeType, response.category);
                const actionLabel = getChangeActionLabel(response.category);
                const actionNote = response.category === 'improvement' || response.category === 'design'
                    ? ''
                    : response.category === 'technical' || response.category === 'mixed'
                    ? SERVICE_POLICY.issueScope
                    : response.category === 'usage'
                        ? 'Esto prepara una consulta de uso; no modifica el sistema ni confirma cobertura contractual.'
                        : response.category === 'service' || response.category === 'commercial' || response.category === 'other'
                            ? 'La clasificación es orientativa y queda pendiente de revisión; no confirma cobertura ni cotización.'
                            : 'Enviar un mensaje no implica aceptar el desarrollo, su precio ni una fecha.';
                const clarifying = response.category === 'other';
                const canProceed = response.category !== 'other';
                const buttonLabel = response.category === 'improvement' || response.category === 'design'
                    ? 'Solicitar evaluación y cotización'
                    : actionLabel;
                return `${headingMarkup('¿Qué cambio necesitas?', 'sparkle')}<div id="jbSupportChangeGuidance" class="jb-support-commercial">${iconMarkup('settings')}<span>${escapeHtml(extraNote)}</span></div>${mixedNotice}${fieldLabel('jbSupportChangeText', 'Tu idea (en pocas palabras)', 'chat')}<textarea id="jbSupportChangeText" data-field="changeDescription" maxlength="1600" placeholder="¿Qué quieres agregar o cambiar?">${escapeHtml(answers.changeDescription || '')}</textarea><p id="jbSupportError" class="jb-support-field-error" role="alert"></p><div class="jb-support-actions"><button type="button" class="jb-support-button is-primary" id="jbSupportChangeAction" data-action="prepare-change"${canProceed ? '' : ' disabled'}>${iconMarkup(optionIcon(`change:${answers.changeType}`, buttonLabel))}<span>${escapeHtml(buttonLabel)}</span></button>${actionButtonMarkup('back', 'Volver', 'is-quiet', 'back')}</div><div id="jbSupportClarifyingChoices"${clarifying ? '' : ' hidden'}><p class="jb-support-screen-description"><strong>¿Qué necesitas?</strong></p><div class="jb-support-actions">${optionButton('Algo que ya existía dejó de funcionar', '', 'change-clarify:issue')}${optionButton('Quiero algo nuevo', '', 'change-clarify:quote')}</div></div>${actionNote || !canProceed ? `<p id="jbSupportChangeActionNote" class="jb-support-status">${escapeHtml(canProceed ? actionNote : 'Aclaremos primero si algo dejó de funcionar o si quieres agregar algo.')}</p>` : ''}`;
            }
        }

        if (state.flow === 'contact' && state.step === 'contact-message') {
            return `${headingMarkup('¿Qué necesitas?', 'chat')}<p class="jb-support-screen-description">Escribe una frase. No necesitas palabras técnicas.</p>${fieldLabel('jbSupportContactMessage', 'Tu mensaje', 'chat')}<textarea id="jbSupportContactMessage" data-field="contactMessage" maxlength="1400" placeholder="¿Qué pasó o qué necesitas?">${escapeHtml(answers.contactMessage || '')}</textarea><p id="jbSupportError" class="jb-support-field-error" role="alert"></p><div class="jb-support-actions">${actionButtonMarkup('prepare-contact', 'Abrir WhatsApp con el mensaje', 'is-primary', 'chat')}</div>`;
        }

        return `${headingMarkup('No encontré ese paso', 'help')}<p class="jb-support-screen-description">Vuelve al inicio y elige una opción.</p>`;
    }

    function render(state) {
        if (state.view === 'home') {
            return `<div class="jb-support-screen">${headingMarkup('¿Qué necesitas?', 'help')}<p class="jb-support-screen-description">Toca una opción. Si necesitas ayuda humana, podrás pedirla después.</p><div class="jb-support-options">${optionButton('Algo no funciona', 'Reportar un fallo.', 'start:issue', true)}${optionButton('Necesito ayuda', 'Aprender a usar una función.', 'start:help')}${optionButton('Quiero un cambio', 'Pedir una mejora o cotización.', 'start:change')}${optionButton('Otra duda', 'Contar qué necesitas.', 'start:contact')}</div></div>`;
        }
        if (state.view === 'confirm-exit') {
            return `<div class="jb-support-screen">${headingMarkup('¿Quieres salir de esta ayuda?', 'exit')}<p class="jb-support-screen-description">Si vuelves al inicio, las respuestas de este recorrido se borrarán.</p><div class="jb-support-options">${optionButton('Seguir donde estaba', 'Conservar lo que ya escribiste.', 'exit:cancel', true)}${optionButton('Salir al inicio', 'Descartar este recorrido y empezar otra vez.', 'exit:confirm')}</div></div>`;
        }
        if (state.view === 'done') {
            return `<div class="jb-support-screen">${headingMarkup('¡Listo!', 'check')}<p class="jb-support-screen-description">${iconMarkup('check')}<span>${escapeHtml(state.message || 'La orientación te sirvió.')}</span></p><div class="jb-support-actions">${actionButtonMarkup('home', 'Volver al inicio', 'is-primary', 'home')}</div></div>`;
        }
        if (state.view === 'prepared') {
            const launchStatus = state.launchStatus === 'opened'
                ? 'WhatsApp se ha abierto con tu mensaje preparado. Revisa el texto y pulsa Enviar.'
                : state.launchStatus === 'blocked'
                    ? 'El navegador no permitió abrir WhatsApp. Usa «Abrir WhatsApp» o copia el mensaje.'
                    : state.launchStatus === 'unavailable'
                        ? 'No se encontró un número de WhatsApp válido. Copia el mensaje y contacta por el canal habitual.'
                        : 'Preparando el mensaje. No se ha enviado ni guardado.';
            const mixedFollowUp = state.answers.mixedDetected
                ? `<div class="jb-support-notice">${iconMarkup('sparkle')}<span><strong>Primero reportamos el fallo.</strong> La mejora se puede cotizar por separado.</span></div>${actionButtonMarkup('quote-mixed', 'Solicitar evaluación y cotización de la mejora', 'is-primary', 'sparkle')}`
                : '';
            return `<div class="jb-support-screen">${headingMarkup('Mensaje preparado', 'chat')}<p class="jb-support-screen-description">${iconMarkup(state.launchStatus === 'opened' ? 'check' : 'help')}<span>${escapeHtml(launchStatus)}</span></p><div class="jb-support-report">${iconMarkup('chat')}<span>${escapeHtml(state.message)}</span></div><div class="jb-support-actions">${state.launchStatus !== 'opened' ? `<a id="jbSupportWhatsApp" data-action="open-whatsapp" class="jb-support-contact is-primary" target="_blank" rel="noopener noreferrer">${iconMarkup('chat')}<span>Abrir WhatsApp</span></a>` : ''}${actionButtonMarkup('copy-message', 'Copiar mensaje', 'is-info', 'copy')}</div>${fieldLabel('jbSupportCopyText', 'Mensaje para copiar', 'copy')}<textarea id="jbSupportCopyText" readonly>${escapeHtml(state.message)}</textarea><p id="jbSupportStatus" class="jb-support-status" role="status" aria-live="polite"></p><div class="jb-support-actions">${mixedFollowUp}${actionButtonMarkup('back', 'Volver', 'is-quiet', 'back')}${actionButtonMarkup('home', 'Volver al inicio', 'is-quiet', 'home')}</div></div>`;
        }
        const progress = progressMarkup(state);
        const content = renderStep(state);
        return `<div class="jb-support-screen">${progress}${content}${actionsMarkup(state)}</div>`;
    }

    function buildIssueSummary(answers) {
        const issue = ISSUE_TYPES.find(item => item.id === answers.issue);
        const details = answers.symptom || answers.symptomOther || answers.otherProblem || 'No se indicó más detalle.';
        return [
            `Sección afectada: ${issue ? issue.area : 'No especificada'}`,
            `Problema: ${details}`,
            ...(answers.pendingIssueDescription
                ? [`Detalle adicional: ${answers.pendingIssueDescription}`]
                : []),
            'Resultado esperado: que la función opere correctamente.',
            `Comprobaciones realizadas: ${answers.check === 'tried' ? 'se realizó la comprobación indicada' : 'se omitió la comprobación sugerida'}`,
            `Resultado observado: ${answers.outcome === 'no' ? 'sigue fallando' : 'no está claro si se solucionó'}`
        ].join('\n');
    }

    function buildMessage(state, customText) {
        const answers = state.answers;
        const opening = state.flow === 'issue'
            ? 'Hola Diego, necesito ayuda con un posible problema de mantención de Barbería James.'
            : 'Hola Diego, te escribo desde el Centro de Ayuda de Barbería James.';
        const lines = [opening];
        if (state.flow === 'issue') {
            const report = customText || buildIssueSummary(answers);
            const classification = classifyRequest(report);
            const isMixed = classification.category === 'mixed' || answers.mixedDetected;
            const mixedParts = classification.category === 'mixed' ? splitMixedRequest(report) : null;
            lines.push(isMixed
                ? 'Clasificación provisional: posible incidencia de mantención. Solicitud mixta: la mejora se evaluará por separado.'
                : 'Clasificación provisional: posible incidencia de mantención.');
            lines.push(mixedParts
                ? /^(?:Sección afectada|Problema):/i.test(mixedParts.issue) ? mixedParts.issue : `Problema: ${mixedParts.issue}`
                : report);
            if (answers.errorText) lines.push(`Mensaje de error: ${answers.errorText}`);
            lines.push('¿Puedes revisar el caso y confirmar el diagnóstico y si corresponde a la mantención vigente?');
            lines.push('Gracias.');
        } else if (state.flow === 'change') {
            const classification = classifyChangeRequest(answers.changeType, customText || answers.changeDescription || '', answers.changeClarification);
            lines.push(`Clasificación provisional: ${LABELS[classification.category] || LABELS.other}.`);
            lines.push(classification.category === 'improvement' || classification.category === 'design'
                ? 'Solicito evaluar esta mejora y, si corresponde, preparar una cotización.'
                : `Tipo: ${LABELS[classification.category] || LABELS.other}.`);
            lines.push(`Solicitud: ${customText || answers.changeDescription || ''}`);
            if (classification.category === 'mixed') {
                lines.push('Separar al revisar: posible fallo de una función existente y mejora adicional solicitada.');
                lines.push(SERVICE_POLICY.issueScope);
            } else if (classification.category === 'technical') {
                lines.push(SERVICE_POLICY.issueScope);
            } else if (classification.category === 'design' && answers.changeType === 'video') {
                lines.push('Los trabajos audiovisuales se evalúan según el alcance solicitado.');
            } else if (classification.category === 'usage') {
                lines.push('Se describe una consulta de uso, no una solicitud confirmada de desarrollo adicional.');
            } else if (classification.category === 'service' || classification.category === 'commercial' || classification.category === 'other') {
                lines.push(SERVICE_POLICY.issueScope);
            } else {
                lines.push(SERVICE_POLICY.newWork);
            }
        } else {
            const requestParts = [
                customText,
                answers.reportText,
                answers.helpQuestion,
                answers.changeDescription,
                answers.symptom,
                answers.symptomOther,
                answers.otherProblem
            ].filter(Boolean);
            let requestText = requestParts.join(' ');
            if (!requestText && answers.issue) requestText = buildIssueSummary(answers);
            if (!requestText && answers.helpTopic) {
                const topic = HELP_TOPICS.find(item => item.id === answers.helpTopic);
                requestText = `Cómo utilizar ${topic ? topic.label : answers.helpTopic}`;
            }
            let classification = answers.changeType
                ? classifyChangeRequest(answers.changeType, requestText)
                : classifyRequest(requestText);
            if (classification.category === 'ambiguous' && answers.issue) {
                classification = Object.assign({}, classification, {
                    category: 'technical',
                    label: LABELS.technical
                });
            } else if (classification.category === 'ambiguous' && answers.helpTopic) {
                classification = Object.assign({}, classification, {
                    category: 'usage',
                    label: LABELS.usage
                });
            } else if (classification.category === 'ambiguous') {
                classification = Object.assign({}, classification, {
                    category: 'other',
                    label: LABELS.other
                });
            }
            lines.push(`Tipo: ${LABELS[classification.category] || LABELS.other}.`);
            if (classification.category === 'mixed') {
                lines.push('Separar al revisar: posible fallo de una función existente y solicitud adicional.');
                lines.push(SERVICE_POLICY.issueScope);
                lines.push(SERVICE_POLICY.newWork);
            } else if (classification.category === 'technical' || classification.category === 'other') {
                lines.push(SERVICE_POLICY.issueScope);
            } else if (classification.category === 'improvement' || classification.category === 'design') {
                lines.push(SERVICE_POLICY.newWork);
            } else if (classification.category === 'service' || classification.category === 'commercial') {
                lines.push(SERVICE_POLICY.issueScope);
            }
            if (customText) lines.push(customText);
            if (answers.reportText) {
                lines.push(`Resumen del problema: ${answers.reportText}`);
            } else if (answers.issue) {
                const issue = ISSUE_TYPES.find(item => item.id === answers.issue);
                lines.push(`Problema indicado: ${issue ? issue.label : answers.issue}.`);
            }
            if (!answers.reportText && (answers.symptom || answers.symptomOther || answers.otherProblem)) {
                lines.push(`Detalle: ${answers.symptom || answers.symptomOther || answers.otherProblem}`);
            }
            if (answers.errorText) lines.push(`Mensaje de error: ${answers.errorText}`);
            if (answers.outcome) lines.push(`Resultado indicado: ${answers.outcome === 'yes' ? 'James indicó que ahora funciona' : answers.outcome === 'no' ? 'sigue fallando' : 'no está seguro'}.`);
            if (answers.helpQuestion) lines.push(`Consulta: ${answers.helpQuestion}`);
            if (answers.helpTopic && !answers.helpQuestion) {
                const topic = HELP_TOPICS.find(item => item.id === answers.helpTopic);
                lines.push(`Tema consultado: ${topic ? topic.label : answers.helpTopic}`);
            }
            if (answers.changeDescription) lines.push(`Mejora solicitada: ${answers.changeDescription}`);
            if (!customText && !answers.issue && !answers.helpQuestion && !answers.changeDescription && !answers.reportText) {
                lines.push('Necesito ayuda y quisiera conversar sobre mi consulta.');
            }
        }
        lines.push('No incluyo contraseñas ni datos privados de clientes.');
        return lines.join('\n');
    }

    function classifyChangeRequest(changeType, description, clarification) {
        const result = classifyRequest(description);
        if (result.category === 'ambiguous' && clarification === 'quote') {
            return Object.assign({}, result, {
                category: changeType === 'design' || changeType === 'video' ? 'design' : 'improvement',
                label: LABELS[changeType === 'design' || changeType === 'video' ? 'design' : 'improvement']
            });
        }
        if (result.category === 'ambiguous' && changeType === 'other') {
            return Object.assign({}, result, { category: 'other', label: LABELS.other });
        }
        if (result.category === 'mixed' || result.category === 'technical') return result;
        if (changeType === 'design' || changeType === 'video' || result.category === 'design') {
            return Object.assign({}, result, { category: 'design', label: LABELS.design });
        }
        if (result.category === 'usage' || result.category === 'service' || result.category === 'commercial') return result;
        if (result.category === 'ambiguous') return Object.assign({}, result, { category: 'other', label: LABELS.other });
        return Object.assign({}, result, { category: 'improvement', label: LABELS.improvement });
    }

    function getChangeGuidance(changeType, category) {
        if (category === 'technical' || category === 'mixed') return SERVICE_POLICY.issueScope;
        if (category === 'usage') return 'Si estás intentando usar una función existente, prepara una consulta; no se describe un desarrollo adicional.';
        if (category === 'service' || category === 'commercial' || category === 'other') {
            return 'Aclaremos primero si algo dejó de funcionar o si quieres agregar algo.';
        }
        if (category === 'design' && changeType === 'video') {
            return 'El trabajo audiovisual es adicional a la mantención. Palma Codes evaluará el alcance y, si corresponde, cotizará. Pedir evaluación no te obliga a aceptar precio ni fecha.';
        }
        return 'Parece una mejora adicional a la mantención mensual. Palma Codes evaluará el alcance y, si corresponde, cotizará. Pedir evaluación no te obliga a aceptar precio ni fecha.';
    }

    function getChangeActionLabel(category) {
        if (category === 'technical') return 'Preparar reporte de problema';
        if (category === 'usage' || category === 'service' || category === 'commercial') return 'Preparar consulta para Diego';
        if (category === 'mixed') return 'Reportar primero el fallo';
        if (category === 'other') return 'Aclaremos la solicitud';
        if (category === 'improvement') return 'Preparar solicitud de mejora';
        return 'Preparar solicitud para Diego';
    }

    function getWhatsAppUrl(message, contactLink) {
        if (!contactLink || !contactLink.href) return null;
        try {
            const url = new URL(contactLink.href);
            if (url.protocol !== 'https:' || url.hostname.toLowerCase() !== 'wa.me' || !/^\/[1-9]\d{7,14}$/.test(url.pathname)) return null;
            url.searchParams.set('text', message);
            return url.toString();
        } catch (error) {
            return null;
        }
    }

    function init(documentObject, browserWindow) {
        const doc = documentObject || (typeof document !== 'undefined' ? document : null);
        const win = browserWindow || (typeof window !== 'undefined' ? window : null);
        const app = doc && doc.getElementById('jbSupportApp');
        if (!doc || !app || app.dataset.supportInitialized === 'true') return;

        let state = createWizardState();

        function focusHeading() {
            const heading = app.querySelector('.jb-support-screen-heading');
            if (heading) heading.focus();
        }

        function renderApp() {
            app.innerHTML = render(state);
            if (state.view === 'prepared') {
                const link = app.querySelector('#jbSupportWhatsApp');
                const contact = doc.getElementById('jbBackupGateLink');
                const url = getWhatsAppUrl(state.message, contact);
                if (link && url) link.href = url;
                else if (link) {
                    link.removeAttribute('href');
                    link.textContent = 'Canal de WhatsApp no disponible';
                    link.setAttribute('aria-disabled', 'true');
                    const status = app.querySelector('#jbSupportStatus');
                    if (status) status.textContent = 'No se encontró un canal de WhatsApp configurado. Puedes copiar el texto y enviarlo por el canal habitual.';
                }
            }
            focusHeading();
        }

        function transition(next) {
            state = next;
            renderApp();
        }

        function start(flow, preserve) {
            transition(startFlow(state, flow, preserve));
        }

        function goToContact() {
            start('contact', true);
        }

        function showCopyFailure(error, status, field) {
            console.error('No se pudo copiar el mensaje de soporte:', error);
            if (status) status.textContent = 'No se pudo copiar automáticamente. Selecciona y copia el texto del recuadro.';
            if (field) {
                field.focus();
                field.select();
            }
        }

        function tryOpenWhatsApp(message) {
            const contact = doc.getElementById('jbBackupGateLink');
            const url = getWhatsAppUrl(message, contact);
            if (!url) return 'unavailable';
            if (!win || typeof win.open !== 'function') return 'blocked';
            try {
                const opened = win.open(url, '_blank');
                if (!opened) return 'blocked';
                try {
                    opened.opener = null;
                } catch (error) {
                    console.error('No se pudo aislar la pestaña de WhatsApp:', error);
                }
                return 'opened';
            } catch (error) {
                console.error('No se pudo abrir WhatsApp:', error);
                return 'blocked';
            }
        }

        function prepareMessage(flow) {
            let customText = '';
            if (flow === 'issue') {
                const report = app.querySelector('#jbSupportReportText');
                const errorText = app.querySelector('#jbSupportErrorText');
                const descriptionCheck = validateText(report ? report.value : '', 2000);
                const extraError = String(errorText ? errorText.value : '').trim();
                if (!descriptionCheck.valid) {
                    const error = app.querySelector('#jbSupportError');
                    if (error) error.textContent = descriptionCheck.error;
                    return;
                }
                if (extraError && !validateText(extraError, 500).valid) {
                    const error = app.querySelector('#jbSupportError');
                    if (error) error.textContent = validateText(extraError, 500).error;
                    return;
                }
                state.answers.reportText = descriptionCheck.value;
                state.answers.errorText = extraError;
                customText = descriptionCheck.value;
            } else if (flow === 'change') {
                const field = app.querySelector('#jbSupportChangeText');
                const checked = validateText(field ? field.value : '', 1600);
                if (!checked.valid) {
                    const error = app.querySelector('#jbSupportError');
                    if (error) error.textContent = checked.error;
                    return;
                }
                state.answers.changeDescription = checked.value;
                customText = checked.value;
            } else {
                const field = app.querySelector('#jbSupportContactMessage');
                customText = String(field ? field.value : '').trim();
                if (customText && !validateText(customText, 1400).valid) {
                    const error = app.querySelector('#jbSupportError');
                    if (error) error.textContent = validateText(customText, 1400).error;
                    return;
                }
                state.answers.contactMessage = customText;
            }
            let messageText = customText;
            if (flow === 'issue' && classifyRequest(customText).category === 'mixed') {
                state.answers.mixedDetected = true;
                const separateImprovementField = app.querySelector('#jbSupportSeparateImprovement');
                const mixedParts = splitMixedRequest(customText);
                state.answers.separateImprovement = String(separateImprovementField ? separateImprovementField.value : '').trim()
                    || (mixedParts ? mixedParts.improvement : '');
                const summaryAnswers = Object.assign({}, state.answers, { reportText: '' });
                if (mixedParts) {
                    summaryAnswers.symptom = mixedParts.issue;
                    summaryAnswers.symptomOther = '';
                    summaryAnswers.otherProblem = '';
                    summaryAnswers.pendingIssueDescription = '';
                } else if (classifyRequest(summaryAnswers.symptomOther || summaryAnswers.otherProblem || '').category === 'mixed') {
                    summaryAnswers.symptomOther = '';
                    summaryAnswers.otherProblem = 'El problema indicado requiere revisión.';
                    summaryAnswers.pendingIssueDescription = '';
                }
                messageText = buildIssueSummary(summaryAnswers);
            }
            const message = buildMessage(state, messageText);
            if (encodeURIComponent(message).length > 6000) {
                const error = app.querySelector('#jbSupportError');
                if (error) error.textContent = 'El resumen es demasiado largo para prepararlo en WhatsApp. Acórtalo e inténtalo nuevamente.';
                return;
            }
            state = Object.assign({}, state, {
                view: 'prepared',
                preparedFrom: { flow: state.flow, step: state.step },
                message,
                launchStatus: tryOpenWhatsApp(message)
            });
            renderApp();
        }

        function handleChoice(choice) {
            if (choice.startsWith('start:')) {
                start(choice.split(':')[1], false);
                return;
            }
            if (choice.startsWith('exit:')) {
                transition(choice.endsWith('cancel') ? cancelExit(state) : confirmExit(state));
                return;
            }
            if (choice.startsWith('issue:')) {
                const issue = choice.split(':')[1];
                const item = ISSUE_TYPES.find(option => option.id === issue);
                const updates = {
                    issue,
                    issueLabel: item ? item.label : 'Otro problema',
                    symptom: '',
                    symptomOther: '',
                    otherProblem: '',
                    check: '',
                    outcome: '',
                    reportText: '',
                    errorText: ''
                };
                transition(advance(state, issue === 'other' ? 'other-details' : 'symptom', updates));
                return;
            }
            if (choice.startsWith('symptom:')) {
                const value = choice.slice('symptom:'.length);
                if (value === 'other') {
                    transition(advance(state, 'symptom-other'));
                    return;
                }
                const symptomOptions = SYMPTOMS[state.answers.issue];
                const symptom = symptomOptions && symptomOptions.options[Number(value)];
                if (!symptom) return;
                transition(advance(state, 'check', { symptom, symptomOther: '' }));
                return;
            }
            if (choice.startsWith('check:')) {
                transition(advance(state, 'outcome', { check: choice.split(':')[1] }));
                return;
            }
            if (choice.startsWith('outcome:')) {
                const outcome = choice.split(':')[1];
                if (outcome === 'yes') {
                    state = Object.assign({}, state, { view: 'done', message: 'Según lo que indicaste, ahora funciona. Si vuelve a fallar, puedes preparar un reporte para Diego.' });
                    renderApp();
                } else {
                    transition(advance(state, 'review', { outcome }));
                }
                return;
            }
            if (choice.startsWith('help:')) {
                const topic = choice.split(':')[1];
                if (topic === 'contact') {
                    goToContact();
                } else if (topic === 'issue') {
                    const issue = {
                        login: 'login',
                        agenda: 'agenda',
                        clients: 'clients',
                        stats: 'stats',
                        assistant: 'assistant',
                        android: 'android'
                    }[state.answers.helpTopic];
                    if (issue) {
                        state = Object.assign({}, startFlow(state, 'issue', true), {
                            step: 'symptom',
                            answers: Object.assign({}, state.answers, { issue })
                        });
                        renderApp();
                    } else start('issue', true);
                } else if (topic === 'done') {
                    state = Object.assign({}, state, { view: 'done', message: 'Me alegra que la orientación te haya servido.' });
                    renderApp();
                } else if (topic === 'other') {
                    transition(advance(state, 'help-question', { helpTopic: topic }));
                } else {
                    transition(advance(state, 'help-answer', { helpTopic: topic, helpAnswer: HELP_ANSWERS[topic] }));
                }
                return;
            }
            if (choice.startsWith('change:')) {
                transition(advance(state, 'change-details', { changeType: choice.split(':')[1] }));
                return;
            }
            if (choice === 'change-clarify:issue') {
                const next = startFlow(state, 'issue', true);
                next.answers.pendingIssueDescription = state.answers.changeDescription || '';
                state = next;
                renderApp();
                return;
            }
            if (choice === 'change-clarify:quote') {
                transition(Object.assign({}, state, {
                    answers: Object.assign({}, state.answers, { changeClarification: 'quote' })
                }));
                renderApp();
            }
        }

        app.addEventListener('click', event => {
            const choiceButton = event.target.closest('[data-choice]');
            if (choiceButton) {
                handleChoice(choiceButton.dataset.choice);
                return;
            }

            const actionButton = event.target.closest('[data-action]');
            if (!actionButton) return;
            const action = actionButton.dataset.action;
            if (action === 'open-whatsapp') {
                event.preventDefault();
                const launchStatus = tryOpenWhatsApp(state.message);
                state = Object.assign({}, state, { launchStatus });
                renderApp();
                return;
            }
            if (action === 'back') {
                if (state.view === 'prepared' && state.preparedFrom) {
                    transition(Object.assign({}, state, {
                        view: 'step',
                        flow: state.preparedFrom.flow,
                        step: state.preparedFrom.step
                    }));
                } else if (state.history.length) transition(goBack(state));
                else transition(requestExit(state));
            } else if (action === 'exit') {
                transition(requestExit(state));
            } else if (action === 'home') {
                transition(createWizardState());
            } else if (action === 'start-contact') {
                goToContact();
            } else if (action === 'contact') {
                goToContact();
            } else if (action === 'quote-mixed') {
                state = Object.assign({}, startFlow(state, 'change', true), {
                    step: 'change-details',
                    answers: Object.assign({}, state.answers, {
                        changeType: 'feature',
                        changeDescription: state.answers.separateImprovement || '',
                        mixedDetected: false
                    })
                });
                renderApp();
            } else if (action === 'continue-detail') {
                const field = app.querySelector('[data-field=\"otherProblem\"], [data-field=\"symptomOther\"]');
                const checked = validateText(field ? field.value : '', 1000);
                if (!checked.valid) {
                    app.querySelector('#jbSupportError').textContent = checked.error;
                    return;
                }
                const isOther = state.step === 'other-details';
                transition(advance(state, isOther ? 'check' : 'check', isOther ? { otherProblem: checked.value } : { symptomOther: checked.value }));
            } else if (action === 'answer-question') {
                const field = app.querySelector('[data-field=\"helpQuestion\"]');
                const checked = validateText(field ? field.value : '', 1200);
                if (!checked.valid) {
                    app.querySelector('#jbSupportError').textContent = checked.error;
                    return;
                }
                const response = answerQuestion(checked.value);
                transition(advance(state, 'help-answer', { helpQuestion: checked.value, helpAnswer: response }));
            } else if (action === 'prepare-issue') {
                prepareMessage('issue');
            } else if (action === 'prepare-change') {
                const field = app.querySelector('#jbSupportChangeText');
                const checked = validateText(field ? field.value : '', 1600);
                if (!checked.valid) {
                    const error = app.querySelector('#jbSupportError');
                    if (error) error.textContent = checked.error;
                    return;
                }
                const classification = classifyChangeRequest(state.answers.changeType, checked.value, state.answers.changeClarification);
                if (classification.category === 'mixed' || classification.category === 'technical') {
                    const mixedParts = classification.category === 'mixed' ? splitMixedRequest(checked.value) : null;
                    state = Object.assign({}, startFlow(state, 'issue', true), {
                        step: 'issue-type',
                        answers: Object.assign({}, state.answers, {
                            mixedDetected: classification.category === 'mixed',
                            pendingIssueDescription: mixedParts ? mixedParts.issue : classification.category === 'technical' ? checked.value : '',
                            separateImprovement: mixedParts ? mixedParts.improvement : ''
                        })
                    });
                    renderApp();
                } else {
                    prepareMessage('change');
                }
            } else if (action === 'prepare-contact') {
                prepareMessage('contact');
            } else if (action === 'copy-message') {
                const status = app.querySelector('#jbSupportStatus');
                const field = app.querySelector('#jbSupportCopyText');
                if (win && win.navigator && win.navigator.clipboard && win.navigator.clipboard.writeText) {
                    try {
                        win.navigator.clipboard.writeText(state.message).then(() => {
                            if (status) status.textContent = 'Texto copiado. Aún debes abrir WhatsApp y enviarlo manualmente.';
                        }).catch(error => showCopyFailure(error, status, field));
                    } catch (error) {
                        showCopyFailure(error, status, field);
                    }
                } else if (field) {
                    field.focus();
                    field.select();
                    if (status) status.textContent = 'Seleccionamos el texto para que puedas copiarlo manualmente.';
                }
            }
        });

        app.addEventListener('input', event => {
            const field = event.target.closest('[data-field]');
            if (!field) return;
            state.answers[field.dataset.field] = field.value;
            if (field.dataset.field === 'changeDescription') {
                const notice = app.querySelector('#jbSupportChangeNotice');
                const result = classifyChangeRequest(state.answers.changeType, field.value, state.answers.changeClarification);
                if (notice) {
                    notice.hidden = result.category !== 'mixed';
                    notice.innerHTML = result.category === 'mixed'
                        ? `${iconMarkup('alert')}<span>Tu descripción parece incluir un fallo y una mejora. El mensaje los señalará para que se revisen por separado.</span>`
                        : '';
                }
                const guidance = app.querySelector('#jbSupportChangeGuidance');
                if (guidance) guidance.innerHTML = `${iconMarkup('settings')}<span>${escapeHtml(getChangeGuidance(state.answers.changeType, result.category))}</span>`;
                const prepareButton = app.querySelector('[data-action="prepare-change"]');
                if (prepareButton) {
                    prepareButton.disabled = result.category === 'other';
                    const buttonLabel = result.category === 'improvement' || result.category === 'design'
                        ? 'Solicitar evaluación y cotización'
                        : getChangeActionLabel(result.category);
                    prepareButton.innerHTML = `${iconMarkup(optionIcon(`change:${state.answers.changeType}`, buttonLabel))}<span>${escapeHtml(buttonLabel)}</span>`;
                }
                const clarifyingChoices = app.querySelector('#jbSupportClarifyingChoices');
                if (clarifyingChoices) clarifyingChoices.hidden = result.category !== 'other';
                const actionNote = app.querySelector('#jbSupportChangeActionNote');
                if (actionNote) {
                    actionNote.textContent = result.category === 'improvement' || result.category === 'design'
                        ? ''
                        : result.category === 'other'
                            ? 'Aclaremos primero si algo dejó de funcionar o si quieres agregar algo.'
                            : getChangeGuidance(state.answers.changeType, result.category);
                }
            }
        });

        app.dataset.supportInitialized = 'true';
        renderApp();
    }

    return {
        SERVICE_POLICY,
        ISSUE_TYPES,
        SYMPTOMS,
        HELP_TOPICS,
        CHANGE_TYPES,
        normalizeText,
        classifyRequest,
        classifyChangeRequest,
        answerQuestion,
        validateText,
        validateRequest,
        createWizardState,
        startFlow,
        advance,
        goBack,
        requestExit,
        cancelExit,
        confirmExit,
        buildIssueSummary,
        buildMessage,
        render,
        iconMarkup,
        getWhatsAppUrl,
        getIssueCheckGuidance,
        init
    };
});

if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => window.JBSupport.init(document, window));
    } else {
        window.JBSupport.init(document, window);
    }
}
