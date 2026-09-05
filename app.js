const defaultPricing = [
  {group:"Einzelteile", icon:"👕", items:[
    {name:"T-Shirt / Top", min:5, max:8},
    {name:"Hoodie / Pullover", min:8, max:12},
    {name:"Jacke / Mantel", min:12, max:18},
    {name:"Hose / Jeans", min:8, max:12},
    {name:"Schuhe", min:10, max:15},
    {name:"Cap / Mütze / Hut", min:5, max:7},
    {name:"Accessoires", min:5, max:10}
  ]},
  {group:"Outfit-Pakete", icon:"👗", items:[
    {name:"Business / Elegant", min:25, max:35},
    {name:"Event-Outfit", min:30, max:45},
    {name:"Individuelles Custom-Outfit", min:40, max:70}
  ]},
  {group:"Fraktions- & Spezialkleidung", icon:"🚓", items:[
    {name:"Fraktions-Outfit", min:30, max:50},
    {name:"Gang-Outfit", min:25, max:40},
    {name:"Einsatzkleidung", min:45, max:80}
  ]},
  {group:"Zusatzleistungen", icon:"⚙️", items:[
    {name:"Kleine Änderungen", min:5, max:10},
    {name:"Umfangreiches Rework", min:15, max:30},
    {name:"Express-Bearbeitung (48 Stunden)", min:35, max:40, surcharge:true}
  ]},
  {group:"Logos", icon:"🖼️", items:[
    {name:"Individuelles Logo", min:2, max:2, per:"pro Logo"}
  ]}
];

const seed = {
  pricing: defaultPricing,
  orders: [
    {id:"KC-2026-0042", client:"Max M.", type:"Hoodie / Pullover", designer:"Konsti Shakur", priceMin:8, priceMax:12, finalPrice:10, deadline:"2026-09-07", status:"In Bearbeitung", progress:65, priority:"Hoch", organization:"Black Order", description:"Schwarz/Türkis, Logo Brust + Rücken"},
    {id:"KC-2026-0041", client:"Lena S.", type:"Individuelles Custom-Outfit", designer:"Mira V.", priceMin:40, priceMax:70, finalPrice:55, deadline:"2026-09-09", status:"Kundenvorschau", progress:80, priority:"Normal", organization:"Privat", description:"Elegantes Damen-Outfit mit eigenem Muster"},
    {id:"KC-2026-0040", client:"Denis K.", type:"Einsatzkleidung", designer:"Konsti Shakur", priceMin:45, priceMax:80, finalPrice:65, deadline:"2026-09-05", status:"Warten auf Kunde", progress:72, priority:"Hoch", organization:"Bloodline", description:"Taktische Weste + passende Hose"}
  ],
  clothing: [
    {name:"Luxury Hoodie", category:"Oberteile", customer:"Max M.", versions:3, status:"Freigegeben"},
    {name:"Streetwear Pants", category:"Hosen", customer:"Lena S.", versions:2, status:"Kundenvorschau"},
    {name:"Tactical Weste", category:"Westen", customer:"Denis K.", versions:1, status:"In Bearbeitung"}
  ],
  customers: [
    {name:"Max M.", discord:"maxm", organization:"Black Order", orders:2, revenue:18, status:"Aktiv"},
    {name:"Lena S.", discord:"lena.s", organization:"Privat", orders:1, revenue:55, status:"Aktiv"},
    {name:"Denis K.", discord:"denis.k", organization:"Bloodline", orders:1, revenue:65, status:"Aktiv"}
  ],
  tickets: [
    {id:"#128", title:"Logo auf Hose zu klein", client:"Max M.", priority:"Dringend", status:"Offen", assigned:"Konsti Shakur"},
    {id:"#127", title:"Neue Textur hochladen", client:"Lena S.", priority:"Normal", status:"Warten auf Kunde", assigned:"Mira V."}
  ],
  employees:[
    {name:"Konsti Shakur", role:"Inhaber / Admin", permissions:"Vollzugriff", active:true},
    {name:"Mira V.", role:"Designer", permissions:"Clothing, Aufträge, Tickets", active:true}
  ],
  categories:["Oberteile","Hosen","Westen","Masken","Accessoires","Komplette Outfits","Texture Fix","Logo Platzierung"],
  showcase:[
    {name:"Black & Gold Hoodie",category:"Oberteile",tag:"Premium"},
    {name:"Urban Pants Pack",category:"Hosen",tag:"Streetwear"},
    {name:"Tactical Vest",category:"Westen",tag:"FiveM"},
    {name:"Luxury Full Outfit",category:"Komplette Outfits",tag:"Custom"},
    {name:"Halloween Drop",category:"Hosen",tag:"Limited"},
    {name:"Logo Placement Set",category:"Accessoires",tag:"Branding"}
  ],
  logs:[
    "KC-2026-0042 wurde auf 65% gesetzt",
    "Preisangebot für KC-2026-0042 auf 10 € gesetzt",
    "Ticket #128 wurde Konsti Shakur zugewiesen",
    "Luxury Hoodie — Version 3 als final markiert"
  ],
  notifications:[
    "Ticket #128 ist als dringend markiert.",
    "KC-2026-0040 ist morgen fällig.",
    "Lena S. wartet auf Kundenvorschau."
  ]
};

let state = JSON.parse(localStorage.getItem("konyaAdminStateV3") || "null") || seed;
if(!state.pricing) state.pricing = defaultPricing;
if(!state.notificationSettings) state.notificationSettings={
  newOrder:true,
  urgentTicket:true,
  previewApproved:true,
  changeRequested:true,
  paymentReceived:true
};
state.orders.forEach(o=>{
  if(!o.paymentStatus) o.paymentStatus = o.finalPrice ? "Zahlung offen" : "Nicht berechnet";
  if(o.paidAt===undefined) o.paidAt = "";
  if(o.invoiceNote===undefined) o.invoiceNote = "";
});
state.orders.forEach(o=>{
  if(!o.customerCode) o.customerCode=o.id;
  if(!o.history) o.history=[
    {label:"Auftrag erstellt",date:"04.09.2026"},
    {label:o.status||"Anfrage",date:"04.09.2026"}
  ];
});
state.orders.forEach(o=>{
  if(o.internalNote===undefined) o.internalNote="";
  if(o.priority===undefined) o.priority="Normal";
  if(o.progress===undefined) o.progress=0;
});
state.tickets.forEach(t=>{
  if(t.orderId===undefined) t.orderId="";
  if(t.internalNote===undefined) t.internalNote="";
  if(!t.messages) t.messages=[];
  if(!t.createdAt) t.createdAt="05.09.2026";
});
state.employees.forEach((e,i)=>{
  if(e.status===undefined) e.status=e.active===false?"Inaktiv":"Aktiv";
  if(!Array.isArray(e.permissions)){
    e.permissions=e.role==="Inhaber / Admin"
      ? ["Aufträge","Kunden","Tickets","Showcase","Preise","Mitarbeiter","Logs"]
      : ["Aufträge","Kunden","Tickets","Showcase"];
  }
  delete e.active;
  if(e.note===undefined) e.note="";
  if(e.joinedAt===undefined) e.joinedAt=i===0?"01.09.2026":"03.09.2026";
});
// V3.4.1 migration: repair the known demo hoodie order if an older localStorage version stored 5 €.
const demoHoodie=state.orders.find(o=>o.id==="KC-2026-0042" && o.type==="Hoodie / Pullover");
if(demoHoodie){
  demoHoodie.priceMin=8;
  demoHoodie.priceMax=12;
  if(Number(demoHoodie.finalPrice)===5) demoHoodie.finalPrice=10;
}

function isOrderOpen(o){ return !["Fertig","Ausgeliefert","Storniert"].includes(o.status); }
function isTicketOpen(t){ return !["Gelöst","Geschlossen"].includes(t.status); }

function nextOrderId(){
  const nums=state.orders
    .map(o=>Number(String(o.id||"").match(/(\d{4})$/)?.[1]||0))
    .filter(Boolean);
  const next=Math.max(42,...nums)+1;
  return `KC-2026-${String(next).padStart(4,"0")}`;
}

function syncCustomerMetrics(){
  state.customers.forEach(c=>{
    const orders=state.orders.filter(o=>o.client===c.name);
    c.orders=orders.length;
    c.revenue=orders
      .filter(o=>o.paymentStatus==="Bezahlt" && Number(o.finalPrice)>0)
      .reduce((sum,o)=>sum+Number(o.finalPrice),0);
  });
}

let backendReady=false;
let backendSaveTimer=null;
let backendSaving=false;

function setBackendStatus(mode,text){
  const el=document.getElementById("backendStatus");
  if(!el) return;
  el.textContent=text;
  el.dataset.mode=mode;
}

async function pushStateToBackend(){
  if(!backendReady || backendSaving) return;
  backendSaving=true;
  setBackendStatus("syncing","Datenbank synchronisiert …");
  try{
    const res=await fetch("/api/state",{
      method:"PUT",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({state})
    });
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    setBackendStatus("online","Datenbank verbunden");
  }catch(err){
    console.error("Backend save failed:",err);
    setBackendStatus("offline","Datenbank offline · Browser-Backup aktiv");
  }finally{
    backendSaving=false;
  }
}

function scheduleBackendSave(){
  if(!backendReady) return;
  clearTimeout(backendSaveTimer);
  backendSaveTimer=setTimeout(pushStateToBackend,350);
}

const save = () => {
  syncCustomerMetrics();
  localStorage.setItem("konyaAdminStateV3", JSON.stringify(state));
  scheduleBackendSave();
};

async function filesToAttachments(fileList){
  const files=[...fileList].slice(0,6);
  const maxBytes=2*1024*1024;
  const out=[];
  for(const file of files){
    if(file.size>maxBytes) continue;
    const data=await new Promise((resolve,reject)=>{
      const r=new FileReader();
      r.onload=()=>resolve(r.result);
      r.onerror=reject;
      r.readAsDataURL(file);
    });
    out.push({name:file.name,type:file.type||"application/octet-stream",size:file.size,data});
  }
  return out;
}
function attachmentHtml(a){
  const isImg=(a.type||"").startsWith("image/");
  return `<div class="attachment-card">
    <div class="attachment-preview">${isImg?`<img src="${a.data}" alt="${a.name}">`:"▧"}</div>
    <div class="attachment-meta">
      <b title="${a.name}">${a.name}</b>
      <span>${Math.max(1,Math.round(a.size/1024))} KB</span>
      <div class="attachment-actions">
        <a class="secondary-btn" style="height:30px;padding:0 9px;display:inline-flex;align-items:center" href="${a.data}" download="${a.name}">Herunterladen</a>
      </div>
    </div>
  </div>`;
}
function previewBlock(o){
  const p=o.preview;
  if(!p) return `<div class="preview-empty">Noch keine Kundenvorschau hochgeladen.</div>`;
  const isImg=(p.type||"").startsWith("image/");
  return `<div class="customer-preview-card">
    <div class="customer-preview-image">${isImg?`<img src="${p.data}" alt="${p.name}">`:"<span>▧</span>"}</div>
    <div class="customer-preview-meta">
      <b>${p.name}</b>
      <span>Version ${o.previewVersion||1} · ${o.approvalStatus||"Wartet auf Kunde"}</span>
    </div>
  </div>`;
}
save(); // persist V3.4.1 migrations

const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";
const isAdminRoute = currentPath === "/admin" || currentPath.startsWith("/admin/");
const isCustomerRoute = currentPath === "/kundenbereich" || currentPath.startsWith("/kundenbereich/");
const isPublicRoute = !isAdminRoute && !isCustomerRoute;

document.body.classList.toggle("admin-mode", isAdminRoute);
document.body.classList.toggle("customer-mode", isCustomerRoute);
document.body.classList.toggle("public-mode", isPublicRoute);

const root = document.getElementById("viewRoot");
const title = document.getElementById("pageTitle");
const subtitle = document.getElementById("pageSubtitle");

