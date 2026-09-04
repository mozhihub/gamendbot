/* =========================================================
   GAMEND X — ULTRA PRO GAME HUB
   Firebase:
   Community + Viewer Presence + Total Visits
   ========================================================= */


/* ================= FIREBASE CONFIG ================= */

const FIREBASE_CONFIG = {
    apiKey: "AIzaSyCaALqxdtEPCNxg5XPPG81T9853gOPO4qY",
    authDomain: "server-41203.firebaseapp.com",
    databaseURL: "https://server-41203-default-rtdb.firebaseio.com",
    projectId: "server-41203",
    storageBucket: "server-41203.firebasestorage.app",
    messagingSenderId: "26278139327",
    appId: "1:26278139327:web:db44a7e2d8d42d690abd0a"
};


/* ================= WEB3FORMS ================= */

const WEB3FORMS_KEY =
    "5e51a205-46d1-4db6-916f-0703efb327ab";


/* ================= GAMES ================= */

const GAMES = [
    {
        id: "mad-drive",
        title: "Mad Drive",
        category: "Racing",
        url: "https://mozhihub.github.io/mad_drive/",
        image: "etc/drive.jpg"
    },

    {
        id: "knife-hit",
        title: "Knife Hit",
        category: "Arcade",
        url: "https://mozhihub.github.io/Knife/",
        image: "etc/knife.jpg"
    },

    {
        id: "shooting-bot",
        title: "Shooting Bot",
        category: "Arcade",
        url: "https://mozhihub.github.io/Shooting-bot/",
        image: "etc/shooter.jpg"
    },

    {
        id: "hexa-master",
        title: "Hexa Master",
        category: "Puzzle",
        url: "https://mozhihub.github.io/Hexa/",
        image: "etc/hexa.jpg"
    },

    {
        id: "paint",
        title: "Paint",
        category: "Creative",
        url: "https://mozhihub.github.io/Paint/",
        image: "etc/paint.jpg"
    },

    {
        id: "earth",
        title: "Earth",
        category: "Creative",
        url: "https://mozhihub.github.io/Earth-/",
        image: "etc/earth.jpg"
    },

    {
        id: "zoom",
        title: "ZOOM",
        category: "Creative",
        url: "https://mozhihub.github.io/Zoom/",
        image: "etc/zoom.jpg"
    },

    {
        id: "neon-shooter",
        title: "Neon Shooter",
        category: "Arcade",
        url: "https://mozhihub.github.io/Neon-shooter/",
        image: "etc/neon.jpg"
    },

    {
        id: "xox-online",
        title: "XOX Online",
        category: "Arcade",
        url: "https://mozhihub.github.io/Xoxo-online/",
        image: "etc/xox.jpg"
    },

    {
        id: "insto",
        title: "Insto",
        category: "Social",
        url: "https://mozhihub.github.io/insto/",
        image: "etc/insto.jpg"
    },

    {
        id: "cube",
        title: "Rubik's Cube",
        category: "Puzzle",
        url: "https://mozhihub.github.io/Cube/",
        image: "etc/cube.jpg"
    },

    {
        id: "word-scramble",
        title: "Word Scramble",
        category: "Puzzle",
        url: "https://mozhihub.github.io/wordScramble/",
        image: "etc/word.jpg"
    },

    {
        id: "tetris",
        title: "Tetris",
        category: "Puzzle",
        url: "https://mozhihub.github.io/Tetris/",
        image: "etc/tetris.jpg"
    },

    {
        id: "build-house",
        title: "Build House",
        category: "Creative",
        url: "https://mozhihub.github.io/Build-House/",
        image: "etc/build.jpg"
    },

    {
        id: "centipede",
        title: "Centipede",
        category: "Creative",
        url: "https://mozhihub.github.io/Centipede/",
        image: "etc/cent.jpg"
    },

    {
        id: "love-calculator",
        title: "Love Calculator",
        category: "Fun",
        url: "https://mozhihub.github.io/Love-Calculator/",
        image: "etc/love.jpg"
    },

    {
        id: "neon-vanguard",
        title: "Neon Vanguard",
        category: "Arcade",
        url: "https://mozhihub.github.io/Neon-shooter/neon.html",
        image: "etc/vanguard.jpg"
    }
];


/* ================= STATE ================= */

let fb = null;

let presRef = null;
let presUnsub = null;
let presStop = null;

let visitUnsub = null;

let currentGame = null;

let state = {
    category:"All",
    search:"",
    sort:"Latest",
    favorites:load("gx_favs",[]),
    history:load("gx_history",[])
};


/* ================= HELPERS ================= */

const $ = selector => document.querySelector(selector);

