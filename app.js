const seed = {
  orders: [
    {id:"KC-2026-0042", client:"Max M.", type:"Hoodie + Hose", designer:"Konsti Shakur", price:95000, deadline:"2026-09-07", status:"In Bearbeitung", progress:65, priority:"Hoch", organization:"Black Order"},
    {id:"KC-2026-0041", client:"Lena S.", type:"Komplettes Outfit", designer:"Mira V.", price:145000, deadline:"2026-09-09", status:"Kundenvorschau", progress:80, priority:"Normal", organization:"Privat"},
    {id:"KC-2026-0040", client:"Denis K.", type:"Weste", designer:"Konsti Shakur", price:55000, deadline:"2026-09-05", status:"Warten auf Kunde", progress:72, priority:"Hoch", organization:"Bloodline"}
  ],
  clothing: [
    {name:"Luxury Hoodie", category:"Oberteile", customer:"Max M.", versions:3, status:"Freigegeben"},
    {name:"Streetwear Pants", category:"Hosen", customer:"Lena S.", versions:2, status:"Kundenvorschau"},
    {name:"Tactical Weste", category:"Westen", customer:"Denis K.", versions:1, status:"In Bearbeitung"}
  ],
  customers: [
    {name:"Max M.", discord:"maxm", organization:"Black Order", orders:2, revenue:170000, status:"Aktiv"},
    {name:"Lena S.", discord:"lena.s", organization:"Privat", orders:1, revenue:145000, status:"Aktiv"},
    {name:"Denis K.", discord:"denis.k", organization:"Bloodline", orders:1, revenue:55000, status:"Aktiv"}
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
    "Ticket #128 wurde Konsti Shakur zugewiesen",
    "Luxury Hoodie — Version 3 als final markiert",
    "Neuer Kunde Lena S. angelegt"
  ],
  notifications:[
    "Ticket #128 ist als dringend markiert.",
    "KC-2026-0040 ist morgen fällig.",
    "Lena S. wartet auf Kundenvorschau."
  ]
};

let state = JSON.parse(localStorage.getItem("konyaAdminStateV2") || "null") || seed;
const save = () => localStorage.setItem("konyaAdminStateV2", JSON.stringify(state));
const root = document.getElementById("viewRoot");
const title = document.getElementById("pageTitle");
const subtitle = document.getElementById("pageSubtitle");

function money(n){ return new Intl.NumberFormat("de-DE").format(n)+" $"; }
function statusClass(s){
  if(/fertig|freigegeben|ausgeliefert|aktiv/i.test(s)) return "done";
  if(/warten|vorschau/i.test(s)) return "wait";
  if(/bearbeitung/i.test(s)) return "progress";
  if(/überfällig|storniert|dringend/i.test(s)) return "danger";
  return "new";
}
function showToast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
function kpi(label,val,foot,cls=""){return `<div class="kpi ${cls}"><div class="kpi-label">${label}</div><div class="kpi-value">${val}</div><div class="kpi-foot">${foot}</div></div>`}

