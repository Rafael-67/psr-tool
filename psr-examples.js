(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.PSRExamples=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const clone=value=>JSON.parse(JSON.stringify(value));
  const neutral={volume:'neutral',concentration:'neutral',frequency:'neutral',aerosol:'neutral',stability:'neutral',experience:'neutral',supervision:'neutral',infrastructure:'neutral',incidents:'neutral'};
  function sourced(record,id,sourceRecordId,overrides={}){return{...clone(record),...overrides,id,assessmentId:id,dataOrigin:'demonstration',sourceDataset:'PSR_Cases_v7_2026-05-06.csv',sourceRecordId,sourceCompleteness:'adapted_from_repository_summary',formalIRREligible:false,reviewer:'Example assessor',institution:'Example institution',status:'final',workflowStatus:'finalized_by_assessor'}}
  function adaptV7(base){
    const byId=Object.fromEntries(base.map(x=>[x.id,x])),s3=byId.example_s3_lentiviral,aav=byId.example_aav_production,ecoli=byId.example_ecoli_sonication,rnp=byId.example_crispr_rnp;
    if(!s3||!aav||!ecoli||!rnp)throw new Error('The six complete repository examples are required before adapting v7');
    const viableMtb={agentName:'Mycobacterium tuberculosis (viable diagnostic culture on solid medium)',riskGroup:'RG3',isGMO:false,parentalOrg:'',geneticMod:'',replComp:'yes',procedures:[{name:'Plate seeding in Class II BSC (<1 mL)',aerosol:'low',volume:'low',concentration:'low'},{name:'Colony observation in sealed plates',aerosol:'low',volume:'low',concentration:'low'}],modFactors:{...neutral,volume:'decrease',frequency:'increase',aerosol:'decrease',stability:'increase',experience:'decrease',infrastructure:'decrease',incidents:'decrease'},finalProposedBsl:'BSL-3',bslOverrideReason:'Current algorithm result: RG3 + Low PSR defaults to BSL-3 unless all four published BSL-2+ conditions are documented.',justification:'Repository v7 summary describes four procedures but names only plate seeding and sealed colony observation. Only those documented procedures are reconstructed; the record is intentionally marked summary-adapted.',createdAt:'2026-05-06T00:00:00Z'};
    // Legacy v7 repository adaptations use the current algorithm result only. Historical source discrepancies are documented separately in REFERENCE_CASE_TRACEABILITY.md.
    const case1Csv={agentName:'Third-generation lentiviral vector (HIV-1 backbone, vif/vpr/vpu/nef deleted, 3-4 plasmid system)',riskGroup:'RG3',isGMO:true,parentalOrg:'HIV-1',geneticMod:'Third-generation self-inactivating lentiviral vector, split-genome packaging, replication-incompetent.',replComp:'no',regulatoryNotation:null,rg3StarBasis:'replication_incompetence',rg3StarDocumented:true,rg3StarEvidence:'Documented third-generation split-genome replication-incompetent vector design (repository record case1_lentiviral_vector).',
      procedures:[
        {name:'HEK293T transfection (T-175 flasks in BSC-II)',aerosol:'low',volume:'moderate',concentration:'low'},
        {name:'Viral supernatant harvest',aerosol:'low',volume:'high',concentration:'low'},
        {name:'Filtration 0.45 µm (syringe filter in BSC)',aerosol:'low',volume:'moderate',concentration:'low'},
        {name:'Ultracentrifugation (non-sealed rotor)',aerosol:'high',volume:'moderate',concentration:'high'},
        {name:'Viral pellet resuspension (high titer)',aerosol:'moderate',volume:'low',concentration:'high'}
      ],
      modFactors:{volume:'increase',concentration:'increase',frequency:'increase',aerosol:'increase',stability:'decrease',experience:'decrease',supervision:'decrease',infrastructure:'decrease',incidents:'decrease'},
      finalProposedBsl:'BSL-3',
      bslOverrideReason:'Current algorithm result: RG3* + High PSR requires BSL-3.',
      justification:'Reconstructed from PSR_Cases_v7_2026-05-06.csv, record case1_lentiviral_vector: RiskGroup RG3, EffectiveRG RG3*, MF_volume/MF_concentration/MF_frequency/MF_aerosol=increase (4 unfavorable, matching the CSV UnfavorableFactors=4), remaining five factors=decrease per the CSV MF_* columns. NumProcedures=5 per the CSV; individual procedure names are not given by the summary file and are reconstructed to be consistent with the stated aerosol-driven High PSR.',
      createdAt:'2026-05-06T00:00:00Z'};
    const case6aCsv={agentName:'CRISPR-Cas9 lentiviral delivery (third-generation vector encoding Cas9 and gRNA, HIV-1 backbone)',riskGroup:'RG3',isGMO:true,parentalOrg:'HIV-1',geneticMod:'Third-generation self-inactivating lentiviral vector encoding Cas9/gRNA, replication-incompetent.',replComp:'no',regulatoryNotation:null,rg3StarBasis:'replication_incompetence',rg3StarDocumented:true,rg3StarEvidence:'Documented third-generation replication-incompetent lentiviral CRISPR delivery vector (repository record case6a_crispr_lentiviral).',
      procedures:[
        {name:'HEK293T transfection for vector production',aerosol:'low',volume:'moderate',concentration:'low'},
        {name:'Viral supernatant harvest',aerosol:'low',volume:'moderate',concentration:'low'},
        {name:'Ultracentrifugation / concentration',aerosol:'high',volume:'moderate',concentration:'high'},
        {name:'Transduction of target cells (Class II BSC)',aerosol:'low',volume:'low',concentration:'moderate'}
      ],
      modFactors:{volume:'neutral',concentration:'increase',frequency:'increase',aerosol:'increase',stability:'decrease',experience:'decrease',supervision:'decrease',infrastructure:'decrease',incidents:'decrease'},
      finalProposedBsl:'BSL-3',
      bslOverrideReason:'Current algorithm result: RG3* + High PSR requires BSL-3.',
      justification:'Reconstructed from PSR_Cases_v7_2026-05-06.csv, record case6a_crispr_lentiviral: RiskGroup RG3, EffectiveRG RG3*, MF_concentration/MF_frequency/MF_aerosol=increase (3 unfavorable, matching the CSV UnfavorableFactors=3), remaining factors=decrease/neutral per the CSV MF_* columns (MF_volume=neutral). NumProcedures=4 per the CSV, matching the four procedures named for this sub-protocol in Supplementary Appendix S2, Example F-A.',
      createdAt:'2026-05-06T00:00:00Z'};
    const hivBase={agentName:'HIV-1 wild-type, replication-competent',riskGroup:'RG3',isGMO:false,parentalOrg:'',geneticMod:'',replComp:'yes',regulatoryNotation:null,rg3StarBasis:'confirmed_absence_airborne_transmissibility',rg3StarDocumented:true,rg3StarEvidence:'Published Example E documents no airborne transmission route for HIV-1.',severityModification:true,effectiveSeverity:'Moderate',severityBasis:'confirmed_non_airborne_transmission',severityJustification:'Published Example E applies Moderate effective severity because HIV-1 has no airborne transmission route.',severityEvidence:'Supplementary Appendix S2, Example E.',modFactors:{...neutral,experience:'decrease',infrastructure:'decrease',incidents:'decrease'},createdAt:'2026-05-06T00:00:00Z'};
    const hivRoutine={...hivBase,agentName:'HIV-1 wild-type — scenario A: routine cell infection',procedures:[{name:'Routine cell infection in Class II BSC (5–10 mL; MOI 0.01–0.1)',aerosol:'low',volume:'low',concentration:'moderate'}],modFactors:{...hivBase.modFactors,volume:'decrease',concentration:'decrease',aerosol:'decrease',frequency:'increase',stability:'increase'},selectedLikelihood:'Possible',likelihoodJustification:'Published Example E-A selects Possible within the Moderate-PSR likelihood range.',finalProposedBsl:'BSL-2+',bslOverrideReason:'Published Example E-A selects the BSL-2+ branch for documented non-airborne HIV-1 routine manipulation.',justification:'Procedure-specific scenario A separated from the combined v7 row so its Moderate PSR and containment decision remain auditable.'};
    const hivConcentration={...hivBase,agentName:'HIV-1 wild-type — scenario B: high-titre concentration',procedures:[{name:'Virus concentration by ultracentrifugation (50–200 mL; 10⁷–10⁸ TCID50/mL)',aerosol:'high',volume:'high',concentration:'moderate'},{name:'Rotor unsealing after concentration',aerosol:'high',volume:'low',concentration:'high'}],modFactors:{...hivBase.modFactors,volume:'increase',concentration:'increase',frequency:'increase',aerosol:'increase',stability:'increase'},selectedLikelihood:'Very Likely',likelihoodJustification:'Published Example E-B selects Very Likely for High PSR with multiple unfavorable procedural factors.',finalProposedBsl:'BSL-3',bslOverrideReason:'RG3 + High PSR requires BSL-3 under the current Table 8 implementation.',justification:'Procedure-specific scenario B separated from the combined v7 row; High PSR is driven by volume, concentration and aerosol potential.'};
    return[
      sourced(case1Csv,'v7_case1_lentiviral_vector','case1_lentiviral_vector',{agentName:'Third-generation lentiviral vector — v7 repository case'}),
      sourced(viableMtb,'v7_case2_mtb_viable','case2_mtb_diagnostic'),
      sourced(aav,'v7_case3_aav_large_scale','case3_aav_production',{agentName:'Recombinant AAV2 large-scale production — v7 repository case',finalProposedBsl:'BSL-2+'}),
      sourced(ecoli,'v7_case4_ecoli_sonication','case4_ecoli_sonication',{agentName:'E. coli BL21(DE3) sonication — v7 repository case',finalProposedBsl:'BSL-2'}),
      sourced(hivRoutine,'v7_case5a_hiv_routine','case5_hiv1_wild_type:A'),
      sourced(hivConcentration,'v7_case5b_hiv_concentration','case5_hiv1_wild_type:B'),
      sourced(case6aCsv,'v7_case6a_crispr_lentiviral','case6a_crispr_lentiviral',{agentName:'CRISPR-Cas9 lentiviral delivery — v7 repository case'}),
      sourced(rnp,'v7_case6b_crispr_rnp','case6b_crispr_rnp',{agentName:'CRISPR-Cas9 RNP electroporation — v7 repository case',finalProposedBsl:'BSL-1'})
    ];
  }
  return Object.freeze({adaptV7});
});