function load(key, fallback){

    try{

        const value = localStorage.getItem(key);

        return value === null
            ? fallback
            : JSON.parse(value);

    }catch{

        return fallback;

    }

}


function save(key,value){

    try{
        localStorage.setItem(key,JSON.stringify(value));
    }catch{}

}


function toast(message,success=true){

    const el = $("#toast");

    if(!el)return;

    const icon = el.querySelector("i");
    const text = el.querySelector("span");

    text.textContent = message;

    icon.className = success
        ? "fas fa-circle-check"
        : "fas fa-circle-exclamation";

    el.classList.add("show");

    clearTimeout(toast.timer);

    toast.timer = setTimeout(()=>{
        el.classList.remove("show");
    },2600);

}


/* =========================================================
   FIREBASE
   ========================================================= */

async function firebaseLoad(){

    if(fb)return fb;

    try{

        const app =
            await import(
                "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js"
            );

        const db =
            await import(
                "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js"
            );

        const auth =
            await import(
                "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js"
            );

        const firebaseApp =
            app.getApps().length
                ? app.getApps()[0]
                : app.initializeApp(FIREBASE_CONFIG);

        fb = {
            ...app,
            ...db,
            ...auth,
            app:firebaseApp
        };

        return fb;

    }catch(error){

        console.error("Firebase load failed:",error);

        return null;

    }

}


/* ================= AUTH ================= */

async function ensureAuth(){

    const f = await firebaseLoad();

    if(!f)return null;

    try{

        const auth = f.getAuth(f.app);

        if(auth.currentUser){
            return auth.currentUser;
        }

        const result =
            await f.signInAnonymously(auth);

        return result.user;

    }catch(error){

        console.error("Anonymous auth failed:",error);

        return null;

    }

}


/* =========================================================
   VIEWER / PRESENCE
   ========================================================= */

async function startPresence(){

    const user = await ensureAuth();

    if(!user)return;

    try{

        const f = await firebaseLoad();

        const db = f.getDatabase(f.app);

        presRef =
            f.ref(
                db,
                "community/presence/" + user.uid
            );


        await f.set(
            presRef,
            {
                online:true,
                lastSeen:f.serverTimestamp()
            }
        );


        const disconnect =
            f.onDisconnect(presRef);

        await disconnect.update({
            online:false,
            lastSeen:f.serverTimestamp()
        });


        presStop = () => {

            try{

                f.update(
                    presRef,
                    {
                        online:false,
                        lastSeen:f.serverTimestamp()
                    }
                );

            }catch{}

        };


        const presenceRef =
            f.ref(
                db,
                "community/presence"
            );


        if(presUnsub){
            presUnsub();
        }


        presUnsub =
            f.onValue(
                presenceRef,
                snapshot => {

                    let count = 0;

                    snapshot.forEach(child => {

                        const data = child.val();

                        if(data && data.online === true){
                            count++;
                        }

                    });


                    const viewer =
                        $("#viewerCount");

                    if(viewer){
                        viewer.textContent =
                            count.toLocaleString("en-IN");
                    }

                }
            );

    }catch(error){

        console.error(
            "Presence unavailable:",
            error
        );

    }

}


/* =========================================================
   VISIT COUNTER
   ========================================================= */

/*
   Firebase path:

   community/stats/visits

   Behaviour:

   1. Every new browser session = 1 visit.
   2. Refresh in same session = no extra count.
   3. Total value stays permanently in Firebase.
   4. Counter is read even if current session was
      already counted.
   5. All users can see the latest total.
*/

async function countVisit(){

    const visitElement =
        $("#visitCount");

    const user =
        await ensureAuth();

    if(!user){

        if(visitElement){
            visitElement.textContent = "—";
        }

        return;

    }


    try{

        const f = await firebaseLoad();

        const db =
            f.getDatabase(f.app);


        const visitRef =
            f.ref(
                db,
                "community/stats/visits"
            );


        /*
           Count only once per browser session.
        */

        const alreadyCounted =
            sessionStorage.getItem(
                "gx_visit_counted"
            ) === "1";


        if(!alreadyCounted){

            const transaction =
                await f.runTransaction(
                    visitRef,
                    currentValue => {

                        const current =
                            Number(currentValue) || 0;

                        return current + 1;

                    }
                );


            if(transaction.committed){

                sessionStorage.setItem(
                    "gx_visit_counted",
                    "1"
                );

            }

        }


        /*
           Always read the total.

           This fixes the issue where returning
           users could otherwise see "—".
        */

        if(visitUnsub){
            visitUnsub();
        }


        visitUnsub =
            f.onValue(
                visitRef,
                snapshot => {

                    const total =
                        Number(snapshot.val()) || 0;

                    if(visitElement){

                        visitElement.textContent =
                            total.toLocaleString("en-IN");

                    }

                },
                error => {

                    console.error(
                        "Visit listener error:",
                        error
                    );

                }
            );


    }catch(error){

        console.error(
            "Visit counter error:",
            error
        );

        /*
           Do not destroy the UI.
           Keep previous value if available.
        */

        if(
            visitElement &&
            (
                !visitElement.textContent ||
                visitElement.textContent === "—"
            )
        ){
            visitElement.textContent = "—";
        }

    }

}


