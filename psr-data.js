(function(root,factory){
  const core=typeof module==='object'&&module.exports?require('./psr-core.js'):root.PSRCore;
  const api=factory(core);
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.PSRData=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(PSRCore){
  'use strict';
  const SCHEMA_VERSION='2.0.0';
  const ALGORITHM_VERSION=PSRCore.ALGORITHM_VERSION;
  const ORIGINS=['individual','study','demonstration'];
  const clone=value=>JSON.parse(JSON.stringify(value));
  function studyMetadataMissing(a){return['studyId','scenarioId','scenarioVersion','raterId','institutionId'].filter(k=>!String(a&&a[k]||'').trim())}
  function isFormalIRREligible(a){return a&&a.schemaVersion===SCHEMA_VERSION&&a.algorithmVersion===ALGORITHM_VERSION&&a.dataOrigin==='study'&&studyMetadataMissing(a).length===0&&a.workflow&&['finalized_by_assessor','bso_reviewed','institutional_review_pending','institutionally_approved'].includes(a.workflow.status)}
  function toCanonical(flat,results){
    const now=new Date().toISOString(),origin=ORIGINS.includes(flat.dataOrigin)?flat.dataOrigin:'individual';
    if(origin==='study'&&studyMetadataMissing(flat).length)throw new Error('Study metadata incomplete: '+studyMetadataMissing(flat).join(', '));
    return{
      schemaVersion:SCHEMA_VERSION,algorithmVersion:ALGORITHM_VERSION,assessmentId:flat.assessmentId||flat.id||`psr_${Date.now()}_${Math.random().toString(36).slice(2,8)}`,
      studyId:flat.studyId||'',scenarioId:flat.scenarioId||'',scenarioVersion:flat.scenarioVersion||'',raterId:flat.raterId||'',institutionId:flat.institutionId||'',dataOrigin:origin,
      source:{dataset:flat.sourceDataset||'',recordId:flat.sourceRecordId||'',completeness:flat.sourceCompleteness||'',notes:flat.sourceNotes||''},
      createdAt:flat.createdAt||now,startedAt:flat.startedAt||flat.createdAt||now,completedAt:flat.completedAt||'',finalizedAt:flat.finalizedAt||'',
      agent:{name:flat.agentName||'',riskGroup:flat.riskGroup||'',classificationSource:flat.classificationSource||'',classificationSourceOther:flat.classificationSource==='Other'?(flat.classificationSourceOther||''):'',transmissionRoute:flat.transmissionRoute||'',environmentalStability:flat.environmentalStability||'',infectiousDose:flat.infectiousDose||'',treatmentAvailable:flat.treatmentAvailable||'',additionalHazards:flat.additionalHazards||'',regulatoryNotation:flat.regulatoryNotation||null,regulatoryClassificationSource:flat.regulatoryClassificationSource||'',regulatoryNotationDocumented:flat.regulatoryNotationDocumented===true,rg3StarApplicable:results.table8Notation==='RG3*',rg3StarBasis:flat.rg3StarBasis||null,rg3StarDocumented:flat.rg3StarDocumented===true,rg3StarEvidence:flat.rg3StarEvidence||'',isGMO:flat.isGMO===true,parentalOrg:flat.parentalOrg||'',geneticMod:flat.geneticMod||'',replComp:flat.replComp||''},
      procedures:(flat.procedures||[]).map((p,i)=>({...clone(p),equipment:p.equipment||'',frequency:p.frequency||'',individualPSR:results.pp&&results.pp[i]||null})),
      modulatingFactors:{values:clone(flat.modFactors||{}),unfavorableFactorCount:results.unfavorableFactorCount??results.u??0,favorableFactorCount:results.favorableFactorCount??results.f??0,escalationConsideration:results.escalationConsideration===true},
      individualSusceptibility:{factor:flat.individualSusceptibility||'none',otherDescription:flat.individualSusceptibility==='other'?(flat.individualSusceptibilityOther||''):'',occupationalHealthAction:flat.individualSusceptibility&&flat.individualSusceptibility!=='none'?(flat.occupationalHealthAction||''):''},
      calculatedResults:{psrLevel:results.psrLevel||null,baselineSeverity:results.baselineSeverity||null,effectiveSeverity:results.effectiveSeverity||null,severityModification:results.severityModification===true,severityBasis:flat.severityBasis||null,severityJustification:flat.severityJustification||'',severityEvidence:flat.severityEvidence||'',likelihoodRange:clone(results.likelihoodRange||[]),selectedLikelihood:results.selectedLikelihood||null,likelihoodJustification:flat.likelihoodJustification||'',overallRiskLevel:results.overallRiskLevel||null,table8Notation:results.table8Notation||null,matrixBsl:results.matrixBsl||null,finalProposedBsl:results.finalProposedBsl||null,escalationDecision:results.escalationDecision||null,consideredBsl:results.consideredBsl||null,escalationRationale:results.escalationRationale||flat.escalationRationale||'',bslOverride:results.bslOverride===true,bslOverrideReason:flat.bslOverrideReason||''},
      bsl2Conditions:{riskAssessmentDocumented:flat.bsl2RiskAssessmentDocumented===true,institutionalStatus:flat.bsl2InstitutionalStatus||'conditions_pending',enhancedControlsDocumented:flat.bsl2EnhancedControlsDocumented===true,operatorCompetencyDocumented:flat.bsl2OperatorCompetencyDocumented===true},
      workflow:{status:(flat.workflowStatus||flat.status)==='final'?'finalized_by_assessor':(flat.workflowStatus||flat.status||'draft'),bsoReview:flat.bsoReview||'',institutionalReview:flat.institutionalReview||'',approvalReference:flat.approvalReference||'',approvingBody:flat.approvingBody||'',approvalDate:flat.approvalDate||'',nextReviewDate:flat.nextReviewDate||flat.reviewDate||'',reassessmentTriggers:flat.triggers||''},
      documentation:{justification:flat.justification||'',reviewer:flat.reviewer||'',institution:flat.institution||'',additionalControls:flat.addCtrl||flat.addControls||''}
    };
  }
  function toFlat(record){
    if(!record||record.schemaVersion!==SCHEMA_VERSION||!record.agent)return{...clone(record||{}),legacyIncomplete:true,formalIRREligible:false};
    const c=record.calculatedResults||{},m=record.modulatingFactors||{},is=record.individualSusceptibility||{},w=record.workflow||{},doc=record.documentation||{},b=record.bsl2Conditions||{};
    const source=record.source||{};return{schemaVersion:record.schemaVersion,algorithmVersion:record.algorithmVersion,assessmentId:record.assessmentId,id:record.assessmentId,studyId:record.studyId||'',scenarioId:record.scenarioId||'',scenarioVersion:record.scenarioVersion||'',raterId:record.raterId||'',institutionId:record.institutionId||'',dataOrigin:record.dataOrigin,sourceDataset:source.dataset||'',sourceRecordId:source.recordId||'',sourceCompleteness:source.completeness||'',sourceNotes:source.notes||'',createdAt:record.createdAt,startedAt:record.startedAt,completedAt:record.completedAt,finalizedAt:record.finalizedAt,agentName:record.agent.name,riskGroup:record.agent.riskGroup,classificationSource:record.agent.classificationSource,classificationSourceOther:record.agent.classificationSourceOther,transmissionRoute:record.agent.transmissionRoute,environmentalStability:record.agent.environmentalStability,infectiousDose:record.agent.infectiousDose,treatmentAvailable:record.agent.treatmentAvailable,additionalHazards:record.agent.additionalHazards,regulatoryNotation:record.agent.regulatoryNotation,regulatoryClassificationSource:record.agent.regulatoryClassificationSource,regulatoryNotationDocumented:record.agent.regulatoryNotationDocumented,rg3StarBasis:record.agent.rg3StarBasis,rg3StarDocumented:record.agent.rg3StarDocumented,rg3StarEvidence:record.agent.rg3StarEvidence,isGMO:record.agent.isGMO,parentalOrg:record.agent.parentalOrg,geneticMod:record.agent.geneticMod,replComp:record.agent.replComp,procedures:clone(record.procedures||[]),modFactors:clone(m.values||{}),individualSusceptibility:is.factor||'none',individualSusceptibilityOther:is.otherDescription||'',occupationalHealthAction:is.occupationalHealthAction||'',severityModification:c.severityModification,effectiveSeverity:c.effectiveSeverity,severityBasis:c.severityBasis||'',severityJustification:c.severityJustification||'',severityEvidence:c.severityEvidence||'',selectedLikelihood:c.selectedLikelihood||'',likelihoodJustification:c.likelihoodJustification||'',finalProposedBsl:c.finalProposedBsl||'',escalationDecision:c.escalationDecision||'',escalationRationale:c.escalationRationale||'',bslOverrideReason:c.bslOverrideReason||'',bsl2RiskAssessmentDocumented:b.riskAssessmentDocumented,bsl2InstitutionalStatus:b.institutionalStatus,bsl2EnhancedControlsDocumented:b.enhancedControlsDocumented,bsl2OperatorCompetencyDocumented:b.operatorCompetencyDocumented,workflowStatus:w.status,status:w.status==='finalized_by_assessor'?'final':w.status,reviewDate:w.nextReviewDate,triggers:w.reassessmentTriggers,bsoReview:w.bsoReview,institutionalReview:w.institutionalReview,approvalReference:w.approvalReference,approvingBody:w.approvingBody,approvalDate:w.approvalDate,justification:doc.justification,reviewer:doc.reviewer,institution:doc.institution,addCtrl:doc.additionalControls,_storedCalculatedResults:clone(c),legacyIncomplete:false,formalIRREligible:isFormalIRREligible(record)};
  }
  function exportJSON(records){return JSON.stringify({format:'psr-tool-canonical',schemaVersion:SCHEMA_VERSION,exportedAt:new Date().toISOString(),assessments:clone(records)},null,2)}
  function importJSON(text){
    const parsed=typeof text==='string'?JSON.parse(text):clone(text);
    const records=Array.isArray(parsed)?parsed:parsed&&parsed.assessments;
    if(!Array.isArray(records))throw new Error('Canonical JSON must contain an assessments array');
    records.forEach((r,i)=>{if(!r||r.schemaVersion!==SCHEMA_VERSION||!r.assessmentId||!r.agent||!r.calculatedResults)throw new Error(`Assessment ${i+1} is not canonical schema ${SCHEMA_VERSION}`)});
    return clone(records);
  }
  function compareCalculated(stored,recalculated){
    const keys=['psrLevel','baselineSeverity','effectiveSeverity','selectedLikelihood','overallRiskLevel','table8Notation','matrixBsl','finalProposedBsl','escalationDecision','consideredBsl'];
    const value=(object,key)=>object&&object[key]!=null?object[key]:null;
    return keys.filter(key=>JSON.stringify(value(stored,key))!==JSON.stringify(value(recalculated,key))).map(key=>({field:key,stored:value(stored,key),recalculated:value(recalculated,key)}));
  }
  function csvCell(value){
    let s=value==null?'':String(value);
    if(/^[=+\-@]/.test(s))s="'"+s;
    return `"${s.replace(/"/g,'""')}"`;
  }
  function toCSV(rows,columns){const eol='\r\n';return columns.map(csvCell).join(',')+eol+rows.map(row=>columns.map(c=>csvCell(row[c])).join(',')).join(eol)+eol}
  function validateWorkflow(a,referenceDate){const errors=[],status=a.workflowStatus||a.status||'draft',start=new Date(referenceDate||Date.now()),limit=new Date(start);limit.setFullYear(limit.getFullYear()+1);if(status!=='draft'&&(!a.nextReviewDate||new Date(a.nextReviewDate)>limit))errors.push('nextReviewDate must be within 12 months');if(status==='institutionally_approved'&&(!a.approvalReference||!a.approvingBody||!a.approvalDate))errors.push('user-recorded approval requires reference, approving body and date');return errors}
  return Object.freeze({SCHEMA_VERSION,ALGORITHM_VERSION,ORIGINS,studyMetadataMissing,isFormalIRREligible,toCanonical,toFlat,exportJSON,importJSON,compareCalculated,csvCell,toCSV,validateWorkflow});
});
