const YOOMONEY_WALLET = "4100119563495432";

const SUBSCRIPTIONS = {
    pissing: { name: "ПИСАЮЩИЙ", price: 1, color: "#FFEB3B", icon: "💧" },
    basic: { name: "БАЗОВАЯ", price: 10, color: "#4CAF50", icon: "🎬" },
    lux: { name: "ЛЮКС", price: 25, color: "#9C27B0", icon: "💎" },
    pro: { name: "САМЫЙ КРУТОЙ", price: 50, color: "#FFD700", icon: "👑" },
    rapport: { name: "РАППОРТ", price: 159, color: "#00BCD4", icon: "🛡️" }
};

const ADMIN_EMAIL = "ivansabaev04@gmail.com";
const ADMIN_PASSWORD = "ivansupersigma";

const TOTAL_EPISODES = 50;
const VIDEO_URLS = {};
for (let i = 1; i <= TOTAL_EPISODES; i++) {
    VIDEO_URLS[i] = `https://github.com/ivansabaev04-svg/theded-videos/releases/download/v1/${i}.mp4`;
}

const SERIAL_POSTER = "https://github.com/ivansabaev04-svg/theded-videos/releases/download/v1/poster.png";

const SERIALS = [
    { id:"the-ded", name:"ПАЦАНЫ: СТАРЫЕ ГЕРОИ", icon:"📁", totalEps:TOTAL_EPISODES, subOnly:false, earlyEps:[47,48,49,50], poster:SERIAL_POSTER }
];

const AVATARS = ['👴','🧓','👨‍🦳','👩‍🦳','🦸','🦹','💀','👹','🤖','👽','🎃','😎','🥷','🧟','🦇','🐺','🔥','⚡','❄️','🌙','☠️','🎭','👑','💎'];
const VANYA_AVATARS = ['🦄','🐉','👁️','🧙‍♂️','🦹‍♀️','🎩','🃏','🗿','🛸','⚔️','🏆','🌟','💫','🔮','⚜️','🦅','🐺','🦁','🐯','🦊'];

const FREE_EMOJIS = ['😀','😂','🙂','😊','👍','❤️','🔥','💯'];
const PAID_EMOJIS = ['🥰','😎','🤩','🤔','😈','🥺','😭','💀','👻','🎃','🤖','👽','🥳','🤯','😱','🥶','🤡','💩','🍆','🍑','💦','🍷','🎉','✨','⭐','💫','💥','💢','💨','🌈','🦄','🐉','🐺','🦁','🦊','🐻','🦝','🐰','🦋','🌸','🌹','🍀','🍔','🍕','🍰','🍩','☕','🍺','🎮','🎵','🎬','📸','💎','👑','🛡️','⚔️','🏆','🎯','🎲','🃏','🤝','👊','✊','🙏','💪'];

const CURRENCIES = [
    {code:'RUB',symbol:'₽',name:'РУБЛИ'},
    {code:'USD',symbol:'$',name:'ДОЛЛАРЫ'},
    {code:'EUR',symbol:'€',name:'ЕВРО'},
    {code:'KZT',symbol:'₸',name:'ТЕНГЕ'}
];

const THEMES = [
    { id:'default', name:'КРАСНАЯ', color:'#e50914', bg:'#0a0a0a' },
    { id:'auto', name:'🌙☀️ АВТО', color:'#2196F3', bg:'#1a1a2e' },
    { id:'blue', name:'СИНЯЯ', color:'#2196F3', bg:'#0a1929' },
    { id:'green', name:'ЗЕЛЁНАЯ', color:'#4CAF50', bg:'#0a1a0a' },
    { id:'purple', name:'ФИОЛЕТ', color:'#9C27B0', bg:'#1a0a1a' },
    { id:'orange', name:'ОРАНЖ', color:'#FF9800', bg:'#1a0f00' },
    { id:'pink', name:'РОЗОВАЯ', color:'#E91E63', bg:'#1a0a14' },
    { id:'light', name:'СВЕТЛАЯ', color:'#d32f2f', bg:'#f5f5f5' }
];

const NICK_COLORS = [
    { id:'default', name:'СТАНДАРТ', color:'#ffffff', requires:null },
    { id:'green', name:'ЗЕЛЁНЫЙ', color:'#4CAF50', requires:'basic' },
    { id:'blue', name:'СИНИЙ', color:'#2196F3', requires:'basic' },
    { id:'orange', name:'ОРАНЖ', color:'#FF9800', requires:'basic' },
    { id:'purple', name:'ФИОЛЕТ', color:'#9C27B0', requires:'lux' },
    { id:'pink', name:'РОЗОВЫЙ', color:'#E91E63', requires:'lux' },
    { id:'cyan', name:'БИРЮЗА', color:'#00BCD4', requires:'lux' },
    { id:'gold', name:'ЗОЛОТО', color:'#FFD700', requires:'pro' },
    { id:'rainbow', name:'РАДУГА', color:'rainbow', requires:'pro' },
    { id:'red-glow', name:'КРАСНЫЙ', color:'#e50914', requires:'rapport' }
];

let currentUser=null, currentSerial=null, currentEpIndex=0, currentEpList=[];
let firebaseReady=false;
let allUsers={}, allComments=[], allTickets=[], allMessages={}, allGroups={}, allFollows={};
let currentChatId=null;
let currentChatUser=null;
let currentChatType='private'; // 'private' или 'group'
let selectedGroupMembers=[];

window.addEventListener('firebaseReady',()=>{firebaseReady=true;initApp();});
setTimeout(()=>{if(!firebaseReady){alert('Firebase не загрузился!');}},5000);

async function fbReadOnce(path){if(!firebaseReady)return null;try{const snap=await window.fbGet(window.fbRef(window.fbDb,path));return snap.exists()?snap.val():null;}catch(e){console.error(e);return null;}}
async function fbWrite(path,data){if(!firebaseReady)return false;try{await window.fbSet(window.fbRef(window.fbDb,path),data);return true;}catch(e){console.error(e);return false;}}
async function fbUpdatePath(path,data){if(!firebaseReady)return false;try{await window.fbUpdate(window.fbRef(window.fbDb,path),data);return true;}catch(e){console.error(e);return false;}}
async function fbRemovePath(path){if(!firebaseReady)return false;try{await window.fbRemove(window.fbRef(window.fbDb,path));return true;}catch(e){console.error(e);return false;}}
function fbListen(path,callback){if(!firebaseReady)return;window.fbOnValue(window.fbRef(window.fbDb,path),(snap)=>callback(snap.exists()?snap.val():null));}

function emailToKey(email){return email.replace(/[.#$\/\[\]]/g,'_');}

async function initApp(){
    const adminKey=emailToKey(ADMIN_EMAIL);
    const adminData=await fbReadOnce(`users/${adminKey}`);
    if(!adminData){
        await fbWrite(`users/${adminKey}`,{email:ADMIN_EMAIL,password:ADMIN_PASSWORD,name:"Иван (Админ)",avatar:"👑",avatarImg:"",bio:"Создатель THE DED",wallet:{RUB:0,USD:0,EUR:0,KZT:0},currency:"RUB",subscription:"pro",isAdmin:true,banned:false,theme:"default",tempSubUntil:0,nickColor:"gold",extraFollowers:0});
    }

    fbListen('users',(data)=>{
        allUsers=data||{};
        if(currentUser){
            const fresh=allUsers[emailToKey(currentUser.email)];
            if(fresh){
                currentUser=fresh;
                if(typeof updateAvatarDisplay==='function')updateAvatarDisplay();
                if(typeof updateWalletDisplay==='function')updateWalletDisplay();
                if(typeof updateSubDisplay==='function')updateSubDisplay();
                if(typeof updateUserNameDisplay==='function')updateUserNameDisplay();
                if(currentUser.isAdmin)document.getElementById('btn-admin').style.display='inline-block';
            }
            if(typeof updateFollowCounts==='function')updateFollowCounts();
        }
        if(typeof renderAdminUsers==='function' && document.getElementById('admin-overlay').classList.contains('show'))renderAdminUsers();
        if(typeof fillBoostFollowersSelect==='function')fillBoostFollowersSelect();
    });

    fbListen('comments',(data)=>{
        allComments=data?Object.entries(data).map(([id,c])=>({...c,id})):[];
        if(typeof renderComments==='function')renderComments();
        if(typeof renderAdminComments==='function' && document.getElementById('admin-overlay').classList.contains('show'))renderAdminComments();
    });

    fbListen('tickets',(data)=>{
        allTickets=data?Object.entries(data).map(([id,t])=>({...t,id})):[];
        if(typeof renderMyTickets==='function')renderMyTickets();
        if(typeof renderAdminTickets==='function' && document.getElementById('admin-overlay').classList.contains('show'))renderAdminTickets();
        if(typeof updateTicketsBadge==='function')updateTicketsBadge();
    });

    fbListen('messages',(data)=>{
        allMessages=data||{};
        if(typeof renderChatsList==='function')renderChatsList();
        if(currentChatId && typeof renderChat==='function')renderChat();
        if(typeof updateMessagesBadge==='function')updateMessagesBadge();
    });

    fbListen('groups',(data)=>{
        allGroups=data||{};
        if(typeof renderChatsList==='function')renderChatsList();
    });

    fbListen('follows',(data)=>{
        allFollows=data||{};
        if(typeof updateFollowCounts==='function')updateFollowCounts();
    });

    setTimeout(()=>{
        const ls=document.getElementById('loading-screen');
        if(ls)ls.classList.add('hidden');
        checkSession();
        renderFolders();
    },1000);
}

function setCookie(n,v,d){const dt=new Date();dt.setTime(dt.getTime()+d*86400000);document.cookie=`${n}=${encodeURIComponent(JSON.stringify(v))};expires=${dt.toUTCString()};path=/;SameSite=Lax`;}
function getCookie(n){for(let c of document.cookie.split(';')){c=c.trim();if(c.startsWith(n+'=')){try{return JSON.parse(decodeURIComponent(c.substring(n.length+1)));}catch{return null;}}}return null;}
function deleteCookie(n){document.cookie=`${n}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;}

async function getUserByEmail(email){return allUsers[emailToKey(email)]||null;}
async function saveCurrentUserToFirebase(){if(!currentUser)return;await fbWrite(`users/${emailToKey(currentUser.email)}`,currentUser);}
function getUsers(){return Object.values(allUsers);}
function updateCurrentUser(){saveCurrentUserToFirebase();}

function hasActiveSubscription(){if(!currentUser)return false;if(currentUser.subscription && currentUser.subscription !== false)return true;if(currentUser.tempSubUntil&&currentUser.tempSubUntil>Date.now())return true;return false;}

function getUserSubLevel(){
    if(!currentUser)return null;
    if(currentUser.tempSubUntil && currentUser.tempSubUntil > Date.now())return 'basic';
    if(currentUser.subscription === 'rapport')return 'rapport';
    if(currentUser.subscription === 'pro')return 'pro';
    if(currentUser.subscription === 'lux')return 'lux';
    if(currentUser.subscription === 'basic' || currentUser.subscription === true)return 'basic';
    if(currentUser.subscription === 'pissing')return 'pissing';
    return null;
}

function canUseAllEmojis(){const level=getUserSubLevel();return level==='pissing' || level==='basic' || level==='lux' || level==='pro' || level==='rapport';}
function canUseVanyaAvatars(){const l=getUserSubLevel();return l==='lux'||l==='pro'||l==='rapport';}
function hasGlowingNick(){const l=getUserSubLevel();return l==='pro'||l==='rapport';}
function isModerator(){if(!currentUser)return false;if(currentUser.isAdmin)return true;return currentUser.subscription==='rapport';}

function canUseNickColor(colorId){const col=NICK_COLORS.find(c=>c.id===colorId);if(!col || !col.requires)return true;const level=getUserSubLevel();const levels={pissing:0, basic:1, lux:2, pro:3, rapport:3};const required=levels[col.requires]||0;const userLevel=levels[level]||0;return userLevel >= required;}
function selectNickColor(colorId){if(!canUseNickColor(colorId)){alert('🔒 Доступно только подписчикам "'+NICK_COLORS.find(c=>c.id===colorId).requires.toUpperCase()+'"!');return;}currentUser.nickColor=colorId;saveCurrentUserToFirebase();updateAvatarDisplay();updateUserNameDisplay();renderNickColors();}
function renderNickColors(){const grid=document.getElementById('nick-colors-grid');if(!grid)return;grid.innerHTML='';const active=currentUser?.nickColor||'default';NICK_COLORS.forEach(c=>{const div=document.createElement('div');const canUse=canUseNickColor(c.id);div.className='nick-color-option'+(active===c.id?' selected':'')+(!canUse?' nick-color-locked':'');if(c.color==='rainbow'){div.style.background='linear-gradient(135deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)';div.style.color='white';}else{div.style.color=c.color;div.style.textShadow=`0 0 10px ${c.color}`;}div.textContent=c.name;div.onclick=()=>selectNickColor(c.id);grid.appendChild(div);});}

async function buySubscriptionType(type){if(!currentUser)return;const sub=SUBSCRIPTIONS[type];if(!sub)return;const bal=currentUser.wallet.RUB||0;if(bal<sub.price){alert(`Недостаточно! Нужно ${sub.price} ₽, есть ${bal.toFixed(2)} ₽`);return;}let warn='';if(type==='rapport')warn='\n⚠️ РАППОРТ даёт права модератора!';if(confirm(`Купить "${sub.name}" за ${sub.price} ₽?${warn}`)){currentUser.wallet.RUB=bal-sub.price;currentUser.subscription=type;await saveCurrentUserToFirebase();updateWalletDisplay();updateSubDisplay();renderFolders();renderNickColors();alert(`🎉 "${sub.name}" активирована!`);}}

// ============ ПОДПИСКИ НА ПОЛЬЗОВАТЕЛЕЙ ============
async function followUser(targetEmail){
    if(!currentUser)return;
    if(targetEmail===currentUser.email){alert('Нельзя подписаться на себя!');return;}
    const myKey=emailToKey(currentUser.email);
    const targetKey=emailToKey(targetEmail);

    const myFollows=allFollows[myKey]||{following:{},followers:{}};
    const targetFollows=allFollows[targetKey]||{following:{},followers:{}};

    if(myFollows.following && myFollows.following[targetKey]){
        // Уже подписан — отписываемся
        await fbRemovePath(`follows/${myKey}/following/${targetKey}`);
        await fbRemovePath(`follows/${targetKey}/followers/${myKey}`);
    }else{
        // Подписываемся
        await fbWrite(`follows/${myKey}/following/${targetKey}`,true);
        await fbWrite(`follows/${targetKey}/followers/${myKey}`,true);
    }
}

function getFollowersCount(email){
    const key=emailToKey(email);
    const f=allFollows[key];
    const real=f && f.followers ? Object.keys(f.followers).length : 0;
    const user=allUsers[key];
    const extra=user && user.extraFollowers ? user.extraFollowers : 0;
    return real + extra;
}

function getFollowingCount(email){
    const key=emailToKey(email);
    const f=allFollows[key];
    return f && f.following ? Object.keys(f.following).length : 0;
}

function isFollowing(targetEmail){
    if(!currentUser)return false;
    const myKey=emailToKey(currentUser.email);
    const targetKey=emailToKey(targetEmail);
    const f=allFollows[myKey];
    return f && f.following && f.following[targetKey];
}

function updateFollowCounts(){
    if(!currentUser)return;
    const fc=document.getElementById('my-followers-count');
    const fg=document.getElementById('my-following-count');
    if(fc)fc.textContent=getFollowersCount(currentUser.email);
    if(fg)fg.textContent=getFollowingCount(currentUser.email);
}

function showFollowers(email){
    const key=emailToKey(email);
    const f=allFollows[key];
    if(!f || !f.followers){alert('Нет подписчиков');return;}
    const followers=Object.keys(f.followers).map(k=>allUsers[k]).filter(u=>u);
    showUserList('Подписчики',followers);
}

function showFollowing(email){
    const key=emailToKey(email);
    const f=allFollows[key];
    if(!f || !f.following){alert('Нет подписок');return;}
    const following=Object.keys(f.following).map(k=>allUsers[k]).filter(u=>u);
    showUserList('Подписки',following);
}

function showUserList(title,users){
    const modal=document.getElementById('user-search-modal');
    document.querySelector('.user-search-title').textContent=title;
    document.getElementById('user-search-input').style.display='none';
    const results=document.getElementById('user-search-results');
    results.innerHTML='';
    if(!users.length){results.innerHTML='<p style="color:#555;text-align:center;padding:20px;">Пусто</p>';}
    else{
        users.forEach(u=>{
            const div=document.createElement('div');
            div.className='search-user-item';
            const av=u.avatarImg?`<img src="${u.avatarImg}">`:(u.avatar||'👤');
            div.innerHTML=`<div class="search-user-avatar">${av}</div><div class="search-user-info"><div class="search-user-name">${u.name}</div><div class="search-user-email">${u.email}</div></div>`;
            div.onclick=()=>{closeUserSearch();openUserProfile(u.email);};
            results.appendChild(div);
        });
    }
    modal.classList.add('show');
}

// ============ ПРОФИЛЬ ДРУГОГО ПОЛЬЗОВАТЕЛЯ ============
function openUserProfile(email){
    const user=allUsers[emailToKey(email)];
    if(!user)return;
    const isMe=user.email===currentUser.email;
    const following=isFollowing(user.email);
    const av=user.avatarImg?`<img src="${user.avatarImg}" style="width:100%;height:100%;object-fit:cover;">`:(user.avatar||'👤');

    let badge='';
    if(user.isAdmin)badge='<span class="badge-admin">🔧 АДМИН</span>';
    else if(user.subscription==='rapport')badge='<span class="badge-rapport">🛡️ RAPPORT</span>';
    else if(user.subscription==='pro')badge='<span class="badge-pro">👑 PRO</span>';
    else if(user.subscription==='lux')badge='<span class="badge-lux">💎 LUX</span>';
    else if(user.subscription==='basic'||user.subscription===true)badge='<span class="badge-basic">🎬 BASIC</span>';
    else if(user.subscription==='pissing')badge='<span class="badge-pissing">💧 ПИСАЮЩИЙ</span>';

    let nickStyle='';
    if(user.nickColor && user.nickColor!=='default'){
        const col=NICK_COLORS.find(c=>c.id===user.nickColor);
        if(col){
            if(col.color==='rainbow'){nickStyle=`background:linear-gradient(135deg,#ff0000,#ff7f00,#ffff00,#00ff00,#0000ff,#4b0082,#9400d3);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;font-weight:700;`;}
            else{nickStyle=`color:${col.color};text-shadow:0 0 15px ${col.color};font-weight:700;`;}
        }
    }

    document.getElementById('user-profile-body').innerHTML=`
        <div style="width:120px;height:120px;border-radius:50%;margin:0 auto 15px;border:3px solid var(--red);display:flex;align-items:center;justify-content:center;font-size:4rem;background:#111;overflow:hidden;">${av}</div>
        <h2 style="font-family:'Bebas Neue';font-size:2rem;letter-spacing:3px;margin-bottom:5px;${nickStyle}">${user.name}</h2>
        <p style="color:#666;margin-bottom:10px;">${user.email}</p>
        <div style="margin:10px 0;">${badge}</div>
        <p style="color:#999;font-style:italic;margin:15px 0;">${user.bio||'Нет описания'}</p>
        <div class="profile-stats">
            <div class="profile-stat" onclick="showFollowers('${user.email}')">
                <div class="profile-stat-number">${getFollowersCount(user.email)}</div>
                <div class="profile-stat-label">ПОДПИСЧИКИ</div>
            </div>
            <div class="profile-stat" onclick="showFollowing('${user.email}')">
                <div class="profile-stat-number">${getFollowingCount(user.email)}</div>
                <div class="profile-stat-label">ПОДПИСКИ</div>
            </div>
        </div>
        ${!isMe?`
            <button class="follow-btn ${following?'following':''}" onclick="followUser('${user.email}');setTimeout(()=>openUserProfile('${user.email}'),300);">
                ${following?'✓ ВЫ ПОДПИСАНЫ':'➕ ПОДПИСАТЬСЯ'}
            </button>
            <br>
            <button class="follow-btn" style="background:var(--blue);" onclick="closeUserProfile();startChatWith('${user.email}');">💬 НАПИСАТЬ</button>
        `:''}
    `;
    document.getElementById('user-profile-modal').classList.add('show');
}

function closeUserProfile(){document.getElementById('user-profile-modal').classList.remove('show');}

// ============ ПОИСК ПОЛЬЗОВАТЕЛЕЙ ============
function openUserSearch(){
    document.querySelector('.user-search-title').textContent='🔍 ПОИСК ПОЛЬЗОВАТЕЛЯ';
    document.getElementById('user-search-input').style.display='block';
    document.getElementById('user-search-input').value='';
    document.getElementById('user-search-results').innerHTML='';
    document.getElementById('user-search-modal').classList.add('show');
    setTimeout(()=>document.getElementById('user-search-input').focus(),100);
}

function closeUserSearch(){document.getElementById('user-search-modal').classList.remove('show');}

function searchUsers(){
    const query=document.getElementById('user-search-input').value.trim().toLowerCase();
    const results=document.getElementById('user-search-results');
    if(!query){results.innerHTML='';return;}
    const matched=Object.values(allUsers).filter(u=>u.name && u.name.toLowerCase().includes(query) && u.email!==currentUser.email);
    if(!matched.length){results.innerHTML='<p style="color:#555;text-align:center;padding:20px;">Не найдено</p>';return;}
    results.innerHTML='';
    matched.slice(0,20).forEach(u=>{
        const div=document.createElement('div');
        div.className='search-user-item';
        const av=u.avatarImg?`<img src="${u.avatarImg}">`:(u.avatar||'👤');
        div.innerHTML=`<div class="search-user-avatar">${av}</div><div class="search-user-info"><div class="search-user-name">${u.name}</div><div class="search-user-email">${u.email}</div></div>`;
        div.onclick=()=>{closeUserSearch();startChatWith(u.email);};
        results.appendChild(div);
    });
}

async function startChatWith(targetEmail){
    const target=await getUserByEmail(targetEmail);
    if(!target){alert('Пользователь не найден!');return;}
    showPage('messages');
    currentChatType='private';
    currentChatId=getChatId(currentUser.email,targetEmail);
    currentChatUser=target;
    openChat(currentChatId,target);
}

// Новый чат теперь открывает поиск
function newChat(){openUserSearch();}
// ============ ПРОСМОТРЫ ============
let cachedViews={};
function setupViewsListener(){if(firebaseReady){fbListen('views',(data)=>{cachedViews=data||{};});}else{setTimeout(setupViewsListener,500);}}
setupViewsListener();
async function addView(serialId,epNum){const path=`views/${serialId}_${epNum}`;const current=await fbReadOnce(path)||0;const newCount=current+1;await fbWrite(path,newCount);return newCount;}
function getViewCount(s,e){return cachedViews[`${s}_${e}`]||0;}

// ============ ЛАЙКИ ============
let cachedLikes={};
function setupLikesListener(){if(firebaseReady){fbListen('likes',(data)=>{cachedLikes=data||{};});}else{setTimeout(setupLikesListener,500);}}
setupLikesListener();
async function toggleLike(){if(!currentUser||!currentSerial)return;const key=`${currentSerial.id}_${currentEpList[currentEpIndex].number}`;const path=`likes/${key}`;let arr=await fbReadOnce(path)||[];if(typeof arr==='number')arr=[];const idx=arr.indexOf(currentUser.email);if(idx===-1)arr.push(currentUser.email);else arr.splice(idx,1);await fbWrite(path,arr);updateLikeDisplay();}
function getLikeCount(s,e){const arr=cachedLikes[`${s}_${e}`];if(!arr)return 0;if(typeof arr==='number')return arr;return arr.length;}
function isLiked(s,e){if(!currentUser)return false;const arr=cachedLikes[`${s}_${e}`];if(!arr||typeof arr==='number')return false;return arr.includes(currentUser.email);}
function updateLikeDisplay(){if(!currentSerial||!currentEpList[currentEpIndex])return;const ep=currentEpList[currentEpIndex];const c=getLikeCount(currentSerial.id,ep.number);const l=isLiked(currentSerial.id,ep.number);const btn=document.getElementById('like-btn');btn.className='video-action-btn'+(l?' liked':'');btn.innerHTML=`${l?'❤️':'🤍'} <span id="like-count">${c}</span>`;}

// ============ РЕЙТИНГИ ============
let cachedRatings={};
function setupRatingsListener(){if(firebaseReady){fbListen('ratings',(data)=>{cachedRatings=data||{};});}else{setTimeout(setupRatingsListener,500);}}
setupRatingsListener();
async function rateEpisode(stars){if(!currentUser){alert('Войди!');return;}if(!currentSerial||!currentEpList[currentEpIndex])return;const key=`${currentSerial.id}_${currentEpList[currentEpIndex].number}`;const path=`ratings/${key}/${emailToKey(currentUser.email)}`;await fbWrite(path,stars);renderStars();}
function getEpisodeRating(s,e){const k=`${s}_${e}`;const r=cachedRatings[k];if(!r)return {avg:0,count:0,my:0};const v=Object.values(r);const avg=v.reduce((a,b)=>a+b,0)/v.length;const my=currentUser?r[emailToKey(currentUser.email)]||0:0;return {avg:avg.toFixed(1),count:v.length,my};}
function renderStars(){if(!currentSerial||!currentEpList[currentEpIndex])return;const ep=currentEpList[currentEpIndex];const data=getEpisodeRating(currentSerial.id,ep.number);const container=document.getElementById('stars-container');container.innerHTML='';for(let i=1;i<=5;i++){const star=document.createElement('span');star.className='star'+(i<=data.my?' filled':'');star.textContent='⭐';star.onmouseenter=()=>highlightStars(i);star.onmouseleave=()=>highlightStars(data.my);star.onclick=()=>rateEpisode(i);container.appendChild(star);}document.getElementById('avg-rating').textContent=data.count>0?data.avg+' / 5':'—';document.getElementById('rating-count').textContent=`(${data.count} оценок)`;const msg=document.getElementById('stars-msg');if(data.my>0){msg.innerHTML=`Ты поставил <span class="my-rating">${data.my} звёзд</span> ✨`;}else{msg.textContent='Поставь оценку от 1 до 5 звёзд';}}
function highlightStars(count){const stars=document.querySelectorAll('#stars-container .star');stars.forEach((s,i)=>{if(i<count)s.classList.add('filled');else s.classList.remove('filled');});}

// ============ БЛОКИРОВКА СЕРИЙ ============
let cachedBlockedEps=[];
function setupBlockedListener(){if(firebaseReady){fbListen('blockedEpisodes',(data)=>{cachedBlockedEps=data||[];if(currentSerial)openSerial(currentSerial);});}else{setTimeout(setupBlockedListener,500);}}
setupBlockedListener();
function isEpisodeBlocked(epNum){return cachedBlockedEps.includes(epNum);}
async function toggleEpisodeBlock(epNum){let blocked=[...cachedBlockedEps];if(blocked.includes(epNum)){blocked=blocked.filter(e=>e!==epNum);}else{blocked.push(epNum);}await fbWrite('blockedEpisodes',blocked);renderAdminEpisodes();}

// ============ ТЕМЫ ============
function applyTheme(themeId){
    document.body.className='';
    if(themeId === 'auto'){
        // Авто режим — проверяем время
        checkAutoTheme();
    } else if(themeId && themeId !== 'default'){
        document.body.classList.add('theme-' + themeId);
    }
    if(currentUser){
        currentUser.theme = themeId;
        saveCurrentUserToFirebase();
    }
    renderThemes();
}
function renderThemes(){const grid=document.getElementById('themes-grid');if(!grid)return;grid.innerHTML='';const active=currentUser?.theme||'default';THEMES.forEach(t=>{const div=document.createElement('div');div.className='theme-option'+(active===t.id?' selected':'');div.innerHTML=`<div class="theme-preview" style="background:linear-gradient(135deg,${t.color},${t.bg});"></div><div class="theme-name">${t.name}</div>`;div.onclick=()=>applyTheme(t.id);grid.appendChild(div);});}
function loadUserTheme(){
    if(currentUser && currentUser.theme){
        applyTheme(currentUser.theme);
        // Если авто-тема — запускаем таймер проверки
        if(currentUser.theme === 'auto'){
            checkAutoTheme();
        }
    }
}
// ============ ПРОМОКОДЫ ============
let cachedPromos=[];
function setupPromosListener(){if(firebaseReady){fbListen('promos',(data)=>{cachedPromos=data?Object.entries(data).map(([id,p])=>({...p,id})):[];if(typeof renderAdminPromos==='function' && document.getElementById('admin-overlay').classList.contains('show'))renderAdminPromos();});fbReadOnce('promos').then(d=>{if(!d){fbPushPromo({code:'КРУТОЙВАНЯ',subType:'basic',minutes:5,maxUses:1,uses:0,usedBy:[],createdAt:new Date().toLocaleString('ru-RU'),isTemp:true});}});}else{setTimeout(setupPromosListener,500);}}
setupPromosListener();
async function fbPushPromo(promo){const newRef=window.fbPush(window.fbRef(window.fbDb,'promos'));await window.fbSet(newRef,promo);}

async function applyPromo(){
    if(!currentUser){alert('Войди!');return;}
    const code=document.getElementById('promo-input').value.trim().toUpperCase();
    const msg=document.getElementById('promo-msg');
    if(!code){msg.className='promo-msg error';msg.textContent='❌ Введи код!';return;}
    const promo=cachedPromos.find(p=>p.code===code);
    if(!promo){msg.className='promo-msg error';msg.textContent='❌ Не найден';return;}
    if(promo.uses>=promo.maxUses){msg.className='promo-msg error';msg.textContent='❌ Больше не действует';return;}
    if(promo.usedBy && promo.usedBy.includes(currentUser.email)){msg.className='promo-msg error';msg.textContent='❌ Уже использовал';return;}
    const newUsedBy=[...(promo.usedBy||[]),currentUser.email];
    await fbUpdatePath(`promos/${promo.id}`,{uses:promo.uses+1,usedBy:newUsedBy});
    if(promo.isTemp){
        currentUser.tempSubUntil=Date.now()+promo.minutes*60*1000;
        await saveCurrentUserToFirebase();
        msg.className='promo-msg success';
        msg.textContent=`✅ BASIC подписка на ${promo.minutes} мин!`;
        startPromoTimer();
    }else{
        currentUser.subscription=promo.subType;
        await saveCurrentUserToFirebase();
        const subName=SUBSCRIPTIONS[promo.subType]?.name||promo.subType.toUpperCase();
        msg.className='promo-msg success';
        msg.textContent=`✅ Подписка "${subName}" активирована!`;
    }
    document.getElementById('promo-input').value='';
    updateSubDisplay();renderFolders();renderNickColors();
}

function startPromoTimer(){const timer=document.getElementById('promo-timer');const timeEl=document.getElementById('promo-timer-time');function update(){if(!currentUser||!currentUser.tempSubUntil){timer.classList.remove('show');return;}const remain=currentUser.tempSubUntil-Date.now();if(remain<=0){currentUser.tempSubUntil=0;saveCurrentUserToFirebase();timer.classList.remove('show');updateSubDisplay();renderFolders();alert('⏰ Подписка закончилась!');return;}const m=Math.floor(remain/60000);const s=Math.floor((remain%60000)/1000);timeEl.textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;timer.classList.add('show');setTimeout(update,1000);}update();}

// ============ ОБРАЩЕНИЯ ============
async function submitTicket(){if(!currentUser){alert('Войди!');return;}if(currentUser.banned){alert('Заблокирован!');return;}const topic=document.getElementById('ticket-topic').value;const message=document.getElementById('ticket-message').value.trim();if(!message){alert('Напиши!');return;}if(message.length<10){alert('Минимум 10 символов');return;}const ticket={email:currentUser.email,name:currentUser.name,avatar:currentUser.avatar||'👤',avatarImg:currentUser.avatarImg||'',topic,message,date:new Date().toLocaleString('ru-RU'),status:'new',answer:'',answerDate:'',timestamp:Date.now()};const newRef=window.fbPush(window.fbRef(window.fbDb,'tickets'));await window.fbSet(newRef,ticket);document.getElementById('ticket-message').value='';alert('✅ Отправлено!');}
function renderMyTickets(){if(!currentUser)return;const list=document.getElementById('my-tickets-list');if(!list)return;const tickets=allTickets.filter(t=>t.email===currentUser.email).sort((a,b)=>(b.timestamp||0)-(a.timestamp||0));if(!tickets.length){list.innerHTML='<p style="color:#555;text-align:center;padding:20px;">Пусто</p>';return;}list.innerHTML='';tickets.forEach(t=>{let st='',sc='';if(t.status==='new'){st='⏳ Ожидает';sc='new';}else if(t.status==='answered'){st='✅ Отвечено';sc='answered';}else{st='🔒 Закрыто';sc='closed';}const div=document.createElement('div');div.className='ticket-item '+t.status;div.innerHTML=`<div class="ticket-header"><span class="ticket-topic">${t.topic}</span><span class="ticket-status ${sc}">${st}</span></div><div class="ticket-message">${t.message.replace(/</g,'&lt;')}</div><div class="ticket-date">${t.date}</div>${t.answer?`<div class="ticket-answer"><div class="ticket-answer-label">🔧 ОТВЕТ:</div><div class="ticket-answer-text">${t.answer.replace(/</g,'&lt;')}</div><div class="ticket-date" style="margin-top:5px;">${t.answerDate}</div></div>`:''}`;list.appendChild(div);});}

// ============ КОММЕНТАРИИ ============
async function postComment(){const text=document.getElementById('comment-text').value.trim();if(!text){alert('Напиши!');return;}if(!currentUser)return;if(currentUser.banned){alert('Заблокирован!');return;}const comment={serialId:currentSerial.id,epNum:currentEpList[currentEpIndex].number,author:currentUser.name,email:currentUser.email,avatar:currentUser.avatar||'👤',avatarImg:currentUser.avatarImg||'',text,date:new Date().toLocaleString('ru-RU'),likes:[],isAdmin:currentUser.isAdmin||false,subLevel:getUserSubLevel(),nickColor:currentUser.nickColor||'default',timestamp:Date.now()};const newRef=window.fbPush(window.fbRef(window.fbDb,'comments'));await window.fbSet(newRef,comment);document.getElementById('comment-text').value='';}
async function deleteComment(id){if(!confirm('Удалить?'))return;await fbRemovePath(`comments/${id}`);}
async function likeComment(id){if(!currentUser)return;const comment=allComments.find(c=>c.id===id);if(!comment)return;let likes=comment.likes||[];const idx=likes.indexOf(currentUser.email);if(idx===-1)likes=[...likes,currentUser.email];else likes=likes.filter(e=>e!==currentUser.email);await fbUpdatePath(`comments/${id}`,{likes});}
function getEpisodeComments(s,e){return allComments.filter(c=>c.serialId===s&&c.epNum===e).sort((a,b)=>(b.timestamp||0)-(a.timestamp||0));}
function renderComments(){if(!currentSerial||!currentEpList[currentEpIndex])return;const epComments=getEpisodeComments(currentSerial.id,currentEpList[currentEpIndex].number);const list=document.getElementById('comments-list');if(!list)return;document.getElementById('comments-count').textContent=`(${epComments.length})`;document.getElementById('comment-count-display').textContent=epComments.length;const bMsg=document.getElementById('comment-banned-msg');const fCont=document.getElementById('comment-form-container');if(currentUser){const av=document.getElementById('comment-avatar');if(currentUser.avatarImg)av.innerHTML=`<img src="${currentUser.avatarImg}">`;else av.textContent=currentUser.avatar||'👤';if(currentUser.banned){bMsg.innerHTML='<div class="banned-msg">🚫 Заблокирован</div>';fCont.style.display='none';}else{bMsg.innerHTML='';fCont.style.display='flex';}}if(!epComments.length){list.innerHTML='<div class="no-comments">Пока нет комментариев 💬</div>';return;}list.innerHTML='';epComments.forEach(c=>{const liked=c.likes&&c.likes.includes(currentUser?.email);const canDel=currentUser&&(currentUser.email===c.email||isModerator());let aClass='';let badge='';if(c.isAdmin){aClass='admin';badge=' 🔧';}else if(c.subLevel==='rapport'){aClass='rapport';badge=' 🛡️';}else if(c.subLevel==='pro'){aClass='pro-glow';badge=' 👑';}else if(c.subLevel==='lux'){aClass='lux';badge=' 💎';}else if(c.subLevel==='basic'){aClass='basic';badge=' 🎬';}else if(c.subLevel==='pissing'){badge=' 💧';}let nickStyle='';if(c.nickColor && c.nickColor !== 'default'){const col=NICK_COLORS.find(nc=>nc.id===c.nickColor);if(col){if(col.color==='rainbow'){nickStyle=`background:linear-gradient(135deg,#ff0000,#ff7f00,#ffff00,#00ff00,#0000ff,#4b0082,#9400d3);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;font-weight:700;`;}else{nickStyle=`color:${col.color};text-shadow:0 0 10px ${col.color};font-weight:700;`;}}}const div=document.createElement('div');div.className='comment-item';div.innerHTML=`<div class="comment-avatar" style="cursor:pointer;" onclick="openUserProfile('${c.email}')">${c.avatarImg?`<img src="${c.avatarImg}">`:(c.avatar||'👤')}</div><div class="comment-body"><div class="comment-header"><span class="comment-author ${aClass}" style="${nickStyle};cursor:pointer;" onclick="openUserProfile('${c.email}')">${c.author}${badge}</span><span class="comment-date">${c.date}</span></div><div class="comment-text">${c.text.replace(/</g,'&lt;')}</div><div class="comment-actions"><button class="comment-action ${liked?'liked':''}" onclick="likeComment('${c.id}')">${liked?'❤️':'🤍'} ${c.likes?c.likes.length:0}</button>${canDel?`<button class="comment-action comment-delete" onclick="deleteComment('${c.id}')">🗑</button>`:''}</div></div>`;list.appendChild(div);});}

// ============ АВТОРИЗАЦИЯ ============
async function checkSession(){let saved=getCookie('theded_fb');if(!saved){const ss=sessionStorage.getItem('theded_fb');if(ss)saved=JSON.parse(ss);}if(saved){const found=await getUserByEmail(saved.email);if(found && found.password===saved.password){if(found.banned){alert('🚫 Заблокирован!');deleteCookie('theded_fb');sessionStorage.removeItem('theded_fb');return;}currentUser=found;ensureFields();loginSuccess();}}}
function ensureFields(){
    if(!currentUser.avatar)currentUser.avatar='👤';
    if(!currentUser.avatarImg)currentUser.avatarImg='';
    if(!currentUser.bio)currentUser.bio='';
    if(!currentUser.wallet)currentUser.wallet={RUB:0,USD:0,EUR:0,KZT:0};
    if(!currentUser.currency)currentUser.currency='RUB';
    if(currentUser.subscription===undefined)currentUser.subscription=false;
    if(currentUser.subscription===true)currentUser.subscription='basic';
    if(currentUser.banned===undefined)currentUser.banned=false;
    if(!currentUser.theme)currentUser.theme='default';
    if(currentUser.tempSubUntil===undefined)currentUser.tempSubUntil=0;
    if(!currentUser.nickColor)currentUser.nickColor='default';
    if(currentUser.extraFollowers===undefined)currentUser.extraFollowers=0;
    if(!currentUser.birthday)currentUser.birthday='';
    if(!currentUser.lastBirthdayGift)currentUser.lastBirthdayGift='';
    if(currentUser.email===ADMIN_EMAIL){currentUser.subscription='pro';currentUser.isAdmin=true;}
    saveCurrentUserToFirebase();
}
async function tryLogin(){const email=document.getElementById('login-email').value.trim().toLowerCase();const password=document.getElementById('login-password').value;const remember=document.getElementById('remember-check').checked;const user=await getUserByEmail(email);document.getElementById('login-error').classList.remove('show');document.getElementById('banned-error').classList.remove('show');if(user && user.password===password){if(user.banned){document.getElementById('banned-error').classList.add('show');return;}currentUser=user;ensureFields();if(remember)setCookie('theded_fb',{email:user.email,password:user.password},30);else sessionStorage.setItem('theded_fb',JSON.stringify({email:user.email,password:user.password}));loginSuccess();}else{const err=document.getElementById('login-error');err.classList.add('show');err.style.animation='none';setTimeout(()=>err.style.animation='shake 0.4s ease',10);}}
async function tryRegister(){const name=document.getElementById('reg-name').value.trim();const email=document.getElementById('reg-email').value.trim().toLowerCase();const password=document.getElementById('reg-password').value;if(!name||!email||!password){showRegError('❌ Заполни всё');return;}if(!email.includes('@')||!email.includes('.')){showRegError('❌ Правильный email');return;}if(password.length<4){showRegError('❌ Минимум 4 символа');return;}const existing=await getUserByEmail(email);if(existing){showRegError('❌ Email занят');return;}    const newUser={email,password,name,avatar:'👤',avatarImg:'',bio:'',wallet:{RUB:0,USD:0,EUR:0,KZT:0},currency:'RUB',subscription:false,isAdmin:false,banned:false,theme:'default',tempSubUntil:0,nickColor:'default',extraFollowers:0,birthday:'',lastBirthdayGift:''};;await fbWrite(`users/${emailToKey(email)}`,newUser);currentUser=newUser;setCookie('theded_fb',{email:newUser.email,password:newUser.password},30);loginSuccess();}
function showRegError(msg){const e=document.getElementById('reg-error');e.textContent=msg;e.classList.add('show');e.style.animation='none';setTimeout(()=>e.style.animation='shake 0.4s ease',10);}
function loginSuccess(){document.getElementById('login-screen').classList.add('hidden');updateUserNameDisplay();document.getElementById('welcome-name').textContent=currentUser.name;if(currentUser.isAdmin||currentUser.email===ADMIN_EMAIL||currentUser.subscription==='rapport')document.getElementById('btn-admin').style.display='inline-block';loadUserTheme();updateAvatarDisplay();updateWalletDisplay();updateSubDisplay();renderFolders();renderThemes();renderNickColors();updateFollowCounts();if(currentUser.tempSubUntil&&currentUser.tempSubUntil>Date.now())startPromoTimer();if(!hasActiveSubscription())setTimeout(()=>document.getElementById('sub-ad').classList.add('show'),1000);updateMessagesBadge();}
function updateUserNameDisplay(){const nameEl=document.getElementById('user-name-display');nameEl.textContent=currentUser.name;nameEl.className='user-name';if(hasGlowingNick())nameEl.classList.add('pro-glow');const colId=currentUser.nickColor||'default';if(colId!=='default'){const col=NICK_COLORS.find(c=>c.id===colId);if(col){if(col.color==='rainbow'){nameEl.style.background='linear-gradient(135deg,#ff0000,#ff7f00,#ffff00,#00ff00,#0000ff,#4b0082,#9400d3)';nameEl.style.webkitBackgroundClip='text';nameEl.style.backgroundClip='text';nameEl.style.webkitTextFillColor='transparent';}else{nameEl.style.color=col.color;nameEl.style.textShadow=`0 0 10px ${col.color}`;}}}else{nameEl.style.color='';nameEl.style.textShadow='';nameEl.style.background='';}}
function logout(){deleteCookie('theded_fb');sessionStorage.removeItem('theded_fb');currentUser=null;document.body.className='';document.getElementById('login-screen').classList.remove('hidden');document.getElementById('login-email').value='';document.getElementById('login-password').value='';document.getElementById('login-error').classList.remove('show');document.getElementById('banned-error').classList.remove('show');document.getElementById('reg-error').classList.remove('show');document.getElementById('btn-admin').style.display='none';showLogin();showPage('home');}
function showRegister(){document.getElementById('login-form').classList.add('hidden');document.getElementById('register-form').classList.add('active');}
function showLogin(){document.getElementById('login-form').classList.remove('hidden');document.getElementById('register-form').classList.remove('active');}
function closeSubAd(){document.getElementById('sub-ad').classList.remove('show');}
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&!document.getElementById('login-screen').classList.contains('hidden')){document.getElementById('register-form').classList.contains('active')?tryRegister():tryLogin();}});