/* =========================================================
   CATEGORY
   ========================================================= */

function renderChips(){

    const box =
        $("#categoryChips");

    if(!box)return;


    const categories = [
        "All",
        ...new Set(
            GAMES.map(game => game.category)
        )
    ];


    box.innerHTML =
        categories.map(category => `

            <button
                class="category-chip ${
                    state.category === category
                        ? "active"
                        : ""
                }"
                onclick="setCategory('${escapeAttr(category)}')">

                ${escapeHtml(category)}

            </button>

        `).join("");

}


function setCategory(category){

    state.category = category;

    renderChips();
    renderGames();

    haptic();

}


/* =========================================================
   FILTER
   ========================================================= */

function filtered(){

    let list = [...GAMES];


    if(state.category !== "All"){

        list =
            list.filter(
                game =>
                    game.category === state.category
            );

    }


    if(state.search.trim()){

        const query =
            state.search
                .trim()
                .toLowerCase();


        list =
            list.filter(game =>

                game.title
                    .toLowerCase()
                    .includes(query)

                ||

                game.category
                    .toLowerCase()
                    .includes(query)

            );

    }


    if(state.sort === "A-Z"){

        list.sort(
            (a,b) =>
                a.title.localeCompare(b.title)
        );

    }

    else if(state.sort === "Z-A"){

        list.sort(
            (a,b) =>
                b.title.localeCompare(a.title)
        );

    }

    else if(state.sort === "Favorites"){

        list.sort(
            (a,b) =>
                Number(
                    state.favorites.includes(b.id)
                )
                -
                Number(
                    state.favorites.includes(a.id)
                )
        );

    }


    return list;

}


/* =========================================================
   GAMES RENDER
   ========================================================= */

function renderGames(){

    const grid =
        $("#gameGrid");

    const empty =
        $("#emptyState");

    if(!grid)return;


    const list = filtered();


    if(!list.length){

        grid.innerHTML = "";

        if(empty){
            empty.classList.remove("hidden");
        }

        return;

    }


    if(empty){
        empty.classList.add("hidden");
    }


    grid.innerHTML =
        list.map(game => {

            const favorite =
                state.favorites.includes(game.id);


            return `

                <article class="game-card">

                    <div class="game-image">

                        <img
                            src="${escapeAttr(game.image)}"
                            alt="${escapeAttr(game.title)}"
                            loading="lazy"
                            onerror="this.src='https://dummyimage.com/800x500/15171c/ffffff&text=${encodeURIComponent(game.title)}'"
                        >

                    </div>


                    <div class="game-info">

                        <h3>
                            ${escapeHtml(game.title)}
                        </h3>

                        <div class="game-category">
                            ${escapeHtml(game.category)}
                        </div>


                        <div class="game-actions">

                            <button
                                class="play-btn"
                                onclick="playGame('${escapeAttr(game.id)}')">

                                <i class="fas fa-play"></i>
                                Play

                            </button>


                            <button
                                class="fav-btn ${
                                    favorite ? "active" : ""
                                }"
                                onclick="toggleFav('${escapeAttr(game.id)}')">

                                <i class="${
                                    favorite
                                        ? "fas"
                                        : "far"
                                } fa-heart"></i>

                            </button>

                        </div>

                    </div>

                </article>

            `;

        }).join("");


    stats();

}


/* =========================================================
   HISTORY
   ========================================================= */

function renderHistory(){

    const box =
        $("#historyGrid");

    if(!box)return;


    const items =
        state.history
            .map(id =>
                GAMES.find(game => game.id === id)
            )
            .filter(Boolean)
            .slice(0,10);


    if(!items.length){

        box.innerHTML = `
            <div class="empty-state"
                 style="grid-column:1/-1;padding:35px 15px">

                <div class="empty-icon">
                    <i class="fas fa-clock"></i>
                </div>

                <h3>No Recently Played Games</h3>

                <p>Start playing a game to see it here.</p>

            </div>
        `;

        return;

    }


    box.innerHTML =
        items.map(game => `

            <button
                class="history-card"
                onclick="playGame('${escapeAttr(game.id)}')">

                <img
                    src="${escapeAttr(game.image)}"
                    alt="${escapeAttr(game.title)}"
                    onerror="this.src='https://dummyimage.com/200x150/15171c/ffffff&text=GX'"
                >

                <span>
                    <strong>
                        ${escapeHtml(game.title)}
                    </strong>

                    <small>
                        ${escapeHtml(game.category)}
                    </small>
                </span>

            </button>

        `).join("");

}


