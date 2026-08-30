console.info('PC Connection Mapper app.js v1.17 loaded');

const WORKSPACE = { width: 3200, height: 2200 };
const GRID = 20;
const STORAGE_KEY = 'pc-connection-mapper-v1';
const INTRO_KEY = 'pc-connection-mapper-intro-seen-v1';
const HISTORY_LIMIT = 50;

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
const palette = document.getElementById('palette');
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
  view: {x:0,y:0,scale:1},
  selectedNodeId:null,
  selectedEdgeId:null,
  connectMode:false,
  connectSourceId:null,
  nextId:1
};

let saveTimer = null;
let toastTimer = null;
let panState = null;
let firstRun = false;
const history = {undo:[],redo:[]};
const editSnapshots = new WeakMap();


function contentSnapshot(){
  return JSON.stringify({nodes:state.nodes,edges:state.edges,nextId:state.nextId});
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
  state.nextId=data.nextId||Math.max(0,...state.nodes.map(n=>Number(n.id)||0))+1;
  state.selectedNodeId=null;state.selectedEdgeId=null;state.connectMode=false;state.connectSourceId=null;
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
  return {version:'1.17',nextId:1,nodes:[],edges:[],view:{x:0,y:0,scale:1}};
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
    version:'1.17',
    nodes:state.nodes,
    edges:state.edges,
    view:state.view,
    nextId:state.nextId
  };
}

function makeSample(){
  return {
    version:'1.17',
    nextId:7,
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
    note:n.note || ''
  })) : [];
  state.edges = Array.isArray(data.edges) ? data.edges.map(e=>({
    ...e,
    style:e.style || 'curve',
    bend:Number.isFinite(+e.bend) ? +e.bend : .5,
    fromSide:e.fromSide || 'auto',
    toSide:e.toSide || 'auto',
    label:e.label || e.type || 'Other'
  })) : [];
  state.view = data.view && Number.isFinite(data.view.scale)
    ? {...data.view}
    : {x:0,y:0,scale:1};
  state.nextId = data.nextId || Math.max(0,...state.nodes.map(n=>Number(n.id)||0))+1;
  state.selectedNodeId = null;
  state.selectedEdgeId = null;
  state.connectMode = false;
  state.connectSourceId = null;
  connectBtn.classList.remove('primary');
  connectBtn.textContent = '機器を接続';
  renderAll();
  applyView();
  if(save) scheduleSave();
}

function buildPalette(){
  palette.innerHTML = '';
  DEVICE_GROUPS.forEach(group=>{
    const section=document.createElement('section');
    section.className='device-group';

    const heading=document.createElement('div');
    heading.className='device-group-title';
    heading.textContent=group.label;
    section.appendChild(heading);

    const grid=document.createElement('div');
    grid.className='device-group-grid';

    group.items.forEach(([type,iconKey,size])=>{
      const button=document.createElement('button');
      button.className='palette-btn';
      button.innerHTML=`<span class="palette-icon">${iconSvg(iconKey,'palette-svg')}</span><span class="palette-name">${escapeHtml(type)}</span>`;
      button.addEventListener('click',()=>addNode({type,iconKey,size}));
      grid.appendChild(button);
    });

    section.appendChild(grid);
    palette.appendChild(section);
  });
}

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
    x:snap(Math.max(0,Math.min(WORKSPACE.width-200, center.x-80))),
    y:snap(Math.max(0,Math.min(WORKSPACE.height-120, center.y-40)))
  };
  state.nodes.push(node);
  state.selectedNodeId = node.id;
  state.selectedEdgeId = null;
  renderAll();
  scheduleSave();
}

function renderAll(){
  renderNodes();
  renderEdges();
  renderProperties();
}

function syncNodeSelectionStyles(){
  nodesLayer.querySelectorAll('.node').forEach(el=>{
    const id = Number(el.dataset.id);
    el.classList.toggle('selected', state.selectedNodeId === id);
    el.classList.toggle('connect-source', state.connectSourceId === id);
  });
}