function dashboard(){
  const urgent=state.tickets.filter(x=>x.priority==="Dringend" && x.status!=="Geschlossen").length;
  const openTickets=state.tickets.filter(x=>x.status!=="Geschlossen").length;
  title.textContent="Übersicht"; subtitle.textContent="Alles Wichtige zu Konya Clothing auf einen Blick.";
  root.innerHTML=`
    <div class="grid kpi-grid">
      ${kpi("Designs",state.clothing.length,"Gesamt im System")}
      ${kpi("Kunden",state.customers.length,"Aktive Kunden")}
      ${kpi("Offene Aufträge",state.orders.length,"Aktuell in Arbeit")}
      ${kpi("Offene Tickets",openTickets,"Support & Änderungen",openTickets>2?"warn":"")}
      ${kpi("Dringend",urgent,"Benötigt Aufmerksamkeit",urgent?"alert":"")}
    </div>
    <div class="grid two-col">
      <div class="panel"><div class="panel-head"><h3>Offene Aufträge</h3><span>${state.orders.length} aktuell</span></div><div class="panel-body table-wrap">
      <table><thead><tr><th>Auftrag</th><th>Kunde</th><th>Typ</th><th>Status</th><th>Fortschritt</th><th>Deadline</th></tr></thead>
      <tbody>${state.orders.map(o=>`<tr><td><b>${o.id}</b></td><td>${o.client}</td><td>${o.type}</td><td><span class="status ${statusClass(o.status)}">${o.status}</span></td><td><div class="progress"><span style="width:${o.progress}%"></span></div></td><td>${o.deadline}</td></tr>`).join("")}</tbody></table></div></div>
      <div class="panel"><div class="panel-head"><h3>Was braucht Aufmerksamkeit?</h3><span>Live</span></div><div class="panel-body attention-list">
        <div class="attention-item"><div class="attention-icon">!</div><div><strong>${urgent} dringende Tickets</strong><small>Supportfälle mit hoher Priorität prüfen.</small></div></div>
        <div class="attention-item"><div class="attention-icon">⌚</div><div><strong>${state.orders.filter(o=>o.deadline<="2026-09-05").length} Auftrag bald fällig</strong><small>Deadline prüfen und ggf. Designer informieren.</small></div></div>
        <div class="attention-item"><div class="attention-icon">✓</div><div><strong>${state.clothing.filter(c=>c.status==="Kundenvorschau").length} Vorschau wartet</strong><small>Kundenfreigabe steht noch aus.</small></div></div>
      </div></div>
    </div>
    <div class="panel" style="margin-bottom:18px"><div class="panel-head"><h3>Schnellaktionen</h3><span>Häufig verwendet</span></div><div class="panel-body grid action-grid">
      <button class="quick-card" onclick="openOrderModal()"><b>+ Neuer Auftrag</b><span>Kunde, Wunsch, Preis und Deadline</span></button>
      <button class="quick-card" onclick="openClothingModal()"><b>+ Neues Design</b><span>Design und Version erfassen</span></button>
      <button class="quick-card" onclick="openCustomerModal()"><b>+ Neuer Kunde</b><span>Kundenakte erstellen</span></button>
      <button class="quick-card" onclick="openTicketModal()"><b>+ Ticket</b><span>Support oder Änderung anlegen</span></button>
    </div></div>`;
}

function genericTable(view){
  const configs={
    clothing:{t:"Clothing",s:"Designs, Versionen und Freigaben verwalten.",btn:"+ Design",headers:["Design","Kategorie","Kunde","Versionen","Status"],rows:state.clothing.map(x=>[x.name,x.category,x.customer,"v"+x.versions,`<span class="status ${statusClass(x.status)}">${x.status}</span>`]),action:"openClothingModal()"},
    orders:{t:"Aufträge",s:"Von der Anfrage bis zur Auslieferung.",btn:"+ Auftrag",headers:["Auftrag","Kunde","Organisation","Kleidungsart","Designer","Preis","Status","Deadline"],rows:state.orders.map(x=>[x.id,x.client,x.organization||"Privat",x.type,x.designer,money(x.price),`<span class="status ${statusClass(x.status)}">${x.status}</span>`,x.deadline]),action:"openOrderModal()"},
    customers:{t:"Kunden",s:"Kundenakten, Discord, Bestellungen und Umsatz.",btn:"+ Kunde",headers:["Kunde","Discord","Organisation","Aufträge","Umsatz","Status"],rows:state.customers.map(x=>[x.name,x.discord,x.organization,x.orders,money(x.revenue),`<span class="status ${statusClass(x.status)}">${x.status}</span>`]),action:"openCustomerModal()"},
    tickets:{t:"Tickets",s:"Support, Änderungswünsche und Zuständigkeit.",btn:"+ Ticket",headers:["Ticket","Betreff","Kunde","Priorität","Status","Zuständig"],rows:state.tickets.map(x=>[x.id,x.title,x.client,x.priority,`<span class="status ${statusClass(x.priority==="Dringend"?"Dringend":x.status)}">${x.status}</span>`,x.assigned]),action:"openTicketModal()"},
    employees:{t:"Mitarbeiter",s:"Rollen und Rechteverwaltung.",btn:"+ Mitarbeiter",headers:["Name","Rolle","Berechtigungen","Status"],rows:state.employees.map(x=>[x.name,x.role,x.permissions,x.active?'<span class="status done">Aktiv</span>':'<span class="status danger">Inaktiv</span>']),action:"openEmployeeModal()"}
  };
  const c=configs[view]; title.textContent=c.t; subtitle.textContent=c.s;
  root.innerHTML=`<div class="toolbar"><div class="toolbar-left"><input class="field" id="tableSearch" placeholder="Suchen ..."></div><div class="toolbar-right"><button class="primary-btn" onclick="${c.action}">${c.btn}</button></div></div>
  <div class="panel"><div class="panel-body table-wrap"><table id="mainTable"><thead><tr>${c.headers.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${c.rows.map(r=>`<tr>${r.map(v=>`<td>${v}</td>`).join("")}</tr>`).join("")}</tbody></table></div></div>`;
  document.getElementById("tableSearch").addEventListener("input",e=>{const q=e.target.value.toLowerCase();[...document.querySelectorAll("#mainTable tbody tr")].forEach(tr=>tr.style.display=tr.textContent.toLowerCase().includes(q)?"":"none")});
}