// АВАТАРКА
function initAvatarPicker(){const p=document.getElementById('avatar-picker');p.innerHTML='';const r=document.createElement('div');r.style.gridColumn='1/-1';r.style.color='#888';r.style.fontSize='0.8rem';r.style.marginBottom='5px';r.innerHTML='🎨 ОБЫЧНЫЕ';p.appendChild(r);AVATARS.forEach(av=>{const d=document.createElement('div');d.className='avatar-option'+(currentUser.avatar===av&&!currentUser.avatarImg?' selected':'');d.textContent=av;d.onclick=()=>selectAvatar(av);p.appendChild(d);});const v=document.createElement('div');v.style.gridColumn='1/-1';v.style.color='var(--gold)';v.style.fontSize='0.8rem';v.style.marginTop='15px';v.style.marginBottom='5px';v.innerHTML='💎 ОТ ВАНИ (LUX+)';p.appendChild(v);const canUse=canUseVanyaAvatars();VANYA_AVATARS.forEach(av=>{const d=document.createElement('div');d.className='avatar-option vanya'+(currentUser.avatar===av&&!currentUser.avatarImg?' selected':'')+(!canUse?' locked':'');d.textContent=av;d.onclick=()=>{if(!canUse){alert('🔒 LUX+');return;}selectAvatar(av);};p.appendChild(d);});}
function toggleAvatarPicker(){document.getElementById('avatar-picker').classList.toggle('show');initAvatarPicker();}
async function selectAvatar(av){currentUser.avatar=av;currentUser.avatarImg='';await saveCurrentUserToFirebase();updateAvatarDisplay();initAvatarPicker();document.getElementById('avatar-picker').classList.remove('show');}
function uploadAvatar(event){const file=event.target.files[0];if(!file)return;if(file.size>2000000){alert('Максимум 2 МБ');return;}const reader=new FileReader();reader.onload=function(e){const img=new Image();img.onload=async function(){const canvas=document.createElement('canvas');const size=150;canvas.width=size;canvas.height=size;const ctx=canvas.getContext('2d');const min=Math.min(img.width,img.height);ctx.drawImage(img,(img.width-min)/2,(img.height-min)/2,min,min,0,0,size,size);currentUser.avatarImg=canvas.toDataURL('image/jpeg',0.85);await saveCurrentUserToFirebase();updateAvatarDisplay();};img.src=e.target.result;};reader.readAsDataURL(file);}
function updateAvatarDisplay(){if(!currentUser)return;const nav=document.getElementById('nav-avatar');const prof=document.getElementById('profile-avatar');if(currentUser.avatarImg){nav.innerHTML=`<img src="${currentUser.avatarImg}">`;prof.innerHTML=`<img src="${currentUser.avatarImg}">`;}else{const av=currentUser.avatar||'👤';nav.innerHTML=av;prof.innerHTML=av;}const nameEl=document.getElementById('profile-name');nameEl.textContent=currentUser.name;nameEl.className='profile-name';if(hasGlowingNick())nameEl.classList.add('pro-glow');const colId=currentUser.nickColor||'default';if(colId!=='default'){const col=NICK_COLORS.find(c=>c.id===colId);if(col){if(col.color==='rainbow'){nameEl.style.background='linear-gradient(135deg,#ff0000,#ff7f00,#ffff00,#00ff00,#0000ff,#4b0082,#9400d3)';nameEl.style.webkitBackgroundClip='text';nameEl.style.backgroundClip='text';nameEl.style.webkitTextFillColor='transparent';}else{nameEl.style.color=col.color;nameEl.style.textShadow=`0 0 15px ${col.color}`;}}}else{nameEl.style.color='';nameEl.style.textShadow='';}document.getElementById('profile-email-display').textContent=currentUser.email;document.getElementById('profile-bio').textContent=currentUser.bio||'Нет описания';}
async function editBio(){const nb=prompt('Описание:',currentUser.bio||'');if(nb!==null){currentUser.bio=nb.substring(0,200);await saveCurrentUserToFirebase();updateAvatarDisplay();}}

function updateSubDisplay(){if(!currentUser)return;const el=document.getElementById('sub-status');const navBadge=document.getElementById('nav-sub-badge');const buyArea=document.getElementById('sub-buy-area');const active=hasActiveSubscription();const level=getUserSubLevel();if(active){if(level==='rapport'){el.textContent='🛡️ РАППОРТ';el.className='sub-status active rapport-bg';navBadge.textContent='🛡️ RAPPORT';navBadge.className='sub-badge-nav rapport-bg';}else if(level==='pro'){el.textContent='👑 САМЫЙ КРУТОЙ';el.className='sub-status active pro-bg';navBadge.textContent='👑 PRO';navBadge.className='sub-badge-nav pro-bg';}else if(level==='lux'){el.textContent='💎 LUX';el.className='sub-status active lux-bg';navBadge.textContent='💎 LUX';navBadge.className='sub-badge-nav lux-bg';}else if(level==='basic'){el.textContent='🎬 БАЗОВАЯ';el.className='sub-status active basic-bg';navBadge.textContent='🎬 BASIC';navBadge.className='sub-badge-nav basic-bg';}else if(level==='pissing'){el.textContent='💧 ПИСАЮЩИЙ';el.className='sub-status active pissing-bg';navBadge.textContent='💧 ПИС';navBadge.className='sub-badge-nav pissing-bg';}navBadge.style.display='inline-block';let html=`<p style="color:#4CAF50;margin-top:10px;">✅ Подписка активна!</p>`;if(level==='pissing'){html+=`<button class="buy-sub-btn basic-btn" onclick="buySubscriptionType('basic')">🎬 BASIC — 10 ₽</button><button class="buy-sub-btn lux-btn" onclick="buySubscriptionType('lux')">💎 LUX — 25 ₽</button><button class="buy-sub-btn pro-btn" onclick="buySubscriptionType('pro')">👑 САМЫЙ КРУТОЙ — 50 ₽</button><button class="buy-sub-btn rapport-btn" onclick="buySubscriptionType('rapport')">🛡️ РАППОРТ — 159 ₽</button>`;}else if(level==='basic'){html+=`<button class="buy-sub-btn lux-btn" onclick="buySubscriptionType('lux')">💎 LUX — 25 ₽</button><button class="buy-sub-btn pro-btn" onclick="buySubscriptionType('pro')">👑 САМЫЙ КРУТОЙ — 50 ₽</button><button class="buy-sub-btn rapport-btn" onclick="buySubscriptionType('rapport')">🛡️ РАППОРТ — 159 ₽</button>`;}else if(level==='lux'){html+=`<button class="buy-sub-btn pro-btn" onclick="buySubscriptionType('pro')">👑 САМЫЙ КРУТОЙ — 50 ₽</button><button class="buy-sub-btn rapport-btn" onclick="buySubscriptionType('rapport')">🛡️ РАППОРТ — 159 ₽</button>`;}else if(level==='pro'){html+=`<button class="buy-sub-btn rapport-btn" onclick="buySubscriptionType('rapport')">🛡️ РАППОРТ — 159 ₽</button>`;}buyArea.innerHTML=html;}else{el.textContent='БЕЗ ПОДПИСКИ';el.className='sub-status inactive';navBadge.style.display='none';const bal=currentUser.wallet.RUB||0;buyArea.innerHTML=`<div class="sub-grid"><div class="sub-card pissing"><div class="sub-icon">💧</div><div class="sub-name">ПИСАЮЩИЙ</div><div class="sub-price">1 ₽</div><ul class="sub-features"><li>😀 Все эмодзи в чате</li></ul><button class="buy-sub-btn pissing-btn" onclick="buySubscriptionType('pissing')" ${bal<1?'disabled':''}>КУПИТЬ</button></div><div class="sub-card basic"><div class="sub-icon">🎬</div><div class="sub-name">БАЗОВАЯ</div><div class="sub-price">10 ₽</div><ul class="sub-features"><li>Доступ ко всем сериям</li><li>Цветные ники</li></ul><button class="buy-sub-btn basic-btn" onclick="buySubscriptionType('basic')" ${bal<10?'disabled':''}>КУПИТЬ</button></div><div class="sub-card lux"><div class="sub-icon">💎</div><div class="sub-name">LUX</div><div class="sub-price">25 ₽</div><ul class="sub-features"><li>Всё из BASIC</li><li>💎 Аватарки Вани</li></ul><button class="buy-sub-btn lux-btn" onclick="buySubscriptionType('lux')" ${bal<25?'disabled':''}>КУПИТЬ</button></div><div class="sub-card pro"><div class="sub-icon">👑</div><div class="sub-name">САМЫЙ КРУТОЙ</div><div class="sub-price">50 ₽</div><ul class="sub-features"><li>Всё из LUX</li><li>✨ Светящийся ник</li></ul><button class="buy-sub-btn pro-btn" onclick="buySubscriptionType('pro')" ${bal<50?'disabled':''}>КУПИТЬ</button></div><div class="sub-card rapport"><div class="sub-icon">🛡️</div><div class="sub-name">РАППОРТ</div><div class="sub-price">159 ₽</div><ul class="sub-features"><li>Всё из PRO</li><li>🛡️ Модератор</li></ul><button class="buy-sub-btn rapport-btn" onclick="buySubscriptionType('rapport')" ${bal<159?'disabled':''}>КУПИТЬ</button></div></div><p style="color:#888;text-align:center;margin-top:15px;font-size:0.85rem;">Баланс: ${bal.toFixed(2)} ₽</p>`;}}

function initCurrencyButtons(){const c=document.getElementById('currency-select');c.innerHTML='';CURRENCIES.forEach(cur=>{const b=document.createElement('button');b.className='currency-btn'+(currentUser.currency===cur.code?' active':'');b.textContent=`${cur.symbol} ${cur.name}`;b.onclick=async ()=>{currentUser.currency=cur.code;await saveCurrentUserToFirebase();updateWalletDisplay();};c.appendChild(b);});}
function getCurrencySymbol(){return(CURRENCIES.find(c=>c.code===currentUser.currency)||{}).symbol||'₽';}
function updateWalletDisplay(){if(!currentUser)return;const sym=getCurrencySymbol();const bal=(currentUser.wallet[currentUser.currency]||0).toFixed(2);document.getElementById('wallet-balance').textContent=`${bal} ${sym}`;document.getElementById('nav-wallet').textContent=`${bal} ${sym}`;initCurrencyButtons();updateSubDisplay();}
function topupWallet(){
    showTopupDisabled();
}
function showTopupDisabled(){
    const msg=document.getElementById('topup-disabled-msg');
    if(msg){
        msg.style.display='block';
        setTimeout(()=>{msg.style.display='none';},5000);
    }
    alert('⚠️ Пополнение временно недоступно. Мы работаем над этим!');
}
// ============ СЕРИАЛЫ С ОБЛОЖКОЙ ============
function renderFolders(){
    const grid=document.getElementById('folders-grid');
    grid.innerHTML='';
    SERIALS.forEach(s=>{
        const locked=s.subOnly&&!hasActiveSubscription();
        const div=document.createElement('div');
        div.className='folder'+(s.poster?' with-poster':'');
        if(s.poster){
            div.style.backgroundImage=`url('${s.poster}')`;
            div.innerHTML=`<div class="folder-overlay"><div class="folder-name">${s.name}</div><div class="folder-info">${s.totalEps} СЕРИЙ</div>${locked?'<div class="folder-lock">🔒 ПОДПИСКА</div>':''}</div>`;
        }else{
            div.innerHTML=`<span class="folder-icon">${s.icon}</span><div class="folder-name">${s.name}</div><div style="color:#666;margin-top:5px;">${s.totalEps} СЕРИЙ</div>${locked?'<div class="folder-lock">🔒 ПОДПИСКА</div>':''}`;
        }
        div.onclick=()=>{if(locked){alert('Нужна подписка!');return;}openSerial(s);};
        grid.appendChild(div);
    });
}

function openSerial(serial){currentSerial=serial;document.getElementById('serial-page-title').textContent=serial.name;document.getElementById('back-btn').style.display='inline-block';const list=document.getElementById('episodes-list');list.innerHTML='';currentEpList=[];for(let i=1;i<=serial.totalEps;i++){currentEpList.push({number:i,video:VIDEO_URLS[i]||'',early:serial.earlyEps&&serial.earlyEps.includes(i)});}currentEpList.forEach((ep,idx)=>{const adminLocked=isEpisodeBlocked(ep.number);const isMod=isModerator();if(adminLocked && !isMod)return;const locked=ep.early&&!hasActiveSubscription();const views=getViewCount(serial.id,ep.number);const likes=getLikeCount(serial.id,ep.number);const rating=getEpisodeRating(serial.id,ep.number);const card=document.createElement('div');card.className='ep-card'+(locked?' locked':'')+(ep.early?' early':'')+(adminLocked?' admin-locked':'');card.innerHTML=`<span class="play-icon">${locked?'🔒':'▶'}</span><h3>СЕРИЯ ${ep.number}</h3><div class="ep-stats"><span>👁 ${views}</span><span>❤️ ${likes}</span></div>${rating.count>0?`<div class="ep-rating">⭐ ${rating.avg} (${rating.count})</div>`:''}${ep.early?'<div class="early-badge">🔒 РАННИЙ</div>':''}`;card.onclick=()=>{if(adminLocked && !isMod){alert('🚫 Заблокирована!');return;}if(locked){alert('По подписке!');return;}playVideo(idx);};list.appendChild(card);});showPage('all');}
async function playVideo(idx){currentEpIndex=idx;const ep=currentEpList[idx];showPage('player');document.getElementById('ep-title').innerText=`СЕРИЯ ${ep.number}`;const video=document.getElementById('v-player');video.src=ep.video;video.load();video.play().catch(()=>{});document.getElementById('prev').disabled=(idx===0);document.getElementById('next').disabled=(idx===currentEpList.length-1);const views=await addView(currentSerial.id,ep.number);document.getElementById('view-count').textContent=views;updateLikeDisplay();const dl=document.getElementById('download-btn');dl.href=ep.video;dl.download=`THE_DED_S${ep.number}.mp4`;renderComments();renderStars();}
function changeEp(dir){const newIdx=currentEpIndex+dir;if(newIdx>=0&&newIdx<currentEpList.length){const ep=currentEpList[newIdx];if(ep.early&&!hasActiveSubscription()){alert('По подписке!');return;}playVideo(newIdx);}}
document.getElementById('v-player').addEventListener('ended',()=>{if(currentEpIndex<currentEpList.length-1)changeEp(1);});

function showPage(pageId){
    document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
    const pageEl = document.getElementById('page-'+pageId);
    if(pageEl) pageEl.classList.add('active');
    document.querySelectorAll('.nav-tab').forEach(b=>b.classList.remove('active'));
    const btn=document.getElementById('btn-'+pageId);
    if(btn)btn.classList.add('active');
    if(pageId!=='player'){
        const vp = document.getElementById('v-player');
        if(vp) vp.pause();
    }
    if(pageId==='profile'){updateAvatarDisplay();updateWalletDisplay();renderThemes();renderNickColors();updateFollowCounts();}
    if(pageId==='support')renderMyTickets();
    if(pageId==='messages')renderChatsList();
    if(pageId==='news')renderNews();
    if(pageId==='top')renderTopUsers();
    if(pageId==='reminders')renderReminders();
    if(pageId==='home'){
        const backBtn = document.getElementById('back-btn');
        if(backBtn) backBtn.style.display='none';
        checkBirthday();
    }
    window.scrollTo({top:0,behavior:'smooth'});
}
// ============ ЧАТЫ ============
function getChatId(user1,user2){const sorted=[user1,user2].sort();return emailToKey(sorted[0])+'__'+emailToKey(sorted[1]);}

function renderChatsList(){
    const list=document.getElementById('chats-list');
    if(!list || !currentUser)return;
    const myKey=emailToKey(currentUser.email);
    const chats=[];

    // Личные чаты
    Object.entries(allMessages).forEach(([chatId,messages])=>{
        if(chatId.startsWith('group_'))return;
        if(chatId.includes(myKey)){
            const msgArr=Object.values(messages);
            if(msgArr.length===0)return;
            const lastMsg=msgArr.sort((a,b)=>(b.timestamp||0)-(a.timestamp||0))[0];
            const otherKey=chatId.replace(myKey,'').replace('__','');
            const otherUser=allUsers[otherKey];
            if(!otherUser)return;
            const unread=msgArr.some(m=>m.to===currentUser.email && !m.read);
            chats.push({chatId,type:'private',otherUser,lastMsg,unread,timestamp:lastMsg.timestamp||0});
        }
    });

    // Групповые чаты
    Object.entries(allGroups).forEach(([groupId,group])=>{
        if(!group.members || !group.members[myKey])return;
        const chatId='group_'+groupId;
        const messages=allMessages[chatId]||{};
        const msgArr=Object.values(messages);
        const lastMsg=msgArr.length>0 ? msgArr.sort((a,b)=>(b.timestamp||0)-(a.timestamp||0))[0] : null;
        const unread=msgArr.some(m=>m.from!==currentUser.email && (!m.readBy || !m.readBy[myKey]));
        chats.push({chatId,type:'group',group,groupId,lastMsg,unread,timestamp:lastMsg?lastMsg.timestamp:(group.createdAt||0)});
    });

    chats.sort((a,b)=>b.timestamp-a.timestamp);

    if(!chats.length){list.innerHTML='<p style="color:#555;text-align:center;padding:20px;font-size:0.85rem;">Нет чатов</p>';return;}

    list.innerHTML='';
    chats.forEach(c=>{
        const div=document.createElement('div');
        div.className='chat-item'+(currentChatId===c.chatId?' active':'')+(c.unread?' unread':'')+(c.type==='group'?' group':'');
        if(c.type==='group'){
            const lastText=c.lastMsg ? `${c.lastMsg.authorName||''}: ${c.lastMsg.text.substring(0,25)}` : 'Группа создана';
            div.innerHTML=`<div class="chat-item-avatar">👥</div><div class="chat-item-info"><div class="chat-item-name">${c.group.name}<span class="group-badge">${Object.keys(c.group.members).length}</span></div><div class="chat-item-last">${lastText}</div></div>${c.unread?'<div class="unread-dot"></div>':''}`;
            div.onclick=()=>openGroupChat(c.groupId,c.group);
        }else{
            const av=c.otherUser.avatarImg?`<img src="${c.otherUser.avatarImg}">`:(c.otherUser.avatar||'👤');
            div.innerHTML=`<div class="chat-item-avatar">${av}</div><div class="chat-item-info"><div class="chat-item-name">${c.otherUser.name}</div><div class="chat-item-last">${c.lastMsg.text.substring(0,30)}${c.lastMsg.text.length>30?'...':''}</div></div>${c.unread?'<div class="unread-dot"></div>':''}`;
            div.onclick=()=>openChat(c.chatId,c.otherUser);
        }
        list.appendChild(div);
    });
}

function openChat(chatId,otherUser){
    currentChatId=chatId;
    currentChatUser=otherUser;
    currentChatType='private';
    replyingToMessage=null;
    const main=document.getElementById('messages-main');
    const av=otherUser.avatarImg?`<img src="${otherUser.avatarImg}">`:(otherUser.avatar||'👤');
    main.innerHTML=`
        <div class="chat-header">
            <div class="chat-header-avatar" style="cursor:pointer;" onclick="openUserProfile('${otherUser.email}')">${av}</div>
            <div class="chat-header-name" style="cursor:pointer;" onclick="openUserProfile('${otherUser.email}')">${otherUser.name}</div>
        </div>
        <div class="chat-messages" id="chat-messages-area"></div>
        <div class="emoji-picker" id="emoji-picker"></div>
        <div class="sticker-picker" id="sticker-picker"></div>
        <div class="reply-indicator" id="reply-indicator">
            <div class="reply-indicator-info">
                <div class="reply-indicator-author" id="reply-indicator-author"></div>
                <div class="reply-indicator-text" id="reply-indicator-text"></div>
            </div>
            <button class="reply-cancel" onclick="cancelReply()">✕</button>
        </div>
        <div class="chat-input-area">
            <button class="emoji-btn" onclick="toggleEmojiPicker()">😀</button>
            <button class="sticker-btn" onclick="toggleStickerPicker()">🎨</button>
            <button class="attach-btn" onclick="attachPhoto('${otherUser.email}','private')">📎</button>
            <button class="voice-btn" id="voice-btn" onclick="toggleVoiceRecord('${otherUser.email}','private')">🎤</button>
            <textarea class="chat-input" id="chat-input-text" placeholder="Напиши сообщение..." rows="1"></textarea>
            <button class="chat-send" onclick="sendMessage('${otherUser.email}')">📤</button>
        </div>
    `;
    document.getElementById('chat-input-text').addEventListener('keydown',e=>{if(e.key==='Enter' && !e.shiftKey){e.preventDefault();sendMessage(otherUser.email);}});
    renderChat();
    markChatRead(chatId);
    renderChatsList();
}

function openGroupChat(groupId,group){
    currentChatId='group_'+groupId;
    currentChatType='group';
    currentChatUser=null;
    replyingToMessage=null;
    const main=document.getElementById('messages-main');
    main.innerHTML=`
        <div class="chat-header">
            <div class="chat-header-avatar">👥</div>
            <div class="chat-header-name">${group.name} <span style="color:#888;font-size:0.85rem;">(${Object.keys(group.members).length} чел)</span></div>
            <button class="boost-btn" style="padding:8px 12px;font-size:0.75rem;background:#333;color:white;margin-left:auto;" onclick="showGroupMembers('${groupId}')">👥 УЧАСТНИКИ</button>
        </div>
        <div class="chat-messages" id="chat-messages-area"></div>
        <div class="emoji-picker" id="emoji-picker"></div>
        <div class="sticker-picker" id="sticker-picker"></div>
        <div class="reply-indicator" id="reply-indicator">
            <div class="reply-indicator-info">
                <div class="reply-indicator-author" id="reply-indicator-author"></div>
                <div class="reply-indicator-text" id="reply-indicator-text"></div>
            </div>
            <button class="reply-cancel" onclick="cancelReply()">✕</button>
        </div>
        <div class="chat-input-area">
            <button class="emoji-btn" onclick="toggleEmojiPicker()">😀</button>
            <button class="sticker-btn" onclick="toggleStickerPicker()">🎨</button>
            <button class="attach-btn" onclick="attachPhoto('${groupId}','group')">📎</button>
            <button class="voice-btn" id="voice-btn" onclick="toggleVoiceRecord('${groupId}','group')">🎤</button>
            <textarea class="chat-input" id="chat-input-text" placeholder="Напиши в группу..." rows="1"></textarea>
            <button class="chat-send" onclick="sendGroupMessage('${groupId}')">📤</button>
        </div>
    `;
    document.getElementById('chat-input-text').addEventListener('keydown',e=>{if(e.key==='Enter' && !e.shiftKey){e.preventDefault();sendGroupMessage(groupId);}});
    renderChat();
    markChatRead(currentChatId);
    renderChatsList();
}

function showGroupMembers(groupId){
    const group=allGroups[groupId];
    if(!group)return;
    const modal=document.getElementById('group-members-modal');
    const list=document.getElementById('group-members-list');
    list.innerHTML='';
    Object.keys(group.members).forEach(key=>{
        const u=allUsers[key];
        if(!u)return;
        const div=document.createElement('div');
        div.className='search-user-item';
        const av=u.avatarImg?`<img src="${u.avatarImg}">`:(u.avatar||'👤');
        const isCreator=group.createdBy===key;
        div.innerHTML=`<div class="search-user-avatar">${av}</div><div class="search-user-info"><div class="search-user-name">${u.name} ${isCreator?'👑':''}</div><div class="search-user-email">${u.email}</div></div>`;
        div.onclick=()=>{closeGroupMembers();openUserProfile(u.email);};
        list.appendChild(div);
    });
    modal.classList.add('show');
}

function closeGroupMembers(){document.getElementById('group-members-modal').classList.remove('show');}

function toggleEmojiPicker(){const picker=document.getElementById('emoji-picker');if(!picker)return;if(picker.classList.contains('show')){picker.classList.remove('show');return;}renderEmojiPicker();picker.classList.add('show');}
function renderEmojiPicker(){const picker=document.getElementById('emoji-picker');picker.innerHTML='';const canUse=canUseAllEmojis();const freeTitle=document.createElement('div');freeTitle.className='emoji-section-title';freeTitle.innerHTML='😀 БЕСПЛАТНЫЕ';picker.appendChild(freeTitle);const freeGrid=document.createElement('div');freeGrid.className='emoji-grid';FREE_EMOJIS.forEach(e=>{const span=document.createElement('span');span.className='emoji-item';span.textContent=e;span.onclick=()=>insertEmoji(e);freeGrid.appendChild(span);});picker.appendChild(freeGrid);const paidTitle=document.createElement('div');paidTitle.className='emoji-section-title';paidTitle.style.color=canUse?'#4CAF50':'#FFD700';paidTitle.innerHTML=canUse?'✅ ВСЕ ЭМОДЗИ':'🔒 ПЛАТНЫЕ (от 1 ₽)';picker.appendChild(paidTitle);const paidGrid=document.createElement('div');paidGrid.className='emoji-grid';PAID_EMOJIS.forEach(e=>{const span=document.createElement('span');span.className='emoji-item'+(!canUse?' locked':'');span.textContent=e;span.onclick=()=>{if(!canUse){alert('🔒 Купи ПИСАЮЩИЙ за 1 ₽!');return;}insertEmoji(e);};paidGrid.appendChild(span);});picker.appendChild(paidGrid);}
function insertEmoji(emoji){const input=document.getElementById('chat-input-text');if(!input)return;input.value+=emoji;input.focus();}

function renderChat(){
    if(!currentChatId)return;
    const area=document.getElementById('chat-messages-area');
    if(!area)return;
    const messages=allMessages[currentChatId]||{};
    const arr=Object.entries(messages).map(([id,m])=>({...m,id})).sort((a,b)=>(a.timestamp||0)-(b.timestamp||0));
    const wasScrolledToBottom=area.scrollTop+area.clientHeight>=area.scrollHeight-50;
    area.innerHTML='';

    arr.forEach(m=>{
        const div=document.createElement('div');
        const isMine=m.from===currentUser.email;
        div.className='msg-bubble '+(isMine?'mine':'theirs');
        div.id='msg-' + m.id;

        // Автор для групп
        let authorBlock='';
        if(currentChatType==='group' && !isMine){
            authorBlock=`<div class="chat-msg-author" style="cursor:pointer;color:var(--red);" onclick="openUserProfile('${m.from}')">${m.authorName||'?'}</div>`;
        }

        // Ответ на сообщение
        let replyBlock='';
        if(m.replyTo){
            replyBlock=`
                <div class="msg-reply-preview" onclick="scrollToMessage('${m.replyTo.id}')">
                    <div class="msg-reply-preview-author">↩️ ${m.replyTo.author}</div>
                    <div class="msg-reply-preview-text">${(m.replyTo.text||'').replace(/</g,'&lt;').substring(0,50)}</div>
                </div>
            `;
        }

        // Контент сообщения
        let contentBlock='';
        const msgType = m.type || 'text';

        if(msgType === 'photo' && m.photo){
            contentBlock = `<img src="${m.photo}" class="msg-photo" onclick="window.open('${m.photo}','_blank')" alt="Фото">`;
               } else if(msgType === 'voice' && m.voice){
            contentBlock = `
                <div class="msg-voice-container" style="min-width:200px;">
                    <audio controls style="width:100%;max-width:250px;height:35px;" src="${m.voice}"></audio>
                </div>
            `;
        } else if(msgType === 'sticker' && m.sticker){
            contentBlock = `<div class="msg-sticker">${m.sticker}</div>`;
        } else {
            // Обычный текст
            contentBlock = `<div class="msg-text">${(m.text||'').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>`;
        }

        // Реакции
        let reactionsBlock='';
        if(m.reactions && Object.keys(m.reactions).length > 0){
            reactionsBlock = '<div class="msg-reactions">';
            Object.entries(m.reactions).forEach(([emoji, users])=>{
                const count = Object.keys(users).length;
                if(count === 0) return;
                const isMineReaction = currentUser && users[emailToKey(currentUser.email)];
                reactionsBlock += `<div class="reaction-badge ${isMineReaction?'mine':''}" onclick="addReaction('${m.id}','${emoji}','${currentChatId}')">${emoji} ${count}</div>`;
            });
            reactionsBlock += '</div>';
        }

        // Кнопка меню (реакции + ответ)
        const actionsBtn = `
            <button class="msg-actions-btn" onclick="toggleReactionPicker('${m.id}')">😊</button>
            <div class="reaction-picker" id="picker-${m.id}">
                <button class="reaction-emoji-btn" onclick="addReaction('${m.id}','❤️','${currentChatId}')">❤️</button>
                <button class="reaction-emoji-btn" onclick="addReaction('${m.id}','😂','${currentChatId}')">😂</button>
                <button class="reaction-emoji-btn" onclick="addReaction('${m.id}','👍','${currentChatId}')">👍</button>
                <button class="reaction-emoji-btn" onclick="addReaction('${m.id}','🔥','${currentChatId}')">🔥</button>
                <button class="reaction-emoji-btn" onclick="addReaction('${m.id}','😢','${currentChatId}')">😢</button>
                <button class="reaction-emoji-btn" onclick="addReaction('${m.id}','💯','${currentChatId}')">💯</button>
                <button class="reaction-emoji-btn" onclick="replyToMessage('${m.id}','${currentChatId}')">↩️</button>
            </div>
        `;

        div.innerHTML = `
            ${authorBlock}
            ${replyBlock}
            ${contentBlock}
            <div class="msg-time">${m.date}</div>
            ${reactionsBlock}
            ${actionsBtn}
        `;

        area.appendChild(div);
    });

    if(wasScrolledToBottom){
        area.scrollTop=area.scrollHeight;
    }
}

function scrollToMessage(msgId){
    const el = document.getElementById('msg-' + msgId);
    if(el){
        el.scrollIntoView({behavior:'smooth', block:'center'});
        el.style.background = 'rgba(229,9,20,0.3)';
        setTimeout(() => {
            el.style.background = '';
        }, 2000);
    }
}

