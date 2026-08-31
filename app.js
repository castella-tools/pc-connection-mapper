console.info('PC Connection Mapper app.js v1.24 loaded');

const WORKSPACE = { width: 3200, height: 2200 };
const GRID = 20;
const STORAGE_KEY = 'pc-connection-mapper-v1';
const INTRO_KEY = 'pc-connection-mapper-intro-seen-v1';
const HISTORY_LIMIT = 50;
const PALETTE_COLLAPSE_KEY = 'pc-connection-mapper-palette-collapse-v1';
const PNG_OPTIONS_KEY = 'pc-connection-mapper-png-options-v1';

const DEVICE_SEARCH_ALIASES = {
  'PC':'パソコン デスクトップ computer',
  'Laptop':'ノート ノートPC notebook',
  'Monitor':'モニター ディスプレイ display',
  'Keyboard':'キーボード',
  'Mouse':'マウス',
  'Trackball':'トラックボール',
  'Controller':'コントローラー ゲームパッド gamepad',
  'Webcam':'ウェブカメラ web camera',
  'USB Hub':'USBハブ ハブ',
  'Dock':'ドック docking',
  'External Storage':'外付けストレージ 外付けHDD 外付けSSD',
  'DAC':'DAC オーディオ',
  'Audio I/F':'オーディオインターフェース audio interface',
  'Speaker':'スピーカー',
  'Headphone':'ヘッドホン',
  'Earphone':'イヤホン',
  'Microphone':'マイク マイクロフォン',
  'Router':'ルーター',
  'LAN Switch':'LANスイッチ スイッチングハブ',
  'NAS':'NAS ネットワークストレージ',
  'Printer':'プリンター',
  'Power / UPS':'電源 UPS',
  'Other':'その他'
};

const DEVICE_GROUPS = [
  {
    label:'PC・ディスプレイ',
    items:[
      ['PC','pc','large'],
      ['Laptop','laptop','medium'],
      ['Monitor','monitor','medium']
    ]
  },
  {
    label:'入力・操作',
    items:[
      ['Keyboard','keyboard','small'],
      ['Mouse','mouse','small'],
      ['Trackball','trackball','small'],
      ['Controller','controller','small'],
      ['Webcam','webcam','small']
    ]
  },
  {
    label:'USB・拡張',
    items:[
      ['USB Hub','usb-hub','medium'],
      ['Dock','dock','medium'],
      ['External Storage','storage','small']
    ]
  },
  {
    label:'オーディオ',
    items:[
      ['DAC','dac','medium'],
      ['Audio I/F','audio-interface','medium'],
      ['Speaker','speaker','small'],
      ['Headphone','headphone','small'],
      ['Earphone','earphone','small'],
      ['Microphone','microphone','small']
    ]
  },
  {
    label:'ネットワーク・ストレージ',
    items:[
      ['Router','router','medium'],
      ['LAN Switch','lan-switch','medium'],
      ['NAS','nas','medium']
    ]
  },
  {
    label:'その他',
    items:[
      ['Printer','printer','medium'],
      ['Power / UPS','power','medium'],
      ['Other','other','small']
    ]
  }
];

const DEVICE_TYPES = DEVICE_GROUPS
  .flatMap(group => group.items)
  .map(([type,iconKey,size])=>({type,iconKey,size}));

const DEVICE_CATEGORY_ACCENTS = {
  'PC・ディスプレイ':'#60a5fa',
  '入力・操作':'#38bdf8',
  'USB・拡張':'#a78bfa',
  'オーディオ':'#34d399',
  'ネットワーク・ストレージ':'#fb923c',
  'その他':'#94a3b8'
};

function deviceCategoryInfo(type){
  const group=DEVICE_GROUPS.find(g=>g.items.some(item=>item[0]===type));
  const label=group?.label || 'その他';
  return {label,color:DEVICE_CATEGORY_ACCENTS[label] || '#94a3b8'};
}

function deviceAccent(type){
  return deviceCategoryInfo(type).color;
}

const GROUP_ACCENTS = [
  '#64748b','#60a5fa','#a78bfa','#34d399','#fb923c','#f472b6'
];

const ICON_SVGS = {
  pc:'<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
  laptop:'<rect x="5" y="4" width="14" height="11" rx="2"/><path d="M3 19h18l-2-3H5z"/>',
  monitor:'<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
  keyboard:'<rect x="2.5" y="6" width="19" height="12" rx="2"/><path d="M6 10h.01M9 10h.01M12 10h.01M15 10h.01M18 10h.01M6 13h.01M9 13h.01M12 13h.01M15 13h.01M18 13h.01M7 16h10"/>',
  mouse:'<rect x="7" y="2.5" width="10" height="19" rx="5"/><path d="M12 2.5v6"/>',
  trackball:'<rect x="5" y="3" width="14" height="18" rx="6"/><circle cx="12" cy="9" r="3"/>',
  controller:'<path d="M8 8h8c3 0 5 2 5 5 0 4-2 7-4 7-1.5 0-2.3-2-3.5-2h-3C9.3 18 8.5 20 7 20c-2 0-4-3-4-7 0-3 2-5 5-5z"/><path d="M7 12h4M9 10v4M16 11h.01M18 13h.01"/>',
  webcam:'<rect x="4" y="6" width="16" height="11" rx="3"/><circle cx="12" cy="11.5" r="3"/><path d="M9 21h6M12 17v4"/>',
  'usb-hub':'<rect x="4" y="7" width="16" height="10" rx="2"/><path d="M8 7V4M12 7V3M16 7V4M8 17v3M12 17v4M16 17v3"/><circle cx="8" cy="4" r="1"/><circle cx="12" cy="3" r="1"/><circle cx="16" cy="4" r="1"/>',
  dock:'<rect x="3" y="6" width="18" height="12" rx="3"/><path d="M7 10h4M7 14h2M15 10h2M14 14h3"/>',
  storage:'<rect x="5" y="3" width="14" height="18" rx="3"/><circle cx="12" cy="15" r="1.5"/><path d="M8 7h8"/>',
  dac:'<rect x="3" y="5" width="18" height="14" rx="3"/><circle cx="8" cy="12" r="2.5"/><path d="M14 9h4M14 12h4M14 15h3"/>',
  'audio-interface':'<rect x="3" y="5" width="18" height="14" rx="3"/><circle cx="7" cy="12" r="2"/><circle cx="13" cy="12" r="2"/><path d="M17 9v6"/>',
  speaker:'<rect x="6" y="3" width="12" height="18" rx="3"/><circle cx="12" cy="14" r="4"/><circle cx="12" cy="7" r="1.5"/>',
  headphone:'<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="13" width="4" height="7" rx="2"/><rect x="17" y="13" width="4" height="7" rx="2"/>',
  earphone:'<path d="M7 5a4 4 0 1 1 4 4v9M17 5a4 4 0 1 0-4 4v9"/><path d="M11 18v3M13 18v3"/>',
  microphone:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6"/>',
  router:'<rect x="3" y="11" width="18" height="8" rx="2"/><path d="M7 11V7M17 11V7M8 15h.01M12 15h.01M16 15h.01"/><path d="M5 6c2-2 4-3 7-3s5 1 7 3"/>',
  'lan-switch':'<rect x="3" y="7" width="18" height="10" rx="2"/><path d="M7 11h2v2H7zM11 11h2v2h-2zM15 11h2v2h-2z"/>',
  nas:'<rect x="5" y="3" width="14" height="18" rx="3"/><path d="M8 7h8M8 11h8"/><circle cx="9" cy="16" r="1"/>',
  printer:'<path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="9" rx="2"/><path d="M6 15h12v6H6zM17 12h.01"/>',
  power:'<path d="M13 2 6 13h6l-1 9 7-12h-6z"/>',
  other:'<rect x="5" y="5" width="14" height="14" rx="3"/><path d="M9 9h6v6H9z"/>'
};

