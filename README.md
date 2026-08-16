# PSR Biosafety Assessment Tool

Interactive digital implementation of the 8-step **Procedure-Specific Risk (PSR)** framework for biosafety level (BSL) assignment in modern biotechnology laboratories. Bilingual (English/Spanish), runs entirely client-side.

**Version:** 2.0.0<br>
**Version DOI:** [10.5281/zenodo.21964810](https://doi.org/10.5281/zenodo.21964810)<br>
**Live demo:** https://rafael-67.github.io/psr-tool/

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.21964810.svg)](https://doi.org/10.5281/zenodo.21964810)

## What's in this repo

| File | Purpose |
|---|---|
| `index.html` | Landing page — links to the quick tool and the platform, describes the framework |
| `tool.html` | **Quick assessment tool** — standalone, single-page, works offline, no account needed |
| `platform.html` | **Assessment platform** — persistent assessments (browser-local storage), multi-institutional workflow, formal study metadata |
| `analytics.html` | **Data analytics & IRR module** — distributions, modulating-factor patterns, risk patterns, and formal Inter-Rater Reliability (Cohen's κ / Fleiss' κ) |
| `psr-core.js` | Core algorithm: Table 6/7/8 logic, PSR classification, likelihood/severity integration, BSL matrix assignment, escalation and pause-point rules |
| `psr-data.js` | Canonical data schema, import/export (JSON/CSV), record validation |
| `psr-irr.js` | Formal Inter-Rater Reliability engine (Cohen's κ, Fleiss' κ) — requires study/scenario/rater/institution metadata |
| `psr-examples.js` | Demonstration/example assessments adapted from the published repository cases |
| `psr-a11y.js` | Small accessibility helper (label/control association, tab order, heading focus) |
| `PSR_Cases_v7_2026-05-06_corrected.csv` | Demonstration cases for reproducibility and validation |
| `MANUAL.md` | Bilingual user manual and workflow guidance |

All four `.html` files load the shared `.js` modules via `<script src="...">` — keep them in the same directory.

## Reference

This tool implements the framework described in:

> Cena-Diez R. (2026). *An 8-Step Procedure-Specific Risk Framework Enables Reproducible Biosafety Level Assignment Beyond Agent-Based Classification.* Frontiers in Bioengineering and Biotechnology 14:1879247. doi:10.3389/fbioe.2026.1879247.

Based on WHO (2020), BMBL (2020), CDC (2024), and INSST (2024) guidelines.

## Citation

For reproducibility, cite the exact software version used:

> Cena-Diez, R. (2026). *PSR Biosafety Assessment Tool* (Version 2.0.0) [Computer software]. Zenodo. https://doi.org/10.5281/zenodo.21964810

Please also cite the associated article above when referring to the PSR methodology. Machine-readable citation metadata are provided in [`CITATION.cff`](CITATION.cff).

See [`MANUAL.md`](MANUAL.md) for operating instructions, data persistence, import/export, and formal IRR requirements.

## Deployment

Static site, no build step, no server required. To deploy on GitHub Pages:

1. Push all files listed above to the repo (same directory level)
2. Settings → Pages → deploy from the branch/folder containing these files
3. Done — `index.html` is the entry point

## License

MIT License. For research and institutional biosafety use.

## Disclaimer

This tool supports but does not replace the judgement of the institutional biosafety committee. It does not replace expert biosafety review, institutional authorization, or applicable regulatory requirements. Quantitative thresholds are operational heuristics as described in the published framework.

---

# Herramienta de Evaluación de Bioseguridad PSR

Implementación digital interactiva del framework de **Riesgo Específico del Procedimiento (PSR/REP)** en 8 pasos para la asignación de nivel de bioseguridad (NCB) en laboratorios de biotecnología moderna. Bilingüe (inglés/español), funciona completamente en el navegador (sin servidor).

**Versión:** 2.0.0<br>
**DOI de la versión:** [10.5281/zenodo.21964810](https://doi.org/10.5281/zenodo.21964810)<br>
**Demo en vivo:** https://rafael-67.github.io/psr-tool/

## Contenido del repositorio

| Archivo | Función |
|---|---|
| `index.html` | Página de inicio — enlaza a la herramienta rápida y a la plataforma, describe el framework |
| `tool.html` | **Herramienta de evaluación rápida** — autónoma, una sola página, funciona sin conexión, sin cuenta |
| `platform.html` | **Plataforma de evaluación** — evaluaciones persistentes (almacenamiento local del navegador), flujo multi-institucional, metadatos de estudio formal |
| `analytics.html` | **Módulo de analítica de datos e IRR** — distribuciones, patrones de factores moduladores, patrones de riesgo, y fiabilidad inter-evaluador formal (κ de Cohen / κ de Fleiss) |
| `psr-core.js` | Algoritmo central: lógica de las Tablas 6/7/8, clasificación PSR, integración probabilidad/severidad, asignación de NCB por matriz, reglas de escalación y puntos de pausa |
| `psr-data.js` | Esquema de datos canónico, importación/exportación (JSON/CSV), validación de registros |
| `psr-irr.js` | Motor de fiabilidad inter-evaluador formal (κ de Cohen, κ de Fleiss) — requiere metadatos de estudio/escenario/evaluador/institución |
| `psr-examples.js` | Evaluaciones de ejemplo adaptadas de los casos publicados en el repositorio |
| `psr-a11y.js` | Ayudante de accesibilidad (asociación label/control, orden de tabulación, foco en encabezados) |
| `PSR_Cases_v7_2026-05-06_corrected.csv` | Casos de demostración para reproducibilidad y validación |
| `MANUAL.md` | Manual de uso bilingüe y guía del flujo de trabajo |

Los cuatro archivos `.html` cargan los módulos `.js` compartidos mediante `<script src="...">` — mantenlos en el mismo directorio.

## Referencia

Esta herramienta implementa el framework descrito en:

> Cena-Diez R. (2026). *An 8-Step Procedure-Specific Risk Framework Enables Reproducible Biosafety Level Assignment Beyond Agent-Based Classification.* Frontiers in Bioengineering and Biotechnology 14:1879247. doi:10.3389/fbioe.2026.1879247.

Basado en las directrices de OMS (2020), BMBL (2020), CDC (2024) e INSST (2024).

## Citación

Para garantizar la reproducibilidad, cita la versión exacta del software utilizada:

> Cena-Diez, R. (2026). *PSR Biosafety Assessment Tool* (Version 2.0.0) [Computer software]. Zenodo. https://doi.org/10.5281/zenodo.21964810

Cita también el artículo asociado indicado arriba cuando te refieras a la metodología PSR. Los metadatos de citación legibles por máquina están en [`CITATION.cff`](CITATION.cff).

Consulta [`MANUAL.md`](MANUAL.md) para las instrucciones de uso, persistencia de datos, importación/exportación y requisitos de IRR formal.

## Despliegue

Sitio estático, sin build ni servidor. Para desplegar en GitHub Pages:

1. Sube todos los archivos indicados arriba al repositorio (mismo nivel de directorio)
2. Settings → Pages → despliega desde la rama/carpeta que contiene estos archivos
3. Listo — `index.html` es el punto de entrada

## Licencia

Licencia MIT. Para uso en investigación y bioseguridad institucional.

## Aviso

Esta herramienta apoya pero no sustituye el criterio del comité de bioseguridad institucional. No reemplaza la revisión experta de bioseguridad, la autorización institucional ni los requisitos regulatorios aplicables. Los umbrales cuantitativos son heurísticas operativas descritas en el framework publicado.