async function sendMessage(toEmail){
    if(!currentUser){alert('Войди!');return;}
    if(currentUser.banned){alert('Заблокирован!');return;}
    const input=document.getElementById('chat-input-text');
    const text=input.value.trim();
    if(!text)return;
    if(!canUseAllEmojis()){
        for(const emoji of PAID_EMOJIS){
            if(text.includes(emoji)){alert('🔒 Купи подписку!');return;}
        }
    }
    const chatId=getChatId(currentUser.email,toEmail);
    const msg={
        from:currentUser.email,
        to:toEmail,
        text,
        date:new Date().toLocaleString('ru-RU'),
        timestamp:Date.now(),
        read:false,
        type:'text',
        reactions:{},
        replyTo:replyingToMessage||null
    };
    const newRef=window.fbPush(window.fbRef(window.fbDb,`messages/${chatId}`));
    await window.fbSet(newRef,msg);
    input.value='';
    replyingToMessage=null;
    updateReplyIndicator();
    const picker=document.getElementById('emoji-picker');
    if(picker)picker.classList.remove('show');
    const stickerPicker=document.getElementById('sticker-picker');
    if(stickerPicker)stickerPicker.classList.remove('show');
    setTimeout(()=>{const area=document.getElementById('chat-messages-area');if(area)area.scrollTop=area.scrollHeight;},100);
}

async function sendGroupMessage(groupId){
    if(!currentUser){alert('Войди!');return;}
    if(currentUser.banned){alert('Заблокирован!');return;}
    const input=document.getElementById('chat-input-text');
    const text=input.value.trim();
    if(!text)return;
    if(!canUseAllEmojis()){
        for(const emoji of PAID_EMOJIS){
            if(text.includes(emoji)){alert('🔒 Купи подписку!');return;}
        }
    }
    const chatId='group_'+groupId;
    const msg={
        from:currentUser.email,
        authorName:currentUser.name,
        text,
        date:new Date().toLocaleString('ru-RU'),
        timestamp:Date.now(),
        readBy:{[emailToKey(currentUser.email)]:true},
        type:'text',
        reactions:{},
        replyTo:replyingToMessage||null
    };
    const newRef=window.fbPush(window.fbRef(window.fbDb,`messages/${chatId}`));
    await window.fbSet(newRef,msg);
    input.value='';
    replyingToMessage=null;
    updateReplyIndicator();
    const picker=document.getElementById('emoji-picker');
    if(picker)picker.classList.remove('show');
    const stickerPicker=document.getElementById('sticker-picker');
    if(stickerPicker)stickerPicker.classList.remove('show');
    setTimeout(()=>{const area=document.getElementById('chat-messages-area');if(area)area.scrollTop=area.scrollHeight;},100);
}

async function markChatRead(chatId){
    const messages=allMessages[chatId]||{};
    for(const [id,m] of Object.entries(messages)){
        if(chatId.startsWith('group_')){
            if(m.from!==currentUser.email){
                const readBy=m.readBy||{};
                if(!readBy[emailToKey(currentUser.email)]){
                    readBy[emailToKey(currentUser.email)]=true;
                    await fbUpdatePath(`messages/${chatId}/${id}`,{readBy});
                }
            }
        }else{
            if(m.to===currentUser.email && !m.read){
                await fbUpdatePath(`messages/${chatId}/${id}`,{read:true});
            }
        }
    }
}

function updateMessagesBadge(){
    if(!currentUser)return;
    const myKey=emailToKey(currentUser.email);
    let unreadCount=0;
    Object.entries(allMessages).forEach(([chatId,messages])=>{
        if(chatId.startsWith('group_')){
            const groupId=chatId.replace('group_','');
            const group=allGroups[groupId];
            if(!group || !group.members || !group.members[myKey])return;
            Object.values(messages).forEach(m=>{
                if(m.from!==currentUser.email && (!m.readBy || !m.readBy[myKey]))unreadCount++;
            });
        }else if(chatId.includes(myKey)){
            Object.values(messages).forEach(m=>{
                if(m.to===currentUser.email && !m.read)unreadCount++;
            });
        }
    });
    const badge=document.getElementById('messages-badge');
    if(!badge)return;
    if(unreadCount>0){badge.textContent=unreadCount;badge.style.display='inline-block';}
    else badge.style.display='none';
}

// ============ ГРУППЫ — СОЗДАНИЕ ============
function openGroupCreate(){
    selectedGroupMembers=[];
    document.getElementById('group-name-input').value='';
    document.getElementById('group-search-input').value='';
    document.getElementById('group-search-results').innerHTML='';
    document.getElementById('group-selected-members').innerHTML='';
    document.getElementById('group-create-modal').classList.add('show');
}

function closeGroupCreate(){document.getElementById('group-create-modal').classList.remove('show');}

function searchGroupMembers(){
    const query=document.getElementById('group-search-input').value.trim().toLowerCase();
    const results=document.getElementById('group-search-results');
    if(!query){results.innerHTML='';return;}
    const matched=Object.values(allUsers).filter(u=>u.name && u.name.toLowerCase().includes(query) && u.email!==currentUser.email && !selectedGroupMembers.includes(u.email));
    if(!matched.length){results.innerHTML='<p style="color:#555;text-align:center;padding:10px;">Не найдено</p>';return;}
    results.innerHTML='';
    matched.slice(0,10).forEach(u=>{
        const div=document.createElement('div');
        div.className='search-user-item';
        const av=u.avatarImg?`<img src="${u.avatarImg}">`:(u.avatar||'👤');
        div.innerHTML=`<div class="search-user-avatar">${av}</div><div class="search-user-info"><div class="search-user-name">${u.name}</div><div class="search-user-email">${u.email}</div></div>`;
        div.onclick=()=>addGroupMember(u.email,u.name);
        results.appendChild(div);
    });
}

function addGroupMember(email,name){
    if(selectedGroupMembers.length>=9){alert('Максимум 10 человек включая тебя!');return;}
    if(selectedGroupMembers.includes(email))return;
    selectedGroupMembers.push(email);
    renderSelectedMembers();
    document.getElementById('group-search-input').value='';
    document.getElementById('group-search-results').innerHTML='';
}

function removeGroupMember(email){
    selectedGroupMembers=selectedGroupMembers.filter(e=>e!==email);
    renderSelectedMembers();
}

function renderSelectedMembers(){
    const container=document.getElementById('group-selected-members');
    container.innerHTML='';
    selectedGroupMembers.forEach(email=>{
        const user=allUsers[emailToKey(email)];
        if(!user)return;
        const chip=document.createElement('div');
        chip.className='selected-member-chip';
        chip.innerHTML=`${user.name} <span class="remove-x" onclick="removeGroupMember('${email}')">✕</span>`;
        container.appendChild(chip);
    });
}

async function createGroup(){
    const name=document.getElementById('group-name-input').value.trim();
    if(!name){alert('Введи название группы!');return;}
    if(selectedGroupMembers.length<1){alert('Добавь хотя бы 1 участника!');return;}

    const members={};
    members[emailToKey(currentUser.email)]=true;
    selectedGroupMembers.forEach(email=>{members[emailToKey(email)]=true;});

    const group={
        name,
        members,
        createdBy:emailToKey(currentUser.email),
        createdAt:Date.now()
    };
    const newRef=window.fbPush(window.fbRef(window.fbDb,'groups'));
    await window.fbSet(newRef,group);
    closeGroupCreate();
    alert(`✅ Группа "${name}" создана!`);
}

// ============ АДМИН ============
function openAdmin(){
    if(!isModerator()){alert('Нет доступа!');return;}
    document.getElementById('admin-overlay').classList.add('show');

    // Скрываем накрутку и создание промокодов для раппорта
    const boostSection=document.getElementById('boost-form-section');
    const promoCreate=document.querySelector('.promo-create-form');
    if(currentUser.isAdmin){
        if(boostSection)boostSection.style.display='block';
        if(promoCreate)promoCreate.style.display='block';
    }else{
        if(boostSection)boostSection.style.display='none';
        if(promoCreate)promoCreate.style.display='none';
    }

    renderAdminStats();renderAdminUsers();renderAdminPayments();renderAdminComments();renderAdminTickets();renderAdminPromos();renderAdminEpisodes();fillPaymentUserSelect();fillBoostFollowersSelect();updateTicketsBadge();
}
function closeAdmin(){document.getElementById('admin-overlay').classList.remove('show');document.getElementById('admin-edit-form').classList.remove('show');}
function switchAdminTab(tab){const tabs=['users','payments','comments','tickets','promos','episodes'];document.querySelectorAll('.admin-tab').forEach((t,i)=>t.classList.toggle('active',tabs[i]===tab));tabs.forEach(t=>document.getElementById('admin-'+t).classList.toggle('active',t===tab));}
function updateTicketsBadge(){const n=allTickets.filter(t=>t.status==='new').length;const b=document.getElementById('tickets-badge');if(!b)return;if(n>0){b.textContent=n;b.style.display='inline-block';}else b.style.display='none';}

function renderAdminStats(){const users=Object.values(allUsers);const totalViews=Object.values(cachedViews).reduce((a,b)=>a+b,0);const totalLikes=Object.values(cachedLikes).reduce((a,b)=>{if(typeof b==='number')return a+b;return a+(b?b.length:0);},0);const banned=users.filter(u=>u.banned).length;const newT=allTickets.filter(t=>t.status==='new').length;const proCount=users.filter(u=>u.subscription==='pro').length;const luxCount=users.filter(u=>u.subscription==='lux').length;const basicCount=users.filter(u=>u.subscription==='basic'||u.subscription===true).length;const rapportCount=users.filter(u=>u.subscription==='rapport').length;const pissingCount=users.filter(u=>u.subscription==='pissing').length;const adminCount=users.filter(u=>u.isAdmin).length;const groupsCount=Object.keys(allGroups).length;document.getElementById('admin-stats').innerHTML=`<div class="stat-card"><div class="stat-number">${users.length}</div><div class="stat-label">Всего</div></div><div class="stat-card"><div class="stat-number" style="color:var(--red);">${adminCount}</div><div class="stat-label">Админы</div></div><div class="stat-card"><div class="stat-number" style="color:#00BCD4;">${rapportCount}</div><div class="stat-label">РАППОРТ</div></div><div class="stat-card"><div class="stat-number" style="color:var(--gold);">${proCount}</div><div class="stat-label">PRO</div></div><div class="stat-card"><div class="stat-number" style="color:#9C27B0;">${luxCount}</div><div class="stat-label">LUX</div></div><div class="stat-card"><div class="stat-number" style="color:var(--green);">${basicCount}</div><div class="stat-label">BASIC</div></div><div class="stat-card"><div class="stat-number" style="color:#FFEB3B;">${pissingCount}</div><div class="stat-label">ПИСАЮЩИЙ</div></div><div class="stat-card"><div class="stat-number">${totalViews}</div><div class="stat-label">Просмотров</div></div><div class="stat-card"><div class="stat-number" style="color:var(--red);">${totalLikes}</div><div class="stat-label">Лайков</div></div><div class="stat-card"><div class="stat-number">${allComments.length}</div><div class="stat-label">Комментариев</div></div><div class="stat-card"><div class="stat-number" style="color:orange;">${banned}</div><div class="stat-label">Забанено</div></div><div class="stat-card"><div class="stat-number" style="color:var(--blue);">${newT}</div><div class="stat-label">Обращений</div></div><div class="stat-card"><div class="stat-number" style="color:var(--gold);">${groupsCount}</div><div class="stat-label">Групп</div></div>`;}

function renderAdminUsers(){const users=Object.entries(allUsers);const tb=document.getElementById('admin-users-body');tb.innerHTML='';users.forEach(([key,u])=>{let badge='';if(u.banned)badge='<span class="badge-banned">🚫</span>';else if(u.isAdmin)badge='<span class="badge-admin">🔧 АДМИН</span>';else if(u.subscription==='rapport')badge='<span class="badge-rapport">🛡️ RAPPORT</span>';else if(u.subscription==='pro')badge='<span class="badge-pro">👑 PRO</span>';else if(u.subscription==='lux')badge='<span class="badge-lux">💎 LUX</span>';else if(u.subscription==='basic'||u.subscription===true)badge='<span class="badge-basic">🎬 BASIC</span>';else if(u.subscription==='pissing')badge='<span class="badge-pissing">💧 ПИС</span>';else badge='<span class="badge-free">—</span>';const tr=document.createElement('tr');const isAdminUser=currentUser&&currentUser.isAdmin;tr.innerHTML=`<td>${u.email}</td><td style="cursor:pointer;" onclick="openUserProfile('${u.email}')">${u.avatar||'👤'} ${u.name||'—'}</td><td>${(u.wallet?.RUB||0).toFixed(2)} ₽</td><td>${badge}</td><td>${isAdminUser?`<button class="action-btn pissing-btn-admin" onclick="adminGiveSub('${key}','pissing')">💧</button><button class="action-btn green" onclick="adminGiveSub('${key}','basic')">🎬</button><button class="action-btn lux" onclick="adminGiveSub('${key}','lux')">💎</button><button class="action-btn gold" onclick="adminGiveSub('${key}','pro')">👑</button><button class="action-btn rapport" onclick="adminGiveSub('${key}','rapport')">🛡️</button><button class="action-btn red" onclick="adminRemoveSub('${key}')">❌</button>${u.email!==ADMIN_EMAIL?`<button class="action-btn ${u.isAdmin?'orange':'admin-btn'}" onclick="adminToggleAdmin('${key}')">${u.isAdmin?'❌🔧':'🔧'}</button>`:''}`:''}<button class="action-btn ${u.banned?'green':'orange'}" onclick="adminToggleBan('${key}')">${u.banned?'✅':'🚫'}</button>${isAdminUser?`<button class="action-btn gray" onclick="adminEditUser('${key}')">✏️</button>${u.email!==ADMIN_EMAIL?`<button class="action-btn red" onclick="adminDeleteUser('${key}')">🗑</button>`:''}`:''}</td>`;tb.appendChild(tr);});}

async function adminGiveSub(key,type){if(!currentUser.isAdmin){alert('Только админ!');return;}await fbUpdatePath(`users/${key}`,{subscription:type});alert('✅ Готово!');}
async function adminRemoveSub(key){if(!currentUser.isAdmin){alert('Только админ!');return;}await fbUpdatePath(`users/${key}`,{subscription:false});}
async function adminToggleAdmin(key){if(!currentUser.isAdmin){alert('Только админ!');return;}const u=allUsers[key];if(u.email===ADMIN_EMAIL){alert('Нельзя!');return;}const newStatus=!u.isAdmin;if(!confirm(newStatus?`Сделать ${u.email} админом?`:`Убрать админку у ${u.email}?`))return;await fbUpdatePath(`users/${key}`,{isAdmin:newStatus});alert(newStatus?'✅ Админка выдана!':'✅ Снята!');}
async function adminToggleBan(key){const u=allUsers[key];if(u.email===ADMIN_EMAIL){alert('Нельзя!');return;}await fbUpdatePath(`users/${key}`,{banned:!u.banned});}
function adminEditUser(key){if(!currentUser.isAdmin){alert('Только админ!');return;}const u=allUsers[key];document.getElementById('edit-user-email').value=u.email;document.getElementById('edit-user-name').value=u.name||'';document.getElementById('edit-user-avatar').value=u.avatar||'';document.getElementById('edit-user-bio').value=u.bio||'';document.getElementById('admin-edit-form').classList.add('show');}
async function saveEditUser(){const email=document.getElementById('edit-user-email').value;const key=emailToKey(email);const nn=document.getElementById('edit-user-name').value.trim();const na=document.getElementById('edit-user-avatar').value.trim();const nb=document.getElementById('edit-user-bio').value.trim();const updates={};if(nn)updates.name=nn;if(na)updates.avatar=na;updates.bio=nb;await fbUpdatePath(`users/${key}`,updates);document.getElementById('admin-edit-form').classList.remove('show');alert('✅ Обновлено!');}
function cancelEditUser(){document.getElementById('admin-edit-form').classList.remove('show');}
async function adminDeleteUser(key){if(!currentUser.isAdmin){alert('Только админ!');return;}const u=allUsers[key];if(u.email===ADMIN_EMAIL){alert('Нельзя!');return;}if(!confirm(`Удалить ${u.email}?`))return;await fbRemovePath(`users/${key}`);}

function fillPaymentUserSelect(){const s=document.getElementById('pay-user-select');if(!s)return;s.innerHTML='<option value="">Выбери</option>';Object.values(allUsers).forEach(x=>{const opt=document.createElement('option');opt.value=x.email;opt.textContent=`${x.name} (${x.email})`;s.appendChild(opt);});}
async function recordPayment(){if(!currentUser.isAdmin){alert('Только админ!');return;}const email=document.getElementById('pay-user-select').value;const amount=parseFloat(document.getElementById('pay-amount').value);if(!email||!amount||amount<=0){alert('Заполни всё!');return;}const key=emailToKey(email);const user=allUsers[key];if(!user)return;const newWallet={...user.wallet};newWallet.RUB=(newWallet.RUB||0)+amount;await fbUpdatePath(`users/${key}`,{wallet:newWallet});const payRef=window.fbPush(window.fbRef(window.fbDb,'payments'));await window.fbSet(payRef,{date:new Date().toLocaleString('ru-RU'),email,name:user.name,amount,timestamp:Date.now()});document.getElementById('pay-amount').value='';document.getElementById('pay-user-select').value='';renderAdminPayments();alert(`✅ +${amount} ₽`);}
async function renderAdminPayments(){const payments=await fbReadOnce('payments')||{};const arr=Object.values(payments).sort((a,b)=>(b.timestamp||0)-(a.timestamp||0));const tb=document.getElementById('admin-payments-body');tb.innerHTML='';if(!arr.length){tb.innerHTML='<tr><td colspan="4" style="color:#555;text-align:center;">Пусто</td></tr>';return;}arr.forEach(x=>{const tr=document.createElement('tr');tr.innerHTML=`<td>${x.date}</td><td>${x.email}</td><td>${x.name||'—'}</td><td style="color:var(--green);">+${x.amount} ₽</td>`;tb.appendChild(tr);});}

function renderAdminComments(){const tb=document.getElementById('admin-comments-body');tb.innerHTML='';if(!allComments.length){tb.innerHTML='<tr><td colspan="5" style="color:#555;text-align:center;">Пусто</td></tr>';return;}const sorted=[...allComments].sort((a,b)=>(b.timestamp||0)-(a.timestamp||0));sorted.forEach(x=>{const tr=document.createElement('tr');tr.innerHTML=`<td>${x.date}</td><td>${x.author}</td><td>${x.serialId} #${x.epNum}</td><td>${x.text.substring(0,50).replace(/</g,'&lt;')}${x.text.length>50?'...':''}</td><td><button class="action-btn red" onclick="adminDeleteComment('${x.id}')">🗑</button></td>`;tb.appendChild(tr);});}
async function adminDeleteComment(id){if(!confirm('Удалить?'))return;await fbRemovePath(`comments/${id}`);}

function renderAdminTickets(){const l=document.getElementById('admin-tickets-list');if(!allTickets.length){l.innerHTML='<p style="color:#555;text-align:center;padding:30px;">Пусто</p>';return;}l.innerHTML='';const sorted=[...allTickets].sort((a,b)=>(b.timestamp||0)-(a.timestamp||0));sorted.forEach(x=>{let st='',sc='';if(x.status==='new'){st='⏳ Новое';sc='new';}else if(x.status==='answered'){st='✅ Отвечено';sc='answered';}else{st='🔒 Закрыто';sc='closed';}const div=document.createElement('div');div.className='admin-ticket-detail'+(x.status==='new'?' unanswered':'');div.innerHTML=`<div class="admin-ticket-header"><div><span class="admin-ticket-user">${x.avatar||'👤'} ${x.name}<span class="email">${x.email}</span></span></div><span class="ticket-status ${sc}">${st}</span></div><div style="color:#888;font-size:0.85rem;margin-bottom:5px;"><strong>Тема:</strong> ${x.topic}</div><div style="color:#555;font-size:0.75rem;">${x.date}</div><div class="admin-ticket-msg">${x.message.replace(/</g,'&lt;')}</div>${x.answer?`<div style="background:#0a2a0a;padding:12px;border-radius:8px;margin-top:10px;border-left:3px solid var(--green);"><div style="color:var(--green);font-size:0.75rem;margin-bottom:5px;">ОТВЕТ (${x.answerDate}):</div><div style="color:#ccc;">${x.answer.replace(/</g,'&lt;')}</div></div>`:''}<div class="admin-ticket-actions">${x.status!=='answered'?`<button class="action-btn green" onclick="showReplyForm('${x.id}')">💬 Ответить</button>`:''}${x.status!=='closed'?`<button class="action-btn gray" onclick="closeTicket('${x.id}')">🔒</button>`:''}<button class="action-btn red" onclick="deleteTicket('${x.id}')">🗑</button></div><div class="admin-reply-form" id="reply-form-${x.id}"><textarea id="reply-text-${x.id}" placeholder="Ответ..."></textarea><div style="margin-top:10px;display:flex;gap:8px;"><button class="action-btn green" onclick="sendReply('${x.id}')">📤</button><button class="action-btn gray" onclick="hideReplyForm('${x.id}')">ОТМЕНА</button></div></div>`;l.appendChild(div);});}
function showReplyForm(id){document.getElementById('reply-form-'+id).classList.add('show');}
function hideReplyForm(id){document.getElementById('reply-form-'+id).classList.remove('show');}
async function sendReply(id){const text=document.getElementById('reply-text-'+id).value.trim();if(!text){alert('Напиши!');return;}await fbUpdatePath(`tickets/${id}`,{answer:text,answerDate:new Date().toLocaleString('ru-RU'),status:'answered'});alert('✅');}
async function closeTicket(id){if(!confirm('Закрыть?'))return;await fbUpdatePath(`tickets/${id}`,{status:'closed'});}
async function deleteTicket(id){if(!confirm('Удалить?'))return;await fbRemovePath(`tickets/${id}`);}

// ПРОМОКОДЫ
async function createPromo(){if(!currentUser.isAdmin){alert('Только админ!');return;}const code=document.getElementById('new-promo-code').value.trim().toUpperCase();const subType=document.getElementById('new-promo-subtype').value;const maxUses=parseInt(document.getElementById('new-promo-uses').value);if(!code){alert('Введи код!');return;}if(!subType){alert('Выбери подписку!');return;}if(!maxUses||maxUses<=0){alert('Использования!');return;}if(cachedPromos.find(x=>x.code===code)){alert('Уже есть!');return;}let minutes=0;if(subType==='basic-temp'){minutes=parseInt(document.getElementById('new-promo-minutes').value);if(!minutes||minutes<=0){alert('Введи минуты!');return;}await fbPushPromo({code,subType:'basic',minutes,maxUses,uses:0,usedBy:[],createdAt:new Date().toLocaleString('ru-RU'),isTemp:true});}else{await fbPushPromo({code,subType,minutes:0,maxUses,uses:0,usedBy:[],createdAt:new Date().toLocaleString('ru-RU'),isTemp:false});}document.getElementById('new-promo-code').value='';alert(`✅ "${code}" создан!`);}

function renderAdminPromos(){const tb=document.getElementById('admin-promos-body');tb.innerHTML='';if(!cachedPromos.length){tb.innerHTML='<tr><td colspan="5" style="color:#555;text-align:center;">Пусто</td></tr>';return;}cachedPromos.forEach(x=>{const tr=document.createElement('tr');let subName=x.subType||'basic';if(x.isTemp)subName=`BASIC (${x.minutes} мин)`;else subName=SUBSCRIPTIONS[x.subType]?.name||subName.toUpperCase();tr.innerHTML=`<td style="color:var(--gold);font-weight:700;">${x.code}</td><td>${subName}</td><td>${x.uses} / ${x.maxUses}</td><td>${x.createdAt}</td><td><button class="action-btn red" onclick="deletePromo('${x.id}')">🗑</button></td>`;tb.appendChild(tr);});}

// Раппорт ТОЖЕ может удалять промокоды
async function deletePromo(id){if(!isModerator()){alert('Нет доступа!');return;}if(!confirm('Удалить?'))return;await fbRemovePath(`promos/${id}`);}

function renderAdminEpisodes(){const list=document.getElementById('admin-episodes-list');if(!list)return;list.innerHTML='';for(let i=1;i<=TOTAL_EPISODES;i++){const blocked=isEpisodeBlocked(i);const card=document.createElement('div');card.className='ep-card'+(blocked?' admin-locked':'');card.innerHTML=`<h3>СЕРИЯ ${i}</h3><button class="ep-admin-toggle ${blocked?'unlocked':''}" onclick="toggleEpisodeBlock(${i})">${blocked?'✅ РАЗБЛ.':'🚫 БЛОК.'}</button>`;list.appendChild(card);}}

// ============ НАКРУТКА ============
async function boostViews(){
    if(!currentUser.isAdmin){alert('Только админ!');return;}
    const ep=parseInt(document.getElementById('boost-views-ep').value);
    const count=parseInt(document.getElementById('boost-views-count').value);
    if(!ep||ep<1||ep>TOTAL_EPISODES){alert('Серия от 1 до '+TOTAL_EPISODES);return;}
    if(!count||count<1){alert('Введи количество!');return;}
    const path=`views/the-ded_${ep}`;
    const current=await fbReadOnce(path)||0;
    await fbWrite(path,current+count);
    document.getElementById('boost-views-ep').value='';
    document.getElementById('boost-views-count').value='';
    alert(`✅ Серия ${ep}: +${count} просмотров (всего ${current+count})`);
}

async function boostLikes(){
    if(!currentUser.isAdmin){alert('Только админ!');return;}
    const ep=parseInt(document.getElementById('boost-likes-ep').value);
    const count=parseInt(document.getElementById('boost-likes-count').value);
    if(!ep||ep<1||ep>TOTAL_EPISODES){alert('Серия от 1 до '+TOTAL_EPISODES);return;}
    if(!count||count<1){alert('Введи количество!');return;}
    const path=`likes/the-ded_${ep}`;
    let current=await fbReadOnce(path)||0;
    // Если массив — превращаем в число
    if(Array.isArray(current))current=current.length;
    await fbWrite(path,current+count);
    document.getElementById('boost-likes-ep').value='';
    document.getElementById('boost-likes-count').value='';
    alert(`✅ Серия ${ep}: +${count} лайков (всего ${current+count})`);
    if(currentSerial&&currentEpList[currentEpIndex]&&currentEpList[currentEpIndex].number===ep)updateLikeDisplay();
}

async function boostFollowers(){
    if(!currentUser.isAdmin){alert('Только админ!');return;}
    const email=document.getElementById('boost-followers-user').value;
    const count=parseInt(document.getElementById('boost-followers-count').value);
    if(!email){alert('Выбери пользователя!');return;}
    if(!count||count<1){alert('Введи количество!');return;}
    const key=emailToKey(email);
    const user=allUsers[key];
    if(!user)return;
    const current=user.extraFollowers||0;
    await fbUpdatePath(`users/${key}`,{extraFollowers:current+count});
    document.getElementById('boost-followers-count').value='';
    document.getElementById('boost-followers-user').value='';
    alert(`✅ ${user.name}: +${count} подписчиков (всего накручено ${current+count})`);
}

function fillBoostFollowersSelect(){
    const s=document.getElementById('boost-followers-user');
    if(!s)return;
    s.innerHTML='<option value="">Выбери пользователя</option>';
    Object.values(allUsers).forEach(x=>{
        const opt=document.createElement('option');
        opt.value=x.email;
        opt.textContent=`${x.name} (${x.email})`;
        s.appendChild(opt);
    });
}
// ============ НОВЫЕ ПЕРЕМЕННЫЕ ============
let replyingToMessage = null;
let mediaRecorder = null;
let audioChunks = [];
let isRecording = false;
let pendingModeration = {};

// ============ СЛУШАТЕЛЬ МОДЕРАЦИИ ============
function setupModerationListener(){
    if(firebaseReady){
        fbListen('moderation',(data)=>{
            pendingModeration = data || {};
            if(typeof updateModerationBadge==='function')updateModerationBadge();
            if(typeof renderModerationList==='function' && document.getElementById('admin-overlay').classList.contains('show'))renderModerationList();
        });
    }else{
        setTimeout(setupModerationListener,500);
    }
}
setupModerationListener();

// ============ ФОТО В ЧАТЕ ============
function attachPhoto(target, chatType){
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if(!file) return;
        if(file.size > 3000000){
            alert('Максимум 3 МБ!');
            return;
        }
        const reader = new FileReader();
        reader.onload = function(ev){
            const img = new Image();
            img.onload = async function(){
                // Сжимаем фото
                const canvas = document.createElement('canvas');
                const maxSize = 600;
                let w = img.width, h = img.height;
                if(w > h){
                    if(w > maxSize){ h = h * (maxSize/w); w = maxSize; }
                } else {
                    if(h > maxSize){ w = w * (maxSize/h); h = maxSize; }
                }
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, w, h);
                const dataUrl = canvas.toDataURL('image/jpeg', 0.75);

                // Отправляем на модерацию
                const modItem = {
                    from: currentUser.email,
                    fromName: currentUser.name,
                    target: target,
                    chatType: chatType,
                    type: 'photo',
                    content: dataUrl,
                    date: new Date().toLocaleString('ru-RU'),
                    timestamp: Date.now(),
                    status: 'pending'
                };
                const newRef = window.fbPush(window.fbRef(window.fbDb, 'moderation'));
                await window.fbSet(newRef, modItem);
                alert('✅ Фото отправлено на модерацию! Оно появится в чате после одобрения администратором.');
            };
            img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
    };
    input.click();
}

// ============ ГОЛОСОВЫЕ ============
async function toggleVoiceRecord(target, chatType){
    const btn = document.getElementById('voice-btn');
    if(!btn) return;

    if(!isRecording){
        // Проверка поддержки браузером
        if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
            alert('❌ Твой браузер не поддерживает запись голосовых. Попробуй Chrome или Edge.');
            return;
        }

        // Проверка HTTPS
        if(location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1' && !location.protocol.startsWith('file')){
            alert('❌ Голосовые работают только на HTTPS сайтах!');
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Определяем поддерживаемый формат
            let mimeType = 'audio/webm';
            if(!MediaRecorder.isTypeSupported(mimeType)){
                mimeType = 'audio/mp4';
                if(!MediaRecorder.isTypeSupported(mimeType)){
                    mimeType = '';
                }
            }

            mediaRecorder = mimeType ? new MediaRecorder(stream, {mimeType}) : new MediaRecorder(stream);
            audioChunks = [];

            mediaRecorder.ondataavailable = (e) => {
                if(e.data && e.data.size > 0){
                    audioChunks.push(e.data);
                }
            };

            mediaRecorder.onstop = async () => {
                stream.getTracks().forEach(t => t.stop());

                if(audioChunks.length === 0){
                    alert('❌ Ничего не записалось!');
                    return;
                }

                const blob = new Blob(audioChunks, { type: mimeType || 'audio/webm' });

                if(blob.size > 800000){
                    alert('❌ Голосовое слишком длинное! Максимум 30 секунд.');
                    return;
                }

                if(blob.size < 1000){
                    alert('❌ Слишком короткая запись!');
                    return;
                }

                const reader = new FileReader();
                reader.onload = async function(ev){
                    const dataUrl = ev.target.result;
                    const modItem = {
                        from: currentUser.email,
                        fromName: currentUser.name,
                        target: target,
                        chatType: chatType,
                        type: 'voice',
                        content: dataUrl,
                        date: new Date().toLocaleString('ru-RU'),
                        timestamp: Date.now(),
                        status: 'pending'
                    };
                    const newRef = window.fbPush(window.fbRef(window.fbDb, 'moderation'));
                    await window.fbSet(newRef, modItem);
                    alert('✅ Голосовое отправлено на модерацию!');
                };
                reader.onerror = () => {
                    alert('❌ Ошибка при обработке записи');
                };
                reader.readAsDataURL(blob);
            };

            mediaRecorder.onerror = (e) => {
                console.error('Ошибка записи:', e);
                alert('❌ Ошибка записи! Попробуй ещё раз.');
                isRecording = false;
                btn.classList.remove('recording');
                btn.textContent = '🎤';
            };

            mediaRecorder.start();
            isRecording = true;
            btn.classList.add('recording');
            btn.textContent = '⏹️';

            // Автостоп через 30 секунд
            setTimeout(() => {
                if(isRecording && mediaRecorder && mediaRecorder.state === 'recording'){
                    mediaRecorder.stop();
                    isRecording = false;
                    btn.classList.remove('recording');
                    btn.textContent = '🎤';
                }
            }, 30000);

        } catch(err) {
            console.error('Ошибка микрофона:', err);
            if(err.name === 'NotAllowedError'){
                alert('❌ Ты запретил доступ к микрофону!\n\nЧтобы разрешить:\n1. Нажми на замочек 🔒 слева от адреса сайта\n2. Разреши микрофон\n3. Обнови страницу');
            } else if(err.name === 'NotFoundError'){
                alert('❌ Микрофон не найден!');
            } else {
                alert('❌ Ошибка: ' + err.message);
            }
        }
    } else {
        // Останавливаем запись
        if(mediaRecorder && mediaRecorder.state === 'recording'){
            mediaRecorder.stop();
        }
        isRecording = false;
        btn.classList.remove('recording');
        btn.textContent = '🎤';
    }
}

function playVoiceMessage(dataUrl){
    const audio = new Audio(dataUrl);
    audio.play();
}

// ============ РЕАКЦИИ ============
function toggleReactionPicker(msgId){
    const picker = document.getElementById('picker-' + msgId);
    if(!picker) return;
    // Закрываем все другие
    document.querySelectorAll('.reaction-picker').forEach(p => {
        if(p.id !== 'picker-' + msgId) p.classList.remove('show');
    });
    picker.classList.toggle('show');
}

async function addReaction(msgId, emoji, chatId){
    if(!currentUser) return;
    const msgRef = `messages/${chatId}/${msgId}/reactions`;
    const current = await fbReadOnce(msgRef) || {};

    // Проверяем есть ли уже реакция от этого юзера
    const myKey = emailToKey(currentUser.email);

    // Убираем старую реакцию если есть
    Object.keys(current).forEach(e => {
        if(current[e] && current[e][myKey]){
            delete current[e][myKey];
            if(Object.keys(current[e]).length === 0){
                delete current[e];
            }
        }
    });

    // Добавляем новую (или убираем если та же)
    if(!current[emoji]) current[emoji] = {};
    if(!current[emoji][myKey]){
        current[emoji][myKey] = true;
    }

    await fbWrite(msgRef, current);
    // Прячем пикер
    const picker = document.getElementById('picker-' + msgId);
    if(picker) picker.classList.remove('show');
}

// ============ ОТВЕТ НА СООБЩЕНИЕ ============
function replyToMessage(msgId, chatId){
    const messages = allMessages[chatId] || {};
    const msg = messages[msgId];
    if(!msg) return;

    replyingToMessage = {
        id: msgId,
        author: msg.authorName || (allUsers[emailToKey(msg.from)] ? allUsers[emailToKey(msg.from)].name : 'Кто-то'),
        text: msg.text || (msg.type === 'photo' ? '📷 Фото' : msg.type === 'voice' ? '🎤 Голосовое' : msg.type === 'sticker' ? '🎨 Стикер' : 'Сообщение')
    };
    updateReplyIndicator();

    const input = document.getElementById('chat-input-text');
    if(input) input.focus();
}

function updateReplyIndicator(){
    const ind = document.getElementById('reply-indicator');
    if(!ind) return;
    if(replyingToMessage){
        document.getElementById('reply-indicator-author').textContent = 'Ответ: ' + replyingToMessage.author;
        document.getElementById('reply-indicator-text').textContent = replyingToMessage.text;
        ind.classList.add('show');
    } else {
        ind.classList.remove('show');
    }
}

function cancelReply(){
    replyingToMessage = null;
    updateReplyIndicator();
}

// ============ СТИКЕРЫ ============
const STICKERS = ['😀','😂','🥰','😎','🤩','😴','🥺','😭','😱','🤯','🥳','😈','👻','🤖','👽','🎃','💀','🔥','❤️','💯','⭐','🎉','🏆','👑','💎','🌟','⚡','🌈','🚀','🎬','🎮','🍕','🎁','🎯','🎨','🐺','🦁','🐯','🦊','🐻'];

function toggleStickerPicker(){
    const picker = document.getElementById('sticker-picker');
    if(!picker) return;
    if(picker.classList.contains('show')){
        picker.classList.remove('show');
        return;
    }
    renderStickerPicker();
    picker.classList.add('show');
    // Прячем другие пикеры
    const emoji = document.getElementById('emoji-picker');
    if(emoji) emoji.classList.remove('show');
}