function iconSvg(iconKey, className='device-svg'){
  const body = ICON_SVGS[iconKey] || ICON_SVGS.other;
  return `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
}

function deviceTypeInfo(type){
  return DEVICE_TYPES.find(d=>d.type===type) || {type:'Other',iconKey:'other',size:'small'};
}

function nodeIconKey(node){
  return node.iconKey || deviceTypeInfo(node.type).iconKey || 'other';
}

const CARD_SIZES = {
  small:{w:145,h:68},
  medium:{w:170,h:86},
  large:{w:205,h:112},
  xlarge:{w:285,h:180}
};

const CABLES = {
  'USB-A':{color:'#60a5fa'},
  'USB-B':{color:'#60a5fa'},
  'USB-C':{color:'#60a5fa'},
  'Micro-USB':{color:'#60a5fa'},
  'USB4':{color:'#60a5fa'},
  'Thunderbolt':{color:'#60a5fa'},

  'HDMI':{color:'#a78bfa'},
  'DisplayPort':{color:'#a78bfa'},
  'DVI':{color:'#a78bfa'},
  'VGA':{color:'#a78bfa'},

  '3.5mm':{color:'#34d399'},
  '6.3mm':{color:'#34d399'},
  'RCA':{color:'#34d399'},
  'XLR':{color:'#34d399'},
  'Optical':{color:'#34d399'},

  'LAN':{color:'#fb923c'},

  'AC Power':{color:'#94a3b8'},
  'DC Power':{color:'#94a3b8'},

  'Bluetooth':{color:'#22d3ee',dash:true},
  'Wi-Fi':{color:'#facc15',dash:true},

  'Other':{color:'#f472b6'}
};

const CABLE_GROUPS = [
  {label:'USB / 高速I/O', items:['USB-A','USB-B','USB-C','Micro-USB','USB4','Thunderbolt']},
  {label:'映像', items:['HDMI','DisplayPort','DVI','VGA']},
  {label:'音声', items:['3.5mm','6.3mm','RCA','XLR','Optical']},
  {label:'ネットワーク', items:['LAN']},
  {label:'電源', items:['AC Power','DC Power']},
  {label:'無線', items:['Bluetooth','Wi-Fi']},
  {label:'その他', items:['Other']}
];

const app = document.getElementById('app');
const viewport = document.getElementById('viewport');
const world = document.getElementById('world');
const nodesLayer = document.getElementById('nodes');
const linksLayer = document.getElementById('links');
const groupsLayer = document.getElementById('groups');
const guidesLayer = document.getElementById('guides');
const diagramTitleLayer = document.getElementById('diagramTitleLayer');
const palette = document.getElementById('palette');
const deviceSearch = document.getElementById('deviceSearch');
const clearDeviceSearchBtn = document.getElementById('clearDeviceSearchBtn');
const properties = document.getElementById('properties');
const snapToggle = document.getElementById('snapToggle');
const saveStatus = document.getElementById('saveStatus');

const connectBtn = document.getElementById('connectBtn');
const jsonSaveBtn = document.getElementById('jsonSaveBtn');
const jsonLoadBtn = document.getElementById('jsonLoadBtn');
const jsonFileInput = document.getElementById('jsonFileInput');
const pngBtn = document.getElementById('pngBtn');
const newBtn = document.getElementById('newBtn');
const sampleBtn = document.getElementById('sampleBtn');
const titleBtn = document.getElementById('titleBtn');
const addGroupBtn = document.getElementById('addGroupBtn');
const undoBtn = document.getElementById('undoBtn');
const redoBtn = document.getElementById('redoBtn');
const helpBtn = document.getElementById('helpBtn');
const toggleLeftBtn = document.getElementById('toggleLeftBtn');
const toggleRightBtn = document.getElementById('toggleRightBtn');

const viewControls = document.getElementById('viewControls');
const zoomOutBtn = document.getElementById('zoomOutBtn');
const zoomInBtn = document.getElementById('zoomInBtn');
const resetZoomBtn = document.getElementById('resetZoomBtn');
const fitBtn = document.getElementById('fitBtn');

const exportModal = document.getElementById('exportModal');
const modalTitle = document.getElementById('modalTitle');
const modalContent = document.getElementById('modalContent');
const modalDownloadLink = document.getElementById('modalDownloadLink');
const copyJsonBtn = document.getElementById('copyJsonBtn');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalCloseBtn2 = document.getElementById('modalCloseBtn2');
const toast = document.getElementById('toast');

let state = {
  nodes: [],
  edges: [],
  groups: [],
  diagram:{title:'',x:1450,y:900},
  view: {x:0,y:0,scale:1},
  selectedNodeId:null,
  selectedNodeIds:[],
  selectedEdgeId:null,
  selectedGroupId:null,
  connectMode:false,
  connectSourceId:null,
  nextId:1,
  nextGroupId:1
};

let saveTimer = null;
let toastTimer = null;
let panState = null;
let firstRun = false;
const history = {undo:[],redo:[]};
const editSnapshots = new WeakMap();


function contentSnapshot(){
  return JSON.stringify({nodes:state.nodes,edges:state.edges,groups:state.groups,diagram:state.diagram,nextId:state.nextId,nextGroupId:state.nextGroupId});
}

function pushUndoSnapshot(snapshot=contentSnapshot()){
  if(!snapshot) return;
  if(history.undo[history.undo.length-1]!==snapshot) history.undo.push(snapshot);
  if(history.undo.length>HISTORY_LIMIT) history.undo.shift();
  history.redo=[];
  updateHistoryButtons();
}

function updateHistoryButtons(){
  undoBtn.disabled=history.undo.length===0;
  redoBtn.disabled=history.redo.length===0;
}

function restoreContentSnapshot(snapshot){
  const data=JSON.parse(snapshot);
  state.nodes=data.nodes||[];
  state.edges=data.edges||[];
  state.groups=data.groups||[];
  state.diagram=data.diagram||{title:'',x:1450,y:900};
  state.nextId=data.nextId||Math.max(0,...state.nodes.map(n=>Number(n.id)||0))+1;
  state.nextGroupId=data.nextGroupId||Math.max(0,...state.groups.map(g=>Number(g.id)||0))+1;
  state.selectedNodeId=null;state.selectedNodeIds=[];state.selectedEdgeId=null;state.selectedGroupId=null;state.connectMode=false;state.connectSourceId=null;
  connectBtn.classList.remove('primary');connectBtn.textContent='機器を接続';
  renderAll();scheduleSave();
}

function undo(){
  if(!history.undo.length)return;
  history.redo.push(contentSnapshot());
  restoreContentSnapshot(history.undo.pop());
  updateHistoryButtons();
  showToast('元に戻しました');
}

function redo(){
  if(!history.redo.length)return;
  history.undo.push(contentSnapshot());
  restoreContentSnapshot(history.redo.pop());
  updateHistoryButtons();
  showToast('やり直しました');
}

function beginTrackedEdit(el){
  if(!editSnapshots.has(el)) editSnapshots.set(el,contentSnapshot());
}
function endTrackedEdit(el){
  const before=editSnapshots.get(el);
  if(before && before!==contentSnapshot()) pushUndoSnapshot(before);
  editSnapshots.delete(el);
}
function bindTrackedText(el,onInput){
  el.addEventListener('focus',()=>beginTrackedEdit(el));
  el.addEventListener('input',onInput);
  el.addEventListener('change',()=>endTrackedEdit(el));
  el.addEventListener('blur',()=>endTrackedEdit(el));
}

function makeBlank(){
  return {version:'1.24',nextId:1,nextGroupId:1,nodes:[],edges:[],groups:[],diagram:{title:'',x:1450,y:900},view:{x:0,y:0,scale:1}};
}

function escapeHtml(value){
  return String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'
  })[ch]);
}

function cardSize(node){ return CARD_SIZES[node.size] || CARD_SIZES.medium; }
function snap(value){ return snapToggle.checked ? Math.round(value/GRID)*GRID : value; }

function showToast(message){
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>toast.classList.remove('show'), 2200);
}

function scheduleSave(){
  saveStatus.textContent = '保存中…';
  clearTimeout(saveTimer);
  saveTimer = setTimeout(()=>{
    try{
      const data = serializableState();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      saveStatus.textContent = '自動保存済み';
    }catch(err){
      console.error(err);
      saveStatus.textContent = '自動保存エラー';
    }
  }, 250);
}

function serializableState(){
  return {
    version:'1.24',
    nodes:state.nodes,
    edges:state.edges,
    groups:state.groups,
    diagram:state.diagram,
    view:state.view,
    nextId:state.nextId,
    nextGroupId:state.nextGroupId
  };
}

function makeSample(){
  return {
    version:'1.24',
    nextId:7,
    nextGroupId:3,
    diagram:{title:'My Desktop Setup',x:1240,y:770},
    groups:[
      {id:1,title:'Input Devices',x:1180,y:880,w:240,h:380,color:'#38bdf8'},
      {id:2,title:'Main System',x:1450,y:840,w:580,h:570,color:'#60a5fa'}
    ],
    nodes:[
      {id:1,type:'PC',iconKey:'pc',size:'large',name:'Main PC',model:'Custom Build',note:'Gaming / Workstation',x:1500,y:1050},
      {id:2,type:'Monitor',iconKey:'monitor',size:'medium',name:'4K Monitor',model:'32-inch / 144Hz',note:'Main Display',x:1820,y:890},
      {id:3,type:'USB Hub',iconKey:'usb-hub',size:'medium',name:'USB Hub',model:'USB-C 10Gbps',note:'Desk Hub',x:1820,y:1070},
      {id:4,type:'DAC',iconKey:'dac',size:'medium',name:'USB DAC',model:'Desktop DAC',note:'Earphone output',x:1820,y:1250},
      {id:5,type:'Keyboard',iconKey:'keyboard',size:'small',name:'Keyboard',model:'',note:'USB',x:1240,y:950},
      {id:6,type:'Mouse',iconKey:'mouse',size:'small',name:'Mouse',model:'',note:'Wireless',x:1240,y:1150}
    ],
    edges:[
      {id:'e1',from:1,to:2,type:'DisplayPort',label:'DisplayPort',style:'curve',bend:.5,fromSide:'auto',toSide:'auto'},
      {id:'e2',from:1,to:3,type:'USB-C',label:'USB-C',style:'curve',bend:.5,fromSide:'auto',toSide:'auto'},
      {id:'e3',from:3,to:4,type:'USB-A',label:'USB-A',style:'curve',bend:.5,fromSide:'auto',toSide:'auto'},
      {id:'e4',from:5,to:1,type:'USB-A',label:'USB-A',style:'curve',bend:.5,fromSide:'auto',toSide:'auto'},
      {id:'e5',from:6,to:1,type:'USB-A',label:'USB Receiver',style:'curve',bend:.5,fromSide:'auto',toSide:'auto'}
    ],
    view:{x:0,y:0,scale:1}
  };
}

function loadInitialState(){
  try{
    const stored = localStorage.getItem(STORAGE_KEY);
    if(stored){
      applyImportedState(JSON.parse(stored), false);
      return;
    }
  }catch(err){ console.warn(err); }
  firstRun = true;
  applyImportedState(makeSample(), false);
  requestAnimationFrame(centerWorkspace);
}

function applyImportedState(data, save=true){
  state.nodes = Array.isArray(data.nodes) ? data.nodes.map(n=>({
    ...n,
    size:n.size || deviceTypeInfo(n.type).size || 'medium',
    iconKey:n.iconKey || deviceTypeInfo(n.type).iconKey || 'other',
    model:n.model || '',
    note:n.note || '',
    locked:!!n.locked
  })) : [];
  state.edges = Array.isArray(data.edges) ? data.edges.map(e=>({
    ...e,
    style:e.style || 'curve',
    bend:Number.isFinite(+e.bend) ? +e.bend : .5,
    fromSide:e.fromSide || 'auto',
    toSide:e.toSide || 'auto',
    label:e.label || e.type || 'Other',
    labelPos:Number.isFinite(+e.labelPos) ? +e.labelPos : .5
  })) : [];
  state.groups = Array.isArray(data.groups) ? data.groups.map((g,i)=>({
    id:g.id ?? i+1,
    title:g.title || 'グループ',
    x:Number.isFinite(+g.x)?+g.x:1200,
    y:Number.isFinite(+g.y)?+g.y:800,
    w:Math.max(220,Number.isFinite(+g.w)?+g.w:560),
    h:Math.max(140,Number.isFinite(+g.h)?+g.h:340),
    color:g.color || GROUP_ACCENTS[0]
  })) : [];
  state.diagram = {
    title:data.diagram?.title || '',
    x:Number.isFinite(+data.diagram?.x)?+data.diagram.x:1450,
    y:Number.isFinite(+data.diagram?.y)?+data.diagram.y:900
  };
  state.view = data.view && Number.isFinite(data.view.scale)
    ? {...data.view}
    : {x:0,y:0,scale:1};
  state.nextId = data.nextId || Math.max(0,...state.nodes.map(n=>Number(n.id)||0))+1;
  state.nextGroupId = data.nextGroupId || Math.max(0,...state.groups.map(g=>Number(g.id)||0))+1;
  state.selectedNodeId = null;
  state.selectedNodeIds = [];
  state.selectedEdgeId = null;
  state.selectedGroupId = null;
  state.connectMode = false;
  state.connectSourceId = null;
  connectBtn.classList.remove('primary');
  connectBtn.textContent = '機器を接続';
  renderAll();
  applyView();
  if(save) scheduleSave();
}

function loadCollapsedDeviceGroups(){
  try{
    const parsed=JSON.parse(localStorage.getItem(PALETTE_COLLAPSE_KEY)||'[]');
    return new Set(Array.isArray(parsed)?parsed:[]);
  }catch{
    return new Set();
  }
}

const collapsedDeviceGroups=loadCollapsedDeviceGroups();

function saveCollapsedDeviceGroups(){
  localStorage.setItem(PALETTE_COLLAPSE_KEY,JSON.stringify([...collapsedDeviceGroups]));
}

function normalizedDeviceSearch(value){
  return String(value||'').trim().toLowerCase();
}

function deviceMatchesSearch(type,groupLabel,query){
  if(!query)return true;
  const haystack=[
    type,
    groupLabel,
    DEVICE_SEARCH_ALIASES[type]||''
  ].join(' ').toLowerCase();
  return haystack.includes(query);
}

function buildPalette(filterValue=deviceSearch?.value||''){
  const query=normalizedDeviceSearch(filterValue);
  palette.innerHTML='';
  let resultCount=0;

  DEVICE_GROUPS.forEach(group=>{
    const categoryMatched=query && group.label.toLowerCase().includes(query);
    const matchingItems=categoryMatched
      ? group.items
      : group.items.filter(([type])=>deviceMatchesSearch(type,group.label,query));

    if(query && matchingItems.length===0)return;
    resultCount+=matchingItems.length;

    const section=document.createElement('section');
    section.className='device-group';
    section.style.setProperty('--cat-color',DEVICE_CATEGORY_ACCENTS[group.label]||'#94a3b8');

    const collapsed=!query && collapsedDeviceGroups.has(group.label);

    const heading=document.createElement('button');
    heading.type='button';
    heading.className='device-group-title device-group-toggle'+(collapsed?' collapsed':'');
    heading.setAttribute('aria-expanded',String(!collapsed));
    heading.innerHTML=`
      <span class="device-group-heading">
        <span class="device-group-chevron" aria-hidden="true">⌄</span>
        <span>${escapeHtml(group.label)}</span>
      </span>
      <span class="device-group-count">${matchingItems.length}</span>
    `;
    heading.addEventListener('click',()=>{
      if(query)return;
      if(collapsedDeviceGroups.has(group.label))collapsedDeviceGroups.delete(group.label);
      else collapsedDeviceGroups.add(group.label);
      saveCollapsedDeviceGroups();
      buildPalette();
    });
    section.appendChild(heading);

    const grid=document.createElement('div');
    grid.className='device-group-grid';
    grid.hidden=collapsed;

    matchingItems.forEach(([type,iconKey,size])=>{
      const button=document.createElement('button');
      button.className='palette-btn';
      button.style.setProperty('--cat-color',deviceAccent(type));
      button.innerHTML=`<span class="palette-icon">${iconSvg(iconKey,'palette-svg')}</span><span class="palette-name">${escapeHtml(type)}</span>`;
      button.addEventListener('click',()=>addNode({type,iconKey,size}));
      grid.appendChild(button);
    });

    section.appendChild(grid);
    palette.appendChild(section);
  });

  if(query && resultCount===0){
    const empty=document.createElement('div');
    empty.className='palette-empty';
    empty.innerHTML=`<strong>一致するデバイスがありません</strong><span>「${escapeHtml(filterValue)}」の検索結果は0件です。</span>`;
    palette.appendChild(empty);
  }

  if(clearDeviceSearchBtn){
    clearDeviceSearchBtn.hidden=!query;
  }
}

deviceSearch?.addEventListener('input',()=>buildPalette());
deviceSearch?.addEventListener('keydown',e=>{
  if(e.key==='Escape' && deviceSearch.value){
    deviceSearch.value='';
    buildPalette();
  }
});
clearDeviceSearchBtn?.addEventListener('click',()=>{
  deviceSearch.value='';
  buildPalette();
  deviceSearch.focus();
});

function addNode(device){
  pushUndoSnapshot();
  const center = screenToWorld(viewport.clientWidth/2 + viewport.getBoundingClientRect().left,
                               viewport.clientHeight/2 + viewport.getBoundingClientRect().top);
  const node = {
    id:state.nextId++,
    type:device.type,
    iconKey:device.iconKey,
    size:device.size,
    name:device.type,
    model:'',
    note:'',
    locked:false,
    x:snap(Math.max(0,Math.min(WORKSPACE.width-200, center.x-80))),
    y:snap(Math.max(0,Math.min(WORKSPACE.height-120, center.y-40)))
  };
  state.nodes.push(node);
  state.selectedNodeId = node.id;
  state.selectedNodeIds = [node.id];
  state.selectedEdgeId = null;
  renderAll();
  scheduleSave();
}


function addGroup(){
  pushUndoSnapshot();
  const r=viewport.getBoundingClientRect();
  const c=screenToWorld(r.left+r.width/2,r.top+r.height/2);
  const group={
    id:state.nextGroupId++,
    title:'グループ',
    x:snap(Math.max(0,Math.min(WORKSPACE.width-560,c.x-280))),
    y:snap(Math.max(0,Math.min(WORKSPACE.height-340,c.y-170))),
    w:560,h:340,
    color:GROUP_ACCENTS[(state.groups.length)%GROUP_ACCENTS.length]
  };
  state.groups.push(group);
  state.selectedGroupId=group.id;
  state.selectedEdgeId=null;
  clearNodeSelection();
  renderAll();scheduleSave();
}

function syncGroupSelectionStyles(){
  groupsLayer.querySelectorAll('.group-frame').forEach(el=>{
    el.classList.toggle('selected',Number(el.dataset.id)===state.selectedGroupId);
  });
}

function renderGroups(){
  groupsLayer.innerHTML='';
  state.groups.forEach(group=>{
    const el=document.createElement('div');
    el.className='group-frame'+(state.selectedGroupId===group.id?' selected':'');
    el.dataset.id=group.id;
    el.style.left=`${group.x}px`;
    el.style.top=`${group.y}px`;
    el.style.width=`${group.w}px`;
    el.style.height=`${group.h}px`;
    el.style.setProperty('--group-color',group.color);
    el.innerHTML=`
      <div class="group-title-bar">${escapeHtml(group.title)}</div>
      <div class="group-resize" title="サイズ変更"></div>
    `;
    bindGroupInteractions(el,group);
    groupsLayer.appendChild(el);
  });
}

function bindGroupInteractions(el,group){
  const title=el.querySelector('.group-title-bar');
  const handle=el.querySelector('.group-resize');
  let action=null;

  const selectGroup=()=>{
    state.selectedGroupId=group.id;
    state.selectedEdgeId=null;
    clearNodeSelection();
    syncGroupSelectionStyles();
    renderProperties();
  };

  title.addEventListener('pointerdown',e=>{
    if(e.button!==0)return;
    e.preventDefault();e.stopPropagation();
    selectGroup();
    action={
      kind:'move',
      id:e.pointerId,
      sx:e.clientX,sy:e.clientY,
      x:group.x,y:group.y,
      before:contentSnapshot(),
      moved:false
    };
    title.setPointerCapture(e.pointerId);
  });

  handle.addEventListener('pointerdown',e=>{
    if(e.button!==0)return;
    e.preventDefault();e.stopPropagation();
    selectGroup();
    action={
      kind:'resize',
      id:e.pointerId,
      sx:e.clientX,sy:e.clientY,
      w:group.w,h:group.h,
      before:contentSnapshot(),
      moved:false
    };
    handle.setPointerCapture(e.pointerId);
  });

  title.addEventListener('click',e=>{
    e.stopPropagation();
    selectGroup();
  });

  title.addEventListener('dblclick',e=>{
    e.preventDefault();e.stopPropagation();
    selectGroup();
    requestAnimationFrame(()=>document.getElementById('groupTitle')?.focus());
  });

  const move=e=>{
    if(!action||action.id!==e.pointerId)return;
    const dx=(e.clientX-action.sx)/state.view.scale;
    const dy=(e.clientY-action.sy)/state.view.scale;
    if(Math.abs(dx)+Math.abs(dy)>3)action.moved=true;

    if(action.kind==='move'){
      group.x=Math.max(0,Math.min(WORKSPACE.width-group.w,snap(action.x+dx)));
      group.y=Math.max(0,Math.min(WORKSPACE.height-group.h,snap(action.y+dy)));
      el.style.left=`${group.x}px`;
      el.style.top=`${group.y}px`;
    }else{
      group.w=Math.max(220,Math.min(WORKSPACE.width-group.x,snap(action.w+dx)));
      group.h=Math.max(140,Math.min(WORKSPACE.height-group.y,snap(action.h+dy)));
      el.style.width=`${group.w}px`;
      el.style.height=`${group.h}px`;
    }
  };

  const up=e=>{
    if(!action||action.id!==e.pointerId)return;
    const current=action;
    action=null;
    try{
      const capturer=current.kind==='resize'?handle:title;
      if(capturer.hasPointerCapture(e.pointerId))capturer.releasePointerCapture(e.pointerId);
    }catch{}
    if(current.moved){
      pushUndoSnapshot(current.before);
      scheduleSave();
    }
    renderProperties();
  };

  title.addEventListener('pointermove',move);
  title.addEventListener('pointerup',up);
  title.addEventListener('pointercancel',up);
  handle.addEventListener('pointermove',move);
  handle.addEventListener('pointerup',up);
  handle.addEventListener('pointercancel',up);
}
function renderGroupVisual(group){
  const el=groupsLayer.querySelector(`[data-id="${group.id}"]`);
  if(!el)return;
  el.style.left=`${group.x}px`;el.style.top=`${group.y}px`;
  el.style.width=`${group.w}px`;el.style.height=`${group.h}px`;
  el.style.setProperty('--group-color',group.color);
  el.querySelector('.group-title-bar').textContent=group.title;
  scheduleSave();
}

function deleteSelectedGroup(){
  if(state.selectedGroupId==null)return;
  pushUndoSnapshot();
  state.groups=state.groups.filter(g=>g.id!==state.selectedGroupId);
  state.selectedGroupId=null;
  renderAll();scheduleSave();showToast('グループ枠を削除しました');
}

function diagramTitleBounds(){
  const title=(state.diagram?.title||'').trim();
  if(!title)return null;
  const w=Math.max(220,Math.min(1200,title.length*24+36));
  return{x:state.diagram.x,y:state.diagram.y,w,h:46};
}

function renderDiagramTitle(){
  diagramTitleLayer.innerHTML='';
  const title=(state.diagram?.title||'').trim();
  if(!title)return;
  const el=document.createElement('div');
  el.className='diagram-title-card';
  el.style.left=`${state.diagram.x}px`;
  el.style.top=`${state.diagram.y}px`;
  el.textContent=title;
  el.title='ドラッグで移動 / ダブルクリックで編集';
  diagramTitleLayer.appendChild(el);

  let drag=null;
  el.addEventListener('pointerdown',e=>{
    if(e.button!==0)return;
    e.preventDefault();e.stopPropagation();
    drag={id:e.pointerId,sx:e.clientX,sy:e.clientY,x:state.diagram.x,y:state.diagram.y,before:contentSnapshot(),moved:false};
    el.setPointerCapture(e.pointerId);
  });
  el.addEventListener('pointermove',e=>{
    if(!drag||drag.id!==e.pointerId)return;
    const dx=(e.clientX-drag.sx)/state.view.scale,dy=(e.clientY-drag.sy)/state.view.scale;
    if(Math.abs(dx)+Math.abs(dy)>3)drag.moved=true;
    const tb=diagramTitleBounds();
    state.diagram.x=Math.max(0,Math.min(WORKSPACE.width-(tb?.w||220),snap(drag.x+dx)));
    state.diagram.y=Math.max(0,Math.min(WORKSPACE.height-46,snap(drag.y+dy)));
    el.style.left=`${state.diagram.x}px`;el.style.top=`${state.diagram.y}px`;
  });
  el.addEventListener('pointerup',e=>{
    if(!drag||drag.id!==e.pointerId)return;
    const d=drag;drag=null;
    if(d.moved){pushUndoSnapshot(d.before);scheduleSave();}
  });
  el.addEventListener('dblclick',e=>{e.preventDefault();e.stopPropagation();showTitleModal();});
}

function layoutBoundsRaw(includeTitle=true){
  let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
  const include=(x,y,w,h)=>{
    minX=Math.min(minX,x);minY=Math.min(minY,y);
    maxX=Math.max(maxX,x+w);maxY=Math.max(maxY,y+h);
  };
  state.groups.forEach(g=>include(g.x,g.y,g.w,g.h));
  state.nodes.forEach(n=>{const s=cardSize(n);include(n.x,n.y,s.w,s.h);});
  if(includeTitle){
    const t=diagramTitleBounds();
    if(t)include(t.x,t.y,t.w,t.h);
  }
  if(minX===Infinity)return null;
  return{x:minX,y:minY,w:maxX-minX,h:maxY-minY,maxX,maxY};
}

function showTitleModal(){
  const current=state.diagram?.title||'';
  openModal('構成図タイトル',`
    <div class="mini-text">タイトルはキャンバス上に表示され、PNG出力にも含まれます。タイトル自体をドラッグして位置を変更できます。</div>
    <label class="form-label">タイトル</label>
    <input class="form-control" id="diagramTitleInput" maxlength="60" value="${escapeHtml(current)}" placeholder="例：My Desktop Setup">
    <div class="welcome-actions">
      <button class="btn primary" id="saveDiagramTitleBtn">反映</button>
      <button class="btn" id="clearDiagramTitleBtn">タイトルを消す</button>
    </div>
  `);
  modalDownloadLink.style.display='none';
  copyJsonBtn.hidden=true;

  const input=document.getElementById('diagramTitleInput');
  setTimeout(()=>input.focus(),0);

  document.getElementById('saveDiagramTitleBtn').onclick=()=>{
    const value=input.value.trim();
    const before=contentSnapshot();
    if(value && !state.diagram.title){
      const b=layoutBoundsRaw(false);
      if(b){
        state.diagram.x=Math.max(0,b.x);
        state.diagram.y=Math.max(0,b.y-80);
      }else{
        const r=viewport.getBoundingClientRect();
        const c=screenToWorld(r.left+r.width/2,r.top+r.height/2);
        state.diagram.x=Math.max(0,c.x-180);state.diagram.y=Math.max(0,c.y-80);
      }
    }
    state.diagram.title=value;
    if(before!==contentSnapshot())pushUndoSnapshot(before);
    renderDiagramTitle();scheduleSave();closeModal();
  };
  document.getElementById('clearDiagramTitleBtn').onclick=()=>{
    const before=contentSnapshot();
    state.diagram.title='';
    if(before!==contentSnapshot())pushUndoSnapshot(before);
    renderDiagramTitle();scheduleSave();closeModal();
  };
}

function renderSmartGuides(guideX,guideY){
  guidesLayer.innerHTML='';
  if(Number.isFinite(guideX)){
    const line=document.createElement('div');
    line.className='smart-guide vertical';
    line.style.left=`${guideX}px`;guidesLayer.appendChild(line);
  }
  if(Number.isFinite(guideY)){
    const line=document.createElement('div');
    line.className='smart-guide horizontal';
    line.style.top=`${guideY}px`;guidesLayer.appendChild(line);
  }
}

function clearSmartGuides(){guidesLayer.innerHTML='';}

function smartGuideCorrection(positions,dx,dy){
  if(!positions.length)return{dx,dy,guideX:null,guideY:null};
  const ids=new Set(positions.map(p=>p.id));
  let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
  positions.forEach(pos=>{
    const n=state.nodes.find(node=>node.id===pos.id);
    if(!n)return;
    const s=cardSize(n);
    minX=Math.min(minX,pos.x);minY=Math.min(minY,pos.y);
    maxX=Math.max(maxX,pos.x+s.w);maxY=Math.max(maxY,pos.y+s.h);
  });
  if(minX===Infinity)return{dx,dy,guideX:null,guideY:null};

  const movingX=[minX+dx,(minX+maxX)/2+dx,maxX+dx];
  const movingY=[minY+dy,(minY+maxY)/2+dy,maxY+dy];
  const targetX=[],targetY=[];
  state.nodes.filter(n=>!ids.has(n.id)).forEach(n=>{
    const s=cardSize(n);
    targetX.push(n.x,n.x+s.w/2,n.x+s.w);
    targetY.push(n.y,n.y+s.h/2,n.y+s.h);
  });
  const threshold=8/state.view.scale;
  let bestX=null,bestY=null;
  movingX.forEach(mx=>targetX.forEach(tx=>{
    const diff=tx-mx;
    if(Math.abs(diff)<=threshold && (!bestX||Math.abs(diff)<Math.abs(bestX.diff)))bestX={diff,line:tx};
  }));
  movingY.forEach(my=>targetY.forEach(ty=>{
    const diff=ty-my;
    if(Math.abs(diff)<=threshold && (!bestY||Math.abs(diff)<Math.abs(bestY.diff)))bestY={diff,line:ty};
  }));
  return{
    dx:dx+(bestX?.diff||0),
    dy:dy+(bestY?.diff||0),
    guideX:bestX?.line??null,
    guideY:bestY?.line??null
  };
}

function renderAll(){
  renderGroups();
  renderEdges();
  renderNodes();
  renderDiagramTitle();
  renderProperties();
}

function getSelectedNodes(){
  const ids=new Set(state.selectedNodeIds||[]);
  return state.nodes.filter(n=>ids.has(n.id));
}

function isNodeSelected(id){
  return (state.selectedNodeIds||[]).includes(id);
}

function setSingleNodeSelection(id){
  state.selectedNodeId=id;
  state.selectedNodeIds=id==null?[]:[id];
  state.selectedEdgeId=null;
  state.selectedGroupId=null;
}

function clearNodeSelection(){
  state.selectedNodeId=null;
  state.selectedNodeIds=[];
}

function toggleNodeSelection(id){
  const ids=[...(state.selectedNodeIds||[])];
  const i=ids.indexOf(id);
  if(i>=0) ids.splice(i,1);
  else ids.push(id);
  state.selectedNodeIds=ids;
  state.selectedNodeId=ids.includes(id)?id:(ids[ids.length-1]??null);
  state.selectedEdgeId=null;
  state.selectedGroupId=null;
}

function syncNodeSelectionStyles(){
  nodesLayer.querySelectorAll('.node').forEach(el=>{
    const id = Number(el.dataset.id);
    el.classList.toggle('selected', isNodeSelected(id));
    el.classList.toggle('selected-primary', state.selectedNodeId === id);
    const node=state.nodes.find(n=>n.id===id);
    el.classList.toggle('locked', !!node?.locked);
    el.classList.toggle('connect-source', state.connectSourceId === id);
  });
}

function renderNodes(){
  nodesLayer.innerHTML = '';
  state.nodes.forEach(node=>{
    const s = cardSize(node);
    const el = document.createElement('div');
    el.className = 'node size-' + node.size +
      (isNodeSelected(node.id) ? ' selected' : '') +
      (state.selectedNodeId === node.id ? ' selected-primary' : '') +
      (node.locked ? ' locked' : '') +
      (state.connectSourceId === node.id ? ' connect-source' : '');
    el.dataset.id = node.id;
    el.style.setProperty('--cat-color',deviceAccent(node.type));
    el.style.left = `${node.x}px`;
    el.style.top = `${node.y}px`;
    el.style.width = `${s.w}px`;
    el.style.height = `${s.h}px`;
    el.innerHTML = `
      <div class="node-head">
        <div class="node-icon">${iconSvg(nodeIconKey(node),'node-svg')}</div>
        <div class="node-content">
          <div class="node-title">${escapeHtml(node.name)}</div>
          <div class="node-type">${escapeHtml(node.type)}</div>
          <div class="node-model">${escapeHtml(node.model)}</div>
        </div>
      </div>
      <div class="node-note">${escapeHtml(node.note)}</div>
      ${node.locked?'<div class="lock-badge" title="固定中">LOCK</div>':''}
    `;
    bindNodeDrag(el,node);
    nodesLayer.appendChild(el);
  });
}

function bindNodeDrag(el,node){
  let drag = null;

  el.addEventListener('pointerdown', e=>{
    if(state.connectMode){
      e.stopPropagation();
      handleConnectNode(node.id);
      return;
    }
    if(e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();

    if(e.shiftKey){
      toggleNodeSelection(node.id);
      syncNodeSelectionStyles();
      renderProperties();
      return;
    }

    if(!isNodeSelected(node.id)){
      setSingleNodeSelection(node.id);
    }else{
      state.selectedNodeId=node.id;
      state.selectedEdgeId=null;
    }
    syncNodeSelectionStyles();
    renderProperties();

    if(node.locked) return;

    const movable=getSelectedNodes().filter(n=>!n.locked);
    const positions=movable.map(n=>({id:n.id,x:n.x,y:n.y}));
    drag={
      id:e.pointerId,
      sx:e.clientX,sy:e.clientY,
      moved:false,
      before:contentSnapshot(),
      positions
    };
    el.setPointerCapture(e.pointerId);
  });

  el.addEventListener('pointermove', e=>{
    if(!drag || drag.id !== e.pointerId) return;
    let dx=(e.clientX-drag.sx)/state.view.scale;
    let dy=(e.clientY-drag.sy)/state.view.scale;
    if(Math.abs(dx)+Math.abs(dy)>3) drag.moved=true;
    const guided=smartGuideCorrection(drag.positions,dx,dy);
    dx=guided.dx;dy=guided.dy;
    renderSmartGuides(guided.guideX,guided.guideY);

    drag.positions.forEach(pos=>{
      const target=state.nodes.find(n=>n.id===pos.id);
      if(!target)return;
      const s=cardSize(target);
      const nextX=Number.isFinite(guided.guideX)?pos.x+dx:snap(pos.x+dx);
      const nextY=Number.isFinite(guided.guideY)?pos.y+dy:snap(pos.y+dy);
      target.x=Math.max(0,Math.min(WORKSPACE.width-s.w,nextX));
      target.y=Math.max(0,Math.min(WORKSPACE.height-s.h,nextY));
      const targetEl=nodesLayer.querySelector(`[data-id="${target.id}"]`);
      if(targetEl){
        targetEl.style.left=`${target.x}px`;
        targetEl.style.top=`${target.y}px`;
      }
    });
    renderEdges();
  });

  el.addEventListener('pointerup', e=>{
    if(!drag || drag.id !== e.pointerId) return;
    if(el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    const changed=drag.moved;
    const before=drag.before;
    drag=null;
    clearSmartGuides();
    if(changed){pushUndoSnapshot(before);scheduleSave();}
  });
}

function handleConnectNode(nodeId){
  if(state.connectSourceId == null){
    state.connectSourceId = nodeId;
    renderNodes();
    return;
  }
  if(state.connectSourceId === nodeId){
    state.connectSourceId = null;
    renderNodes();
    return;
  }
  pushUndoSnapshot();
  const edge = {
    id:`e${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
    from:state.connectSourceId,
    to:nodeId,
    type:'USB-C',
    label:'USB-C',
    labelPos:.5,
    style:'curve',
    bend:.5,
    fromSide:'auto',
    toSide:'auto'
  };
  state.edges.push(edge);
  state.selectedEdgeId = edge.id;
  state.selectedGroupId = null;
  clearNodeSelection();
  state.connectMode = false;
  state.connectSourceId = null;
  connectBtn.classList.remove('primary');
  connectBtn.textContent = '機器を接続';
  renderAll();
  scheduleSave();
}

