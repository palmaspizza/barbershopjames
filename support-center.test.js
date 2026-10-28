const assert = require('node:assert/strict');
const test = require('node:test');
const support = require('./support-center.js');

const classificationCases = [
    ['La agenda no carga', 'technical'],
    ['La agenda no muestra las reservas', 'technical'],
    ['No se guardan las reservas', 'technical'],
    ['Quiero añadir una nueva función', 'improvement'],
    ['Cambia el diseño del panel', 'design'],
    ['Necesito que edites un reel', 'design'],
    ['AgendaPro tiene una función que yo quiero', 'commercial'],
    ['No funciona', 'ambiguous'],
    ['Quiero cambiar la hora de una reserva existente', 'usage'],
    ['La agenda falla y además quiero un filtro nuevo', 'mixed'],
    ['La agenda no carga y también quiero cambiar el diseño del panel', 'mixed'],
    ['¿Qué incluye la mantención mensual?', 'service'],
    ['La página funciona, pero quiero cambiar los colores', 'design'],
    ['No puedo acceder al administrador', 'technical'],
    ['No puedo utilizar la galería de trabajos', 'ambiguous'],
    ['La página está lenta', 'technical'],
    ['Quiero que el bot envíe mensajes nuevos por WhatsApp', 'improvement'],
    ['Modificar cómo funciona una sección', 'improvement'],
    ['La agenda no carja y no veo las reserbas', 'technical'],
    ['La agenda falla. Me corrijo: sí funciona, quiero un filtro nuevo', 'improvement'],
    ['No llegan las notificaciones web push', 'ambiguous'],
    ['La reserva aparece duplicada en la agenda', 'technical'],
    ['Falta una reserva concreta', 'technical'],
    ['Me faltan datos de un cliente', 'technical'],
    ['No puedo iniciar sesión porque dice que no tengo permisos', 'technical']
];

for (const [message, expected] of classificationCases) {
    test(`clasifica de forma conservadora: ${message}`, () => {
        assert.equal(support.classifyRequest(message).category, expected);
    });
}

test('solicitud vacía queda pendiente de aclaración', () => {
    assert.equal(support.classifyRequest('   ').category, 'ambiguous');
});

test('orienta sobre alcance, tarifa y horarios configurados', () => {
    const serviceAnswer = support.answerQuestion('¿Qué incluye la mantención mensual?').join(' ');
    assert.match(serviceAnswer, /\$20\.000 CLP mensuales/);
    assert.match(serviceAnswer, /alcance contratado/);
    assert.match(serviceAnswer, /America\/Santiago/);
});

test('orienta las nuevas funciones sin inventar precio ni fecha', () => {
    const answer = support.answerQuestion('Quiero añadir una nueva función').join(' ');
    assert.match(answer, /evalúan y cotizan por separado/);
    assert.match(answer, /No se genera una cotización ni una fecha/);
});

test('separa la orientación de incidencias y mejoras en una solicitud mixta', () => {
    assert.match(support.answerQuestion('La agenda falla y además quiero un filtro nuevo').join(' '), /describirlos por separado/);
});

test('no inventa instrucciones sobre una función desconocida', () => {
    assert.match(support.answerQuestion('¿Cómo se cambian los permisos internos de Firebase?'), /No tengo información suficiente/);
});

test('proporciona instrucciones de agenda basadas en elementos reales del panel', () => {
    assert.match(support.answerQuestion('¿Cómo reviso la agenda?').join(' '), /Calendario de Reservas/);
});

test('incluye una orientación segura para el aviso de respaldo existente', () => {
    const backupTopic = support.HELP_TOPICS.find(item => item.id === 'backup');
    assert.ok(backupTopic);
    const answer = support.answerQuestion('¿Cómo envío el aviso anual de copia de seguridad?').join(' ');
    assert.match(answer, /Ya envié el aviso/);
    assert.match(answer, /no elimines ni modifiques datos/);
});

test('explica el horario de reservas sin confundirlo con el horario de soporte', () => {
    const answer = support.HELP_TOPICS.find(item => item.id === 'hours');
    assert.ok(answer);
    assert.match(support.answerQuestion('¿Cuándo responde Palma Codes?').join(' '), /atención humana/);
});