function renderStickerPicker(){
    const picker = document.getElementById('sticker-picker');
    if(!picker) return;
    picker.innerHTML = '<div class="emoji-section-title" style="color:var(--gold);">🎨 СТИКЕРЫ (только для PRO+)</div>';
    const grid = document.createElement('div');
    grid.className = 'sticker-grid';

    const canUse = hasProAccess();

    STICKERS.forEach(s => {
        const div = document.createElement('div');
        div.className = 'sticker-item' + (!canUse ? ' locked' : '');
        div.textContent = s;
        div.onclick = () => {
            if(!canUse){
                alert('🔒 Стикеры доступны только для PRO+ подписки!');
                return;
            }
            sendSticker(s);
        };
        grid.appendChild(div);
    });
    picker.appendChild(grid);
}

function hasProAccess(){
    const level = getUserSubLevel();
    return level === 'pro' || level === 'rapport';
}

async function sendSticker(sticker){
    if(!currentUser || currentUser.banned) return;
    if(!currentChatId) return;

    const isGroup = currentChatType === 'group';
    let msg;
    if(isGroup){
        msg = {
            from: currentUser.email,
            authorName: currentUser.name,
            text: '',
            sticker: sticker,
            type: 'sticker',
            date: new Date().toLocaleString('ru-RU'),
            timestamp: Date.now(),
            readBy: {[emailToKey(currentUser.email)]: true},
            reactions: {}
        };
    } else {
        const otherEmail = currentChatUser ? currentChatUser.email : null;
        if(!otherEmail) return;
        msg = {
            from: currentUser.email,
            to: otherEmail,
            text: '',
            sticker: sticker,
            type: 'sticker',
            date: new Date().toLocaleString('ru-RU'),
            timestamp: Date.now(),
            read: false,
            reactions: {}
        };
    }
    const newRef = window.fbPush(window.fbRef(window.fbDb, `messages/${currentChatId}`));
    await window.fbSet(newRef, msg);
    document.getElementById('sticker-picker').classList.remove('show');
    setTimeout(() => {
        const area = document.getElementById('chat-messages-area');
        if(area) area.scrollTop = area.scrollHeight;
    }, 100);
}

// ============ АВТО ТЕМА (НОЧЬ/ДЕНЬ) ============
function checkAutoTheme(){
    if(!currentUser) return;
    if(currentUser.theme && currentUser.theme !== 'auto') return;

    const hour = new Date().getHours();
    // С 20:00 до 8:00 — тёмная (default), иначе светлая
    if(hour >= 20 || hour < 8){
        document.body.className = '';
    } else {
        document.body.className = 'theme-light';
    }
}

// Проверяем каждую минуту
setInterval(checkAutoTheme, 60000);

// ============ МОДЕРАЦИЯ (АДМИН) ============
function updateModerationBadge(){
    const count = Object.values(pendingModeration).filter(m => m.status === 'pending').length;
    const badge = document.getElementById('moderation-badge');
    if(!badge) return;
    if(count > 0){
        badge.textContent = count;
        badge.style.display = 'inline-block';
    } else {
        badge.style.display = 'none';
    }
}

function renderModerationList(){
    const list = document.getElementById('moderation-list');
    if(!list) return;
    const items = Object.entries(pendingModeration).filter(([id,m]) => m.status === 'pending').sort((a,b) => (b[1].timestamp||0) - (a[1].timestamp||0));

    if(!items.length){
        list.innerHTML = '<p style="color:#555;text-align:center;padding:30px;">Нет контента на модерации ✅</p>';
        return;
    }

    list.innerHTML = '';
    items.forEach(([id,m]) => {
        const div = document.createElement('div');
        div.className = 'moderation-item';

        let contentHTML = '';
        if(m.type === 'photo'){
            contentHTML = `<img src="${m.content}" class="moderation-photo" alt="Фото">`;
                } else if(m.type === 'voice'){
            contentHTML = `
                <div style="background:#0a0a0a;padding:15px;border-radius:10px;margin:10px 0;">
                    <div style="color:#FF9800;font-size:0.85rem;margin-bottom:10px;">🎤 Голосовое сообщение</div>
                    <audio controls style="width:100%;max-width:400px;" src="${m.content}"></audio>
                    <div style="color:#666;font-size:0.75rem;margin-top:5px;">Прослушай перед одобрением</div>
                </div>
            `;
        }

        const targetInfo = m.chatType === 'group'
            ? `Групповой чат (ID: ${m.target})`
            : `Личный чат с ${m.target}`;

        div.innerHTML = `
            <div class="moderation-info">
                <div>
                    <div class="moderation-user">📤 От: ${m.fromName} (${m.from})</div>
                    <div style="color:#888;font-size:0.85rem;margin-top:3px;">💬 ${targetInfo}</div>
                </div>
                <div class="moderation-date">${m.date}</div>
            </div>
            <div>${contentHTML}</div>
            <div class="moderation-actions">
                <button class="action-btn green" onclick="approveModeration('${id}')">✅ ОДОБРИТЬ</button>
                <button class="action-btn red" onclick="rejectModeration('${id}')">❌ ОТКЛОНИТЬ</button>
            </div>
        `;
        list.appendChild(div);
    });
}

async function approveModeration(id){
    const item = pendingModeration[id];
    if(!item) return;

    let msg;
    let chatId;

    if(item.chatType === 'group'){
        chatId = 'group_' + item.target;
        msg = {
            from: item.from,
            authorName: item.fromName,
            text: '',
            type: item.type,
            date: new Date().toLocaleString('ru-RU'),
            timestamp: Date.now(),
            readBy: {[emailToKey(item.from)]: true},
            reactions: {}
        };
    } else {
        chatId = getChatId(item.from, item.target);
        msg = {
            from: item.from,
            to: item.target,
            text: '',
            type: item.type,
            date: new Date().toLocaleString('ru-RU'),
            timestamp: Date.now(),
            read: false,
            reactions: {}
        };
    }

    if(item.type === 'photo'){
        msg.photo = item.content;
    } else if(item.type === 'voice'){
        msg.voice = item.content;
        msg.duration = item.duration || 0;
    }

    // Отправляем сообщение в чат
    const newRef = window.fbPush(window.fbRef(window.fbDb, `messages/${chatId}`));
    await window.fbSet(newRef, msg);

    // Удаляем из модерации
    await fbRemovePath(`moderation/${id}`);

    alert('✅ Одобрено! Отправлено в чат.');
}

async function rejectModeration(id){
    if(!confirm('Отклонить это сообщение?')) return;
    await fbRemovePath(`moderation/${id}`);
    alert('❌ Отклонено и удалено.');
}

// Обновим switchAdminTab
const originalSwitchAdminTab = switchAdminTab;
switchAdminTab = function(tab){
    const tabs=['users','payments','comments','tickets','promos','episodes','moderation'];
    document.querySelectorAll('.admin-tab').forEach((t,i)=>t.classList.toggle('active',tabs[i]===tab));
    tabs.forEach(t=>{
        const el = document.getElementById('admin-'+t);
        if(el) el.classList.toggle('active',t===tab);
    });
    if(tab === 'moderation') renderModerationList();
};

// Обновим openAdmin для рендера модерации
const originalOpenAdmin = openAdmin;
openAdmin = function(){
    originalOpenAdmin();
    renderModerationList();
    updateModerationBadge();
};
// ============================================
//  НОВЫЕ ФИЧИ: НОВОСТИ, ДР, ТОП, НАПОМИНАНИЯ, СЕЗОНЫ, ЗВОНКИ
// ============================================

let allNews = {};
let allReminders = {};
let selectedReminderMinutes = null;
let currentTopTab = 'comments';
let checkedNews = {};

// ============ СЛУШАТЕЛИ ФАЙРБЕЙС ============
function setupNewsListener(){
    if(firebaseReady){
        fbListen('news',(data)=>{
            allNews = data || {};
            if(typeof renderNews==='function')renderNews();
            if(typeof updateNewsBadge==='function')updateNewsBadge();
        });
    }else{
        setTimeout(setupNewsListener,500);
    }
}
setupNewsListener();

function setupRemindersListener(){
    if(firebaseReady){
        fbListen('reminders',(data)=>{
            allReminders = data || {};
            if(typeof renderReminders==='function')renderReminders();
            if(typeof checkReminders==='function')checkReminders();
        });
    }else{
        setTimeout(setupRemindersListener,500);
    }
}
setupRemindersListener();

// ============ ЗВОНКИ ЧЕРЕЗ JITSI ============
async function startCall(target, chatType, isVideo){
    if(!currentUser){alert('Войди!');return;}
    if(currentUser.banned){alert('Заблокирован!');return;}

    // Генерируем уникальную комнату
    const roomName = 'THEDED_' + Date.now() + '_' + Math.random().toString(36).substring(7);
    const callType = isVideo ? 'video' : 'voice';
    const callTypeText = isVideo ? '📹 Видеозвонок' : '📞 Голосовой звонок';
    const jitsiUrl = `https://meet.jit.si/${roomName}`;

    // Отправляем сообщение с приглашением
    let chatId;
    let msg;

    if(chatType === 'group'){
        chatId = 'group_' + target;
        msg = {
            from: currentUser.email,
            authorName: currentUser.name,
            text: '',
            type: 'call',
            callType: callType,
            callUrl: jitsiUrl,
            callActive: true,
            date: new Date().toLocaleString('ru-RU'),
            timestamp: Date.now(),
            readBy: {[emailToKey(currentUser.email)]: true},
            reactions: {}
        };
    } else {
        chatId = getChatId(currentUser.email, target);
        msg = {
            from: currentUser.email,
            to: target,
            text: '',
            type: 'call',
            callType: callType,
            callUrl: jitsiUrl,
            callActive: true,
            date: new Date().toLocaleString('ru-RU'),
            timestamp: Date.now(),
            read: false,
            reactions: {}
        };
    }

    const newRef = window.fbPush(window.fbRef(window.fbDb, `messages/${chatId}`));
    await window.fbSet(newRef, msg);

    // Открываем звонок в новой вкладке
    window.open(jitsiUrl, '_blank');
}

function joinCall(url){
    window.open(url, '_blank');
}

// ============ НОВОСТИ ============
async function createNews(){
    if(!currentUser || !currentUser.isAdmin){alert('Только для админов!');return;}

    const title = document.getElementById('news-title-input').value.trim();
    const text = document.getElementById('news-text-input').value.trim();
    const important = document.getElementById('news-important').checked;

    if(!title){alert('Введи заголовок!');return;}
    if(!text){alert('Введи текст!');return;}

    const news = {
        title: title,
        text: text,
        important: important,
        author: currentUser.name,
        authorEmail: currentUser.email,
        date: new Date().toLocaleString('ru-RU'),
        timestamp: Date.now()
    };

    const newRef = window.fbPush(window.fbRef(window.fbDb, 'news'));
    await window.fbSet(newRef, news);

    document.getElementById('news-title-input').value = '';
    document.getElementById('news-text-input').value = '';
    document.getElementById('news-important').checked = false;

    alert('✅ Новость опубликована!');
}

async function deleteNews(id){
    if(!confirm('Удалить новость?'))return;
    await fbRemovePath(`news/${id}`);
    alert('✅ Удалено!');
}

function renderNews(){
    const list = document.getElementById('news-list');
    if(!list)return;

    // Показываем/скрываем форму создания
    const createForm = document.getElementById('news-create-form');
    if(createForm && currentUser){
        createForm.style.display = currentUser.isAdmin ? 'block' : 'none';
    }

    const arr = Object.entries(allNews)
        .map(([id, n]) => ({...n, id}))
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    if(!arr.length){
        list.innerHTML = '<p style="color:#555;text-align:center;padding:40px;">Пока нет новостей 📭</p>';
        return;
    }

    list.innerHTML = '';
    arr.forEach(n => {
        const div = document.createElement('div');
        div.className = 'news-item' + (n.important ? ' important' : '');
        div.innerHTML = `
            <div class="news-item-header">
                <div class="news-item-title">${n.important ? '⭐ ' : ''}${n.title.replace(/</g,'&lt;')}</div>
                <div class="news-item-date">${n.date}</div>
            </div>
            <div class="news-item-text">${n.text.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>
            <div class="news-item-author">— ${n.author}</div>
            ${currentUser && currentUser.isAdmin ? `<button class="news-delete-btn" onclick="deleteNews('${n.id}')">🗑</button>` : ''}
        `;
        list.appendChild(div);
    });

    // Отмечаем прочитанные
    checkedNews = {};
    arr.forEach(n => { checkedNews[n.id] = true; });
    if(currentUser){
        localStorage.setItem('checkedNews_' + emailToKey(currentUser.email), JSON.stringify(checkedNews));
    }
    updateNewsBadge();
}

function updateNewsBadge(){
    const badge = document.getElementById('news-badge');
    if(!badge || !currentUser)return;

    const saved = localStorage.getItem('checkedNews_' + emailToKey(currentUser.email));
    const checked = saved ? JSON.parse(saved) : {};

    let unread = 0;
    Object.keys(allNews).forEach(id => {
        if(!checked[id]) unread++;
    });

    if(unread > 0){
        badge.textContent = unread;
        badge.style.display = 'inline-block';
    } else {
        badge.style.display = 'none';
    }
}

// ============ ТОП ПОЛЬЗОВАТЕЛЕЙ ============
function switchTopTab(tab){
    currentTopTab = tab;
    document.querySelectorAll('.top-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    renderTopUsers();
}

function renderTopUsers(){
    const list = document.getElementById('top-users-list');
    if(!list)return;

    let users = Object.values(allUsers).filter(u => !u.banned);

    if(currentTopTab === 'comments'){
        // По количеству комментов
        const commentCounts = {};
        allComments.forEach(c => {
            if(!commentCounts[c.email]) commentCounts[c.email] = 0;
            commentCounts[c.email]++;
        });
        users = users.map(u => ({...u, score: commentCounts[u.email] || 0}));
        users.sort((a, b) => b.score - a.score);
    } else if(currentTopTab === 'subs'){
        // По подписчикам
        users = users.map(u => ({...u, score: getFollowersCount(u.email)}));
        users.sort((a, b) => b.score - a.score);
    } else if(currentTopTab === 'level'){
        // По статусу
        const levelScore = {rapport: 5, pro: 4, lux: 3, basic: 2, pissing: 1};
        users = users.map(u => {
            const lvl = u.subscription === true ? 'basic' : u.subscription;
            return {...u, score: (u.isAdmin ? 10 : 0) + (levelScore[lvl] || 0)};
        });
        users.sort((a, b) => b.score - a.score);
    }

    users = users.slice(0, 50);

    if(!users.length){
        list.innerHTML = '<p style="color:#555;text-align:center;padding:30px;">Нет пользователей</p>';
        return;
    }

    list.innerHTML = '';
    users.forEach((u, idx) => {
        const div = document.createElement('div');
        div.className = 'top-user-item';

        let posClass = '';
        let posText = idx + 1;
        if(idx === 0){ posClass = 'gold'; posText = '🥇'; }
        else if(idx === 1){ posClass = 'silver'; posText = '🥈'; }
        else if(idx === 2){ posClass = 'bronze'; posText = '🥉'; }

        const av = u.avatarImg ? `<img src="${u.avatarImg}">` : (u.avatar || '👤');

        let statText = '';
        if(currentTopTab === 'comments') statText = `💬 ${u.score} комментов`;
        else if(currentTopTab === 'subs') statText = `👥 ${u.score} подписчиков`;
        else if(currentTopTab === 'level'){
            if(u.isAdmin) statText = '🔧 АДМИН';
            else if(u.subscription === 'rapport') statText = '🛡️ РАППОРТ';
            else if(u.subscription === 'pro') statText = '👑 САМЫЙ КРУТОЙ';
            else if(u.subscription === 'lux') statText = '💎 LUX';
            else if(u.subscription === 'basic' || u.subscription === true) statText = '🎬 BASIC';
            else if(u.subscription === 'pissing') statText = '💧 ПИСАЮЩИЙ';
            else statText = 'Без подписки';
        }

        div.innerHTML = `
            <div class="top-position ${posClass}">${posText}</div>
            <div class="top-user-avatar">${av}</div>
            <div class="top-user-info">
                <div class="top-user-name">${u.name || '—'}</div>
                <div class="top-user-stat">${statText}</div>
            </div>
            <div class="top-user-score">${u.score}</div>
        `;
        div.onclick = () => openUserProfile(u.email);
        list.appendChild(div);
    });
}

// ============ НАПОМИНАНИЯ ============
function selectReminderTime(btn, minutes){
    document.querySelectorAll('.reminder-time-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedReminderMinutes = minutes;
}

async function createReminder(){
    if(!currentUser){alert('Войди!');return;}

    const text = document.getElementById('reminder-text-input').value.trim();
    if(!text){alert('Введи текст напоминания!');return;}
    if(!selectedReminderMinutes){alert('Выбери время!');return;}

    const reminder = {
        userEmail: currentUser.email,
        text: text,
        remindAt: Date.now() + (selectedReminderMinutes * 60 * 1000),
        createdAt: Date.now(),
        done: false
    };

    const newRef = window.fbPush(window.fbRef(window.fbDb, 'reminders'));
    await window.fbSet(newRef, reminder);

    document.getElementById('reminder-text-input').value = '';
    document.querySelectorAll('.reminder-time-btn').forEach(b => b.classList.remove('active'));
    selectedReminderMinutes = null;

    alert('✅ Напоминание поставлено!');
}

async function deleteReminder(id){
    if(!confirm('Удалить напоминание?'))return;
    await fbRemovePath(`reminders/${id}`);
}

function renderReminders(){
    const list = document.getElementById('reminders-list');
    if(!list || !currentUser)return;

    const myReminders = Object.entries(allReminders)
        .map(([id, r]) => ({...r, id}))
        .filter(r => r.userEmail === currentUser.email)
        .sort((a, b) => (a.remindAt || 0) - (b.remindAt || 0));

    if(!myReminders.length){
        list.innerHTML = '<p style="color:#555;text-align:center;padding:30px;">У тебя нет напоминаний</p>';
        return;
    }

    list.innerHTML = '';
    myReminders.forEach(r => {
        const remainMs = r.remindAt - Date.now();
        let timeText = '';
        if(r.done){
            timeText = '✅ Уже сработало';
        } else if(remainMs <= 0){
            timeText = '⏰ Сейчас!';
        } else {
            const mins = Math.floor(remainMs / 60000);
            const hours = Math.floor(mins / 60);
            const days = Math.floor(hours / 24);
            if(days > 0) timeText = `Через ${days} дн ${hours % 24} ч`;
            else if(hours > 0) timeText = `Через ${hours} ч ${mins % 60} мин`;
            else timeText = `Через ${mins} мин`;
        }

        const div = document.createElement('div');
        div.className = 'reminder-item' + (r.done ? ' done' : '');
        div.innerHTML = `
            <div class="reminder-info">
                <div class="reminder-text">${r.text.replace(/</g,'&lt;')}</div>
                <div class="reminder-time">🕐 ${timeText}</div>
            </div>
            <button class="action-btn red" onclick="deleteReminder('${r.id}')">🗑</button>
        `;
        list.appendChild(div);
    });
}

let shownAlarms = {};
function checkReminders(){
    if(!currentUser)return;

    Object.entries(allReminders).forEach(([id, r]) => {
        if(r.userEmail !== currentUser.email) return;
        if(r.done) return;
        if(shownAlarms[id]) return;

        if(r.remindAt <= Date.now()){
            // Показываем будильник
            showReminderAlarm(id, r.text);
            shownAlarms[id] = true;
            fbUpdatePath(`reminders/${id}`, {done: true});
        }
    });
}

// Проверяем каждые 30 секунд
setInterval(checkReminders, 30000);

function showReminderAlarm(id, text){
    // Проигрываем звук (если браузер разрешит)
    try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
        audio.play().catch(() => {});
    } catch(e) {}

    const alarm = document.createElement('div');
    alarm.className = 'reminder-alarm';
    alarm.innerHTML = `
        <div class="reminder-alarm-title">🔔 НАПОМИНАНИЕ!</div>
        <div style="font-size:1.1rem;">${text.replace(/</g,'&lt;')}</div>
        <button class="reminder-alarm-close" onclick="this.parentElement.remove()">ОК</button>
    `;
    document.body.appendChild(alarm);

    setTimeout(() => {
        if(alarm.parentElement) alarm.remove();
    }, 30000);
}

// ============ ДЕНЬ РОЖДЕНИЯ ============
async function editBirthday(){
    if(!currentUser)return;

    const current = currentUser.birthday || '';
    const newBd = prompt('Введи дату рождения в формате ДД.ММ (например 15.03):', current);

    if(newBd === null) return;
    if(newBd === ''){
        currentUser.birthday = '';
        await saveCurrentUserToFirebase();
        alert('✅ Дата удалена');
        return;
    }

    // Проверка формата
    if(!/^\d{2}\.\d{2}$/.test(newBd)){
        alert('❌ Неверный формат! Используй ДД.ММ (например 15.03)');
        return;
    }

    const [day, month] = newBd.split('.').map(n => parseInt(n));
    if(day < 1 || day > 31 || month < 1 || month > 12){
        alert('❌ Неверная дата!');
        return;
    }

    currentUser.birthday = newBd;
    await saveCurrentUserToFirebase();
    alert('✅ День рождения сохранён! 🎂');
    checkBirthday();
}

function isBirthdayToday(birthday){
    if(!birthday) return false;
    const today = new Date();
    const [day, month] = birthday.split('.').map(n => parseInt(n));
    return today.getDate() === day && (today.getMonth() + 1) === month;
}

async function checkBirthday(){
    if(!currentUser) return;

    const container = document.getElementById('birthday-banner-container');
    if(!container) return;

    // Мой ДР
    if(isBirthdayToday(currentUser.birthday)){
        container.innerHTML = `
            <div class="birthday-banner">
                🎂🎉 С ДНЁМ РОЖДЕНИЯ, ${currentUser.name.toUpperCase()}! 🎉🎂<br>
                <span style="font-size:1rem;letter-spacing:2px;">Мы подарили тебе +50 рублей на счёт!</span>
            </div>
        `;
        // Дарим 50 руб если не дарили сегодня
        const today = new Date().toDateString();
        if(currentUser.lastBirthdayGift !== today){
            currentUser.wallet.RUB = (currentUser.wallet.RUB || 0) + 50;
            currentUser.lastBirthdayGift = today;
            await saveCurrentUserToFirebase();
            updateWalletDisplay();
            startConfetti();
        }
    } else {
        // Проверяем ДР других пользователей
        const bdayUsers = Object.values(allUsers).filter(u =>
            u.email !== currentUser.email && isBirthdayToday(u.birthday) && !u.banned
        );
        if(bdayUsers.length > 0){
            let bdayText = bdayUsers.slice(0, 3).map(u => u.name).join(', ');
            if(bdayUsers.length > 3) bdayText += ` и ещё ${bdayUsers.length - 3}`;
            container.innerHTML = `
                <div class="birthday-banner">
                    🎂 Сегодня день рождения у: ${bdayText}!<br>
                    <span style="font-size:1rem;">Поздравь их!</span>
                </div>
            `;
        } else {
            container.innerHTML = '';
        }
    }
}

function startConfetti(){
    const emojis = ['🎉', '🎊', '🎂', '🎁', '⭐', '✨', '💖', '🌟', '🎈', '🎇'];
    for(let i = 0; i < 30; i++){
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.animationDuration = (2 + Math.random() * 3) + 's';
            confetti.style.animationDelay = Math.random() * 2 + 's';
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 5000);
        }, i * 100);
    }
}

// ============ СЕЗОННЫЕ ТЕМЫ ============
function getCurrentSeason(){
    const month = new Date().getMonth() + 1;
    if(month >= 3 && month <= 5) return 'spring';
    if(month >= 6 && month <= 8) return 'summer';
    if(month >= 9 && month <= 11) return 'autumn';
    return 'winter';
}

function applySeasonEffect(){
    // Удаляем старый эффект
    const oldEffect = document.querySelector('.season-effect');
    if(oldEffect) oldEffect.remove();

    // Убираем классы сезонов
    document.body.classList.remove('season-summer', 'season-autumn', 'season-winter', 'season-spring');

    // Только для авто-темы
    if(currentUser && currentUser.theme === 'auto'){
        const season = getCurrentSeason();
        document.body.classList.add('season-' + season);

        const effect = document.createElement('div');
        effect.className = 'season-effect';

        let emoji, count, className;
        if(season === 'winter'){ emoji = '❄'; count = 30; className = 'snow'; }
        else if(season === 'autumn'){ emoji = '🍂'; count = 15; className = 'leaf'; }
        else if(season === 'spring'){ emoji = '🌸'; count = 20; className = 'flower'; }
        else if(season === 'summer'){ emoji = '☀️'; count = 8; className = 'sun-ray'; }

        for(let i = 0; i < count; i++){
            const el = document.createElement('div');
            el.className = className;
            el.textContent = emoji;
            el.style.left = Math.random() * 100 + '%';
            el.style.animationDuration = (5 + Math.random() * 10) + 's';
            el.style.animationDelay = Math.random() * 5 + 's';
            effect.appendChild(el);
        }
        document.body.appendChild(effect);
    }
}

// Обновляем сезонный эффект каждый час
setInterval(applySeasonEffect, 3600000);
// ============ ФИКС КНОПОК ЗВОНКОВ ============
// Добавляем кнопки звонков в чат если их нет
function addCallButtonsToChat(){
    setInterval(() => {
        const inputArea = document.querySelector('.chat-input-area');
        if(!inputArea) return;

        // Проверяем есть ли уже кнопки звонков
        if(inputArea.querySelector('.call-btn')) return;

        // Проверяем что чат открыт
        if(!currentChatId) return;

        // Определяем цель звонка
        let target, chatType;
        if(currentChatType === 'group'){
            target = currentChatId.replace('group_', '');
            chatType = 'group';
        } else {
            if(!currentChatUser) return;
            target = currentChatUser.email;
            chatType = 'private';
        }

        // Создаём кнопки
        const btnCall = document.createElement('button');
        btnCall.className = 'call-btn';
        btnCall.innerHTML = '📞';
        btnCall.title = 'Голосовой звонок';
        btnCall.onclick = () => startCall(target, chatType, false);

        const btnVideo = document.createElement('button');
        btnVideo.className = 'call-btn video';
        btnVideo.innerHTML = '📹';
        btnVideo.title = 'Видеозвонок';
        btnVideo.onclick = () => startCall(target, chatType, true);

        // Вставляем перед последней кнопкой (chat-send)
        const sendBtn = inputArea.querySelector('.chat-send');
        if(sendBtn){
            inputArea.insertBefore(btnCall, sendBtn);
            inputArea.insertBefore(btnVideo, sendBtn);
        } else {
            inputArea.appendChild(btnCall);
            inputArea.appendChild(btnVideo);
        }
    }, 1000);
}
addCallButtonsToChat();
// ============================================
//  АДМИН ФИЧИ: АНАЛИТИКА, ПРЕДУПРЕЖДЕНИЯ,
//  УПР. СЕРИАЛАМИ, ПРАВА МОДЕРАТОРОВ
// ============================================

// Переменные
let userActivity = {}; // Отслеживание активности
let currentOnlineUsers = {};
let allSerialsData = {}; // Динамические сериалы из Firebase

// ============ СЛУШАТЕЛИ ============
function setupOnlineListener(){
    if(firebaseReady){
        fbListen('online', (data) => {
            currentOnlineUsers = data || {};
            if(document.getElementById('admin-analytics').classList.contains('active')){
                renderAnalytics();
            }
            renderAdminUsers();
        });
    } else {
        setTimeout(setupOnlineListener, 500);
    }
}
setupOnlineListener();

function setupSerialsListener(){
    if(firebaseReady){
        fbListen('serials', (data) => {
            allSerialsData = data || {};
            // Обновляем SERIALS массив
            updateSerialsFromFirebase();
            if(typeof renderFolders === 'function') renderFolders();
            if(document.getElementById('admin-serials') && document.getElementById('admin-serials').classList.contains('active')){
                renderSerialsAdmin();
            }
        });
    } else {
        setTimeout(setupSerialsListener, 500);
    }
}
setupSerialsListener();

// ============ ОНЛАЙН СТАТУС ============
function updateOnlineStatus(){
    if(!currentUser || !firebaseReady) return;
    const key = emailToKey(currentUser.email);
    fbWrite(`online/${key}`, {
        email: currentUser.email,
        name: currentUser.name,
        avatar: currentUser.avatar || '👤',
        avatarImg: currentUser.avatarImg || '',
        lastSeen: Date.now()
    });
}

// Обновляем статус каждые 30 секунд
setInterval(() => {
    updateOnlineStatus();
}, 30000);

// При загрузке страницы
setTimeout(() => {
    updateOnlineStatus();
}, 2000);

// При закрытии страницы удаляем себя из онлайна
window.addEventListener('beforeunload', () => {
    if(currentUser && firebaseReady){
        fbRemovePath(`online/${emailToKey(currentUser.email)}`);
    }
});

function isUserOnline(email){
    const key = emailToKey(email);
    const online = currentOnlineUsers[key];
    if(!online) return false;
    // Считаем онлайн если был активен за последние 2 минуты
    return (Date.now() - (online.lastSeen || 0)) < 120000;
}

function getOnlineUsersCount(){
    let count = 0;
    Object.values(currentOnlineUsers).forEach(u => {
        if((Date.now() - (u.lastSeen || 0)) < 120000) count++;
    });
    return count;
}

// ============ АНАЛИТИКА ============
function renderAnalytics(){
    // Онлайн
    const onlineCount = getOnlineUsersCount();
    const onlineCountEl = document.getElementById('online-users-count');
    if(onlineCountEl) onlineCountEl.textContent = onlineCount;

    const onlineList = document.getElementById('online-users-list');
    if(onlineList){
        onlineList.innerHTML = '';
        Object.values(currentOnlineUsers).forEach(u => {
            if((Date.now() - (u.lastSeen || 0)) < 120000){
                const div = document.createElement('div');
                div.className = 'online-user-item';
                const av = u.avatarImg ? `<img src="${u.avatarImg}" style="width:30px;height:30px;border-radius:50%;object-fit:cover;">` : (u.avatar || '👤');
                div.innerHTML = `<div style="font-size:1.3rem;">${av}</div><div style="flex:1;">${u.name}</div><div class="online-dot"></div>`;
                onlineList.appendChild(div);
            }
        });
        if(onlineList.innerHTML === ''){
            onlineList.innerHTML = '<p style="color:#555;text-align:center;padding:20px;">Никого нет онлайн</p>';
        }
    }

    // Регистрации за 7 дней
    renderRegistrationsChart();

    // Топ активности
    renderActivityChart();

    // Топ серий
    renderTopEpisodesChart();
}

function renderRegistrationsChart(){
    const container = document.getElementById('registrations-chart');
    if(!container) return;

    const days = 7;
    const now = new Date();
    const dayData = {};

    // Инициализируем последние 7 дней
    for(let i = days - 1; i >= 0; i--){
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const key = d.toLocaleDateString('ru-RU', {day:'2-digit', month:'2-digit'});
        dayData[key] = 0;
    }

    // Считаем регистрации
    Object.values(allUsers).forEach(u => {
        if(u.registeredAt){
            const d = new Date(u.registeredAt);
            const key = d.toLocaleDateString('ru-RU', {day:'2-digit', month:'2-digit'});
            if(dayData[key] !== undefined) dayData[key]++;
        }
    });

    const maxVal = Math.max(...Object.values(dayData), 1);

    container.innerHTML = '';
    Object.entries(dayData).forEach(([day, count]) => {
        const percent = (count / maxVal) * 100;
        const div = document.createElement('div');
        div.className = 'chart-bar';
        div.innerHTML = `
            <div class="chart-label">${day}</div>
            <div class="chart-value">
                <div class="chart-fill" style="width:${percent}%;">${count}</div>
            </div>
        `;
        container.appendChild(div);
    });
}

function renderActivityChart(){
    const container = document.getElementById('activity-chart');
    if(!container) return;

    // Топ 5 пользователей по комментам
    const commentCounts = {};
    allComments.forEach(c => {
        if(!commentCounts[c.email]) commentCounts[c.email] = 0;
        commentCounts[c.email]++;
    });

    const top = Object.entries(commentCounts)
        .sort((a,b) => b[1] - a[1])
        .slice(0, 5);

    if(top.length === 0){
        container.innerHTML = '<p style="color:#555;text-align:center;">Нет данных</p>';
        return;
    }

    const maxVal = top[0][1];
    container.innerHTML = '';
    top.forEach(([email, count]) => {
        const user = allUsers[emailToKey(email)];
        const name = user ? user.name : email;
        const percent = (count / maxVal) * 100;
        const div = document.createElement('div');
        div.className = 'chart-bar';
        div.innerHTML = `
            <div class="chart-label">${name.substring(0, 12)}</div>
            <div class="chart-value">
                <div class="chart-fill" style="width:${percent}%;">${count}</div>
            </div>
        `;
        container.appendChild(div);
    });
}

function renderTopEpisodesChart(){
    const container = document.getElementById('top-episodes-chart');
    if(!container) return;

    const epViews = {};
    Object.entries(cachedViews).forEach(([key, count]) => {
        epViews[key] = count;
    });

    const top = Object.entries(epViews)
        .sort((a,b) => b[1] - a[1])
        .slice(0, 5);

    if(top.length === 0){
        container.innerHTML = '<p style="color:#555;text-align:center;">Нет данных</p>';
        return;
    }

    const maxVal = top[0][1];
    container.innerHTML = '';
    top.forEach(([key, count]) => {
        const parts = key.split('_');
        const epNum = parts[parts.length - 1];
        const percent = (count / maxVal) * 100;
        const div = document.createElement('div');
        div.className = 'chart-bar';
        div.innerHTML = `
            <div class="chart-label">Серия ${epNum}</div>
            <div class="chart-value">
                <div class="chart-fill" style="width:${percent}%;">${count}</div>
            </div>
        `;
        container.appendChild(div);
    });
}

function searchUserAnalytics(){
    const query = document.getElementById('analytics-search').value.trim().toLowerCase();
    const result = document.getElementById('user-analytics-result');
    if(!query){
        result.innerHTML = '';
        return;
    }

    const user = Object.values(allUsers).find(u =>
        u.email.toLowerCase().includes(query) ||
        (u.name && u.name.toLowerCase().includes(query))
    );

    if(!user){
        result.innerHTML = '<p style="color:#888;text-align:center;padding:20px;">Пользователь не найден</p>';
        return;
    }

    // Собираем аналитику
    const userComments = allComments.filter(c => c.email === user.email).length;
    const userTickets = allTickets.filter(t => t.email === user.email).length;
    const followers = getFollowersCount(user.email);
    const following = getFollowingCount(user.email);
    const online = isUserOnline(user.email);
    const warnCount = user.warnings || 0;
    const regDate = user.registeredAt ? new Date(user.registeredAt).toLocaleString('ru-RU') : 'Неизвестно';

    result.innerHTML = `
        <div class="user-analytics">
            <div style="display:flex;align-items:center;gap:15px;margin-bottom:15px;">
                <div style="font-size:2.5rem;">${user.avatar || '👤'}</div>
                <div>
                    <div style="font-weight:700;font-size:1.2rem;">${user.name} ${online ? '<span class="online-dot"></span>' : ''}</div>
                    <div style="color:#888;font-size:0.85rem;">${user.email}</div>
                </div>
            </div>
            <div class="analytics-row"><span class="analytics-label">Статус:</span> <span class="analytics-value">${online ? '🟢 Онлайн' : '⚫ Оффлайн'}</span></div>
            <div class="analytics-row"><span class="analytics-label">Зарегистрирован:</span> <span class="analytics-value">${regDate}</span></div>
            <div class="analytics-row"><span class="analytics-label">Баланс:</span> <span class="analytics-value">${(user.wallet?.RUB || 0).toFixed(2)} ₽</span></div>
            <div class="analytics-row"><span class="analytics-label">Подписка:</span> <span class="analytics-value">${user.subscription || 'нет'}</span></div>
            <div class="analytics-row"><span class="analytics-label">Комментов написал:</span> <span class="analytics-value">${userComments}</span></div>
            <div class="analytics-row"><span class="analytics-label">Обращений создал:</span> <span class="analytics-value">${userTickets}</span></div>
            <div class="analytics-row"><span class="analytics-label">Подписчиков:</span> <span class="analytics-value">${followers}</span></div>
            <div class="analytics-row"><span class="analytics-label">Подписок:</span> <span class="analytics-value">${following}</span></div>
            <div class="analytics-row"><span class="analytics-label">Предупреждений:</span> <span class="analytics-value" style="color:${warnCount >= 2 ? 'var(--red)' : '#FF9800'};">${warnCount} / 3</span></div>
            <div class="analytics-row"><span class="analytics-label">Забанен:</span> <span class="analytics-value">${user.banned ? '🚫 ДА' : '✅ нет'}</span></div>
        </div>
    `;
}

