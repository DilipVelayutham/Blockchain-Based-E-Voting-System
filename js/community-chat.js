/* community-chat.js
   - Reads community id from query param `id`
   - Loads community info from localStorage key "pollbooth_communities_v1"
   - Implements chat UI + create-event modal
   - Events stored in localStorage under key "pollbooth_events_v1"
   - Event notifications are injected into chat as large event-cards that link to event.html
*/

// storage keys
const COMM_KEY = "pollbooth_communities_v1";
const EVENTS_KEY = "pollbooth_events_v1"; // structure: { "<commId>": [eventObj, ...], ... }

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const commId = params.get("id") || null;

  // elements
  const headerEl = document.getElementById("header");
  const crumbCurrent = document.getElementById("crumb-current");
  const infoName = document.getElementById("info-name");
  const infoDesc = document.getElementById("info-desc");
  const infoCreated = document.getElementById("info-created");
  const infoMembers = document.getElementById("info-members");
  const coverSub = document.getElementById("cover-sub");
  const chatTitle = document.getElementById("chat-title");
  const chatSub = document.getElementById("chat-sub");
  const chatAvatar = document.getElementById("chat-avatar");

  const pinnedList = document.getElementById("pinned-list");
  const leftPinned = document.getElementById("left-pinned");
  const chatBody = document.getElementById("chat-body");
  const form = document.getElementById("chat-form");
  const input = document.getElementById("msg-input");
  const attachInput = document.getElementById("attach-input");
  const createEventBtn = document.getElementById("create-event-btn");

  // modal elements
  const eventModal = document.getElementById("event-modal");
  const modalBackdrop = document.getElementById("modal-backdrop");
  const modalClose = document.getElementById("modal-close");
  const modalCancel = document.getElementById("modal-cancel");
  const eventForm = document.getElementById("event-form");
  const eventTitle = document.getElementById("event-title");
  const eventDesc = document.getElementById("event-desc");
  const eventOptions = document.getElementById("event-options");
  const eventEnd = document.getElementById("event-end");
  const eventImage = document.getElementById("event-image");
  const eventImagePreview = document.getElementById("event-image-preview");

  // load community meta
  let community = null;
  try {
    const raw = localStorage.getItem(COMM_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr) && commId) {
        community = arr.find(c => c.id === commId) || null;
      }
    }
  } catch(e){ console.error(e); }

  if (!community) {
    headerEl.textContent = "Community";
    crumbCurrent.textContent = "Unknown";
    infoName.textContent = "Unknown community";
    infoDesc.textContent = "This community could not be found.";
    infoCreated.textContent = "—";
    infoMembers.textContent = "0";
    chatTitle.textContent = "Community Chat";
    chatSub.textContent = "No data available";
  } else {
    headerEl.textContent = community.Name || "Community";
    crumbCurrent.textContent = community.Name || "Community";
    infoName.textContent = community.Name || "Community";
    infoDesc.textContent = community.Desc || "No description provided.";
    infoCreated.textContent = community.createdAt ? new Date(community.createdAt).toLocaleString() : "—";
    infoMembers.textContent = Math.max(3, Math.floor(Math.random() * 120));
    coverSub.textContent = community.Desc ? community.Desc.substring(0, 120) : "";
    chatTitle.textContent = (community.Name || "Community") + " Chat";
    chatSub.textContent = "Be respectful — pinned messages shown above";
    chatAvatar.textContent = (community.Name || "C").split(" ").map(s=>s[0]).slice(0,2).join("").toUpperCase();
  }

  // chat storage per-community (session)
  const CHAT_KEY = "chat_msgs_" + (commId || "anon");
  const PIN_KEY = "chat_pins_" + (commId || "anon");

  let messages = [];
  let pinned = [];
  let eventsByComm = loadEventsFromStorage(); // object mapping commId->array

  // load previous messages or seed demo
  try {
    const raw = sessionStorage.getItem(CHAT_KEY);
    if (raw) messages = JSON.parse(raw) || [];
    else {
      messages = [
        { id: genId(), who: "other", text: "Welcome to the community chat! Please be respectful.", at: Date.now() - 1000*60*60, reactions: {} },
        { id: genId(), who: "me", text: "Hello everyone — glad to join!", at: Date.now() - 1000*60*45, reactions: {} }
      ];
      sessionStorage.setItem(CHAT_KEY, JSON.stringify(messages));
    }

    const rawPins = sessionStorage.getItem(PIN_KEY);
    pinned = rawPins ? JSON.parse(rawPins) : [];
  } catch(e){ console.error(e); }

  // function to render both messages and event notifications
  function renderMessagesAndEvents() {
    chatBody.innerHTML = "";

    // first inject events (for this community) in chronological order interleaved with messages.
    // Simpler approach: show events first (latest first) then messages — event messages are prominent.
    const events = (eventsByComm[commId] || []).slice().reverse(); // newest first
    for (const ev of events) {
      const evCard = createEventCardElement(ev);
      chatBody.appendChild(evCard);
    }

    // then show regular messages
    for (const m of messages) {
      const el = createMessageElement(m);
      chatBody.appendChild(el);
    }

    chatBody.scrollTop = chatBody.scrollHeight;
  }

  /* ---------------------------
     Create event modal handling
     --------------------------- */
  function openEventModal() {
    eventModal.setAttribute("aria-hidden","false");
    eventModal.style.display = "flex";
  }
  function closeEventModal() {
    eventModal.setAttribute("aria-hidden","true");
    eventModal.style.display = "none";
    eventForm.reset();
    eventImagePreview.src = "";
    eventImagePreview.style.display = "none";
  }

  if (createEventBtn) {
    createEventBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openEventModal();
    });
  }
  if (modalBackdrop) modalBackdrop.addEventListener("click", closeEventModal);
  if (modalClose) modalClose.addEventListener("click", closeEventModal);
  if (modalCancel) modalCancel.addEventListener("click", closeEventModal);

  eventImage.addEventListener("change", () => {
    const f = eventImage.files && eventImage.files[0];
    if (!f) { eventImagePreview.style.display="none"; eventImagePreview.src=""; return; }
    const r = new FileReader();
    r.onload = (ev) => {
      eventImagePreview.src = ev.target.result;
      eventImagePreview.style.display = "block";
    };
    r.readAsDataURL(f);
  });

  // submit event
  eventForm.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    if (!commId) { alert("Community context missing."); return; }

    const title = eventTitle.value.trim();
    const desc = eventDesc.value.trim();
    const optsRaw = eventOptions.value.trim();
    const endDate = eventEnd.value || null;
    if (!title || !optsRaw) { alert("Please provide title and at least one option."); return; }
    const options = optsRaw.split(",").map(s=>s.trim()).filter(Boolean);

    // read image if provided
    let imgDataUrl = null;
    const f = eventImage.files && eventImage.files[0];
    if (f) {
      try {
        imgDataUrl = await readFileAsDataURL(f);
      } catch(e){}
    } else {
      // fallback template image (you said you'll include event template image)
      imgDataUrl = "assets/images/event.jpg"; // keep a default reference (ensure file exists)
    }

    const id = genId();
    const evObj = {
      id, title, desc, options, endDate, image: imgDataUrl,
      commId, createdAt: new Date().toISOString()
    };

    // store event under eventsByComm and persist
    if (!eventsByComm[commId]) eventsByComm[commId] = [];
    eventsByComm[commId].push(evObj);
    saveEventsToStorage(eventsByComm);

    // create a chat notification message for the event: message type 'event'
    const eventMsg = {
      id: genId(),
      who: "system",
      type: "event",
      eventId: id,
      commId,
      at: Date.now()
    };
    messages.push(eventMsg);
    sessionStorage.setItem(CHAT_KEY, JSON.stringify(messages));

    // re-render UI and close modal
    renderMessagesAndEvents();
    refreshPinnedUI();
    closeEventModal();

    // optionally show a quick highlight/notice
    window.setTimeout(()=> {
      const el = chatBody.querySelector(`.event-card[data-event-id="${id}"]`);
      if (el) el.animate([{ transform: "scale(1.02)"},{ transform:"scale(1)" }], { duration:380 });
    }, 60);
  });

  /* ---------------------------
     Event card creation (in chat)
     --------------------------- */
  function createEventCardElement(ev) {
    const wrapper = document.createElement("div");
    wrapper.className = "event-card";
    wrapper.dataset.eventId = ev.id;
    wrapper.title = "Open event";

    // image: either data URL or fallback path
    const imgSrc = ev.image || "assets/images/event.jpg";

    const html = `
      <img src="${imgSrc}" alt="event image"/>
      <div class="event-body">
        <h4>${escapeHtml(ev.title)}</h4>
        <p>${escapeHtml(ev.desc || ev.options.slice(0,3).join(", "))}</p>
        <div class="event-actions">
          <button class="open-event-btn">Open Event</button>
          <small class="small" style="margin-left:8px;color:var(--muted)">Ends: ${ev.endDate ? new Date(ev.endDate).toLocaleDateString() : "—"}</small>
        </div>
      </div>
    `;
    wrapper.innerHTML = html;

    // clicking card or open button -> navigate to event page
    wrapper.addEventListener("click", (e) => {
      // avoid double-trigger if button clicked (still navigate)
      window.location.href = `event.html?event=${encodeURIComponent(ev.id)}&comm=${encodeURIComponent(ev.commId)}`;
    });

    return wrapper;
  }

  /* ---------------------------
     Messages (as before)
     --------------------------- */
  function createMessageElement(m) {
    if (m.type === "event") {
      // event notification — try to find event and render similarly
      const ev = findEventById(m.eventId);
      if (ev) {
        const el = createEventCardElement(ev);
        // also allow clicking to go to event page (already handled)
        return el;
      }
      // fallback to simple system message if event missing
      const s = document.createElement("div");
      s.className = "msg msg-other";
      s.textContent = "An event was created (details unavailable).";
      return s;
    }

    const el = document.createElement("div");
    el.className = "msg " + (m.who === "me" ? "msg-me" : "msg-other");
    el.dataset.id = m.id;

    let attachmentHtml = "";
    if (m.attachment && m.attachment.dataUrl) {
      if (m.attachment.type && m.attachment.type.startsWith("image/")) {
        attachmentHtml = `<div class="attachment"><img src="${m.attachment.dataUrl}" alt="att"/></div>`;
      } else {
        attachmentHtml = `<div class="attachment small">${escapeHtml(m.attachment.name || "file")}</div>`;
      }
    }

    el.innerHTML = `
      <div class="text">${escapeHtml(m.text || "")}</div>
      ${attachmentHtml}
      <div class="meta">${new Date(m.at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
    `;

    return el;
  }

  /* ---------------------------
     Messages send handler (keep as earlier)
     --------------------------- */
  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const text = input.value.trim();
    const file = attachInput.files && attachInput.files[0];
    if (!text && !file) return;

    let att = null;
    if (file) {
      try { att = { dataUrl: await readFileAsDataURL(file), type: file.type, name: file.name }; } catch(e){}
    }

    const msg = { id: genId(), who: "me", text, at: Date.now(), reactions: {}, attachment: att };
    messages.push(msg);
    try { sessionStorage.setItem(CHAT_KEY, JSON.stringify(messages)); } catch(e){}
    input.value = "";
    attachInput.value = "";
    renderMessagesAndEvents();
  });

  /* ---------------------------
     Events storage helpers
     --------------------------- */
  function loadEventsFromStorage() {
    try {
      const raw = localStorage.getItem(EVENTS_KEY);
      if (!raw) return {};
      return JSON.parse(raw);
    } catch(e){ console.error(e); return {}; }
  }
  function saveEventsToStorage(obj) {
    try {
      localStorage.setItem(EVENTS_KEY, JSON.stringify(obj));
    } catch(e){ console.error(e); }
  }
  function findEventById(eventId) {
    if (!eventsByComm) return null;
    for (const k of Object.keys(eventsByComm || {})) {
      const arr = eventsByComm[k] || [];
      const found = arr.find(x=>x.id===eventId);
      if (found) return found;
    }
    return null;
  }

  /* ---------------------------
     Pinned UI (reuse existing small logic)
     --------------------------- */
  function refreshPinnedUI() {
    pinnedList.innerHTML = "";
    leftPinned.innerHTML = "";
    const pinnedMsgs = pinned.map(id => messages.find(m => m.id === id)).filter(Boolean);
    for (const pm of pinnedMsgs) {
      const short = document.createElement("div");
      short.className = "pinned-item";
      short.textContent = pm.type === "event" ? "[Event] " + (findEventById(pm.eventId)?.title || "Event") : (pm.text.length > 50 ? pm.text.slice(0,47) + "…" : pm.text);
      short.addEventListener("click", () => {
        const target = chatBody.querySelector(`[data-id="${pm.id}"]`) || chatBody.querySelector(`.event-card[data-event-id="${pm.eventId}"]`);
        if (target) target.scrollIntoView({behavior:"smooth", block:"center"});
      });
      pinnedList.appendChild(short);
      const left = document.createElement("div");
      left.className = "left-pinned-item small";
      left.textContent = short.textContent;
      left.style.cursor = "pointer";
      left.addEventListener("click", () => {
        const target = chatBody.querySelector(`[data-id="${pm.id}"]`) || chatBody.querySelector(`.event-card[data-event-id="${pm.eventId}"]`);
        if (target) target.scrollIntoView({behavior:"smooth", block:"center"});
      });
      leftPinned.appendChild(left);
    }
  }

  /* ---------------------------
     Initial render
     --------------------------- */
  renderMessagesAndEvents();
  refreshPinnedUI();

  /* ---------------------------
     Utility functions
     --------------------------- */
  function genId(){ return 'id_' + Date.now().toString(36) + '_' + Math.floor(Math.random()*10000).toString(36); }
  function escapeHtml(s){ return String(s||"").replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;'); }
  function readFileAsDataURL(file){
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = ()=>res(r.result);
      r.onerror = ()=>rej();
      r.readAsDataURL(file);
    });
  }

});