function nodeCenter(node){
  const s = cardSize(node);
  return {x:node.x+s.w/2,y:node.y+s.h/2};
}

function autoSide(node,other){
  const a=nodeCenter(node), b=nodeCenter(other);
  const dx=b.x-a.x, dy=b.y-a.y;
  return Math.abs(dx)>=Math.abs(dy)
    ? (dx>=0?'right':'left')
    : (dy>=0?'bottom':'top');
}

function anchor(node,side){
  const s=cardSize(node), c=nodeCenter(node);
  if(side==='left') return {x:node.x,y:c.y};
  if(side==='right') return {x:node.x+s.w,y:c.y};
  if(side==='top') return {x:c.x,y:node.y};
  return {x:c.x,y:node.y+s.h};
}

function pointAlongPolyline(points,t){
  const lengths=[];
  let total=0;
  for(let i=0;i<points.length-1;i++){
    const len=Math.hypot(points[i+1].x-points[i].x,points[i+1].y-points[i].y);
    lengths.push(len);total+=len;
  }
  if(total<=0)return points[0];
  let target=Math.max(0,Math.min(1,t))*total;
  for(let i=0;i<lengths.length;i++){
    if(target<=lengths[i]){
      const r=lengths[i]?target/lengths[i]:0;
      return {
        x:points[i].x+(points[i+1].x-points[i].x)*r,
        y:points[i].y+(points[i+1].y-points[i].y)*r
      };
    }
    target-=lengths[i];
  }
  return points[points.length-1];
}