/* =========================================================
   STATS
   ========================================================= */

function stats(){

    const gameCount =
        $("#gameCount");

    const favCount =
        $("#favCount");

    const historyCount =
        $("#historyCount");


    if(gameCount){
        gameCount.textContent =
            GAMES.length;
    }

    if(favCount){
        favCount.textContent =
            state.favorites.length;
    }

    if(historyCount){
        historyCount.textContent =
            state.history.length;
    }

}


/* =========================================================
   FAVORITES
   ========================================================= */

function toggleFav(id){

    const index =
        state.favorites.indexOf(id);


    if(index >= 0){

        state.favorites.splice(index,1);

        toast("Removed from Favorites");

    }else{

        state.favorites.push(id);

        toast("Added to Favorites");

    }


    save(
        "gx_favs",
        state.favorites
    );


    renderGames();
    stats();

    haptic();

}


function showFavorites(){

    state.category = "All";
    state.search = "";

    const favoriteGames =
        GAMES.filter(game =>
            state.favorites.includes(game.id)
        );


    $("#gamesSection")
        ?.scrollIntoView({
            behavior:"smooth"
        });


    if(!favoriteGames.length){

        toast("No favorite games yet");

        return;

    }


    const grid =
        $("#gameGrid");

    const empty =
        $("#emptyState");


    if(empty){
        empty.classList.add("hidden");
    }


    grid.innerHTML =
        favoriteGames.map(game => `

            <article class="game-card">

                <div class="game-image">

                    <img
                        src="${escapeAttr(game.image)}"
                        alt="${escapeAttr(game.title)}"
                        onerror="this.src='https://dummyimage.com/800x500/15171c/ffffff&text=${encodeURIComponent(game.title)}'"
                    >

                </div>

                <div class="game-info">

                    <h3>
                        ${escapeHtml(game.title)}
                    </h3>

                    <div class="game-category">
                        ${escapeHtml(game.category)}
                    </div>

                    <div class="game-actions">

                        <button
                            class="play-btn"
                            onclick="playGame('${escapeAttr(game.id)}')">

                            <i class="fas fa-play"></i>
                            Play

                        </button>

                        <button
                            class="fav-btn active"
                            onclick="toggleFav('${escapeAttr(game.id)}')">

                            <i class="fas fa-heart"></i>

                        </button>

                    </div>

                </div>

            </article>

        `).join("");

}


/* =========================================================
   HISTORY
   ========================================================= */

function addHistory(id){

    state.history =
        state.history.filter(
            item => item !== id
        );

    state.history.unshift(id);

    state.history =
        state.history.slice(0,30);


    save(
        "gx_history",
        state.history
    );


    renderHistory();
    stats();

}


function showHistory(){

    $("#recentSection")
        ?.scrollIntoView({
            behavior:"smooth"
        });

}


function clearHistory(){

    state.history = [];

    save(
        "gx_history",
        []
    );

    renderHistory();
    stats();

    toast("History cleared");

}


/* =========================================================
   SEARCH
   ========================================================= */

function clearSearch(){

    state.search = "";

    const input =
        $("#gameSearch");

    if(input){
        input.value = "";
    }

    $("#clearSearch")
        ?.classList.remove("show");

    renderGames();

}


function resetFilters(){

    state.category = "All";
    state.search = "";
    state.sort = "Latest";

    const input =
        $("#gameSearch");

    if(input){
        input.value = "";
    }

    renderChips();
    renderGames();

    const sortText =
        $("#sortText");

    if(sortText){
        sortText.textContent = "Latest";
    }

}


function cycleSort(){

    const sorts = [
        "Latest",
        "A-Z",
        "Z-A",
        "Favorites"
    ];

    const index =
        sorts.indexOf(state.sort);

    state.sort =
        sorts[
            (index + 1) % sorts.length
        ];


    const text =
        $("#sortText");

    if(text){
        text.textContent =
            state.sort;
    }


    renderGames();

}


/* =========================================================
   GAME PLAYER
   ========================================================= */

