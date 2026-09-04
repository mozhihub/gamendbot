const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCaALqxdtEPCNxg5XPPG81T9853gOPO4qY",
  authDomain: "server-41203.firebaseapp.com",
  databaseURL: "https://server-41203-default-rtdb.firebaseio.com",
  projectId: "server-41203",
  storageBucket: "server-41203.firebasestorage.app",
  messagingSenderId: "26278139327",
  appId: "1:26278139327:web:db44a7e2d8d42d690abd0a",
  measurementId: "G-T27MZ6PRPZ"
};
const GAMES=[["mad-drive","Mad Drive","Racing","https://mozhihub.github.io/mad_drive/","etc/drive.jpg"],["knife-hit","Knife Hit","Arcade","https://mozhihub.github.io/Knife/","etc/knife.jpg"],["shooting-bot","Shooting Bot","Action","https://mozhihub.github.io/Shooting-bot/","etc/shooter.jpg"],["hexa-master","Hexa Master","Puzzle","https://mozhihub.github.io/Hexa/","etc/hexa.jpg"],["paint","Paint","Creative","https://mozhihub.github.io/Paint/","etc/paint.jpg"],["earth","Earth","Simulation","https://mozhihub.github.io/Earth-/","etc/earth.jpg"],["zoom","Zoom","Puzzle","https://mozhihub.github.io/Zoom/","etc/zoom.jpg"],["neon-shooter","Neon Shooter","Action","https://mozhihub.github.io/Neon-shooter/","etc/neon.jpg"],["xox-online","XOX Online","Multiplayer","https://mozhihub.github.io/Xoxo-online/","etc/xox.jpg"],["insto","Insto","Social","https://mozhihub.github.io/insto/","etc/insto.jpg"],["cube","Cube","Arcade","https://mozhihub.github.io/Cube/","etc/cube.jpg"],["word-scramble","Word Scramble","Puzzle","https://mozhihub.github.io/wordScramble/","etc/word.jpg"],["tetris","Tetris","Arcade","https://mozhihub.github.io/Tetris/","etc/tetris.jpg"],["build-house","Build House","Creative","https://mozhihub.github.io/Build-House/","etc/build.jpg"],["centipede","Centipede","Arcade","https://mozhihub.github.io/Centipede/","etc/cent.jpg"],["love-calculator","Love Calculator","Fun","https://mozhihub.github.io/Love-Calculator/","etc/love.jpg"],["neon-vanguard","Neon Vanguard","Action","https://mozhihub.github.io/Neon-shooter/neon.html","etc/vanguard.jpg"]];
let category="All",search="",sort="default",favs=load("gx_favs",[]),history=load("gx_history",[]),fb=null,msgUnsub=null,presUnsub=null;
const $=s=>document.querySelector(s), esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
function load(k,d){try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}}function save(k,v){localStorage.setItem(k,JSON.stringify(v))}
function toast(t,type=""){const x=document.createElement("div");x.className="toast "+type;x.textContent=t;$("#toastHost").append(x);setTimeout(()=>x.remove(),2600)}
function tap(){if(load("gx_haptic",true)&&navigator.vibrate)navigator.vibrate(10)}
const themes=["Neon Red","Neon Blue","Emerald","Crimson","Gold","Purple"];
function renderChips(){let a=["All",...new Set(GAMES.map(g=>g[2]))];$("#chips").innerHTML=a.map(c=>`<button class="chip ${c===category?"active":""}" onclick="setCategory('${c}')">${c}</button>`).join("")}
function filtered(){let a=GAMES.filter(g=>(category==="All"||g[2]===category)&&(!search||g[1].toLowerCase().includes(search.toLowerCase())||g[2].toLowerCase().includes(search.toLowerCase())));if(sort==="az")a.sort((x,y)=>x[1].localeCompare(y[1]));if(sort==="fav")a.sort((x,y)=>Number(favs.includes(y[0]))-Number(favs.includes(x[0])));return a}
function renderGames(){let a=filtered();$("#sectionTitle").textContent=sort==="fav"?"Favorites":category==="All"?"All Games":category;$("#resultText").textContent=`${a.length} game${a.length!==1?"s":""}`;$("#gameGrid").innerHTML=a.map(g=>`<article class="card"><div class="thumb" style="background-image:url('${g[4]}')"><button class="fav-btn ${favs.includes(g[0])?"on":""}" onclick="toggleFav('${g[0]}');event.stopPropagation()"><i class="fa-${favs.includes(g[0])?"solid":"regular"} fa-heart"></i></button></div><div class="card-body"><h3>${esc(g[1])}</h3><span class="tag">${esc(g[2])}</span><button class="play-btn" onclick="playGame('${g[0]}')"><i class="fas fa-play"></i> Play</button></div></article>`).join("");$("#empty").style.display=a.length?"none":"block"}
function renderHistory(){let a=history;$("#historyList").innerHTML=a.length?a.map(h=>{let g=GAMES.find(x=>x[0]===h.id);return g?`<div class="history-card" onclick="playGame('${g[0]}')"><b>${esc(g[1])}</b><small>${new Date(h.at).toLocaleString()}</small></div>`:""}).join(""):"<div style='color:var(--muted);font-size:11px;padding:10px 0'>No play history yet.</div>"}
function stats(){$("#gameCount").textContent=GAMES.length;$("#favCount").textContent=favs.length;$("#historyCount").textContent=history.length;$("#infoGameCount").textContent=GAMES.length;$("#favSetting").textContent=`${favs.length} saved games` ;$("#historySetting").textContent=`${history.length} games`}
function setCategory(c){category=c;sort="default";renderChips();renderGames();tap()}
function toggleFav(id){favs=favs.includes(id)?favs.filter(x=>x!==id):[...favs,id];save("gx_favs",favs);stats();renderGames();toast(favs.includes(id)?"Added to favorites":"Removed from favorites","ok");tap()}
function playGame(id){let g=GAMES.find(x=>x[0]===id);if(!g)return;history=[{id,at:Date.now()},...history.filter(x=>x.id!==id)].slice(0,40);save("gx_history",history);stats();renderHistory();$("#gameTitle").textContent=g[1];$("#gameMeta").textContent=`${g[2]} • GAMEND X`;$("#gameFrame").src=g[3];$("#gameModal").classList.add("show");document.body.style.overflow="hidden";tap()}
function closeGame(){$("#gameFrame").src="about:blank";$("#gameModal").classList.remove("show");document.body.style.overflow=""}
function reloadGame(){$("#gameFrame").src=$("#gameFrame").src;tap()}
async function fullscreenGame(){try{await $("#gameFrame").requestFullscreen()}catch{toast("Fullscreen is unavailable","err")}}
function scrollGames(){$("#gamesSection").scrollIntoView({behavior:"smooth"})}
function goHome(e){if(e)e.preventDefault();window.scrollTo({top:0,behavior:"smooth"})}
function showHistory(){$("#historySection").scrollIntoView({behavior:"smooth"})}
function showFavorites(){category="All";search="";sort="fav";$("#searchInput").value="";renderChips();renderGames();scrollGames()}
function clearHistory(){history=[];save("gx_history",history);stats();renderHistory();toast("History cleared","ok")}
function clearSearch(){$("#searchInput").value="";search="";renderGames()}
function resetFilters(){category="All";search="";sort="default";$("#searchInput").value="";renderChips();renderGames()}
function cycleSort(){sort=sort==="default"?"az":sort==="az"?"fav":"default";renderGames();toast(sort==="default"?"Default order":sort==="az"?"A–Z order":"Favorites first")}
function toggleSidebar(){$("#sidebar").classList.toggle("active");$("#overlay").classList.toggle("show",$("#sidebar").classList.contains("active"))}
function closeSidebar(){$("#sidebar").classList.remove("active");$("#overlay").classList.remove("show")}
function closeModals(){document.querySelectorAll(".modal.show").forEach(x=>x.classList.remove("show"));document.body.style.overflow=""}
function openSettings(){syncSettings();$("#settingsModal").classList.add("show")}
function closeSettings(){$("#settingsModal").classList.remove("show")}
function openInfo(){$("#infoModal").classList.add("show")}
function closeInfo(){$("#infoModal").classList.remove("show")}
function openFeedback(){$("#feedbackModal").classList.add("show")}
function closeFeedback(){$("#feedbackModal").classList.remove("show")}
function openReport(){$("#bugGame").innerHTML=GAMES.map(g=>`<option>${esc(g[1])}</option>`).join("");$("#reportModal").classList.add("show")}
function closeReport(){$("#reportModal").classList.remove("show")}
function shareBot(){let url="https://t.me/gamendbot";if(navigator.share)navigator.share({title:"GAMEND X",text:"Play games on GAMEND X",url}).catch(()=>{});else navigator.clipboard?.writeText(url).then(()=>toast("Bot link copied","ok"))}
function setMode(v){localStorage.setItem("gx_mode",v);applyPrefs();tap()}function setMotion(v){save("gx_motion",v);document.body.classList.toggle("reduced-motion",!v);syncSettings()}function setHaptic(v){save("gx_haptic",v);syncSettings();tap()}
function cycleTheme(){let n=(+localStorage.getItem("gx_theme")||0);n=(n+1)%themes.length;localStorage.setItem("gx_theme",n);applyPrefs();toast(themes[n],"ok")}
function renderThemeRadios(){let n=+localStorage.getItem("gx_theme")||0;$("#themeRadios").innerHTML=themes.map((t,i)=>`<label><input type="radio" name="theme" value="${i}" ${i===n?"checked":""} onchange="setTheme(${i})"><span>${t}</span></label>`).join("")}
function setTheme(n){localStorage.setItem("gx_theme",n);applyPrefs();tap()}
function applyPrefs(){let n=+localStorage.getItem("gx_theme")||0;document.body.dataset.theme=n;document.body.classList.toggle("light",localStorage.getItem("gx_mode")==="light");document.body.classList.toggle("reduced-motion",!load("gx_motion",true));syncSettings()}
function syncSettings(){renderThemeRadios();let n=+localStorage.getItem("gx_theme")||0,mode=localStorage.getItem("gx_mode")||"dark";$("#themeText").textContent=themes[n];document.querySelector(`input[name="mode"][value="${mode}"]`).checked=true;document.querySelector(`input[name="motion"][value="${load("gx_motion",true)?"on":"off"}"]`).checked=true;document.querySelector(`input[name="haptic"][value="${load("gx_haptic",true)?"on":"off"}"]`).checked=true;stats()}
function resetLocal(){if(!confirm("Reset favorites, history and settings?"))return;["gx_favs","gx_history","gx_mode","gx_theme","gx_motion","gx_haptic"].forEach(k=>localStorage.removeItem(k));favs=[];history=[];applyPrefs();renderGames();renderHistory();toast("Local data reset","ok")}
function submitFeedback(e){e.preventDefault();let msg=`GAMEND X FEEDBACK\nType: ${$("#fbType").value}\nName: ${$("#fbName").value||"Anonymous"}\n\n${$("#fbText").value}`;navigator.clipboard?.writeText(msg);closeFeedback();toast("Feedback copied. Send it to the GAMEND team.","ok");e.target.reset()}
function submitReport(e){e.preventDefault();let msg=`BUG_REPORT:${$("#bugGame").value}\n${$("#bugText").value}`;window.open("https://t.me/MozhiHub/54?comment="+encodeURIComponent(msg),"_blank");closeReport();toast("Bug report opened","ok");e.target.reset()}
function navHome(b){document.querySelectorAll(".bottom-nav button").forEach(x=>x.classList.remove("active"));b.classList.add("active");goHome()}function navGames(b){document.querySelectorAll(".bottom-nav button").forEach(x=>x.classList.remove("active"));b.classList.add("active");scrollGames()}function navChat(b){document.querySelectorAll(".bottom-nav button").forEach(x=>x.classList.remove("active"));b.classList.add("active");openCommunity()}function navFav(b){document.querySelectorAll(".bottom-nav button").forEach(x=>x.classList.remove("active"));b.classList.add("active");showFavorites()}function navSettings(b){document.querySelectorAll(".bottom-nav button").forEach(x=>x.classList.remove("active"));b.classList.add("active");openSettings()}