function sideVector(side){
  if(side==='left')return{x:-1,y:0};
  if(side==='right')return{x:1,y:0};
  if(side==='top')return{x:0,y:-1};
  if(side==='bottom')return{x:0,y:1};
  return{x:1,y:0};
}

function curveControlPoints(p1,p2,fromSide,toSide,bend){
  const v1=sideVector(fromSide),v2=sideVector(toSide);
  const distance=Math.max(80,Math.hypot(p2.x-p1.x,p2.y-p1.y));
  const strength=Math.max(.15,Math.min(.85,Number.isFinite(+bend)?+bend:.5));
  const offset=Math.max(35,distance*(.18+strength*.48));
  return{
    c1:{x:p1.x+v1.x*offset,y:p1.y+v1.y*offset},
    c2:{x:p2.x+v2.x*offset,y:p2.y+v2.y*offset}
  };
}

function edgeLabelPoint(edge){
  const a=state.nodes.find(n=>n.id===edge.from);
  const b=state.nodes.find(n=>n.id===edge.to);
  if(!a||!b)return{x:0,y:0};
  const fromSide=edge.fromSide==='auto'?autoSide(a,b):edge.fromSide;
  const toSide=edge.toSide==='auto'?autoSide(b,a):edge.toSide;
  const p1=anchor(a,fromSide),p2=anchor(b,toSide);
  const t=Math.max(.08,Math.min(.92,Number.isFinite(+edge.labelPos)?+edge.labelPos:.5));

  if(edge.style==='straight'){
    return{x:p1.x+(p2.x-p1.x)*t,y:p1.y+(p2.y-p1.y)*t};
  }

  if(edge.style==='curve'){
    const {c1,c2}=curveControlPoints(p1,p2,fromSide,toSide,edge.bend);
    const u=1-t;
    return{
      x:u*u*u*p1.x+3*u*u*t*c1.x+3*u*t*t*c2.x+t*t*t*p2.x,
      y:u*u*u*p1.y+3*u*u*t*c1.y+3*u*t*t*c2.y+t*t*t*p2.y
    };
  }

  const horizontal=fromSide==='left'||fromSide==='right';
  const bend=Math.max(.15,Math.min(.85,+edge.bend||.5));
  let points;
  if(horizontal){
    const mx=Math.round((p1.x+(p2.x-p1.x)*bend)/GRID)*GRID;
    points=[p1,{x:mx,y:p1.y},{x:mx,y:p2.y},p2];
  }else{
    const my=Math.round((p1.y+(p2.y-p1.y)*bend)/GRID)*GRID;
    points=[p1,{x:p1.x,y:my},{x:p2.x,y:my},p2];
  }
  return pointAlongPolyline(points,t);
}

function edgeGeometry(edge){
  const a=state.nodes.find(n=>n.id===edge.from);
  const b=state.nodes.find(n=>n.id===edge.to);
  if(!a||!b) return null;

  const fromSide=edge.fromSide==='auto'?autoSide(a,b):edge.fromSide;
  const toSide=edge.toSide==='auto'?autoSide(b,a):edge.toSide;
  const p1=anchor(a,fromSide), p2=anchor(b,toSide);
  const lp=edgeLabelPoint(edge);

  if(edge.style==='straight'){
    return {d:`M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`,label:{x:lp.x,y:lp.y-9}};
  }

  if(edge.style==='curve'){
    const {c1,c2}=curveControlPoints(p1,p2,fromSide,toSide,edge.bend);
    return {
      d:`M ${p1.x} ${p1.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${p2.x} ${p2.y}`,
      label:{x:lp.x,y:lp.y-9}
    };
  }

  const horizontal = fromSide==='left' || fromSide==='right';
  const bend=Math.max(.15,Math.min(.85,+edge.bend||.5));
  if(horizontal){
    const mx=Math.round((p1.x+(p2.x-p1.x)*bend)/GRID)*GRID;
    return {
      d:`M ${p1.x} ${p1.y} L ${mx} ${p1.y} L ${mx} ${p2.y} L ${p2.x} ${p2.y}`,
      label:{x:lp.x,y:lp.y-9}
    };
  }
  const my=Math.round((p1.y+(p2.y-p1.y)*bend)/GRID)*GRID;
  return {
    d:`M ${p1.x} ${p1.y} L ${p1.x} ${my} L ${p2.x} ${my} L ${p2.x} ${p2.y}`,
    label:{x:lp.x,y:lp.y-9}
  };
}

function renderEdges(){
  linksLayer.innerHTML='';
  state.edges.forEach(edge=>{
    const geometry=edgeGeometry(edge);
    if(!geometry) return;
    const cable=CABLES[edge.type] || CABLES.Other;

    const hit=document.createElementNS('http://www.w3.org/2000/svg','path');
    hit.setAttribute('d',geometry.d);
    hit.setAttribute('class','edge-hit');
    hit.addEventListener('pointerdown', e=>e.stopPropagation());
    hit.addEventListener('click', e=>{
      e.stopPropagation();
      state.selectedEdgeId=edge.id;
      state.selectedGroupId=null;
      clearNodeSelection();
      renderAll();
    });
    linksLayer.appendChild(hit);

    const visible=document.createElementNS('http://www.w3.org/2000/svg','path');
    visible.setAttribute('d',geometry.d);
    visible.setAttribute('stroke',cable.color);
    visible.setAttribute('class','edge-visible'+
      (state.selectedEdgeId===edge.id?' edge-selected':'')+
      (cable.dash?' edge-dashed':''));
    linksLayer.appendChild(visible);

    const text=document.createElementNS('http://www.w3.org/2000/svg','text');
    text.setAttribute('x',geometry.label.x);
    text.setAttribute('y',geometry.label.y);
    text.setAttribute('class','edge-label');
    text.textContent=edge.label || edge.type;
    text.addEventListener('pointerdown',e=>e.stopPropagation());
    text.addEventListener('click',e=>{
      e.stopPropagation();
      state.selectedEdgeId=edge.id;
      state.selectedGroupId=null;
      clearNodeSelection();
      renderAll();
    });
    linksLayer.appendChild(text);
  });
}

