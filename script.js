const FIREBASE_CONFIG={apiKey:"AIzaSyCaALqxdtEPCNxg5XPPG81T9853gOPO4qY",authDomain:"server-41203.firebaseapp.com",databaseURL:"https://server-41203-default-rtdb.firebaseio.com",projectId:"server-41203",storageBucket:"server-41203.firebasestorage.app",messagingSenderId:"26278139327",appId:"1:26278139327:web:db44a7e2d8d42d690abd0a"};
const GAMES=[
["mad-drive","Mad Drive","Racing","https://mozhihub.github.io/mad_drive/","etc/drive.jpg"],["knife-hit","Knife Hit","Arcade","https://mozhihub.github.io/Knife/","etc/knife.jpg"],["shooting-bot","Shooting Bot","Action","https://mozhihub.github.io/Shooting-bot/","etc/shooter.jpg"],["hexa-master","Hexa Master","Puzzle","https://mozhihub.github.io/Hexa/","etc/hexa.jpg"],["paint","Paint","Creative","https://mozhihub.github.io/Paint/","etc/paint.jpg"],["earth","Earth","Simulation","https://mozhihub.github.io/Earth-/","etc/earth.jpg"],["zoom","Zoom","Puzzle","https://mozhihub.github.io/Zoom/","etc/zoom.jpg"],["neon-shooter","Neon Shooter","Action","https://mozhihub.github.io/Neon-shooter/","etc/neon.jpg"],["xox-online","XOX Online","Multiplayer","https://mozhihub.github.io/Xoxo-online/","etc/xox.jpg"],["insto","Insto","Social","https://mozhihub.github.io/insto/","etc/insto.jpg"],["cube","Cube","Arcade","https://mozhihub.github.io/Cube/","etc/cube.jpg"],["word-scramble","Word Scramble","Puzzle","https://mozhihub.github.io/wordScramble/","etc/word.jpg"],["tetris","Tetris","Arcade","https://mozhihub.github.io/Tetris/","etc/tetris.jpg"],["build-house","Build House","Creative","https://mozhihub.github.io/Build-House/","etc/build.jpg"],["centipede","Centipede","Arcade","https://mozhihub.github.io/Centipede/","etc/cent.jpg"],["love-calculator","Love Calculator","Fun","https://mozhihub.github.io/Love-Calculator/","etc/love.jpg"],["neon-vanguard","Neon Vanguard","Action","https://mozhihub.github.io/Neon-shooter/neon.html","etc/vanguard.jpg"]
];
let category="All",search="",sort="default",favs=load("gx_favs",[]),history=load("gx_history",[]),currentGame=null;
const $=s=>document.querySelector(s),esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c]));
function load(k,d){try{const v=JSON.parse(localStorage.getItem(k));return v??d}catch{return d}}
function save(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
function toast(t,type=""){const h=$("#toastHost");if(!h)return;const x=document.createElement("div");x.className=`toast ${type}`;x.textContent=t;h.append(x);setTimeout(()=>x.remove(),2600)}
function tap(){if(load("gx_haptic",true)&&navigator.vibrate)try{navigator.vibrate(10)}catch{}}
const themes=["Neon Red","Neon Blue","Emerald","Crimson","Gold","Purple"];

/* ==================== GAMES ==================== */
function renderChips(){
 const el=$("#chips");if(!el)return;
 const categories=["All",...new Set(GAMES.map(g=>g[2]))];
 el.innerHTML="";
 categories.forEach(c=>{
   const b=document.createElement("button");
   b.type="button";b.className=`chip ${c===category?"active":""}`;b.textContent=c;b.dataset.category=c;
   b.addEventListener("click",()=>setCategory(c));el.appendChild(b);
 });
}
function filtered(){
 let a=GAMES.filter(g=>(category==="All"||g[2]===category)&&(!search||g[1].toLowerCase().includes(search.toLowerCase())||g[2].toLowerCase().includes(search.toLowerCase())));
 if(sort==="az")a.sort((x,y)=>x[1].localeCompare(y[1]));
 if(sort==="fav")a.sort((x,y)=>Number(favs.includes(y[0]))-Number(favs.includes(x[0]))||x[1].localeCompare(y[1]));
 return a;
}
function renderGames(){
 const el=$("#gameGrid");if(!el)return;const a=filtered();
 $("#sectionTitle").textContent=sort==="fav"?"Favorites":category==="All"?"All Games":category;
 $("#resultText").textContent=`${a.length} game${a.length!==1?"s":""}`;
 el.innerHTML="";
 a.forEach(g=>{
   const card=document.createElement("article");card.className="card";
   const thumb=document.createElement("div");thumb.className="thumb";thumb.style.backgroundImage=`url("${g[4]}")`;
   const fav=document.createElement("button");fav.type="button";fav.className=`fav-btn ${favs.includes(g[0])?"on":""}`;fav.setAttribute("aria-label",`Favorite ${g[1]}`);fav.innerHTML=`<i class="fa-${favs.includes(g[0])?"solid":"regular"} fa-heart"></i>`;
   fav.addEventListener("click",e=>{e.stopPropagation();toggleFav(g[0])});thumb.appendChild(fav);
   const body=document.createElement("div");body.className="card-body";
   const h=document.createElement("h3");h.textContent=g[1];
   const tag=document.createElement("span");tag.className="tag";tag.textContent=g[2];
   const play=document.createElement("button");play.type="button";play.className="play-btn";play.innerHTML='<i class="fas fa-play"></i> Play';play.addEventListener("click",()=>playGame(g[0]));
   body.append(h,tag,play);card.append(thumb,body);el.appendChild(card);
 });
 $("#empty").style.display=a.length?"none":"block";
}
function renderHistory(){const el=$("#historyList");if(!el)return;el.innerHTML=history.length?history.map(h=>{const g=GAMES.find(x=>x[0]===h.id);return g?`<div class="history-card" data-game="${esc(g[0])}"><b>${esc(g[1])}</b><small>${new Date(h.at).toLocaleString()}</small></div>`:""}).join(""):"<div style='color:var(--muted);font-size:11px;padding:10px 0'>No play history yet.</div>";el.querySelectorAll("[data-game]").forEach(x=>x.addEventListener("click",()=>playGame(x.dataset.game)))}
function stats(){
 const set=(id,v)=>{const e=$(id);if(e)e.textContent=v};
 set("#gameCount",GAMES.length);set("#favCount",favs.length);set("#historyCount",history.length);set("#infoGameCount",GAMES.length);set("#favSetting",`${favs.length} saved games`);set("#historySetting",`${history.length} games`);
}
function setCategory(c){category=c;sort="default";renderChips();renderGames();tap()}
function toggleFav(id){favs=favs.includes(id)?favs.filter(x=>x!==id):[...favs,id];save("gx_favs",favs);stats();renderGames();toast(favs.includes(id)?"Added to favorites":"Removed from favorites","ok");tap()}
function showFavorites(){category="All";search="";sort="fav";$("#searchInput").value="";renderChips();renderGames();scrollGames()}
function clearHistory(){history=[];save("gx_history",history);stats();renderHistory();toast("History cleared","ok")}
function clearSearch(){$("#searchInput").value="";search="";renderGames()}
function resetFilters(){category="All";search="";sort="default";$("#searchInput").value="";renderChips();renderGames()}
function cycleSort(){sort=sort==="default"?"az":sort==="az"?"fav":"default";renderGames();toast(sort==="default"?"Default order":sort==="az"?"A–Z order":"Favorites first")}

/* ==================== GAME PLAYER ==================== */
function setGameLoading(v,text="Loading game…"){const l=$("#gameLoading");if(!l)return;l.classList.toggle("hide",!v);const b=l.querySelector("b"),s=l.querySelector("small");if(b)b.textContent=text;if(s)s.textContent=v?"If it does not load, use Open External.":"Game loaded"}
function playGame(id){const g=GAMES.find(x=>x[0]===id);if(!g)return;currentGame=g;history=[{id,at:Date.now()},...history.filter(x=>x.id!==id)].slice(0,40);save("gx_history",history);stats();renderHistory();$("#gameTitle").textContent=g[1];$("#gameMeta").textContent=`${g[2]} • GAMEND X`;setGameLoading(true);$("#gameModal").classList.add("show");document.body.style.overflow="hidden";const f=$("#gameFrame");f.src="about:blank";setTimeout(()=>{if(currentGame)f.src=g[3]},20);tap()}
function closeGame(){const f=$("#gameFrame");if(f)f.src="about:blank";setGameLoading(false);$("#gameModal").classList.remove("show");document.body.style.overflow="";currentGame=null}
function reloadGame(){if(!currentGame)return;setGameLoading(true);const f=$("#gameFrame"),url=currentGame[3];f.src="about:blank";setTimeout(()=>{if(currentGame)f.src=url},50);tap()}
async function fullscreenGame(){const f=$("#gameFrame");try{if(document.fullscreenElement){await document.exitFullscreen();return}if(f.requestFullscreen)await f.requestFullscreen();else if(f.webkitRequestFullscreen)f.webkitRequestFullscreen();else throw 0}catch{toast("Fullscreen unavailable — opening game externally","err");openGameExternal()}}
function openGameExternal(){if(currentGame)window.open(currentGame[3],"_blank","noopener,noreferrer")}

/* ==================== NAV / UI ==================== */
function scrollGames(){$("#gamesSection").scrollIntoView({behavior:load("gx_motion",true)?"smooth":"auto"})}
function goHome(e){if(e)e.preventDefault();window.scrollTo({top:0,behavior:load("gx_motion",true)?"smooth":"auto"})}
function showHistory(){$("#historySection").scrollIntoView({behavior:load("gx_motion",true)?"smooth":"auto"})}
function toggleSidebar(){$("#sidebar").classList.toggle("active");$("#overlay").classList.toggle("show",$("#sidebar").classList.contains("active"));tap()}
function closeSidebar(){$("#sidebar").classList.remove("active");$("#overlay").classList.remove("show")}
function closeModals(){if($("#gameModal").classList.contains("show"))closeGame();["settingsModal","infoModal","feedbackModal","reportModal"].forEach(id=>$("#"+id).classList.remove("show"));document.body.style.overflow="";stopChat()}
function openSettings(){syncSettings();$("#settingsModal").classList.add("show");document.body.style.overflow="hidden"}
function closeSettings(){$("#settingsModal").classList.remove("show");document.body.style.overflow=""}
function openInfo(){$("#infoModal").classList.add("show");document.body.style.overflow="hidden"}
function closeInfo(){$("#infoModal").classList.remove("show");document.body.style.overflow=""}
function openFeedback(){$("#feedbackModal").classList.add("show");document.body.style.overflow="hidden"}
function closeFeedback(){$("#feedbackModal").classList.remove("show");document.body.style.overflow=""}
function openReport(){const e=$("#bugGame");if(e)e.innerHTML=GAMES.map(g=>`<option value="${esc(g[0])}">${esc(g[1])}</option>`).join("");$("#reportModal").classList.add("show");document.body.style.overflow="hidden"}
function closeReport(){$("#reportModal").classList.remove("show");document.body.style.overflow=""}
async function shareBot(){const url="https://t.me/gamendbot";try{if(navigator.share)await navigator.share({title:"GAMEND X",text:"Play games on GAMEND X",url});else{await navigator.clipboard.writeText(url);toast("Bot link copied","ok")}}catch{try{await navigator.clipboard.writeText(url);toast("Bot link copied","ok")}catch{toast(url)}}}

/* ==================== SETTINGS ==================== */
function setMode(v){localStorage.setItem("gx_mode",v);applyPrefs();tap()}
function setMotion(v){save("gx_motion",v);document.body.classList.toggle("reduced-motion",!v);syncSettings(false);tap()}
function setHaptic(v){save("gx_haptic",v);syncSettings(false);tap()}
function cycleTheme(){let n=(+localStorage.getItem("gx_theme")||0);n=(n+1)%themes.length;localStorage.setItem("gx_theme",n);applyPrefs();toast(themes[n],"ok")}
function renderThemeRadios(){const el=$("#themeRadios");if(!el)return;const n=+localStorage.getItem("gx_theme")||0;el.innerHTML=themes.map((t,i)=>`<label><input type="radio" name="theme" value="${i}"><span>${t}</span></label>`).join("");el.querySelectorAll('input[name="theme"]').forEach(x=>{x.checked=+x.value===n;x.addEventListener("change",()=>setTheme(+x.value))})}
function setTheme(n){localStorage.setItem("gx_theme",Math.min(5,Math.max(0,n)));applyPrefs();tap()}
function applyPrefs(){const n=Math.min(5,Math.max(0,+localStorage.getItem("gx_theme")||0));document.body.dataset.theme=n;document.body.classList.toggle("light",localStorage.getItem("gx_mode")==="light");document.body.classList.toggle("reduced-motion",!load("gx_motion",true));syncSettings(false)}
function syncSettings(render=true){if(render)renderThemeRadios();const n=+localStorage.getItem("gx_theme")||0,mode=localStorage.getItem("gx_mode")||"dark";const t=$("#themeText");if(t)t.textContent=themes[n];const m=document.querySelector(`input[name="mode"][value="${mode}"]`),mo=document.querySelector(`input[name="motion"][value="${load("gx_motion",true)?"on":"off"}"]`),h=document.querySelector(`input[name="haptic"][value="${load("gx_haptic",true)?"on":"off"}"]`);if(m)m.checked=true;if(mo)mo.checked=true;if(h)h.checked=true;stats()}
function resetLocal(){if(!confirm("Reset favorites, history and settings?"))return;["gx_favs","gx_history","gx_mode","gx_theme","gx_motion","gx_haptic"].forEach(k=>localStorage.removeItem(k));favs=[];history=[];applyPrefs();renderChips();renderGames();renderHistory();toast("Local data reset","ok")}

/* ==================== WEB3FORMS ==================== */
const WEB3FORMS_KEY="5e51a205-46d1-4db6-916f-0703efb327ab";
async function web3Submit(fields,subject){const body=new FormData();body.append("access_key",WEB3FORMS_KEY);body.append("subject",subject);body.append("from_name","GAMEND X");Object.entries(fields).forEach(([k,v])=>body.append(k,String(v??"")));const r=await fetch("https://api.web3forms.com/submit",{method:"POST",body});let d={};try{d=await r.json()}catch{}if(!r.ok||d.success!==true)throw new Error(d.message||"Submission failed");return d}
async function submitFeedback(e){e.preventDefault();const f=e.target,b=f.querySelector("button[type=submit]"),old=b?.innerHTML;if(b){b.disabled=true;b.innerHTML='<i class="fas fa-spinner fa-spin"></i> Sending…'}try{await web3Submit({name:$("#fbName").value.trim()||"Anonymous",type:$("#fbType").value,message:$("#fbText").value.trim()},"GAMEND X — Feedback");closeFeedback();f.reset();toast("Feedback sent successfully","ok")}catch(err){console.error(err);toast("Feedback send failed. Please try again.","err")}finally{if(b){b.disabled=false;b.innerHTML=old}}}
async function submitReport(e){e.preventDefault();const f=e.target,b=f.querySelector("button[type=submit]"),old=b?.innerHTML,g=GAMES.find(x=>x[0]===$("#bugGame").value);if(b){b.disabled=true;b.innerHTML='<i class="fas fa-spinner fa-spin"></i> Sending…'}try{await web3Submit({game:g?.[1]||"Unknown Game",report:$("#bugText").value.trim()},"GAMEND X — Bug Report");closeReport();f.reset();toast("Bug report sent successfully","ok")}catch(err){console.error(err);toast("Bug report send failed. Please try again.","err")}finally{if(b){b.disabled=false;b.innerHTML=old}}}

/* ==================== FIREBASE COMMUNITY ==================== */
async function firebaseLoad(){if(fb)return fb;try{const app=await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js"),db=await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js"),auth=await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js");const a=app.getApps().length?app.getApps()[0]:app.initializeApp(FIREBASE_CONFIG);fb={...db,...auth,app:a};return fb}catch(e){console.error("Firebase load failed",e);return null}}
async function ensureAuth(){const f=await firebaseLoad();if(!f)return null;const a=f.getAuth(f.app);if(a.currentUser)return a.currentUser;try{return(await f.signInAnonymously(a)).user}catch(e){console.error("Anonymous auth failed",e);return null}}
function guest(){return load("gx_guest",null)}
async function startPresence(){const f=await ensureAuth();if(!f)return;try{const db=f.getDatabase(f.app);presRef=f.ref(db,"community/presence/"+f.uid);await f.set(presRef,{online:true,lastSeen:f.serverTimestamp()});const dc=f.onDisconnect(presRef);await dc.update({online:false,lastSeen:f.serverTimestamp()});presStop=()=>{try{f.update(presRef,{online:false,lastSeen:f.serverTimestamp()})}catch{}};const pr=f.ref(db,"community/presence");presUnsub=f.onValue(pr,s=>{let n=0;s.forEach(x=>{if(x.val()?.online)n++});const v=$("#viewerCount");if(v)v.textContent=n})}catch(e){console.error("Presence unavailable",e)}}
function stopPresence(){if(presUnsub){try{presUnsub()}catch{}presUnsub=null}if(presStop)presStop();presStop=null;presRef=null}
function setChatStatus(t,type=""){const x=$("#chatStatus");if(x){x.textContent=t;x.className=`chat-status ${type}`}}
function openCommunity(){
 closeSidebar();
 tap();
 window.location.href="community.html";
}
function closeCommunity(){window.location.href="index.html"}

/* ==================== BOTTOM NAV ==================== */
function navActive(b){document.querySelectorAll(".bottom-nav button").forEach(x=>x.classList.remove("active"));if(b)b.classList.add("active")}
function navHome(b){navActive(b);goHome()}
function navGames(b){navActive(b);scrollGames()}
function navChat(b){navActive(b);openCommunity()}
function navFav(b){navActive(b);showFavorites()}

/* ==================== INIT ==================== */
function init(){
 applyPrefs();renderChips();renderGames();renderHistory();
 const searchInput=$("#searchInput");if(searchInput)searchInput.addEventListener("input",e=>{search=e.target.value.trim();renderGames()});
 const chatInput=$("#chatInput");if(chatInput)chatInput.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage()}});
 const frame=$("#gameFrame");if(frame){frame.addEventListener("load",()=>{if(currentGame)setGameLoading(false)});frame.addEventListener("error",()=>{setGameLoading(false,"Game could not load");toast("Game failed to load. Try Open External.","err")})}
 document.querySelectorAll(".modal").forEach(m=>m.addEventListener("click",e=>{if(e.target===m&&m.id!=="gameModal")m.classList.remove("show")}));
 if(window.Telegram?.WebApp){try{Telegram.WebApp.ready();Telegram.WebApp.expand()}catch{}}
 $("#loaderText").textContent="Ready";setTimeout(()=>$("#loader").classList.add("loader-hide"),550)
}
document.addEventListener("DOMContentLoaded",init);
window.addEventListener("keydown",e=>{if(e.key==="Escape"){closeModals();closeSidebar()}});
Object.assign(window,{toggleSidebar,closeSidebar,goHome,scrollGames,showFavorites,showHistory,openCommunity,openSettings,closeSettings,openFeedback,closeFeedback,openReport,closeReport,openInfo,closeInfo,shareBot,playGame,closeGame,reloadGame,fullscreenGame,openGameExternal,setCategory,toggleFav,clearHistory,clearSearch,resetFilters,cycleSort,cycleTheme,setTheme,setMode,setMotion,setHaptic,resetLocal,submitFeedback,submitReport,closeCommunity,navHome,navGames,navChat,navFav});