async function firebaseLoad(){
  if(fb)return true;
  try{
    const app=await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js");
    const db=await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js");
    const auth=await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js");
    const analytics=await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js");

    const a=app.getApps().length?app.getApps()[0]:app.initializeApp(FIREBASE_CONFIG);

    // Analytics is optional: it can fail in restricted WebViews without breaking the app.
    let analyticsInstance=null;
    try{
      if(analytics.isSupported && await analytics.isSupported()){
        analyticsInstance=analytics.getAnalytics(a);
      }
    }catch(e){console.warn("Firebase Analytics unavailable in this WebView.",e)}

    fb={...db,...auth,analytics,analyticsInstance,app:a};
    return true;
  }catch(e){
    console.warn("Firebase unavailable; normal site continues.",e);
    return false;
  }
}
function guest(){return load("gx_guest",null)}
async function openCommunity(){closeSidebar();$("#communityModal").classList.add("show");let g=guest();if(!g){$("#guestGate").classList.remove("hidden");$("#chatArea").classList.add("hidden");return}$("#guestGate").classList.add("hidden");$("#chatArea").classList.remove("hidden");startChat(g)}
function closeCommunity(){stopCommunity();$("#communityModal").classList.remove("show")}
async function joinCommunity(){let name=$("#guestName").value.trim(),u=$("#guestUsername").value.trim();if(name.length<2||!/^@?[A-Za-z0-9_]{3,20}$/.test(u)){$("#communityError").textContent="Enter a valid name and username.";return}if(!(await firebaseLoad())){$("#communityError").textContent="Community is temporarily unavailable. Normal games still work.";return}try{let auth=fb.getAuth(fb.app),c=auth.currentUser||(await fb.signInAnonymously(auth)).user;u=u.startsWith("@")?u:"@"+u;save("gx_guest",{name,username:u,uid:c.uid});await openCommunity()}catch(e){console.error(e);$("#communityError").textContent="Firebase Authentication is unavailable."}}
async function startChat(g){if(!(await firebaseLoad()))return;try{let auth=fb.getAuth(fb.app),c=auth.currentUser||(await fb.signInAnonymously(auth));g.uid=c.user.uid;save("gx_guest",g);stopCommunity();let db=fb.getDatabase(fb.app),mq=fb.query(fb.ref(db,"community/messages"),fb.orderByChild("createdAt"),fb.limitToLast(80));msgUnsub=fb.onValue(mq,s=>{let a=[];s.forEach(x=>a.push(x.val()));renderMessages(a,g)});let pr=fb.ref(db,"community/presence");presUnsub=fb.onValue(pr,s=>{let n=0;s.forEach(x=>{if(x.val()?.online)n++});$("#viewerCount").textContent=n});let me=fb.ref(db,"community/presence/"+g.uid);await fb.set(me,{name:g.name,username:g.username,online:true,lastSeen:fb.serverTimestamp()});fb.onDisconnect(me).update({online:false,lastSeen:fb.serverTimestamp()})}catch(e){console.warn("Community error",e)}}
function stopCommunity(){if(msgUnsub){try{msgUnsub()}catch{}msgUnsub=null}if(presUnsub){try{presUnsub()}catch{}presUnsub=null}}
function renderMessages(a,g){$("#messages").innerHTML=a.map(m=>`<div class="msg ${m.uid===g.uid?"me":""}"><b>${esc(m.name)} ${esc(m.username||"")}</b><div class="bubble">${esc(m.text||"")}</div><small>${new Date(m.createdAt||Date.now()).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}</small></div>`).join("");$("#messages").scrollTop=$("#messages").scrollHeight}
async function sendMessage(){let i=$("#chatInput"),t=i.value.trim(),g=guest();if(!t||!g||!(await firebaseLoad()))return;try{let db=fb.getDatabase(fb.app);await fb.push(fb.ref(db,"community/messages"),{uid:g.uid,name:g.name,username:g.username,text:t.slice(0,500),createdAt:fb.serverTimestamp()});i.value="";tap()}catch{toast("Message failed","err")}}
function leaveCommunity(){stopCommunity();localStorage.removeItem("gx_guest");$("#guestGate").classList.remove("hidden");$("#chatArea").classList.add("hidden");toast("Guest profile removed")}
function init(){applyPrefs();renderChips();renderGames();renderHistory();$("#searchInput").addEventListener("input",e=>{search=e.target.value.trim();renderGames()});$("#chatInput").addEventListener("keydown",e=>{if(e.key==="Enter")sendMessage()});if(window.Telegram?.WebApp){Telegram.WebApp.ready();Telegram.WebApp.expand()}$("#loaderText").textContent="Ready";setTimeout(()=>$("#loader").classList.add("loader-hide"),550)}
document.addEventListener("DOMContentLoaded",init);window.addEventListener("keydown",e=>{if(e.key==="Escape"){closeModals();closeSidebar()}});Object.assign(window,{toggleSidebar,closeSidebar,goHome,scrollGames,showFavorites,showHistory,openCommunity,openSettings,closeSettings,openFeedback,closeFeedback,openReport,closeReport,openInfo,closeInfo,shareBot,playGame,closeGame,reloadGame,fullscreenGame,setCategory,toggleFav,clearHistory,clearSearch,resetFilters,cycleSort,cycleTheme,setTheme,setMode,setMotion,setHaptic,resetLocal,submitFeedback,submitReport,sendMessage,joinCommunity,closeCommunity,leaveCommunity,navHome,navGames,navChat,navFav,navSettings});