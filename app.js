(function(){
"use strict";
var KEY="studytrack.final.v1";var user=null;var DEMO={email:"student@studytrack.demo",name:"Thabelo Manubi",pw:"StudyTrack2026!"};
var params=new URLSearchParams(location.search);
var DOW=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],DOWL=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
var MON=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],MONL=["January","February","March","April","May","June","July","August","September","October","November","December"];
function parseISO(s){var p=s.split("-").map(Number);return new Date(p[0],p[1]-1,p[2]);}
function iso(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");}
var TODAY=(function(){var t=params.get("today");if(t&&/^\d{4}-\d{2}-\d{2}$/.test(t))return parseISO(t);var n=new Date();return new Date(n.getFullYear(),n.getMonth(),n.getDate());})();
var TODAY_ISO=iso(TODAY);
function addDays(n){var d=new Date(TODAY);d.setDate(d.getDate()+n);return iso(d);}
function daysTo(s){return Math.round((parseISO(s)-TODAY)/86400000);}
function fmt(s){var d=parseISO(s);return DOW[d.getDay()]+", "+d.getDate()+" "+MON[d.getMonth()];}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c];});}

var ICONS={
 book:'<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v15H5.5A1.5 1.5 0 0 0 4 20.5z"/><path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v15h5.5a1.5 1.5 0 0 1 1.5 1.5z"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',chev:'<path d="M9 6l6 6-6 6"/>',
 clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',cal:'<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/>',
 share:'<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.2 10.8l7.6-3.6M8.2 13.2l7.6 3.6"/>',
 sliders:'<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
 list:'<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 6h.01M4 12h.01M4 18h.01"/>',
 archive:'<rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 8v11h14V8M10 12h4"/>',
 search:'<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/>',
 alert:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v5.5M12 16.5h.01"/>',
 half:'<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill="currentColor"/>',
 out:'<path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4M15 8l4 4-4 4M19 12H9"/>',circle:'<circle cx="12" cy="12" r="8.5"/>',cc:'<circle cx="12" cy="12" r="8.5"/><path d="M8 12.5l2.8 2.8L16 9.8"/>'
};
function icon(n){return '<svg class="i" viewBox="0 0 24 24" aria-hidden="true" focusable="false">'+ICONS[n]+'</svg>';}
document.querySelectorAll("[data-ico]").forEach(function(el){el.innerHTML=icon(el.getAttribute("data-ico"));el.style.display="inline-flex";});

/* ---------- state ---------- */
function seed(){
  var n=1;function S(t,d){return{id:"s"+(n++),text:t,done:!!d};}
  return{nextId:20,
   assignments:[
    {id:"a1",title:"Seminar notes: responsibility",subject:"Ethics and public life",due:addDays(-1),priority:"high",effort:"About 1 hour",notes:"Summarise the key arguments from week 3 and add two questions for the tutor.",steps:[S("Gather the week 3 seminar notes",1),S("Summarise the key arguments"),S("Write two questions for the tutor")],completed:false,archived:false},
    {id:"a2",title:"Reading response: care and community",subject:"Sociology of everyday life",due:addDays(2),priority:"high",effort:"About 2 hours",notes:"Use the week 4 reading and bring in one example from the seminar.",steps:[S("Revisit the seminar notes",1),S("Choose a passage from the reading"),S("Draft a 500-word response")],completed:false,archived:false},
    {id:"a3",title:"Group case study: draft slides",subject:"Business communication",due:addDays(6),priority:"medium",effort:"About half a day",notes:"",steps:[],completed:false,archived:false},
    {id:"a4",title:"Usability findings: lab report",subject:"Human computer interaction",due:addDays(13),priority:"low",effort:"A few days",notes:"Use the think-aloud notes from the lab session.",steps:[S("Collect the observation notes"),S("Group findings by severity")],completed:false,archived:false},
    {id:"a5",title:"Quiz reflection",subject:"Ethics and public life",due:addDays(-4),priority:"low",effort:"About 30 minutes",notes:"",steps:[S("Review the quiz feedback",1),S("Write three lines on what to revise",1)],completed:true,archived:false}
   ],
   prefs:{reminders:false,remindWhen:"1",large:false,contrast:false},
   share:{on:false,include:{details:true,steps:true,progress:true,notes:false},ids:[]}
  };
}
var data=blank();
function load(){try{var r=localStorage.getItem(KEY);if(r){var d=JSON.parse(r);if(d&&d.assignments)return d;}}catch(e){}return user&&user.demo?seed():blank();}
function blank(){return{nextId:20,assignments:[],prefs:{reminders:false,remindWhen:"1",large:false,contrast:false},share:{on:false,include:{details:true,steps:true,progress:true,notes:false},ids:[]}};}
function save(){try{localStorage.setItem(KEY,JSON.stringify(data));}catch(e){}}
var ui={tab:"todo",q:"",sort:"soonest",open:{},last:null};