function updateNodeVisual(node){
  const el=nodesLayer.querySelector(`[data-id="${node.id}"]`);
  if(!el) return;
  const s=cardSize(node);
  el.classList.remove('size-small','size-medium','size-large','size-xlarge');
  el.classList.add(`size-${node.size}`);
  el.style.width=`${s.w}px`;
  el.style.height=`${s.h}px`;
  el.style.setProperty('--cat-color',deviceAccent(node.type));
  el.querySelector('.node-icon').innerHTML=iconSvg(nodeIconKey(node),'node-svg');
  el.querySelector('.node-title').textContent=node.name;
  el.querySelector('.node-type').textContent=node.type;
  el.querySelector('.node-model').textContent=node.model;
  el.querySelector('.node-note').textContent=node.note;
  renderEdges();
  scheduleSave();
}

function optionList(values,current,labels=null){
  return values.map(v=>`<option value="${escapeHtml(v)}" ${v===current?'selected':''}>${escapeHtml(labels?.[v]||v)}</option>`).join('');
}

function cableOptionGroups(current){
  return CABLE_GROUPS.map(group=>`
    <optgroup label="${escapeHtml(group.label)}">
      ${group.items.map(item=>`<option value="${escapeHtml(item)}" ${item===current?'selected':''}>${escapeHtml(item)}</option>`).join('')}
    </optgroup>
  `).join('');
}

function duplicateSelected(){
  const originals=getSelectedNodes();
  if(!originals.length)return;
  pushUndoSnapshot();

  const idMap=new Map();
  const clones=originals.map(node=>{
    const id=state.nextId++;
    idMap.set(node.id,id);
    const s=cardSize(node);
    return{
      ...node,
      id,
      x:Math.min(WORKSPACE.width-s.w,node.x+40),
      y:Math.min(WORKSPACE.height-s.h,node.y+40),
      locked:false
    };
  });

  const selectedSet=new Set(originals.map(n=>n.id));
  const edgeClones=state.edges
    .filter(e=>selectedSet.has(e.from)&&selectedSet.has(e.to))
    .map(e=>({
      ...e,
      id:`e${Date.now()}_${Math.random().toString(36).slice(2,7)}`,
      from:idMap.get(e.from),
      to:idMap.get(e.to)
    }));

  state.nodes.push(...clones);
  state.edges.push(...edgeClones);
  state.selectedNodeIds=clones.map(n=>n.id);
  state.selectedNodeId=clones[clones.length-1]?.id??null;
  state.selectedEdgeId=null;
  renderAll();scheduleSave();
  showToast(`${clones.length}台を複製しました`);
}

function setSelectedLocked(locked){
  const selected=getSelectedNodes();
  if(!selected.length)return;
  pushUndoSnapshot();
  selected.forEach(n=>n.locked=locked);
  renderAll();scheduleSave();
  showToast(locked?'固定しました':'固定を解除しました');
}

function alignSelected(mode){
  const nodes=getSelectedNodes().filter(n=>!n.locked);
  if(nodes.length<2){showToast('整列するには固定されていない機器を2台以上選択してください');return;}
  if((mode==='hspace'||mode==='vspace')&&nodes.length<3){showToast('等間隔には3台以上選択してください');return;}

  pushUndoSnapshot();

  if(mode==='left'){
    const x=Math.min(...nodes.map(n=>n.x));
    nodes.forEach(n=>n.x=snap(x));
  }else if(mode==='top'){
    const y=Math.min(...nodes.map(n=>n.y));
    nodes.forEach(n=>n.y=snap(y));
  }else if(mode==='hspace'){
    const sorted=[...nodes].sort((a,b)=>a.x-b.x);
    const left=Math.min(...sorted.map(n=>n.x));
    const right=Math.max(...sorted.map(n=>n.x+cardSize(n).w));
    const widths=sorted.reduce((sum,n)=>sum+cardSize(n).w,0);
    const gap=(right-left-widths)/(sorted.length-1);
    let x=left;
    sorted.forEach(n=>{n.x=snap(x);x+=cardSize(n).w+gap;});
  }else if(mode==='vspace'){
    const sorted=[...nodes].sort((a,b)=>a.y-b.y);
    const top=Math.min(...sorted.map(n=>n.y));
    const bottom=Math.max(...sorted.map(n=>n.y+cardSize(n).h));
    const heights=sorted.reduce((sum,n)=>sum+cardSize(n).h,0);
    const gap=(bottom-top-heights)/(sorted.length-1);
    let y=top;
    sorted.forEach(n=>{n.y=snap(y);y+=cardSize(n).h+gap;});
  }

  renderAll();scheduleSave();
}

function renderProperties(){
  const group=state.groups.find(g=>g.id===state.selectedGroupId);
  if(group){
    properties.className='';
    properties.innerHTML=`
      <div class="form-section">
        <h3>グループ枠</h3>
        <div class="selection-summary"><strong>選択中</strong>：${escapeHtml(group.title)}</div>
        <label class="form-label">グループ名</label>
        <input class="form-control" id="groupTitle" value="${escapeHtml(group.title)}">
        <div class="form-grid">
          <div>
            <label class="form-label">幅</label>
            <input class="form-control" id="groupWidth" type="number" min="220" max="3200" step="20" value="${Math.round(group.w)}">
          </div>
          <div>
            <label class="form-label">高さ</label>
            <input class="form-control" id="groupHeight" type="number" min="140" max="2200" step="20" value="${Math.round(group.h)}">
          </div>
        </div>
        <label class="form-label">アクセント色</label>
        <input class="form-control color-control" id="groupColor" type="color" value="${escapeHtml(group.color)}">
        <div class="mini-text" style="margin-top:8px">見出し部分をクリックして編集、ドラッグして移動できます。枠の内側はカード操作を優先し、右下のハンドルでサイズ変更できます。</div>
      </div>
      <button class="btn danger" id="deleteGroupBtn" style="width:100%">グループ枠を削除</button>
    `;
    bindTrackedText(document.getElementById('groupTitle'),e=>{group.title=e.target.value;renderGroupVisual(group)});
    const updateSize=()=>{
      group.w=Math.max(220,Math.min(WORKSPACE.width-group.x,+document.getElementById('groupWidth').value||group.w));
      group.h=Math.max(140,Math.min(WORKSPACE.height-group.y,+document.getElementById('groupHeight').value||group.h));
      renderGroupVisual(group);
    };
    const widthEl=document.getElementById('groupWidth'),heightEl=document.getElementById('groupHeight');
    [widthEl,heightEl].forEach(el=>{
      el.addEventListener('focus',()=>beginTrackedEdit(el));
      el.addEventListener('change',()=>{updateSize();endTrackedEdit(el)});
      el.addEventListener('blur',()=>endTrackedEdit(el));
    });
    const colorEl=document.getElementById('groupColor');
    colorEl.addEventListener('focus',()=>beginTrackedEdit(colorEl));
    colorEl.addEventListener('input',()=>{group.color=colorEl.value;renderGroupVisual(group)});
    colorEl.addEventListener('change',()=>endTrackedEdit(colorEl));
    colorEl.addEventListener('blur',()=>endTrackedEdit(colorEl));
    document.getElementById('deleteGroupBtn').onclick=deleteSelectedGroup;
    return;
  }

  const edge=state.edges.find(e=>e.id===state.selectedEdgeId);
  if(edge){
    properties.className='';
    const a=state.nodes.find(n=>n.id===edge.from);
    const b=state.nodes.find(n=>n.id===edge.to);
    properties.innerHTML=`
      <div class="form-section">
        <h3>ケーブル</h3>
        <div class="mini-text">${escapeHtml(a?.name)} → ${escapeHtml(b?.name)}</div>
        <label class="form-label">接続種類</label>
        <select class="form-control" id="edgeType">${cableOptionGroups(edge.type)}</select>
        <label class="form-label">表示ラベル</label>
        <input class="form-control" id="edgeLabel" value="${escapeHtml(edge.label)}">
        <label class="form-label">ラベル位置</label>
        <input class="form-control" id="edgeLabelPos" type="range" min="8" max="92" value="${Math.round((edge.labelPos??.5)*100)}">
        <div class="range-caption"><span>接続元</span><span id="labelPosValue">${Math.round((edge.labelPos??.5)*100)}%</span><span>接続先</span></div>
        <label class="form-label">線の形</label>
        <select class="form-control" id="edgeStyle">
          ${optionList(['curve','orthogonal','straight'],edge.style,{curve:'カーブ',orthogonal:'直角',straight:'直線'})}
        </select>
        <div id="edgeBendWrap">
          <label class="form-label" id="edgeBendLabel">${edge.style==='curve'?'カーブのふくらみ':'曲がる位置'}</label>
          <input class="form-control" id="edgeBend" type="range" min="15" max="85" value="${Math.round(edge.bend*100)}">
        </div>
        <div class="form-grid">
          <div>
            <label class="form-label">接続元</label>
            <select class="form-control" id="fromSide">${sideOptions(edge.fromSide)}</select>
          </div>
          <div>
            <label class="form-label">接続先</label>
            <select class="form-control" id="toSide">${sideOptions(edge.toSide)}</select>
          </div>
        </div>
      </div>
      <button class="btn danger" id="deleteEdgeBtn" style="width:100%">ケーブル削除</button>
    `;

    const typeEl=document.getElementById('edgeType');
    const labelEl=document.getElementById('edgeLabel');
    typeEl.addEventListener('change',()=>{
      pushUndoSnapshot();
      edge.type=typeEl.value;
      edge.label=edge.type;
      labelEl.value=edge.label;
      renderEdges();scheduleSave();
    });
    bindTrackedText(labelEl,()=>{edge.label=labelEl.value;renderEdges();scheduleSave()});

    const labelPosEl=document.getElementById('edgeLabelPos');
    labelPosEl.addEventListener('focus',()=>beginTrackedEdit(labelPosEl));
    labelPosEl.addEventListener('pointerdown',()=>beginTrackedEdit(labelPosEl));
    labelPosEl.addEventListener('input',e=>{
      edge.labelPos=+e.target.value/100;
      document.getElementById('labelPosValue').textContent=`${e.target.value}%`;
      renderEdges();scheduleSave();
    });
    labelPosEl.addEventListener('change',()=>endTrackedEdit(labelPosEl));
    labelPosEl.addEventListener('blur',()=>endTrackedEdit(labelPosEl));

    const styleEl=document.getElementById('edgeStyle');
    const bendWrap=document.getElementById('edgeBendWrap');
    const bendLabel=document.getElementById('edgeBendLabel');
    const syncBendUi=()=>{
      bendWrap.style.display=edge.style==='straight'?'none':'block';
      bendLabel.textContent=edge.style==='curve'?'カーブのふくらみ':'曲がる位置';
    };
    syncBendUi();

    styleEl.addEventListener('change',e=>{
      pushUndoSnapshot();
      edge.style=e.target.value;
      syncBendUi();
      renderEdges();scheduleSave();
    });

    const bendEl=document.getElementById('edgeBend');
    bendEl.addEventListener('focus',()=>beginTrackedEdit(bendEl));
    bendEl.addEventListener('pointerdown',()=>beginTrackedEdit(bendEl));
    bendEl.addEventListener('input',e=>{edge.bend=+e.target.value/100;renderEdges();scheduleSave()});
    bendEl.addEventListener('change',()=>endTrackedEdit(bendEl));
    bendEl.addEventListener('blur',()=>endTrackedEdit(bendEl));

    document.getElementById('fromSide').addEventListener('change',e=>{
      pushUndoSnapshot();edge.fromSide=e.target.value;renderEdges();scheduleSave();
    });
    document.getElementById('toSide').addEventListener('change',e=>{
      pushUndoSnapshot();edge.toSide=e.target.value;renderEdges();scheduleSave();
    });
    document.getElementById('deleteEdgeBtn').addEventListener('click',deleteSelection);
    return;
  }

  const selected=getSelectedNodes();
  if(selected.length>1){
    const lockedCount=selected.filter(n=>n.locked).length;
    properties.className='';
    properties.innerHTML=`
      <div class="form-section">
        <h3>複数選択</h3>
        <div class="selection-summary"><strong>${selected.length}台</strong>を選択中</div>
        <div class="mini-text">Shift+クリックで選択を追加・解除できます。</div>
      </div>
      <div class="form-section">
        <h3>操作</h3>
        <div class="action-grid">
          <button class="btn" id="duplicateSelectedBtn">複製</button>
          <button class="btn" id="lockSelectedBtn">固定</button>
          <button class="btn" id="unlockSelectedBtn">固定解除</button>
          <button class="btn danger" id="deleteSelectedBtn">削除</button>
        </div>
        <div class="mini-text" style="margin-top:8px">${lockedCount?`${lockedCount}台が固定中。固定済みカードはドラッグ・整列では動きません。`:'固定すると誤ドラッグを防げます。'}</div>
      </div>
      <div class="form-section">
        <h3>整列</h3>
        <div class="action-grid">
          <button class="btn" id="alignLeftBtn">左揃え</button>
          <button class="btn" id="alignTopBtn">上揃え</button>
          <button class="btn" id="spaceHBtn">横等間隔</button>
          <button class="btn" id="spaceVBtn">縦等間隔</button>
        </div>
      </div>
    `;
    document.getElementById('duplicateSelectedBtn').onclick=duplicateSelected;
    document.getElementById('lockSelectedBtn').onclick=()=>setSelectedLocked(true);
    document.getElementById('unlockSelectedBtn').onclick=()=>setSelectedLocked(false);
    document.getElementById('deleteSelectedBtn').onclick=deleteSelection;
    document.getElementById('alignLeftBtn').onclick=()=>alignSelected('left');
    document.getElementById('alignTopBtn').onclick=()=>alignSelected('top');
    document.getElementById('spaceHBtn').onclick=()=>alignSelected('hspace');
    document.getElementById('spaceVBtn').onclick=()=>alignSelected('vspace');
    return;
  }

  const node=selected[0] || state.nodes.find(n=>n.id===state.selectedNodeId);
  if(!node){
    properties.className='properties-empty';
    properties.textContent='機器またはケーブルを選択してください。';
    return;
  }
  properties.className='';
  properties.innerHTML=`
    <div class="form-section">
      <h3>機器</h3>
      <label class="form-label">表示名</label>
      <input class="form-control" id="nodeName" value="${escapeHtml(node.name)}">
      <label class="form-label">種類</label>
      <select class="form-control" id="nodeType">${optionList(DEVICE_TYPES.map(d=>d.type),node.type)}</select>
      <label class="form-label">型番</label>
      <input class="form-control" id="nodeModel" value="${escapeHtml(node.model)}">
      <label class="form-label">カードサイズ</label>
      <select class="form-control" id="nodeSize">
        ${optionList(['small','medium','large','xlarge'],node.size,{small:'小',medium:'中',large:'大',xlarge:'特大'})}
      </select>
      <label class="form-label">メモ</label>
      <textarea class="form-control" id="nodeNote" rows="2">${escapeHtml(node.note)}</textarea>
    </div>
    <div class="action-grid single-actions">
      <button class="btn" id="duplicateNodeBtn">複製</button>
      <button class="btn" id="lockNodeBtn">${node.locked?'固定解除':'固定'}</button>
    </div>
    <button class="btn danger" id="deleteNodeBtn" style="width:100%;margin-top:8px">機器削除</button>
  `;

  bindTrackedText(document.getElementById('nodeName'),e=>{node.name=e.target.value;updateNodeVisual(node)});
  bindTrackedText(document.getElementById('nodeModel'),e=>{node.model=e.target.value;updateNodeVisual(node)});
  bindTrackedText(document.getElementById('nodeNote'),e=>{node.note=e.target.value;updateNodeVisual(node)});

  document.getElementById('nodeSize').addEventListener('change',e=>{
    pushUndoSnapshot();node.size=e.target.value;updateNodeVisual(node);
  });
  document.getElementById('nodeType').addEventListener('change',e=>{
    pushUndoSnapshot();
    const type=DEVICE_TYPES.find(d=>d.type===e.target.value);
    node.type=type.type;node.iconKey=type.iconKey;updateNodeVisual(node);
  });
  document.getElementById('duplicateNodeBtn').onclick=duplicateSelected;
  document.getElementById('lockNodeBtn').onclick=()=>setSelectedLocked(!node.locked);
  document.getElementById('deleteNodeBtn').addEventListener('click',deleteSelection);
}

