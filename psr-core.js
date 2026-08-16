(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.PSRCore=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const LEVELS=['low','moderate','high'];
  const TABLE8=Object.freeze({
    RG1:Object.freeze({Low:'BSL-1',Moderate:'BSL-1',High:'BSL-2'}),
    RG2:Object.freeze({Low:'BSL-2',Moderate:'BSL-2',High:'BSL-2+'}),
    RG3:Object.freeze({Low:'BSL-2+',Moderate:'BSL-3',High:'BSL-3'}),
    'RG3*':Object.freeze({Low:'BSL-2+',Moderate:'BSL-2+/BSL-3',High:'BSL-3'}),
    RG4:Object.freeze({Low:'BSL-4',Moderate:'BSL-4',High:'BSL-4'})
  });
  // Table 8 asterisks are footnote markers, not additional biosafety levels.
  const TABLE8_QUALIFIERS=Object.freeze({
    RG1:Object.freeze({
      Moderate:Object.freeze({footnote:'*',condition:'rg1_moderate_standard_bsl1',controlProfile:'RG1_MODERATE'}),
      High:Object.freeze({footnote:'**',condition:'rg1_high_step_only_bsl2',controlProfile:'RG1_HIGH_STEP'})
    }),
    RG3:Object.freeze({
      Low:Object.freeze({footnote:'***',condition:'rg3_low_all_four_conditions',controlProfile:'BSL-2+'})
    })
  });
  const RG3_STAR_BASES=Object.freeze(['replication_incompetence','confirmed_absence_airborne_transmissibility','validated_inactivation']);
  const BASELINE_SEVERITY=Object.freeze({RG1:'Low',RG2:'Moderate',RG3:'High',RG4:'Extreme'});
  const BSL_ORDER=Object.freeze(['BSL-1','BSL-2','BSL-2+','BSL-3','BSL-4']);
  const SEVERITY_ORDER=Object.freeze(['Low','Moderate','High','Extreme']);
  const SEVERITY_BASIS_OPTIONS=Object.freeze(['confirmed_non_airborne_transmission','effective_treatment_or_pep_available','validated_agent_inactivation','other']);
  const LIKELIHOOD_RANGES=Object.freeze({
    normal:Object.freeze({Low:Object.freeze(['Rare','Possible']),Moderate:Object.freeze(['Possible','Likely']),High:Object.freeze(['Likely','Very Likely'])}),
    escalated:Object.freeze({Low:Object.freeze(['Possible','Likely']),Moderate:Object.freeze(['Likely','Very Likely']),High:Object.freeze(['Very Likely'])})
  });
  const OVERALL_RISK=Object.freeze({
    Low:Object.freeze({Rare:'Negligible',Possible:'Low',Likely:'Low','Very Likely':'Moderate'}),
    Moderate:Object.freeze({Rare:'Low',Possible:'Moderate',Likely:'Moderate','Very Likely':'High'}),
    High:Object.freeze({Rare:'Moderate',Possible:'High',Likely:'High','Very Likely':'Very High'}),
    Extreme:Object.freeze({Rare:'High',Possible:'Very High',Likely:'Very High','Very Likely':'Critical'})
  });

  function classifyPSR(aerosol,volume,concentration){
    const values=[aerosol,volume,concentration];
    if(values.some(v=>!LEVELS.includes(v)))return null;
    if(values.includes('high'))return'High';
    if(values.includes('moderate'))return'Moderate';
    return'Low';
  }
  function evaluateModulatingFactors(factors){
    const values=Object.values(factors||{});
    const unfavorableFactorCount=values.filter(v=>v==='increase').length;
    return{unfavorableFactorCount,favorableFactorCount:values.filter(v=>v==='decrease').length,escalationConsideration:unfavorableFactorCount>=2};
  }
  function getLikelihoodRange(psrLevel,unfavorableFactorCount){
    const ranges=unfavorableFactorCount>=2?LIKELIHOOD_RANGES.escalated:LIKELIHOOD_RANGES.normal;
    return ranges[psrLevel]?Array.from(ranges[psrLevel]):null;
  }
  function getBaseLikelihoodRange(psrLevel){return LIKELIHOOD_RANGES.normal[psrLevel]?Array.from(LIKELIHOOD_RANGES.normal[psrLevel]):null}
  function getBaselineSeverity(riskGroup){return BASELINE_SEVERITY[riskGroup]||null}
  function getEffectiveSeverity(input){
    const baselineSeverity=getBaselineSeverity(input&&input.riskGroup);
    if(!input||input.severityModification!==true)return{baselineSeverity,effectiveSeverity:baselineSeverity,severityModification:false};
    const basisValid=SEVERITY_BASIS_OPTIONS.includes(input.severityBasis)&&(input.severityBasis!=='other'||!!String(input.severityBasisOther||'').trim());
    const notMoreSevere=SEVERITY_ORDER.indexOf(input.effectiveSeverity)>=0&&SEVERITY_ORDER.indexOf(input.effectiveSeverity)<=SEVERITY_ORDER.indexOf(baselineSeverity);
    const documented=['Low','Moderate','High','Extreme'].includes(input.effectiveSeverity)&&!!String(input.severityJustification||'').trim()&&!!String(input.severityEvidence||'').trim()&&basisValid&&notMoreSevere;
    return{baselineSeverity,effectiveSeverity:documented?input.effectiveSeverity:baselineSeverity,severityModification:documented,severityBasis:documented?input.severityBasis:null,severityBasisOther:documented&&input.severityBasis==='other'?input.severityBasisOther:'',severityJustification:documented?input.severityJustification:'',severityEvidence:documented?input.severityEvidence:''};
  }
  function getOverallRisk(effectiveSeverity,selectedLikelihood){return OVERALL_RISK[effectiveSeverity]?.[selectedLikelihood]||null}
  function evaluateStep5(input){
    const modulation=evaluateModulatingFactors(input&&input.modulatingFactors);
    const baseLikelihoodRange=getBaseLikelihoodRange(input&&input.psrLevel),likelihoodShiftApplied=modulation.unfavorableFactorCount>=2;
    const likelihoodRange=getLikelihoodRange(input&&input.psrLevel,modulation.unfavorableFactorCount);
    const selectedLikelihood=likelihoodRange&&likelihoodRange.includes(input&&input.selectedLikelihood)?input.selectedLikelihood:null;
    const likelihoodSelectionDocumented=!!selectedLikelihood&&(likelihoodRange.length===1||!!String(input&&input.likelihoodJustification||'').trim());
    const severity=getEffectiveSeverity(input||{});
    const overallRiskLevel=likelihoodSelectionDocumented?getOverallRisk(severity.effectiveSeverity,selectedLikelihood):null;
    return{...modulation,psrLevel:input&&input.psrLevel||null,baseLikelihoodRange,likelihoodShiftApplied,likelihoodRange,selectedLikelihood,likelihoodJustification:likelihoodSelectionDocumented?String(input.likelihoodJustification||''):'',likelihoodSelectionDocumented,...severity,overallRiskLevel};
  }
  function getTable8Notation(agent){
    if(!agent||agent.riskGroup!=='RG3')return agent&&agent.riskGroup||null;
    const established=agent.rg3StarApplicable===true&&agent.rg3StarDocumented===true&&RG3_STAR_BASES.includes(agent.rg3StarBasis)&&!!String(agent.rg3StarEvidence||'').trim();
    return established?'RG3*':'RG3';
  }
  function assignMatrixBSL(agent,psrLevel){
    const table8Notation=getTable8Notation(agent);
    const matrixBsl=TABLE8[table8Notation]?.[psrLevel]||null;
    const qualifier=TABLE8_QUALIFIERS[table8Notation]?.[psrLevel]||null;
    return{table8Notation,matrixBsl,matrixFootnote:qualifier?.footnote||null,matrixCondition:qualifier?.condition||null,controlProfile:qualifier?.controlProfile||matrixBsl};
  }
  function nextHigherBsl(bsl){
    const i=BSL_ORDER.indexOf(bsl);
    return i>=0&&i<BSL_ORDER.length-1?BSL_ORDER[i+1]:null;
  }
  function rg3LowBsl2ConditionsMet(conditions){
    const c=conditions||{};
    return c.riskAssessmentDocumented===true&&c.institutionalStatus==='user_recorded_approved'&&c.enhancedControlsDocumented===true&&c.operatorCompetencyDocumented===true;
  }
  function evaluateContainmentDecision(input){
    input=input||{};
    const assigned=assignMatrixBSL(input.agent,input.psrLevel);
    const requiresRg3LowBsl2Conditions=!!(input.agent&&input.agent.riskGroup==='RG3'&&input.psrLevel==='Low'&&assigned.matrixBsl==='BSL-2+');
    const rg3LowConditionsMet=!requiresRg3LowBsl2Conditions||rg3LowBsl2ConditionsMet(input.bsl2Conditions);
    let retainedOptions=assigned.matrixBsl==='BSL-2+/BSL-3'?['BSL-2+','BSL-3']:assigned.matrixBsl?[assigned.matrixBsl]:[];
    if(requiresRg3LowBsl2Conditions)retainedOptions=rg3LowConditionsMet?['BSL-2+','BSL-3']:['BSL-3'];
    const escalationConsideration=input.escalationConsideration===true;
    const escalationOptions=escalationConsideration?Array.from(new Set(retainedOptions.map(nextHigherBsl).filter(Boolean).filter(v=>!retainedOptions.includes(v)))):[];
    const allowedFinalBslOptions=Array.from(new Set([...retainedOptions,...escalationOptions]));
    const requestedDecision=['retained','escalated','pending_review'].includes(input.escalationDecision)?input.escalationDecision:null;
    const finalProposedBsl=requiresRg3LowBsl2Conditions&&!rg3LowConditionsMet?'BSL-3':(allowedFinalBslOptions.includes(input.finalProposedBsl)?input.finalProposedBsl:null);
    let escalationDecision=null,consideredBsl=null;
    if(escalationConsideration){
      if(requestedDecision==='pending_review')escalationDecision='pending_review';
      else if(finalProposedBsl&&escalationOptions.includes(finalProposedBsl))escalationDecision='escalated';
      else if(finalProposedBsl&&retainedOptions.includes(finalProposedBsl))escalationDecision='retained';
      else if(requestedDecision==='retained'||requestedDecision==='escalated')escalationDecision=requestedDecision;
      consideredBsl=escalationDecision==='escalated'?finalProposedBsl:(retainedOptions.length===1?nextHigherBsl(retainedOptions[0]):null);
    }
    const bslOverride=!!finalProposedBsl&&!retainedOptions.includes(finalProposedBsl);
    const rationale=String(input.escalationRationale||input.bslOverrideReason||'').trim();
    const decisionDocumented=escalationConsideration?(
      escalationDecision==='pending_review'||(!!finalProposedBsl&&['retained','escalated'].includes(escalationDecision)&&!!rationale)
    ):(!!finalProposedBsl);
    return{...assigned,requiresRg3LowBsl2Conditions,rg3LowConditionsMet,retainedBslOptions:retainedOptions,escalationConsideration,escalationDecision,consideredBsl,escalationOptions,allowedFinalBslOptions,finalProposedBsl,bslOverride,bslOverrideReason:bslOverride?rationale:'',escalationRationale:escalationConsideration?rationale:'',decisionDocumented};
  }
  function evaluatePausePoints(input){
    const reasons=[];
    if(!input||!['RG1','RG2','RG3','RG4'].includes(input.riskGroup))reasons.push('risk_group_not_established');
    if(input&&input.aerosolUncharacterized===true)reasons.push('aerosol_uncharacterized');
    if(input&&(['BSL-3','BSL-4'].includes(input.matrixBsl)||['Very High','Critical'].includes(input.overallRiskLevel)))reasons.push('institutional_review_required');
    return{paused:reasons.length>0,reasons};
  }
  return Object.freeze({ALGORITHM_VERSION:'2.0.1',LEVELS,TABLE8,TABLE8_QUALIFIERS,RG3_STAR_BASES,BASELINE_SEVERITY,BSL_ORDER,SEVERITY_ORDER,SEVERITY_BASIS_OPTIONS,LIKELIHOOD_RANGES,OVERALL_RISK,classifyPSR,evaluateModulatingFactors,getLikelihoodRange,getBaseLikelihoodRange,getBaselineSeverity,getEffectiveSeverity,getOverallRisk,evaluateStep5,getTable8Notation,assignMatrixBSL,nextHigherBsl,rg3LowBsl2ConditionsMet,evaluateContainmentDecision,evaluatePausePoints});
});