function playGame(id){

    const game =
        GAMES.find(
            item => item.id === id
        );

    if(!game)return;


    currentGame = game;

    addHistory(game.id);


    const modal =
        $("#gameModal");

    const frame =
        $("#gameFrame");

    const title =
        $("#gameModalTitle");


    if(title){
        title.textContent =
            game.title;
    }


    setGameLoading(true);


    frame.src =
        game.url;


    modal.classList.add("show");

    document.body.style.overflow = "hidden";

    haptic();

}


function closeGame(){

    const modal =
        $("#gameModal");

    const frame =
        $("#gameFrame");


    modal.classList.remove("show","immersive");
    document.body.classList.remove("game-immersive");

    try{
        if(document.fullscreenElement){
            document.exitFullscreen?.();
        }
    }catch{}

    document.body.style.overflow = "";


    setTimeout(()=>{

        if(frame){
            frame.src = "about:blank";
        }

    },250);


    currentGame = null;

}


function reloadGame(){

    if(!currentGame)return;

    setGameLoading(true);

    const frame =
        $("#gameFrame");

    frame.src =
        currentGame.url;

}


function setGameLoading(value){

    const loading =
        $("#gameLoading");

    if(!loading)return;

    loading.classList.toggle(
        "hide",
        !value
    );

}


async function fullscreenGame(){

    const modal =
        $("#gameModal");

    const box =
        modal?.querySelector(".game-modal-box");

    const frame =
        $("#gameFrame");

    if(!modal || !box || !frame)return;

    haptic();

    /* Telegram Mini App: expand the WebApp first. */
    try{
        if(window.Telegram?.WebApp){
            window.Telegram.WebApp.ready?.();
            window.Telegram.WebApp.expand?.();
        }
    }catch{}

    /* Native fullscreen: use the parent box, not the iframe.
       This works more reliably in Telegram/WebView browsers. */
    try{
        if(document.fullscreenElement){
            await document.exitFullscreen?.();
            return;
        }

        if(box.requestFullscreen){
            await box.requestFullscreen({navigationUI:"hide"});
            return;
        }

        if(box.webkitRequestFullscreen){
            box.webkitRequestFullscreen();
            return;
        }
    }catch(error){
        console.warn("Fullscreen API unavailable:",error);
    }

    /* WebView fallback: true visual fullscreen without API support. */
    modal.classList.toggle("immersive");
    document.body.classList.toggle("game-immersive", modal.classList.contains("immersive"));
}


function openGameExternal(){

    if(!currentGame)return;

    window.open(
        currentGame.url,
        "_blank",
        "noopener,noreferrer"
    );

}


/* =========================================================
   NAVIGATION
   ========================================================= */

function goHome(){

    window.scrollTo({
        top:0,
        behavior:"smooth"
    });

    closeSidebar();

}


function scrollGames(){

    $("#gamesSection")
        ?.scrollIntoView({
            behavior:"smooth"
        });

    closeSidebar();

}


function openCommunity(){

    window.location.href =
        "community.html";

}


/* =========================================================
   SIDEBAR
   ========================================================= */

function toggleSidebar(){
    const sidebar = $("#sidebar");
    const overlay = $("#sidebarOverlay");
    if(!sidebar || !overlay) return;
    const willOpen = !sidebar.classList.contains("open");
    sidebar.classList.toggle("open", willOpen);
    overlay.classList.toggle("show", willOpen);
    overlay.setAttribute("aria-hidden", String(!willOpen));
    document.body.classList.toggle("sidebar-lock", willOpen);
    overlay.style.pointerEvents = willOpen ? "auto" : "none";
    haptic();
}

function closeSidebar(event){
    if(event){
        event.preventDefault?.();
        event.stopPropagation?.();
    }
    const sidebar = $("#sidebar");
    const overlay = $("#sidebarOverlay");
    if(!sidebar || !overlay) return;
    sidebar.classList.remove("open");
    overlay.classList.remove("show");
    overlay.setAttribute("aria-hidden","true");
    document.body.classList.remove("sidebar-lock");
    overlay.style.pointerEvents="none";
    haptic();
}

function bindSidebarControls(){
    const close = $("#sidebarCloseBtn");
    const overlay = $("#sidebarOverlay");
    if(close && !close.dataset.gxBound){
        close.dataset.gxBound="1";
        const handler=e=>closeSidebar(e);
        close.addEventListener("pointerdown",handler,{capture:true,passive:false});
        close.addEventListener("touchstart",handler,{capture:true,passive:false});
        close.addEventListener("click",handler,{capture:true,passive:false});
    }
    if(overlay && !overlay.dataset.gxBound){
        overlay.dataset.gxBound="1";
        const handler=e=>closeSidebar(e);
        overlay.addEventListener("pointerdown",handler,{capture:true,passive:false});
        overlay.addEventListener("click",handler,{capture:true,passive:false});
    }
}