function eur(n){ return `${Number(n).toFixed(Number(n)%1?2:0).replace(".",",")} €`; }
function priceRange(item){
  if(item.min===item.max) return `${eur(item.min)}${item.per?` ${item.per}`:""}`;
  return `${eur(item.min)} – ${eur(item.max)}${item.surcharge?" Aufpreis":""}`;
}
function allServices(){ return state.pricing.flatMap(g=>g.items.map(i=>({...i,group:g.group}))); }
function findService(name){ return allServices().find(i=>i.name===name); }
function priceLookup(name){ return findService(name) || {min:0,max:0}; }
async function filesToDataUrls(fileList){ return filesToAttachments(fileList || []); }
function statusClass(s){
  if(/fertig|freigegeben|ausgeliefert|aktiv/i.test(s)) return "done";
  if(/warten|vorschau/i.test(s)) return "wait";
  if(/bearbeitung/i.test(s)) return "progress";
  if(/überfällig|storniert|dringend/i.test(s)) return "danger";
  return "new";
}
function paymentClass(s){
  if(s==="Bezahlt") return "done";
  if(s==="Zahlung offen") return "wait";
  if(s==="Storniert") return "danger";
  return "new";
}
function addNotification(message,type="system"){
  const map={
    newOrder:"newOrder",
    urgentTicket:"urgentTicket",
    previewApproved:"previewApproved",
    changeRequested:"changeRequested",
    paymentReceived:"paymentReceived",
    system:"system"
  };
  const setting=map[type];
  if(setting!=="system" && state.notificationSettings && state.notificationSettings[setting]===false) return;
  state.notifications.unshift(message);
  state.notifications=state.notifications.slice(0,30);
  const dot=document.getElementById("notifyDot");
  if(dot) dot.style.display="block";
}

function showToast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
function kpi(label,val,foot,cls=""){return `<div class="kpi ${cls}"><div class="kpi-label">${label}</div><div class="kpi-value">${val}</div><div class="kpi-foot">${foot}</div></div>`}

function dashboard(){
  const urgent=state.tickets.filter(x=>x.priority==="Dringend" && x.status!=="Geschlossen").length;
  const openTickets=state.tickets.filter(isTicketOpen).length;
  const openOrders=state.orders.filter(isOrderOpen);
  const openPayments=state.orders.filter(o=>o.paymentStatus==="Zahlung offen").length;
  const activeCustomers=state.customers.filter(c=>c.status!=="Inaktiv").length;
  const previewWaiting=state.clothing.filter(c=>c.status==="Kundenvorschau").length;
  const activeEmployees=state.employees.filter(e=>e.status==="Aktiv").length;
  const completedOrders=state.orders.filter(o=>["Fertig","Ausgeliefert"].includes(o.status)).length;

  title.textContent="Dashboard";
  subtitle.textContent="Deine Aufträge, Kunden und offenen Aufgaben auf einen Blick.";

  root.innerHTML=`
    <div class="admin-dashboard-v2">
      <section class="admin-welcome-v2">
        <div class="admin-welcome-copy">
          <span class="admin-small-label">HEUTE IM ÜBERBLICK</span>
          <h2>Willkommen zurück, Konsti.</h2>
          <p>Hier siehst du sofort, was erledigt werden muss und wie deine aktuellen Aufträge stehen.</p>
        </div>

        <div class="admin-welcome-actions">
          <button class="admin-action-card primary" onclick="openOrderModal()">
            <span class="admin-action-icon">＋</span>
            <span><strong>Neuer Auftrag</strong><small>Auftrag manuell anlegen</small></span>
          </button>
          <button class="admin-action-card" onclick="render('tickets')">
            <span class="admin-action-icon">□</span>
            <span><strong>Tickets öffnen</strong><small>${openTickets} aktuell offen</small></span>
          </button>
          <button class="admin-action-card" onclick="window.location.href='/'">
            <span class="admin-action-icon">↗</span>
            <span><strong>Homepage</strong><small>Öffentliche Seite ansehen</small></span>
          </button>
        </div>
      </section>

      <section class="admin-stat-row-v2">
        <article>
          <div class="admin-stat-top"><span>Offene Aufträge</span><b>▣</b></div>
          <strong>${openOrders.length}</strong>
          <small>${completedOrders} bereits abgeschlossen</small>
        </article>
        <article>
          <div class="admin-stat-top"><span>Aktive Kunden</span><b>◎</b></div>
          <strong>${activeCustomers}</strong>
          <small>${state.customers.length} Kunden insgesamt</small>
        </article>
        <article class="${urgent ? "warning" : ""}">
          <div class="admin-stat-top"><span>Dringende Tickets</span><b>!</b></div>
          <strong>${urgent}</strong>
          <small>${openTickets} Tickets insgesamt offen</small>
        </article>
        <article class="${openPayments ? "payment" : ""}">
          <div class="admin-stat-top"><span>Offene Zahlungen</span><b>€</b></div>
          <strong>${openPayments}</strong>
          <small>Zahlungsstatus prüfen</small>
        </article>
      </section>

      <section class="admin-main-grid-v2">
        <div class="admin-main-column-v2">
          <article class="admin-panel-v2">
            <div class="admin-panel-head-v2">
              <div>
                <span class="admin-small-label">AUFTRÄGE</span>
                <h3>Aktuelle Aufträge</h3>
              </div>
              <button onclick="render('orders')">Alle ansehen →</button>
            </div>

            <div class="admin-order-list-v2">
              ${openOrders.length ? openOrders.slice(0,6).map(o=>`
                <button class="admin-order-row-v2" onclick="openOrderDetail('${o.id}')">
                  <div class="admin-order-id-v2"><strong>${o.id}</strong><small>${o.type||"Custom Clothing"}</small></div>
                  <div class="admin-order-client-v2"><strong>${o.client}</strong><small>${o.organization||"Privat"}</small></div>
                  <div class="admin-order-status-v2"><span class="status ${statusClass(o.status)}">${o.status}</span></div>
                  <div class="admin-order-progress-v2">
                    <div><span>Fortschritt</span><b>${o.progress||0}%</b></div>
                    <div class="progress"><span style="width:${o.progress||0}%"></span></div>
                  </div>
                  <div class="admin-order-price-v2"><strong>${o.finalPrice?eur(o.finalPrice):`${eur(o.priceMin)}–${eur(o.priceMax)}`}</strong><small>${o.paymentStatus||"Nicht berechnet"}</small></div>
                  <span class="admin-row-arrow-v2">→</span>
                </button>`).join("") : `
                <div class="admin-empty-v2">
                  <span>✓</span><strong>Keine offenen Aufträge</strong><small>Aktuell ist alles erledigt.</small>
                </div>`}
            </div>
          </article>

          <article class="admin-panel-v2 admin-performance-v2">
            <div class="admin-panel-head-v2">
              <div>
                <span class="admin-small-label">STATUS</span>
                <h3>Arbeitsstand</h3>
              </div>
            </div>

            <div class="admin-performance-grid-v2">
              <div><span>Vorschau wartet</span><strong>${previewWaiting}</strong><small>auf Kundenfreigabe</small></div>
              <div><span>Aktive Mitarbeiter</span><strong>${activeEmployees}</strong><small>im System verfügbar</small></div>
              <div><span>Designs</span><strong>${state.clothing.length}</strong><small>im Clothing-Bereich</small></div>
              <div><span>Showcase</span><strong>${state.showcase.length}</strong><small>öffentliche Einträge</small></div>
            </div>
          </article>
        </div>

        <aside class="admin-side-column-v2">
          <article class="admin-panel-v2">
            <div class="admin-panel-head-v2 compact">
              <div>
                <span class="admin-small-label">PRIORITÄT</span>
                <h3>Jetzt erledigen</h3>
              </div>
            </div>

            <div class="admin-task-list-v2">
              <button onclick="render('tickets')">
                <span class="admin-task-icon-v2 danger">!</span>
                <span><strong>${urgent} dringende Tickets</strong><small>Supportfälle zuerst prüfen</small></span>
                <b>→</b>
              </button>
              <button onclick="render('orders')">
                <span class="admin-task-icon-v2 money">€</span>
                <span><strong>${state.orders.filter(o=>!o.finalPrice).length} Preisangebote offen</strong><small>Endpreis festlegen</small></span>
                <b>→</b>
              </button>
              <button onclick="render('orders')">
                <span class="admin-task-icon-v2 pay">€</span>
                <span><strong>${openPayments} Zahlungen offen</strong><small>Zahlungsstatus kontrollieren</small></span>
                <b>→</b>
              </button>
              <button onclick="render('tickets')">
                <span class="admin-task-icon-v2 wait">□</span>
                <span><strong>${state.tickets.filter(t=>t.status==="Warten auf Kunde").length} warten auf Kunden</strong><small>Rückmeldungen im Blick behalten</small></span>
                <b>→</b>
              </button>
            </div>
          </article>

          <article class="admin-panel-v2 admin-quick-links-v2">
            <div class="admin-panel-head-v2 compact">
              <div>
                <span class="admin-small-label">SCHNELLZUGRIFF</span>
                <h3>Direkt öffnen</h3>
              </div>
            </div>

            <div class="admin-quick-grid-v2">
              <button onclick="render('customers')"><span>◎</span><strong>Kunden</strong></button>
              <button onclick="render('pricing')"><span>€</span><strong>Preise</strong></button>
              <button onclick="render('employees')"><span>♙</span><strong>Mitarbeiter</strong></button>
              <button onclick="render('showcase')"><span>◇</span><strong>Showcase</strong></button>
            </div>
          </article>
        </aside>
      </section>
    </div>`;
}


function genericTable(view){
  const configs={
    clothing:{t:"Clothing",s:"Designs, Versionen und Freigaben verwalten.",btn:"+ Design",headers:["Design","Kategorie","Kunde","Versionen","Status"],rows:state.clothing.map(x=>[x.name,x.category,x.customer,"v"+x.versions,`<span class="status ${statusClass(x.status)}">${x.status}</span>`]),action:"openClothingModal()"},
    customers:{t:"Kunden",s:"Kundenakten, Discord, Bestellungen und Umsatz.",btn:"+ Kunde",headers:["Kunde","Discord","Organisation","Aufträge","Umsatz","Status"],rows:state.customers.map(x=>[x.name,x.discord,x.organization,x.orders,eur(x.revenue),`<span class="status ${statusClass(x.status)}">${x.status}</span>`]),action:"openCustomerModal()"},
    tickets:{t:"Tickets",s:"Support, Änderungswünsche, Auftragsbezug und Zuständigkeit.",btn:"+ Ticket",headers:["Ticket","Betreff","Kunde","Auftrag","Priorität","Status","Zuständig"],rows:state.tickets.map(x=>[`<b onclick="openTicketDetail('${x.id}')" style="cursor:pointer;color:var(--accent)">${x.id}</b>`,x.title,x.client,x.orderId||"—",`<span class="status ${x.priority==="Dringend"?"danger":x.priority==="Hoch"?"wait":"new"}">${x.priority}</span>`,`<span class="status ${statusClass(x.status)}">${x.status}</span>`,x.assigned]),action:"openTicketModal()"},
    employees:{t:"Mitarbeiter",s:"Team, Rollen, Rechte und Auslastung verwalten.",btn:"+ Mitarbeiter",headers:["Name","Rolle","Berechtigungen","Status","Aufträge","Tickets"],rows:state.employees.map(x=>[`<b onclick="openEmployeeDetail('${x.name.replace(/'/g,"\\'")}')" class="table-link">${x.name}</b>`,x.role,(x.permissions||[]).join(", "),`<span class="status ${x.status==="Aktiv"?"done":"danger"}">${x.status}</span>`,state.orders.filter(o=>o.designer===x.name && isOrderOpen(o)).length,state.tickets.filter(t=>t.assigned===x.name && isTicketOpen(t)).length]),action:"openEmployeeModal()"}
  };
  if(view==="orders") return renderOrdersTable();
  const c=configs[view]; title.textContent=c.t; subtitle.textContent=c.s;
  root.innerHTML=`<div class="toolbar"><div class="toolbar-left"><input class="field" id="tableSearch" placeholder="Suchen ..."></div><div class="toolbar-right"><button class="primary-btn" onclick="${c.action}">${c.btn}</button></div></div>
  <div class="panel"><div class="panel-body table-wrap"><table id="mainTable"><thead><tr>${c.headers.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${c.rows.map(r=>`<tr>${r.map(v=>`<td>${v}</td>`).join("")}</tr>`).join("")}</tbody></table></div></div>`;
  document.getElementById("tableSearch").addEventListener("input",e=>{const q=e.target.value.toLowerCase();[...document.querySelectorAll("#mainTable tbody tr")].forEach(tr=>tr.style.display=tr.textContent.toLowerCase().includes(q)?"":"none")});
}