function deleteSelection(){
  if(state.selectedGroupId!=null){
    deleteSelectedGroup();
    return;
  }
  if(state.selectedEdgeId){
    pushUndoSnapshot();
    state.edges=state.edges.filter(e=>e.id!==state.selectedEdgeId);
    state.selectedEdgeId=null;
    renderAll();scheduleSave();showToast('ケーブルを削除しました');
    return;
  }

  const ids=new Set(state.selectedNodeIds||[]);
  if(ids.size){
    pushUndoSnapshot();
    state.nodes=state.nodes.filter(n=>!ids.has(n.id));
    state.edges=state.edges.filter(e=>!ids.has(e.from)&&!ids.has(e.to));
    clearNodeSelection();
    renderAll();scheduleSave();
    showToast(`${ids.size}台を削除しました`);
  }
}

function sideOptions(current){
  const labels={auto:'自動',left:'左',right:'右',top:'上',bottom:'下'};
  return optionList(['auto','left','right','top','bottom'],current,labels);
}

function applyView(){
  world.style.transform=`translate(${state.view.x}px,${state.view.y}px) scale(${state.view.scale})`;
  resetZoomBtn.textContent=`${Math.round(state.view.scale*100)}%`;
}

function screenToWorld(clientX,clientY){
  const r=viewport.getBoundingClientRect();
  return {
    x:(clientX-r.left-state.view.x)/state.view.scale,
    y:(clientY-r.top-state.view.y)/state.view.scale
  };
}

function zoomAt(clientX,clientY,targetScale){
  const r=viewport.getBoundingClientRect();
  const mx=clientX-r.left,my=clientY-r.top;
  const wx=(mx-state.view.x)/state.view.scale;
  const wy=(my-state.view.y)/state.view.scale;
  const scale=Math.max(.35,Math.min(2.25,targetScale));
  state.view.x=mx-wx*scale;
  state.view.y=my-wy*scale;
  state.view.scale=scale;
  applyView();
  scheduleSave();
}

function zoomAtCenter(targetScale){
  const r=viewport.getBoundingClientRect();
  zoomAt(r.left+r.width/2,r.top+r.height/2,targetScale);
}

function centerWorkspace(){
  const r=viewport.getBoundingClientRect();
  state.view.scale=1;
  state.view.x=r.width/2-WORKSPACE.width/2;
  state.view.y=r.height/2-WORKSPACE.height/2;
  applyView();
}

function fitAll(){
  const b=layoutBoundsRaw(true);
  if(!b){centerWorkspace();return}
  const pad=90;
  const minX=b.x-pad,minY=b.y-pad,maxX=b.maxX+pad,maxY=b.maxY+pad;
  const bw=Math.max(1,maxX-minX),bh=Math.max(1,maxY-minY);
  const r=viewport.getBoundingClientRect();
  const scale=Math.max(.35,Math.min(1.35,Math.min(r.width/bw,r.height/bh)));
  state.view.scale=scale;
  state.view.x=(r.width-bw*scale)/2-minX*scale;
  state.view.y=(r.height-bh*scale)/2-minY*scale;
  applyView();
  scheduleSave();
}

function pointSegDist(px,py,x1,y1,x2,y2){
  const vx=x2-x1,vy=y2-y1,wx=px-x1,wy=py-y1;
  const c1=vx*wx+vy*wy;
  if(c1<=0)return Math.hypot(px-x1,py-y1);
  const c2=vx*vx+vy*vy;
  if(c2<=c1)return Math.hypot(px-x2,py-y2);
  const t=c1/c2,qx=x1+t*vx,qy=y1+t*vy;
  return Math.hypot(px-qx,py-qy);
}

function edgeSegments(edge){
  const a=state.nodes.find(n=>n.id===edge.from);
  const b=state.nodes.find(n=>n.id===edge.to);
  if(!a||!b)return[];
  const fs=edge.fromSide==='auto'?autoSide(a,b):edge.fromSide;
  const ts=edge.toSide==='auto'?autoSide(b,a):edge.toSide;
  const p1=anchor(a,fs),p2=anchor(b,ts);

  if(edge.style==='straight')return[[p1.x,p1.y,p2.x,p2.y]];
  if(edge.style==='orthogonal'){
    const horizontal=fs==='left'||fs==='right';
    const bend=Math.max(.15,Math.min(.85,+edge.bend||.5));
    if(horizontal){
      const mx=Math.round((p1.x+(p2.x-p1.x)*bend)/GRID)*GRID;
      return[[p1.x,p1.y,mx,p1.y],[mx,p1.y,mx,p2.y],[mx,p2.y,p2.x,p2.y]];
    }
    const my=Math.round((p1.y+(p2.y-p1.y)*bend)/GRID)*GRID;
    return[[p1.x,p1.y,p1.x,my],[p1.x,my,p2.x,my],[p2.x,my,p2.x,p2.y]];
  }

  const dx=Math.max(50,Math.abs(p2.x-p1.x)*.45),sign=p2.x>=p1.x?1:-1;
  const c1={x:p1.x+dx*sign,y:p1.y},c2={x:p2.x-dx*sign,y:p2.y},pts=[];
  for(let i=0;i<=28;i++){
    const t=i/28,u=1-t;
    pts.push({
      x:u*u*u*p1.x+3*u*u*t*c1.x+3*u*t*t*c2.x+t*t*t*p2.x,
      y:u*u*u*p1.y+3*u*u*t*c1.y+3*u*t*t*c2.y+t*t*t*p2.y
    });
  }
  return pts.slice(0,-1).map((p,i)=>[p.x,p.y,pts[i+1].x,pts[i+1].y]);
}

function nearestEdgeAt(x,y,maxDistance){
  let best=null,bestD=maxDistance;
  state.edges.forEach(edge=>{
    edgeSegments(edge).forEach(seg=>{
      const d=pointSegDist(x,y,...seg);
      if(d<bestD){bestD=d;best=edge}
    });
  });
  return best;
}

viewport.addEventListener('selectstart',e=>e.preventDefault());
viewport.addEventListener('pointerdown',e=>{
  if(state.connectMode)return;
  if(e.button!==0&&e.button!==1)return;
  if(e.target.closest('.node'))return;
  if(e.target.closest('.group-frame')||e.target.closest('.diagram-title-card'))return;
  if(e.target.closest('.view-controls'))return;
  if(e.target.classList.contains('edge-hit')||e.target.classList.contains('edge-label'))return;

  e.preventDefault();
  panState={id:e.pointerId,sx:e.clientX,sy:e.clientY,ox:state.view.x,oy:state.view.y,moved:false};
  viewport.setPointerCapture(e.pointerId);
  viewport.classList.add('panning');
});

viewport.addEventListener('pointermove',e=>{
  if(!panState||panState.id!==e.pointerId)return;
  const dx=e.clientX-panState.sx,dy=e.clientY-panState.sy;
  if(Math.abs(dx)+Math.abs(dy)>3)panState.moved=true;
  state.view.x=panState.ox+dx;
  state.view.y=panState.oy+dy;
  applyView();
});

viewport.addEventListener('pointerup',e=>{
  if(!panState||panState.id!==e.pointerId)return;
  const moved=panState.moved;
  if(viewport.hasPointerCapture(e.pointerId))viewport.releasePointerCapture(e.pointerId);
  panState=null;
  viewport.classList.remove('panning');
  if(moved){scheduleSave();return}

  const p=screenToWorld(e.clientX,e.clientY);
  const edge=nearestEdgeAt(p.x,p.y,16/state.view.scale);
  if(edge){
    state.selectedEdgeId=edge.id;
    state.selectedGroupId=null;
    clearNodeSelection();
    renderAll();
  }else{
    state.selectedEdgeId=null;
    state.selectedGroupId=null;
    clearNodeSelection();
    renderAll();
  }
});

viewport.addEventListener('wheel',e=>{
  e.preventDefault();
  const factor=e.deltaY<0?1.08:.92;
  zoomAt(e.clientX,e.clientY,state.view.scale*factor);
},{passive:false});

viewControls.addEventListener('pointerdown',e=>e.stopPropagation());
viewControls.addEventListener('click',e=>e.stopPropagation());

zoomOutBtn.addEventListener('click',()=>zoomAtCenter(state.view.scale/1.2));
zoomInBtn.addEventListener('click',()=>zoomAtCenter(state.view.scale*1.2));
resetZoomBtn.addEventListener('click',()=>zoomAtCenter(1));
fitBtn.addEventListener('click',fitAll);

window.addEventListener('keydown',e=>{
  if(exportModal.classList.contains('show'))return;
  if(['INPUT','TEXTAREA','SELECT'].includes(e.target?.tagName))return;
  const mod=e.ctrlKey||e.metaKey;
  if(mod && !e.shiftKey && e.key.toLowerCase()==='z'){e.preventDefault();undo()}
  else if((mod && e.key.toLowerCase()==='y') || (mod && e.shiftKey && e.key.toLowerCase()==='z')){e.preventDefault();redo()}
  else if(mod&&e.key.toLowerCase()==='d'){e.preventDefault();duplicateSelected()}
  else if(mod&&e.key==='0'){e.preventDefault();zoomAtCenter(1)}
  else if(e.key==='Delete'){e.preventDefault();deleteSelection()}
  else if(e.key==='+'||e.key==='='){e.preventDefault();zoomAtCenter(state.view.scale*1.2)}
  else if(e.key==='-'){e.preventDefault();zoomAtCenter(state.view.scale/1.2)}
  else if(e.key==='Home'){e.preventDefault();fitAll()}
});