// ============ ПРЕДУПРЕЖДЕНИЯ ============
async function warnUser(userKey){
    if(!currentUser){alert('Войди!');return;}
    if(!currentUser.isAdmin && !hasPermission('warn')){alert('Нет прав!');return;}

    const user = allUsers[userKey];
    if(!user){alert('Пользователь не найден!');return;}
    if(user.email === ADMIN_EMAIL){alert('Нельзя предупредить главного админа!');return;}

    const reason = prompt(`Причина предупреждения для ${user.name}:`);
    if(!reason) return;

    const newWarnings = (user.warnings || 0) + 1;
    const warnData = {
        warnings: newWarnings,
        lastWarnReason: reason,
        lastWarnDate: new Date().toLocaleString('ru-RU'),
        lastWarnBy: currentUser.name
    };

    // Автобан при 3 предупреждениях
    if(newWarnings >= 3){
        warnData.banned = true;
        warnData.banReason = 'Автобан за 3 предупреждения';
    }

    await fbUpdatePath(`users/${userKey}`, warnData);

    // Отправить уведомление пользователю через Firebase
    const warnNotif = {
        userEmail: user.email,
        reason: reason,
        count: newWarnings,
        date: new Date().toLocaleString('ru-RU'),
        from: currentUser.name,
        timestamp: Date.now()
    };
    const notifRef = window.fbPush(window.fbRef(window.fbDb, 'warnNotifications'));
    await window.fbSet(notifRef, warnNotif);

    if(newWarnings >= 3){
        alert(`⚠️ Предупреждение выдано (${newWarnings}/3)\n🚫 Пользователь АВТОМАТИЧЕСКИ ЗАБАНЕН!`);
    } else {
        alert(`⚠️ Предупреждение ${newWarnings}/3 выдано!`);
    }
}

// Слушаем предупреждения для текущего юзера
function setupWarnNotificationsListener(){
    if(firebaseReady){
        fbListen('warnNotifications', (data) => {
            if(!currentUser || !data) return;
            Object.entries(data).forEach(([id, notif]) => {
                if(notif.userEmail === currentUser.email && !notif.seen){
                    // Показываем модалку
                    showWarnModal(notif);
                    // Помечаем как показанное
                    fbUpdatePath(`warnNotifications/${id}`, {seen: true});
                }
            });
        });
    } else {
        setTimeout(setupWarnNotificationsListener, 500);
    }
}
setupWarnNotificationsListener();

function showWarnModal(notif){
    const modal = document.getElementById('warn-modal');
    if(!modal) return;
    document.getElementById('warn-modal-text').innerHTML = `
        <div>Причина: <b>${notif.reason.replace(/</g,'&lt;')}</b></div>
        <div style="margin-top:10px;font-size:0.9rem;opacity:0.9;">От: ${notif.from}</div>
    `;
    document.getElementById('warn-modal-count').textContent = `${notif.count} / 3 предупреждений`;
    modal.classList.add('show');
}

function closeWarnModal(){
    document.getElementById('warn-modal').classList.remove('show');
}

// ============ ПРАВА МОДЕРАТОРОВ ============
function hasPermission(perm){
    if(!currentUser) return false;
    if(currentUser.isAdmin) return true;
    if(currentUser.subscription !== 'rapport') return false;
    if(!currentUser.permissions) return true; // Раппорт по умолчанию все права
    return currentUser.permissions[perm] === true;
}

function openPermsModal(userKey){
    if(!currentUser || !currentUser.isAdmin){alert('Только для админов!');return;}
    const user = allUsers[userKey];
    if(!user){alert('Пользователь не найден!');return;}

    document.getElementById('perms-user-email').value = user.email;
    document.getElementById('perms-user-info').textContent = `${user.name} (${user.email})`;

    const perms = user.permissions || {ban:true, 'delete-comments':true, moderate:true, warn:true, 'delete-tickets':true};

    document.getElementById('perm-ban').classList.toggle('active', perms.ban);
    document.getElementById('perm-delete-comments').classList.toggle('active', perms['delete-comments']);
    document.getElementById('perm-moderate').classList.toggle('active', perms.moderate);
    document.getElementById('perm-warn').classList.toggle('active', perms.warn);
    document.getElementById('perm-delete-tickets').classList.toggle('active', perms['delete-tickets']);

    document.getElementById('perms-modal').classList.add('show');
}

function togglePerm(el){
    el.classList.toggle('active');
}

async function savePerms(){
    const email = document.getElementById('perms-user-email').value;
    const userKey = emailToKey(email);

    const perms = {
        ban: document.getElementById('perm-ban').classList.contains('active'),
        'delete-comments': document.getElementById('perm-delete-comments').classList.contains('active'),
        moderate: document.getElementById('perm-moderate').classList.contains('active'),
        warn: document.getElementById('perm-warn').classList.contains('active'),
        'delete-tickets': document.getElementById('perm-delete-tickets').classList.contains('active')
    };

    await fbUpdatePath(`users/${userKey}`, {permissions: perms});
    document.getElementById('perms-modal').classList.remove('show');
    alert('✅ Права сохранены!');
}

function closePerms(){
    document.getElementById('perms-modal').classList.remove('show');
}

// ============ УПРАВЛЕНИЕ СЕРИАЛАМИ ============
function updateSerialsFromFirebase(){
    // Обновляем массив SERIALS данными из Firebase
    Object.entries(allSerialsData).forEach(([id, data]) => {
        // Обновляем VIDEO_URLS
        if(data.episodes){
            Object.entries(data.episodes).forEach(([num, url]) => {
                if(!VIDEO_URLS[num]) VIDEO_URLS[num] = url;
            });
        }

        // Проверяем есть ли уже такой сериал в SERIALS
        const existing = SERIALS.find(s => s.id === id);
        if(!existing){
            SERIALS.push({
                id: id,
                name: data.name,
                icon: data.icon || '🎬',
                totalEps: data.episodes ? Object.keys(data.episodes).length : 0,
                subOnly: data.vip || false,
                earlyEps: [],
                poster: data.poster || null
            });
                } else {
            // НЕ обновляем totalEps для существующих сериалов (используем из кода)
            existing.name = data.name || existing.name;
            existing.icon = data.icon || existing.icon;
            existing.subOnly = data.vip !== undefined ? data.vip : existing.subOnly;
            existing.poster = data.poster || existing.poster;
            // totalEps НЕ трогаем!
        }
    });
}

async function createSerial(){
    if(!currentUser || !currentUser.isAdmin){alert('Только для админа!');return;}

    const id = document.getElementById('new-serial-id').value.trim().toLowerCase().replace(/[^a-z0-9-]/g,'');
    const name = document.getElementById('new-serial-name').value.trim();
    const icon = document.getElementById('new-serial-icon').value.trim() || '🎬';
    const poster = document.getElementById('new-serial-poster').value.trim();
    const vip = document.getElementById('new-serial-vip').checked;

    if(!id){alert('Введи ID сериала (латиница)!');return;}
    if(!name){alert('Введи название!');return;}

    // Проверяем не занят ли ID
    if(SERIALS.find(s => s.id === id)){alert('Сериал с таким ID уже есть!');return;}

    const serialData = {
        name: name,
        icon: icon,
        vip: vip,
        poster: poster || '',
        createdAt: Date.now(),
        episodes: {}
    };

    await fbWrite(`serials/${id}`, serialData);

    // Очищаем форму
    document.getElementById('new-serial-id').value = '';
    document.getElementById('new-serial-name').value = '';
    document.getElementById('new-serial-icon').value = '🎬';
    document.getElementById('new-serial-poster').value = '';
    document.getElementById('new-serial-vip').checked = false;

    alert(`✅ Сериал "${name}" создан!`);
}

async function addEpisode(){
    if(!currentUser || !currentUser.isAdmin){alert('Только для админа!');return;}

    const serialId = document.getElementById('add-ep-serial-select').value;
    const num = document.getElementById('add-ep-number').value;
    const url = document.getElementById('add-ep-url').value.trim();

    if(!serialId){alert('Выбери сериал!');return;}
    if(!num){alert('Введи номер серии!');return;}
    if(!url){alert('Введи ссылку на видео!');return;}

    await fbWrite(`serials/${serialId}/episodes/${num}`, url);

    // Также обновляем VIDEO_URLS
    VIDEO_URLS[num] = url;

    document.getElementById('add-ep-number').value = '';
    document.getElementById('add-ep-url').value = '';

    alert(`✅ Серия ${num} добавлена!`);
}

async function deleteSerial(id){
    if(!confirm('Удалить сериал полностью?')) return;
    await fbRemovePath(`serials/${id}`);
    // Удаляем из SERIALS
    const idx = SERIALS.findIndex(s => s.id === id);
    if(idx > -1 && SERIALS[idx].id !== 'the-ded') SERIALS.splice(idx, 1);
    alert('✅ Удалено!');
}

async function deleteEpisode(serialId, epNum){
    if(!confirm(`Удалить серию ${epNum}?`)) return;
    await fbRemovePath(`serials/${serialId}/episodes/${epNum}`);
}

function renderSerialsAdmin(){
    const list = document.getElementById('serials-list');
    if(!list) return;

    // Обновляем select для добавления серий
    const selectAddEp = document.getElementById('add-ep-serial-select');
    if(selectAddEp){
        selectAddEp.innerHTML = '<option value="">Выбери сериал</option>';
        SERIALS.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.id;
            opt.textContent = `${s.icon} ${s.name}`;
            selectAddEp.appendChild(opt);
        });
    }

    list.innerHTML = '';
    SERIALS.forEach(s => {
        const div = document.createElement('div');
        div.className = 'serial-manage-form';
        div.style.marginBottom = '15px';

        const episodes = allSerialsData[s.id]?.episodes || {};
        const epsList = Object.entries(episodes).sort((a,b) => parseInt(a[0]) - parseInt(b[0]));

        div.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                <h4>${s.icon} ${s.name} ${s.subOnly ? '🔒 VIP' : ''}</h4>
                ${s.id !== 'the-ded' ? `<button class="action-btn red" onclick="deleteSerial('${s.id}')">🗑 Удалить сериал</button>` : ''}
            </div>
            <div style="color:#888;font-size:0.85rem;margin-bottom:10px;">Всего серий: ${s.totalEps}</div>
            ${epsList.length > 0 ? '<h5 style="color:#666;margin:10px 0 5px;font-size:0.85rem;">Серии из Firebase:</h5>' : ''}
            ${epsList.map(([num, url]) => `
                <div class="episode-manage-row">
                    <div class="episode-manage-num">СЕРИЯ ${num}</div>
                    <div style="flex:1;color:#888;font-size:0.75rem;word-break:break-all;">${url.substring(0, 60)}...</div>
                    <button class="action-btn red" onclick="deleteEpisode('${s.id}', '${num}')">🗑</button>
                </div>
            `).join('')}
        `;
        list.appendChild(div);
    });
}

// ============ РАСШИРЕНИЕ АДМИН ПАНЕЛИ ============
// Обновляем switchAdminTab
if(typeof switchAdminTab === 'function'){
    const originalSwitchAdmin = switchAdminTab;
    switchAdminTab = function(tab){
        const tabs = ['users','payments','comments','tickets','promos','episodes','moderation','analytics','serials'];
        document.querySelectorAll('.admin-tab').forEach((t,i) => t.classList.toggle('active', tabs[i] === tab));
        tabs.forEach(t => {
            const el = document.getElementById('admin-' + t);
            if(el) el.classList.toggle('active', t === tab);
        });
        if(tab === 'moderation') renderModerationList();
        if(tab === 'analytics') renderAnalytics();
        if(tab === 'serials') renderSerialsAdmin();
    };
}

// Обновляем openAdmin
if(typeof openAdmin === 'function'){
    const originalOpenAdmin = openAdmin;
    openAdmin = function(){
        if(!currentUser) return;
        if(!currentUser.isAdmin && currentUser.subscription !== 'rapport'){alert('Нет доступа!');return;}
        document.getElementById('admin-overlay').classList.add('show');
        renderAdminStats();
        renderAdminUsers();
        renderAdminPayments();
        renderAdminComments();
        renderAdminTickets();
        renderAdminPromos();
        renderAdminEpisodes();
        renderModerationList();
        renderAnalytics();
        renderSerialsAdmin();
        fillPaymentUserSelect();
        fillBoostFollowersSelect();
        updateTicketsBadge();
        updateModerationBadge();
    };
}

// Обновляем renderAdminUsers для добавления кнопок варна и прав
if(typeof renderAdminUsers === 'function'){
    const originalRenderAdminUsers = renderAdminUsers;
    renderAdminUsers = function(){
        const users = Object.entries(allUsers);
        const tb = document.getElementById('admin-users-body');
        if(!tb) return;
        tb.innerHTML = '';
        users.forEach(([key, u]) => {
            let badge = '';
            if(u.banned) badge = '<span class="badge-banned">🚫</span>';
            else if(u.isAdmin) badge = '<span class="badge-admin">🔧 АДМИН</span>';
            else if(u.subscription === 'rapport') badge = '<span class="badge-rapport">🛡️ RAPPORT</span>';
            else if(u.subscription === 'pro') badge = '<span class="badge-pro">👑 PRO</span>';
            else if(u.subscription === 'lux') badge = '<span class="badge-lux">💎 LUX</span>';
            else if(u.subscription === 'basic' || u.subscription === true) badge = '<span class="badge-basic">🎬 BASIC</span>';
            else if(u.subscription === 'pissing') badge = '<span class="badge-pissing">💧 ПИС</span>';
            else badge = '<span class="badge-free">—</span>';

            const warnBadge = u.warnings > 0 ? `<span class="warn-badge ${u.warnings >= 2 ? 'critical' : ''}">⚠️ ${u.warnings}/3</span>` : '';
            const onlineIndicator = isUserOnline(u.email) ? '<span class="online-dot"></span>' : '<span class="online-dot offline"></span>';

            const tr = document.createElement('tr');
            const isAdminUser = currentUser && currentUser.isAdmin;
            tr.innerHTML = `
                <td>${onlineIndicator}${u.email}</td>
                <td style="cursor:pointer;" onclick="openUserProfile('${u.email}')">${u.avatar || '👤'} ${u.name || '—'}${warnBadge}</td>
                <td>${(u.wallet?.RUB || 0).toFixed(2)} ₽</td>
                <td>${badge}</td>
                <td>
                    ${isAdminUser ? `
                        <button class="action-btn pissing-btn-admin" onclick="adminGiveSub('${key}','pissing')">💧</button>
                        <button class="action-btn green" onclick="adminGiveSub('${key}','basic')">🎬</button>
                        <button class="action-btn lux" onclick="adminGiveSub('${key}','lux')">💎</button>
                        <button class="action-btn gold" onclick="adminGiveSub('${key}','pro')">👑</button>
                        <button class="action-btn rapport" onclick="adminGiveSub('${key}','rapport')">🛡️</button>
                        <button class="action-btn red" onclick="adminRemoveSub('${key}')">❌</button>
                        ${u.email !== ADMIN_EMAIL ? `<button class="action-btn ${u.isAdmin?'orange':'admin-btn'}" onclick="adminToggleAdmin('${key}')">${u.isAdmin?'❌🔧':'🔧'}</button>` : ''}
                        ${u.subscription === 'rapport' ? `<button class="action-btn blue" onclick="openPermsModal('${key}')" title="Настроить права">🔒</button>` : ''}
                    ` : ''}
                    ${(isAdminUser || hasPermission('warn')) && !u.isAdmin ? `<button class="action-btn orange" onclick="warnUser('${key}')" title="Предупреждение">⚠️</button>` : ''}
                    ${(isAdminUser || hasPermission('ban')) ? `<button class="action-btn ${u.banned?'green':'red'}" onclick="adminToggleBan('${key}')">${u.banned?'✅':'🚫'}</button>` : ''}
                    ${isAdminUser ? `<button class="action-btn gray" onclick="adminEditUser('${key}')">✏️</button>${u.email !== ADMIN_EMAIL ? `<button class="action-btn red" onclick="adminDeleteUser('${key}')">🗑</button>` : ''}` : ''}
                </td>
            `;
            tb.appendChild(tr);
        });
    };
}

// При регистрации сохраняем дату
if(typeof tryRegister === 'function'){
    const originalTryRegister = tryRegister;
    tryRegister = async function(){
        const name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim().toLowerCase();
        const password = document.getElementById('reg-password').value;
        if(!name || !email || !password){showRegError('❌ Заполни всё');return;}
        if(!email.includes('@') || !email.includes('.')){showRegError('❌ Правильный email');return;}
        if(password.length < 4){showRegError('❌ Минимум 4 символа');return;}
        const existing = await getUserByEmail(email);
        if(existing){showRegError('❌ Email занят');return;}
        const newUser = {
            email, password, name,
            avatar:'👤', avatarImg:'', bio:'',
            wallet:{RUB:0,USD:0,EUR:0,KZT:0}, currency:'RUB',
            subscription:false, isAdmin:false, banned:false,
            theme:'default', tempSubUntil:0, nickColor:'default',
            extraFollowers:0, birthday:'', lastBirthdayGift:'',
            warnings: 0, registeredAt: Date.now()
        };
        await fbWrite(`users/${emailToKey(email)}`, newUser);
        currentUser = newUser;
        setCookie('theded_fb', {email:newUser.email, password:newUser.password}, 30);
        loginSuccess();
    };
}
// ============ ФИКС: ЗАЛИТЬ ВСЕ 50 СЕРИЙ В FIREBASE ============
async function fixFirebaseEpisodes(){
    if(!currentUser || !currentUser.isAdmin) return;
    if(!firebaseReady) return;

    // Проверяем есть ли уже серии
    const existing = await fbReadOnce('serials/the-ded/episodes');
    if(existing && Object.keys(existing).length >= 50){
        console.log('Серии уже есть в Firebase');
        return;
    }

    console.log('Заливаем 50 серий в Firebase...');

    // Создаём сериал THE DED с серииями
    const episodes = {};
    for(let i = 1; i <= 50; i++){
        episodes[i] = `https://github.com/ivansabaev04-svg/theded-videos/releases/download/v1/${i}.mp4`;
    }

    await fbWrite('serials/the-ded', {
        name: 'THE DED',
        icon: '📁',
        vip: false,
        poster: 'https://github.com/ivansabaev04-svg/theded-videos/releases/download/v1/poster.png',
        createdAt: Date.now(),
        episodes: episodes
    });

    console.log('✅ 50 серий залито в Firebase!');
    alert('✅ Все 50 серий добавлены в Firebase! Обнови страницу.');
}

// Запустить автоматически при загрузке (только для админа)
setTimeout(() => {
    if(currentUser && currentUser.isAdmin){
        fixFirebaseEpisodes();
    }
}, 3000);
// ============================================
//  ОПРОСЫ + ОТКАТ НАКРУТКИ
// ============================================

// ============ ОПРОСЫ В НОВОСТЯХ ============
function togglePollForm(){
    const form = document.getElementById('news-poll-form');
    const checkbox = document.getElementById('news-add-poll');
    if(!form || !checkbox) return;
    form.style.display = checkbox.checked ? 'block' : 'none';
}

function addPollOption(){
    const container = document.getElementById('poll-options-container');
    if(!container) return;
    const count = container.children.length;
    if(count >= 5){alert('Максимум 5 вариантов!');return;}

    const div = document.createElement('div');
    div.className = 'poll-option-input';
    div.innerHTML = `
        <input type="text" placeholder="Вариант ${count + 1}" maxlength="100">
        <button onclick="removePollOption(this)">✕</button>
    `;
    container.appendChild(div);
}

function removePollOption(btn){
    const container = document.getElementById('poll-options-container');
    if(!container) return;
    if(container.children.length <= 2){alert('Минимум 2 варианта!');return;}
    btn.parentElement.remove();
}

// Переопределяем createNews с поддержкой опросов
if(typeof createNews === 'function'){
    const originalCreateNews = createNews;
    createNews = async function(){
        if(!currentUser || !currentUser.isAdmin){alert('Только для админов!');return;}

        const title = document.getElementById('news-title-input').value.trim();
        const text = document.getElementById('news-text-input').value.trim();
        const important = document.getElementById('news-important').checked;
        const addPoll = document.getElementById('news-add-poll').checked;

        if(!title){alert('Введи заголовок!');return;}
        if(!text){alert('Введи текст!');return;}

        const news = {
            title: title,
            text: text,
            important: important,
            author: currentUser.name,
            authorEmail: currentUser.email,
            date: new Date().toLocaleString('ru-RU'),
            timestamp: Date.now()
        };

        // Добавляем опрос если нужно
        if(addPoll){
            const question = document.getElementById('poll-question-input').value.trim();
            if(!question){alert('Введи вопрос опроса!');return;}

            const optionInputs = document.querySelectorAll('#poll-options-container .poll-option-input input');
            const options = [];
            optionInputs.forEach(inp => {
                const val = inp.value.trim();
                if(val) options.push(val);
            });

            if(options.length < 2){alert('Нужно минимум 2 варианта в опросе!');return;}

            news.poll = {
                question: question,
                options: options,
                votes: {} // {optionIndex: {userEmail: true}}
            };
        }

        const newRef = window.fbPush(window.fbRef(window.fbDb, 'news'));
        await window.fbSet(newRef, news);

        // Очищаем форму
        document.getElementById('news-title-input').value = '';
        document.getElementById('news-text-input').value = '';
        document.getElementById('news-important').checked = false;
        document.getElementById('news-add-poll').checked = false;
        document.getElementById('news-poll-form').style.display = 'none';
        document.getElementById('poll-question-input').value = '';

        // Сбрасываем опции опроса
        const container = document.getElementById('poll-options-container');
        if(container){
            container.innerHTML = `
                <div class="poll-option-input">
                    <input type="text" placeholder="Вариант 1" maxlength="100">
                    <button onclick="removePollOption(this)">✕</button>
                </div>
                <div class="poll-option-input">
                    <input type="text" placeholder="Вариант 2" maxlength="100">
                    <button onclick="removePollOption(this)">✕</button>
                </div>
            `;
        }

        alert('✅ Новость опубликована!');
    };
}

// Голосование в опросе
async function votePoll(newsId, optionIndex){
    if(!currentUser){alert('Войди чтобы проголосовать!');return;}

    const news = allNews[newsId];
    if(!news || !news.poll){return;}

    const userKey = emailToKey(currentUser.email);
    const votes = news.poll.votes || {};

    // Проверяем не голосовал ли уже
    let alreadyVoted = false;
    Object.values(votes).forEach(voters => {
        if(voters && voters[userKey]) alreadyVoted = true;
    });

    if(alreadyVoted){
        alert('❌ Ты уже голосовал в этом опросе!');
        return;
    }

    // Голосуем
    if(!votes[optionIndex]) votes[optionIndex] = {};
    votes[optionIndex][userKey] = true;

    await fbUpdatePath(`news/${newsId}/poll/votes`, votes);
}