function renderOrdersTable(){
  title.textContent="Aufträge";
  subtitle.textContent="Schneller filtern, sortieren und wichtige Aufträge sofort finden.";
  const statuses=[...new Set(state.orders.map(o=>o.status))];
  const designers=[...new Set(state.orders.map(o=>o.designer))];
  root.innerHTML=`
    <div class="order-filter-bar">
      <input class="field" id="orderSearch" placeholder="Auftrag, Kunde oder Organisation suchen ...">
      <select class="field" id="filterStatus"><option value="">Alle Status</option>${statuses.map(s=>`<option>${s}</option>`).join("")}</select>
      <select class="field" id="filterPriority"><option value="">Alle Prioritäten</option>${["Niedrig","Normal","Hoch","Dringend"].map(s=>`<option>${s}</option>`).join("")}</select>
      <select class="field" id="filterDesigner"><option value="">Alle Designer</option>${designers.map(s=>`<option>${s}</option>`).join("")}</select>
      <select class="field" id="filterPayment"><option value="">Alle Zahlungen</option>${["Nicht berechnet","Zahlung offen","Bezahlt","Storniert"].map(s=>`<option>${s}</option>`).join("")}</select>
      <select class="field" id="orderSort"><option value="newest">Neueste zuerst</option><option value="deadline">Deadline zuerst</option><option value="priority">Priorität</option><option value="progress">Fortschritt</option></select>
      <button class="secondary-btn" onclick="resetOrderFilters()">Filter zurücksetzen</button>
      <button class="primary-btn" onclick="openOrderModal()">+ Auftrag</button>
    </div>
    <div class="order-filter-summary" id="orderFilterSummary"></div>
    <div class="panel"><div class="panel-body table-wrap"><table id="ordersTable"><thead><tr>
      <th>Auftrag</th><th>Kunde</th><th>Priorität</th><th>Organisation</th><th>Leistung</th><th>Endpreis</th><th>Zahlung</th><th>Status</th><th>Designer</th><th>Deadline</th><th>Fortschritt</th>
    </tr></thead><tbody id="ordersTableBody"></tbody></table></div></div>`;
  ["orderSearch","filterStatus","filterPriority","filterDesigner","filterPayment","orderSort"].forEach(id=>document.getElementById(id).addEventListener(id==="orderSearch"?"input":"change",applyOrderFilters));
  applyOrderFilters();
}

window.applyOrderFilters=function(){
  const q=(document.getElementById("orderSearch")?.value||"").toLowerCase();
  const status=document.getElementById("filterStatus")?.value||"";
  const priority=document.getElementById("filterPriority")?.value||"";
  const designer=document.getElementById("filterDesigner")?.value||"";
  const payment=document.getElementById("filterPayment")?.value||"";
  const sort=document.getElementById("orderSort")?.value||"newest";
  let rows=state.orders.filter(o=>{
    const text=`${o.id} ${o.client} ${o.organization||""} ${o.type}`.toLowerCase();
    return (!q||text.includes(q))&&(!status||o.status===status)&&(!priority||o.priority===priority)&&(!designer||o.designer===designer)&&(!payment||o.paymentStatus===payment);
  });
  const rank={Dringend:4,Hoch:3,Normal:2,Niedrig:1};
  if(sort==="deadline") rows.sort((a,b)=>String(a.deadline||"9999").localeCompare(String(b.deadline||"9999")));
  else if(sort==="priority") rows.sort((a,b)=>(rank[b.priority]||0)-(rank[a.priority]||0));
  else if(sort==="progress") rows.sort((a,b)=>(b.progress||0)-(a.progress||0));
  const tbody=document.getElementById("ordersTableBody");
  tbody.innerHTML=rows.map(x=>`<tr>
    <td><b onclick="openOrderDetail('${x.id}')" style="cursor:pointer;color:var(--accent)">${x.id}</b></td>
    <td>${x.client}</td>
    <td><span class="status ${x.priority==="Dringend"?"danger":x.priority==="Hoch"?"wait":"new"}">${x.priority}</span></td>
    <td>${x.organization||"Privat"}</td><td>${x.type}</td><td>${x.finalPrice?eur(x.finalPrice):"Offen"}</td>
    <td><span class="status ${paymentClass(x.paymentStatus)}">${x.paymentStatus}</span></td>
    <td><span class="status ${statusClass(x.status)}">${x.status}</span></td><td>${x.designer}</td><td>${x.deadline}</td>
    <td><div class="mini-progress"><span style="width:${x.progress||0}%"></span></div><small>${x.progress||0}%</small></td>
  </tr>`).join("") || `<tr><td colspan="11"><div class="empty">Keine Aufträge für diese Filter gefunden.</div></td></tr>`;
  document.getElementById("orderFilterSummary").innerHTML=`<span><b>${rows.length}</b> von ${state.orders.length} Aufträgen</span><span>${rows.filter(o=>o.priority==="Dringend").length} dringend</span><span>${rows.filter(o=>o.paymentStatus==="Zahlung offen").length} Zahlungen offen</span>`;
}
window.resetOrderFilters=function(){
  ["orderSearch","filterStatus","filterPriority","filterDesigner","filterPayment"].forEach(id=>{const el=document.getElementById(id);if(el)el.value=""});
  const sort=document.getElementById("orderSort");if(sort)sort.value="newest";applyOrderFilters();
}

function pricingView(){
  title.textContent="Preise & Leistungen"; subtitle.textContent="Richtpreise zentral verwalten – Änderungen werden sofort in Formularen übernommen.";
  root.innerHTML=`<div class="pricing-sections">${state.pricing.map((g,gi)=>`
    <div class="pricing-section">
      <div class="pricing-section-head"><h3>${g.icon} ${g.group}</h3><span>${g.items.length} Leistungen</span></div>
      <div class="pricing-list">${g.items.map((i,ii)=>`
        <div class="pricing-row">
          <div><b>${i.name}</b><div class="inline-note">${i.surcharge?"Zusatzleistung / Aufpreis":i.per||"Richtpreis je nach Aufwand"}</div></div>
          <div><span>Min.</span><br><input class="admin-price-input" type="number" step="0.5" value="${i.min}" onchange="updatePrice(${gi},${ii},'min',this.value)"></div>
          <div><span>Max.</span><br><input class="admin-price-input" type="number" step="0.5" value="${i.max}" onchange="updatePrice(${gi},${ii},'max',this.value)"></div>
          <div><span class="price-highlight">${priceRange(i)}</span></div>
        </div>`).join("")}</div>
    </div>`).join("")}
    <div class="panel"><div class="panel-body"><b>📌 Hinweis</b><p class="inline-note">Alle Preise dienen als Richtwerte und können je nach Umfang, Detailgrad und Sonderwünschen angepasst werden. Der endgültige Preis wird nach Absprache im Ticket bzw. Auftrag festgelegt.</p></div></div>
  </div>`;
}
window.updatePrice=function(gi,ii,key,val){state.pricing[gi].items[ii][key]=Number(val);save();showToast("Preis wurde aktualisiert.");};

function categories(){
  title.textContent="Kategorien"; subtitle.textContent="Clothing sauber nach Typen organisieren.";
  root.innerHTML=`<div class="toolbar"><div></div><button class="primary-btn" onclick="openCategoryModal()">+ Kategorie</button></div>
  <div class="cards">${state.categories.map((x,i)=>`<div class="card"><h3>${x}</h3><p>${state.clothing.filter(c=>c.category===x).length} Designs zugeordnet</p><div class="card-footer"><span class="pill">Aktiv</span><button class="danger-btn" onclick="deleteCategory(${i})">Löschen</button></div></div>`).join("")}</div>`;
}

function showcase(){
  title.textContent="Showcase"; subtitle.textContent="Fertige Arbeiten für die öffentliche Galerie auswählen.";
  root.innerHTML=`<div class="showcase-grid">${state.showcase.map(x=>`<div class="showcase-card"><div class="showcase-preview">◇</div><div class="showcase-info"><b>${x.name}</b><span>${x.category} · ${x.tag}</span></div></div>`).join("")}</div>`;
}

function publicView(){
  document.title="Konya Clothing · Custom FiveM Clothing";
  const featured=state.showcase.slice(0,6);

  root.innerHTML=`
    <div class="site-shell">
      <header class="site-header">
        <a class="site-brand" href="/" onclick="event.preventDefault();publicNavigate('home')">
          <img src="/assets/konya-logo.png" alt="Konya Clothing">
          <div>
            <strong>Konya Clothing</strong>
            <span>Custom FiveM Clothing</span>
          </div>
        </a>

        <nav class="site-nav">
          <a href="/" data-public-nav="home" class="active" onclick="event.preventDefault();publicNavigate('home')">Start</a>
          <a href="/showcase" data-public-nav="showcase" onclick="event.preventDefault();publicNavigate('showcase')">Showcase</a>
          <a href="/preise" data-public-nav="prices" onclick="event.preventDefault();publicNavigate('prices')">Preise</a>
          <a href="/auftrag" data-public-nav="order" onclick="event.preventDefault();publicNavigate('order')">Auftrag</a>
          <a href="/kundenbereich" onclick="">Kundenbereich</a>
        </nav>

        <div class="site-header-actions premium-header-actions">
          <span class="header-action-divider" aria-hidden="true"></span>

          <a class="header-admin-btn" href="/admin" title="Adminbereich">
            <span class="header-admin-icon" aria-hidden="true">⚙</span>
            <span>Admin</span>
          </a>

          <a class="header-order-btn" href="/auftrag" onclick="event.preventDefault();publicNavigate('order')">
            <span class="header-order-icon" aria-hidden="true">▤</span>
            <span>Auftrag anfragen</span>
            <span class="header-order-arrow" aria-hidden="true">→</span>
          </a>

          <span class="header-action-divider" aria-hidden="true"></span>

          <a class="header-profile-btn" href="/kundenbereich" title="Kundenbereich">
            <img src="/assets/konya-logo.png" alt="Konya Clothing">
            <span class="header-profile-chevron" aria-hidden="true">⌄</span>
          </a>
        </div>

        <button class="mobile-menu-btn" onclick="togglePublicMenu()" aria-label="Menü">☰</button>
      </header>

      <div class="mobile-site-nav hidden" id="mobileSiteNav">
        <a href="/" onclick="event.preventDefault();publicNavigate('home');togglePublicMenu()">Start</a>
        <a href="/showcase" onclick="event.preventDefault();publicNavigate('showcase');togglePublicMenu()">Showcase</a>
        <a href="/preise" onclick="event.preventDefault();publicNavigate('prices');togglePublicMenu()">Preise</a>
        <a href="/auftrag" onclick="event.preventDefault();publicNavigate('order');togglePublicMenu()">Auftrag</a>
        <a href="/kundenbereich">Kundenbereich</a>
        <a href="/admin">Admin</a>
      </div>

      <main class="site-main" id="publicPage"></main>

      <footer class="site-footer">
        <div class="site-footer-brand">
          <img src="/assets/konya-logo.png" alt="Konya Clothing">
          <div>
            <strong>Konya Clothing</strong>
            <p>Individuelle FiveM-Kleidung, Texture Reworks und Custom Designs.</p>
          </div>
        </div>
        <div class="site-footer-links">
          <a href="/" onclick="event.preventDefault();publicNavigate('home')">Startseite</a>
          <a href="/showcase" onclick="event.preventDefault();publicNavigate('showcase')">Showcase</a>
          <a href="/preise" onclick="event.preventDefault();publicNavigate('prices')">Preise</a>
          <a href="/auftrag" onclick="event.preventDefault();publicNavigate('order')">Auftrag anfragen</a>
          <a href="/kundenbereich">Kundenbereich</a>
        </div>
        <div class="site-footer-bottom">
          <span>© 2026 Konya Clothing</span>
          <span>Alle Preise sind Richtwerte und werden nach Aufwand abgestimmt.</span>
        </div>
      </footer>
    </div>
  `;

  const path=window.location.pathname;
  if(path==="/showcase") renderPublicPage("showcase",false);
  else if(path==="/preise") renderPublicPage("prices",false);
  else if(path==="/auftrag") renderPublicPage("order",false);
  else renderPublicPage("home",false);
}

window.publicNavigate=function(page){
  const routes={home:"/",showcase:"/showcase",prices:"/preise",order:"/auftrag"};
  const target=routes[page]||"/";
  history.pushState({publicPage:page},"",target);
  document.body.classList.remove("admin-mode","customer-mode");
  document.body.classList.add("public-mode");
  renderPublicPage(page);
  window.scrollTo({top:0,behavior:"smooth"});
};

window.onpopstate=function(){
  if(window.location.pathname==="/admin" || window.location.pathname.startsWith("/admin/")) return;
  if(window.location.pathname==="/kundenbereich" || window.location.pathname.startsWith("/kundenbereich/")) return;
  const p=window.location.pathname;
  renderPublicPage(p==="/showcase"?"showcase":p==="/preise"?"prices":p==="/auftrag"?"order":"home",false);
};

window.togglePublicMenu=function(){
  const el=document.getElementById("mobileSiteNav");
  if(el) el.classList.toggle("hidden");
};

function setPublicActive(page){
  document.querySelectorAll("[data-public-nav]").forEach(a=>a.classList.toggle("active",a.dataset.publicNav===page));
}