undoBtn.addEventListener('click',undo);
redoBtn.addEventListener('click',redo);
addGroupBtn.addEventListener('click',addGroup);
titleBtn.addEventListener('click',showTitleModal);

connectBtn.addEventListener('click',()=>{
  state.connectMode=!state.connectMode;
  state.connectSourceId=null;
  state.selectedEdgeId=null;
  state.selectedGroupId=null;
  connectBtn.classList.toggle('primary',state.connectMode);
  connectBtn.textContent=state.connectMode?'接続モード ON':'機器を接続';
  renderNodes();
  renderProperties();
});

toggleLeftBtn.addEventListener('click',()=>{
  app.classList.toggle('hide-left');
  requestAnimationFrame(applyView);
});
toggleRightBtn.addEventListener('click',()=>{
  app.classList.toggle('hide-right');
  requestAnimationFrame(applyView);
});

newBtn.addEventListener('click',()=>{
  if(!confirm('現在の構成を消して、空のキャンバスから新規作成しますか？'))return;
  pushUndoSnapshot();
  applyImportedState(makeBlank());
  requestAnimationFrame(()=>{centerWorkspace();scheduleSave()});
});

sampleBtn.addEventListener('click',()=>{
  if(!confirm('現在の構成をサンプル構成に置き換えますか？'))return;
  pushUndoSnapshot();
  applyImportedState(makeSample());
  requestAnimationFrame(()=>{centerWorkspace();scheduleSave()});
});

function openModal(title,html){
  modalTitle.textContent=title;
  modalContent.innerHTML=html;
  modalDownloadLink.style.display='inline-flex';
  copyJsonBtn.hidden=true;
  exportModal.classList.add('show');
}
function closeModal(){
  exportModal.classList.remove('show');
  modalContent.innerHTML='';
  modalDownloadLink.style.display='inline-flex';
  copyJsonBtn.hidden=true;
  copyJsonBtn.onclick=null;
}

function showHelpModal(isFirst=false){
  if(isFirst) localStorage.setItem(INTRO_KEY,'1');
  openModal(isFirst?'PC Connection Mapperへようこそ':'使い方',`
    <p class="welcome-lead">PC・モニター・USB機器・オーディオ・ネットワーク機器などの接続関係を、カードとケーブルで視覚化できます。</p>
    <div class="welcome-grid">
      <div class="welcome-card"><strong>① 機器を追加</strong><p>左のデバイス一覧から追加し、カード全体をドラッグして配置します。</p></div>
      <div class="welcome-card"><strong>② ケーブルを接続</strong><p>「機器を接続」を押し、接続する2台を順番にクリックします。</p></div>
      <div class="welcome-card"><strong>③ 整えて見やすく</strong><p>スマートガイド・複数選択・整列・グループ枠で、構成を見やすく整理できます。</p></div>
      <div class="welcome-card"><strong>④ タイトル・出力</strong><p>構成図タイトルを付け、JSONでバックアップしたりPNG画像として書き出せます。</p></div>
    </div>
    <div class="shortcut-list">
      <kbd>Ctrl + Z</kbd><span>元に戻す</span>
      <kbd>Ctrl + Y</kbd><span>やり直す</span>
      <kbd>Shift + クリック</kbd><span>機器を複数選択</span>
      <kbd>Ctrl + D</kbd><span>選択中の機器を複製</span>
      <kbd>Delete</kbd><span>選択中の機器・ケーブルを削除</span>
      <kbd>Ctrl + 0</kbd><span>表示倍率を100%へ</span>
      <kbd>Home</kbd><span>全体表示</span>
    </div>
    ${isFirst?`<div class="welcome-actions"><button class="btn primary" id="introBlankBtn">空の構成で始める</button><button class="btn" id="introSampleBtn">サンプルを見る</button></div>`:''}
    <p class="mini-text" style="margin-top:14px">構成データはこのブラウザ内に保存され、GitHubへ送信されません。別端末へ移す場合はJSON保存を利用してください。</p>
  `);
  modalDownloadLink.style.display='none';
  copyJsonBtn.hidden=true;
  if(isFirst){
    document.getElementById('introBlankBtn').addEventListener('click',()=>{
      localStorage.setItem(INTRO_KEY,'1');
      applyImportedState(makeBlank());
      history.undo=[];history.redo=[];updateHistoryButtons();
      closeModal();requestAnimationFrame(()=>{centerWorkspace();scheduleSave()});
    });
    document.getElementById('introSampleBtn').addEventListener('click',()=>{
      localStorage.setItem(INTRO_KEY,'1');
      applyImportedState(makeSample());
      history.undo=[];history.redo=[];updateHistoryButtons();
      closeModal();
      requestAnimationFrame(()=>{fitAll();scheduleSave()});
    });
  }
}

modalCloseBtn.addEventListener('click',closeModal);
modalCloseBtn2.addEventListener('click',closeModal);
exportModal.addEventListener('click',e=>{if(e.target===exportModal)closeModal()});
helpBtn.addEventListener('click',()=>showHelpModal(false));

async function saveBlob(blob,filename,mime){
  try{
    if(window.showSaveFilePicker){
      const ext='.'+filename.split('.').pop();
      const handle=await window.showSaveFilePicker({
        suggestedName:filename,
        types:[{description:filename,accept:{[mime]:[ext]}}]
      });
      const writable=await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      showToast(`${filename} を保存しました`);
      return;
    }
  }catch(err){
    if(err?.name==='AbortError')return;
    console.warn(err);
  }
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;a.download=filename;
  document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),3000);
}

jsonSaveBtn.addEventListener('click',()=>{
  const json=JSON.stringify(serializableState(),null,2);
  const blob=new Blob([json],{type:'application/json;charset=utf-8'});
  const url=URL.createObjectURL(blob);

  openModal('JSON保存',`
    <div class="mini-text">編集データをJSONとして保存します。自動保存とは別のバックアップです。</div>
    <textarea class="form-control export-json" id="jsonPreview" readonly></textarea>
  `);
  document.getElementById('jsonPreview').value=json;
  modalDownloadLink.href=url;
  modalDownloadLink.download='pc-connection-map.json';
  modalDownloadLink.textContent='JSONを保存';
  modalDownloadLink.onclick=()=>setTimeout(()=>URL.revokeObjectURL(url),3000);
  copyJsonBtn.hidden=false;
  copyJsonBtn.onclick=async()=>{
    try{await navigator.clipboard.writeText(json);showToast('JSONをコピーしました')}
    catch{document.getElementById('jsonPreview').select();document.execCommand('copy');showToast('JSONをコピーしました')}
  };
});

jsonLoadBtn.addEventListener('click',()=>jsonFileInput.click());
jsonFileInput.addEventListener('change',async()=>{
  const file=jsonFileInput.files?.[0];
  if(!file)return;
  try{
    const parsed=JSON.parse(await file.text());
    pushUndoSnapshot();
    applyImportedState(parsed);
    showToast('JSONを読み込みました');
  }catch(err){
    console.error(err);alert('JSONを読み込めませんでした。');
  }finally{
    jsonFileInput.value='';
  }
});

function contentBounds(includeGroups=true){
  let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
  const include=(x,y,w,h)=>{
    minX=Math.min(minX,x);minY=Math.min(minY,y);
    maxX=Math.max(maxX,x+w);maxY=Math.max(maxY,y+h);
  };

  if(includeGroups)state.groups.forEach(g=>include(g.x,g.y,g.w,g.h));
  state.nodes.forEach(n=>{
    const s=cardSize(n);
    include(n.x,n.y,s.w,s.h);
  });
  const titleBounds=diagramTitleBounds();
  if(titleBounds)include(titleBounds.x,titleBounds.y,titleBounds.w,titleBounds.h);

  if(minX===Infinity)return{x:0,y:0,w:WORKSPACE.width,h:WORKSPACE.height};

  const pad=120;
  const x=Math.max(0,minX-pad),y=Math.max(0,minY-pad);
  const right=Math.min(WORKSPACE.width,maxX+pad),bottom=Math.min(WORKSPACE.height,maxY+pad);
  return{x,y,w:right-x,h:bottom-y};
}

function hexToRgba(hex,alpha){
  const value=String(hex||'#64748b').replace('#','');
  const full=value.length===3?value.split('').map(c=>c+c).join(''):value;
  const n=parseInt(full,16);
  const r=(n>>16)&255,g=(n>>8)&255,b=n&255;
  return `rgba(${r},${g},${b},${alpha})`;
}