/* ---------- helpers ---------- */
function byId(id){return data.assignments.filter(function(a){return a.id===id;})[0];}
function stepsDone(a){return a.steps.filter(function(s){return s.done;}).length;}
function pct(a){if(a.completed)return 100;return a.steps.length?Math.round(stepsDone(a)/a.steps.length*100):0;}
function isOver(a){return !a.completed&&daysTo(a.due)<0;}
function state(a){if(a.completed)return"done";return stepsDone(a)>0?"prog":"new";}
function rel(a){if(a.completed)return"";var d=daysTo(a.due);if(d<0)return(-d)+(d===-1?" day":" days")+" overdue";if(d===0)return"due today";if(d===1)return"tomorrow";return"in "+d+" days";}
function active(){return data.assignments.filter(function(a){return !a.archived&&!a.completed;});}
function counts(){return{todo:active().length,done:data.assignments.filter(function(a){return a.completed&&!a.archived;}).length,archived:data.assignments.filter(function(a){return a.archived;}).length};}
function uid(p){return p+(data.nextId++);}
var PRI={high:"High priority",medium:"Medium priority",low:"Low priority"};

/* ---------- toasts ---------- */
function toast(msg,undoFn,sticky){
  var box=document.getElementById("toasts");
  if(!undoFn){Array.prototype.slice.call(box.children).forEach(function(c){if(!c.dataset.keep)c.remove();});}
  var t=document.createElement("div");t.className="toast";
  t.innerHTML='<span class="ok">'+icon("cc")+'</span><span style="flex:1">'+esc(msg)+'</span>';
  if(undoFn){var u=document.createElement("button");u.type="button";u.textContent="Undo";u.addEventListener("click",function(){undoFn();t.remove();});t.appendChild(u);t.dataset.keep="1";}
  var d=document.createElement("button");d.type="button";d.textContent="Dismiss";d.addEventListener("click",function(){t.remove();});t.appendChild(d);
  box.appendChild(t);
  if(!undoFn&&!sticky){setTimeout(function(){if(t.parentNode)t.remove();},9000);}
  while(box.children.length>2)box.firstChild.remove();
}