test('valida campos requeridos, límites y datos sensibles', () => {
    assert.equal(support.validateRequest({ subject: '', description: 'Una descripción completa' }).valid, false);
    assert.equal(support.validateRequest({ subject: 'Error', description: 'Falla' }).valid, false);
    assert.equal(support.validateRequest({ subject: 'A'.repeat(121), description: 'Descripción suficientemente larga' }).valid, false);
    assert.equal(support.validateRequest({ subject: 'Error', description: 'Descripción suficientemente larga', steps: 'x'.repeat(801) }).valid, false);
    assert.equal(support.validateRequest({ subject: 'Error', description: 'Descripción suficientemente larga' }).valid, true);
    assert.equal(support.validateText('Mi password: secreto123 no funciona', 100).valid, false);
    assert.equal(support.validateText('La tarjeta 4111 1111 1111 1111 falló', 100).valid, false);
    assert.equal(support.validateText('El cliente llamó al +56 9 1234 5678 por una reserva', 100).valid, false);
    assert.equal(support.validateText('El correo del cliente es cliente@example.com', 100).valid, false);
    assert.equal(support.validateText('Mi PIN es 1234 y no puedo entrar', 100).valid, false);
    assert.equal(support.validateText('El emoji está mal formado: \uD800 y falla', 100).valid, true);
});

test('normaliza etiquetas y scripts como texto, sin tratarlos como código', () => {
    const input = '<script>alert(1)</script> La agenda no carga';
    assert.equal(support.classifyRequest(input).category, 'technical');
    assert.equal(support.validateText(input, 1000).valid, true);
    assert.match(support.validateText(input, 1000).value, /<script>/);
});

test('rechaza mensajes extremadamente largos', () => {
    assert.equal(support.validateText('x'.repeat(2001), 2000).valid, false);
});

test('al volver conserva las respuestas anteriores', () => {
    let state = support.startFlow(support.createWizardState(), 'issue');
    state = support.advance(state, 'symptom', { issue: 'agenda' });
    state = support.advance(state, 'check', { symptom: 'Falta una reserva concreta' });
    state = support.goBack(state);
    assert.equal(state.step, 'symptom');
    assert.equal(state.answers.issue, 'agenda');
    assert.equal(state.answers.symptom, 'Falta una reserva concreta');
});

test('salir se puede cancelar sin perder respuestas y confirmar descarta el recorrido', () => {
    let state = support.startFlow(support.createWizardState(), 'change');
    state = support.advance(state, 'change-details', { changeType: 'feature', changeDescription: 'Un filtro para el calendario' });
    const confirmation = support.requestExit(state);
    assert.equal(confirmation.view, 'confirm-exit');
    assert.equal(support.cancelExit(confirmation).answers.changeDescription, 'Un filtro para el calendario');
    assert.deepEqual(support.confirmExit(confirmation), support.createWizardState());
});

test('pasar desde una orientación a Diego conserva el tema para poder volver', () => {
    let state = support.startFlow(support.createWizardState(), 'help');
    state = support.advance(state, 'help-answer', { helpTopic: 'agenda' });
    state = support.startFlow(state, 'contact', true);
    assert.equal(state.flow, 'contact');
    state = support.goBack(state);
    assert.equal(state.flow, 'help');
    assert.equal(state.step, 'help-answer');
    assert.equal(state.answers.helpTopic, 'agenda');
});

test('el resumen de incidencia indica comprobación y resultado sin afirmar que se guardó', () => {
    const summary = support.buildIssueSummary({ issue: 'agenda', symptom: 'Falta una reserva', check: 'tried', outcome: 'no' });
    assert.match(summary, /Calendario de Reservas/);
    assert.match(summary, /Comprobaciones realizadas: se realizó la comprobación indicada/);
    assert.match(summary, /sigue fallando/);
});

test('el resumen conserva el contexto técnico separado de una solicitud mixta', () => {
    const summary = support.buildIssueSummary({
        issue: 'agenda',
        symptom: 'No aparece ninguna reserva',
        pendingIssueDescription: 'La agenda no carga'
    });
    assert.match(summary, /Detalle adicional: La agenda no carga/);
    assert.doesNotMatch(summary, /filtro nuevo/);
});