function loadPngDeviceIcon(iconKey,color){
  const body=ICON_SVGS[iconKey] || ICON_SVGS.other;
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
  const src=`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  return new Promise((resolve,reject)=>{
    const img=new Image();
    img.onload=()=>resolve(img);
    img.onerror=()=>reject(new Error(`アイコンを読み込めませんでした: ${iconKey}`));
    img.src=src;
  });
}

async function preparePngDeviceIcons(){
  const promises=new Map();
  state.nodes.forEach(node=>{
    const iconKey=nodeIconKey(node);
    const color=deviceAccent(node.type);
    const cacheKey=`${iconKey}|${color}`;
    if(!promises.has(cacheKey)) promises.set(cacheKey,loadPngDeviceIcon(iconKey,color));
  });

  const images=new Map();
  await Promise.all([...promises.entries()].map(async([key,promise])=>{
    try{images.set(key,await promise)}
    catch(err){console.warn(err)}
  }));
  return images;
}

function canvasEllipsis(ctx,text,maxWidth){
  const value=String(text??'');
  if(ctx.measureText(value).width<=maxWidth)return value;
  const ellipsis='…';
  if(ctx.measureText(ellipsis).width>maxWidth)return '';
  let lo=0,hi=value.length;
  while(lo<hi){
    const mid=Math.ceil((lo+hi)/2);
    const candidate=value.slice(0,mid)+ellipsis;
    if(ctx.measureText(candidate).width<=maxWidth)lo=mid;
    else hi=mid-1;
  }
  return value.slice(0,lo)+ellipsis;
}

function canvasWrapLines(ctx,text,maxWidth,maxLines){
  const src=String(text??'').replace(/\r/g,'');
  const paragraphs=src.split('\n');
  const lines=[];

  for(const paragraph of paragraphs){
    if(lines.length>=maxLines)break;
    if(paragraph===''){
      lines.push('');
      continue;
    }

    let current='';
    for(const ch of paragraph){
      const test=current+ch;
      if(current && ctx.measureText(test).width>maxWidth){
        lines.push(current);
        current=ch;
        if(lines.length>=maxLines)break;
      }else{
        current=test;
      }
    }
    if(lines.length>=maxLines)break;
    if(current)lines.push(current);
  }

  if(lines.length>maxLines)lines.length=maxLines;

  const consumed=lines.join('').replace(/\s/g,'').length;
  const original=src.replace(/\s/g,'').length;
  if(original>consumed && lines.length){
    lines[lines.length-1]=canvasEllipsis(ctx,lines[lines.length-1]+'…',maxWidth);
  }
  return lines;
}

function roundRect(ctx,x,y,w,h,r){
  const rr=Math.min(r,w/2,h/2);
  ctx.beginPath();
  ctx.moveTo(x+rr,y);
  ctx.lineTo(x+w-rr,y);ctx.quadraticCurveTo(x+w,y,x+w,y+rr);
  ctx.lineTo(x+w,y+h-rr);ctx.quadraticCurveTo(x+w,y+h,x+w-rr,y+h);
  ctx.lineTo(x+rr,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-rr);
  ctx.lineTo(x,y+rr);ctx.quadraticCurveTo(x,y,x+rr,y);
  ctx.closePath();
}

function drawEdgeCanvas(ctx,edge,offsetX,offsetY){
  const a=state.nodes.find(n=>n.id===edge.from),b=state.nodes.find(n=>n.id===edge.to);
  if(!a||!b)return null;
  const fs=edge.fromSide==='auto'?autoSide(a,b):edge.fromSide;
  const ts=edge.toSide==='auto'?autoSide(b,a):edge.toSide;
  const p1=anchor(a,fs),p2=anchor(b,ts);
  const x1=p1.x-offsetX,y1=p1.y-offsetY,x2=p2.x-offsetX,y2=p2.y-offsetY;

  ctx.beginPath();ctx.moveTo(x1,y1);
  if(edge.style==='straight'){
    ctx.lineTo(x2,y2);
  }else if(edge.style==='curve'){
    const cp=curveControlPoints(p1,p2,fs,ts,edge.bend);
    ctx.bezierCurveTo(
      cp.c1.x-offsetX,cp.c1.y-offsetY,
      cp.c2.x-offsetX,cp.c2.y-offsetY,
      x2,y2
    );
  }else{
    const horizontal=fs==='left'||fs==='right';
    const bend=Math.max(.15,Math.min(.85,+edge.bend||.5));
    if(horizontal){
      const mx=Math.round((p1.x+(p2.x-p1.x)*bend)/GRID)*GRID-offsetX;
      ctx.lineTo(mx,y1);ctx.lineTo(mx,y2);ctx.lineTo(x2,y2);
    }else{
      const my=Math.round((p1.y+(p2.y-p1.y)*bend)/GRID)*GRID-offsetY;
      ctx.lineTo(x1,my);ctx.lineTo(x2,my);ctx.lineTo(x2,y2);
    }
  }

  const lp=edgeLabelPoint(edge);
  return{x:lp.x-offsetX,y:lp.y-offsetY-9};
}

function loadPngOptions(){
  const defaults={grid:true,groups:true,background:'dark',scale:2};
  try{
    const saved=JSON.parse(localStorage.getItem(PNG_OPTIONS_KEY)||'{}');
    return{
      grid:saved.grid!==false,
      groups:saved.groups!==false,
      background:saved.background==='transparent'?'transparent':'dark',
      scale:[1,2,4].includes(+saved.scale)?+saved.scale:2
    };
  }catch{
    return defaults;
  }
}

function savePngOptions(options){
  localStorage.setItem(PNG_OPTIONS_KEY,JSON.stringify(options));
}

async function renderPng(options){
  const bounds=contentBounds(options.groups);
  const scale=options.scale;
  const width=Math.ceil(bounds.w*scale);
  const height=Math.ceil(bounds.h*scale);
  const totalPixels=width*height;

  if(totalPixels>80000000){
    throw new Error(`画像サイズが大きすぎます（${width}×${height}px）。解像度を下げてください。`);
  }

  const canvas=document.createElement('canvas');
  canvas.width=width;
  canvas.height=height;
  const ctx=canvas.getContext('2d');
  ctx.scale(scale,scale);
  const pngIcons=await preparePngDeviceIcons();

  if(options.background==='dark'){
    ctx.fillStyle='#0f131b';
    ctx.fillRect(0,0,bounds.w,bounds.h);
  }else{
    ctx.clearRect(0,0,bounds.w,bounds.h);
  }

  if(options.grid){
    ctx.lineWidth=1;
    for(let x=Math.floor(bounds.x/20)*20;x<=bounds.x+bounds.w;x+=20){
      const xx=x-bounds.x+.5;
      ctx.beginPath();ctx.moveTo(xx,0);ctx.lineTo(xx,bounds.h);
      ctx.strokeStyle=x%100===0
        ? (options.background==='transparent'?'rgba(100,116,139,.34)':'#222936')
        : (options.background==='transparent'?'rgba(100,116,139,.18)':'#171d27');
      ctx.stroke();
    }
    for(let y=Math.floor(bounds.y/20)*20;y<=bounds.y+bounds.h;y+=20){
      const yy=y-bounds.y+.5;
      ctx.beginPath();ctx.moveTo(0,yy);ctx.lineTo(bounds.w,yy);
      ctx.strokeStyle=y%100===0
        ? (options.background==='transparent'?'rgba(100,116,139,.34)':'#222936')
        : (options.background==='transparent'?'rgba(100,116,139,.18)':'#171d27');
      ctx.stroke();
    }
  }

  if((state.diagram?.title||'').trim()){
    ctx.save();
    ctx.fillStyle=options.background==='transparent'?'#172033':'#f1f5f9';
    ctx.font='700 24px "Segoe UI","Yu Gothic UI","Yu Gothic","Meiryo",Arial,sans-serif';
    ctx.textAlign='left';
    ctx.fillText(state.diagram.title,state.diagram.x-bounds.x,state.diagram.y-bounds.y+30);
    ctx.restore();
  }

  if(options.groups){
    state.groups.forEach(group=>{
      const x=group.x-bounds.x,y=group.y-bounds.y;
      ctx.save();
      ctx.fillStyle=hexToRgba(group.color,.055);
      ctx.strokeStyle=hexToRgba(group.color,.6);
      ctx.lineWidth=1.5;
      ctx.setLineDash([8,6]);
      roundRect(ctx,x,y,group.w,group.h,16);ctx.fill();ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle=hexToRgba(group.color,.95);
      ctx.font='700 11px "Segoe UI","Yu Gothic UI","Yu Gothic","Meiryo",Arial,sans-serif';
      ctx.fillText(group.title,x+14,y+21);
      ctx.restore();
    });
  }

  state.edges.forEach(edge=>{
    const cable=CABLES[edge.type]||CABLES.Other;
    ctx.save();
    ctx.strokeStyle=cable.color;ctx.lineWidth=3;ctx.lineCap='round';ctx.lineJoin='round';
    ctx.setLineDash(cable.dash?[8,6]:[]);
    const labelPoint=drawEdgeCanvas(ctx,edge,bounds.x,bounds.y);
    ctx.stroke();ctx.restore();

    if(labelPoint){
      const label=edge.label||edge.type;
      ctx.save();
      ctx.font='11px "Segoe UI","Yu Gothic UI","Yu Gothic","Meiryo",Arial,sans-serif';
      ctx.textAlign='center';
      const width=ctx.measureText(label).width;
      ctx.fillStyle=options.background==='transparent'?'rgba(15,19,27,.82)':'rgba(15,19,27,.92)';
      ctx.fillRect(labelPoint.x-width/2-4,labelPoint.y-12,width+8,16);
      ctx.fillStyle='#d7deea';ctx.fillText(label,labelPoint.x,labelPoint.y);
      ctx.restore();
    }
  });

  state.nodes.forEach(node=>{
    const s=cardSize(node),x=node.x-bounds.x,y=node.y-bounds.y;
    const accent=deviceAccent(node.type);
    ctx.save();

    ctx.fillStyle='#1d2430';ctx.strokeStyle='#3b455a';ctx.lineWidth=1;
    roundRect(ctx,x,y,s.w,s.h,14);ctx.fill();ctx.stroke();

    ctx.fillStyle=accent;
    ctx.fillRect(x+14,y+1,s.w-28,3);

    const iconBoxX=x+10,iconBoxY=y+(node.size==='xlarge'?12:9);
    ctx.fillStyle='#192131';
    ctx.strokeStyle='#313d52';
    ctx.lineWidth=1;
    roundRect(ctx,iconBoxX,iconBoxY,28,28,8);ctx.fill();ctx.stroke();

    const cacheKey=`${nodeIconKey(node)}|${accent}`;
    const iconImg=pngIcons.get(cacheKey);
    if(iconImg)ctx.drawImage(iconImg,iconBoxX+4,iconBoxY+4,20,20);

    ctx.save();
    ctx.beginPath();
    roundRect(ctx,x+1,y+1,s.w-2,s.h-2,13);
    ctx.clip();

    const textX=x+46;
    const titleY=y+(node.size==='xlarge'?27:21);
    const headerRight=x+s.w-10;
    const headerWidth=Math.max(24,headerRight-textX);
    const bodyX=x+(node.size==='xlarge'?13:10);
    const bodyWidth=Math.max(24,s.w-(node.size==='xlarge'?26:20));
    const uiFont='"Segoe UI","Yu Gothic UI","Yu Gothic","Meiryo",Arial,sans-serif';

    ctx.textAlign='left';
    ctx.fillStyle='#edf2f7';
    ctx.font=`700 ${node.size==='xlarge'?15:13}px ${uiFont}`;
    ctx.fillText(canvasEllipsis(ctx,node.name||node.type,headerWidth),textX,titleY);

    ctx.fillStyle='#909bad';
    ctx.font=`9px ${uiFont}`;
    ctx.fillText(canvasEllipsis(ctx,node.type,headerWidth),textX,titleY+13);

    let noteY=y+(node.size==='xlarge'?67:52);
    if(node.model){
      ctx.fillStyle='#9cabc0';
      ctx.font=`${node.size==='xlarge'?11:10}px ${uiFont}`;
      ctx.fillText(canvasEllipsis(ctx,node.model,headerWidth),textX,titleY+27);
      noteY=y+(node.size==='xlarge'?82:64);
    }

    ctx.fillStyle='#aab4c5';
    ctx.font=`${node.size==='xlarge'?11:9}px ${uiFont}`;
    const noteLimit=node.size==='xlarge'?6:2;
    const lineHeight=node.size==='xlarge'?16:12;
    const availableHeight=Math.max(0,y+s.h-10-noteY);
    const heightLines=Math.max(0,Math.floor(availableHeight/lineHeight)+1);
    const effectiveLimit=Math.min(noteLimit,heightLines);
    const noteLines=canvasWrapLines(ctx,node.note||'',bodyWidth,effectiveLimit);
    noteLines.forEach((line,i)=>{
      ctx.fillText(canvasEllipsis(ctx,line,bodyWidth),bodyX,noteY+i*lineHeight);
    });

    ctx.restore();

    if(node.locked){
      ctx.font='700 7px "Segoe UI",Arial,sans-serif';
      const lockText='LOCK';
      const tw=ctx.measureText(lockText).width;
      const bx=x+s.w-tw-18,by=y+s.h-18;
      ctx.fillStyle='#131925';ctx.strokeStyle='#3d4a60';
      roundRect(ctx,bx,by,tw+10,12,4);ctx.fill();ctx.stroke();
      ctx.fillStyle='#8ea1bb';ctx.fillText(lockText,bx+5,by+9);
    }
    ctx.restore();
  });

  return{
    dataUrl:canvas.toDataURL('image/png'),
    width,
    height,
    bounds
  };
}

function showPngExportSettings(){
  const options=loadPngOptions();
  openModal('PNG出力設定',`
    <div class="png-settings">
      <div class="png-setting-section">
        <div class="png-setting-title">表示</div>
        <label class="png-option-row">
          <span><strong>グリッド</strong><small>背景の方眼をPNGにも表示</small></span>
          <input id="pngGrid" type="checkbox" ${options.grid?'checked':''}>
        </label>
        <label class="png-option-row">
          <span><strong>グループ枠</strong><small>グループ名と囲み枠をPNGにも表示</small></span>
          <input id="pngGroups" type="checkbox" ${options.groups?'checked':''}>
        </label>
      </div>

      <div class="png-setting-section">
        <div class="png-setting-title">背景</div>
        <div class="png-radio-grid">
          <label class="png-radio-card">
            <input type="radio" name="pngBackground" value="dark" ${options.background==='dark'?'checked':''}>
            <span><strong>ダーク</strong><small>画面と同じ背景</small></span>
          </label>
          <label class="png-radio-card">
            <input type="radio" name="pngBackground" value="transparent" ${options.background==='transparent'?'checked':''}>
            <span><strong>透明</strong><small>資料への貼り付け向け</small></span>
          </label>
        </div>
      </div>

      <div class="png-setting-section">
        <div class="png-setting-title">解像度</div>
        <div class="png-scale-options">
          ${[1,2,4].map(scale=>`
            <label class="png-scale-card">
              <input type="radio" name="pngScale" value="${scale}" ${options.scale===scale?'checked':''}>
              <span><strong>${scale}x</strong><small>${scale===1?'軽量':scale===2?'標準・おすすめ':'高解像度'}</small></span>
            </label>
          `).join('')}
        </div>
      </div>

      <div class="png-generate-row">
        <button class="btn primary" id="generatePngBtn">プレビューを生成</button>
        <span class="mini-text" id="pngOutputInfo"></span>
      </div>
      <div id="pngPreviewArea"></div>
    </div>
  `);

  modalDownloadLink.style.display='none';
  copyJsonBtn.hidden=true;

  const generateBtn=document.getElementById('generatePngBtn');
  const previewArea=document.getElementById('pngPreviewArea');
  const info=document.getElementById('pngOutputInfo');

  generateBtn.addEventListener('click',async()=>{
    const current={
      grid:document.getElementById('pngGrid').checked,
      groups:document.getElementById('pngGroups').checked,
      background:document.querySelector('input[name="pngBackground"]:checked')?.value||'dark',
      scale:+document.querySelector('input[name="pngScale"]:checked')?.value||2
    };
    savePngOptions(current);

    generateBtn.disabled=true;
    generateBtn.textContent='生成中…';
    info.textContent='';
    previewArea.innerHTML='<div class="png-preview-loading">PNGを生成しています…</div>';
    modalDownloadLink.style.display='none';

    try{
      const result=await renderPng(current);
      previewArea.innerHTML=`<div class="png-preview-shell ${current.background==='transparent'?'transparent':''}"><img class="export-preview" id="pngPreview" alt="PNG preview"></div>`;
      document.getElementById('pngPreview').src=result.dataUrl;
      info.textContent=`${result.width.toLocaleString()} × ${result.height.toLocaleString()} px`;
      modalDownloadLink.href=result.dataUrl;
      modalDownloadLink.download='pc-connection-map.png';
      modalDownloadLink.textContent='PNGを保存';
      modalDownloadLink.style.display='inline-flex';
    }catch(err){
      console.error(err);
      previewArea.innerHTML=`<div class="png-export-error">${escapeHtml(err.message)}</div>`;
    }finally{
      generateBtn.disabled=false;
      generateBtn.textContent='プレビューを生成';
    }
  });
}

pngBtn.addEventListener('click',showPngExportSettings);

snapToggle.addEventListener('change',scheduleSave);
window.addEventListener('resize',()=>applyView());

buildPalette();
loadInitialState();
applyView();
updateHistoryButtons();
if(firstRun && !localStorage.getItem(INTRO_KEY)) requestAnimationFrame(()=>showHelpModal(true));