/* =========================================================
   SHARE
   ========================================================= */

async function shareHub(){

    const url = window.location.href;
    const title = "GAMEND X";
    const text = "Play More. Stay Legendary. — GAMEND X";

    try{
        if(navigator.share){
            await navigator.share({title,text,url});
            haptic();
            return;
        }
    }catch(error){
        if(error?.name === "AbortError") return;
    }

    /* Browser fallback: offer real app share targets instead of
       silently copying the URL. */
    openShareSheet({title,text,url});
}

function openShareSheet({title,text,url}){

    const old = document.getElementById("gxShareSheet");
    old?.remove();

    const enc = encodeURIComponent;
    const targets = [
        ["WhatsApp","https://wa.me/?text="+enc(text+"\n"+url),"fa-whatsapp"],
        ["Telegram","https://t.me/share/url?url="+enc(url)+"&text="+enc(text),"fa-telegram"],
        ["Facebook","https://www.facebook.com/sharer/sharer.php?u="+enc(url),"fa-facebook"],
        ["X","https://twitter.com/intent/tweet?text="+enc(text)+"&url="+enc(url),"fa-x-twitter"]
    ];

    const sheet=document.createElement("div");
    sheet.id="gxShareSheet";
    sheet.className="gx-share-sheet";
    sheet.innerHTML=`<div class="gx-share-backdrop"></div>
      <div class="gx-share-panel">
        <div class="gx-share-head"><div><b>Share GAMEND X</b><small>Choose an app</small></div>
          <button class="icon-btn gx-share-close" aria-label="Close"><i class="fas fa-xmark"></i></button></div>
        <div class="gx-share-grid">${targets.map(([name,href,icon])=>
          `<a href="${href}" target="_blank" rel="noopener noreferrer"><i class="fa-brands ${icon}"></i><span>${name}</span></a>`
        ).join("")}</div>
      </div>`;
    document.body.appendChild(sheet);
    const close=()=>sheet.remove();
    sheet.querySelector(".gx-share-backdrop").onclick=close;
    sheet.querySelector(".gx-share-close").onclick=close;
    haptic();
}


/* =========================================================
   SETTINGS
   ========================================================= */

const THEMES = [
    {
        id:"red",
        name:"Red",
        color:"#d50000"
    },
    {
        id:"blue",
        name:"Blue",
        color:"#2563eb"
    },
    {
        id:"green",
        name:"Green",
        color:"#16a34a"
    },
    {
        id:"purple",
        name:"Purple",
        color:"#7c3aed"
    },
    {
        id:"orange",
        name:"Orange",
        color:"#ea580c"
    },
    {
        id:"pink",
        name:"Pink",
        color:"#db2777"
    }
];


function applyPrefs(){

    const mode =
        localStorage.getItem("gx_mode") || "auto";

    const motion =
        localStorage.getItem("gx_motion") !== "off";

    const hapticEnabled =
        localStorage.getItem("gx_haptic") !== "off";

    const theme =
        localStorage.getItem("gx_theme") || "red";


    applyMode(mode);

    document.body.classList.toggle(
        "no-motion",
        !motion
    );


    const themeColor = getThemeColor(theme);
    document.documentElement.style.setProperty("--primary", themeColor);
    document.documentElement.style.setProperty("--primary2", getThemeColor2(theme));


    const modeBtn =
        $("#modeBtn");

    const motionBtn =
        $("#motionBtn");

    const hapticBtn =
        $("#hapticBtn");


    if(modeBtn){
        modeBtn.textContent =
            mode === "auto"
                ? "Auto"
                : mode === "dark"
                    ? "Dark"
                    : "Light";
    }


    if(motionBtn){
        motionBtn.textContent =
            motion ? "On" : "Off";
    }


    if(hapticBtn){
        hapticBtn.textContent =
            hapticEnabled ? "On" : "Off";
    }


    renderThemeRadios();

}


function applyMode(mode){

    if(mode === "dark"){

        document.body.classList.add("dark");

    }

    else if(mode === "light"){

        document.body.classList.remove("dark");

    }

    else{

        const dark =
            window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;

        document.body.classList.toggle(
            "dark",
            dark
        );

    }

}


function cycleTheme(){

    const modes = [
        "auto",
        "light",
        "dark"
    ];

    const current =
        localStorage.getItem("gx_mode") || "auto";

    const index =
        modes.indexOf(current);

    const next =
        modes[
            (index + 1) % modes.length
        ];


    localStorage.setItem(
        "gx_mode",
        next
    );


    applyMode(next);

    applyPrefs();

}