/* ---------- render ---------- */
function renderChrome(){
  var c=counts();
  document.querySelectorAll("[data-count]").forEach(function(el){var k=el.getAttribute("data-count");el.textContent=c[k];if(el.classList.contains("n"))el.setAttribute("aria-label",c[k]+" items");});
  document.querySelectorAll("[data-tab]").forEach(function(b){
    if(b.hasAttribute("data-nav")){if(b.getAttribute("data-tab")===ui.tab)b.setAttribute("aria-current","page");else b.removeAttribute("aria-current");}
    else b.setAttribute("aria-pressed",b.getAttribute("data-tab")===ui.tab?"true":"false");
  });
  var d=TODAY;document.getElementById("todayLine").textContent=DOWL[d.getDay()]+", "+d.getDate()+" "+MONL[d.getMonth()];
  var chip=document.getElementById("shareChip");chip.innerHTML='<span class="lg">Sharing </span>'+(data.share.on?"on":"off");chip.classList.toggle("on",data.share.on);
  var crumb=document.querySelector(".crumbs b");crumb.textContent={todo:"Assignments",done:"Completed",archived:"Archive"}[ui.tab];
}
function nextOne(){
  var a=active().slice().sort(function(x,y){return x.due<y.due?-1:1;});
  var up=a.filter(function(x){return daysTo(x.due)>=0;});
  return up[0]||a[0]||null;
}
function renderHero(){
  var n=nextOne(),h="";
  if(n){
    var p=pct(n),sd=stepsDone(n),tot=n.steps.length;
    h+='<div class="card next"><p class="small">'+icon("clock")+'A good place to begin</p><h2>'+esc(n.title)+'</h2>'+
      '<div class="meta"><span>'+icon("book")+esc(n.subject)+'</span><span>'+icon("cal")+'Due '+fmt(n.due)+'</span>'+(n.effort?'<span>'+icon("clock")+esc(n.effort)+'</span>':'')+'</div>'+
      '<div class="nextrow"><div class="grow"><div class="pt">'+(tot?'Small steps so far':'No steps yet')+'</div><div class="bar" role="progressbar" aria-label="Progress on '+esc(n.title)+'" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+p+'"><span style="width:'+p+'%"></span></div>'+
      '<div class="pt">'+(tot?sd+' of '+tot+' steps checked off &middot; '+p+'%':'Add a first small step to get moving')+'</div></div>'+
      '<button class="btn" data-act="continue" data-id="'+n.id+'">Continue this one '+icon("chev")+'</button></div></div>';
  }else{
    if(!data.assignments.length)h+='<div class="card next"><p class="small">'+icon("clock")+'Welcome to StudyTrack</p><h2>Start with one assignment.</h2><p class="meta">Only a title, subject and due date are needed. It takes under a minute.</p><div class="nextrow"><button class="btn primary" data-act="add">'+icon("plus")+'Add your first assignment</button></div></div>';
    else h+='<div class="card next"><p class="small">'+icon("clock")+'Nothing waiting</p><h2>You are all caught up.</h2><p class="meta">Add an assignment when the next deadline arrives.</p></div>';
  }
  var over=active().filter(isOver).sort(function(x,y){return x.due<y.due?-1:1;})[0];
  h+='<div class="card calm"><h2>Progress is not a race.</h2>'+
    (over?'<p class="pt" style="color:var(--ink)">&ldquo;'+esc(over.title)+'&rdquo; is past its date. Choose one small step, or change the deadline if plans have moved.</p><div><button class="btn sm" data-act="edit" data-id="'+over.id+'">Change deadline</button></div>':
    '<p class="pt" style="color:var(--ink)">Your plan is here to help, not to judge.</p>')+'</div>';
  document.getElementById("hero").innerHTML=h;
}
function badgeFor(a){
  var o=isOver(a),s=state(a);
  if(s==="done")return'<span class="badge b-done">'+icon("cc")+'Complete</span>';
  var txt=s==="prog"?"In progress":"Not started";
  if(o)return'<span class="badge b-over">'+icon("alert")+'Overdue &middot; '+txt.toLowerCase()+'</span>';
  return s==="prog"?'<span class="badge b-prog">'+icon("half")+txt+'</span>':'<span class="badge b-new">'+icon("circle")+txt+'</span>';
}
function itemHTML(a){
  var open=!!ui.open[a.id],p=pct(a),sd=stepsDone(a),tot=a.steps.length;
  var h='<li class="item'+(isOver(a)?' is-overdue':'')+(ui.last===a.id?' flash':'')+'" data-id="'+a.id+'">';
  h+='<div class="row" data-rowtoggle><span class="ico">'+icon("book")+'</span>'+
     '<div><h3 class="ttl"><button type="button" class="expander" id="t-'+a.id+'" aria-expanded="'+open+'" aria-controls="d-'+a.id+'" data-act="toggle" data-id="'+a.id+'">'+esc(a.title)+'<span class="chev">'+icon("chev")+'</span></button></h3>'+
     '<p class="subj">'+esc(a.subject)+'</p>'+
     '<div class="mini">'+(tot?'<div class="bar" aria-hidden="true"><span style="width:'+p+'%"></span></div><span>'+sd+' of '+tot+' steps</span>':'<span>No steps yet</span>')+'</div></div>'+
     '<div class="due"><span class="lbl">Due date</span><strong>'+fmt(a.due)+'</strong><span class="rel">'+rel(a)+'</span></div>'+
     '<div class="badges">'+badgeFor(a)+'<span class="badge b-pri">'+PRI[a.priority]+'</span></div></div>';
  h+='<div class="detail" id="d-'+a.id+'"'+(open?'':' hidden')+'>';
  if(a.notes)h+='<p class="notes">'+esc(a.notes)+'</p>';
  if(tot){h+='<ul class="steps" aria-label="Steps for '+esc(a.title)+'">';
    a.steps.forEach(function(s){h+='<li><label><input type="checkbox" data-act="step" data-id="'+a.id+'" data-sid="'+s.id+'"'+(s.done?' checked':'')+'><span>'+esc(s.text)+'</span></label><button type="button" class="linkbtn" data-act="rmstep" data-id="'+a.id+'" data-sid="'+s.id+'" aria-label="Remove step: '+esc(s.text)+'">Remove</button></li>';});
    h+='</ul>';}
  else h+='<p class="muted">No steps yet. Break this into one small first step.</p>';
  if(!a.archived)h+='<form class="addstep" data-act="addstep" data-id="'+a.id+'"><label class="sr" for="ns-'+a.id+'">New step for '+esc(a.title)+'</label><input type="text" id="ns-'+a.id+'" placeholder="Add a step, e.g. Find three sources" autocomplete="off"><button type="submit" class="btn sm">Add step</button></form>';
  h+='<div><div class="bar" role="progressbar" aria-label="Progress on '+esc(a.title)+'" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+p+'"><span style="width:'+p+'%"></span></div><p class="pt">'+(a.completed?'Marked complete':(tot?sd+' of '+tot+' steps checked off &middot; '+p+'% complete':'No steps to measure yet'))+(a.effort?' &middot; '+esc(a.effort):'')+'</p></div>';
  h+='<div class="actions">';
  if(a.archived){h+='<button class="btn sm" data-act="restore" data-id="'+a.id+'">Restore</button><button class="btn sm" data-act="delete" data-id="'+a.id+'">Delete permanently</button>';}
  else{
    h+='<button class="btn sm" data-act="edit" data-id="'+a.id+'">Edit assignment</button>';
    if(a.completed)h+='<button class="btn sm" data-act="reopen" data-id="'+a.id+'">Reopen</button>';
    else h+='<button class="btn sm'+(tot&&sd===tot?' primary':'')+'" data-act="complete" data-id="'+a.id+'">Mark complete</button>';
    h+='<button class="btn sm" data-act="archive" data-id="'+a.id+'">Archive</button>';
  }
  h+='</div></div></li>';
  return h;
}
function renderList(){
  var inTab=data.assignments.filter(function(a){return ui.tab==="archived"?a.archived:(!a.archived&&(ui.tab==="done"?a.completed:!a.completed));});
  var q=ui.q.trim().toLowerCase();
  var items=inTab.filter(function(a){return !q||(a.title+" "+a.subject+" "+a.notes).toLowerCase().indexOf(q)>-1;});
  var w={high:0,medium:1,low:2};
  items.sort(function(x,y){
    if(ui.sort==="latest")return x.due<y.due?1:-1;
    if(ui.sort==="priority")return w[x.priority]-w[y.priority]||(x.due<y.due?-1:1);
    return x.due<y.due?-1:1;});
  var h="";
  if(!items.length){
    if(q)h='<li class="empty"><h3>No matches for &ldquo;'+esc(ui.q.trim())+'&rdquo;</h3><p class="muted">Check the spelling, or search by subject instead.</p><button class="btn sm" data-act="clearq">Clear search</button></li>';
    else if(ui.tab==="todo")h='<li class="empty"><h3>Nothing waiting for you.</h3><p class="muted">When the next deadline arrives, add it here in under a minute.</p><button class="btn primary sm" data-act="add">Add assignment</button></li>';
    else if(ui.tab==="done")h='<li class="empty"><h3>No completed work yet.</h3><p class="muted">Finished assignments will collect here.</p></li>';
    else h='<li class="empty"><h3>Your archive is empty.</h3><p class="muted">Archived assignments can be restored at any time.</p></li>';
  }else h=items.map(itemHTML).join("");
  document.getElementById("list").innerHTML=h;
  ui.last=null;
}
function renderAll(){renderChrome();renderHero();renderList();document.documentElement.dataset.size=data.prefs.large?"large":"normal";document.documentElement.dataset.contrast=data.prefs.contrast?"high":"normal";}
function keepFocus(sel,fn){fn();if(sel){var el=document.querySelector(sel);if(el)el.focus();}}

