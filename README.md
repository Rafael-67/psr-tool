# PSR Biosafety Assessment Tool

Interactive digital implementation of the **Procedure-Specific Risk (PSR) framework** for biosafety level assignment in modern biotechnology laboratories.

**Live site:** https://rafael-67.github.io/psr-tool/

## About

This tool implements the 8-step PSR framework described in:

> Cena-Diez R. *An 8-Step Procedure-Specific Risk Framework Enables Reproducible Biosafety Level Assignment Beyond Agent-Based Classification.* Frontiers in Bioengineering and Biotechnology [manuscript submitted].

The PSR framework operationalizes a shift from static, agent-based biosafety classification toward dynamic, procedure-specific risk assessment. It integrates agent hazard (Risk Group) with procedural exposure likelihood to determine proportionate biosafety level assignments.

The full suite is **bilingual (English / Spanish)**. The language toggle (top-left on every page) is shared and persistent across the three modules, so a choice made on one page carries over to the others.

## Tools

### Quick Assessment Tool (`tool.html`)

- Standalone single-page tool for individual PSR assessments
- Works entirely offline — no server, no account, no data leaves your device
- Bilingual EN/ES with toggle
- Region-appropriate respiratory protection (NIOSH N95/N99/N100 ↔ EN 149 FFP2/FFP3) and agent-aware decontamination / waste-inactivation guidance
- Bilingual (EN/ES) structured assessment report, exportable as an enriched TXT file or a formatted PDF (via the browser print dialog; no external libraries, so the Quick Tool stays fully offline). The report includes agent classification, a procedure table, PSR determination with the escalation rule applied, the BSL matrix cell, full recommended controls, justification, documentation, and an assessor / biosafety-officer sign-off block
- Ideal for laboratory use and biosafety committee consultations

### Assessment Platform (`platform.html`)

- Full platform with persistent storage (localStorage)
- Bilingual EN/ES interface (shared toggle across the suite)
- User profiles with institution and role
- Dashboard with assessment management
- Audit trail (assessor, institution, date, status)
- Inter-rater reliability (IRR) summary view
- Decontamination / waste-inactivation and regional respiratory-protection guidance in the control-selection step
- Same bilingual (EN/ES) structured assessment report as the Quick Tool (enriched TXT + formatted PDF), additionally capturing institution and assessment status
- CSV export for statistical analysis
- Designed for multi-institutional validation studies

### Data Analytics Module (`analytics.html`)

- Bilingual EN/ES interface
- BSL assignment distributions and escalation driver analysis
- Modulating factor scoring patterns across assessments
- **Inter-rater reliability (IRR) analysis:**
  - **Cohen's κ** (pairwise): computed from all adjacent pairwise comparisons; κ = (P₀ − Pₑ) / (1 − Pₑ)
  - **Fleiss' κ** (multi-rater, primary metric): recommended for ≥3 raters assessing identical scenarios simultaneously; κ = (P̄ − Pₑ) / (1 − Pₑ), where P̄ is the mean observed agreement and Pₑ = Σpⱼ²
  - Landis & Koch (1977) interpretation benchmarks for both statistics
  - Confusion matrix (pairwise), discrepancy table, agreement by Risk Group
- Temporal trends and cumulative assessments by institution
- CSV export of full dataset
- Built-in example assessments (Case Studies 1–6 from the manuscript)

> Fleiss' κ is the primary statistic for the prospective multi-institutional validation study described in Section 5.4 of the manuscript. Cohen's κ is additionally reported for exploratory pairwise comparisons between specific institutions.

> Note on internationalization: the user interface, assessment steps, controls, modulating factors, chart labels, and κ interpretation labels are fully translated. Exported reports (TXT/CSV), the Landis & Koch bibliographic citation, and the scientific names/justifications of the built-in case studies are intentionally kept in English, and the statistical logic (internal Low/Moderate/High keys, κ matching) is language-independent.

## The 8-Step PSR Framework