function categories(){
  title.textContent="Kategorien"; subtitle.textContent="Clothing sauber nach Typen organisieren.";
  root.innerHTML=`<div class="toolbar"><div></div><button class="primary-btn" onclick="openCategoryModal()">+ Kategorie</button></div>
  <div class="cards">${state.categories.map((x,i)=>`<div class="card"><h3>${x}</h3><p>${state.clothing.filter(c=>c.category===x).length} Designs zugeordnet</p><div class="card-footer"><span class="pill">Aktiv</span><button class="danger-btn" onclick="deleteCategory(${i})">Löschen</button></div></div>`).join("")}</div>`;
}

function showcase(){
  title.textContent="Showcase"; subtitle.textContent="Fertige Arbeiten für die öffentliche Galerie auswählen.";
  root.innerHTML=`<div class="toolbar"><div></div><button class="primary-btn" onclick="showToast('Upload-System kommt im nächsten Schritt.')">+ Showcase Eintrag</button></div>
  <div class="showcase-grid">${state.showcase.map(x=>`<div class="showcase-card"><div class="showcase-preview">◇</div><div class="showcase-info"><b>${x.name}</b><span>${x.category} · ${x.tag}</span></div></div>`).join("")}</div>`;
}

function logs(){
  title.textContent="Protokoll"; subtitle.textContent="Nachvollziehbar, wer was geändert hat.";
  root.innerHTML=`<div class="panel"><div class="panel-body table-wrap"><table><thead><tr><th>Datum</th><th>Mitarbeiter</th><th>Aktion</th><th>Bereich</th></tr></thead><tbody>${state.logs.map((x,i)=>`<tr><td>04.09.2026 · ${22-i}:1${i}</td><td>Konsti Shakur</td><td>${x}</td><td>Admin</td></tr>`).join("")}</tbody></table></div></div>`;
}

function publicView(){
  title.textContent="Öffentliche Seite"; subtitle.textContent="So könnte die allgemeine Clothing-Seite aussehen.";
  root.innerHTML=`
  <div class="hero-public">
    <div><div class="eyebrow">CUSTOM FIVEM CLOTHING</div><h2>Deine Idee.<br>Dein Style.<br>Dein Clothing.</h2>
    <p>Konya Clothing erstellt individuelle FiveM-Kleidung für einzelne Spieler, Crews, Unternehmen und Fraktionen. Vom kleinen Logo-Fix bis zum kompletten Outfit.</p>
    <div style="margin-top:22px"><button class="primary-btn" onclick="openPublicOrderModal()">Auftrag anfragen</button> <button class="secondary-btn" onclick="render('showcase')">Showcase ansehen</button></div></div>
    <img src="assets/konya-logo.png" class="hero-logo" alt="Konya Clothing">
  </div>
  <div class="service-grid">
    <div class="service-card"><b>Custom Clothing</b><span>Hoodies, Shirts, Hosen, Westen und komplette Sets.</span></div>
    <div class="service-card"><b>Texture Fix</b><span>Unscharfe, verpixelte oder fehlerhafte Texturen überarbeiten.</span></div>
    <div class="service-card"><b>Branding</b><span>Logos, Schriftzüge und Muster sauber auf Clothing platzieren.</span></div>
    <div class="service-card"><b>Komplettpakete</b><span>Einheitliche Kollektionen für Gruppen oder Projekte.</span></div>
  </div>
  <div class="panel" style="margin-top:18px"><div class="panel-head"><h3>Beliebte Leistungen</h3><span>Beispielpreise</span></div><div class="panel-body price-grid">
    <div class="price-card"><h3>Texture Fix</h3><p>Schärfen, Kanten, Logo-Anpassung</p><div class="price">ab 25.000 $</div></div>
    <div class="price-card"><h3>Einzelteil</h3><p>Hoodie, Hose, Shirt oder Weste</p><div class="price">ab 45.000 $</div></div>
    <div class="price-card"><h3>Outfit</h3><p>Mehrere Kleidungsstücke im selben Stil</p><div class="price">ab 95.000 $</div></div>
    <div class="price-card"><h3>Custom Pack</h3><p>Größeres Paket nach Absprache</p><div class="price">Anfrage</div></div>
  </div></div>`;
}

