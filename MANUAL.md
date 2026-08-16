# User Manual — PSR Biosafety Assessment Tool

*(Español más abajo / Spanish below)*

**Software version:** 2.0.0 · **Schema version:** 2.0.0 · **Algorithm version:** 2.0.1<br>
**Version DOI:** [10.5281/zenodo.21964810](https://doi.org/10.5281/zenodo.21964810)

## 1. Which interface should I use?

| | `tool.html` | `platform.html` |
|---|---|---|
| Best for | A single, one-off assessment | Ongoing use, multiple assessments, multiple evaluators |
| Data storage | Nothing saved — export when done | Saved in the browser (persists between visits) |
| Works offline | Yes, fully | Yes (browser storage is local, not synced) |
| Study/IRR metadata | Not collected | Collected (Study ID, Scenario ID, Rater ID, Institution ID) |
| Dashboard / list of past assessments | No | Yes |
| Load demonstration examples | No | Yes (`Load S3/S4 examples`) |

`analytics.html` reads whatever assessments exist in the platform's local storage (plus the 14 built-in demonstration records) and is only useful after you've created assessments in `platform.html`.

> **Important:** "saved in the browser" means the data lives in that browser's local storage on that device only. It is **not** uploaded anywhere, not shared between devices, and will be lost if the browser storage is cleared. Export regularly (JSON or CSV) if you need a backup.

## 2. The 8-step workflow

Both `tool.html` and `platform.html` walk through the same 8 steps; the platform additionally stores metadata for institutional traceability.

1. **Agent identification** — Name the agent, pick a classification source (WHO/BMBL/EU/INSST/other), assign Risk Group (RG1–4). If RG3, you can optionally document the RG3\* Table 8 operational condition (replication incompetence, confirmed absence of airborne transmissibility, or validated inactivation) — this is *not* a separate Risk Group, just a Table 8 lookup key, and it requires a stated basis plus supporting evidence to take effect.
2. **Procedure characterization** — List every technical procedure, rate its aerosol-generation potential, working volume, and concentration (Low/Moderate/High, or "cannot be characterized" for aerosol).
3. **PSR classification** — Automatic: each procedure's PSR (Low/Moderate/High) is the *highest* of its three parameters. This step cannot be overridden manually.
4. **Modulating factors** — Rate 9 procedural modulators (volume, concentration, frequency, aerosol, stability, experience, supervision, infrastructure, incidents) as favorable/neutral/unfavorable. **≥2 unfavorable factors** triggers a professional-consideration flag for containment escalation later — it does **not** change the Step 3 PSR. Individual susceptibility (e.g. immunocompromised personnel) is recorded separately here and never counts toward that ≥2 threshold — it's a severity-of-consequence issue for the individual, addressed through occupational health, not a likelihood modifier.
5. **Likelihood × Severity** — Baseline severity comes from the Risk Group. You may optionally apply a *documented reduction* (never an increase) to effective severity if you can cite a valid basis, justification, and evidence (see the FAQ below). Then select a likelihood within the range implied by the Step 3 PSR (shifted up one category if ≥2 unfavorable factors were flagged in Step 4). **If the range has more than one valid option, you must write a justification before the "Integration result" (Severity × Likelihood) will compute** — otherwise it shows `—`.
6. **BSL assignment** — The Agent(-notation)–PSR combination is looked up in Table 8 automatically. If the matrix output requires escalation consideration or offers more than one option (e.g. `BSL-2+/BSL-3` for RG3\*, or the RG3-Low-BSL-2+ pathway requiring all four documented conditions), you make and document the final professional decision here. **PAUSE POINT** notices appear when the Risk Group isn't established, aerosol potential can't be characterized, or the result is BSL-3/4 or Very High/Critical overall risk — these require full institutional/IBC review.
7. **Control selection** — Engineering controls, PPE (including regional respiratory-protection standard equivalence — NIOSH N95/N99/N100 vs EN 149 FFP2/FFP3), administrative controls, and decontamination/waste inactivation are suggested based on the assigned BSL/control profile. The decontamination list automatically flags environmentally stable / non-enveloped agents (spore-formers, prions, non-enveloped viruses) as requiring a validated sporicidal/virucidal disinfectant rather than plain ethanol.
8. **Documentation** — Assessor, date, next review date (≤12 months), workflow status, and (in the platform) institutional approval fields. Export as a bilingual PDF (print) or plain-text report. Export/print is blocked if there's an unresolved pause point, a missing escalation justification, or incomplete BSL-2+ conditions for the RG3-Low pathway — the app will jump you back to the relevant step.

## 3. Formal Inter-Rater Reliability (IRR) — `analytics.html`

The **Formal IRR** panel only includes assessments that are:
- `dataOrigin = study` (not "individual" or "demonstration")
- **Finalized** (not left as draft)
- Fully tagged with Study ID, Scenario ID, Scenario version, Rater ID, and Institution ID

If two records share the same Study+Scenario+Version but the same rater filed both, that's flagged as a **duplicate** and blocks the calculation until resolved.

- **Cohen's κ** compares two chosen raters pairwise across their shared scenarios.
- **Fleiss' κ** (the primary metric for ≥3 raters) requires the *exact same* rater panel to have rated *every* scenario — missing ratings are never padded or estimated. If your panel is uneven, the tool tells you exactly which scenario is missing which rater.

To generate valid IRR data: in `platform.html`, set **Data origin → Formal study** in Step 1's "Assessment metadata" section for every assessment that's part of the study, fill in all five identifiers consistently, and finalize each one (Step 8 → Workflow status → *Finalized by assessor* or later).

## 4. Import / Export

- **Platform → Export all assessments as CSV**: for statistical analysis in R/Python/Excel.
- **Analytics → Export dataset**: canonical JSON, re-importable.
- **Analytics → Import CSV/JSON**: only accepts the tool's own canonical schema (current `schemaVersion`) — it will reject files that don't match, rather than silently misreading them.
- Records created with an older schema/algorithm version are still viewable but are flagged as not eligible for formal IRR until you confirm/re-finalize them under the current version.

## 5. FAQ

**"Selected likelihood shows a value but the Integration result is blank (`—`)."**
Normal, if the likelihood range has more than one option: you must also fill the "Professional justification for likelihood selection" textbox and click away from it (the field saves on blur, not on every keystroke). Once both are set, the result computes.

**"What does 'Apply a documented modification to effective severity' do?"**
Lets you *lower* (never raise) the severity below the Risk Group's baseline (RG1=Low, RG2=Moderate, RG3=High, RG4=Extreme), but only if you provide all of: a recognized basis (non-airborne transmission confirmed / effective treatment or PEP available / validated inactivation / other), a written justification, and supporting evidence. Missing any of the four silently reverts to the baseline severity. This is separate from "Individual susceptibility" in Step 4, which addresses personnel-level risk, not the agent's intrinsic severity.

**"Why is the workflow status just a personal note — does it need institutional sign-off?"**
Yes. The software only *records* what you enter (e.g. "Institutionally approved — user-recorded"); it does not verify or grant approval on behalf of any institution. Actual sign-off must happen through your institutional biosafety committee.

**"I don't see the Formal IRR panel doing anything."**
Check that every assessment you expect to compare has `dataOrigin = study`, all five identifiers, and a finalized workflow status. Individual and demonstration-origin records are excluded by design.

---

# Manual de uso — Herramienta de Evaluación de Bioseguridad PSR

**Versión del software:** 2.0.0 · **Versión del esquema:** 2.0.0 · **Versión del algoritmo:** 2.0.1<br>
**DOI de la versión:** [10.5281/zenodo.21964810](https://doi.org/10.5281/zenodo.21964810)

## 1. ¿Qué interfaz debo usar?

| | `tool.html` | `platform.html` |
|---|---|---|
| Ideal para | Una evaluación puntual | Uso continuado, varias evaluaciones, varios evaluadores |
| Almacenamiento | Nada se guarda — exporta al terminar | Guardado en el navegador (persiste entre visitas) |
| Funciona sin conexión | Sí, completamente | Sí (el almacenamiento es local, no se sincroniza) |
| Metadatos de estudio/IRR | No se recogen | Sí (ID de estudio, de escenario, de evaluador, de institución) |
| Panel con evaluaciones anteriores | No | Sí |
| Cargar ejemplos de demostración | No | Sí (`Cargar ejemplos S3/S4`) |

`analytics.html` lee las evaluaciones que existan en el almacenamiento local de la plataforma (más los 14 registros de demostración integrados), así que solo resulta útil después de haber creado evaluaciones en `platform.html`.

> **Importante:** "guardado en el navegador" significa que los datos viven en el almacenamiento local de ese navegador, en ese dispositivo únicamente. **No** se suben a ningún sitio, no se comparten entre dispositivos, y se perderán si se borra el almacenamiento del navegador. Exporta con regularidad (JSON o CSV) si necesitas una copia de seguridad.

## 2. El flujo de 8 pasos

Tanto `tool.html` como `platform.html` recorren los mismos 8 pasos; la plataforma además guarda metadatos para trazabilidad institucional.

1. **Identificación del agente** — Nombra el agente, elige una fuente de clasificación (OMS/BMBL/UE/INSST/otra), asigna el Grupo de Riesgo (GR1–4). Si es GR3, opcionalmente puedes documentar la condición operativa GR3\* de la Tabla 8 (incompetencia para la replicación, ausencia confirmada de transmisibilidad aérea, o inactivación validada) — **no** es un Grupo de Riesgo separado, es solo una clave de búsqueda en la Tabla 8, y requiere indicar una base más evidencia de respaldo para hacerse efectiva.
2. **Caracterización del procedimiento** — Enumera cada procedimiento técnico, valora su potencial de generación de aerosoles, volumen de trabajo y concentración (Bajo/Moderado/Alto, o "no puede caracterizarse" para aerosol).
3. **Clasificación PSR** — Automática: el PSR de cada procedimiento (Bajo/Moderado/Alto) es el *más alto* de sus tres parámetros. Este paso no se puede anular manualmente.
4. **Factores moduladores** — Valora 9 moduladores procedimentales (volumen, concentración, frecuencia, aerosol, estabilidad, experiencia, supervisión, infraestructura, incidentes) como favorable/neutro/desfavorable. **≥2 factores desfavorables** activa un aviso de consideración profesional para escalar la contención más adelante — **no** cambia el PSR del Paso 3. La susceptibilidad individual (p. ej. personal inmunocomprometido) se registra aparte aquí y nunca cuenta para ese umbral de ≥2 — es una cuestión de severidad de las consecuencias para el individuo, que se aborda mediante salud laboral, no un modificador de probabilidad.
5. **Probabilidad × Severidad** — La severidad base viene del Grupo de Riesgo. Opcionalmente puedes aplicar una *reducción documentada* (nunca un aumento) a la severidad efectiva si puedes citar una base válida, justificación y evidencia (ver FAQ más abajo). Luego selecciona una probabilidad dentro del rango que implica el PSR del Paso 3 (desplazado una categoría hacia arriba si se marcaron ≥2 factores desfavorables en el Paso 4). **Si el rango tiene más de una opción válida, debes escribir una justificación antes de que se calcule el "Resultado de la integración" (Severidad × Probabilidad)** — de lo contrario muestra `—`.
6. **Asignación de NCB** — La combinación Agente(-notación)–PSR se busca automáticamente en la Tabla 8. Si la salida de la matriz requiere consideración de escalación u ofrece más de una opción (p. ej. `NCB-2+/NCB-3` para GR3\*, o la vía GR3-Bajo-NCB-2+ que exige las cuatro condiciones documentadas), tú tomas y documentas aquí la decisión profesional final. Los avisos de **PUNTO DE PAUSA** aparecen cuando el Grupo de Riesgo no está establecido, el potencial de aerosol no puede caracterizarse, o el resultado es NCB-3/4 o riesgo global Muy Alto/Crítico — estos requieren revisión institucional/CBS completa.
7. **Selección de controles** — Se sugieren controles de ingeniería, EPI (incluida la equivalencia con el estándar regional de protección respiratoria — NIOSH N95/N99/N100 frente a EN 149 FFP2/FFP3), controles administrativos, y descontaminación/inactivación de residuos, según el NCB/perfil de control asignado. La lista de descontaminación marca automáticamente los agentes ambientalmente estables o no envueltos (formadores de esporas, priones, virus no envueltos) como necesitados de un desinfectante esporicida/virucida validado en vez de etanol simple.
8. **Documentación** — Evaluador, fecha, próxima fecha de revisión (≤12 meses), estado del flujo y (en la plataforma) campos de aprobación institucional. Exporta como informe en PDF bilingüe (imprimir) o como texto plano. La exportación/impresión se bloquea si hay un punto de pausa sin resolver, falta la justificación de escalación, o las condiciones NCB-2+ para la vía GR3-Bajo están incompletas — la aplicación te llevará de vuelta al paso correspondiente.

## 3. Fiabilidad Inter-Evaluador (IRR) formal — `analytics.html`

El panel de **IRR formal** solo incluye evaluaciones que sean:
- `dataOrigin = study` (no "individual" ni "demostración")
- **Finalizadas** (no dejadas como borrador)
- Etiquetadas por completo con ID de estudio, de escenario, de versión, de evaluador y de institución

Si dos registros comparten el mismo Estudio+Escenario+Versión pero el mismo evaluador los presentó ambos, se marca como **duplicado** y bloquea el cálculo hasta resolverse.

- **κ de Cohen** compara dos evaluadores elegidos, por pares, en sus escenarios compartidos.
- **κ de Fleiss** (la métrica principal para ≥3 evaluadores) requiere que el *mismo panel exacto* de evaluadores haya valorado *todos* los escenarios — las valoraciones que faltan nunca se rellenan ni se estiman. Si tu panel es desigual, la herramienta te dice exactamente qué escenario le falta qué evaluador.

Para generar datos IRR válidos: en `platform.html`, marca **Origen de datos → Estudio formal** en la sección "Metadatos de la evaluación" del Paso 1 de cada evaluación que forme parte del estudio, rellena los cinco identificadores de forma consistente, y finaliza cada una (Paso 8 → Estado del flujo → *Finalizado por el evaluador* o posterior).

## 4. Importar / Exportar

- **Plataforma → Exportar todas las evaluaciones como CSV**: para análisis estadístico en R/Python/Excel.
- **Analítica → Exportar conjunto de datos**: JSON canónico, reimportable.
- **Analítica → Importar CSV/JSON**: solo acepta el esquema canónico propio de la herramienta (`schemaVersion` actual) — rechazará archivos que no coincidan, en vez de leerlos mal en silencio.
- Los registros creados con una versión de esquema/algoritmo más antigua siguen siendo visibles pero se marcan como no elegibles para IRR formal hasta que los confirmes/refinalices bajo la versión actual.

## 5. Preguntas frecuentes

**"La probabilidad seleccionada muestra un valor pero el Resultado de la integración está en blanco (`—`)."**
Es normal si el rango de probabilidad tiene más de una opción: también debes rellenar el campo "Justificación profesional de la probabilidad seleccionada" y hacer clic fuera de él (el campo se guarda al perder el foco, no en cada tecla). Con ambos completados, el resultado se calcula.

**"¿Qué hace 'Aplicar una modificación documentada de la severidad efectiva'?"**
Permite *bajar* (nunca subir) la severidad respecto a la base del Grupo de Riesgo (GR1=Bajo, GR2=Moderado, GR3=Alto, GR4=Extremo), pero solo si aportas los cuatro elementos: una base reconocida (transmisión no aérea confirmada / tratamiento o PPE eficaz disponible / inactivación validada / otra), una justificación escrita y evidencia de respaldo. Si falta cualquiera de los cuatro, vuelve silenciosamente a la severidad base. Esto es distinto de la "Susceptibilidad individual" del Paso 4, que aborda el riesgo a nivel de personal, no la severidad intrínseca del agente.

**"¿El estado del flujo es solo una nota personal, o necesita el visto bueno institucional?"**
Sí, es solo una nota. El programa únicamente *registra* lo que introduces (p. ej. "Aprobado institucionalmente — registrado por el usuario"); no verifica ni otorga la aprobación en nombre de ninguna institución. La aprobación real debe pasar por tu comité de bioseguridad institucional.

**"No veo que el panel de IRR formal haga nada."**
Comprueba que cada evaluación que esperas comparar tenga `dataOrigin = study`, los cinco identificadores, y un estado de flujo finalizado. Los registros de origen individual o de demostración quedan excluidos por diseño.