test('no recomienda repetir acciones que pueden duplicar reservas ni borrar datos Android', () => {
    const duplicateGuidance = support.getIssueCheckGuidance({
        issue: 'agenda',
        symptom: 'Una reserva aparece duplicada'
    });
    assert.match(duplicateGuidance, /No vuelvas a guardar ni cancelar/);
    assert.doesNotMatch(duplicateGuidance, /recargar la página/);
    assert.match(support.getIssueCheckGuidance({ issue: 'android' }), /No borres datos/);
});

test('los mensajes comerciales distinguen una mejora de una incidencia', () => {
    let state = support.startFlow(support.createWizardState(), 'change');
    state = support.advance(state, 'change-details', { changeType: 'feature' });
    const message = support.buildMessage(state, 'Agregar un nuevo filtro a la agenda');
    assert.match(message, /Mejora adicional por evaluar/);
    assert.match(message, /no implica aceptar el desarrollo/);
});

test('la clasificación de mejora identifica una incidencia mixta', () => {
    const result = support.classifyChangeRequest('workflow', 'La agenda no muestra las reservas y también quiero agregar un filtro nuevo.');
    assert.equal(result.category, 'mixed');
});

test('una falla descrita en el flujo de mejora no se convierte en una solicitud mixta sin evidencia', () => {
    assert.equal(support.classifyChangeRequest('workflow', 'La agenda no muestra las reservas').category, 'technical');
    assert.equal(support.classifyChangeRequest('workflow', '¿Cómo cambio la hora de una reserva?').category, 'usage');
    assert.equal(support.classifyChangeRequest('other', 'No sé bien cómo explicarlo').category, 'other');
    assert.equal(support.classifyChangeRequest('video', 'Editar un reel para Instagram').category, 'design');
    const usageState = support.startFlow(support.createWizardState(), 'change');
    const usageMessage = support.buildMessage(
        support.advance(usageState, 'change-details', { changeType: 'workflow' }),
        '¿Cómo cambio la hora de una reserva?'
    );
    assert.match(usageMessage, /no una solicitud confirmada de desarrollo adicional/);
    assert.doesNotMatch(usageMessage, /cotizan por separado/);
    assert.equal(support.classifyChangeRequest('feature', 'No sé qué pedir', 'quote').category, 'improvement');
});

test('el mensaje de incidencia separa explícitamente una mejora mencionada en el resumen', () => {
    const state = support.startFlow(support.createWizardState(), 'issue');
    const message = support.buildMessage(state, 'La agenda no carga y también quiero agregar un filtro nuevo.');
    assert.match(message, /solicitud mixta/i);
    assert.match(message, /Problema: La agenda no carga/);
    assert.doesNotMatch(message, /agregar un filtro nuevo/);
});

test('las áreas incluidas de clientes y Android incluyen orientaciones prudentes', () => {
    for (const id of ['clients', 'android']) {
        assert.ok(support.ISSUE_TYPES.some(item => item.id === id));
        const options = support.SYMPTOMS[id].options;
        assert.ok(options[options.length - 1].includes('mis palabras'));
    }
    assert.ok(!support.ISSUE_TYPES.some(item => ['gallery', 'notifications'].includes(item.id)));
    assert.ok(!support.HELP_TOPICS.some(item => ['gallery', 'notifications'].includes(item.id)));
    assert.match(support.answerQuestion('¿Qué hago si faltan datos de un cliente?').join(' '), /No incluyas nombres, teléfonos/);
    assert.match(support.answerQuestion('¿Cómo arreglo las notificaciones web push?').join(' '), /no tengo una guía verificada para esta función en el plan actual/i);
    assert.match(support.answerQuestion('¿Cómo funciona la app Android?').join(' '), /Diego debe confirmar/);
});