/* ---------- dialogs ---------- */
function openDlg(id){var d=document.getElementById(id);if(!d.open)d.showModal();return d;}
var opener=null;
document.addEventListener("click",function(e){var c=e.target.closest("[data-close]");if(c){var d=c.closest("dialog");if(d)d.close();}});
document.querySelectorAll("dialog").forEach(function(d){d.addEventListener("close",function(){if(opener&&document.body.contains(opener)&&d.id!=="dlgConfirm"){try{opener.focus();}catch(e){}}});
  d.addEventListener("click",function(e){if(e.target===d&&d.id!=="dlgAssign")d.close();});});

var editing=null;
function openAssign(id){
  editing=id?byId(id):null;opener=document.activeElement;
  var f=document.getElementById("fAssign");clearErrors();
  document.getElementById("aTitle").textContent=editing?"Edit assignment":"Add assignment";
  document.getElementById("saveBtn").textContent=editing?"Save changes":"Save assignment";
  document.getElementById("fTitle").value=editing?editing.title:"";
  document.getElementById("fSubject").value=editing?editing.subject:"";
  document.getElementById("fDue").value=editing?editing.due:"";
  document.getElementById("fPrio").value=editing?editing.priority:"medium";
  document.getElementById("fEffort").value=editing?editing.effort:"";
  document.getElementById("fNotes").value=editing?editing.notes:"";
  document.getElementById("fSteps").value="";
  document.getElementById("moreDet").open=false;
  document.getElementById("moreDet").querySelector("#fSteps").closest(".fld").style.display=editing?"none":"";
  var subs={};data.assignments.forEach(function(a){subs[a.subject]=1;});
  document.getElementById("subjects").innerHTML=Object.keys(subs).map(function(s){return'<option value="'+esc(s)+'">';}).join("");
  openDlg("dlgAssign");document.getElementById("fTitle").focus();
}
function clearErrors(){
  document.getElementById("errSummary").hidden=true;
  ["title","subject","due"].forEach(function(k){var g=document.getElementById("g-"+k);g.classList.remove("bad");var e=g.querySelector(".err");if(e)e.remove();
    var inp=g.querySelector("input");inp.removeAttribute("aria-invalid");var base="h-"+k;inp.setAttribute("aria-describedby",base);});
}
function showError(k,msg,fieldId){
  var g=document.getElementById("g-"+k);g.classList.add("bad");
  var p=document.createElement("p");p.className="err";p.id="e-"+k;p.innerHTML=icon("alert")+'<span><span class="sr">Error: </span>'+esc(msg)+'</span>';
  g.insertBefore(p,g.querySelector(".help"));
  var inp=document.getElementById(fieldId);inp.setAttribute("aria-invalid","true");inp.setAttribute("aria-describedby","e-"+k+" h-"+k);
}
document.getElementById("fAssign").addEventListener("submit",function(e){
  e.preventDefault();clearErrors();
  var t=document.getElementById("fTitle").value.trim(),s=document.getElementById("fSubject").value.trim(),d=document.getElementById("fDue").value;
  var errs=[];
  if(!t)errs.push(["title","Enter a title, for example \u201cReading response, week 4\u201d.","fTitle"]);
  if(!s)errs.push(["subject","Enter a subject, for example \u201cSociology\u201d.","fSubject"]);
  if(!d)errs.push(["due","Enter a due date. Use the date picker or type day, month and year.","fDue"]);
  else if(d<TODAY_ISO&&(!editing||editing.due!==d))errs.push(["due","That date has already passed. Choose today or a later date.","fDue"]);
  if(errs.length){
    errs.forEach(function(x){showError(x[0],x[1],x[2]);});
    var sum=document.getElementById("errSummary");
    sum.innerHTML='<strong>'+(errs.length===1?'There is 1 thing to fix before saving:':'There are '+errs.length+' things to fix before saving:')+'</strong><ul>'+errs.map(function(x){return'<li><a href="#'+x[2]+'" data-jump="'+x[2]+'">'+esc(x[1])+'</a></li>';}).join("")+'</ul>';
    sum.hidden=false;sum.focus();return;
  }
  var pr=document.getElementById("fPrio").value,ef=document.getElementById("fEffort").value,nt=document.getElementById("fNotes").value.trim(),a;
  if(editing){a=editing;a.title=t;a.subject=s;a.due=d;a.priority=pr;a.effort=ef;a.notes=nt;}
  else{
    a={id:uid("a"),title:t,subject:s,due:d,priority:pr,effort:ef,notes:nt,steps:[],completed:false,archived:false};
    document.getElementById("fSteps").value.split("\n").map(function(x){return x.trim();}).filter(Boolean).slice(0,10).forEach(function(x){a.steps.push({id:uid("s"),text:x,done:false});});
    data.assignments.push(a);
  }
  ui.tab=a.completed?"done":"todo";ui.q="";document.getElementById("q").value="";ui.open[a.id]=true;ui.last=a.id;
  save();document.getElementById("dlgAssign").close();opener=null;renderAll();
  var ex=document.getElementById("t-"+a.id);if(ex){ex.focus();ex.scrollIntoView({block:"center"});}
  toast(editing?"Changes saved to \u201c"+a.title+"\u201d.":"Assignment saved. \u201c"+a.title+"\u201d is on your list.");
});
document.getElementById("errSummary").addEventListener("click",function(e){var a=e.target.closest("[data-jump]");if(a){e.preventDefault();document.getElementById(a.getAttribute("data-jump")).focus();}});

