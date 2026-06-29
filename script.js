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
function applyTheme(themeId){document.body.className='';if(themeId&&themeId!=='default')document.body.classList.add('theme-'+themeId);if(currentUser){currentUser.theme=themeId;saveCurrentUserToFirebase();}renderThemes();}
function renderThemes(){const grid=document.getElementById('themes-grid');if(!grid)return;grid.innerHTML='';const active=currentUser?.theme||'default';THEMES.forEach(t=>{const div=document.createElement('div');div.className='theme-option'+(active===t.id?' selected':'');div.innerHTML=`<div class="theme-preview" style="background:linear-gradient(135deg,${t.color},${t.bg});"></div><div class="theme-name">${t.name}</div>`;div.onclick=()=>applyTheme(t.id);grid.appendChild(div);});}
function loadUserTheme(){if(currentUser&&currentUser.theme)applyTheme(currentUser.theme);}

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
function ensureFields(){if(!currentUser.avatar)currentUser.avatar='👤';if(!currentUser.avatarImg)currentUser.avatarImg='';if(!currentUser.bio)currentUser.bio='';if(!currentUser.wallet)currentUser.wallet={RUB:0,USD:0,EUR:0,KZT:0};if(!currentUser.currency)currentUser.currency='RUB';if(currentUser.subscription===undefined)currentUser.subscription=false;if(currentUser.subscription===true)currentUser.subscription='basic';if(currentUser.banned===undefined)currentUser.banned=false;if(!currentUser.theme)currentUser.theme='default';if(currentUser.tempSubUntil===undefined)currentUser.tempSubUntil=0;if(!currentUser.nickColor)currentUser.nickColor='default';if(currentUser.extraFollowers===undefined)currentUser.extraFollowers=0;if(currentUser.email===ADMIN_EMAIL){currentUser.subscription='pro';currentUser.isAdmin=true;}saveCurrentUserToFirebase();}
async function tryLogin(){const email=document.getElementById('login-email').value.trim().toLowerCase();const password=document.getElementById('login-password').value;const remember=document.getElementById('remember-check').checked;const user=await getUserByEmail(email);document.getElementById('login-error').classList.remove('show');document.getElementById('banned-error').classList.remove('show');if(user && user.password===password){if(user.banned){document.getElementById('banned-error').classList.add('show');return;}currentUser=user;ensureFields();if(remember)setCookie('theded_fb',{email:user.email,password:user.password},30);else sessionStorage.setItem('theded_fb',JSON.stringify({email:user.email,password:user.password}));loginSuccess();}else{const err=document.getElementById('login-error');err.classList.add('show');err.style.animation='none';setTimeout(()=>err.style.animation='shake 0.4s ease',10);}}
async function tryRegister(){const name=document.getElementById('reg-name').value.trim();const email=document.getElementById('reg-email').value.trim().toLowerCase();const password=document.getElementById('reg-password').value;if(!name||!email||!password){showRegError('❌ Заполни всё');return;}if(!email.includes('@')||!email.includes('.')){showRegError('❌ Правильный email');return;}if(password.length<4){showRegError('❌ Минимум 4 символа');return;}const existing=await getUserByEmail(email);if(existing){showRegError('❌ Email занят');return;}const newUser={email,password,name,avatar:'👤',avatarImg:'',bio:'',wallet:{RUB:0,USD:0,EUR:0,KZT:0},currency:'RUB',subscription:false,isAdmin:false,banned:false,theme:'default',tempSubUntil:0,nickColor:'default',extraFollowers:0};await fbWrite(`users/${emailToKey(email)}`,newUser);currentUser=newUser;setCookie('theded_fb',{email:newUser.email,password:newUser.password},30);loginSuccess();}
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
function topupWallet(){const label=encodeURIComponent('THEDED_'+currentUser.email);const url=`https://yoomoney.ru/quickpay/confirm.xml?receiver=${YOOMONEY_WALLET}&quickpay-form=donate&targets=${encodeURIComponent('THE DED+')}&paymentType=AC&sum=50&label=${label}`;window.open(url,'_blank');}

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