test('el contacto directo adjunta el contexto de la consulta ya recopilado', () => {
    let state = support.startFlow(support.createWizardState(), 'contact');
    state = support.advance(state, 'contact-message', {
        helpTopic: 'agenda',
        reportText: 'La agenda no muestra las reservas.',
        errorText: 'Mensaje temporal',
        outcome: 'unsure'
    });
    const message = support.buildMessage(state, 'Necesito hablar con Diego.');
    assert.match(message, /Resumen del problema: La agenda no muestra las reservas/);
    assert.match(message, /Mensaje de error: Mensaje temporal/);
    assert.match(message, /Resultado indicado: no está seguro/);
});

test('el contacto libre etiqueta y separa una solicitud mixta', () => {
    const state = support.startFlow(support.createWizardState(), 'contact');
    const message = support.buildMessage(
        support.advance(state, 'contact-message', {}),
        'La agenda no carga y también quiero agregar un filtro nuevo.'
    );
    assert.match(message, /Tipo: Dos temas por revisar por separado/);
    assert.match(message, /Separar al revisar/);
    assert.match(message, /cobertura contractual/);
});

test('el reporte de mantención incluye negocio, sección, resultado y clasificación provisional', () => {
    const state = support.advance(
        support.startFlow(support.createWizardState(), 'issue'),
        'review',
        { issue: 'agenda', symptom: 'No aparece ninguna reserva', check: 'tried', outcome: 'no' }
    );
    const message = support.buildMessage(state);
    assert.match(message, /posible problema de mantención de Barbería James/);
    assert.match(message, /Clasificación provisional: posible incidencia de mantención/);
    assert.match(message, /Sección afectada: Calendario de Reservas/);
    assert.match(message, /Problema: No aparece ninguna reserva/);
    assert.match(message, /Resultado esperado:/);
    assert.match(message, /Comprobaciones realizadas: se realizó/);
    assert.match(message, /Resultado observado: sigue fallando/);
    assert.match(message, /confirmar el diagnóstico y si corresponde a la mantención vigente/);
    assert.doesNotMatch(message, /(?:4111|cliente@example\.com|\+56 9 1234)/);
});

test('los mensajes eliminan detalles vacíos y nunca contienen marcadores de plantilla', () => {
    const message = support.buildMessage(
        support.advance(support.startFlow(support.createWizardState(), 'issue'), 'review', {
            issue: 'stats',
            symptom: 'El total no aparece actualizado',
            check: 'skip',
            outcome: 'unsure'
        })
    );
    assert.doesNotMatch(message, /\[[^\]]+\]/);
    assert.doesNotMatch(message, /Mensaje de error:/);
    assert.match(message, /Estadísticas e ingresos/);
});

test('los botones del asistente llevan SVG decorativos y no ofrecen funciones fuera del plan', () => {
    const markup = support.render(support.createWizardState());
    assert.equal((markup.match(/class="jb-support-icon"/g) || []).length, 5);
    assert.match(markup, /aria-hidden="true"/);
    assert.doesNotMatch(markup, /galer[ií]a|notificaciones|push/i);
});

test('solo prepara enlaces del dominio real de WhatsApp', () => {
    const message = 'Hola Diego, consulta: áéíóú ñ ¿sí?\nLínea & signo';
    const safe = support.getWhatsAppUrl(message, { href: 'https://wa.me/56954998792?text=anterior' });
    assert.equal(new URL(safe).searchParams.get('text'), message);
    assert.equal(new URL(safe).pathname, '/56954998792');
    assert.equal(support.getWhatsAppUrl(message, { href: 'https://example.com/contact' }), null);
    assert.equal(support.getWhatsAppUrl(message, { href: 'https://evil.wa.me/56954998792' }), null);
    assert.equal(support.getWhatsAppUrl(message, { href: 'https://wa.me/' }), null);
    assert.equal(support.getWhatsAppUrl(message, { href: 'https://wa.me/1234' }), null);
    assert.equal(support.getWhatsAppUrl(message, { href: 'https://wa.me/00000000000' }), null);
    assert.equal(support.getWhatsAppUrl(message, null), null);
});

test('no inventa probabilidades ni confirma cobertura contractual', () => {
    const result = support.classifyRequest('La agenda no carga');
    assert.match(result.reason, /alcance aún deben revisarse/);
    assert.equal(Object.hasOwn(result, 'confidence'), false);
});