/* ---------- share ---------- */
function renderShare(){
  var s=data.share,on=s.on;
  document.getElementById("shSwitch").checked=on;document.getElementById("shSt").textContent=on?"On":"Off";
  document.getElementById("shState").textContent=on?"On. People with the link can view what you choose below.":"Off. Only you can see your plan.";
  document.getElementById("shOn").hidden=!on;document.getElementById("shOn").style.display=on?"grid":"none";
  document.getElementById("shOffMsg").hidden=on;
  if(!on)return;
  document.querySelectorAll("[data-inc]").forEach(function(c){c.checked=!!s.include[c.getAttribute("data-inc")];});
  var act=active();
  document.getElementById("shIds").innerHTML=act.map(function(a){return'<label><input type="checkbox" data-shid="'+a.id+'"'+(s.ids.indexOf(a.id)>-1?' checked':'')+'> '+esc(a.title)+'</label>';}).join("")||'<p class="hint">No active assignments to share.</p>';
  var chosen=act.filter(function(a){return s.ids.indexOf(a.id)>-1;}),h="";
  if(!chosen.length)h='<p class="hint">Nothing selected yet, so your partner would see an empty page.</p>';
  chosen.forEach(function(a){
    h+='<div class="pv"><strong>'+(s.include.details?esc(a.title):'Assignment')+'</strong>';
    if(s.include.details)h+='<span class="pt">Due '+fmt(a.due)+'</span>';
    if(s.include.progress)h+='<span class="pt">'+pct(a)+'% complete</span>';
    if(s.include.steps&&a.steps.length)h+='<ul>'+a.steps.map(function(x){return'<li><span aria-hidden="true">'+(x.done?'\u2713':'\u25CB')+'</span><span>'+esc(x.text)+' <span class="sr">('+(x.done?'done':'to do')+')</span></span></li>';}).join("")+'</ul>';
    if(s.include.notes&&a.notes)h+='<span class="pt">Notes: '+esc(a.notes)+'</span>';
    h+='</div>';});
  document.getElementById("shPreview").innerHTML=h;
  document.getElementById("shLink").value="https://studytrack.example/share/k7f2-q9m4";
}
function openShare(){opener=document.activeElement;renderShare();openDlg("dlgShare");}
document.getElementById("shSwitch").addEventListener("change",function(e){
  data.share.on=e.target.checked;
  if(data.share.on&&!data.share.ids.length)data.share.ids=active().map(function(a){return a.id;});
  save();renderShare();renderChrome();
  toast(data.share.on?"Read-only sharing is on. Check the preview before you send the link.":"Sharing is off. The link no longer works.");
});
document.getElementById("dlgShare").addEventListener("change",function(e){
  var i=e.target.getAttribute("data-inc"),id=e.target.getAttribute("data-shid");
  if(i){data.share.include[i]=e.target.checked;}
  if(id){var k=data.share.ids.indexOf(id);if(e.target.checked&&k<0)data.share.ids.push(id);if(!e.target.checked&&k>-1)data.share.ids.splice(k,1);}
  if(i||id){save();renderShare();}
});
document.getElementById("copyLink").addEventListener("click",function(){
  var v=document.getElementById("shLink").value;try{navigator.clipboard.writeText(v);}catch(e){}
  toast("Link copied. (Simulated in this prototype.)");
});