function customerArea(){
  title.textContent="Kundenbereich"; subtitle.textContent="Auftragsstatus, Vorschauen und Änderungen für Kunden.";
  const o=state.orders[0];
  root.innerHTML=`<div class="customer-hero"><div class="eyebrow">MEIN AUFTRAG</div><h2 style="margin:0">${o.id} · ${o.type}</h2><p style="color:var(--muted)">${o.client} · ${o.organization}</p>
  <div class="step-row">${["Anfrage","Angenommen","In Bearbeitung","Vorschau","Freigabe","Ausgeliefert"].map((s,i)=>`<div class="step ${i<=2?"active":""}">${s}</div>`).join("")}</div></div>
  <div class="grid two-col" style="margin-top:18px">
    <div class="panel"><div class="panel-head"><h3>Auftragsdetails</h3><span>${o.progress}%</span></div><div class="panel-body">
      <p><b>Status:</b> ${o.status}</p><p><b>Designer:</b> ${o.designer}</p><p><b>Deadline:</b> ${o.deadline}</p><p><b>Preis:</b> ${money(o.price)}</p>
      <div class="progress" style="margin-top:14px"><span style="width:${o.progress}%"></span></div>
    </div></div>
    <div class="panel"><div class="panel-head"><h3>Kundenvorschau</h3><span>Version 3</span></div><div class="panel-body">
      <div class="showcase-preview" style="border-radius:10px">◇</div>
      <div style="display:flex;gap:8px;margin-top:12px"><button class="primary-btn" onclick="showToast('Design freigegeben.')">Freigeben</button><button class="secondary-btn" onclick="showToast('Änderungswunsch erfasst.')">Änderung wünschen</button></div>
    </div></div>
  </div>`;
}

function render(view){
  document.querySelectorAll(".nav-item").forEach(x=>x.classList.toggle("active",x.dataset.view===view));
  if(view==="dashboard") dashboard();
  else if(["clothing","orders","customers","tickets","employees"].includes(view)) genericTable(view);
  else if(view==="categories") categories();
  else if(view==="showcase") showcase();
  else if(view==="logs") logs();
  else if(view==="public") publicView();
  else if(view==="customer") customerArea();
}

document.querySelectorAll("[data-view]").forEach(b=>b.addEventListener("click",()=>render(b.dataset.view)));

const backdrop=document.getElementById("modalBackdrop"), modalContent=document.getElementById("modalContent");
function modal(html){modalContent.innerHTML=html;backdrop.classList.remove("hidden")}
function closeModal(){backdrop.classList.add("hidden")}
document.getElementById("modalClose").onclick=closeModal;
backdrop.addEventListener("click",e=>{if(e.target===backdrop)closeModal()});
function formTemplate(t,d,fields){return `<h2>${t}</h2><p>${d}</p><form id="modalForm"><div class="form-grid">${fields}</div><div class="form-actions"><button type="button" class="secondary-btn" onclick="closeModal()">Abbrechen</button><button class="primary-btn">Speichern</button></div></form>`}

