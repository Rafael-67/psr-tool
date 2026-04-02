# PSR Biosafety Assessment Tool

Interactive digital implementation of the **Procedure-Specific Risk (PSR) framework** for biosafety level assignment in modern biotechnology laboratories.

**Live site:** [https://rafael-67.github.io/psr-tool/](https://rafael-67.github.io/psr-tool/)

## About

This tool implements the 8-step PSR framework described in:

> [Authors]. *Structured Procedure-Specific Risk (PSR) Framework for Proportionate Biosafety Level Assignment in Modern Biotechnology.* Frontiers in Bioengineering and Biotechnology — Biosafety and Biosecurity (Hypothesis and Theory). [Under review].

The PSR framework operationalizes a shift from static, agent-based biosafety classification toward dynamic, procedure-specific risk assessment. It integrates agent hazard (Risk Group) with procedural exposure likelihood to determine proportionate biosafety level assignments.

## Tools

### Quick Assessment Tool (`tool.html`)
- Standalone single-page tool for individual PSR assessments
- Works entirely offline — no server, no account, no data leaves your device
- Bilingual EN/ES with toggle
- Export to TXT or print to PDF
- Ideal for laboratory use and biosafety committee consultations

### Assessment Platform (`platform.html`)
- Full platform with persistent storage (localStorage)
- User profiles with institution and role
- Dashboard with assessment management
- Audit trail (assessor, institution, date, status)
- Inter-rater reliability (IRR) analysis
- CSV export for statistical analysis
- Designed for multi-institutional validation studies

## The 8-Step PSR Framework

1. **Agent identification** — Determine Risk Group (RG1–4); evaluate GMO modifications
2. **Procedure characterization** — Identify aerosol-generating steps; estimate volumes and concentrations
3. **PSR classification** — Assign Low/Moderate/High PSR using standardized matrices
4. **Modulating factors** — Evaluate 9 procedural modulators; ≥2 unfavorable triggers escalation
5. **Likelihood × Severity integration** — Calculate Risk = Hazard × Likelihood
6. **BSL assignment** — Apply the Agent–PSR combination matrix
7. **Control selection** — Specify engineering, PPE, and administrative controls
8. **Documentation and review** — Record assessment; establish review triggers

## Algorithm Details

### PSR Classification (Table 6)
| PSR Level | Aerosol | Volume | Concentration |
|-----------|---------|--------|---------------|
| Low | Minimal (controlled) | <10 mL | <10⁶ CFU/PFU/mL |
| Moderate | Moderate (contained) | 10–100 mL | 10⁶–10⁸ CFU/PFU/mL |
| High | High (uncontained) | >100 mL | >10⁸ CFU/PFU/mL |

### BSL Assignment Matrix (Table 8)
| Risk Group | Low PSR | Moderate PSR | High PSR |
|-----------|---------|-------------|---------|
| RG1 | BSL-1 | BSL-1* | BSL-2** |
| RG2 | BSL-2 | BSL-2 | BSL-2+ |
| RG3 | BSL-2+ | BSL-3 | BSL-3 |
| RG3* | BSL-2+ | BSL-2+/BSL-3 | BSL-3 |
| RG4 | BSL-4 | BSL-4 | BSL-4 |

*RG3\* = RG3 agents with limited airborne transmissibility, low environmental stability, and available treatment (e.g., HIV, HBV, HCV), when replication-defective.*

### Escalation Rule
≥2 unfavorable modulating factors triggers automatic PSR escalation (Low→Moderate or Moderate→High).

## Regulatory Basis

Based on analysis of 10 international and national regulatory frameworks:
- WHO Laboratory Biosafety Manual, 4th ed. (2020)
- BMBL, 6th ed. (CDC/NIH, 2020)
- CDC Biological Risk Assessment Process (2024)
- INSST Technical Guidance (2024)
- INSST NTP 875, NTP 1201, NTP 1202
- AAMI Laboratory Biosafety Brief (2016)
- Select Agents Program (CDC/USDA, 2025)
- Spanish RD 664/1997
- EU Directives 2000/54/EC and 2009/41/EC

## Deployment

This is a static site — no server required. To deploy:

1. Clone this repository
2. Enable GitHub Pages (Settings → Pages → Source: main branch)
3. Access at `https://your-username.github.io/psr-tool/`

Or simply open `tool.html` or `platform.html` locally in any browser.

## License

MIT License. Free for research and institutional biosafety use.

## Citation

If you use this tool in your research, please cite:

```
[Authors]. Structured Procedure-Specific Risk (PSR) Framework for Proportionate
Biosafety Level Assignment in Modern Biotechnology. Front. Bioeng. Biotechnol.
— Biosafety and Biosecurity. [Under review].

Digital tool available at: https://rafael-67.github.io/psr-tool/
```