/* ---------- prefs ---------- */
function renderPrefs(){
  var p=data.prefs;
  [["rm","reminders"],["lg","large"],["hc","contrast"]].forEach(function(x){document.getElementById(x[0]+"Sw").checked=!!p[x[1]];document.getElementById(x[0]+"St").textContent=p[x[1]]?"On":"Off";});
  document.getElementById("rmH").textContent=p.reminders?"On. You choose when to be reminded.":"Off. StudyTrack will not remind you.";
  document.getElementById("rmWhen").hidden=!p.reminders;document.getElementById("rmSel").value=p.remindWhen;
}
function openPrefs(){opener=document.activeElement;renderPrefs();openDlg("dlgPrefs");}
document.getElementById("dlgPrefs").addEventListener("change",function(e){
  var m={rmSw:"reminders",lgSw:"large",hcSw:"contrast"},id=e.target.id;
  if(m[id]){data.prefs[m[id]]=e.target.checked;}
  if(id==="rmSel")data.prefs.remindWhen=e.target.value;
  save();renderPrefs();renderAll();
  if(id==="rmSw")toast(data.prefs.reminders?"Reminders are on. You can switch them off at any time.":"Reminders are off.");
});
document.getElementById("resetData").addEventListener("click",function(){data=seed();ui.open={};save();renderPrefs();renderAll();toast("Sample data restored.");});

/* ---------- actions ---------- */
function setTab(t){ui.tab=t;renderAll();}
document.addEventListener("click",function(e){
  var nav=e.target.closest("[data-tab]");if(nav){setTab(nav.getAttribute("data-tab"));return;}
  var b=e.target.closest("[data-act]");
  if(!b){var row=e.target.closest("[data-rowtoggle]");if(row&&!e.target.closest("button,a,input,label")){var it=row.closest(".item");toggle(it.getAttribute("data-id"));}return;}
  var act=b.getAttribute("data-act"),id=b.getAttribute("data-id"),a=id?byId(id):null;
  if(act==="toggle"){toggle(id,true);}
  else if(act==="add"){openAssign();}
  else if(act==="clearq"){ui.q="";document.getElementById("q").value="";renderList();document.getElementById("q").focus();}
  else if(act==="continue"){ui.tab="todo";ui.open[id]=true;renderAll();var t=document.getElementById("t-"+id);if(t){t.scrollIntoView({block:"center"});t.focus();}}
  else if(act==="edit"){openAssign(id);}
  else if(act==="complete"){a.completed=true;save();renderAll();focusRowAfter(id);toast("\u201c"+a.title+"\u201d is marked complete. Nice work.",function(){a.completed=false;save();renderAll();});}
  else if(act==="reopen"){a.completed=false;save();renderAll();toast("\u201c"+a.title+"\u201d moved back to your to-do list.");}
  else if(act==="archive"){a.archived=true;save();renderAll();toast("\u201c"+a.title+"\u201d moved to Archive.",function(){a.archived=false;save();renderAll();});}
  else if(act==="restore"){a.archived=false;save();renderAll();toast("\u201c"+a.title+"\u201d restored.");}
  else if(act==="delete"){opener=null;document.getElementById("cText").textContent="\u201c"+a.title+"\u201d will be removed for good. This cannot be undone.";var ok=document.getElementById("cOk");ok.onclick=function(){data.assignments=data.assignments.filter(function(x){return x.id!==id;});save();document.getElementById("dlgConfirm").close();renderAll();toast("Assignment deleted.");};openDlg("dlgConfirm");document.getElementById("cCancel").focus();}
  else if(act==="rmstep"){var sid=b.getAttribute("data-sid");var rm=a.steps.filter(function(s){return s.id===sid;})[0];a.steps=a.steps.filter(function(s){return s.id!==sid;});save();renderAll();focusRowAfter(id);toast("Step removed.",function(){a.steps.push(rm);save();renderAll();});}
});
function focusRowAfter(id){var t=document.getElementById("t-"+id);if(t)t.focus();}
function toggle(id,fromBtn){ui.open[id]=!ui.open[id];var it=document.querySelector('.item[data-id="'+id+'"]');
  var btn=document.getElementById("t-"+id),det=document.getElementById("d-"+id);
  btn.setAttribute("aria-expanded",ui.open[id]);det.hidden=!ui.open[id];}