function showPage(pageId){document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));document.getElementById('page-'+pageId).classList.add('active');document.querySelectorAll('.nav-tab').forEach(b=>b.classList.remove('active'));const btn=document.getElementById('btn-'+pageId);if(btn)btn.classList.add('active');if(pageId!=='player')document.getElementById('v-player').pause();if(pageId==='profile'){updateAvatarDisplay();updateWalletDisplay();renderThemes();renderNickColors();updateFollowCounts();}if(pageId==='support')renderMyTickets();if(pageId==='messages')renderChatsList();if(pageId==='home')document.getElementById('back-btn').style.display='none';window.scrollTo({top:0,behavior:'smooth'});}
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
    const main=document.getElementById('messages-main');
    const av=otherUser.avatarImg?`<img src="${otherUser.avatarImg}">`:(otherUser.avatar||'👤');
    main.innerHTML=`
        <div class="chat-header">
            <div class="chat-header-avatar" style="cursor:pointer;" onclick="openUserProfile('${otherUser.email}')">${av}</div>
            <div class="chat-header-name" style="cursor:pointer;" onclick="openUserProfile('${otherUser.email}')">${otherUser.name}</div>
        </div>
        <div class="chat-messages" id="chat-messages-area"></div>
        <div class="emoji-picker" id="emoji-picker"></div>
        <div class="chat-input-area">
            <button class="emoji-btn" onclick="toggleEmojiPicker()">😀</button>
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
    const main=document.getElementById('messages-main');
    main.innerHTML=`
        <div class="chat-header">
            <div class="chat-header-avatar">👥</div>
            <div class="chat-header-name">${group.name} <span style="color:#888;font-size:0.85rem;">(${Object.keys(group.members).length} чел)</span></div>
            <button class="boost-btn" style="padding:8px 12px;font-size:0.75rem;background:#333;color:white;margin-left:auto;" onclick="showGroupMembers('${groupId}')">👥 УЧАСТНИКИ</button>
        </div>
        <div class="chat-messages" id="chat-messages-area"></div>
        <div class="emoji-picker" id="emoji-picker"></div>
        <div class="chat-input-area">
            <button class="emoji-btn" onclick="toggleEmojiPicker()">😀</button>
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
    const arr=Object.values(messages).sort((a,b)=>(a.timestamp||0)-(b.timestamp||0));
    const wasScrolledToBottom=area.scrollTop+area.clientHeight>=area.scrollHeight-50;
    area.innerHTML='';
    arr.forEach(m=>{
        const div=document.createElement('div');
        const isMine=m.from===currentUser.email;
        div.className='msg-bubble '+(isMine?'mine':'theirs');
        let authorBlock='';
        if(currentChatType==='group' && !isMine){
            authorBlock=`<div class="chat-msg-author" style="cursor:pointer;color:var(--red);" onclick="openUserProfile('${m.from}')">${m.authorName||'?'}</div>`;
        }
        div.innerHTML=`${authorBlock}<div class="msg-text">${m.text.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div><div class="msg-time">${m.date}</div>`;
        area.appendChild(div);
    });
    if(wasScrolledToBottom){area.scrollTop=area.scrollHeight;}
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
    const msg={from:currentUser.email,to:toEmail,text,date:new Date().toLocaleString('ru-RU'),timestamp:Date.now(),read:false};
    const newRef=window.fbPush(window.fbRef(window.fbDb,`messages/${chatId}`));
    await window.fbSet(newRef,msg);
    input.value='';
    const picker=document.getElementById('emoji-picker');
    if(picker)picker.classList.remove('show');
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
    const msg={from:currentUser.email,authorName:currentUser.name,text,date:new Date().toLocaleString('ru-RU'),timestamp:Date.now(),readBy:{[emailToKey(currentUser.email)]:true}};
    const newRef=window.fbPush(window.fbRef(window.fbDb,`messages/${chatId}`));
    await window.fbSet(newRef,msg);
    input.value='';
    const picker=document.getElementById('emoji-picker');
    if(picker)picker.classList.remove('show');
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