// Переопределяем renderNews для отображения опросов
if(typeof renderNews === 'function'){
    const originalRenderNews = renderNews;
    renderNews = function(){
        const list = document.getElementById('news-list');
        if(!list) return;

        const createForm = document.getElementById('news-create-form');
        if(createForm && currentUser){
            createForm.style.display = currentUser.isAdmin ? 'block' : 'none';
        }

        const arr = Object.entries(allNews)
            .map(([id, n]) => ({...n, id}))
            .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

        if(!arr.length){
            list.innerHTML = '<p style="color:#555;text-align:center;padding:40px;">Пока нет новостей 📭</p>';
            return;
        }

        list.innerHTML = '';
        arr.forEach(n => {
            const div = document.createElement('div');
            div.className = 'news-item' + (n.important ? ' important' : '');

            let pollHTML = '';
            if(n.poll){
                const userKey = currentUser ? emailToKey(currentUser.email) : '';
                const votes = n.poll.votes || {};

                // Считаем общее количество голосов
                let totalVotes = 0;
                let myVote = -1;
                Object.entries(votes).forEach(([optIdx, voters]) => {
                    if(voters){
                        const voterCount = Object.keys(voters).length;
                        totalVotes += voterCount;
                        if(voters[userKey]) myVote = parseInt(optIdx);
                    }
                });

                const hasVoted = myVote >= 0;

                pollHTML = `
                    <div class="poll-container">
                        <div class="poll-question">📊 ${n.poll.question.replace(/</g,'&lt;')}</div>
                        ${n.poll.options.map((opt, i) => {
                            const voterCount = votes[i] ? Object.keys(votes[i]).length : 0;
                            const percent = totalVotes > 0 ? Math.round((voterCount / totalVotes) * 100) : 0;
                            const isVoted = myVote === i;
                            return `
                                <div class="poll-option ${isVoted ? 'voted' : ''}" onclick="${hasVoted ? '' : `votePoll('${n.id}', ${i})`}">
                                    ${hasVoted ? `<div class="poll-option-fill" style="width:${percent}%;"></div>` : ''}
                                    <div class="poll-option-content">
                                        <div class="poll-option-text">
                                            ${isVoted ? '<span class="poll-check-mark">✓</span>' : ''}
                                            ${opt.replace(/</g,'&lt;')}
                                        </div>
                                        ${hasVoted ? `<div class="poll-option-stats">${percent}% (${voterCount})</div>` : ''}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                        <div class="poll-total">👥 Проголосовало: ${totalVotes} ${hasVoted ? '' : '• Кликни чтобы проголосовать'}</div>
                    </div>
                `;
            }

            div.innerHTML = `
                <div class="news-item-header">
                    <div class="news-item-title">${n.important ? '⭐ ' : ''}${n.title.replace(/</g,'&lt;')}</div>
                    <div class="news-item-date">${n.date}</div>
                </div>
                <div class="news-item-text">${n.text.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>
                ${pollHTML}
                <div class="news-item-author">— ${n.author}</div>
                ${currentUser && currentUser.isAdmin ? `<button class="news-delete-btn" onclick="deleteNews('${n.id}')">🗑</button>` : ''}
            `;
            list.appendChild(div);
        });

        // Отмечаем прочитанные
        checkedNews = {};
        arr.forEach(n => { checkedNews[n.id] = true; });
        if(currentUser){
            localStorage.setItem('checkedNews_' + emailToKey(currentUser.email), JSON.stringify(checkedNews));
        }
        updateNewsBadge();
    };
}

// ============ ОПРОСЫ В ЧАТАХ ============
function openChatPollModal(){
    document.getElementById('chat-poll-question').value = '';
    // Сбрасываем варианты
    const container = document.getElementById('chat-poll-options-container');
    if(container){
        container.innerHTML = `
            <div class="poll-option-input">
                <input type="text" placeholder="Вариант 1" maxlength="100">
                <button onclick="removeChatPollOption(this)">✕</button>
            </div>
            <div class="poll-option-input">
                <input type="text" placeholder="Вариант 2" maxlength="100">
                <button onclick="removeChatPollOption(this)">✕</button>
            </div>
        `;
    }
    document.getElementById('chat-poll-modal').classList.add('show');
}

function closeChatPollModal(){
    document.getElementById('chat-poll-modal').classList.remove('show');
}

function addChatPollOption(){
    const container = document.getElementById('chat-poll-options-container');
    if(!container) return;
    const count = container.children.length;
    if(count >= 5){alert('Максимум 5 вариантов!');return;}

    const div = document.createElement('div');
    div.className = 'poll-option-input';
    div.innerHTML = `
        <input type="text" placeholder="Вариант ${count + 1}" maxlength="100">
        <button onclick="removeChatPollOption(this)">✕</button>
    `;
    container.appendChild(div);
}

function removeChatPollOption(btn){
    const container = document.getElementById('chat-poll-options-container');
    if(!container) return;
    if(container.children.length <= 2){alert('Минимум 2 варианта!');return;}
    btn.parentElement.remove();
}

async function sendChatPoll(){
    if(!currentUser){alert('Войди!');return;}
    if(currentUser.banned){alert('Заблокирован!');return;}
    if(!currentChatId){alert('Открой чат!');return;}

    const question = document.getElementById('chat-poll-question').value.trim();
    if(!question){alert('Введи вопрос!');return;}

    const optionInputs = document.querySelectorAll('#chat-poll-options-container .poll-option-input input');
    const options = [];
    optionInputs.forEach(inp => {
        const val = inp.value.trim();
        if(val) options.push(val);
    });

    if(options.length < 2){alert('Минимум 2 варианта!');return;}

    let msg;
    if(currentChatType === 'group'){
        msg = {
            from: currentUser.email,
            authorName: currentUser.name,
            text: '',
            type: 'poll',
            poll: {
                question: question,
                options: options,
                votes: {}
            },
            date: new Date().toLocaleString('ru-RU'),
            timestamp: Date.now(),
            readBy: {[emailToKey(currentUser.email)]: true},
            reactions: {}
        };
    } else {
        if(!currentChatUser){alert('Ошибка!');return;}
        msg = {
            from: currentUser.email,
            to: currentChatUser.email,
            text: '',
            type: 'poll',
            poll: {
                question: question,
                options: options,
                votes: {}
            },
            date: new Date().toLocaleString('ru-RU'),
            timestamp: Date.now(),
            read: false,
            reactions: {}
        };
    }

    const newRef = window.fbPush(window.fbRef(window.fbDb, `messages/${currentChatId}`));
    await window.fbSet(newRef, msg);

    closeChatPollModal();

    setTimeout(() => {
        const area = document.getElementById('chat-messages-area');
        if(area) area.scrollTop = area.scrollHeight;
    }, 100);
}

async function voteChatPoll(msgId, optionIndex){
    if(!currentUser){alert('Войди!');return;}
    if(!currentChatId){return;}

    const messages = allMessages[currentChatId] || {};
    const msg = messages[msgId];
    if(!msg || !msg.poll){return;}

    const userKey = emailToKey(currentUser.email);
    const votes = msg.poll.votes || {};

    // Проверяем не голосовал ли уже
    let alreadyVoted = false;
    Object.values(votes).forEach(voters => {
        if(voters && voters[userKey]) alreadyVoted = true;
    });

    if(alreadyVoted){
        alert('❌ Ты уже голосовал!');
        return;
    }

    if(!votes[optionIndex]) votes[optionIndex] = {};
    votes[optionIndex][userKey] = true;

    await fbUpdatePath(`messages/${currentChatId}/${msgId}/poll/votes`, votes);
}

// Обновляем renderChat для отображения опросов
if(typeof renderChat === 'function'){
    const originalRenderChat = renderChat;
    renderChat = function(){
        if(!currentChatId) return;
        const area = document.getElementById('chat-messages-area');
        if(!area) return;
        const messages = allMessages[currentChatId] || {};
        const arr = Object.entries(messages).map(([id, m]) => ({...m, id})).sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
        const wasScrolledToBottom = area.scrollTop + area.clientHeight >= area.scrollHeight - 50;
        area.innerHTML = '';

        arr.forEach(m => {
            const div = document.createElement('div');
            const isMine = m.from === currentUser.email;
            div.className = 'msg-bubble ' + (isMine ? 'mine' : 'theirs');
            div.id = 'msg-' + m.id;

            let authorBlock = '';
            if(currentChatType === 'group' && !isMine){
                authorBlock = `<div class="chat-msg-author" style="cursor:pointer;color:var(--red);" onclick="openUserProfile('${m.from}')">${m.authorName || '?'}</div>`;
            }

            let replyBlock = '';
            if(m.replyTo){
                replyBlock = `
                    <div class="msg-reply-preview" onclick="scrollToMessage('${m.replyTo.id}')">
                        <div class="msg-reply-preview-author">↩️ ${m.replyTo.author}</div>
                        <div class="msg-reply-preview-text">${(m.replyTo.text || '').replace(/</g,'&lt;').substring(0, 50)}</div>
                    </div>
                `;
            }

            let contentBlock = '';
            const msgType = m.type || 'text';

            if(msgType === 'photo' && m.photo){
                contentBlock = `<img src="${m.photo}" class="msg-photo" onclick="window.open('${m.photo}','_blank')" alt="Фото">`;
            } else if(msgType === 'voice' && m.voice){
                contentBlock = `
                    <div class="msg-voice-container" style="min-width:200px;">
                        <audio controls style="width:100%;max-width:250px;height:35px;" src="${m.voice}"></audio>
                    </div>
                `;
            } else if(msgType === 'sticker' && m.sticker){
                contentBlock = `<div class="msg-sticker">${m.sticker}</div>`;
            } else if(msgType === 'call' && m.callUrl){
                const callIcon = m.callType === 'video' ? '📹' : '📞';
                const callText = m.callType === 'video' ? 'ВИДЕОЗВОНОК' : 'ЗВОНОК';
                contentBlock = `
                    <a href="${m.callUrl}" target="_blank" class="msg-call ${m.callType === 'video' ? 'video' : ''}">
                        ${callIcon} ${callText}<br>
                        <span style="font-size:0.75rem;opacity:0.9;">Нажми чтобы присоединиться</span>
                    </a>
                `;
            } else if(msgType === 'poll' && m.poll){
                // Опрос в чате
                const userKey = emailToKey(currentUser.email);
                const votes = m.poll.votes || {};
                let totalVotes = 0;
                let myVote = -1;
                Object.entries(votes).forEach(([optIdx, voters]) => {
                    if(voters){
                        totalVotes += Object.keys(voters).length;
                        if(voters[userKey]) myVote = parseInt(optIdx);
                    }
                });
                const hasVoted = myVote >= 0;

                contentBlock = `
                    <div class="msg-poll">
                        <div class="msg-poll-question">📊 ${m.poll.question.replace(/</g,'&lt;')}</div>
                        ${m.poll.options.map((opt, i) => {
                            const voterCount = votes[i] ? Object.keys(votes[i]).length : 0;
                            const percent = totalVotes > 0 ? Math.round((voterCount / totalVotes) * 100) : 0;
                            const isVoted = myVote === i;
                            return `
                                <div class="msg-poll-option ${isVoted ? 'voted' : ''}" onclick="${hasVoted ? '' : `voteChatPoll('${m.id}', ${i})`}">
                                    ${hasVoted ? `<div class="msg-poll-option-fill" style="width:${percent}%;"></div>` : ''}
                                    <div class="msg-poll-option-text">
                                        <span>${isVoted ? '✓ ' : ''}${opt.replace(/</g,'&lt;')}</span>
                                        ${hasVoted ? `<span>${percent}%</span>` : ''}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                        <div style="color:#888;font-size:0.75rem;margin-top:8px;">👥 ${totalVotes} ${hasVoted ? 'голосов' : '• кликни чтобы проголосовать'}</div>
                    </div>
                `;
            } else {
                contentBlock = `<div class="msg-text">${(m.text || '').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>`;
            }

            let reactionsBlock = '';
            if(m.reactions && Object.keys(m.reactions).length > 0){
                reactionsBlock = '<div class="msg-reactions">';
                Object.entries(m.reactions).forEach(([emoji, users]) => {
                    const count = Object.keys(users).length;
                    if(count === 0) return;
                    const isMineReaction = currentUser && users[emailToKey(currentUser.email)];
                    reactionsBlock += `<div class="reaction-badge ${isMineReaction ? 'mine' : ''}" onclick="addReaction('${m.id}','${emoji}','${currentChatId}')">${emoji} ${count}</div>`;
                });
                reactionsBlock += '</div>';
            }

            const actionsBtn = `
                <button class="msg-actions-btn" onclick="toggleReactionPicker('${m.id}')">😊</button>
                <div class="reaction-picker" id="picker-${m.id}">
                    <button class="reaction-emoji-btn" onclick="addReaction('${m.id}','❤️','${currentChatId}')">❤️</button>
                    <button class="reaction-emoji-btn" onclick="addReaction('${m.id}','😂','${currentChatId}')">😂</button>
                    <button class="reaction-emoji-btn" onclick="addReaction('${m.id}','👍','${currentChatId}')">👍</button>
                    <button class="reaction-emoji-btn" onclick="addReaction('${m.id}','🔥','${currentChatId}')">🔥</button>
                    <button class="reaction-emoji-btn" onclick="addReaction('${m.id}','😢','${currentChatId}')">😢</button>
                    <button class="reaction-emoji-btn" onclick="addReaction('${m.id}','💯','${currentChatId}')">💯</button>
                    <button class="reaction-emoji-btn" onclick="replyToMessage('${m.id}','${currentChatId}')">↩️</button>
                </div>
            `;

            div.innerHTML = `
                ${authorBlock}
                ${replyBlock}
                ${contentBlock}
                <div class="msg-time">${m.date}</div>
                ${reactionsBlock}
                ${actionsBtn}
            `;

            area.appendChild(div);
        });

        if(wasScrolledToBottom){
            area.scrollTop = area.scrollHeight;
        }
    };
}

// Добавляем кнопку опроса в чат автоматически
setInterval(() => {
    const inputArea = document.querySelector('.chat-input-area');
    if(!inputArea) return;
    if(inputArea.querySelector('.chat-poll-btn')) return;
    if(!currentChatId) return;

    const pollBtn = document.createElement('button');
    pollBtn.className = 'chat-poll-btn';
    pollBtn.innerHTML = '📊';
    pollBtn.title = 'Создать опрос';
    pollBtn.onclick = openChatPollModal;

    const sendBtn = inputArea.querySelector('.chat-send');
    if(sendBtn){
        inputArea.insertBefore(pollBtn, sendBtn);
    } else {
        inputArea.appendChild(pollBtn);
    }
}, 1000);

// ============ ОТКАТ НАКРУТКИ ============

async function resetViewsForEpisode(){
    if(!currentUser || !currentUser.isAdmin){alert('Только для админа!');return;}
    const epNum = prompt('Введи номер серии (1-50):');
    if(!epNum) return;
    const num = parseInt(epNum);
    if(!num || num < 1 || num > 50){alert('Неверный номер!');return;}

    if(!confirm(`Сбросить просмотры у серии ${num}?`)) return;

    await fbWrite(`views/the-ded_${num}`, 0);
    alert(`✅ Просмотры серии ${num} сброшены!`);
}

async function resetLikesForEpisode(){
    if(!currentUser || !currentUser.isAdmin){alert('Только для админа!');return;}
    const epNum = prompt('Введи номер серии (1-50):');
    if(!epNum) return;
    const num = parseInt(epNum);
    if(!num || num < 1 || num > 50){alert('Неверный номер!');return;}

    if(!confirm(`Сбросить лайки у серии ${num}?`)) return;

    await fbWrite(`likes/the-ded_${num}`, []);
    alert(`✅ Лайки серии ${num} сброшены!`);
}

async function resetFollowersForUser(){
    if(!currentUser || !currentUser.isAdmin){alert('Только для админа!');return;}
    const email = prompt('Введи email пользователя:');
    if(!email) return;

    const user = allUsers[emailToKey(email.trim())];
    if(!user){alert('Пользователь не найден!');return;}

    if(!confirm(`Сбросить накрученных подписчиков у ${user.name}?\n(Реальные подписчики останутся)`)) return;

    await fbUpdatePath(`users/${emailToKey(user.email)}`, {extraFollowers: 0});
    alert(`✅ Накрученные подписчики у ${user.name} сброшены!`);
}

async function resetAllViews(){
    if(!currentUser || !currentUser.isAdmin){alert('Только для админа!');return;}
    if(!confirm('⚠️ ВНИМАНИЕ! Это сбросит ВСЕ просмотры у ВСЕХ серий!\n\nПродолжить?')) return;
    if(!confirm('Точно? Это НЕЛЬЗЯ отменить!')) return;

    await fbWrite('views', {});
    alert('💥 Все просмотры сброшены!');
}

async function resetAllLikes(){
    if(!currentUser || !currentUser.isAdmin){alert('Только для админа!');return;}
    if(!confirm('⚠️ ВНИМАНИЕ! Это сбросит ВСЕ лайки у ВСЕХ серий!\n\nПродолжить?')) return;
    if(!confirm('Точно? Это НЕЛЬЗЯ отменить!')) return;

    await fbWrite('likes', {});
    alert('💥 Все лайки сброшены!');
}

async function resetAllExtraFollowers(){
    if(!currentUser || !currentUser.isAdmin){alert('Только для админа!');return;}
    if(!confirm('⚠️ ВНИМАНИЕ! Это сбросит ВСЕХ накрученных подписчиков у ВСЕХ юзеров!\n\nРеальные подписчики останутся.\n\nПродолжить?')) return;

    const updates = {};
    Object.keys(allUsers).forEach(key => {
        updates[`users/${key}/extraFollowers`] = 0;
    });

    for(const path in updates){
        await fbWrite(path, 0);
    }

    alert('💥 Накрученные подписчики сброшены у всех!');
}
// ============================================
//  ДРУЗЬЯ + СТЕНА + ПОДАРКИ
// ============================================

let allFriends = {}; // Все дружбы
let allWallPosts = {}; // Все посты
let allGifts = {}; // Все подарки
let currentFriendsTab = 'friends';

// ============ FIREBASE СЛУШАТЕЛИ ============
function setupFriendsListener(){
    if(firebaseReady){
        fbListen('friends', (data) => {
            allFriends = data || {};
            if(typeof updateFriendsCount === 'function') updateFriendsCount();
            if(typeof renderFriendsList === 'function' && document.getElementById('page-friends').classList.contains('active')){
                renderFriendsList();
            }
            if(typeof checkNewFriendRequests === 'function') checkNewFriendRequests();
        });
    } else {
        setTimeout(setupFriendsListener, 500);
    }
}
setupFriendsListener();

function setupWallPostsListener(){
    if(firebaseReady){
        fbListen('wallPosts', (data) => {
            allWallPosts = data || {};
            if(typeof renderWallPosts === 'function') renderWallPosts();
        });
    } else {
        setTimeout(setupWallPostsListener, 500);
    }
}
setupWallPostsListener();

function setupGiftsListener(){
    if(firebaseReady){
        fbListen('gifts', (data) => {
            allGifts = data || {};
            if(typeof checkNewGifts === 'function') checkNewGifts();
        });
    } else {
        setTimeout(setupGiftsListener, 500);
    }
}
setupGiftsListener();

// ============ ФУНКЦИИ ДРУЖБЫ ============
function getFriendshipStatus(email){
    if(!currentUser) return null;
    const myKey = emailToKey(currentUser.email);
    const targetKey = emailToKey(email);

    if(myKey === targetKey) return 'self';

    // Проверяем есть ли дружба
    const friendKey1 = `${myKey}__${targetKey}`;
    const friendKey2 = `${targetKey}__${myKey}`;

    if(allFriends[friendKey1] || allFriends[friendKey2]){
        const friendship = allFriends[friendKey1] || allFriends[friendKey2];
        if(friendship.status === 'accepted') return 'friend';
        if(friendship.status === 'pending'){
            if(friendship.from === myKey) return 'outgoing';
            return 'incoming';
        }
    }
    return 'none';
}

async function sendFriendRequest(email){
    if(!currentUser){alert('Войди!');return;}
    if(currentUser.banned){alert('Заблокирован!');return;}

    const status = getFriendshipStatus(email);
    if(status === 'self'){alert('Нельзя добавить себя!');return;}
    if(status === 'friend'){alert('Уже друзья!');return;}
    if(status === 'pending' || status === 'outgoing'){alert('Заявка уже отправлена!');return;}
    if(status === 'incoming'){alert('У тебя есть входящая заявка от этого юзера!');return;}

    const myKey = emailToKey(currentUser.email);
    const targetKey = emailToKey(email);
    const friendshipKey = `${myKey}__${targetKey}`;

    await fbWrite(`friends/${friendshipKey}`, {
        from: myKey,
        to: targetKey,
        fromEmail: currentUser.email,
        toEmail: email,
        status: 'pending',
        createdAt: Date.now()
    });

    alert('✅ Заявка в друзья отправлена!');
}

async function acceptFriendRequest(friendshipKey){
    if(!currentUser) return;
    const friendship = allFriends[friendshipKey];
    if(!friendship) return;
    if(emailToKey(currentUser.email) !== friendship.to) return;

    await fbUpdatePath(`friends/${friendshipKey}`, {
        status: 'accepted',
        acceptedAt: Date.now()
    });

    // Показать уведомление отправителю
    const notif = {
        userKey: friendship.from,
        text: `${currentUser.name} принял твою заявку в друзья!`,
        timestamp: Date.now(),
        type: 'friend_accepted'
    };
    const notifRef = window.fbPush(window.fbRef(window.fbDb, 'notifications'));
    await window.fbSet(notifRef, notif);
}

async function declineFriendRequest(friendshipKey){
    if(!confirm('Отклонить заявку в друзья?')) return;
    await fbRemovePath(`friends/${friendshipKey}`);
}

async function removeFriend(friendshipKey){
    if(!confirm('Удалить из друзей?')) return;
    await fbRemovePath(`friends/${friendshipKey}`);
}

async function cancelFriendRequest(friendshipKey){
    if(!confirm('Отменить свою заявку?')) return;
    await fbRemovePath(`friends/${friendshipKey}`);
}

function getFriendsList(){
    if(!currentUser) return [];
    const myKey = emailToKey(currentUser.email);
    const list = [];

    Object.entries(allFriends).forEach(([key, f]) => {
        if(f.status !== 'accepted') return;
        if(f.from === myKey){
            const user = allUsers[f.to];
            if(user) list.push({user, friendshipKey: key});
        } else if(f.to === myKey){
            const user = allUsers[f.from];
            if(user) list.push({user, friendshipKey: key});
        }
    });

    return list;
}

function getIncomingRequests(){
    if(!currentUser) return [];
    const myKey = emailToKey(currentUser.email);
    const list = [];

    Object.entries(allFriends).forEach(([key, f]) => {
        if(f.status !== 'pending') return;
        if(f.to === myKey){
            const user = allUsers[f.from];
            if(user) list.push({user, friendshipKey: key});
        }
    });

    return list;
}

function getOutgoingRequests(){
    if(!currentUser) return [];
    const myKey = emailToKey(currentUser.email);
    const list = [];

    Object.entries(allFriends).forEach(([key, f]) => {
        if(f.status !== 'pending') return;
        if(f.from === myKey){
            const user = allUsers[f.to];
            if(user) list.push({user, friendshipKey: key});
        }
    });

    return list;
}

function updateFriendsCount(){
    if(!currentUser) return;

    const friendsCount = getFriendsList().length;
    const incomingCount = getIncomingRequests().length;
    const outgoingCount = getOutgoingRequests().length;

    // В навбаре
    const badge = document.getElementById('friends-badge');
    if(badge){
        if(incomingCount > 0){
            badge.textContent = incomingCount;
            badge.style.display = 'inline-block';
        } else {
            badge.style.display = 'none';
        }
    }

    // В профиле
    const myFriendsCount = document.getElementById('my-friends-count');
    if(myFriendsCount) myFriendsCount.textContent = friendsCount;

    // На табах
    const tab1 = document.getElementById('friends-count-tab');
    const tab2 = document.getElementById('incoming-count-tab');
    const tab3 = document.getElementById('outgoing-count-tab');
    if(tab1) tab1.textContent = friendsCount;
    if(tab2) tab2.textContent = incomingCount;
    if(tab3) tab3.textContent = outgoingCount;
}

function switchFriendsTab(tab){
    currentFriendsTab = tab;
    document.querySelectorAll('.friends-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    renderFriendsList();
}

function renderFriendsList(){
    const container = document.getElementById('friends-list-container');
    if(!container) return;

    let list = [];
    let emptyMsg = '';

    if(currentFriendsTab === 'friends'){
        list = getFriendsList();
        emptyMsg = 'У тебя пока нет друзей. Найди пользователей и добавь их!';
    } else if(currentFriendsTab === 'incoming'){
        list = getIncomingRequests();
        emptyMsg = 'Нет входящих заявок в друзья';
    } else if(currentFriendsTab === 'outgoing'){
        list = getOutgoingRequests();
        emptyMsg = 'Нет исходящих заявок';
    }

    if(list.length === 0){
        container.innerHTML = `<p style="color:#555;text-align:center;padding:30px;">${emptyMsg}</p>`;
        return;
    }

    container.innerHTML = '';
    list.forEach(({user, friendshipKey}) => {
        const av = user.avatarImg
            ? `<img src="${user.avatarImg}">`
            : (user.avatar || '👤');

        const online = typeof isUserOnline === 'function' && isUserOnline(user.email);
        const statusText = online ? '🟢 Онлайн' : '⚫ Не в сети';

        let actions = '';
        if(currentFriendsTab === 'friends'){
            actions = `
                <button class="friend-btn chat" onclick="startChatWithFriend('${user.email}')">💬 ЧАТ</button>
                <button class="friend-btn remove" onclick="removeFriend('${friendshipKey}')">🗑</button>
            `;
        } else if(currentFriendsTab === 'incoming'){
            actions = `
                <button class="friend-btn accept" onclick="acceptFriendRequest('${friendshipKey}')">✅ ПРИНЯТЬ</button>
                <button class="friend-btn decline" onclick="declineFriendRequest('${friendshipKey}')">❌ ОТКЛОНИТЬ</button>
            `;
        } else if(currentFriendsTab === 'outgoing'){
            actions = `
                <button class="friend-btn decline" onclick="cancelFriendRequest('${friendshipKey}')">❌ ОТМЕНИТЬ</button>
            `;
        }

        const div = document.createElement('div');
        div.className = 'friend-item';
        div.innerHTML = `
            <div class="friend-item-avatar" onclick="openUserProfile('${user.email}')">${av}</div>
            <div class="friend-item-info" onclick="openUserProfile('${user.email}')">
                <div class="friend-item-name">${user.name}</div>
                <div class="friend-item-status">${statusText}</div>
            </div>
            <div class="friend-actions">${actions}</div>
        `;
        container.appendChild(div);
    });
}

async function startChatWithFriend(email){
    // Если функция newChat есть — используем её
    if(typeof openPrivateChat === 'function'){
        openPrivateChat(email);
    } else if(typeof newChat === 'function'){
        showPage('messages');
        setTimeout(() => {
            // Попробуем создать чат напрямую
            const user = Object.values(allUsers).find(u => u.email === email);
            if(user && typeof openChat === 'function'){
                const chatId = typeof getChatId === 'function' ? getChatId(currentUser.email, email) : `chat_${emailToKey(currentUser.email)}_${emailToKey(email)}`;
                openChat(chatId, user);
            }
        }, 300);
    } else {
        alert('Открой раздел СООБЩЕНИЯ и создай чат');
        showPage('messages');
    }
}

// Уведомления о новых заявках
let shownFriendNotifications = {};
function checkNewFriendRequests(){
    if(!currentUser) return;

    const incoming = getIncomingRequests();
    incoming.forEach(({user, friendshipKey}) => {
        if(shownFriendNotifications[friendshipKey]) return;
        shownFriendNotifications[friendshipKey] = true;

        // Показываем уведомление
        showFriendNotification(`👥 ${user.name} хочет добавить тебя в друзья!`, () => {
            showPage('friends');
            switchFriendsTab('incoming');
        });
    });
}

function showFriendNotification(text, onClick){
    const notif = document.createElement('div');
    notif.className = 'notification-friend';
    notif.innerHTML = text;
    notif.onclick = () => {
        if(onClick) onClick();
        notif.remove();
    };
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 8000);
}

// ============================================
//  СТЕНА (WALL POSTS)
// ============================================

async function createWallPost(){
    if(!currentUser){alert('Войди!');return;}
    if(currentUser.banned){alert('Заблокирован!');return;}

    const input = document.getElementById('wall-post-input');
    if(!input) return;
    const text = input.value.trim();
    if(!text){alert('Напиши что-нибудь!');return;}

    const post = {
        authorEmail: currentUser.email,
        authorName: currentUser.name,
        authorAvatar: currentUser.avatar || '👤',
        authorAvatarImg: currentUser.avatarImg || '',
        wallOwnerEmail: currentUser.email, // На своей стене
        text: text,
        likes: {},
        timestamp: Date.now(),
        date: new Date().toLocaleString('ru-RU')
    };

    const newRef = window.fbPush(window.fbRef(window.fbDb, 'wallPosts'));
    await window.fbSet(newRef, post);

    input.value = '';
}

async function deleteWallPost(postId){
    if(!confirm('Удалить пост?')) return;
    await fbRemovePath(`wallPosts/${postId}`);
}

async function likeWallPost(postId){
    if(!currentUser) return;
    const post = allWallPosts[postId];
    if(!post) return;

    const myKey = emailToKey(currentUser.email);
    const likes = post.likes || {};

    if(likes[myKey]){
        delete likes[myKey];
    } else {
        likes[myKey] = true;
    }

    await fbUpdatePath(`wallPosts/${postId}`, {likes: likes});
}

function renderWallPosts(){
    const container = document.getElementById('my-wall-posts');
    if(!container || !currentUser) return;

    // Показываем только свои посты
    const myPosts = Object.entries(allWallPosts)
        .map(([id, p]) => ({...p, id}))
        .filter(p => p.wallOwnerEmail === currentUser.email)
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    if(myPosts.length === 0){
        container.innerHTML = '<p style="color:#555;text-align:center;padding:20px;">На твоей стене пока нет постов</p>';
        return;
    }

    container.innerHTML = '';
    myPosts.forEach(post => {
        const av = post.authorAvatarImg
            ? `<img src="${post.authorAvatarImg}">`
            : (post.authorAvatar || '👤');

        const likesCount = post.likes ? Object.keys(post.likes).length : 0;
        const myKey = emailToKey(currentUser.email);
        const isLiked = post.likes && post.likes[myKey];
        const isMyPost = post.authorEmail === currentUser.email;

        const div = document.createElement('div');
        div.className = 'wall-post';
        div.innerHTML = `
            <div class="wall-post-header">
                <div class="wall-post-avatar" onclick="openUserProfile('${post.authorEmail}')">${av}</div>
                <div class="wall-post-info">
                    <div class="wall-post-author" onclick="openUserProfile('${post.authorEmail}')">${post.authorName}</div>
                    <div class="wall-post-date">${post.date}</div>
                </div>
            </div>
            <div class="wall-post-text">${post.text.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>
            <div class="wall-post-actions">
                <button class="wall-post-btn ${isLiked ? 'liked' : ''}" onclick="likeWallPost('${post.id}')">
                    ${isLiked ? '❤️' : '🤍'} ${likesCount}
                </button>
            </div>
            ${isMyPost ? `<button class="wall-post-delete" onclick="deleteWallPost('${post.id}')">🗑</button>` : ''}
        `;
        container.appendChild(div);
    });
}

// Показать стену другого пользователя
function renderUserWall(email){
    const container = document.getElementById('user-wall-posts');
    if(!container) return;

    const userPosts = Object.entries(allWallPosts)
        .map(([id, p]) => ({...p, id}))
        .filter(p => p.wallOwnerEmail === email)
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    if(userPosts.length === 0){
        container.innerHTML = '<p style="color:#555;text-align:center;padding:20px;">На этой стене нет постов</p>';
        return;
    }

    container.innerHTML = '';
    userPosts.forEach(post => {
        const av = post.authorAvatarImg
            ? `<img src="${post.authorAvatarImg}">`
            : (post.authorAvatar || '👤');

        const likesCount = post.likes ? Object.keys(post.likes).length : 0;
        const myKey = currentUser ? emailToKey(currentUser.email) : '';
        const isLiked = post.likes && post.likes[myKey];

        const div = document.createElement('div');
        div.className = 'wall-post';
        div.innerHTML = `
            <div class="wall-post-header">
                <div class="wall-post-avatar">${av}</div>
                <div class="wall-post-info">
                    <div class="wall-post-author">${post.authorName}</div>
                    <div class="wall-post-date">${post.date}</div>
                </div>
            </div>
            <div class="wall-post-text">${post.text.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>
            <div class="wall-post-actions">
                <button class="wall-post-btn ${isLiked ? 'liked' : ''}" onclick="likeWallPost('${post.id}')">
                    ${isLiked ? '❤️' : '🤍'} ${likesCount}
                </button>
            </div>
        `;
        container.appendChild(div);
    });
}

// ============================================
//  ПОДАРКИ
// ============================================

const GIFT_TYPES = {
    money10: { icon: '💰', name: '10 РУБЛЕЙ', price: 10, type: 'money', amount: 10 },
    money25: { icon: '💰', name: '25 РУБЛЕЙ', price: 25, type: 'money', amount: 25 },
    money50: { icon: '💰', name: '50 РУБЛЕЙ', price: 50, type: 'money', amount: 50 },
    money100: { icon: '💎', name: '100 РУБЛЕЙ', price: 100, type: 'money', amount: 100 },
    sub_basic: { icon: '🎬', name: 'BASIC ПОДПИСКА', price: 15, type: 'subscription', level: 'basic' },
    sub_lux: { icon: '💎', name: 'LUX ПОДПИСКА', price: 30, type: 'subscription', level: 'lux' },
    sub_pro: { icon: '👑', name: 'PRO ПОДПИСКА', price: 60, type: 'subscription', level: 'pro' },
    heart: { icon: '❤️', name: 'СЕРДЕЧКО', price: 5, type: 'virtual' },
    star: { icon: '⭐', name: 'ЗВЕЗДА', price: 10, type: 'virtual' },
    crown: { icon: '👑', name: 'КОРОНА', price: 20, type: 'virtual' },
    diamond: { icon: '💎', name: 'БРИЛЛИАНТ', price: 50, type: 'virtual' },
    rose: { icon: '🌹', name: 'РОЗА', price: 15, type: 'virtual' }
};

let selectedGiftType = null;

function openGiftModal(recipientEmail){
    if(!currentUser){alert('Войди!');return;}
    if(recipientEmail === currentUser.email){alert('Нельзя подарить себе!');return;}

    const recipient = Object.values(allUsers).find(u => u.email === recipientEmail);
    if(!recipient){alert('Пользователь не найден!');return;}

    document.getElementById('gift-recipient-email').value = recipientEmail;

    const av = recipient.avatarImg
        ? `<img src="${recipient.avatarImg}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;">`
        : `<span style="font-size:2rem;">${recipient.avatar || '👤'}</span>`;

    document.getElementById('gift-recipient-info').innerHTML = `
        ${av}
        <div>
            <div style="font-weight:700;">Кому: ${recipient.name}</div>
            <div style="color:#888;font-size:0.85rem;">${recipient.email}</div>
        </div>
    `;

    // Рендерим типы подарков
    renderGiftTypes();

    selectedGiftType = null;
    document.getElementById('gift-message').value = '';
    document.getElementById('gift-modal').classList.add('show');
}

function renderGiftTypes(){
    const container = document.getElementById('gift-types-container');
    if(!container) return;

    const myBalance = currentUser.wallet && currentUser.wallet.RUB ? currentUser.wallet.RUB : 0;

    container.innerHTML = '';
    Object.entries(GIFT_TYPES).forEach(([id, gift]) => {
        const div = document.createElement('div');
        div.className = 'gift-type';
        const canAfford = myBalance >= gift.price;
        div.style.opacity = canAfford ? '1' : '0.4';
        div.style.cursor = canAfford ? 'pointer' : 'not-allowed';
        div.innerHTML = `
            <div class="gift-type-icon">${gift.icon}</div>
            <div class="gift-type-name">${gift.name}</div>
            <div class="gift-type-price">${gift.price} ₽</div>
        `;
        if(canAfford){
            div.onclick = () => selectGiftType(id, div);
        } else {
            div.onclick = () => alert('Недостаточно средств!');
        }
        container.appendChild(div);
    });
}

function selectGiftType(id, element){
    selectedGiftType = id;
    document.querySelectorAll('.gift-type').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');
}

function closeGiftModal(){
    document.getElementById('gift-modal').classList.remove('show');
    selectedGiftType = null;
}

async function sendGift(){
    if(!currentUser){alert('Войди!');return;}
    if(!selectedGiftType){alert('Выбери подарок!');return;}

    const recipientEmail = document.getElementById('gift-recipient-email').value;
    if(!recipientEmail) return;

    const gift = GIFT_TYPES[selectedGiftType];
    if(!gift) return;

    const myBalance = currentUser.wallet && currentUser.wallet.RUB ? currentUser.wallet.RUB : 0;
    if(myBalance < gift.price){
        alert('Недостаточно средств!');
        return;
    }

    if(!confirm(`Подарить "${gift.name}" за ${gift.price} ₽?`)) return;

    const message = document.getElementById('gift-message').value.trim();
    const recipient = Object.values(allUsers).find(u => u.email === recipientEmail);
    if(!recipient) return;

    // Снимаем деньги с отправителя
    const newBalance = myBalance - gift.price;
    await fbUpdatePath(`users/${emailToKey(currentUser.email)}/wallet`, {
        ...currentUser.wallet,
        RUB: newBalance
    });

    // Даём подарок получателю
    const recipientKey = emailToKey(recipientEmail);
    if(gift.type === 'money'){
        // Деньги
        const currentBalance = recipient.wallet && recipient.wallet.RUB ? recipient.wallet.RUB : 0;
        await fbUpdatePath(`users/${recipientKey}/wallet`, {
            ...recipient.wallet,
            RUB: currentBalance + gift.amount
        });
    } else if(gift.type === 'subscription'){
        // Подписка
        await fbUpdatePath(`users/${recipientKey}`, {
            subscription: gift.level
        });
    }
    // virtual — просто уведомление

    // Записываем подарок
    const giftData = {
        from: currentUser.email,
        fromName: currentUser.name,
        to: recipientEmail,
        giftType: selectedGiftType,
        giftIcon: gift.icon,
        giftName: gift.name,
        message: message,
        timestamp: Date.now(),
        seen: false
    };
    const giftRef = window.fbPush(window.fbRef(window.fbDb, 'gifts'));
    await window.fbSet(giftRef, giftData);

    closeGiftModal();
    alert(`✅ Подарок "${gift.name}" отправлен ${recipient.name}!`);
}

// Проверка новых подарков
let shownGiftNotifications = {};
function checkNewGifts(){
    if(!currentUser) return;

    Object.entries(allGifts).forEach(([id, gift]) => {
        if(gift.to !== currentUser.email) return;
        if(gift.seen) return;
        if(shownGiftNotifications[id]) return;

        shownGiftNotifications[id] = true;
        showGiftReceived(id, gift);
    });
}

function showGiftReceived(id, gift){
    const modal = document.getElementById('gift-received-modal');
    const content = document.getElementById('gift-received-content');
    if(!modal || !content) return;

    content.innerHTML = `
        <div style="font-size:4rem;margin:10px 0;">${gift.giftIcon}</div>
        <div style="font-size:1.3rem;margin:10px 0;"><b>${gift.giftName}</b></div>
        <div style="margin:15px 0;">От: <b>${gift.fromName}</b></div>
        ${gift.message ? `<div style="background:rgba(0,0,0,0.3);padding:10px;border-radius:8px;margin-top:15px;font-style:italic;">"${gift.message.replace(/</g,'&lt;')}"</div>` : ''}
    `;

    modal.classList.add('show');
    modal.dataset.giftId = id;
}

async function closeGiftReceivedModal(){
    const modal = document.getElementById('gift-received-modal');
    const giftId = modal.dataset.giftId;
    if(giftId){
        await fbUpdatePath(`gifts/${giftId}`, {seen: true});
    }
    modal.classList.remove('show');
}
// ============================================
//  ИНТЕГРАЦИЯ: ПРОФИЛЬ + SHOWPAGE + ДРУЗЬЯ
// ============================================

// Обновляем showPage для новых страниц
if(typeof showPage === 'function'){
    const origShowPage = showPage;
    showPage = function(pageId){
        origShowPage(pageId);
        if(pageId === 'friends'){
            updateFriendsCount();
            renderFriendsList();
        }
        if(pageId === 'profile'){
            renderWallPosts();
            updateFriendsCount();
        }
    };
}

// Обновляем loginSuccess
if(typeof loginSuccess === 'function'){
    const origLoginSuccess = loginSuccess;
    loginSuccess = function(){
        origLoginSuccess();
        updateFriendsCount();
        checkNewGifts();
        checkNewFriendRequests();
        renderWallPosts();
    };
}

// Обновляем openUserProfile для друзей + подарков + стены
if(typeof openUserProfile === 'function'){
    const origOpenUserProfile = openUserProfile;
    openUserProfile = function(email){
        const user = allUsers[emailToKey(email)];
        if(!user) return;
        const isMe = currentUser && user.email === currentUser.email;

        // Определяем статус дружбы
        const friendStatus = getFriendshipStatus(email);
        const following = typeof isFollowing === 'function' && isFollowing(email);

        const av = user.avatarImg
            ? `<img src="${user.avatarImg}" style="width:100%;height:100%;object-fit:cover;">`
            : (user.avatar || '👤');

        let badge = '';
        if(user.isAdmin) badge = '<span class="badge-admin">🔧 АДМИН</span>';
        else if(user.subscription === 'rapport') badge = '<span class="badge-rapport">🛡️ RAPPORT</span>';
        else if(user.subscription === 'pro') badge = '<span class="badge-pro">👑 PRO</span>';
        else if(user.subscription === 'lux') badge = '<span class="badge-lux">💎 LUX</span>';
        else if(user.subscription === 'basic' || user.subscription === true) badge = '<span class="badge-basic">🎬 BASIC</span>';
        else if(user.subscription === 'pissing') badge = '<span class="badge-pissing">💧 ПИСАЮЩИЙ</span>';

        let nickStyle = '';
        if(user.nickColor && user.nickColor !== 'default'){
            const col = NICK_COLORS.find(c => c.id === user.nickColor);
            if(col){
                if(col.color === 'rainbow'){
                    nickStyle = `background:linear-gradient(135deg,#ff0000,#ff7f00,#ffff00,#00ff00,#0000ff,#4b0082,#9400d3);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;font-weight:700;`;
                } else {
                    nickStyle = `color:${col.color};text-shadow:0 0 15px ${col.color};font-weight:700;`;
                }
            }
        }

        const online = typeof isUserOnline === 'function' && isUserOnline(email);
        const onlineText = online ? '<span class="friend-status-dot"></span> Онлайн' : '<span class="friend-status-dot offline"></span> Не в сети';

        // Кнопки действий
        let friendBtn = '';
        if(!isMe){
            if(friendStatus === 'friend'){
                friendBtn = '<button class="add-friend-btn friend" disabled>✅ ДРУЗЬЯ</button>';
            } else if(friendStatus === 'outgoing'){
                friendBtn = '<button class="add-friend-btn pending" disabled>⏳ ЗАЯВКА ОТПРАВЛЕНА</button>';
            } else if(friendStatus === 'incoming'){
                friendBtn = '<button class="add-friend-btn" onclick="showPage(\'friends\')">📥 ПРИНЯТЬ ЗАЯВКУ</button>';
            } else {
                friendBtn = `<button class="add-friend-btn" onclick="sendFriendRequest('${email}')">➕ ДОБАВИТЬ В ДРУЗЬЯ</button>`;
            }
        }

        let followBtn = '';
        if(!isMe){
            followBtn = `<button class="follow-btn ${following ? 'following' : ''}" onclick="followUser('${email}');setTimeout(()=>openUserProfile('${email}'),300);">${following ? '✓ ПОДПИСАН' : '➕ ПОДПИСАТЬСЯ'}</button>`;
        }

        let chatBtn = '';
        if(!isMe){
            chatBtn = `<button class="follow-btn" style="background:var(--blue);" onclick="closeUserProfile();startChatWith('${email}');">💬 НАПИСАТЬ</button>`;
        }

        let giftBtn = '';
        if(!isMe){
            giftBtn = `<button class="gift-btn" onclick="closeUserProfile();openGiftModal('${email}');">🎁 ПОДАРИТЬ</button>`;
        }

        // Стена пользователя
        const wallPosts = Object.entries(allWallPosts)
            .map(([id, p]) => ({...p, id}))
            .filter(p => p.wallOwnerEmail === email)
            .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
            .slice(0, 5);

        let wallHTML = '';
        if(wallPosts.length > 0){
            wallHTML = '<div style="margin-top:20px;text-align:left;">';
            wallHTML += '<div style="font-family:\'Bebas Neue\';letter-spacing:2px;color:var(--gold);margin-bottom:10px;">📮 СТЕНА</div>';
            wallPosts.forEach(post => {
                const postLikes = post.likes ? Object.keys(post.likes).length : 0;
                const myKey = currentUser ? emailToKey(currentUser.email) : '';
                const postLiked = post.likes && post.likes[myKey];
                wallHTML += `
                    <div class="wall-post" style="margin-bottom:10px;">
                        <div class="wall-post-text" style="font-size:0.9rem;">${post.text.replace(/</g,'&lt;').substring(0, 200)}</div>
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;">
                            <button class="wall-post-btn ${postLiked ? 'liked' : ''}" onclick="likeWallPost('${post.id}')">${postLiked ? '❤️' : '🤍'} ${postLikes}</button>
                            <span style="color:#555;font-size:0.75rem;">${post.date}</span>
                        </div>
                    </div>
                `;
            });
            wallHTML += '</div>';
        }

        document.getElementById('user-profile-body').innerHTML = `
            <div style="width:120px;height:120px;border-radius:50%;margin:0 auto 15px;border:3px solid var(--red);display:flex;align-items:center;justify-content:center;font-size:4rem;background:#111;overflow:hidden;">${av}</div>
            <div style="font-size:0.85rem;color:#888;margin-bottom:5px;">${onlineText}</div>
            <h2 style="font-family:'Bebas Neue';font-size:2rem;letter-spacing:3px;margin-bottom:5px;${nickStyle}">${user.name}</h2>
            <p style="color:#666;margin-bottom:10px;">${user.email}</p>
            <div style="margin:10px 0;">${badge}</div>
            <p style="color:#999;font-style:italic;margin:15px 0;">${user.bio || 'Нет описания'}</p>
            ${user.birthday ? `<div style="color:#888;font-size:0.85rem;">🎂 День рождения: ${user.birthday}</div>` : ''}
            <div class="profile-stats" style="margin:15px auto;">
                <div class="profile-stat" onclick="showFollowers('${email}')">
                    <div class="profile-stat-number">${typeof getFollowersCount === 'function' ? getFollowersCount(email) : 0}</div>
                    <div class="profile-stat-label">ПОДПИСЧИКИ</div>
                </div>
                <div class="profile-stat" onclick="showFollowing('${email}')">
                    <div class="profile-stat-number">${typeof getFollowingCount === 'function' ? getFollowingCount(email) : 0}</div>
                    <div class="profile-stat-label">ПОДПИСКИ</div>
                </div>
            </div>
            <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:5px;margin:15px 0;">
                ${friendBtn}
                ${followBtn}
                ${chatBtn}
                ${giftBtn}
            </div>
            ${wallHTML}
        `;
        document.getElementById('user-profile-modal').classList.add('show');
    };
}

// Писать пост на стене другого пользователя
async function writeWallPost(targetEmail){
    if(!currentUser){alert('Войди!');return;}
    if(currentUser.banned){alert('Заблокирован!');return;}

    const text = prompt('Напиши на стене:');
    if(!text || !text.trim()) return;

    const post = {
        authorEmail: currentUser.email,
        authorName: currentUser.name,
        authorAvatar: currentUser.avatar || '👤',
        authorAvatarImg: currentUser.avatarImg || '',
        wallOwnerEmail: targetEmail,
        text: text.trim().substring(0, 500),
        likes: {},
        timestamp: Date.now(),
        date: new Date().toLocaleString('ru-RU')
    };

    const newRef = window.fbPush(window.fbRef(window.fbDb, 'wallPosts'));
    await window.fbSet(newRef, post);

    alert('✅ Пост опубликован!');
}

// ============================================
//  PUSH УВЕДОМЛЕНИЯ (БРАУЗЕР)
// ============================================

async function requestPushPermission(){
    if(!('Notification' in window)){
        console.log('Push не поддерживается');
        return false;
    }

    if(Notification.permission === 'granted') return true;

    if(Notification.permission !== 'denied'){
        const result = await Notification.requestPermission();
        return result === 'granted';
    }

    return false;
}

function sendPushNotification(title, body, icon){
    if(Notification.permission !== 'granted') return;
    if(document.hasFocus()) return; // Не показываем если сайт открыт

    try {
        new Notification(title, {
            body: body,
            icon: icon || 'https://github.com/ivansabaev04-svg/theded-videos/releases/download/v1/icon.png',
            badge: 'https://github.com/ivansabaev04-svg/theded-videos/releases/download/v1/icon.png'
        });
    } catch(e){
        console.log('Push ошибка:', e);
    }
}

// Запрашиваем разрешение при входе
setTimeout(() => {
    if(currentUser){
        requestPushPermission();
    }
}, 5000);

// Слушаем новые сообщения для push
let lastMessageTimestamp = Date.now();
setInterval(() => {
    if(!currentUser) return;
    if(Notification.permission !== 'granted') return;

    // Проверяем новые сообщения
    const myKey = emailToKey(currentUser.email);
    Object.entries(allMessages).forEach(([chatId, messages]) => {
        if(chatId.startsWith('group_')){
            // Групповые
            const groupId = chatId.replace('group_','');
            const group = allGroups ? allGroups[groupId] : null;
            if(!group || !group.members || !group.members[myKey]) return;
            Object.values(messages).forEach(m => {
                if(m.from !== currentUser.email && m.timestamp > lastMessageTimestamp){
                    if(!m.readBy || !m.readBy[myKey]){
                        sendPushNotification(
                            `${m.authorName || 'Кто-то'} в ${group.name || 'группе'}`,
                            m.text || (m.type === 'photo' ? '📸 Фото' : m.type === 'voice' ? '🎤 Голосовое' : m.type === 'sticker' ? m.sticker : 'Новое сообщение')
                        );
                    }
                }
            });
        } else if(chatId.includes(myKey)){
            // Личные
            Object.values(messages).forEach(m => {
                if(m.to === currentUser.email && m.timestamp > lastMessageTimestamp && !m.read){
                    const sender = allUsers[emailToKey(m.from)];
                    sendPushNotification(
                        sender ? sender.name : 'Новое сообщение',
                        m.text || (m.type === 'photo' ? '📸 Фото' : m.type === 'voice' ? '🎤 Голосовое' : m.type === 'sticker' ? m.sticker : 'Сообщение')
                    );
                }
            });
        }
    });

    lastMessageTimestamp = Date.now();
}, 10000);

// ============================================
//  АНИМАЦИИ ПЕРЕХОДОВ
// ============================================

// Добавляем плавные анимации при переключении страниц
const style = document.createElement('style');
style.textContent = `
    .page {
        animation: pageSlideIn 0.3s ease !important;
    }
    @keyframes pageSlideIn {
        from {
            opacity: 0;
            transform: translateY(15px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .folder, .ep-card, .friend-item, .wall-post, .news-item, .top-user-item {
        animation: itemFadeIn 0.4s ease forwards;
        opacity: 0;
    }

    @keyframes itemFadeIn {
        to {
            opacity: 1;
            transform: translateY(0);
        }
        from {
            opacity: 0;
            transform: translateY(10px);
        }
    }

    .notification-friend {
        animation: slideInRight 0.5s ease !important;
    }

    @keyframes slideInRight {
        from { transform: translateX(120%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    .msg-bubble {
        animation: msgAppear 0.3s ease;
    }

    @keyframes msgAppear {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
    }

    .login-box, .sub-ad-box, .gift-content, .warn-modal-box, .gift-received-box {
        animation: modalPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
    }

    @keyframes modalPop {
        from { opacity: 0; transform: scale(0.7); }
        to { opacity: 1; transform: scale(1); }
    }

    nav {
        animation: navSlideDown 0.5s ease;
    }

    @keyframes navSlideDown {
        from { transform: translateY(-100%); }
        to { transform: translateY(0); }
    }

    .btn:active, .action-btn:active, .login-btn:active {
        transform: scale(0.95) !important;
    }
`;
document.head.appendChild(style);

// Stagger animation для списков
function addStaggerAnimation(selector){
    const items = document.querySelectorAll(selector);
    items.forEach((item, i) => {
        item.style.animationDelay = `${i * 0.05}s`;
    });
}

// Применяем stagger при смене страниц
const origShowPage2 = showPage;
showPage = function(pageId){
    origShowPage2(pageId);

    setTimeout(() => {
        addStaggerAnimation('.folder');
        addStaggerAnimation('.ep-card');
        addStaggerAnimation('.friend-item');
        addStaggerAnimation('.wall-post');
        addStaggerAnimation('.news-item');
        addStaggerAnimation('.top-user-item');
    }, 100);
};
// ============ ФИКС СЕРИЙ — ЗАЛИВАЕМ 50 СЕРИЙ В FIREBASE ============
async function fixAllEpisodes(){
    if(!firebaseReady) return;

    // Проверяем есть ли уже серии в Firebase
    const existing = await fbReadOnce('serials/the-ded/episodes');
    if(existing && Object.keys(existing).length >= 50){
        return; // Уже есть
    }

    console.log('Заливаем 50 серий THE DED в Firebase...');

    const episodes = {};
    for(let i = 1; i <= 50; i++){
        episodes[i] = `https://github.com/ivansabaev04-svg/theded-videos/releases/download/v1/${i}.mp4`;
    }

    await fbWrite('serials/the-ded', {
        name: 'THE DED',
        icon: '📁',
        vip: false,
        poster: 'https://github.com/ivansabaev04-svg/theded-videos/releases/download/v1/poster.png',
        createdAt: Date.now(),
        episodes: episodes
    });

    console.log('✅ 50 серий залито!');
}

// Также фиксим updateSerialsFromFirebase чтобы НЕ обнуляла totalEps
if(typeof updateSerialsFromFirebase === 'function'){
    const origUpdateSerials = updateSerialsFromFirebase;
    updateSerialsFromFirebase = function(){
        Object.entries(allSerialsData).forEach(([id, data]) => {
            if(data.episodes){
                Object.entries(data.episodes).forEach(([num, url]) => {
                    VIDEO_URLS[num] = url;
                });
            }

            const existing = SERIALS.find(s => s.id === id);
            if(!existing){
                SERIALS.push({
                    id: id,
                    name: data.name || id,
                    icon: data.icon || '🎬',
                    totalEps: data.episodes ? Object.keys(data.episodes).length : 0,
                    subOnly: data.vip || false,
                    earlyEps: [],
                    poster: data.poster || null
                });
            } else {
                // НЕ трогаем totalEps для THE DED!
                existing.name = data.name || existing.name;
                existing.icon = data.icon || existing.icon;
                existing.subOnly = data.vip !== undefined ? data.vip : existing.subOnly;
                existing.poster = data.poster || existing.poster;

                // Обновляем totalEps ТОЛЬКО если в Firebase больше серий
                if(data.episodes){
                    const fbEpCount = Object.keys(data.episodes).length;
                    if(fbEpCount > existing.totalEps){
                        existing.totalEps = fbEpCount;
                    }
                }
            }
        });
    };
}

// Запускаем фикс через 3 секунды после загрузки
setTimeout(() => {
    fixAllEpisodes();
}, 3000);
// ============================================
//  СКОРОСТЬ ВИДЕО + STORIES + РАМКИ + ИГРЫ + КАЛЕНДАРЬ ДР
// ============================================

// ============ СКОРОСТЬ ВИДЕО ============
function setVideoSpeed(speed){
    const video = document.getElementById('v-player');
    if(!video) return;
    video.playbackRate = speed;

    document.querySelectorAll('.speed-btn').forEach(btn => {
        btn.classList.remove('active');
        if(parseFloat(btn.textContent) === speed) btn.classList.add('active');
    });
}

// ============ STORIES ============
let allStories = {};
let currentStoryUser = null;
let currentStoryIndex = 0;
let storyTimer = null;

function setupStoriesListener(){
    if(firebaseReady){
        fbListen('stories', (data) => {
            allStories = data || {};
            if(typeof renderStoriesBar === 'function') renderStoriesBar();
        });
    } else {
        setTimeout(setupStoriesListener, 500);
    }
}
setupStoriesListener();

function renderStoriesBar(){
    const bar = document.getElementById('stories-bar');
    if(!bar || !currentUser) return;

    // Собираем активные сториз (за последние 24 часа)
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const activeStories = {};

    Object.entries(allStories).forEach(([id, story]) => {
        if(story.status !== 'approved') return;
        if(now - story.timestamp > dayMs) return;

        const key = emailToKey(story.authorEmail);
        if(!activeStories[key]) activeStories[key] = [];
        activeStories[key].push({...story, id});
    });

    bar.innerHTML = '';

    // Кнопка "Добавить сториз"
    const addCircle = document.createElement('div');
    addCircle.className = 'story-circle';
    addCircle.innerHTML = `
        <div class="story-avatar add-story">➕</div>
        <div class="story-name">Добавить</div>
    `;
    addCircle.onclick = () => openStoryCreate();
    bar.appendChild(addCircle);

    // Кружочки пользователей
    Object.entries(activeStories).forEach(([userKey, stories]) => {
        const user = allUsers[userKey];
        if(!user) return;

        const myKey = emailToKey(currentUser.email);
        const viewed = stories.every(s => s.viewedBy && s.viewedBy[myKey]);

        const av = user.avatarImg
            ? `<img src="${user.avatarImg}">`
            : (user.avatar || '👤');

        const circle = document.createElement('div');
        circle.className = 'story-circle';
        circle.innerHTML = `
            <div class="story-avatar ${viewed ? 'viewed' : ''}">${av}</div>
            <div class="story-name">${user.name}</div>
        `;
        circle.onclick = () => openStoryViewer(userKey, stories);
        bar.appendChild(circle);
    });

    // Если нет сториз — скрываем бар
    if(Object.keys(activeStories).length === 0 && bar.children.length <= 1){
        bar.style.display = 'none';
    } else {
        bar.style.display = 'flex';
    }
}

function openStoryCreate(){
    document.getElementById('story-text-input').value = '';
    document.getElementById('story-photo-preview').innerHTML = '';
    document.getElementById('story-create-modal').classList.add('show');
}

function closeStoryCreate(){
    document.getElementById('story-create-modal').classList.remove('show');
}

function previewStoryPhoto(event){
    const file = event.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        document.getElementById('story-photo-preview').innerHTML = `<img src="${e.target.result}" style="max-width:200px;max-height:200px;border-radius:10px;">`;
    };
    reader.readAsDataURL(file);
}

async function createStory(){
    if(!currentUser){alert('Войди!');return;}
    if(currentUser.banned){alert('Заблокирован!');return;}

    const type = document.getElementById('story-type-select').value;
    const text = document.getElementById('story-text-input').value.trim();
    const fileInput = document.getElementById('story-photo-input');

    let photoData = '';

    if(type === 'photo'){
        if(!fileInput.files[0] && !text){
            alert('Выбери фото или напиши текст!');
            return;
        }

        if(fileInput.files[0]){
            const file = fileInput.files[0];
            if(file.size > 3000000){alert('Максимум 3 МБ!');return;}

            photoData = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = new Image();
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        const maxSize = 800;
                        let w = img.width, h = img.height;
                        if(w > h){ if(w > maxSize){h = h*(maxSize/w); w = maxSize;} }
                        else { if(h > maxSize){w = w*(maxSize/h); h = maxSize;} }
                        canvas.width = w; canvas.height = h;
                        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                        resolve(canvas.toDataURL('image/jpeg', 0.75));
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            });
        }
    } else {
        if(!text){alert('Напиши текст!');return;}
    }

    // Отправляем на модерацию
    const story = {
        authorEmail: currentUser.email,
        authorName: currentUser.name,
        authorAvatar: currentUser.avatar || '👤',
        authorAvatarImg: currentUser.avatarImg || '',
        type: photoData ? 'photo' : 'text',
        photo: photoData,
        text: text,
        timestamp: Date.now(),
        date: new Date().toLocaleString('ru-RU'),
        status: currentUser.isAdmin ? 'approved' : 'pending',
        viewedBy: {}
    };

    const newRef = window.fbPush(window.fbRef(window.fbDb, 'stories'));
    await window.fbSet(newRef, story);

    closeStoryCreate();

    if(currentUser.isAdmin){
        alert('✅ Сториз опубликована!');
    } else {
        alert('✅ Сториз отправлена на модерацию!');
    }
}

function openStoryViewer(userKey, stories){
    currentStoryUser = userKey;
    currentStoryIndex = 0;

    stories.sort((a, b) => a.timestamp - b.timestamp);

    const viewer = document.getElementById('story-viewer');
    viewer.classList.add('show');
    viewer.dataset.stories = JSON.stringify(stories);

    showCurrentStory();
}

function showCurrentStory(){
    const viewer = document.getElementById('story-viewer');
    const stories = JSON.parse(viewer.dataset.stories || '[]');
    if(currentStoryIndex >= stories.length || currentStoryIndex < 0){
        closeStoryViewer();
        return;
    }

    const story = stories[currentStoryIndex];
    const user = allUsers[emailToKey(story.authorEmail)];

    // Хедер
    const av = story.authorAvatarImg
        ? `<img src="${story.authorAvatarImg}">`
        : (story.authorAvatar || '👤');

    document.getElementById('story-viewer-avatar').innerHTML = av;
    document.getElementById('story-viewer-name').textContent = story.authorName;

    const ago = Math.floor((Date.now() - story.timestamp) / 60000);
    document.getElementById('story-viewer-time').textContent =
        ago < 60 ? `${ago} мин назад` :
        ago < 1440 ? `${Math.floor(ago/60)} ч назад` : 'Давно';

    // Прогресс
    const progress = document.getElementById('story-progress');
    progress.innerHTML = '';
    stories.forEach((s, i) => {
        const bar = document.createElement('div');
        bar.className = 'story-progress-bar';
        const fill = document.createElement('div');
        fill.className = 'story-progress-fill';
        if(i < currentStoryIndex) fill.classList.add('done');
        else if(i === currentStoryIndex) setTimeout(() => fill.classList.add('active'), 50);
        bar.appendChild(fill);
        progress.appendChild(bar);
    });

    // Контент
    const body = document.getElementById('story-viewer-body');
    if(story.type === 'photo' && story.photo){
        body.innerHTML = `<img src="${story.photo}" class="story-viewer-image">`;
        if(story.text){
            body.innerHTML += `<div style="color:white;text-align:center;padding:10px;font-size:0.95rem;">${story.text.replace(/</g,'&lt;')}</div>`;
        }
    } else {
        body.innerHTML = `<div class="story-viewer-text">${story.text.replace(/</g,'&lt;')}</div>`;
    }

    // Отмечаем как просмотренную
    if(currentUser){
        const myKey = emailToKey(currentUser.email);
        if(!story.viewedBy || !story.viewedBy[myKey]){
            fbUpdatePath(`stories/${story.id}/viewedBy/${myKey}`, true);
        }
    }

    // Автопереключение через 5 секунд
    clearTimeout(storyTimer);
    storyTimer = setTimeout(() => nextStory(), 5000);
}

function nextStory(){
    const viewer = document.getElementById('story-viewer');
    const stories = JSON.parse(viewer.dataset.stories || '[]');
    currentStoryIndex++;
    if(currentStoryIndex >= stories.length){
        closeStoryViewer();
    } else {
        showCurrentStory();
    }
}

function prevStory(){
    currentStoryIndex = Math.max(0, currentStoryIndex - 1);
    showCurrentStory();
}

function closeStoryViewer(){
    clearTimeout(storyTimer);
    document.getElementById('story-viewer').classList.remove('show');
    renderStoriesBar();
}

// ============ РАМКИ АВАТАРОК ============
const AVATAR_FRAMES = [
    { id: 'none', name: 'БЕЗ РАМКИ', css: '', requires: null, icon: '⚪' },
    { id: 'red', name: 'КРАСНАЯ', css: 'frame-red', requires: null, icon: '🔴' },
    { id: 'blue', name: 'СИНЯЯ', css: 'frame-blue', requires: 'pissing', icon: '🔵' },
    { id: 'green', name: 'ЗЕЛЁНАЯ', css: 'frame-green', requires: 'pissing', icon: '🟢' },
    { id: 'purple', name: 'ФИОЛЕТОВАЯ', css: 'frame-purple', requires: 'basic', icon: '🟣' },
    { id: 'orange', name: 'ОРАНЖЕВАЯ', css: 'frame-orange', requires: 'basic', icon: '🟠' },
    { id: 'gold', name: 'ЗОЛОТАЯ', css: 'frame-gold', requires: 'lux', icon: '💛' },
    { id: 'diamond', name: 'БРИЛЛИАНТ', css: 'frame-diamond', requires: 'lux', icon: '💎' },
    { id: 'neon', name: 'НЕОНОВАЯ', css: 'frame-neon', requires: 'lux', icon: '💚' },
    { id: 'rainbow', name: 'РАДУЖНАЯ', css: 'frame-rainbow', requires: 'pro', icon: '🌈' },
    { id: 'fire', name: 'ОГНЕННАЯ', css: 'frame-fire', requires: 'pro', icon: '🔥' },
    { id: 'ice', name: 'ЛЕДЯНАЯ', css: 'frame-ice', requires: 'pro', icon: '❄️' },
    { id: 'lightning', name: 'МОЛНИЯ', css: 'frame-lightning', requires: 'rapport', icon: '⚡' },
    { id: 'skull', name: 'ЧЕРЕПА', css: 'frame-skull', requires: 'rapport', icon: '💀' },
    { id: 'crown', name: 'КОРОНА', css: 'frame-crown', requires: 'rapport', icon: '👑' }
];

function renderFrames(){
    const grid = document.getElementById('frames-grid');
    if(!grid || !currentUser) return;

    const activeFrame = currentUser.avatarFrame || 'none';
    const levels = {pissing:0.5, basic:1, lux:2, pro:3, rapport:3};
    const userLevel = levels[getUserSubLevel()] || 0;

    grid.innerHTML = '';
    AVATAR_FRAMES.forEach(frame => {
        const requiredLevel = frame.requires ? (levels[frame.requires] || 0) : 0;
        const canUse = userLevel >= requiredLevel;

        const div = document.createElement('div');
        div.className = 'frame-option' + (activeFrame === frame.id ? ' selected' : '') + (!canUse ? ' locked' : '');

        div.innerHTML = `
            <div class="frame-preview" style="${frame.css ? 'border:3px solid' : ''}">${frame.icon || '⚪'}</div>
            <div class="frame-name">${frame.name}</div>
            ${frame.requires ? `<div class="frame-requires">${frame.requires.toUpperCase()}+</div>` : '<div class="frame-requires" style="color:#4CAF50;">БЕСПЛАТНО</div>'}
        `;

        if(canUse){
            div.onclick = () => {
                selectFrame(frame.id);
                playSound('click');
            };
        } else {
            div.onclick = () => alert('🔒 Нужна подписка ' + (frame.requires || '').toUpperCase() + ' или выше!');
        }

        grid.appendChild(div);
    });
}

async function selectFrame(frameId){
    if(!currentUser) return;
    currentUser.avatarFrame = frameId;
    await saveCurrentUserToFirebase();
    renderFrames();
    updateAvatarDisplay();
    alert('✅ Рамка установлена!');
}

// ============ МИНИ-ИГРЫ ============

// --- КРЕСТИКИ-НОЛИКИ ---
let tttBoard = ['','','','','','','','',''];
let tttCurrentPlayer = 'X';
let tttGameOver = false;

function openTicTacToe(){
    resetTTT();
    document.getElementById('ttt-modal').classList.add('show');
}

function closeTTT(){
    document.getElementById('ttt-modal').classList.remove('show');
}

function resetTTT(){
    tttBoard = ['','','','','','','','',''];
    tttCurrentPlayer = 'X';
    tttGameOver = false;
    document.getElementById('ttt-status').textContent = 'Ты ходишь первым! (❌)';
    renderTTTBoard();
}

function renderTTTBoard(){
    const board = document.getElementById('ttt-board');
    if(!board) return;
    board.innerHTML = '';

    tttBoard.forEach((cell, i) => {
        const div = document.createElement('div');
        div.className = 'ttt-cell' + (cell === 'X' ? ' x' : cell === 'O' ? ' o' : '');
        div.textContent = cell === 'X' ? '❌' : cell === 'O' ? '⭕' : '';
        if(!cell && !tttGameOver){
            div.onclick = () => tttMove(i);
        }
        board.appendChild(div);
    });
}

function tttMove(index){
    if(tttBoard[index] || tttGameOver) return;

    tttBoard[index] = 'X';
    renderTTTBoard();

    if(checkTTTWinner('X')){
        document.getElementById('ttt-status').textContent = '🎉 ТЫ ПОБЕДИЛ!';
        tttGameOver = true;
        highlightWinningCells('X');
        return;
    }

    if(tttBoard.every(c => c)){
        document.getElementById('ttt-status').textContent = '🤝 НИЧЬЯ!';
        tttGameOver = true;
        return;
    }

    // Ход компьютера
    setTimeout(() => {
        tttAIMove();
        renderTTTBoard();

        if(checkTTTWinner('O')){
            document.getElementById('ttt-status').textContent = '😢 КОМПЬЮТЕР ПОБЕДИЛ!';
            tttGameOver = true;
            highlightWinningCells('O');
            return;
        }

        if(tttBoard.every(c => c)){
            document.getElementById('ttt-status').textContent = '🤝 НИЧЬЯ!';
            tttGameOver = true;
        }
    }, 300);
}

function tttAIMove(){
    // Простой AI
    // 1. Попробовать выиграть
    for(let i = 0; i < 9; i++){
        if(!tttBoard[i]){
            tttBoard[i] = 'O';
            if(checkTTTWinner('O')) return;
            tttBoard[i] = '';
        }
    }
    // 2. Заблокировать игрока
    for(let i = 0; i < 9; i++){
        if(!tttBoard[i]){
            tttBoard[i] = 'X';
            if(checkTTTWinner('X')){ tttBoard[i] = 'O'; return; }
            tttBoard[i] = '';
        }
    }
    // 3. Центр
    if(!tttBoard[4]){ tttBoard[4] = 'O'; return; }
    // 4. Углы
    const corners = [0,2,6,8].filter(i => !tttBoard[i]);
    if(corners.length){ tttBoard[corners[Math.floor(Math.random()*corners.length)]] = 'O'; return; }
    // 5. Остальные
    const empty = tttBoard.map((c,i) => c ? -1 : i).filter(i => i >= 0);
    if(empty.length) tttBoard[empty[Math.floor(Math.random()*empty.length)]] = 'O';
}

const TTT_WINS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

function checkTTTWinner(player){
    return TTT_WINS.some(combo => combo.every(i => tttBoard[i] === player));
}

function highlightWinningCells(player){
    const cells = document.querySelectorAll('.ttt-cell');
    TTT_WINS.forEach(combo => {
        if(combo.every(i => tttBoard[i] === player)){
            combo.forEach(i => cells[i].classList.add('win'));
        }
    });
}

// --- ВИКТОРИНА ---
const QUIZ_QUESTIONS = [
    { q: 'Сколько серий в первом сезоне THE DED?', opts: ['25','38','50','100'], correct: 2 },
    { q: 'Какая самая дорогая подписка?', opts: ['PRO','LUX','РАППОРТ','BASIC'], correct: 2 },
    { q: 'Сколько стоит подписка ПИСАЮЩИЙ?', opts: ['5 ₽','1 ₽','10 ₽','Бесплатно'], correct: 1 },
    { q: 'Сколько человек максимум в группе?', opts: ['5','10','20','50'], correct: 1 },
    { q: 'Какая подписка даёт права модератора?', opts: ['PRO','LUX','РАППОРТ','BASIC'], correct: 2 },
    { q: 'Что даёт подписка LUX?', opts: ['Только серии','Аватарки от Вани','Светящийся ник','Модерацию'], correct: 1 },
    { q: 'После скольких предупреждений автобан?', opts: ['1','2','3','5'], correct: 2 },
    { q: 'Сколько стоит подписка PRO?', opts: ['25 ₽','50 ₽','100 ₽','159 ₽'], correct: 1 },
    { q: 'Какой максимальный размер фото в чате?', opts: ['1 МБ','3 МБ','5 МБ','10 МБ'], correct: 1 },
    { q: 'Сколько бесплатных эмодзи в чате?', opts: ['5','8','10','20'], correct: 1 }
];

let quizCurrentQuestion = 0;
let quizScore = 0;
let quizAnswered = false;

function openQuiz(){
    quizCurrentQuestion = 0;
    quizScore = 0;
    quizAnswered = false;
    document.getElementById('quiz-modal').classList.add('show');
    showQuizQuestion();
}

function closeQuiz(){
    document.getElementById('quiz-modal').classList.remove('show');
}

function showQuizQuestion(){
    if(quizCurrentQuestion >= QUIZ_QUESTIONS.length){
        // Конец игры
        document.getElementById('quiz-question').innerHTML = `
            <div style="font-size:3rem;margin:20px 0;">🏆</div>
            <div style="font-size:1.5rem;">ИГРА ОКОНЧЕНА!</div>
            <div style="margin-top:15px;">Правильных ответов: <b>${quizScore}</b> из <b>${QUIZ_QUESTIONS.length}</b></div>
            ${quizScore >= 7 ? '<div style="color:var(--gold);margin-top:10px;">🌟 Отличный результат!</div>' :
              quizScore >= 5 ? '<div style="color:var(--green);margin-top:10px;">👍 Хороший результат!</div>' :
              '<div style="color:var(--red);margin-top:10px;">📚 Надо подтянуть знания!</div>'}
        `;
        document.getElementById('quiz-options').innerHTML = `
            <button class="btn" onclick="openQuiz()" style="width:100%;">🔄 ИГРАТЬ СНОВА</button>
        `;
        return;
    }

    const q = QUIZ_QUESTIONS[quizCurrentQuestion];
    quizAnswered = false;

    document.getElementById('quiz-progress').textContent = `Вопрос ${quizCurrentQuestion + 1} / ${QUIZ_QUESTIONS.length}`;
    document.getElementById('quiz-score').textContent = `Очки: ${quizScore}`;
    document.getElementById('quiz-question').textContent = q.q;

    const opts = document.getElementById('quiz-options');
    opts.innerHTML = '';
    q.opts.forEach((opt, i) => {
        const btn = document.createElement('div');
        btn.className = 'quiz-option';
        btn.textContent = opt;
        btn.onclick = () => answerQuiz(i);
        opts.appendChild(btn);
    });
}

function answerQuiz(index){
    if(quizAnswered) return;
    quizAnswered = true;

    const q = QUIZ_QUESTIONS[quizCurrentQuestion];
    const opts = document.querySelectorAll('.quiz-option');

    if(index === q.correct){
        quizScore++;
        opts[index].classList.add('correct');
    } else {
        opts[index].classList.add('wrong');
        opts[q.correct].classList.add('correct');
    }

    document.getElementById('quiz-score').textContent = `Очки: ${quizScore}`;

    setTimeout(() => {
        quizCurrentQuestion++;
        showQuizQuestion();
    }, 1500);
}

// ============ КАЛЕНДАРЬ ДР ============
function renderBirthdayCalendar(){
    const container = document.getElementById('birthday-calendar');
    if(!container) return;

    const months = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];

    // Собираем пользователей с ДР
    const usersWithBD = Object.values(allUsers)
        .filter(u => u.birthday && !u.banned)
        .map(u => {
            const [day, month] = u.birthday.split('.').map(n => parseInt(n));
            return {...u, bdDay: day, bdMonth: month};
        })
        .sort((a, b) => a.bdMonth - b.bdMonth || a.bdDay - b.bdDay);

    if(usersWithBD.length === 0){
        container.innerHTML = '<p style="color:#555;text-align:center;padding:40px;">Никто ещё не указал день рождения 😢</p>';
        return;
    }

    // Группируем по месяцам
    const byMonth = {};
    usersWithBD.forEach(u => {
        if(!byMonth[u.bdMonth]) byMonth[u.bdMonth] = [];
        byMonth[u.bdMonth].push(u);
    });

    const today = new Date();
    const todayDay = today.getDate();
    const todayMonth = today.getMonth() + 1;

    container.innerHTML = '';
    Object.entries(byMonth).forEach(([month, users]) => {
        const monthDiv = document.createElement('div');
        monthDiv.className = 'birthday-month';

        const monthTitle = document.createElement('div');
        monthTitle.className = 'birthday-month-title';
        monthTitle.textContent = months[parseInt(month) - 1] || 'Месяц';
        monthDiv.appendChild(monthTitle);

        users.forEach(u => {
            const isToday = u.bdDay === todayDay && u.bdMonth === todayMonth;
            const av = u.avatarImg
                ? `<img src="${u.avatarImg}" style="width:35px;height:35px;border-radius:50%;object-fit:cover;">`
                : (u.avatar || '👤');

            const item = document.createElement('div');
            item.className = 'birthday-user-item' + (isToday ? ' today' : '');
            item.innerHTML = `
                <div class="birthday-date">${String(u.bdDay).padStart(2,'0')}.${String(u.bdMonth).padStart(2,'0')}</div>
                <div style="font-size:1.5rem;">${av}</div>
                <div style="flex:1;">
                    <div style="font-weight:700;">${u.name} ${isToday ? '🎂🎉' : ''}</div>
                    <div style="color:#888;font-size:0.8rem;">${u.email}</div>
                </div>
            `;
            item.onclick = () => openUserProfile(u.email);
            monthDiv.appendChild(item);
        });

        container.appendChild(monthDiv);
    });
}

