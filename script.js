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