function renderNodes(){
  nodesLayer.innerHTML = '';
  state.nodes.forEach(node=>{
    const s = cardSize(node);
    const el = document.createElement('div');
    el.className = 'node size-' + node.size +
      (state.selectedNodeId === node.id ? ' selected' : '') +
      (state.connectSourceId === node.id ? ' connect-source' : '');
    el.dataset.id = node.id;
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
    state.selectedNodeId = node.id;
    state.selectedEdgeId = null;
    syncNodeSelectionStyles();
    renderProperties();

    drag = {id:e.pointerId,sx:e.clientX,sy:e.clientY,ox:node.x,oy:node.y,moved:false,before:contentSnapshot()};
    el.setPointerCapture(e.pointerId);
  });

  el.addEventListener('pointermove', e=>{
    if(!drag || drag.id !== e.pointerId) return;
    const dx = (e.clientX-drag.sx)/state.view.scale;
    const dy = (e.clientY-drag.sy)/state.view.scale;
    if(Math.abs(dx)+Math.abs(dy)>3) drag.moved = true;
    const s = cardSize(node);
    node.x = Math.max(0,Math.min(WORKSPACE.width-s.w,snap(drag.ox+dx)));
    node.y = Math.max(0,Math.min(WORKSPACE.height-s.h,snap(drag.oy+dy)));
    el.style.left = `${node.x}px`;
    el.style.top = `${node.y}px`;
    renderEdges();
  });

  el.addEventListener('pointerup', e=>{
    if(!drag || drag.id !== e.pointerId) return;
    if(el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    const changed = drag.moved;
    const before=drag.before;
    drag = null;
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
    style:'curve',
    bend:.5,
    fromSide:'auto',
    toSide:'auto'
  };
  state.edges.push(edge);
  state.selectedEdgeId = edge.id;
  state.selectedNodeId = null;
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

function edgeGeometry(edge){
  const a=state.nodes.find(n=>n.id===edge.from);
  const b=state.nodes.find(n=>n.id===edge.to);
  if(!a||!b) return null;

  const fromSide=edge.fromSide==='auto'?autoSide(a,b):edge.fromSide;
  const toSide=edge.toSide==='auto'?autoSide(b,a):edge.toSide;
  const p1=anchor(a,fromSide), p2=anchor(b,toSide);

  if(edge.style==='straight'){
    return {d:`M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`,label:{x:(p1.x+p2.x)/2,y:(p1.y+p2.y)/2-8}};
  }

  if(edge.style==='curve'){
    const dx=Math.max(50,Math.abs(p2.x-p1.x)*.45);
    const sign=p2.x>=p1.x?1:-1;
    return {
      d:`M ${p1.x} ${p1.y} C ${p1.x+dx*sign} ${p1.y}, ${p2.x-dx*sign} ${p2.y}, ${p2.x} ${p2.y}`,
      label:{x:(p1.x+p2.x)/2,y:(p1.y+p2.y)/2-9}
    };
  }

  const horizontal = fromSide==='left' || fromSide==='right';
  const bend=Math.max(.15,Math.min(.85,+edge.bend||.5));
  if(horizontal){
    const mx=Math.round((p1.x+(p2.x-p1.x)*bend)/GRID)*GRID;
    return {
      d:`M ${p1.x} ${p1.y} L ${mx} ${p1.y} L ${mx} ${p2.y} L ${p2.x} ${p2.y}`,
      label:{x:mx,y:(p1.y+p2.y)/2-8}
    };
  }
  const my=Math.round((p1.y+(p2.y-p1.y)*bend)/GRID)*GRID;
  return {
    d:`M ${p1.x} ${p1.y} L ${p1.x} ${my} L ${p2.x} ${my} L ${p2.x} ${p2.y}`,
    label:{x:(p1.x+p2.x)/2,y:my-8}
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
      state.selectedNodeId=null;
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
      state.selectedNodeId=null;
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

function renderProperties(){
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
        <label class="form-label">線の形</label>
        <select class="form-control" id="edgeStyle">
          ${optionList(['curve','orthogonal','straight'],edge.style,{curve:'カーブ',orthogonal:'直角',straight:'直線'})}
        </select>
        <label class="form-label">曲がる位置</label>
        <input class="form-control" id="edgeBend" type="range" min="15" max="85" value="${Math.round(edge.bend*100)}">
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

    document.getElementById('edgeStyle').addEventListener('change',e=>{
      pushUndoSnapshot();edge.style=e.target.value;renderEdges();scheduleSave();
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

  const node=state.nodes.find(n=>n.id===state.selectedNodeId);
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
    <button class="btn danger" id="deleteNodeBtn" style="width:100%">機器削除</button>
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
  document.getElementById('deleteNodeBtn').addEventListener('click',deleteSelection);
}

function deleteSelection(){
  if(state.selectedEdgeId){
    pushUndoSnapshot();
    state.edges=state.edges.filter(e=>e.id!==state.selectedEdgeId);
    state.selectedEdgeId=null;
    renderAll();scheduleSave();showToast('ケーブルを削除しました');
    return;
  }
  if(state.selectedNodeId){
    pushUndoSnapshot();
    const id=state.selectedNodeId;
    state.nodes=state.nodes.filter(n=>n.id!==id);
    state.edges=state.edges.filter(e=>e.from!==id&&e.to!==id);
    state.selectedNodeId=null;
    renderAll();scheduleSave();showToast('機器を削除しました');
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
  if(!state.nodes.length){centerWorkspace();return}
  let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
  state.nodes.forEach(node=>{
    const s=cardSize(node);
    minX=Math.min(minX,node.x);minY=Math.min(minY,node.y);
    maxX=Math.max(maxX,node.x+s.w);maxY=Math.max(maxY,node.y+s.h);
  });
  const pad=90;
  minX-=pad;minY-=pad;maxX+=pad;maxY+=pad;
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
    state.selectedNodeId=null;
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
  else if(mod&&e.key==='0'){e.preventDefault();zoomAtCenter(1)}
  else if(e.key==='Delete'){e.preventDefault();deleteSelection()}
  else if(e.key==='+'||e.key==='='){e.preventDefault();zoomAtCenter(state.view.scale*1.2)}
  else if(e.key==='-'){e.preventDefault();zoomAtCenter(state.view.scale/1.2)}
  else if(e.key==='Home'){e.preventDefault();fitAll()}
});

undoBtn.addEventListener('click',undo);
redoBtn.addEventListener('click',redo);

connectBtn.addEventListener('click',()=>{
  state.connectMode=!state.connectMode;
  state.connectSourceId=null;
  state.selectedEdgeId=null;
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
      <div class="welcome-card"><strong>③ 詳細を編集</strong><p>機器やケーブルを選択すると、右側で型番・メモ・種類・接続方向などを編集できます。</p></div>
      <div class="welcome-card"><strong>④ 保存・出力</strong><p>作業はブラウザ内に自動保存。JSONでバックアップし、PNG画像にも書き出せます。</p></div>
    </div>
    <div class="shortcut-list">
      <kbd>Ctrl + Z</kbd><span>元に戻す</span>
      <kbd>Ctrl + Y</kbd><span>やり直す</span>
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

function contentBounds(){
  if(!state.nodes.length)return{x:0,y:0,w:WORKSPACE.width,h:WORKSPACE.height};
  let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
  state.nodes.forEach(node=>{
    const s=cardSize(node);
    minX=Math.min(minX,node.x);minY=Math.min(minY,node.y);
    maxX=Math.max(maxX,node.x+s.w);maxY=Math.max(maxY,node.y+s.h);
  });
  const pad=120;
  return{
    x:Math.max(0,minX-pad),y:Math.max(0,minY-pad),
    w:Math.min(WORKSPACE.width,maxX+pad)-Math.max(0,minX-pad),
    h:Math.min(WORKSPACE.height,maxY+pad)-Math.max(0,minY-pad)
  };
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
    return{x:(x1+x2)/2,y:(y1+y2)/2-9};
  }
  if(edge.style==='curve'){
    const dx=Math.max(50,Math.abs(x2-x1)*.45),sign=x2>=x1?1:-1;
    ctx.bezierCurveTo(x1+dx*sign,y1,x2-dx*sign,y2,x2,y2);
    return{x:(x1+x2)/2,y:(y1+y2)/2-9};
  }
  const horizontal=fs==='left'||fs==='right';
  const bend=Math.max(.15,Math.min(.85,+edge.bend||.5));
  if(horizontal){
    const mx=Math.round((p1.x+(p2.x-p1.x)*bend)/GRID)*GRID-offsetX;
    ctx.lineTo(mx,y1);ctx.lineTo(mx,y2);ctx.lineTo(x2,y2);
    return{x:mx,y:(y1+y2)/2-8};
  }
  const my=Math.round((p1.y+(p2.y-p1.y)*bend)/GRID)*GRID-offsetY;
  ctx.lineTo(x1,my);ctx.lineTo(x2,my);ctx.lineTo(x2,y2);
  return{x:(x1+x2)/2,y:my-8};
}

pngBtn.addEventListener('click',async()=>{
  try{
    const bounds=contentBounds();
    const scale=2;
    const canvas=document.createElement('canvas');
    canvas.width=Math.ceil(bounds.w*scale);
    canvas.height=Math.ceil(bounds.h*scale);
    const ctx=canvas.getContext('2d');
    ctx.scale(scale,scale);

    ctx.fillStyle='#0f131b';
    ctx.fillRect(0,0,bounds.w,bounds.h);

    ctx.lineWidth=1;
    for(let x=Math.floor(bounds.x/20)*20;x<=bounds.x+bounds.w;x+=20){
      const xx=x-bounds.x+.5;
      ctx.beginPath();ctx.moveTo(xx,0);ctx.lineTo(xx,bounds.h);
      ctx.strokeStyle=x%100===0?'#222936':'#171d27';ctx.stroke();
    }
    for(let y=Math.floor(bounds.y/20)*20;y<=bounds.y+bounds.h;y+=20){
      const yy=y-bounds.y+.5;
      ctx.beginPath();ctx.moveTo(0,yy);ctx.lineTo(bounds.w,yy);
      ctx.strokeStyle=y%100===0?'#222936':'#171d27';ctx.stroke();
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
        ctx.font='11px "Segoe UI",Arial,sans-serif';ctx.textAlign='center';
        const width=ctx.measureText(label).width;
        ctx.fillStyle='rgba(15,19,27,.92)';
        ctx.fillRect(labelPoint.x-width/2-4,labelPoint.y-12,width+8,16);
        ctx.fillStyle='#d7deea';ctx.fillText(label,labelPoint.x,labelPoint.y);
        ctx.restore();
      }
    });

    state.nodes.forEach(node=>{
      const s=cardSize(node),x=node.x-bounds.x,y=node.y-bounds.y;
      ctx.save();
      ctx.fillStyle='#1d2430';ctx.strokeStyle='#3b455a';ctx.lineWidth=1;
      roundRect(ctx,x,y,s.w,s.h,14);ctx.fill();ctx.stroke();

      ctx.textAlign='left';
      ctx.fillStyle='#edf2f7';ctx.font='700 13px "Segoe UI",Arial,sans-serif';
      ctx.fillText(node.name||node.type,x+10,y+21);
      ctx.fillStyle='#909bad';ctx.font='9px "Segoe UI",Arial,sans-serif';
      ctx.fillText(node.type,x+10,y+35);

      let noteY=y+52;
      if(node.model){
        ctx.fillStyle='#9cabc0';ctx.font='10px "Segoe UI",Arial,sans-serif';
        ctx.fillText(node.model,x+10,y+49);noteY=y+64;
      }
      ctx.fillStyle='#aab4c5';ctx.font='9px "Segoe UI",Arial,sans-serif';
      const noteLimit=node.size==='xlarge'?6:2;
      String(node.note||'').split(/\n/).slice(0,noteLimit).forEach((line,i)=>ctx.fillText(line,x+10,noteY+i*12));
      ctx.restore();
    });

    const dataUrl=canvas.toDataURL('image/png');
    openModal('PNG出力',`
      <div class="mini-text">構成図の使用範囲だけを自動トリミングして2倍解像度で出力します。</div>
      <img class="export-preview" id="pngPreview" alt="PNG preview">
    `);
    document.getElementById('pngPreview').src=dataUrl;
    modalDownloadLink.href=dataUrl;
    modalDownloadLink.download='pc-connection-map.png';
    modalDownloadLink.textContent='PNGを保存';
    copyJsonBtn.hidden=true;
  }catch(err){
    console.error(err);
    alert(`PNG出力に失敗しました: ${err.message}`);
  }
});

snapToggle.addEventListener('change',scheduleSave);
window.addEventListener('resize',()=>applyView());

buildPalette();
loadInitialState();
applyView();
updateHistoryButtons();
if(firstRun && !localStorage.getItem(INTRO_KEY)) requestAnimationFrame(()=>showHelpModal(true));