window.openOrderModal=function(){
  modal(formTemplate("Neuen Auftrag anlegen","Allgemeiner Clothing-Auftrag für Privatkunden, Crews oder Organisationen.",`
  <div class="form-group"><label>Kunde</label><input name="client" required></div>
  <div class="form-group"><label>Organisation / Fraktion (optional)</label><input name="organization" placeholder="Privat"></div>
  <div class="form-group"><label>Leistung</label><select name="type"><option>Hoodie</option><option>Hose</option><option>Shirt</option><option>Weste</option><option>Komplettes Outfit</option><option>Texture Fix</option><option>Logo Platzierung</option><option>Sonderanfertigung</option></select></div>
  <div class="form-group"><label>Designer</label><input name="designer" value="Konsti Shakur"></div>
  <div class="form-group"><label>Preis</label><input name="price" type="number" value="50000"></div>
  <div class="form-group"><label>Deadline</label><input name="deadline" type="date" required></div>
  <div class="form-group full"><label>Wunsch / Beschreibung</label><textarea name="note" placeholder="Farben, Logo, Muster, Referenzen ..."></textarea></div>`));
  document.getElementById("modalForm").onsubmit=e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.target));const next=43+state.orders.length;state.orders.unshift({id:`KC-2026-${String(next).padStart(4,"0")}`,client:f.client,organization:f.organization||"Privat",type:f.type,designer:f.designer,price:+f.price,deadline:f.deadline,status:"Neu",progress:10,priority:"Normal"});state.logs.unshift(`Neuer Auftrag für ${f.client} angelegt`);save();closeModal();render("orders");showToast("Auftrag wurde angelegt.")};
}

window.openPublicOrderModal=function(){
  modal(formTemplate("Auftrag anfragen","Beschreibe deinen Wunsch. Die Anfrage landet anschließend im Adminbereich.",`
  <div class="form-group"><label>Name</label><input name="client" required></div>
  <div class="form-group"><label>Discord</label><input name="discord" required></div>
  <div class="form-group"><label>Leistung</label><select name="type"><option>Hoodie</option><option>Hose</option><option>Shirt</option><option>Weste</option><option>Komplettes Outfit</option><option>Texture Fix</option><option>Logo Platzierung</option><option>Sonderanfertigung</option></select></div>
  <div class="form-group"><label>Organisation (optional)</label><input name="organization"></div>
  <div class="form-group full"><label>Was soll gemacht werden?</label><textarea name="note" required></textarea></div>`));
  document.getElementById("modalForm").onsubmit=e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.target));state.customers.push({name:f.client,discord:f.discord,organization:f.organization||"Privat",orders:1,revenue:0,status:"Neu"});state.orders.unshift({id:`KC-2026-${String(50+state.orders.length).padStart(4,"0")}`,client:f.client,organization:f.organization||"Privat",type:f.type,designer:"Noch nicht zugewiesen",price:0,deadline:"Offen",status:"Anfrage",progress:0,priority:"Normal"});state.logs.unshift(`Neue Kundenanfrage von ${f.client}`);save();closeModal();showToast("Anfrage wurde gesendet.")};
}