function setMotion(){

    const current =
        localStorage.getItem("gx_motion") !== "off";


    localStorage.setItem(
        "gx_motion",
        current ? "off" : "on"
    );


    applyPrefs();

}


function setHaptic(){

    const current =
        localStorage.getItem("gx_haptic") !== "off";


    localStorage.setItem(
        "gx_haptic",
        current ? "off" : "on"
    );


    applyPrefs();

}


function haptic(){

    const enabled =
        localStorage.getItem("gx_haptic") !== "off";

    if(
        enabled &&
        navigator.vibrate
    ){

        navigator.vibrate(8);

    }

}


function setTheme(theme){

    localStorage.setItem(
        "gx_theme",
        theme
    );


    document.documentElement.style.setProperty(
        "--primary",
        getThemeColor(theme)
    );
    document.documentElement.style.setProperty(
        "--primary2",
        getThemeColor2(theme)
    );

    haptic();
    renderThemeRadios();

}


function getThemeColor(theme){

    return (
        THEMES.find(
            item => item.id === theme
        )?.color
        ||
        "#d50000"
    );

}

function getThemeColor2(theme){
    const map={
        red:"#ff3030",
        blue:"#4f8cff",
        green:"#22c55e",
        purple:"#9f67ff",
        orange:"#ff8a3d",
        pink:"#f35ca7"
    };
    return map[theme] || "#ff3030";
}

window.addEventListener("storage",event=>{
    if(event.key==="gx_theme" || event.key==="gx_mode" || event.key==="gx_motion"){
        applyPrefs();
    }
});


function renderThemeRadios(){

    const box =
        $("#themeRadios");

    if(!box)return;


    const active =
        localStorage.getItem("gx_theme")
        ||
        "red";


    box.innerHTML =
        THEMES.map(theme => `

            <button
                class="theme-option ${
                    active === theme.id
                        ? "active"
                        : ""
                }"
                onclick="setTheme('${theme.id}')">

                ${escapeHtml(theme.name)}

            </button>

        `).join("");

}


/* =========================================================
   MODALS
   ========================================================= */

function openSettings(){
    const modal=$("#settingsModal");
    if(!modal)return;
    modal.classList.add("show");
    modal.setAttribute("aria-hidden","false");
    document.body.classList.add("modal-lock");
    applyPrefs();
    haptic();
}

function closeSettings(event){
    event?.preventDefault?.();
    event?.stopPropagation?.();
    const modal=$("#settingsModal");
    if(!modal)return;
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden","true");
    if(!$(".modal.show")) document.body.classList.remove("modal-lock");
    haptic();
}


function openInfo(){

    closeSettings();

    $("#infoModal")
        ?.classList.add("show");

}


function closeInfo(){

    $("#infoModal")
        ?.classList.remove("show");

}


function openFeedback(){

    closeSettings();

    $("#feedbackModal")
        ?.classList.add("show");

}


function closeFeedback(){

    $("#feedbackModal")
        ?.classList.remove("show");

}


function openReport(){

    closeSettings();

    $("#reportModal")
        ?.classList.add("show");

}


function closeReport(){

    $("#reportModal")
        ?.classList.remove("show");

}


/* =========================================================
   RESET
   ========================================================= */

function resetLocal(){

    if(
        !confirm(
            "Reset favorites, history and local settings?"
        )
    ){
        return;
    }


    localStorage.removeItem("gx_favs");
    localStorage.removeItem("gx_history");
    localStorage.removeItem("gx_mode");
    localStorage.removeItem("gx_motion");
    localStorage.removeItem("gx_haptic");
    localStorage.removeItem("gx_theme");


    state.favorites = [];
    state.history = [];


    applyPrefs();
    renderGames();
    renderHistory();
    stats();


    toast("Local data reset");

}


/* =========================================================
   WEB3FORMS
   ========================================================= */

async function web3Submit(form){

    const data =
        new FormData(form);


    data.append(
        "from_name",
        "GAMEND X"
    );


    try{

        const response =
            await fetch(
                "https://api.web3forms.com/submit",
                {
                    method:"POST",
                    body:data
                }
            );


        const result =
            await response.json();


        return result.success === true;

    }catch(error){

        console.error(
            "Web3Forms error:",
            error
        );

        return false;

    }

}


async function submitFeedback(event){

    event.preventDefault();


    const form =
        event.currentTarget;

    const button =
        form.querySelector("button[type=submit]");


    button.disabled = true;

    button.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Sending...';


    const success =
        await web3Submit(form);


    button.disabled = false;

    button.innerHTML =
        '<i class="fas fa-paper-plane"></i> Send Feedback';


    if(success){

        form.reset();

        closeFeedback();

        toast("Feedback sent successfully");

    }else{

        toast(
            "Unable to send feedback",
            false
        );

    }

}