1. **Agent identification** — Determine Risk Group (RG1–4); evaluate GMO modifications
2. **Procedure characterization** — Identify aerosol-generating steps; estimate volumes and concentrations
3. **PSR classification** — Assign Low/Moderate/High PSR using standardized matrices
4. **Modulating factors** — Evaluate 9 procedural modulators; ≥2 unfavorable triggers escalation
5. **Likelihood × Severity integration** — Calculate Risk = Hazard × Likelihood
6. **BSL assignment** — Apply the Agent–PSR combination matrix
7. **Control selection** — Specify engineering, PPE, and administrative controls, including region-appropriate respiratory protection and agent-aware decontamination / waste inactivation
8. **Documentation and review** — Record assessment; establish review triggers

## Algorithm Details

### PSR Classification (Table 6)

| PSR Level | Aerosol | Volume | Concentration |
| --- | --- | --- | --- |
| Low | Minimal (controlled) | <10 mL | <10⁶ CFU/PFU/mL |
| Moderate | Moderate (contained) | 10–100 mL | 10⁶–10⁸ CFU/PFU/mL |
| High | High (uncontained) | >100 mL | >10⁸ CFU/PFU/mL |

### BSL Assignment Matrix (Table 8)

| Risk Group | Low PSR | Moderate PSR | High PSR |
| --- | --- | --- | --- |
| RG1 | BSL-1 | BSL-1\* | BSL-2\*\* |
| RG2 | BSL-2 | BSL-2 | BSL-2+ |
| RG3 | BSL-2+ | BSL-3 | BSL-3 |
| RG3\* | BSL-2+ | BSL-2+/BSL-3 | BSL-3 |
| RG4 | BSL-4 | BSL-4 | BSL-4 |

*RG3\* = RG3-derived replication-defective agents (e.g., 3rd-generation SIN lentiviral vectors, HIV-1 pseudovirus). BSL-2+ for RG3\* requires documented risk assessment, IBC approval, and enhanced procedural controls.*

### Escalation Rule

≥2 unfavorable modulating factors triggers automatic PSR escalation (Low→Moderate or Moderate→High).

### Respiratory protection (regional standards)

Respiratory protection is specified as a *protection level*; the certified device follows the applicable regional standard — NIOSH N95/N99/N100 (US/Canada) or EN 149 FFP2/FFP3 (EU). N95 ≈ FFP2 (both ≥94–95% filtration of non-oily particles); FFP3 (≥99%, comparable to N99/N100) is recommended for the highest-risk aerosol-generating procedures.

### Decontamination & waste inactivation

Disinfectant selection is agent-aware. Non-enveloped viruses (e.g., AAV) and bacterial/fungal spores require a validated sporicidal/virucidal agent (≥0.5–1% sodium hypochlorite, freshly prepared); 70% ethanol alone is insufficient. Enveloped agents are adequately inactivated by 70% ethanol or quaternary ammonium compounds, verified against the agent safety data sheet. All biological waste is autoclaved or chemically inactivated before disposal; at BSL-3/4, all waste is inactivated before leaving containment.

### IRR Statistics

| Statistic | Use case | Formula |
| --- | --- | --- |
| Cohen's κ | Pairwise (2 raters) | κ = (P₀ − Pₑ) / (1 − Pₑ) |
| Fleiss' κ | Multi-rater (≥3 raters, primary) | κ = (P̄ − Pₑ) / (1 − Pₑ) |

Interpretation benchmarks (Landis & Koch, 1977): <0.20 poor · 0.21–0.40 fair · 0.41–0.60 moderate · 0.61–0.80 substantial · 0.81–1.00 almost perfect.

Target for multi-institutional validation: κ ≥ 0.60 (substantial agreement) for BSL assignment decisions.

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

Respiratory-protection equivalences additionally reference NIOSH 42 CFR Part 84 (N-series) and EN 149:2001+A1:2009 (FFP-series).

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
Cena-Diez R. An 8-Step Procedure-Specific Risk Framework Enables Reproducible
Biosafety Level Assignment Beyond Agent-Based Classification.
Frontiers in Bioengineering and Biotechnology [manuscript submitted].

Digital tool available at: https://rafael-67.github.io/psr-tool/
```
