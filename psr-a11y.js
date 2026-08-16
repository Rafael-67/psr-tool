(function(root){
  'use strict';
  let sequence=0;
  function enhance(container,language){
    document.documentElement.lang=language==='es'?'es':'en';
    if(!container)return;
    container.setAttribute('role','main');
    container.querySelectorAll('label').forEach(label=>{
      let control=label.querySelector('input,select,textarea');
      if(!control&&label.parentElement)control=label.parentElement.querySelector('input,select,textarea');
      if(control){if(!control.id)control.id=`psr-control-${++sequence}`;label.htmlFor=control.id}
    });
    container.querySelectorAll('button,[href],input,select,textarea').forEach(el=>{if(!el.hasAttribute('tabindex')&&!el.disabled)el.tabIndex=0});
    const heading=container.querySelector('h1,h2');if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true})}
  }
  root.PSRA11y=Object.freeze({enhance});
})(typeof globalThis!=='undefined'?globalThis:this);