document.addEventListener("change",function(e){
  var c=e.target.closest('[data-act="step"]');if(!c)return;
  var a=byId(c.getAttribute("data-id")),s=a.steps.filter(function(x){return x.id===c.getAttribute("data-sid");})[0];
  s.done=c.checked;save();var scroll=window.scrollY;renderAll();window.scrollTo(0,scroll);
  var again=document.querySelector('[data-sid="'+s.id+'"][data-act="step"]');if(again)again.focus();
  var d=stepsDone(a),t=a.steps.length;
  if(c.checked){toast(d===t?"All "+t+" steps are checked off. Mark the assignment complete when you are ready.":"Step checked. "+d+" of "+t+" done \u2013 "+pct(a)+"% complete.");}
  else toast("Step unchecked. "+d+" of "+t+" done.");
});
document.addEventListener("submit",function(e){
  var f=e.target.closest('[data-act="addstep"]');if(!f)return;e.preventDefault();
  var a=byId(f.getAttribute("data-id")),inp=f.querySelector("input"),v=inp.value.trim();
  if(!v){inp.setAttribute("aria-invalid","true");toast("Type what the step is, then choose Add step.");return;}
  a.steps.push({id:uid("s"),text:v,done:false});save();renderAll();
  var again=document.getElementById("ns-"+a.id);if(again)again.focus();
  toast("Step added to \u201c"+a.title+"\u201d.");
});
document.getElementById("addBtn").addEventListener("click",function(){openAssign();});
document.getElementById("openShare").addEventListener("click",openShare);
document.getElementById("openPrefs").addEventListener("click",openPrefs);
document.getElementById("openPrefs2").addEventListener("click",openPrefs);
document.getElementById("q").addEventListener("input",function(e){ui.q=e.target.value;renderList();});
document.getElementById("sort").addEventListener("change",function(e){ui.sort=e.target.value;renderList();});

