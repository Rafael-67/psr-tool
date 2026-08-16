(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.PSRIRR=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const scenarioKey=a=>[a.studyId,a.scenarioId,a.scenarioVersion].join('::');
  const rating=a=>a.finalProposedBsl||a.bsl||a._storedCalculatedResults&&a._storedCalculatedResults.finalProposedBsl||null;
  const isFinal=a=>['final','finalized_by_assessor','bso_reviewed','institutional_review_pending','institutionally_approved'].includes(a.workflowStatus||a.status);
  const eligible=a=>a&&a.dataOrigin==='study'&&a.formalIRREligible!==false&&a.studyId&&a.scenarioId&&a.scenarioVersion&&a.raterId&&a.institutionId&&isFinal(a)&&rating(a);
  function audit(records){
    const included=records.filter(eligible),byCell=new Map();
    included.forEach(a=>{const key=`${scenarioKey(a)}::${a.raterId}`;if(!byCell.has(key))byCell.set(key,[]);byCell.get(key).push(a)});
    const duplicates=[...byCell.entries()].filter(([,v])=>v.length>1).map(([key,v])=>({key,assessmentIds:v.map(a=>a.assessmentId||a.id)}));
    const scenarios=new Map();included.forEach(a=>{const k=scenarioKey(a);if(!scenarios.has(k))scenarios.set(k,new Map());const m=scenarios.get(k);if(!m.has(a.raterId))m.set(a.raterId,a)});
    const raters=[...new Set(included.map(a=>a.raterId))].sort();
    const missingByScenario=[...scenarios].map(([scenario,m])=>({scenario,missingRaters:raters.filter(r=>!m.has(r)),raterIds:[...m.keys()].sort()})).filter(x=>x.missingRaters.length);
    const panels=[...scenarios.values()].map(m=>[...m.keys()].sort().join('|'));
    return{included,excluded:records.filter(a=>!eligible(a)),duplicates,scenarios,raters,missingByScenario,panelBalanced:panels.length>0&&new Set(panels).size===1&&duplicates.length===0};
  }
  function interpretation(k){if(k<0)return'Poor (worse than chance)';if(k<=.20)return'Poor';if(k<=.40)return'Fair';if(k<=.60)return'Moderate';if(k<=.80)return'Substantial';return'Almost perfect'}
  function cohen(records,raterA,raterB){
    const a=audit(records);if(a.duplicates.length)return{blocked:true,duplicates:a.duplicates};if(!raterA||!raterB||raterA===raterB)throw new Error('Select two different raters');
    const pairs=[];a.scenarios.forEach((m,scenario)=>{if(m.has(raterA)&&m.has(raterB))pairs.push({scenario,a:rating(m.get(raterA)),b:rating(m.get(raterB))})});
    const categories=[...new Set(pairs.flatMap(p=>[p.a,p.b]))].sort(),n=pairs.length;if(!n)return{blocked:false,raterA,raterB,n:0,categories,po:null,pe:null,kappa:null,interpretation:'N/A',pairs};
    const agree=pairs.filter(p=>p.a===p.b).length,po=agree/n;let pe=0;categories.forEach(c=>{pe+=pairs.filter(p=>p.a===c).length/n*pairs.filter(p=>p.b===c).length/n});const kappa=pe===1?(po===1?1:null):(po-pe)/(1-pe);
    return{blocked:false,raterA,raterB,n,categories,po,pe,kappa,interpretation:kappa==null?'N/A':interpretation(kappa),pairs};
  }
  function fleiss(records){
    const a=audit(records);if(a.duplicates.length||!a.panelBalanced)return{blocked:true,duplicates:a.duplicates,missingByScenario:a.missingByScenario,mismatchedRaterSets:!a.panelBalanced};
    const categories=[...new Set(a.included.map(rating))].sort(),rows=[...a.scenarios.values()].map(m=>categories.map(c=>[...m.values()].filter(x=>rating(x)===c).length));const N=rows.length,n=a.raters.length;if(N<2||n<2)return{blocked:true,reason:'At least two scenarios and two raters are required'};
    const P=rows.map(row=>(row.reduce((s,x)=>s+x*x,0)-n)/(n*(n-1))),Pbar=P.reduce((s,x)=>s+x,0)/N;const pj=categories.map((_,j)=>rows.reduce((s,row)=>s+row[j],0)/(N*n)),Pe=pj.reduce((s,x)=>s+x*x,0),kappa=Pe===1?(Pbar===1?1:null):(Pbar-Pe)/(1-Pe);
    return{blocked:false,N,n,raters:a.raters,categories,Pbar,Pe,kappa,interpretation:kappa==null?'N/A':interpretation(kappa),provenance:'Standard Fleiss kappa; not claimed as verified against Supplementary S3'};
  }
  return Object.freeze({scenarioKey,rating,eligible,audit,cohen,fleiss,interpretation});
});