function renderPublicPage(page){
  const container=document.getElementById("publicPage");
  if(!container) return;
  setPublicActive(page);

  const escapeHtml=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));

  if(page==="showcase"){
    const categories=[...new Set(state.showcase.map(x=>x.category).filter(Boolean))];
    container.innerHTML=`
      <section class="page-hero compact showcase-hero">
        <div>
          <span class="eyebrow">SHOWCASE</span>
          <h1>Designs mit eigenem Charakter.</h1>
          <p>Von cleanen Streetwear-Looks bis zu auffälligen Custom-Outfits. Hier bekommst du einen schnellen Überblick über Stilrichtungen und Möglichkeiten.</p>
        </div>
        <div class="page-hero-side">
          <strong>${state.showcase.length}</strong>
          <span>aktuelle Showcase-Einträge</span>
        </div>
      </section>

      <section class="site-section">
        <div class="showcase-filterbar">
          <button class="filter-chip active" onclick="filterShowcasePublic('all',this)">Alle</button>
          ${categories.map(c=>`<button class="filter-chip" onclick="filterShowcasePublic('${escapeHtml(c).replace(/'/g,"\\'")}',this)">${escapeHtml(c)}</button>`).join("")}
        </div>

        <div class="public-showcase-grid full" id="publicShowcaseGrid">
          ${state.showcase.map((x,i)=>`
            <article class="public-showcase-card" data-category="${escapeHtml(x.category||"Custom")}">
              <div class="public-showcase-visual ${i%2===0?"alt":""}">
                <div class="showcase-badge">${escapeHtml(x.category||"Custom")}</div>
                <div class="showcase-number">${String(i+1).padStart(2,"0")}</div>
                <span>${escapeHtml(x.name||x.title||"Konya Clothing")}</span>
              </div>
              <div class="public-showcase-body">
                <h3>${escapeHtml(x.name||x.title||"Design")}</h3>
                <p>${escapeHtml(x.description||"Individuelles Clothing Design von Konya Clothing.")}</p>
                <button class="text-link-btn" onclick="publicNavigate('order')">Ähnliches anfragen →</button>
              </div>
            </article>`).join("")}
        </div>
      </section>

      <section class="public-order-cta site-cta">
        <div><span class="eyebrow">DEIN DESIGN</span><h2>Du hast schon eine Idee im Kopf?</h2><p>Schick uns Referenzen, Farben und dein Logo. Wir machen daraus einen klar planbaren Auftrag.</p></div>
        <button class="primary-btn" onclick="publicNavigate('order')">Projekt anfragen</button>
      </section>`;
    return;
  }

  if(page==="prices"){
    const popular=["Hoodie / Pullover","Individuelles Custom-Outfit","Fraktions-Outfit"];
    container.innerHTML=`
      <section class="page-hero compact price-hero">
        <div>
          <span class="eyebrow">PREISE</span>
          <h1>Klare Richtpreise. Keine Überraschungen.</h1>
          <p>Du siehst sofort, in welchem Rahmen sich dein Projekt bewegt. Der finale Preis wird vor der Bearbeitung mit dir abgestimmt.</p>
        </div>
        <div class="price-hero-card">
          <span>Express möglich</span>
          <strong>48h</strong>
          <small>+35–40 € je nach Aufwand</small>
        </div>
      </section>

      <section class="site-section price-page-grid">
        ${state.pricing.map(group=>`
          <article class="price-group-card">
            <div class="price-group-head">
              <span>${escapeHtml(group.group || "Leistungen")}</span>
              <small>${group.items.length} Leistungen</small>
            </div>
            <div class="price-group-body">
              ${group.items.map(item=>`
                <div class="price-line ${popular.includes(item.name)?"popular":""}">
                  <div>
                    <span>${escapeHtml(item.name)}</span>
                    ${popular.includes(item.name)?'<small>Beliebt</small>':""}
                  </div>
                  <strong>${item.min===item.max?`${item.min} €`:`${item.min}–${item.max} €`}</strong>
                </div>`).join("")}
            </div>
          </article>`).join("")}
      </section>

      <section class="price-explainer-grid">
        <article><span>01</span><h3>Richtpreis</h3><p>Du siehst direkt den ungefähren Preisrahmen.</p></article>
        <article><span>02</span><h3>Aufwand prüfen</h3><p>Wir bewerten Details, Referenzen und gewünschte Änderungen.</p></article>
        <article><span>03</span><h3>Fixpreis</h3><p>Vor Beginn bekommst du deinen finalen Preis bestätigt.</p></article>
      </section>

      <div class="public-price-note site-price-note">Alle Preise dienen als Richtwerte. Der endgültige Preis wird nach Absprache im Ticket festgelegt.</div>

      <section class="public-order-cta site-cta">
        <div><span class="eyebrow">PREISANFRAGE</span><h2>Du möchtest einen genauen Preis?</h2><p>Beschreibe dein Projekt und wir geben dir eine konkrete Einschätzung.</p></div>
        <button class="primary-btn" onclick="publicNavigate('order')">Preis anfragen</button>
      </section>`;
    return;
  }

  if(page==="order"){
    container.innerHTML=`
      <section class="page-hero compact order-hero">
        <div>
          <span class="eyebrow">AUFTRAG</span>
          <h1>Von deiner Idee zum fertigen Clothing.</h1>
          <p>Fülle die Anfrage so genau wie möglich aus. Damit können wir Aufwand, Preis und Umsetzung schneller einschätzen.</p>
        </div>
        <div class="order-hero-note">
          <span>Was hilft uns?</span>
          <strong>Referenzen · Farben · Logo · Stil · Termin</strong>
        </div>
      </section>

      <section class="site-section order-page-layout">
        <article class="order-page-card premium-form-card">
          <div class="panel-head">
            <div><h3>Auftragsanfrage</h3><span>Unverbindlich und ohne Zahlungspflicht</span></div>
            <div class="step-pill">1 Anfrage</div>
          </div>
          <form id="publicInlineOrderForm" class="order-page-form">
            <div class="form-section-title"><span>01</span><div><strong>Kontakt</strong><small>Wie können wir dich erreichen?</small></div></div>
            <div class="form-grid two">
              <div class="form-group"><label>Name *</label><input name="client" required placeholder="Dein Name"></div>
              <div class="form-group"><label>Discord *</label><input name="discord" required placeholder="Name oder Discord-ID"></div>
            </div>

            <div class="form-section-title"><span>02</span><div><strong>Projekt</strong><small>Was möchtest du erstellen lassen?</small></div></div>
            <div class="form-grid two">
              <div class="form-group"><label>Organisation / Unternehmen</label><input name="organization" placeholder="Optional"></div>
              <div class="form-group"><label>Kategorie *</label><select name="category" required>${state.categories.map(c=>`<option>${c}</option>`).join("")}</select></div>
            </div>
            <div class="form-grid two">
              <div class="form-group"><label>Produkt / Leistung *</label>
                <select name="product" required>
                  ${state.pricing.flatMap(g=>g.items.map(i=>`<option value="${i.name}">${i.name} · ${i.min===i.max?i.min+" €":i.min+"–"+i.max+" €"}</option>`)).join("")}
                </select>
              </div>
              <div class="form-group"><label>Wunschtermin</label><input name="deadline" type="date"></div>
            </div>

            <div class="form-section-title"><span>03</span><div><strong>Details</strong><small>Je genauer, desto besser.</small></div></div>
            <div class="form-group"><label>Beschreibung *</label><textarea name="description" required rows="7" placeholder="Farben, Stil, Logos, gewünschte Änderungen, Vorlagen, besondere Wünsche ..."></textarea></div>
            <div class="form-group upload-drop"><label>Dateien / Referenzen</label><input name="files" type="file" accept="image/*,.zip,.rar,.pdf" multiple><small>Bilder, Logos, ZIP/RAR oder PDF · max. 6 Dateien à 2 MB</small></div>
            <button class="primary-btn large" type="submit">Auftrag unverbindlich anfragen</button>
          </form>
        </article>

        <aside class="order-info-stack">
          <article class="order-info-card">
            <span class="eyebrow">ABLAUF</span>
            <h3>Nach deiner Anfrage</h3>
            <div class="mini-step"><b>01</b><span>Wir prüfen deine Angaben und den Aufwand.</span></div>
            <div class="mini-step"><b>02</b><span>Du erhältst Preis und Auftragsdetails.</span></div>
            <div class="mini-step"><b>03</b><span>Nach Annahme startet die Bearbeitung.</span></div>
            <div class="mini-step"><b>04</b><span>Du erhältst eine Vorschau zur Freigabe.</span></div>
            <div class="mini-step"><b>05</b><span>Nach Freigabe folgt die Auslieferung.</span></div>
          </article>
          <article class="side-info-card">
            <span>Wichtig</span>
            <p>Der Auftrag startet erst, nachdem Preis und Umfang abgestimmt wurden.</p>
          </article>
        </aside>
      </section>`;
    bindInlinePublicOrderForm();
    return;
  }

  const featured=state.showcase.slice(0,6);

  container.innerHTML=`
    <section class="cinema-hero">
      <div class="cinema-bg"></div>
      <div class="cinema-shade"></div>

      <div class="cinema-left">
        <div class="cinema-kicker">KONYA CLOTHING · CUSTOM FIVEM DESIGN</div>

        <h1>Custom Clothing.<br><span>Sauber. Klar. Eigen.</span></h1>

        <p>
          Individuelle FiveM-Kleidung, Texture Reworks und Branding –
          mit einem klaren Ablauf von der Anfrage bis zur fertigen Datei.
        </p>

        <div class="cinema-actions">
          <button class="primary-btn cinema-btn" onclick="publicNavigate('order')">Projekt starten <span>→</span></button>
          <button class="cinema-outline-btn" onclick="publicNavigate('showcase')">Showcase ansehen</button>
        </div>

        <div class="cinema-benefits">
          <div><b>◇</b><span><strong>100% Individuell</strong><small>Dein eigenes Design</small></span></div>
          <div><b>ϟ</b><span><strong>Schnelle Umsetzung</strong><small>Zuverlässig & klar</small></span></div>
          <div><b>⬡</b><span><strong>Hohe Qualität</strong><small>Optimiert für FiveM</small></span></div>
          <div><b>◎</b><span><strong>Zufriedene Kunden</strong><small>Erfahrung & Vertrauen</small></span></div>
        </div>
      </div>

      <div class="cinema-right-mark" aria-hidden="true">
        <span>FIVEM</span><span>CUSTOM</span><span>DESIGN</span>
      </div>

      <div class="cinema-quality" aria-hidden="true">
        <span>QUALITY</span><span>DETAILS</span><span>IDENTITY</span>
      </div>
    </section>

    <section class="cinema-stats" aria-label="Konya Clothing Kennzahlen">
      <div><span class="stat-icon">▣</span><strong>${state.showcase.length}+</strong><small>DESIGNS</small></div>
      <div><span class="stat-icon">◉</span><strong>${state.customers.length}</strong><small>KUNDEN</small></div>
      <div><span class="stat-icon">▤</span><strong>${state.orders.length}</strong><small>AUFTRÄGE</small></div>
      <div><span class="stat-icon">◷</span><strong>48h</strong><small>EXPRESS MÖGLICH</small></div>
      <div class="cinema-partner"><span>Dein Partner für</span><strong>Custom FiveM Clothing.</strong><i></i></div>
    </section>

    <section class="cinema-services">
      <div class="cinema-services-head">
        <div>
          <span class="cinema-kicker">UNSERE LEISTUNGEN</span>
          <h2>Alles, was dein<br><span>Clothing-Projekt braucht.</span></h2>
        </div>
        <div class="cinema-services-copy">
          <p>Von individuellen Outfits bis zu kompletten Kollektionen – wir setzen deine Ideen sauber, professionell und zuverlässig um.</p>
          <button class="cinema-outline-btn" onclick="publicNavigate('prices')">Alle Leistungen ansehen <span>→</span></button>
        </div>
      </div>

      <div class="cinema-service-grid">
        <article><span>01</span><h3>Custom Clothing</h3><p>Einzelteile oder komplette Sets – individuell nach deinem Stil.</p><button onclick="publicNavigate('order')">Anfragen →</button></article>
        <article><span>02</span><h3>Texture Rework</h3><p>Bestehende Texturen werden sauber überarbeitet und optimiert.</p><button onclick="publicNavigate('order')">Anfragen →</button></article>
        <article><span>03</span><h3>Logo Integration</h3><p>Logos und Schriftzüge passend auf Kleidung umgesetzt.</p><button onclick="publicNavigate('order')">Anfragen →</button></article>
        <article><span>04</span><h3>Komplette Outfits</h3><p>Zusammenhängende Looks für Teams, Firmen oder Gruppen.</p><button onclick="publicNavigate('order')">Anfragen →</button></article>
      </div>
    </section>

    <section class="cinema-showcase-preview">
      <div class="cinema-showcase-head">
        <div><span class="cinema-kicker">SHOWCASE</span><h2>Ausgewählte Arbeiten.</h2></div>
        <button class="cinema-outline-btn" onclick="publicNavigate('showcase')">Alle Designs <span>→</span></button>
      </div>

      <div class="cinema-showcase-grid">
        ${featured.slice(0,3).map((x,i)=>`
          <article>
            <div class="cinema-showcase-art art-${i+1}">
              <span>${escapeHtml(x.category||"Custom")}</span>
              <strong>${escapeHtml(x.name||x.title||"Konya Clothing")}</strong>
            </div>
            <p>${escapeHtml(x.description||"Individuelles Clothing Design von Konya Clothing.")}</p>
          </article>`).join("")}
      </div>
    </section>

    <section class="cinema-final">
      <div>
        <span class="cinema-kicker">DEIN PROJEKT</span>
        <h2>Bereit für dein eigenes Clothing?</h2>
        <p>Starte deine Anfrage direkt online und behalte danach Preis, Status und Vorschau im Kundenbereich im Blick.</p>
      </div>
      <div>
        <button class="primary-btn cinema-btn" onclick="publicNavigate('order')">Auftrag anfragen <span>→</span></button>
        <a class="cinema-outline-btn" href="/kundenbereich">Auftrag verfolgen</a>
      </div>
    </section>`;

}

window.filterShowcasePublic=function(category,btn){
  document.querySelectorAll(".filter-chip").forEach(x=>x.classList.remove("active"));
  if(btn) btn.classList.add("active");
  document.querySelectorAll("#publicShowcaseGrid .public-showcase-card").forEach(card=>{
    card.style.display=category==="all" || card.dataset.category===category ? "" : "none";
  });
};

function bindInlinePublicOrderForm(){
  const form=document.getElementById("publicInlineOrderForm");
  if(!form) return;
  form.addEventListener("submit",async e=>{
    e.preventDefault();
    const fd=new FormData(form);
    const files=await filesToDataUrls(form.elements.files.files);
    if(files===null) return;
    const product=fd.get("product");
    const price=priceLookup(product);
    const id=nextOrderId();
    const client=String(fd.get("client")||"").trim();
    const discord=String(fd.get("discord")||"").trim();
    const organization=String(fd.get("organization")||"").trim()||"Privat";
    const order={
      id,client,discord,organization,category:fd.get("category"),type:product,product,
      description:String(fd.get("description")||"").trim(),
      designer:"Noch offen",status:"Anfrage",priority:"Normal",
      progress:5,deadline:fd.get("deadline")||"",created:new Date().toLocaleDateString("de-DE"),
      priceMin:price?.min||0,priceMax:price?.max||0,finalPrice:0,paymentStatus:"Nicht berechnet",
      paidAt:"",files,previews:[],changeRequest:"",customerCode:id,internalNote:"",
      history:[{label:"Auftragsanfrage eingereicht",date:new Date().toLocaleDateString("de-DE")}]
    };
    state.orders.unshift(order);
    const customer=state.customers.find(c=>c.name.toLowerCase()===client.toLowerCase() || (discord && c.discord===discord));
    if(customer){
      customer.discord=discord||customer.discord;
      customer.organization=organization||customer.organization;
      customer.status="Aktiv";
    }else{
      state.customers.push({name:client,discord,organization,orders:0,revenue:0,status:"Aktiv"});
    }
    addNotification(`Neuer Auftrag ${id} von ${client}.`,"newOrder");
    state.logs.unshift(`Öffentliche Auftragsanfrage ${id} von ${client}`);
    save();
    container=document.getElementById("publicPage");
    if(container) container.innerHTML=`
      <section class="order-success-card">
        <div class="success-icon">✓</div>
        <span class="eyebrow">ANFRAGE GESENDET</span>
        <h1>Vielen Dank, ${client}.</h1>
        <p>Deine Auftragsnummer lautet <strong>${id}</strong>. Bewahre sie auf, damit du deinen Auftrag später im Kundenbereich verfolgen kannst.</p>
        <div class="success-actions">
          <a class="primary-btn" href="/kundenbereich">Zum Kundenbereich</a>
          <button class="secondary-btn" onclick="publicNavigate('home')">Zur Startseite</button>
        </div>
      </section>`;
  });
}

function customerArea(){
  title.textContent="Kundenbereich";
  subtitle.textContent="Aufträge per Auftragsnummer finden und vollständig verfolgen.";
  root.innerHTML=`
    <div class="panel"><div class="panel-head"><h3>Auftrag finden</h3><span>Kundenzugang</span></div>
      <div class="panel-body">
        <div class="customer-search-row">
          <input class="field" id="customerOrderCode" placeholder="z. B. KC-2026-0042">
          <button class="primary-btn" onclick="findCustomerOrder()">Auftrag anzeigen</button>
        </div>
        <div class="inline-note" style="margin-top:8px">Zum Testen kannst du aktuell eine vorhandene Auftragsnummer verwenden.</div>
      </div>
    </div>
    <div id="customerOrderResult" style="margin-top:16px"></div>`;
}
window.findCustomerOrder=function(){
  const q=(document.getElementById("customerOrderCode").value||"").trim().toUpperCase();
  const o=state.orders.find(x=>(x.customerCode||x.id).toUpperCase()===q);
  const result=document.getElementById("customerOrderResult");
  if(!o){
    result.innerHTML=`<div class="panel"><div class="panel-body"><div class="empty">Kein Auftrag mit dieser Nummer gefunden.</div></div></div>`;
    return;
  }
  const myOrders=state.orders.filter(x=>x.client===o.client);
  const progress=Math.max(0,Math.min(100,Number(o.progress||0)));
  result.innerHTML=`
    <div class="customer-hero">
      <div class="eyebrow">MEIN AUFTRAG</div>
      <h2 style="margin:0">${o.id} · ${o.type}</h2>
      <p style="color:var(--muted)">${o.client} · ${o.organization||"Privat"}</p>
      <div class="customer-progress-wrap"><div class="customer-progress-bar"><span style="width:${progress}%"></span></div><b>${progress}%</b></div>
    </div>
    <div class="order-detail-grid" style="margin-top:16px">
      <div class="detail-card">
        <h3>Auftragsstatus</h3>
        <div class="detail-row"><span>Status</span><b>${o.status}</b></div>
        <div class="detail-row"><span>Designer</span><b>${o.designer}</b></div>
        <div class="detail-row"><span>Deadline</span><b>${o.deadline}</b></div>
        <div class="detail-row"><span>Preisangebot</span><b>${o.finalPrice?eur(o.finalPrice):`${eur(o.priceMin)} – ${eur(o.priceMax)}`}</b></div>
        <div class="detail-row"><span>Zahlung</span><b><span class="status ${paymentClass(o.paymentStatus)}">${o.paymentStatus}</span></b></div>
        <div class="quote-box"><strong>Beschreibung</strong><span class="inline-note">${o.description||"Keine Beschreibung"}</span></div>
      </div>
      <div class="detail-card">
        <h3>Vorschau</h3>
        ${previewBlock(o)}
        ${o.preview && o.approvalStatus!=="Freigegeben"?`
          <div class="approval-actions">
            <button class="primary-btn" onclick="approvePreview('${o.id}');setTimeout(()=>findCustomerOrder(),0)">✓ Freigeben</button>
            <button class="secondary-btn" onclick="openCustomerChangeRequest('${o.id}')">✎ Änderung wünschen</button>
          </div>`:""}
        ${o.approvalStatus==="Freigegeben"?`<div class="approval-success">✓ Vorschau freigegeben.</div>`:""}
        ${o.changeRequest?`<div class="change-request-box"><strong>Änderungswunsch</strong><p>${o.changeRequest}</p></div>`:""}
      </div>
    </div>
    <div class="grid two-col" style="margin-top:16px">
      <div class="panel"><div class="panel-head"><h3>Auftragsverlauf</h3><span>${(o.history||[]).length} Einträge</span></div><div class="panel-body timeline">
        ${(o.history||[]).map(h=>`<div class="timeline-item"><span class="timeline-dot"></span><div><b>${h.label}</b><small>${h.date}</small></div></div>`).join("")}
      </div></div>
      <div class="panel"><div class="panel-head"><h3>Weitere Aufträge</h3><span>${myOrders.length}</span></div><div class="panel-body">
        ${myOrders.map(x=>`<button class="customer-order-link" onclick="document.getElementById('customerOrderCode').value='${x.id}';findCustomerOrder()"><span>${x.id}</span><b>${x.type}</b><small>${x.status}</small></button>`).join("")}
      </div></div>
    </div>`;
};

window.openCustomerChangeRequest=function(id){
  const o=state.orders.find(x=>x.id===id);
  modal(`<h2>Änderung wünschen</h2><p>Beschreibe genau, was an der Vorschau geändert werden soll.</p>
    <form id="customerChangeForm">
      <div class="form-group"><label>Änderungswunsch</label><textarea id="customerChangeText" required placeholder="z. B. Logo kleiner, Farbe dunkler ..."></textarea></div>
      <div class="form-actions"><button type="button" class="secondary-btn" onclick="closeModal()">Abbrechen</button><button class="primary-btn">Senden</button></div>
    </form>`);
  document.getElementById("customerChangeForm").onsubmit=e=>{
    e.preventDefault();
    const text=document.getElementById("customerChangeText").value.trim();
    o.changeRequest=text;
    o.approvalStatus="Änderung gewünscht";
    o.status="Änderung gewünscht";
    o.history=o.history||[];
    o.history.unshift({label:"Änderungswunsch gesendet",date:new Date().toLocaleDateString("de-DE")});
    addNotification(`${id}: Neuer Änderungswunsch vom Kunden.`,"changeRequested");
    state.logs.unshift(`${id}: Kunde hat einen Änderungswunsch gesendet`);
    save();closeModal();findCustomerOrder();showToast("Änderungswunsch wurde gesendet.");
  };
};

window.approvePreview=function(id){
  const o=state.orders.find(x=>x.id===id);
  if(!o||!o.preview) return;
  o.approvalStatus="Freigegeben";
  o.status="Freigegeben";
  o.progress=95;
  o.changeRequest="";
  o.history=o.history||[];o.history.unshift({label:`Vorschau Version ${o.previewVersion||1} freigegeben`,date:new Date().toLocaleDateString("de-DE")});state.logs.unshift(`${id}: Kunde hat Vorschau Version ${o.previewVersion||1} freigegeben`);addNotification(`${id}: Kunde hat die Vorschau freigegeben.`,"previewApproved");
  save();render("customer");showToast("Vorschau wurde freigegeben.");
};

window.openChangeRequest=function(id){
  const o=state.orders.find(x=>x.id===id);
  modal(`<h2>Änderung wünschen</h2><p>Beschreibe möglichst genau, was an der aktuellen Vorschau geändert werden soll.</p>
    <form id="changeRequestForm">
      <div class="form-group"><label>Änderungswunsch</label><textarea id="changeRequestText" required placeholder="z. B. Logo kleiner, Farbe dunkler, Schrift weiter nach oben ..."></textarea></div>
      <div class="form-actions"><button type="button" class="secondary-btn" onclick="closeModal()">Abbrechen</button><button class="primary-btn">Änderung senden</button></div>
    </form>`);
  document.getElementById("changeRequestForm").onsubmit=e=>{
    e.preventDefault();
    const text=document.getElementById("changeRequestText").value.trim();
    o.changeRequest=text;
    o.approvalStatus="Änderung gewünscht";
    o.status="Änderung gewünscht";
    state.logs.unshift(`${id}: Kunde hat einen Änderungswunsch gesendet`);addNotification(`${id}: Neuer Änderungswunsch vom Kunden.`,"changeRequested");
    save();closeModal();render("customer");showToast("Änderungswunsch wurde gesendet.");
  };
};

function notificationsView(){
  title.textContent="Benachrichtigungen";
  subtitle.textContent="Festlegen, bei welchen wichtigen Ereignissen eine Meldung erstellt wird.";
  const s=state.notificationSettings;
  const rows=[
    ["newOrder","Neue Aufträge","Meldung, wenn eine neue Kundenanfrage eingeht."],
    ["urgentTicket","Dringende Tickets","Meldung bei einem neuen dringenden Support-Ticket."],
    ["previewApproved","Kundenfreigabe","Meldung, wenn ein Kunde eine Vorschau freigibt."],
    ["changeRequested","Änderungswunsch","Meldung, wenn ein Kunde Änderungen anfordert."],
    ["paymentReceived","Zahlung erhalten","Meldung, sobald ein Auftrag als bezahlt markiert wird."]
  ];
  root.innerHTML=`<div class="panel"><div class="panel-head"><h3>Interne Meldungen</h3><span>V3.4</span></div><div class="panel-body notification-settings">
    ${rows.map(([key,name,desc])=>`<label class="notification-setting"><div><b>${name}</b><span>${desc}</span></div><input type="checkbox" ${s[key]?"checked":""} onchange="toggleNotificationSetting('${key}',this.checked)"></label>`).join("")}
  </div></div>
  <div class="panel" style="margin-top:14px"><div class="panel-head"><h3>Letzte Meldungen</h3><span>${state.notifications.length}</span></div><div class="panel-body attention-list">
  ${state.notifications.slice(0,10).map(n=>`<div class="attention-item"><div class="attention-icon">◉</div><div><strong>${n}</strong><small>Konya Clothing</small></div></div>`).join("")}
  </div></div>`;
}
window.toggleNotificationSetting=function(key,val){state.notificationSettings[key]=val;save();showToast(val?"Benachrichtigung aktiviert.":"Benachrichtigung deaktiviert.");};

function logs(){
  title.textContent="Protokoll"; subtitle.textContent="Nachvollziehbar, wer was geändert hat.";
  root.innerHTML=`<div class="panel"><div class="panel-body table-wrap"><table><thead><tr><th>Datum</th><th>Mitarbeiter</th><th>Aktion</th><th>Bereich</th></tr></thead><tbody>${state.logs.map((x,i)=>`<tr><td>04.09.2026 · ${22-i}:1${i}</td><td>Konsti Shakur</td><td>${x}</td><td>Admin</td></tr>`).join("")}</tbody></table></div></div>`;
}

function render(view){
  document.querySelectorAll(".nav-item").forEach(x=>x.classList.toggle("active",x.dataset.view===view));
  if(view==="dashboard") dashboard();
  else if(["clothing","orders","customers","tickets","employees"].includes(view)) genericTable(view);
  else if(view==="pricing") pricingView();
  else if(view==="categories") categories();
  else if(view==="showcase") showcase();
  else if(view==="logs") logs();
  else if(view==="notifications") notificationsView();
  else if(view==="public") publicView();
  else if(view==="customer") customerArea();
}
document.querySelectorAll("[data-view]").forEach(b=>b.addEventListener("click",()=>{
  const view=b.dataset.view;
  if(view==="public"){ window.location.href="/"; return; }
  if(view==="customer"){ window.location.href="/kundenbereich"; return; }
  render(view);
}));

const backdrop=document.getElementById("modalBackdrop"), modalContent=document.getElementById("modalContent");
function modal(html){modalContent.innerHTML=html;backdrop.classList.remove("hidden")}
function closeModal(){backdrop.classList.add("hidden")}
document.getElementById("modalClose").onclick=closeModal;
backdrop.addEventListener("click",e=>{if(e.target===backdrop)closeModal()});
function formTemplate(t,d,fields){return `<h2>${t}</h2><p>${d}</p><form id="modalForm"><div class="form-grid">${fields}</div><div class="form-actions"><button type="button" class="secondary-btn" onclick="closeModal()">Abbrechen</button><button class="primary-btn">Speichern</button></div></form>`}
function serviceOptions(){return state.pricing.map(g=>`<optgroup label="${g.group}">${g.items.map(i=>`<option value="${i.name}">${i.name} — ${priceRange(i)}</option>`).join("")}</optgroup>`).join("")}
function bindQuote(selectId, boxId){
  const sel=document.getElementById(selectId), box=document.getElementById(boxId);
  const update=()=>{const s=findService(sel.value);box.innerHTML=s?`<strong>Unverbindlicher Richtpreis</strong><div class="quote-price">${priceRange(s)}</div><span class="inline-note">Der endgültige Preis wird nach Prüfung des Aufwands festgelegt.</span>`:""};
  sel.addEventListener("change",update);update();
}

window.openOrderModal=function(){
  modal(formTemplate("Neuen Auftrag anlegen","Leistung auswählen – der Richtpreis wird automatisch übernommen.",`
    <div class="form-group"><label>Kunde</label><input name="client" required></div>
    <div class="form-group"><label>Organisation / Fraktion (optional)</label><input name="organization" placeholder="Privat"></div>
    <div class="form-group full"><label>Leistung</label><select id="orderService" name="type">${serviceOptions()}</select><div id="orderQuote" class="quote-box"></div></div>
    <div class="form-group"><label>Designer</label><select name="designer">${state.employees.filter(e=>e.status==="Aktiv").map(e=>`<option>${e.name}</option>`).join("")}</select></div>
    <div class="form-group"><label>Deadline</label><input name="deadline" type="date" required></div>
    <div class="form-group full"><label>Wunsch / Beschreibung</label><textarea name="description" placeholder="Farben, Logo, Muster, Referenzen ..."></textarea></div>
    <div class="form-group full"><label>Referenzen / Logo / Texturen</label><div class="upload-zone"><input id="orderFiles" type="file" multiple accept="image/*,.png,.jpg,.jpeg,.webp,.pdf,.zip"><div class="upload-hint">Bis zu 6 Dateien, maximal 2 MB pro Datei. Ideal für Logos, Referenzbilder und kleine Texturen.</div></div></div>`));
  bindQuote("orderService","orderQuote");
  document.getElementById("modalForm").onsubmit=async e=>{
    e.preventDefault();
    const f=Object.fromEntries(new FormData(e.target));
    const s=findService(f.type);
    const attachments=await filesToAttachments(document.getElementById("orderFiles").files);
    const newId=nextOrderId();
    state.orders.unshift({id:newId,client:f.client,organization:f.organization||"Privat",type:f.type,designer:f.designer,priceMin:s.min,priceMax:s.max,finalPrice:null,deadline:f.deadline,status:"Anfrage",progress:0,priority:"Normal",description:f.description,attachments});
    state.logs.unshift(`Neuer Auftrag für ${f.client} angelegt (${attachments.length} Datei(en))`);
    save();closeModal();render("orders");showToast("Auftrag wurde angelegt.");
  };
}

window.openPublicOrderModal=function(){
  modal(formTemplate("Auftrag anfragen","Wähle eine Leistung und lade bei Bedarf Referenzen oder dein Logo hoch.",`
    <div class="form-group"><label>Name</label><input name="client" required></div>
    <div class="form-group"><label>Discord</label><input name="discord" required></div>
    <div class="form-group full"><label>Leistung</label><select id="publicService" name="type">${serviceOptions()}</select><div id="publicQuote" class="quote-box"></div></div>
    <div class="form-group"><label>Organisation (optional)</label><input name="organization"></div>
    <div class="form-group full"><label>Was soll gemacht werden?</label><textarea name="description" required></textarea></div>
    <div class="form-group full"><label>Referenzen / Logo / Texturen</label><div class="upload-zone"><input id="publicFiles" type="file" multiple accept="image/*,.png,.jpg,.jpeg,.webp,.pdf,.zip"><div class="upload-hint">Bis zu 6 Dateien, maximal 2 MB pro Datei. Du kannst z. B. dein Logo oder Referenzbilder mitsenden.</div></div></div>`));
  bindQuote("publicService","publicQuote");
  document.getElementById("modalForm").onsubmit=async e=>{
    e.preventDefault();
    const f=Object.fromEntries(new FormData(e.target));
    const s=findService(f.type);
    const attachments=await filesToAttachments(document.getElementById("publicFiles").files);
    const existingCustomer=state.customers.find(c=>c.name.toLowerCase()===f.client.toLowerCase() || (f.discord && c.discord===f.discord));
    if(existingCustomer){
      existingCustomer.discord=f.discord||existingCustomer.discord;
      existingCustomer.organization=f.organization||existingCustomer.organization||"Privat";
      if(existingCustomer.status==="Neu") existingCustomer.status="Aktiv";
    }else{
      state.customers.push({name:f.client,discord:f.discord,organization:f.organization||"Privat",orders:0,revenue:0,status:"Aktiv"});
    }
    const newId=nextOrderId();
    state.orders.unshift({id:newId,client:f.client,organization:f.organization||"Privat",type:f.type,designer:"Noch nicht zugewiesen",priceMin:s.min,priceMax:s.max,finalPrice:null,deadline:"Offen",status:"Anfrage",progress:0,priority:"Normal",description:f.description,attachments});
    state.logs.unshift(`Neue Kundenanfrage von ${f.client} (${attachments.length} Datei(en))`);addNotification(`Neue Bestellung von ${f.client}: ${f.type}`,"newOrder");
    save();closeModal();showToast("Anfrage wurde gesendet.");
  };
}

window.openOrderDetail=function(id){
  const o=state.orders.find(x=>x.id===id); if(!o) return;
  const files=o.attachments||[];
  modal(`<h2>${o.id}</h2><p>${o.client} · ${o.type}</p>
    <div class="order-detail-grid">
      <div class="detail-card">
        <h3 style="margin-top:0">Auftragsverwaltung</h3>
        <label class="inline-note">Designer</label>
        <select class="field" id="designerInput" style="width:100%;margin:6px 0 10px">
          ${state.employees.filter(e=>e.status==="Aktiv" || e.name===o.designer).map(e=>`<option ${e.name===o.designer?"selected":""}>${e.name}</option>`).join("")}
          ${!state.employees.some(e=>e.name===o.designer)?`<option selected>${o.designer}</option>`:""}
        </select>
        <label class="inline-note">Priorität</label>
        <select class="field" id="priorityInput" style="width:100%;margin:6px 0 10px">
          ${["Niedrig","Normal","Hoch","Dringend"].map(s=>`<option ${s===o.priority?"selected":""}>${s}</option>`).join("")}
        </select>
        <label class="inline-note">Status</label>
        <select class="field" id="statusInput" style="width:100%;margin:6px 0 10px">
          ${["Anfrage","Preisangebot","Angenommen","In Bearbeitung","Kundenvorschau","Warten auf Kunde","Änderung gewünscht","Freigegeben","Fertig","Ausgeliefert","Storniert"].map(s=>`<option ${s===o.status?"selected":""}>${s}</option>`).join("")}
        </select>
        <label class="inline-note">Deadline</label>
        <input class="field" id="deadlineInput" type="date" value="${/^\d{4}-\d{2}-\d{2}$/.test(o.deadline||"")?o.deadline:""}" style="width:100%;margin:6px 0 10px">
        <label class="inline-note">Fortschritt: <b id="progressLabel">${o.progress||0}%</b></label>
        <input id="progressInput" type="range" min="0" max="100" step="5" value="${o.progress||0}" style="width:100%;margin:8px 0 12px" oninput="document.getElementById('progressLabel').textContent=this.value+'%'">
        <label class="inline-note">Interne Notiz</label>
        <textarea id="internalNoteInput" placeholder="Nur für Mitarbeiter sichtbar ..." style="width:100%;margin-top:6px">${o.internalNote||""}</textarea>
        <button class="primary-btn" style="margin-top:10px;width:100%" onclick="saveOrderAdmin('${o.id}')">Auftragsdaten speichern</button>
      </div>
      <div class="detail-card">
        <h3 style="margin-top:0">Preis & Zahlung</h3>
        <div class="detail-row"><span>Richtpreis</span><b>${eur(o.priceMin)} – ${eur(o.priceMax)}</b></div>
        <label class="inline-note" style="display:block;margin-top:10px">Endpreis festlegen</label>
        <input class="field" id="finalPriceInput" type="number" step="0.5" value="${o.finalPrice??o.priceMin}" style="width:100%;margin-top:8px">
        <button class="primary-btn" style="margin-top:10px;width:100%" onclick="saveFinalPrice('${o.id}')">Preisangebot speichern</button>
        <div style="height:12px"></div>
        <div class="detail-row"><span>Zahlungsstatus</span><b><span class="status ${paymentClass(o.paymentStatus)}">${o.paymentStatus}</span></b></div>
        <select class="field" id="paymentStatusInput" style="width:100%;margin-top:8px">
          ${["Nicht berechnet","Zahlung offen","Bezahlt","Storniert"].map(s=>`<option ${s===o.paymentStatus?"selected":""}>${s}</option>`).join("")}
        </select>
        <input class="field" id="invoiceNoteInput" value="${o.invoiceNote||""}" placeholder="Zahlungsnotiz" style="width:100%;margin-top:8px">
        <button class="secondary-btn" style="margin-top:10px;width:100%" onclick="savePaymentStatus('${o.id}')">Zahlung speichern</button>
        <div class="quote-box"><strong>Beschreibung</strong><span class="inline-note">${o.description||"Keine Beschreibung"}</span></div>
      </div>
    </div>
    <div class="detail-card" style="margin-top:14px">
      <h3 style="margin-top:0">Kundenvorschau & Freigabe</h3>
      ${previewBlock(o)}
      <div class="upload-zone" style="margin-top:12px">
        <label>Neue Vorschau hochladen</label>
        <input id="previewFileInput" type="file" accept="image/*,.png,.jpg,.jpeg,.webp,.pdf">
        <div class="upload-hint">Eine neue Vorschau erhöht automatisch die Versionsnummer.</div>
        <button class="primary-btn" style="margin-top:10px" onclick="saveOrderPreview('${o.id}')">Vorschau speichern</button>
      </div>
      ${o.changeRequest?`<div class="change-request-box"><strong>Änderungswunsch des Kunden</strong><p>${o.changeRequest}</p></div>`:""}
    </div>
    <div class="detail-card" style="margin-top:14px">
      <h3 style="margin-top:0">Dateien & Referenzen</h3>
      <p class="inline-note">${files.length?`${files.length} Datei(en) wurden dem Auftrag beigefügt.`:"Noch keine Dateien hochgeladen."}</p>
      ${files.length?`<div class="attachment-grid">${files.map(attachmentHtml).join("")}</div>`:""}
    </div>`);
}
window.saveOrderAdmin=function(id){
  const o=state.orders.find(x=>x.id===id); if(!o) return;
  const oldStatus=o.status, oldDesigner=o.designer, oldPriority=o.priority, oldDeadline=o.deadline, oldProgress=o.progress;
  o.designer=document.getElementById("designerInput").value;
  o.priority=document.getElementById("priorityInput").value;
  o.status=document.getElementById("statusInput").value;
  o.deadline=document.getElementById("deadlineInput").value || o.deadline;
  o.progress=Number(document.getElementById("progressInput").value);
  o.internalNote=document.getElementById("internalNoteInput").value.trim();
  if(["Fertig","Ausgeliefert"].includes(o.status)) o.progress=100;
  o.history=o.history||[]; const date=new Date().toLocaleDateString("de-DE");
  if(oldDesigner!==o.designer) o.history.unshift({label:`Designer: ${o.designer}`,date});
  if(oldPriority!==o.priority) o.history.unshift({label:`Priorität: ${o.priority}`,date});
  if(oldStatus!==o.status) o.history.unshift({label:`Status: ${o.status}`,date});
  if(oldDeadline!==o.deadline) o.history.unshift({label:`Deadline: ${o.deadline}`,date});
  if(oldProgress!==o.progress) o.history.unshift({label:`Fortschritt: ${o.progress}%`,date});
  state.logs.unshift(`${id}: Auftragsverwaltung aktualisiert`);
  save(); closeModal(); render("orders"); showToast("Auftrag wurde aktualisiert.");
};

window.saveOrderPreview=async function(id){
  const o=state.orders.find(x=>x.id===id);
  const input=document.getElementById("previewFileInput");
  if(!input.files.length){showToast("Bitte zuerst eine Vorschau auswählen.");return;}
  const attachments=await filesToAttachments(input.files);
  if(!attachments.length){showToast("Datei ist zu groß oder nicht gültig.");return;}
  o.preview=attachments[0];
  o.previewVersion=(o.previewVersion||0)+1;
  o.approvalStatus="Wartet auf Kunde";
  o.changeRequest="";
  o.status="Kundenvorschau";
  o.progress=Math.max(o.progress||0,80);
  o.history=o.history||[];o.history.unshift({label:`Kundenvorschau Version ${o.previewVersion} hochgeladen`,date:new Date().toLocaleDateString("de-DE")});state.logs.unshift(`${id}: Kundenvorschau Version ${o.previewVersion} hochgeladen`);
  save();
  closeModal();
  render("orders");
  showToast("Kundenvorschau gespeichert.");
};

window.saveFinalPrice=function(id){
  const o=state.orders.find(x=>x.id===id); if(!o) return;
  const val=Number(document.getElementById("finalPriceInput").value);
  if(!Number.isFinite(val) || val<=0){showToast("Bitte einen gültigen Endpreis eingeben.");return;}
  o.finalPrice=val;
  o.status=o.status==="Anfrage"?"Preisangebot":o.status;
  if(o.paymentStatus==="Nicht berechnet") o.paymentStatus="Zahlung offen";
  o.history=o.history||[];
  o.history.unshift({label:`Preisangebot ${eur(val)}`,date:new Date().toLocaleDateString("de-DE")});
  state.logs.unshift(`Preisangebot für ${id} auf ${eur(val)} gesetzt`);
  save();closeModal();render("orders");showToast("Endpreis wurde gespeichert.");
};

window.savePaymentStatus=function(id){
  const o=state.orders.find(x=>x.id===id);
  const newStatus=document.getElementById("paymentStatusInput").value;
  const note=document.getElementById("invoiceNoteInput").value.trim();
  const previous=o.paymentStatus;
  o.paymentStatus=newStatus;
  o.invoiceNote=note;
  if(newStatus==="Bezahlt" && previous!=="Bezahlt"){
    if(!o.finalPrice){showToast("Bitte zuerst einen Endpreis festlegen.");return;}
    o.paidAt=new Date().toLocaleDateString("de-DE");
    addNotification(`${id}: Zahlung über ${eur(o.finalPrice)} erhalten.`,"paymentReceived");
  }
  if(newStatus!=="Bezahlt") o.paidAt="";
  o.history=o.history||[];o.history.unshift({label:`Zahlung: ${newStatus}`,date:new Date().toLocaleDateString("de-DE")});state.logs.unshift(`${id}: Zahlungsstatus auf "${newStatus}" gesetzt`);
  save();closeModal();render("orders");showToast("Zahlungsstatus gespeichert.");
};

window.openClothingModal=function(){modal(formTemplate("Neues Clothing-Design","Design direkt einem Kunden und einer Kategorie zuordnen.",`<div class="form-group"><label>Name</label><input name="name" required></div><div class="form-group"><label>Kategorie</label><select name="category">${state.categories.map(c=>`<option>${c}</option>`).join("")}</select></div><div class="form-group"><label>Kunde</label><input name="customer" required></div><div class="form-group"><label>Status</label><select name="status"><option>Entwurf</option><option>In Bearbeitung</option><option>Kundenvorschau</option><option>Freigegeben</option></select></div>`));document.getElementById("modalForm").onsubmit=e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.target));state.clothing.unshift({...f,versions:1});save();closeModal();render("clothing");showToast("Design gespeichert.")}}
window.openCustomerModal=function(){modal(formTemplate("Neuen Kunden anlegen","Kundenakte für Bestellungen und Support.",`<div class="form-group"><label>Name</label><input name="name" required></div><div class="form-group"><label>Discord</label><input name="discord"></div><div class="form-group full"><label>Organisation / Fraktion / Unternehmen</label><input name="organization" placeholder="Privat"></div>`));document.getElementById("modalForm").onsubmit=e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.target));state.customers.unshift({name:f.name,discord:f.discord,organization:f.organization||"Privat",orders:0,revenue:0,status:"Aktiv"});save();closeModal();render("customers");showToast("Kunde angelegt.")}}
window.openTicketModal=function(){
  modal(formTemplate("Neues Ticket","Support, Änderungswunsch oder Rückfrage erfassen.",`
    <div class="form-group"><label>Betreff</label><input name="title" required></div>
    <div class="form-group"><label>Kunde</label><input name="client" required></div>
    <div class="form-group"><label>Auftrag verknüpfen</label><select name="orderId"><option value="">Kein Auftrag</option>${state.orders.map(o=>`<option value="${o.id}">${o.id} · ${o.client}</option>`).join("")}</select></div>
    <div class="form-group"><label>Priorität</label><select name="priority"><option>Normal</option><option>Hoch</option><option>Dringend</option></select></div>
    <div class="form-group"><label>Zuständig</label><select name="assigned">${state.employees.filter(e=>e.status==="Aktiv").map(e=>`<option>${e.name}</option>`).join("")}</select></div>
    <div class="form-group"><label>Status</label><select name="status"><option>Offen</option><option>In Bearbeitung</option><option>Warten auf Kunde</option></select></div>
    <div class="form-group full"><label>Erste Nachricht</label><textarea name="message" placeholder="Worum geht es?"></textarea></div>`));
  document.getElementById("modalForm").onsubmit=e=>{
    e.preventDefault();
    const f=Object.fromEntries(new FormData(e.target));
    const id="#"+(129+state.tickets.length);
    state.tickets.unshift({id,title:f.title,client:f.client,orderId:f.orderId||"",priority:f.priority,status:f.status,assigned:f.assigned,internalNote:"",createdAt:new Date().toLocaleDateString("de-DE"),messages:f.message?[{from:"Admin",text:f.message,date:new Date().toLocaleString("de-DE")}]:[]});
    if(f.priority==="Dringend") addNotification(`Dringendes Ticket von ${f.client}: ${f.title}`,"urgentTicket");
    state.logs.unshift(`${id}: Ticket für ${f.client} erstellt`);
    save();closeModal();render("tickets");showToast("Ticket angelegt.");
  };
}

window.openTicketDetail=function(id){
  const t=state.tickets.find(x=>x.id===id); if(!t) return;
  modal(`<h2>${t.id} · ${t.title}</h2><p>${t.client}${t.orderId?` · Auftrag ${t.orderId}`:""}</p>
    <div class="order-detail-grid">
      <div class="detail-card">
        <h3 style="margin-top:0">Ticket verwalten</h3>
        <label class="inline-note">Status</label>
        <select class="field" id="ticketStatusInput" style="width:100%;margin:6px 0 10px">${["Offen","In Bearbeitung","Warten auf Kunde","Gelöst","Geschlossen"].map(s=>`<option ${s===t.status?"selected":""}>${s}</option>`).join("")}</select>
        <label class="inline-note">Priorität</label>
        <select class="field" id="ticketPriorityInput" style="width:100%;margin:6px 0 10px">${["Normal","Hoch","Dringend"].map(s=>`<option ${s===t.priority?"selected":""}>${s}</option>`).join("")}</select>
        <label class="inline-note">Zuständig</label>
        <select class="field" id="ticketAssignedInput" style="width:100%;margin:6px 0 10px">${state.employees.map(e=>`<option ${e.name===t.assigned?"selected":""}>${e.name}</option>`).join("")}</select>
        <label class="inline-note">Auftrag</label>
        <select class="field" id="ticketOrderInput" style="width:100%;margin:6px 0 10px"><option value="">Kein Auftrag</option>${state.orders.map(o=>`<option value="${o.id}" ${o.id===t.orderId?"selected":""}>${o.id} · ${o.client}</option>`).join("")}</select>
        <label class="inline-note">Interne Notiz</label>
        <textarea id="ticketNoteInput" placeholder="Nur intern sichtbar ...">${t.internalNote||""}</textarea>
        <button class="primary-btn" style="margin-top:10px;width:100%" onclick="saveTicketDetail('${t.id}')">Ticket speichern</button>
      </div>
      <div class="detail-card">
        <h3 style="margin-top:0">Nachrichten</h3>
        <div class="ticket-chat">${(t.messages||[]).length?(t.messages||[]).map(m=>`<div class="ticket-message"><b>${m.from}</b><p>${m.text}</p><span>${m.date}</span></div>`).join(""):`<div class="empty">Noch keine Nachrichten.</div>`}</div>
        <label class="inline-note" style="display:block;margin-top:12px">Neue Nachricht</label>
        <textarea id="ticketMessageInput" placeholder="Antwort oder Information eintragen ..."></textarea>
        <button class="secondary-btn" style="margin-top:9px;width:100%" onclick="addTicketMessage('${t.id}')">Nachricht hinzufügen</button>
      </div>
    </div>`);
}

window.saveTicketDetail=function(id){
  const t=state.tickets.find(x=>x.id===id); if(!t) return;
  const oldStatus=t.status, oldPriority=t.priority, oldAssigned=t.assigned, oldOrder=t.orderId;
  t.status=document.getElementById("ticketStatusInput").value;
  t.priority=document.getElementById("ticketPriorityInput").value;
  t.assigned=document.getElementById("ticketAssignedInput").value;
  t.orderId=document.getElementById("ticketOrderInput").value;
  t.internalNote=document.getElementById("ticketNoteInput").value.trim();
  if(t.priority==="Dringend" && oldPriority!=="Dringend") addNotification(`${id}: Ticket wurde auf Dringend gesetzt.`,"urgentTicket");
  const changes=[];
  if(oldStatus!==t.status) changes.push(`Status: ${t.status}`);
  if(oldPriority!==t.priority) changes.push(`Priorität: ${t.priority}`);
  if(oldAssigned!==t.assigned) changes.push(`Zuständig: ${t.assigned}`);
  if(oldOrder!==t.orderId) changes.push(`Auftrag: ${t.orderId||"entfernt"}`);
  state.logs.unshift(`${id}: ${changes.length?changes.join(" · "):"Ticket aktualisiert"}`);
  save();closeModal();render("tickets");showToast("Ticket gespeichert.");
}

window.addTicketMessage=function(id){
  const t=state.tickets.find(x=>x.id===id); if(!t) return;
  const input=document.getElementById("ticketMessageInput");
  const text=input.value.trim();
  if(!text){showToast("Bitte eine Nachricht eingeben.");return;}
  t.messages=t.messages||[];
  t.messages.push({from:"Konsti Shakur",text,date:new Date().toLocaleString("de-DE")});
  state.logs.unshift(`${id}: Neue Ticket-Nachricht`);
  save();openTicketDetail(id);showToast("Nachricht gespeichert.");
}

window.openEmployeeModal=function(){
  modal(formTemplate("Mitarbeiter hinzufügen","Teammitglied mit Rolle und Grundrechten anlegen.",`
    <div class="form-group"><label>Name</label><input name="name" required></div>
    <div class="form-group"><label>Rolle</label><select name="role"><option>Designer</option><option>Support</option><option>Auftragsmanagement</option><option>Admin</option></select></div>
    <div class="form-group"><label>Status</label><select name="status"><option>Aktiv</option><option>Inaktiv</option></select></div>
    <div class="form-group full"><label>Notiz</label><textarea name="note" placeholder="Optional"></textarea></div>`));
  document.getElementById("modalForm").onsubmit=e=>{
    e.preventDefault();
    const f=Object.fromEntries(new FormData(e.target));
    state.employees.push({
      name:f.name,role:f.role,status:f.status,note:f.note||"",
      joinedAt:new Date().toLocaleDateString("de-DE"),
      permissions:["Aufträge","Kunden","Tickets","Showcase"]
    });
    state.logs.unshift(`Mitarbeiter ${f.name} hinzugefügt`);
    save();closeModal();render("employees");showToast("Mitarbeiter hinzugefügt.");
  };
}

window.openEmployeeDetail=function(name){
  const e=state.employees.find(x=>x.name===name); if(!e) return;
  const activeOrders=state.orders.filter(o=>o.designer===e.name && !["Fertig","Ausgeliefert","Storniert"].includes(o.status));
  const activeTickets=state.tickets.filter(t=>t.assigned===e.name && !["Gelöst","Geschlossen"].includes(t.status));
  const allPerms=["Aufträge","Kunden","Tickets","Showcase","Preise","Mitarbeiter","Logs"];
  modal(`<h2>${e.name}</h2><p>${e.role} · seit ${e.joinedAt}</p>
    <div class="order-detail-grid">
      <div class="detail-card">
        <h3 style="margin-top:0">Mitarbeiter verwalten</h3>
        <label class="inline-note">Rolle</label>
        <select class="field" id="employeeRoleInput" style="width:100%;margin:6px 0 10px">
          ${["Inhaber / Admin","Admin","Designer","Support","Auftragsmanagement"].map(r=>`<option ${r===e.role?"selected":""}>${r}</option>`).join("")}
        </select>

        <label class="inline-note">Status</label>
        <select class="field" id="employeeStatusInput" style="width:100%;margin:6px 0 10px">
          ${["Aktiv","Inaktiv"].map(s=>`<option ${s===e.status?"selected":""}>${s}</option>`).join("")}
        </select>

        <label class="inline-note">Interne Notiz</label>
        <textarea id="employeeNoteInput">${e.note||""}</textarea>

        <div class="permission-box">
          <strong>Rechte</strong>
          <div class="permission-grid">
            ${allPerms.map(p=>`<label><input type="checkbox" class="employeePerm" value="${p}" ${(e.permissions||[]).includes(p)?"checked":""}> ${p}</label>`).join("")}
          </div>
        </div>

        <button class="primary-btn" style="margin-top:12px;width:100%" onclick="saveEmployeeDetail('${e.name.replace(/'/g,"\\'")}')">Mitarbeiter speichern</button>
      </div>

      <div class="detail-card">
        <h3 style="margin-top:0">Auslastung</h3>
        <div class="employee-stats">
          <div><span>Offene Aufträge</span><b>${activeOrders.length}</b></div>
          <div><span>Offene Tickets</span><b>${activeTickets.length}</b></div>
          <div><span>Rechte</span><b>${(e.permissions||[]).length}</b></div>
        </div>

        <h4 style="margin:18px 0 8px">Aktuelle Aufträge</h4>
        <div class="mini-list">
          ${activeOrders.length?activeOrders.map(o=>`<button onclick="closeModal();openOrderDetail('${o.id}')"><span>${o.id}</span><b>${o.type}</b><small>${o.status}</small></button>`).join(""):`<div class="empty">Keine offenen Aufträge.</div>`}
        </div>

        <h4 style="margin:18px 0 8px">Aktuelle Tickets</h4>
        <div class="mini-list">
          ${activeTickets.length?activeTickets.map(t=>`<button onclick="closeModal();openTicketDetail('${t.id}')"><span>${t.id}</span><b>${t.title}</b><small>${t.status}</small></button>`).join(""):`<div class="empty">Keine offenen Tickets.</div>`}
        </div>
      </div>
    </div>`);
}

window.saveEmployeeDetail=function(name){
  const e=state.employees.find(x=>x.name===name); if(!e) return;
  const oldRole=e.role, oldStatus=e.status;
  e.role=document.getElementById("employeeRoleInput").value;
  e.status=document.getElementById("employeeStatusInput").value;
  e.note=document.getElementById("employeeNoteInput").value.trim();
  e.permissions=[...document.querySelectorAll(".employeePerm:checked")].map(x=>x.value);

  const changes=[];
  if(oldRole!==e.role) changes.push(`Rolle: ${e.role}`);
  if(oldStatus!==e.status) changes.push(`Status: ${e.status}`);
  changes.push(`${e.permissions.length} Rechte`);
  state.logs.unshift(`${name}: ${changes.join(" · ")}`);
  save();closeModal();render("employees");showToast("Mitarbeiter aktualisiert.");
}


window.openCategoryModal=function(){modal(formTemplate("Kategorie hinzufügen","Neue Clothing-Kategorie anlegen.",`<div class="form-group full"><label>Name</label><input name="name" required></div>`));document.getElementById("modalForm").onsubmit=e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.target));state.categories.push(f.name);save();closeModal();render("categories");showToast("Kategorie hinzugefügt.")}}
window.deleteCategory=function(i){if(confirm("Kategorie wirklich löschen?")){state.categories.splice(i,1);save();render("categories")}}

document.getElementById("quickAdd").onclick=()=>openOrderModal();
document.getElementById("backupBtn").onclick=()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="konya-clothing-backup.json";a.click();URL.revokeObjectURL(a.href);showToast("Backup erstellt.")};

document.getElementById("globalSearch").addEventListener("keydown",e=>{
  if(e.key==="Enter"){const q=e.target.value.toLowerCase();const found=[...state.orders.map(x=>({type:"Auftrag",label:`${x.id} — ${x.client}`})),...state.customers.map(x=>({type:"Kunde",label:x.name})),...state.clothing.map(x=>({type:"Design",label:x.name}))].filter(x=>x.label.toLowerCase().includes(q));modal(`<h2>Suchergebnisse</h2><p>${found.length} Treffer</p><div class="attention-list">${found.length?found.map(x=>`<div class="attention-item"><div class="attention-icon">⌕</div><div><strong>${x.label}</strong><small>${x.type}</small></div></div>`).join(""):'<div class="empty">Keine Treffer gefunden.</div>'}</div>`)}}
);

const notify=document.createElement("div");notify.className="notification-menu hidden";notify.id="notificationMenu";document.body.appendChild(notify);
document.getElementById("notifyBtn").onclick=()=>{
  notify.innerHTML=state.notifications.slice(0,15).map(n=>`<div class="notification-item"><b>${n}</b><span>Konya Clothing</span></div>`).join("") || `<div class="notification-item"><b>Keine Meldungen</b></div>`;
  notify.classList.toggle("hidden");document.getElementById("notifyDot").style.display="none";
};

document.addEventListener("click",e=>{
  if(!notify.contains(e.target) && !document.getElementById("notifyBtn").contains(e.target)){
    notify.classList.add("hidden");
  }
});
function normalizeRemoteState(){
  if(!state || typeof state!=="object") state=seed;
  if(!state.pricing) state.pricing=defaultPricing;
  if(!state.notificationSettings) state.notificationSettings={
    newOrder:true,urgentTicket:true,previewApproved:true,changeRequested:true,paymentReceived:true
  };
  state.orders=Array.isArray(state.orders)?state.orders:[];
  state.customers=Array.isArray(state.customers)?state.customers:[];
  state.tickets=Array.isArray(state.tickets)?state.tickets:[];
  state.employees=Array.isArray(state.employees)?state.employees:[];
  state.clothing=Array.isArray(state.clothing)?state.clothing:[];
  state.categories=Array.isArray(state.categories)?state.categories:[];
  state.showcase=Array.isArray(state.showcase)?state.showcase:[];
  state.logs=Array.isArray(state.logs)?state.logs:[];
  state.notifications=Array.isArray(state.notifications)?state.notifications:[];

  state.orders.forEach(o=>{
    if(!o.paymentStatus) o.paymentStatus=o.finalPrice?"Zahlung offen":"Nicht berechnet";
    if(o.paidAt===undefined) o.paidAt="";
    if(o.invoiceNote===undefined) o.invoiceNote="";
    if(!o.customerCode) o.customerCode=o.id;
    if(!Array.isArray(o.history)) o.history=[{label:"Auftrag übernommen",date:new Date().toLocaleDateString("de-DE")}];
    if(o.internalNote===undefined) o.internalNote="";
    if(o.priority===undefined) o.priority="Normal";
    if(o.progress===undefined) o.progress=0;
  });

  state.tickets.forEach(t=>{
    if(t.orderId===undefined) t.orderId="";
    if(t.internalNote===undefined) t.internalNote="";
    if(!Array.isArray(t.messages)) t.messages=[];
    if(!t.createdAt) t.createdAt=new Date().toLocaleDateString("de-DE");
  });

  state.employees.forEach((e,i)=>{
    if(e.status===undefined) e.status=e.active===false?"Inaktiv":"Aktiv";
    if(!Array.isArray(e.permissions)){
      e.permissions=e.role==="Inhaber / Admin"
        ? ["Aufträge","Kunden","Tickets","Showcase","Preise","Mitarbeiter","Logs"]
        : ["Aufträge","Kunden","Tickets","Showcase"];
    }
    delete e.active;
    if(e.note===undefined) e.note="";
    if(e.joinedAt===undefined) e.joinedAt=i===0?"01.09.2026":new Date().toLocaleDateString("de-DE");
  });
  syncCustomerMetrics();
}

async function loadBackendState(){
  setBackendStatus("syncing","Datenbank wird verbunden …");
  try{
    const res=await fetch("/api/state",{headers:{"Accept":"application/json"}});
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    const payload=await res.json();

    if(payload && payload.state){
      state=payload.state;
      normalizeRemoteState();
      localStorage.setItem("konyaAdminStateV3",JSON.stringify(state));
      backendReady=true;
      if(isAdminRoute) render("dashboard");
      else if(isCustomerRoute) customerArea();
      else publicView();
      setBackendStatus("online","Datenbank verbunden");
      if(isAdminRoute) showToast("Zentrale Datenbank geladen.");
    }else{
      backendReady=true;
      normalizeRemoteState();
      await pushStateToBackend();
      if(isAdminRoute) render("dashboard");
      else if(isCustomerRoute) customerArea();
      else publicView();
      if(isAdminRoute) showToast("Datenbank wurde mit deinem aktuellen Stand eingerichtet.");
    }
  }catch(err){
    console.warn("Backend nicht erreichbar – Browser-Backup aktiv.",err?.message||err);
    backendReady=false;
    setBackendStatus("offline","Datenbank offline · Browser-Backup aktiv");
    if(isAdminRoute) showToast("Backend nicht erreichbar – Browser-Backup wird verwendet.");
  }
}

syncCustomerMetrics();
if(isAdminRoute){
  render("dashboard");
}else if(isCustomerRoute){
  customerArea();
}else{
  publicView();
}
loadBackendState();