// ============ ИНТЕГРАЦИЯ ============

// Обновляем showPage
if(typeof showPage === 'function'){
    const origSP = showPage;
    showPage = function(pageId){
        origSP(pageId);
        if(pageId === 'games') {}
        if(pageId === 'birthdays') renderBirthdayCalendar();
        if(pageId === 'home') renderStoriesBar();
        if(pageId === 'profile') renderFrames();
    };
}

// Обновляем loginSuccess
if(typeof loginSuccess === 'function'){
    const origLS = loginSuccess;
    loginSuccess = function(){
        origLS();
        renderStoriesBar();
        renderFrames();
    };
}

// Stories модерация — добавляем в админку
if(typeof renderModerationList === 'function'){
    const origRenderMod = renderModerationList;
    renderModerationList = function(){
        origRenderMod();

        // Добавляем сториз на модерацию
        const list = document.getElementById('moderation-list');
        if(!list) return;

        Object.entries(allStories).forEach(([id, story]) => {
            if(story.status !== 'pending') return;

            const div = document.createElement('div');
            div.className = 'moderation-item';

            let contentHTML = '';
            if(story.type === 'photo' && story.photo){
                contentHTML = `<img src="${story.photo}" class="moderation-photo">`;
            }
            if(story.text){
                contentHTML += `<div style="color:#ccc;margin:10px 0;padding:10px;background:#0a0a0a;border-radius:8px;">${story.text.replace(/</g,'&lt;')}</div>`;
            }

            div.innerHTML = `
                <div class="moderation-info">
                    <div>
                        <div class="moderation-user">📸 СТОРИЗ от: ${story.authorName} (${story.authorEmail})</div>
                    </div>
                    <div class="moderation-date">${story.date}</div>
                </div>
                ${contentHTML}
                <div class="moderation-actions">
                    <button class="action-btn green" onclick="approveStory('${id}')">✅ ОДОБРИТЬ</button>
                    <button class="action-btn red" onclick="rejectStory('${id}')">❌ ОТКЛОНИТЬ</button>
                </div>
            `;
            list.appendChild(div);
        });
    };
}

async function approveStory(id){
    await fbUpdatePath(`stories/${id}`, {status: 'approved'});
    alert('✅ Сториз одобрена!');
}

async function rejectStory(id){
    if(!confirm('Отклонить сториз?')) return;
    await fbRemovePath(`stories/${id}`);
    alert('❌ Отклонена!');
}
// ============ ФИКС STORIES + ПЕРЕСЫЛКА + МУЛЬТИПЛЕЕР ============

// Фикс: показываем Stories бар всегда (даже пустой с кнопкой "+")
if(typeof renderStoriesBar === 'function'){
    const origRenderStories = renderStoriesBar;
    renderStoriesBar = function(){
        const bar = document.getElementById('stories-bar');
        if(!bar || !currentUser) return;

        const now = Date.now();
        const dayMs = 24 * 60 * 60 * 1000;
        const activeStories = {};

        Object.entries(allStories).forEach(([id, story]) => {
            if(story.status !== 'approved') return;
            if(now - story.timestamp > dayMs) return;
            const key = emailToKey(story.authorEmail);
            if(!activeStories[key]) activeStories[key] = [];
            activeStories[key].push({...story, id});
        });

        bar.innerHTML = '';
        bar.style.display = 'flex';

        // Кнопка добавить
        const addCircle = document.createElement('div');
        addCircle.className = 'story-circle';
        addCircle.innerHTML = `
            <div class="story-avatar add-story">➕</div>
            <div class="story-name">Добавить</div>
        `;
        addCircle.onclick = () => openStoryCreate();
        bar.appendChild(addCircle);

        // Кружочки
        Object.entries(activeStories).forEach(([userKey, stories]) => {
            const user = allUsers[userKey];
            if(!user) return;
            const myKey = emailToKey(currentUser.email);
            const viewed = stories.every(s => s.viewedBy && s.viewedBy[myKey]);
            const av = user.avatarImg ? `<img src="${user.avatarImg}">` : (user.avatar || '👤');
            const circle = document.createElement('div');
            circle.className = 'story-circle';
            circle.innerHTML = `
                <div class="story-avatar ${viewed ? 'viewed' : ''}">${av}</div>
                <div class="story-name">${user.name}</div>
            `;
            circle.onclick = () => openStoryViewer(userKey, stories);
            bar.appendChild(circle);
        });
    };
}

// Вызываем при загрузке главной
setTimeout(() => {
    if(currentUser && typeof renderStoriesBar === 'function'){
        renderStoriesBar();
    }
}, 2000);

// ============ ПЕРЕСЫЛКА СООБЩЕНИЙ ============
async function forwardMessage(msgId, chatId){
    if(!currentUser) return;

    const messages = allMessages[chatId] || {};
    const msg = messages[msgId];
    if(!msg) return;

    // Показываем список чатов для пересылки
    const myKey = emailToKey(currentUser.email);
    const chats = [];

    // Личные чаты
    Object.entries(allMessages).forEach(([cId, msgs]) => {
        if(cId.startsWith('group_')) return;
        if(!cId.includes(myKey)) return;
        if(cId === chatId) return;
        const otherKey = cId.replace(myKey, '').replace('__', '');
        const otherUser = allUsers[otherKey];
        if(otherUser) chats.push({id: cId, name: otherUser.name, type: 'private', target: otherUser.email});
    });

    // Группы
    if(allGroups){
        Object.entries(allGroups).forEach(([gId, group]) => {
            if(!group.members || !group.members[myKey]) return;
            const gChatId = 'group_' + gId;
            if(gChatId === chatId) return;
            chats.push({id: gChatId, name: '👥 ' + group.name, type: 'group', target: gId});
        });
    }

    if(chats.length === 0){
        alert('Нет чатов для пересылки!');
        return;
    }

    // Список
    let chatList = 'Куда переслать?\n\n';
    chats.forEach((c, i) => {
        chatList += `${i + 1}. ${c.name}\n`;
    });
    chatList += '\nВведи номер:';

    const choice = prompt(chatList);
    if(!choice) return;
    const idx = parseInt(choice) - 1;
    if(idx < 0 || idx >= chats.length){alert('Неверный номер!');return;}

    const targetChat = chats[idx];

    // Создаём пересланное сообщение
    let forwardedMsg;
    const forwardText = msg.text || (msg.type === 'photo' ? '📷 Фото' : msg.type === 'voice' ? '🎤 Голосовое' : msg.type === 'sticker' ? msg.sticker : msg.type === 'poll' ? '📊 Опрос' : 'Сообщение');
    const senderName = msg.authorName || (allUsers[emailToKey(msg.from)] ? allUsers[emailToKey(msg.from)].name : 'Кто-то');

    if(targetChat.type === 'group'){
        forwardedMsg = {
            from: currentUser.email,
            authorName: currentUser.name,
            text: `↩️ Переслано от ${senderName}:\n${forwardText}`,
            type: 'text',
            date: new Date().toLocaleString('ru-RU'),
            timestamp: Date.now(),
            readBy: {[myKey]: true},
            reactions: {},
            forwarded: true,
            originalFrom: senderName
        };
    } else {
        forwardedMsg = {
            from: currentUser.email,
            to: targetChat.target,
            text: `↩️ Переслано от ${senderName}:\n${forwardText}`,
            type: 'text',
            date: new Date().toLocaleString('ru-RU'),
            timestamp: Date.now(),
            read: false,
            reactions: {},
            forwarded: true,
            originalFrom: senderName
        };

        // Если фото — пересылаем фото тоже
        if(msg.type === 'photo' && msg.photo){
            forwardedMsg.type = 'photo';
            forwardedMsg.photo = msg.photo;
            forwardedMsg.text = `↩️ Фото от ${senderName}`;
        }
    }

    const newRef = window.fbPush(window.fbRef(window.fbDb, `messages/${targetChat.id}`));
    await window.fbSet(newRef, forwardedMsg);

    alert(`✅ Переслано в "${targetChat.name}"!`);
}

// Добавляем кнопку "Переслать" в реакции
// Обновляем reaction picker чтобы добавить кнопку пересылки
if(typeof renderChat === 'function'){
    const origRC = renderChat;
    renderChat = function(){
        origRC();

        // Добавляем кнопку "Переслать" к каждому сообщению
        const area = document.getElementById('chat-messages-area');
        if(!area || !currentChatId) return;

        area.querySelectorAll('.reaction-picker').forEach(picker => {
            const msgId = picker.id.replace('picker-', '');
            // Проверяем нет ли уже кнопки
            if(picker.querySelector('.forward-btn')) return;

            const fwdBtn = document.createElement('button');
            fwdBtn.className = 'reaction-emoji-btn forward-btn';
            fwdBtn.textContent = '➡️';
            fwdBtn.title = 'Переслать';
            fwdBtn.onclick = (e) => {
                e.stopPropagation();
                picker.classList.remove('show');
                forwardMessage(msgId, currentChatId);
            };
            picker.appendChild(fwdBtn);
        });
    };
}

// ============ МУЛЬТИПЛЕЕР КРЕСТИКИ-НОЛИКИ ============
let multiplayerGameId = null;
let multiplayerRole = null; // 'X' или 'O'

async function inviteToGame(targetEmail){
    if(!currentUser){alert('Войди!');return;}
    if(targetEmail === currentUser.email){alert('Нельзя играть с собой!');return;}

    const target = allUsers[emailToKey(targetEmail)];
    if(!target){alert('Пользователь не найден!');return;}

    // Создаём игру в Firebase
    const gameId = Date.now().toString();
    const game = {
        playerX: currentUser.email,
        playerXName: currentUser.name,
        playerO: targetEmail,
        playerOName: target.name,
        board: ['','','','','','','','',''],
        currentTurn: 'X',
        status: 'waiting', // waiting, playing, finished
        winner: null,
        createdAt: Date.now()
    };

    await fbWrite(`games/${gameId}`, game);

    // Отправляем приглашение в чат
    const chatId = getChatId(currentUser.email, targetEmail);
    const msg = {
        from: currentUser.email,
        to: targetEmail,
        text: '',
        type: 'game_invite',
        gameId: gameId,
        gameName: 'Крестики-нолики',
        date: new Date().toLocaleString('ru-RU'),
        timestamp: Date.now(),
        read: false,
        reactions: {}
    };

    const newRef = window.fbPush(window.fbRef(window.fbDb, `messages/${chatId}`));
    await window.fbSet(newRef, msg);

    // Открываем игру
    openMultiplayerGame(gameId, 'X');

    alert(`✅ Приглашение отправлено ${target.name}!`);
}