/* ---------- accounts (simulated, browser-only) ---------- */
function accounts(){try{return JSON.parse(localStorage.getItem("studytrack.accounts"))||{};}catch(e){return{};}}
function saveAccounts(a){try{localStorage.setItem("studytrack.accounts",JSON.stringify(a));}catch(e){}}
function hashPw(email,pw){
  var str="studytrack|"+email+"|"+pw;
  try{return crypto.subtle.digest("SHA-256",new TextEncoder().encode(str)).then(function(b){return Array.prototype.map.call(new Uint8Array(b),function(x){return x.toString(16).padStart(2,"0");}).join("");});}
  catch(e){var h=5381;for(var i=0;i<str.length;i++)h=((h<<5)+h+str.charCodeAt(i))|0;return Promise.resolve("d"+h);}
}
function validEmail(v){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);}
function authClear(form){
  form.querySelectorAll(".err").forEach(function(e){e.remove();});
  form.querySelectorAll(".fld.bad").forEach(function(g){g.classList.remove("bad");});
  form.querySelectorAll("input").forEach(function(i){i.removeAttribute("aria-invalid");if(i.dataset.d!==undefined)i.setAttribute("aria-describedby",i.dataset.d);});
  form.querySelector(".errsum").hidden=true;
}
function authFail(form,errs){
  authClear(form);
  errs.forEach(function(x){
    var g=document.getElementById(x[0]),inp=document.getElementById(x[1]);
    if(inp.dataset.d===undefined)inp.dataset.d=inp.getAttribute("aria-describedby")||"";
    g.classList.add("bad");
    var p=document.createElement("p");p.className="err";p.id="e-"+x[1];
    p.innerHTML=icon("alert")+'<span><span class="sr">Error: </span>'+esc(x[2])+'</span>';
    g.insertBefore(p,g.querySelector(".help"));
    inp.setAttribute("aria-invalid","true");inp.setAttribute("aria-describedby","e-"+x[1]+" "+inp.dataset.d);
  });
  var sm=form.querySelector(".errsum");
  sm.innerHTML="<strong>"+(errs.length===1?"There is 1 thing to fix:":"There are "+errs.length+" things to fix:")+"</strong><ul>"+errs.map(function(x){return'<li><a href="#'+x[1]+'" data-jump="'+x[1]+'">'+esc(x[2])+"</a></li>";}).join("")+"</ul>";
  sm.hidden=false;sm.focus();
}
document.querySelector(".authcard").addEventListener("click",function(e){var a=e.target.closest("[data-jump]");if(a){e.preventDefault();document.getElementById(a.getAttribute("data-jump")).focus();}});
function showAuthTab(t){
  var inn=t==="in";
  document.getElementById("fIn").hidden=!inn;document.getElementById("fUp").hidden=inn;
  document.getElementById("tabIn").setAttribute("aria-pressed",inn);document.getElementById("tabUp").setAttribute("aria-pressed",!inn);
  document.getElementById("authH").textContent=inn?"Welcome back.":"Create your account.";
  document.getElementById("authSub").textContent=inn?"Sign in to see your assignments.":"It takes under a minute. Your plan stays private.";
}
document.getElementById("tabIn").addEventListener("click",function(){showAuthTab("in");});
document.getElementById("tabUp").addEventListener("click",function(){showAuthTab("up");});
document.getElementById("useDemo").addEventListener("click",function(){
  showAuthTab("in");authClear(document.getElementById("fIn"));
  document.getElementById("inEmail").value=DEMO.email;document.getElementById("inPw").value=DEMO.pw;
  document.querySelector("#fIn button[type=submit]").focus();
});
document.addEventListener("change",function(e){var k=e.target.getAttribute&&e.target.getAttribute("data-showpw");if(k)document.getElementById(k).type=e.target.checked?"text":"password";});
var MISMATCH=["g-inPw","inPw","That email and password do not match. Check them, or use the demo details below."];
document.getElementById("fIn").addEventListener("submit",function(e){
  e.preventDefault();var f=e.currentTarget,errs=[];
  var em=document.getElementById("inEmail").value.trim().toLowerCase(),pw=document.getElementById("inPw").value;
  if(!em)errs.push(["g-inEmail","inEmail","Enter your email address, for example name@university.ac.za."]);
  else if(!validEmail(em))errs.push(["g-inEmail","inEmail","That email address looks incomplete. Check for an @ sign and a domain."]);
  if(!pw)errs.push(["g-inPw","inPw","Enter your password."]);
  if(errs.length){authFail(f,errs);return;}
  authClear(f);
  if(em===DEMO.email){if(pw===DEMO.pw)startSession({email:em,name:DEMO.name,demo:true},"in");else authFail(f,[MISMATCH]);return;}
  var acc=accounts()[em];if(!acc){authFail(f,[MISMATCH]);return;}
  hashPw(em,pw).then(function(h){if(h===acc.h)startSession({email:em,name:acc.name,demo:false},"in");else authFail(f,[MISMATCH]);});
});
document.getElementById("fUp").addEventListener("submit",function(e){
  e.preventDefault();var f=e.currentTarget,errs=[];
  var nm=document.getElementById("upName").value.trim(),em=document.getElementById("upEmail").value.trim().toLowerCase(),pw=document.getElementById("upPw").value;
  if(!nm)errs.push(["g-upName","upName","Enter your name."]);
  if(!em)errs.push(["g-upEmail","upEmail","Enter your email address, for example name@university.ac.za."]);
  else if(!validEmail(em))errs.push(["g-upEmail","upEmail","That email address looks incomplete. Check for an @ sign and a domain."]);
  else if(em===DEMO.email||accounts()[em])errs.push(["g-upEmail","upEmail","An account with that email already exists. Choose Sign in instead."]);
  if(pw.length<8)errs.push(["g-upPw","upPw",pw?"Use at least 8 characters.":"Enter a password with at least 8 characters."]);
  if(errs.length){authFail(f,errs);return;}
  authClear(f);
  hashPw(em,pw).then(function(h){var a=accounts();a[em]={name:nm,h:h};saveAccounts(a);startSession({email:em,name:nm,demo:false},"up");});
});
function startSession(u,how){
  user=u;KEY="studytrack.final.v1:"+u.email;data=load();
  ui={tab:"todo",q:"",sort:"soonest",open:{},last:null};
  document.getElementById("q").value="";document.getElementById("sort").value="soonest";
  try{localStorage.setItem("studytrack.session",JSON.stringify(u));}catch(e){}
  document.body.dataset.auth="in";
  var ini=u.name.split(/\s+/).filter(Boolean).map(function(w){return w[0];}).slice(0,2).join("").toUpperCase()||"ST";
  var av=document.getElementById("avatar");av.textContent=ini;av.setAttribute("aria-label","Signed in as "+u.name);av.title=u.name+" ("+u.email+")";
  document.getElementById("acctInfo").textContent="Signed in as "+u.name+" ("+u.email+").";
  renderAll();
  var first=u.name.split(" ")[0];
  if(how==="in")toast("Welcome back, "+first+".");
  if(how==="up")toast("Account created. Welcome to StudyTrack, "+first+".");
  if(how!=="restore"){window.scrollTo(0,0);document.getElementById("main").focus();}
}
function signOut(){
  document.querySelectorAll("dialog[open]").forEach(function(d){d.close();});
  try{localStorage.removeItem("studytrack.session");}catch(e){}
  user=null;data=blank();opener=null;
  document.getElementById("toasts").innerHTML="";
  document.documentElement.dataset.size="normal";document.documentElement.dataset.contrast="normal";
  document.body.dataset.auth="out";showAuthTab("in");
  ["inEmail","inPw","upName","upEmail","upPw"].forEach(function(id){document.getElementById(id).value="";});
  authClear(document.getElementById("fIn"));authClear(document.getElementById("fUp"));
  document.getElementById("inEmail").focus();
}
document.getElementById("signOut").addEventListener("click",signOut);
document.getElementById("signOut2").addEventListener("click",signOut);

var ses=null;try{ses=JSON.parse(localStorage.getItem("studytrack.session"));}catch(e){}
if(ses&&ses.email){startSession(ses,"restore");}
})();