window.openClothingModal=function(){
  modal(formTemplate("Neues Clothing-Design","Design direkt einem Kunden und einer Kategorie zuordnen.",`
  <div class="form-group"><label>Name</label><input name="name" required></div>
  <div class="form-group"><label>Kategorie</label><select name="category">${state.categories.map(c=>`<option>${c}</option>`).join("")}</select></div>
  <div class="form-group"><label>Kunde</label><input name="customer" required></div>
  <div class="form-group"><label>Status</label><select name="status"><option>Entwurf</option><option>In Bearbeitung</option><option>Kundenvorschau</option><option>Freigegeben</option></select></div>`));
  document.getElementById("modalForm").onsubmit=e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.target));state.clothing.unshift({...f,versions:1});state.logs.unshift(`Design ${f.name} angelegt`);save();closeModal();render("clothing");showToast("Design wurde gespeichert.")};
}
window.openCustomerModal=function(){
  modal(formTemplate("Neuen Kunden anlegen","Kundenakte für Bestellungen und Support.",`
  <div class="form-group"><label>Name</label><input name="name" required></div>
  <div class="form-group"><label>Discord</label><input name="discord"></div>
  <div class="form-group full"><label>Organisation / Fraktion / Unternehmen</label><input name="organization" placeholder="Privat"></div>`));
  document.getElementById("modalForm").onsubmit=e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.target));state.customers.unshift({name:f.name,discord:f.discord,organization:f.organization||"Privat",orders:0,revenue:0,status:"Aktiv"});state.logs.unshift(`Kunde ${f.name} angelegt`);save();closeModal();render("customers");showToast("Kunde wurde angelegt.")};
}
window.openTicketModal=function(){
  modal(formTemplate("Neues Ticket","Support oder Änderungswunsch erfassen.",`
  <div class="form-group"><label>Betreff</label><input name="title" required></div>
  <div class="form-group"><label>Kunde</label><input name="client" required></div>
  <div class="form-group"><label>Priorität</label><select name="priority"><option>Normal</option><option>Hoch</option><option>Dringend</option></select></div>
  <div class="form-group"><label>Zuständig</label><input name="assigned" value="Konsti Shakur"></div>
  <div class="form-group full"><label>Interne Notiz</label><textarea name="note"></textarea></div>`));
  document.getElementById("modalForm").onsubmit=e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.target));state.tickets.unshift({id:"#"+(129+state.tickets.length),title:f.title,client:f.client,priority:f.priority,status:"Offen",assigned:f.assigned});state.logs.unshift(`Ticket für ${f.client} angelegt`);save();closeModal();render("tickets");showToast("Ticket wurde angelegt.")};
}
window.openEmployeeModal=function(){
  modal(formTemplate("Mitarbeiter hinzufügen","Rolle und Rechte zuweisen.",`
  <div class="form-group"><label>Name</label><input name="name" required></div>
  <div class="form-group"><label>Rolle</label><select name="role"><option>Admin</option><option>Designer</option><option>Support</option><option>Buchhaltung</option></select></div>
  <div class="form-group full"><label>Berechtigungen</label><input name="permissions" value="Clothing, Aufträge"></div>`));
  document.getElementById("modalForm").onsubmit=e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.target));state.employees.push({...f,active:true});state.logs.unshift(`Mitarbeiter ${f.name} hinzugefügt`);save();closeModal();render("employees");showToast("Mitarbeiter wurde hinzugefügt.")};
}
window.openCategoryModal=function(){
  modal(formTemplate("Kategorie hinzufügen","Neue Clothing-Kategorie anlegen.",`<div class="form-group full"><label>Name</label><input name="name" required></div>`));
  document.getElementById("modalForm").onsubmit=e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.target));state.categories.push(f.name);save();closeModal();render("categories");showToast("Kategorie wurde hinzugefügt.")};
}
window.deleteCategory=function(i){if(confirm("Kategorie wirklich löschen?")){state.categories.splice(i,1);save();render("categories")}}

document.getElementById("quickAdd").onclick=()=>openOrderModal();
document.getElementById("backupBtn").onclick=()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="konya-clothing-backup.json";a.click();URL.revokeObjectURL(a.href);showToast("Backup wurde erstellt.")};

document.getElementById("globalSearch").addEventListener("keydown",e=>{
  if(e.key==="Enter"){const q=e.target.value.toLowerCase();const found=[
    ...state.orders.map(x=>({type:"Auftrag",label:`${x.id} — ${x.client}`})),
    ...state.customers.map(x=>({type:"Kunde",label:x.name})),
    ...state.clothing.map(x=>({type:"Design",label:x.name}))
  ].filter(x=>x.label.toLowerCase().includes(q));
  modal(`<h2>Suchergebnisse</h2><p>${found.length} Treffer für „${e.target.value}“</p><div class="attention-list">${found.length?found.map(x=>`<div class="attention-item"><div class="attention-icon">⌕</div><div><strong>${x.label}</strong><small>${x.type}</small></div></div>`).join(""):'<div class="empty">Keine Treffer gefunden.</div>'}</div>`)}}
);

const notify=document.createElement("div");notify.className="notification-menu hidden";notify.id="notificationMenu";
notify.innerHTML=state.notifications.map(n=>`<div class="notification-item"><b>${n}</b><span>Gerade eben</span></div>`).join("");document.body.appendChild(notify);
document.getElementById("notifyBtn").onclick=()=>{notify.classList.toggle("hidden");document.getElementById("notifyDot").style.display="none"};

render("dashboard");