function openMultiplayerGame(gameId, role){
    multiplayerGameId = gameId;
    multiplayerRole = role;

    document.getElementById('ttt-modal').classList.add('show');
    document.getElementById('ttt-status').textContent = 'Ожидание противника...';

    // Слушаем изменения игры
    fbListen(`games/${gameId}`, (data) => {
        if(!data) return;
        renderMultiplayerBoard(data);
    });
}

function renderMultiplayerBoard(game){
    if(!game) return;

    const board = document.getElementById('ttt-board');
    if(!board) return;

    tttBoard = game.board || ['','','','','','','','',''];
    tttGameOver = game.status === 'finished';

    const isMyTurn = (game.currentTurn === 'X' && game.playerX === currentUser.email) ||
                     (game.currentTurn === 'O' && game.playerO === currentUser.email);

    const opponentName = game.playerX === currentUser.email ? game.playerOName : game.playerXName;

    if(game.status === 'waiting'){
        document.getElementById('ttt-status').textContent = `Ожидание ${opponentName}...`;
    } else if(game.status === 'finished'){
        if(game.winner === 'draw'){
            document.getElementById('ttt-status').textContent = '🤝 НИЧЬЯ!';
        } else if((game.winner === 'X' && game.playerX === currentUser.email) ||
                  (game.winner === 'O' && game.playerO === currentUser.email)){
            document.getElementById('ttt-status').textContent = '🎉 ТЫ ПОБЕДИЛ!';
        } else {
            document.getElementById('ttt-status').textContent = `😢 ${opponentName} победил!`;
        }
    } else if(isMyTurn){
        document.getElementById('ttt-status').textContent = `Твой ход! (${multiplayerRole === 'X' ? '❌' : '⭕'})`;
    } else {
        document.getElementById('ttt-status').textContent = `Ход ${opponentName}...`;
    }

    board.innerHTML = '';
    tttBoard.forEach((cell, i) => {
        const div = document.createElement('div');
        div.className = 'ttt-cell' + (cell === 'X' ? ' x' : cell === 'O' ? ' o' : '');
        div.textContent = cell === 'X' ? '❌' : cell === 'O' ? '⭕' : '';
        if(!cell && !tttGameOver && isMyTurn && game.status === 'playing'){
            div.onclick = () => multiplayerMove(i);
        }
        board.appendChild(div);
    });

    if(tttGameOver && game.winner && game.winner !== 'draw'){
        highlightWinningCells(game.winner);
    }
}

async function multiplayerMove(index){
    if(!multiplayerGameId || !multiplayerRole) return;

    const game = await fbReadOnce(`games/${multiplayerGameId}`);
    if(!game || game.status !== 'playing') return;
    if(game.currentTurn !== multiplayerRole) return;
    if(game.board[index]) return;

    game.board[index] = multiplayerRole;

    // Проверяем победу
    if(checkTTTWinnerFromBoard(game.board, multiplayerRole)){
        game.status = 'finished';
        game.winner = multiplayerRole;
    } else if(game.board.every(c => c)){
        game.status = 'finished';
        game.winner = 'draw';
    } else {
        game.currentTurn = multiplayerRole === 'X' ? 'O' : 'X';
    }

    await fbWrite(`games/${multiplayerGameId}`, game);
}

function checkTTTWinnerFromBoard(board, player){
    return TTT_WINS.some(combo => combo.every(i => board[i] === player));
}

async function acceptGameInvite(gameId){
    if(!currentUser) return;

    const game = await fbReadOnce(`games/${gameId}`);
    if(!game){alert('Игра не найдена!');return;}
    if(game.playerO !== currentUser.email){alert('Это не твоё приглашение!');return;}

    await fbUpdatePath(`games/${gameId}`, {status: 'playing'});

    const role = game.playerO === currentUser.email ? 'O' : 'X';
    openMultiplayerGame(gameId, role);
}

// Добавляем отображение приглашений в чат
// Обновляем renderChat для game_invite
if(typeof renderChat === 'function'){
    const origRC2 = renderChat;
    renderChat = function(){
        origRC2();

        // Находим приглашения в играх и добавляем кнопки
        const area = document.getElementById('chat-messages-area');
        if(!area) return;

        // Ищем сообщения типа game_invite которые не обработаны
        const messages = allMessages[currentChatId] || {};
        Object.entries(messages).forEach(([msgId, m]) => {
            if(m.type !== 'game_invite') return;
            const msgEl = document.getElementById('msg-' + msgId);
            if(!msgEl) return;
            if(msgEl.querySelector('.game-invite-btn')) return;

            // Заменяем контент
            const textDiv = msgEl.querySelector('.msg-text');
            if(textDiv){
                const isForMe = m.to === currentUser.email;
                const senderName = allUsers[emailToKey(m.from)] ? allUsers[emailToKey(m.from)].name : 'Кто-то';

                textDiv.innerHTML = `
                    <div style="background:rgba(0,0,0,0.3);padding:12px;border-radius:10px;border-left:4px solid var(--gold);text-align:center;">
                        <div style="font-size:2rem;">🎮</div>
                        <div style="font-weight:700;margin:5px 0;">${m.gameName || 'Крестики-нолики'}</div>
                        <div style="color:#888;font-size:0.85rem;">${isForMe ? `${senderName} приглашает тебя играть!` : 'Приглашение отправлено'}</div>
                        ${isForMe ? `<button class="game-invite-btn btn" style="margin-top:10px;" onclick="acceptGameInvite('${m.gameId}')">🎮 ПРИНЯТЬ</button>` : ''}
                    </div>
                `;
            }
        });
    };
}

// Кнопка "Пригласить в игру" в чате
function addGameInviteButton(){
    setInterval(() => {
        const inputArea = document.querySelector('.chat-input-area');
        if(!inputArea) return;
        if(inputArea.querySelector('.game-invite-chat-btn')) return;
        if(!currentChatId || currentChatType !== 'private') return;
        if(!currentChatUser) return;

        const btn = document.createElement('button');
        btn.className = 'chat-poll-btn game-invite-chat-btn';
        btn.innerHTML = '🎮';
        btn.title = 'Пригласить в игру';
        btn.onclick = () => inviteToGame(currentChatUser.email);

        const sendBtn = inputArea.querySelector('.chat-send');
        if(sendBtn){
            inputArea.insertBefore(btn, sendBtn);
        }
    }, 1000);
}
addGameInviteButton();
// ============================================
//  ЗВУКИ САЙТА
// ============================================

const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function initAudio(){
    if(!audioCtx){
        try { audioCtx = new AudioCtx(); } catch(e) { console.log('Audio не поддерживается'); }
    }
}

// Инициализируем при первом клике
document.addEventListener('click', () => initAudio(), {once: true});

function playSound(type){
    if(!audioCtx) return;
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        if(type === 'click'){
            osc.type = 'sine';
            osc.frequency.value = 800;
            gain.gain.value = 0.1;
            osc.start();
            osc.stop(audioCtx.currentTime + 0.05);
        } else if(type === 'message'){
            osc.type = 'sine';
            osc.frequency.value = 600;
            gain.gain.value = 0.15;
            osc.start();
            osc.frequency.linearRampToValueAtTime(900, audioCtx.currentTime + 0.1);
            osc.stop(audioCtx.currentTime + 0.15);
        } else if(type === 'notification'){
            osc.type = 'sine';
            osc.frequency.value = 500;
            gain.gain.value = 0.15;
            osc.start();
            setTimeout(() => {
                const osc2 = audioCtx.createOscillator();
                const gain2 = audioCtx.createGain();
                osc2.connect(gain2);
                gain2.connect(audioCtx.destination);
                osc2.type = 'sine';
                osc2.frequency.value = 700;
                gain2.gain.value = 0.15;
                osc2.start();
                osc2.stop(audioCtx.currentTime + 0.1);
            }, 150);
            osc.stop(audioCtx.currentTime + 0.1);
        } else if(type === 'like'){
            osc.type = 'sine';
            osc.frequency.value = 400;
            gain.gain.value = 0.1;
            osc.start();
            osc.frequency.linearRampToValueAtTime(800, audioCtx.currentTime + 0.15);
            osc.stop(audioCtx.currentTime + 0.2);
        } else if(type === 'win'){
            osc.type = 'square';
            osc.frequency.value = 523;
            gain.gain.value = 0.12;
            osc.start();
            osc.frequency.setValueAtTime(659, audioCtx.currentTime + 0.15);
            osc.frequency.setValueAtTime(784, audioCtx.currentTime + 0.3);
            osc.frequency.setValueAtTime(1047, audioCtx.currentTime + 0.45);
            gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.7);
            osc.stop(audioCtx.currentTime + 0.7);
        } else if(type === 'lose'){
            osc.type = 'sawtooth';
            osc.frequency.value = 400;
            gain.gain.value = 0.1;
            osc.start();
            osc.frequency.linearRampToValueAtTime(150, audioCtx.currentTime + 0.5);
            gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
            osc.stop(audioCtx.currentTime + 0.5);
        } else if(type === 'move'){
            osc.type = 'sine';
            osc.frequency.value = 500;
            gain.gain.value = 0.08;
            osc.start();
            osc.stop(audioCtx.currentTime + 0.03);
        } else if(type === 'error'){
            osc.type = 'square';
            osc.frequency.value = 200;
            gain.gain.value = 0.1;
            osc.start();
            osc.stop(audioCtx.currentTime + 0.15);
        } else if(type === 'gift'){
            osc.type = 'sine';
            osc.frequency.value = 523;
            gain.gain.value = 0.12;
            osc.start();
            osc.frequency.setValueAtTime(784, audioCtx.currentTime + 0.1);
            osc.frequency.setValueAtTime(1047, audioCtx.currentTime + 0.2);
            osc.frequency.setValueAtTime(1319, audioCtx.currentTime + 0.3);
            gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
            osc.stop(audioCtx.currentTime + 0.5);
        } else if(type === 'tetris_clear'){
            osc.type = 'square';
            osc.frequency.value = 800;
            gain.gain.value = 0.1;
            osc.start();
            osc.frequency.setValueAtTime(1000, audioCtx.currentTime + 0.05);
            osc.frequency.setValueAtTime(1200, audioCtx.currentTime + 0.1);
            osc.stop(audioCtx.currentTime + 0.15);
        } else if(type === 'explosion'){
            const noise = audioCtx.createBufferSource();
            const buf = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.3, audioCtx.sampleRate);
            const data = buf.getChannelData(0);
            for(let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioCtx.sampleRate * 0.1));
            noise.buffer = buf;
            const noiseGain = audioCtx.createGain();
            noiseGain.gain.value = 0.15;
            noise.connect(noiseGain);
            noiseGain.connect(audioCtx.destination);
            noise.start();
            return;
        }
    } catch(e) {}
}

// Добавляем звук клика ко всем кнопкам
document.addEventListener('click', (e) => {
    const target = e.target;
    if(target.matches('button, .btn, .nav-tab, .action-btn, .login-btn, .folder, .ep-card, .friend-btn, .wall-create-btn, .gift-btn, .comment-submit, .promo-btn, .topup-btn, .buy-sub-btn, .speed-btn, .emoji-btn, .sticker-btn, .chat-send, .story-circle')){
        playSound('click');
    }
});

// ============================================
//  НОВЫЕ ИГРЫ: САПЁР + ТЕТРИС + БЛОК БЛАСТ + МОРСКОЙ БОЙ
// ============================================

// ============ САПЁР ============
let mineBoard = [];
let mineRevealed = [];
let mineFlags = [];
let mineMines = 10;
let mineRows = 8;
let mineCols = 8;
let mineGameOver = false;
let mineFirstClick = true;

function openMinesweeper(){
    resetMinesweeper();
    document.getElementById('mines-modal').classList.add('show');
}

function closeMinesweeper(){
    document.getElementById('mines-modal').classList.remove('show');
}

function resetMinesweeper(){
    mineRows = 8; mineCols = 8; mineMines = 10;
    mineBoard = [];
    mineRevealed = [];
    mineFlags = [];
    mineGameOver = false;
    mineFirstClick = true;

    for(let r = 0; r < mineRows; r++){
        mineBoard[r] = [];
        mineRevealed[r] = [];
        mineFlags[r] = [];
        for(let c = 0; c < mineCols; c++){
            mineBoard[r][c] = 0;
            mineRevealed[r][c] = false;
            mineFlags[r][c] = false;
        }
    }

    document.getElementById('mines-status').textContent = `💣 Мин: ${mineMines} | 🚩 Флаги: 0`;
    renderMinesBoard();
}

function placeMines(safeR, safeC){
    let placed = 0;
    while(placed < mineMines){
        const r = Math.floor(Math.random() * mineRows);
        const c = Math.floor(Math.random() * mineCols);
        if(mineBoard[r][c] === -1) continue;
        if(Math.abs(r - safeR) <= 1 && Math.abs(c - safeC) <= 1) continue;
        mineBoard[r][c] = -1;
        placed++;
    }
    // Считаем числа
    for(let r = 0; r < mineRows; r++){
        for(let c = 0; c < mineCols; c++){
            if(mineBoard[r][c] === -1) continue;
            let count = 0;
            for(let dr = -1; dr <= 1; dr++){
                for(let dc = -1; dc <= 1; dc++){
                    const nr = r+dr, nc = c+dc;
                    if(nr >= 0 && nr < mineRows && nc >= 0 && nc < mineCols && mineBoard[nr][nc] === -1) count++;
                }
            }
            mineBoard[r][c] = count;
        }
    }
}

function mineClick(r, c){
    if(mineGameOver || mineFlags[r][c]) return;

    if(mineFirstClick){
        placeMines(r, c);
        mineFirstClick = false;
    }

    if(mineBoard[r][c] === -1){
        // БУМ!
        playSound('explosion');
        mineGameOver = true;
        // Показываем все мины
        for(let rr = 0; rr < mineRows; rr++){
            for(let cc = 0; cc < mineCols; cc++){
                if(mineBoard[rr][cc] === -1) mineRevealed[rr][cc] = true;
            }
        }
        document.getElementById('mines-status').textContent = '💥 БАБАХ! Ты проиграл!';
        playSound('lose');
        renderMinesBoard();
        return;
    }

    revealCell(r, c);
    playSound('move');

    // Проверяем победу
    let unrevealed = 0;
    for(let rr = 0; rr < mineRows; rr++){
        for(let cc = 0; cc < mineCols; cc++){
            if(!mineRevealed[rr][cc] && mineBoard[rr][cc] !== -1) unrevealed++;
        }
    }
    if(unrevealed === 0){
        mineGameOver = true;
        document.getElementById('mines-status').textContent = '🎉 ТЫ ПОБЕДИЛ!';
        playSound('win');
    }

    renderMinesBoard();
}

function revealCell(r, c){
    if(r < 0 || r >= mineRows || c < 0 || c >= mineCols) return;
    if(mineRevealed[r][c] || mineFlags[r][c]) return;
    mineRevealed[r][c] = true;
    if(mineBoard[r][c] === 0){
        for(let dr = -1; dr <= 1; dr++){
            for(let dc = -1; dc <= 1; dc++){
                revealCell(r+dr, c+dc);
            }
        }
    }
}

function mineRightClick(r, c, e){
    e.preventDefault();
    if(mineGameOver || mineRevealed[r][c]) return;
    mineFlags[r][c] = !mineFlags[r][c];
    playSound('click');
    const flagCount = mineFlags.flat().filter(f=>f).length;
    document.getElementById('mines-status').textContent = `💣 Мин: ${mineMines} | 🚩 Флаги: ${flagCount}`;
    renderMinesBoard();
}

function renderMinesBoard(){
    const board = document.getElementById('mines-board');
    if(!board) return;
    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${mineCols}, 1fr)`;

    const colors = ['','#2196F3','#4CAF50','#F44336','#9C27B0','#FF9800','#00BCD4','#000','#888'];

    for(let r = 0; r < mineRows; r++){
        for(let c = 0; c < mineCols; c++){
            const div = document.createElement('div');
            div.className = 'mine-cell';

            if(mineRevealed[r][c]){
                div.classList.add('revealed');
                if(mineBoard[r][c] === -1){
                    div.textContent = '💣';
                    div.classList.add('mine');
                } else if(mineBoard[r][c] > 0){
                    div.textContent = mineBoard[r][c];
                    div.style.color = colors[mineBoard[r][c]];
                }
            } else if(mineFlags[r][c]){
                div.textContent = '🚩';
            }

            if(!mineRevealed[r][c] && !mineGameOver){
                div.onclick = () => mineClick(r, c);
                div.oncontextmenu = (e) => mineRightClick(r, c, e);
            }

            board.appendChild(div);
        }
    }
}

// ============ ТЕТРИС ============
let tetrisBoard = [];
let tetrisRows = 20;
let tetrisCols = 10;
let tetrisPiece = null;
let tetrisX = 0;
let tetrisY = 0;
let tetrisScore = 0;
let tetrisInterval = null;
let tetrisGameOver = false;

const TETRIS_PIECES = [
    [[1,1,1,1]], // I
    [[1,1],[1,1]], // O
    [[0,1,0],[1,1,1]], // T
    [[1,0,0],[1,1,1]], // L
    [[0,0,1],[1,1,1]], // J
    [[0,1,1],[1,1,0]], // S
    [[1,1,0],[0,1,1]]  // Z
];

const TETRIS_COLORS = ['#00BCD4','#FFD700','#9C27B0','#FF9800','#2196F3','#4CAF50','#F44336'];

function openTetris(){
    resetTetris();
    document.getElementById('tetris-modal').classList.add('show');
}

function closeTetris(){
    clearInterval(tetrisInterval);
    document.getElementById('tetris-modal').classList.remove('show');
}

function resetTetris(){
    clearInterval(tetrisInterval);
    tetrisBoard = [];
    for(let r = 0; r < tetrisRows; r++){
        tetrisBoard[r] = new Array(tetrisCols).fill(0);
    }
    tetrisScore = 0;
    tetrisGameOver = false;
    spawnTetrisPiece();
    renderTetris();
    tetrisInterval = setInterval(tetrisTick, 500);
    document.getElementById('tetris-score').textContent = `Очки: ${tetrisScore}`;
}

function spawnTetrisPiece(){
    const idx = Math.floor(Math.random() * TETRIS_PIECES.length);
    tetrisPiece = {shape: TETRIS_PIECES[idx], color: idx + 1};
    tetrisX = Math.floor((tetrisCols - tetrisPiece.shape[0].length) / 2);
    tetrisY = 0;

    if(!canPlace(tetrisX, tetrisY, tetrisPiece.shape)){
        tetrisGameOver = true;
        clearInterval(tetrisInterval);
        document.getElementById('tetris-score').textContent = `ИГРА ОКОНЧЕНА! Очки: ${tetrisScore}`;
        playSound('lose');
    }
}

function canPlace(x, y, shape){
    for(let r = 0; r < shape.length; r++){
        for(let c = 0; c < shape[r].length; c++){
            if(!shape[r][c]) continue;
            const nr = y + r, nc = x + c;
            if(nr < 0 || nr >= tetrisRows || nc < 0 || nc >= tetrisCols) return false;
            if(tetrisBoard[nr][nc]) return false;
        }
    }
    return true;
}

function placePiece(){
    for(let r = 0; r < tetrisPiece.shape.length; r++){
        for(let c = 0; c < tetrisPiece.shape[r].length; c++){
            if(!tetrisPiece.shape[r][c]) continue;
            tetrisBoard[tetrisY + r][tetrisX + c] = tetrisPiece.color;
        }
    }
    // Очистка линий
    let cleared = 0;
    for(let r = tetrisRows - 1; r >= 0; r--){
        if(tetrisBoard[r].every(c => c)){
            tetrisBoard.splice(r, 1);
            tetrisBoard.unshift(new Array(tetrisCols).fill(0));
            cleared++;
            r++;
        }
    }
    if(cleared > 0){
        tetrisScore += cleared * 100;
        playSound('tetris_clear');
    }
    document.getElementById('tetris-score').textContent = `Очки: ${tetrisScore}`;
    spawnTetrisPiece();
}

function tetrisTick(){
    if(tetrisGameOver) return;
    if(canPlace(tetrisX, tetrisY + 1, tetrisPiece.shape)){
        tetrisY++;
    } else {
        placePiece();
    }
    renderTetris();
}

function tetrisMove(dir){
    if(tetrisGameOver) return;
    if(dir === 'left' && canPlace(tetrisX - 1, tetrisY, tetrisPiece.shape)){ tetrisX--; playSound('move'); }
    if(dir === 'right' && canPlace(tetrisX + 1, tetrisY, tetrisPiece.shape)){ tetrisX++; playSound('move'); }
    if(dir === 'down'){
        while(canPlace(tetrisX, tetrisY + 1, tetrisPiece.shape)) tetrisY++;
        placePiece();
        playSound('move');
    }
    if(dir === 'rotate'){
        const rotated = tetrisPiece.shape[0].map((_, i) => tetrisPiece.shape.map(row => row[i]).reverse());
        if(canPlace(tetrisX, tetrisY, rotated)){ tetrisPiece.shape = rotated; playSound('move'); }
    }
    renderTetris();
}

function renderTetris(){
    const board = document.getElementById('tetris-board');
    if(!board) return;

    // Копируем доску
    const display = tetrisBoard.map(r => [...r]);

    // Рисуем текущую фигуру
    if(tetrisPiece && !tetrisGameOver){
        for(let r = 0; r < tetrisPiece.shape.length; r++){
            for(let c = 0; c < tetrisPiece.shape[r].length; c++){
                if(!tetrisPiece.shape[r][c]) continue;
                const nr = tetrisY + r, nc = tetrisX + c;
                if(nr >= 0 && nr < tetrisRows && nc >= 0 && nc < tetrisCols){
                    display[nr][nc] = tetrisPiece.color;
                }
            }
        }
    }

    board.innerHTML = '';
    for(let r = 0; r < tetrisRows; r++){
        for(let c = 0; c < tetrisCols; c++){
            const div = document.createElement('div');
            div.className = 'tetris-cell';
            if(display[r][c]){
                div.style.background = TETRIS_COLORS[display[r][c] - 1];
                div.classList.add('filled');
            }
            board.appendChild(div);
        }
    }
}

// Управление с клавиатуры
document.addEventListener('keydown', (e) => {
    if(!document.getElementById('tetris-modal').classList.contains('show')) return;
    if(e.key === 'ArrowLeft') tetrisMove('left');
    if(e.key === 'ArrowRight') tetrisMove('right');
    if(e.key === 'ArrowDown') tetrisMove('down');
    if(e.key === 'ArrowUp') tetrisMove('rotate');
});
// ============ ЗМЕЙКА ============
let snakeBody=[], snakeFood={}, snakeDirection='right', snakeInterval=null, snakeScore=0, snakeSize=15, snakeGameOver=false;

function openSnake(){resetSnake();document.getElementById('snake-modal').classList.add('show');}
function closeSnake(){clearInterval(snakeInterval);document.getElementById('snake-modal').classList.remove('show');}

function resetSnake(){
    clearInterval(snakeInterval);
    snakeBody=[{x:7,y:7},{x:6,y:7},{x:5,y:7}];
    snakeDirection='right';snakeScore=0;snakeGameOver=false;
    placeSnakeFood();
    document.getElementById('snake-score').textContent='Очки: 0';
    renderSnake();
    snakeInterval=setInterval(snakeTick,200);
}

function placeSnakeFood(){
    do{snakeFood={x:Math.floor(Math.random()*snakeSize),y:Math.floor(Math.random()*snakeSize)};}
    while(snakeBody.some(s=>s.x===snakeFood.x&&s.y===snakeFood.y));
}

function snakeDir(d){
    if(d==='left'&&snakeDirection!=='right')snakeDirection='left';
    if(d==='right'&&snakeDirection!=='left')snakeDirection='right';
    if(d==='up'&&snakeDirection!=='down')snakeDirection='up';
    if(d==='down'&&snakeDirection!=='up')snakeDirection='down';
}

function snakeTick(){
    if(snakeGameOver)return;
    const head={...snakeBody[0]};
    if(snakeDirection==='left')head.x--;if(snakeDirection==='right')head.x++;
    if(snakeDirection==='up')head.y--;if(snakeDirection==='down')head.y++;
    if(head.x<0||head.x>=snakeSize||head.y<0||head.y>=snakeSize||snakeBody.some(s=>s.x===head.x&&s.y===head.y)){
        snakeGameOver=true;clearInterval(snakeInterval);playSound('lose');
        document.getElementById('snake-score').textContent=`💀 Конец! Очки: ${snakeScore}`;return;
    }
    snakeBody.unshift(head);
    if(head.x===snakeFood.x&&head.y===snakeFood.y){snakeScore+=10;playSound('tetris_clear');placeSnakeFood();document.getElementById('snake-score').textContent=`Очки: ${snakeScore}`;}
    else{snakeBody.pop();}
    renderSnake();
}

function renderSnake(){
    const board=document.getElementById('snake-board');if(!board)return;
    board.style.gridTemplateColumns=`repeat(${snakeSize},1fr)`;board.innerHTML='';
    for(let y=0;y<snakeSize;y++){for(let x=0;x<snakeSize;x++){
        const div=document.createElement('div');div.className='snake-cell';
        if(snakeBody[0]&&snakeBody[0].x===x&&snakeBody[0].y===y)div.classList.add('head');
        else if(snakeBody.some(s=>s.x===x&&s.y===y))div.classList.add('snake');
        if(snakeFood.x===x&&snakeFood.y===y)div.classList.add('food');
        board.appendChild(div);
    }}
}

document.addEventListener('keydown',e=>{if(!document.getElementById('snake-modal').classList.contains('show'))return;
    if(e.key==='ArrowLeft')snakeDir('left');if(e.key==='ArrowRight')snakeDir('right');
    if(e.key==='ArrowUp'){e.preventDefault();snakeDir('up');}if(e.key==='ArrowDown'){e.preventDefault();snakeDir('down');}
});

// ============ МЕМОРИ ============
let memoryCards=[],memoryFlipped=[],memoryMatched=0,memoryLocked=false,memoryMoves=0;
const MEMORY_EMOJIS=['🎮','🎬','💎','🔥','⚡','🌟','👑','🎁'];

function openMemory(){resetMemory();document.getElementById('memory-modal').classList.add('show');}
function closeMemory(){document.getElementById('memory-modal').classList.remove('show');}

function resetMemory(){
    const pairs=[...MEMORY_EMOJIS,...MEMORY_EMOJIS];
    memoryCards=pairs.sort(()=>Math.random()-0.5);
    memoryFlipped=new Array(16).fill(false);memoryMatched=0;memoryMoves=0;memoryLocked=false;
    document.getElementById('memory-info').textContent='Найди все пары! Ходов: 0';
    renderMemory();
}

function renderMemory(){
    const board=document.getElementById('memory-board');if(!board)return;
    board.style.gridTemplateColumns='repeat(4,1fr)';board.innerHTML='';
    memoryCards.forEach((emoji,i)=>{
        const div=document.createElement('div');
        div.className='memory-card'+(memoryFlipped[i]?' flipped':'')+(memoryFlipped[i]==='matched'?' matched':' hidden-card');
        div.textContent=memoryFlipped[i]?emoji:'❓';
        if(!memoryFlipped[i])div.onclick=()=>flipMemoryCard(i);
        board.appendChild(div);
    });
}

function flipMemoryCard(i){
    if(memoryLocked||memoryFlipped[i])return;
    memoryFlipped[i]=true;playSound('click');
    const flippedIndices=memoryFlipped.map((f,idx)=>f===true?idx:-1).filter(x=>x>=0);
    renderMemory();
    if(flippedIndices.length===2){
        memoryLocked=true;memoryMoves++;
        document.getElementById('memory-info').textContent=`Ходов: ${memoryMoves}`;
        const[a,b]=flippedIndices;
        if(memoryCards[a]===memoryCards[b]){
            memoryFlipped[a]='matched';memoryFlipped[b]='matched';memoryMatched+=2;memoryLocked=false;
            playSound('like');renderMemory();
            if(memoryMatched===16){playSound('win');document.getElementById('memory-info').textContent=`🎉 Победа за ${memoryMoves} ходов!`;}
        }else{
            setTimeout(()=>{memoryFlipped[a]=false;memoryFlipped[b]=false;memoryLocked=false;renderMemory();},800);
        }
    }
}

// ============ КЛИКЕР ============
let clickerCount=0,clickerTime=10,clickerRunning=false,clickerInterval=null;

function openClicker(){clickerCount=0;clickerTime=10;clickerRunning=false;
    document.getElementById('clicker-score').textContent='0';
    document.getElementById('clicker-timer').textContent='10 сек';
    document.getElementById('clicker-modal').classList.add('show');}
function closeClicker(){clearInterval(clickerInterval);document.getElementById('clicker-modal').classList.remove('show');}

function startClicker(){
    if(clickerRunning)return;clickerRunning=true;clickerCount=0;clickerTime=10;
    document.getElementById('clicker-score').textContent='0';
    clickerInterval=setInterval(()=>{
        clickerTime--;document.getElementById('clicker-timer').textContent=`${clickerTime} сек`;
        if(clickerTime<=0){clearInterval(clickerInterval);clickerRunning=false;playSound('win');
            document.getElementById('clicker-timer').textContent=`🏆 Результат: ${clickerCount} кликов!`;}
    },1000);
}

function clickerClick(){
    if(!clickerRunning)return;clickerCount++;playSound('move');
    document.getElementById('clicker-score').textContent=clickerCount;
    const target=document.getElementById('clicker-target');
    target.style.transform='scale(0.9)';setTimeout(()=>target.style.transform='',100);
}

// ============ РЕАКЦИЯ ============
let reactionTimeout=null,reactionStart=0,reactionReady=false;

function openReactionGame(){document.getElementById('reaction-modal').classList.add('show');document.getElementById('reaction-result').textContent='';}
function closeReaction(){clearTimeout(reactionTimeout);document.getElementById('reaction-modal').classList.remove('show');}

function startReaction(){
    const circle=document.getElementById('reaction-circle');
    circle.className='reaction-circle waiting';circle.textContent='ЖДИТЕ...';
    document.getElementById('reaction-result').textContent='';reactionReady=false;
    const delay=1000+Math.random()*4000;
    reactionTimeout=setTimeout(()=>{
        circle.className='reaction-circle ready';circle.textContent='ЖМИТЕ!';reactionReady=true;reactionStart=Date.now();
    },delay);
}

function reactionClick(){
    const circle=document.getElementById('reaction-circle');
    if(!reactionReady){
        if(circle.classList.contains('waiting')){clearTimeout(reactionTimeout);
            document.getElementById('reaction-result').textContent='❌ Слишком рано! Попробуй снова.';
            circle.className='reaction-circle waiting';circle.textContent='ЖДИТЕ';playSound('error');}
        return;
    }
    const time=Date.now()-reactionStart;reactionReady=false;
    circle.className='reaction-circle clicked';circle.textContent=`${time} мс`;playSound('win');
    let rating='';
    if(time<200)rating='🏆 НЕВЕРОЯТНО!';else if(time<300)rating='🥇 ОТЛИЧНО!';
    else if(time<400)rating='🥈 ХОРОШО!';else if(time<500)rating='🥉 НОРМАЛЬНО';else rating='📚 Тренируйся!';
    document.getElementById('reaction-result').textContent=`${time} мс — ${rating}`;
}

// ============ 2048 ============
let numberBoard2048=[],numberScore2048=0,numberGameOver2048=false;

function openNumberGame(){resetNumberGame();document.getElementById('number-modal').classList.add('show');}
function closeNumberGame(){document.getElementById('number-modal').classList.remove('show');}

function resetNumberGame(){
    numberBoard2048=Array(4).fill(null).map(()=>Array(4).fill(0));numberScore2048=0;numberGameOver2048=false;
    addRandomTile();addRandomTile();
    document.getElementById('number-score').textContent='Очки: 0';renderNumberBoard();
}

function addRandomTile(){
    const empty=[];
    for(let r=0;r<4;r++)for(let c=0;c<4;c++)if(!numberBoard2048[r][c])empty.push({r,c});
    if(!empty.length)return;
    const pos=empty[Math.floor(Math.random()*empty.length)];
    numberBoard2048[pos.r][pos.c]=Math.random()<0.9?2:4;
}

function numberMove(dir){
    if(numberGameOver2048)return;
    let moved=false;const b=numberBoard2048;
    if(dir==='left'){for(let r=0;r<4;r++){const row=b[r].filter(x=>x);for(let i=0;i<row.length-1;i++){if(row[i]===row[i+1]){row[i]*=2;numberScore2048+=row[i];row.splice(i+1,1);}}while(row.length<4)row.push(0);if(JSON.stringify(b[r])!==JSON.stringify(row))moved=true;b[r]=row;}}
    else if(dir==='right'){for(let r=0;r<4;r++){const row=b[r].filter(x=>x).reverse();for(let i=0;i<row.length-1;i++){if(row[i]===row[i+1]){row[i]*=2;numberScore2048+=row[i];row.splice(i+1,1);}}while(row.length<4)row.push(0);row.reverse();if(JSON.stringify(b[r])!==JSON.stringify(row))moved=true;b[r]=row;}}
    else if(dir==='up'){for(let c=0;c<4;c++){let col=[];for(let r=0;r<4;r++)col.push(b[r][c]);const orig=JSON.stringify(col);col=col.filter(x=>x);for(let i=0;i<col.length-1;i++){if(col[i]===col[i+1]){col[i]*=2;numberScore2048+=col[i];col.splice(i+1,1);}}while(col.length<4)col.push(0);if(JSON.stringify(col)!==orig)moved=true;for(let r=0;r<4;r++)b[r][c]=col[r];}}
    else if(dir==='down'){for(let c=0;c<4;c++){let col=[];for(let r=0;r<4;r++)col.push(b[r][c]);const orig=JSON.stringify(col);col=col.filter(x=>x).reverse();for(let i=0;i<col.length-1;i++){if(col[i]===col[i+1]){col[i]*=2;numberScore2048+=col[i];col.splice(i+1,1);}}while(col.length<4)col.push(0);col.reverse();if(JSON.stringify(col)!==orig)moved=true;for(let r=0;r<4;r++)b[r][c]=col[r];}}
    if(moved){addRandomTile();playSound('move');document.getElementById('number-score').textContent=`Очки: ${numberScore2048}`;
        if(b.flat().includes(2048)){playSound('win');document.getElementById('number-score').textContent=`🎉 ПОБЕДА! Очки: ${numberScore2048}`;numberGameOver2048=true;}
        else if(!b.flat().includes(0)){let canMove=false;for(let r=0;r<4;r++)for(let c=0;c<3;c++){if(b[r][c]===b[r][c+1])canMove=true;}for(let c=0;c<4;c++)for(let r=0;r<3;r++){if(b[r][c]===b[r+1][c])canMove=true;}if(!canMove){numberGameOver2048=true;playSound('lose');document.getElementById('number-score').textContent=`Конец! Очки: ${numberScore2048}`;}}
    }
    renderNumberBoard();
}

function renderNumberBoard(){
    const board=document.getElementById('number-board');if(!board)return;board.innerHTML='';
    for(let r=0;r<4;r++)for(let c=0;c<4;c++){
        const div=document.createElement('div');div.className='number-cell'+(numberBoard2048[r][c]?` n${numberBoard2048[r][c]}`:'');
        div.textContent=numberBoard2048[r][c]||'';board.appendChild(div);
    }
}

document.addEventListener('keydown',e=>{if(!document.getElementById('number-modal').classList.contains('show'))return;
    if(e.key==='ArrowLeft')numberMove('left');if(e.key==='ArrowRight')numberMove('right');
    if(e.key==='ArrowUp'){e.preventDefault();numberMove('up');}if(e.key==='ArrowDown'){e.preventDefault();numberMove('down');}
});

// ============ КАМЕНЬ-НОЖНИЦЫ-БУМАГА ============
let rpsWins=0,rpsDraws=0,rpsLosses=0;

function openRPS(){rpsWins=0;rpsDraws=0;rpsLosses=0;updateRPSScore();
    document.getElementById('rps-result').textContent='Выбери!';document.getElementById('rps-display').textContent='';
    document.getElementById('rps-modal').classList.add('show');}
function closeRPS(){document.getElementById('rps-modal').classList.remove('show');}

function playRPS(choice){
    const choices=['rock','scissors','paper'];const emojis={rock:'✊',scissors:'✌️',paper:'🖐️'};
    const comp=choices[Math.floor(Math.random()*3)];
    document.getElementById('rps-display').textContent=`${emojis[choice]} VS ${emojis[comp]}`;
    let result='';
    if(choice===comp){result='🤝 НИЧЬЯ!';rpsDraws++;playSound('move');}
    else if((choice==='rock'&&comp==='scissors')||(choice==='scissors'&&comp==='paper')||(choice==='paper'&&comp==='rock')){
        result='🎉 ТЫ ПОБЕДИЛ!';rpsWins++;playSound('win');}
    else{result='😢 ПРОИГРЫШ!';rpsLosses++;playSound('lose');}
    document.getElementById('rps-result').textContent=result;updateRPSScore();
}

function updateRPSScore(){
    document.getElementById('rps-wins').textContent=rpsWins;
    document.getElementById('rps-draws').textContent=rpsDraws;
    document.getElementById('rps-losses').textContent=rpsLosses;
}