async function submitReport(event){

    event.preventDefault();


    const form =
        event.currentTarget;

    const button =
        form.querySelector("button[type=submit]");


    button.disabled = true;

    button.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Sending...';


    const success =
        await web3Submit(form);


    button.disabled = false;

    button.innerHTML =
        '<i class="fas fa-bug"></i> Submit Report';


    if(success){

        form.reset();

        closeReport();

        toast("Bug report submitted");

    }else{

        toast(
            "Unable to submit report",
            false
        );

    }

}


/* =========================================================
   ESCAPE
   ========================================================= */

function escapeHtml(value){

    return String(value)
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;")
        .replaceAll('"',"&quot;")
        .replaceAll("'","&#039;");

}


function escapeAttr(value){

    return escapeHtml(value);

}


/* =========================================================
   INIT
   ========================================================= */

async function init(){

    applyPrefs();

    renderChips();

    renderGames();

    renderHistory();

    stats();


    /* ================= SEARCH ================= */

    const search =
        $("#gameSearch");


    if(search){

        search.addEventListener(
            "input",
            event => {

                state.search =
                    event.target.value;


                const clear =
                    $("#clearSearch");


                if(clear){

                    clear.classList.toggle(
                        "show",
                        Boolean(state.search)
                    );

                }


                renderGames();

            }
        );

    }


    /* ================= GAME IFRAME ================= */

    const frame =
        $("#gameFrame");


    if(frame){

        frame.addEventListener(
            "load",
            () => {

                setTimeout(
                    () => setGameLoading(false),
                    250
                );

            }
        );

    }


    bindSidebarControls();

    const settingsClose=$("#settingsCloseBtn");
    if(settingsClose && !settingsClose.dataset.gxBound){
        settingsClose.dataset.gxBound="1";
        const handler=e=>closeSettings(e);
        settingsClose.addEventListener("pointerdown",handler,{capture:true,passive:false});
        settingsClose.addEventListener("touchstart",handler,{capture:true,passive:false});
        settingsClose.addEventListener("click",handler,{capture:true,passive:false});
    }

    /* ================= MODAL CLICK ================= */

    document
        .querySelectorAll(".modal")
        .forEach(modal => {

            modal.addEventListener(
                "click",
                event => {

                    if(
                        event.target === modal
                    ){

                        modal.classList.remove("show");

                        if(
                            modal.id === "gameModal"
                        ){
                            closeGame();
                        }

                    }

                }
            );

        });


    /* ================= ESC ================= */

    document.addEventListener(
        "keydown",
        event => {

            if(event.key !== "Escape"){
                return;
            }

            closeSidebar();
            closeSettings();
            closeInfo();
            closeFeedback();
            closeReport();
            closeGame();

        }
    );


    /* ================= TELEGRAM ================= */

    try{

        if(window.Telegram?.WebApp){

            Telegram.WebApp.ready();

            Telegram.WebApp.expand();

        }

    }catch{}


    /* =====================================================
       FIREBASE

       Viewer count + persistent Visits
       ===================================================== */

    startPresence();

    countVisit();


    /* ================= LOADER ================= */

    setTimeout(()=>{

        $("#loader")
            ?.classList.add("hide");

    },800);

}


/* =========================================================
   CLEANUP
   ========================================================= */

window.addEventListener(
    "pagehide",
    () => {

        try{

            if(presStop){
                presStop();
            }

        }catch{}

    }
);


/* =========================================================
   SYSTEM THEME CHANGE
   ========================================================= */

window
    .matchMedia(
        "(prefers-color-scheme: dark)"
    )
    .addEventListener(
        "change",
        () => {

            const mode =
                localStorage.getItem("gx_mode")
                ||
                "auto";


            if(mode === "auto"){
                applyMode("auto");
            }

        }
    );


/* =========================================================
   GLOBAL FUNCTIONS
   ========================================================= */

Object.assign(
    window,
    {

        toggleSidebar,
        closeSidebar,

        goHome,
        scrollGames,

        openCommunity,
        shareHub,

        setCategory,
        toggleFav,
        showFavorites,
        showHistory,

        clearHistory,
        clearSearch,
        resetFilters,
        cycleSort,

        playGame,
        closeGame,
        reloadGame,
        fullscreenGame,
        openGameExternal,

        openSettings,
        closeSettings,

        openInfo,
        closeInfo,

        openFeedback,
        closeFeedback,

        openReport,
        closeReport,

        setTheme,
        setMotion,
        setHaptic,
        cycleTheme,

        submitFeedback,
        submitReport,

        resetLocal

    }
);


/* ================= START ================= */

init();
