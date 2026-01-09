// community.js
// Version: add navigation to commtemp.html and render community title there
const STORAGE_KEY = "pollbooth_communities_v1";

let communities = [];
let editingId = null; // editing state if any

document.addEventListener("DOMContentLoaded", () => {
    // Load communities into memory (used both on main page and on commtemp page)
    loadCommunitiesFromStorage();

    // If this is the community template page (commtemp.html), render the header there
    if (isOnTemplatePage()) {
        renderTemplateHeaderFromQuery();
        return; // nothing else to run on template page
    }

    // Otherwise we're on main communities page: render list and wire up UI
    renderAllCommunities();

    // keep create form hidden initially (existing behavior)
    const form = document.getElementById("form-con");
    if (form) form.style.display = "none";

    // attach submit handler if present (some HTML uses onclick inline)
    const createBtn = document.getElementById("submitt");
    if (createBtn) {
        createBtn.removeAttribute("onclick");
        createBtn.addEventListener("click", onCreateOrUpdateClicked);
    }
});

/* ---------------------------
   Page detection & template header
   --------------------------- */
function isOnTemplatePage() {
    // If document contains element with id 'header' and class 'tempimg' image, assume commtemp.html
    return !!document.getElementById("header") && !!document.querySelector(".tempimg");
}

function renderTemplateHeaderFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const headerEl = document.getElementById("header");
    const imgEl = document.querySelector(".tempimg");

    if (!id || !headerEl) {
        // nothing to show
        headerEl.textContent = "";
        return;
    }

    // ensure we have communities loaded; otherwise it might be empty
    if (!Array.isArray(communities) || communities.length === 0) {
        headerEl.textContent = "";
        return;
    }

    const comm = communities.find(c => c.id === id);
    if (!comm) {
        headerEl.textContent = "Community not found";
        return;
    }

    headerEl.textContent = comm.Name || "Community";

    // keep existing image (commtemp.html already has comm.jpg). We do not alter image here,
    // because your instruction said to ignore the image-insertion change.
    // If you later want the community-specific cover image to show, we can add it here.
}

/* ---------------------------
   Create / Update / Render (3-dot version)
   --------------------------- */
function onCreateOrUpdateClicked() {
    const nameEl = document.getElementById("name");
    const descEl = document.getElementById("desc");
    if (!nameEl || !descEl) return;

    const name = nameEl.value.trim();
    const desc = descEl.value.trim();

    if (!name) {
        alert("Please fill atleast Community name");
        return;
    }

    if (editingId) {
        // update existing
        const idx = communities.findIndex(c => c.id === editingId);
        if (idx !== -1) {
            communities[idx].Name = name;
            communities[idx].Desc = desc;
            saveCommunitiesToStorage();
            renderAllCommunities();
        }
        editingId = null;
        setCreateBtnLabel("Create");
    } else {
        // create new
        const newCommunity = { Name: name, Desc: desc, id: generateId() };
        communities.push(newCommunity);
        saveCommunitiesToStorage();
        renderCommunity(newCommunity);
        adjustLayoutAfterAdd();
    }

    // clear and hide form to match previous behavior
    nameEl.value = "";
    descEl.value = "";
    const form = document.getElementById("form-con");
    if (form) form.style.display = "none";
}

function showCreateForm() {
    let cr = document.getElementById("cr");
    let form = document.getElementById("form-con");

    if (!form || !cr) return;

    if (form.style.display === "none" || form.style.display === "") {
        cr.style.width = "300px";
        cr.style.height = "280px";
        form.style.display = "block";
        if (!editingId) setCreateBtnLabel("Create");
    } else {
        cr.style.width = "290px";
        cr.style.height = "40px";
        form.style.display = "none";
        cancelEditing();
    }
}

function renderCommunity(comm) {
    let communityContainer = document.querySelector(".events-container");
    if (!communityContainer) return;

    let samp = document.getElementById("samp");
    let newbutt = document.getElementById("create");
    let newdiv = document.querySelector(".create");

    if (samp) samp.style.display = "none";
    if (newbutt) newbutt.style.top = "780px";
    if (newdiv) newdiv.style.top = "905px";

    let communityCard = document.createElement("div");
    communityCard.classList.add("event-card");
    communityCard.dataset.id = comm.id;
    communityCard.style.position = "relative";
    communityCard.style.cursor = "pointer";

    // clicking the card should open the template page for that community
    communityCard.addEventListener("click", (ev) => {
        // avoid navigation when clicking the dropdown (dots) - we check event target
        const clickedOnMenu = ev.target.closest(".comm-dots") || ev.target.closest(".comm-dropdown");
        if (clickedOnMenu) return;
        // go to template page with id param
        window.location.href = `commtemp.html?id=${encodeURIComponent(comm.id)}`;
    });

    communityCard.innerHTML = `
        <div class="event-info">
            <img src="comm.jpg" alt="Event Image" onclick="window.location.href='commtemp.html?id=${encodeURIComponent(comm.id)}'">
            <div class="event-title">${escapeHtml(comm.Name)}</div>
            <div class="event-description">${escapeHtml(comm.Desc)}</div>
        </div>

        <!-- 3-dots menu -->
        <button class="comm-dots" title="Options" aria-label="Community options">⋮</button>
        <div class="comm-dropdown" style="display:none;">
            <div class="comm-dropdown-item" data-action="edit">Edit</div>
            <div class="comm-dropdown-item" data-action="delete">Delete</div>
        </div>
    `;

    communityContainer.appendChild(communityCard);

    const dots = communityCard.querySelector(".comm-dots");
    const dropdown = communityCard.querySelector(".comm-dropdown");

    if (dots) {
        dots.style.cssText = "position:absolute; top:10px; right:10px; background:transparent; border:none; font-size:20px; cursor:pointer;";
    }
    if (dropdown) {
        dropdown.style.cssText = "position:absolute; top:36px; right:10px; min-width:100px; background:white; border-radius:6px; box-shadow:0 2px 6px rgba(0,0,0,0.2); z-index:1000; overflow:hidden;";
        dropdown.querySelectorAll(".comm-dropdown-item").forEach(it => {
            it.style.cssText = "padding:8px 10px; cursor:pointer; font-size:14px; border-bottom:1px solid rgba(0,0,0,0.06);";
        });
    }

    if (dots && dropdown) {
        dots.addEventListener("click", (ev) => {
            ev.stopPropagation();
            closeAllDropdowns();
            dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
        });
    }

    if (dropdown) {
        dropdown.addEventListener("click", (ev) => {
            const actionEl = ev.target.closest(".comm-dropdown-item");
            if (!actionEl) return;
            const action = actionEl.dataset.action;
            const id = communityCard.dataset.id;
            if (action === "delete") {
                const ok = confirm(`Delete community "${comm.Name}" ?`);
                if (ok) deleteCommunity(id);
            } else if (action === "edit") {
                startEditingCommunity(id);
            }
            dropdown.style.display = "none";
        });
    }

    // close dropdowns when clicking elsewhere
    document.addEventListener("click", closeAllDropdowns);
}

function closeAllDropdowns() {
    document.querySelectorAll(".comm-dropdown").forEach(d => {
        d.style.display = "none";
    });
}

function renderAllCommunities() {
    let communityContainer = document.querySelector(".events-container");
    if (!communityContainer) return;

    communityContainer.innerHTML = "";

    if (communities.length === 0) {
        let samp = document.getElementById("samp");
        if (samp) samp.style.display = "block";
        let newbutt = document.getElementById("create");
        let newdiv = document.querySelector(".create");
        if (newbutt) newbutt.style.top = "725px";
        if (newdiv) newdiv.style.top = "725px";
        return;
    }

    let samp = document.getElementById("samp");
    if (samp) samp.style.display = "none";

    for (let comm of communities) {
        renderCommunity(comm);
    }
    adjustLayoutAfterAdd();
}

/* ---------------------------
   Delete & Edit helpers
   --------------------------- */
function deleteCommunity(id) {
    const idx = communities.findIndex(c => c.id === id);
    if (idx === -1) return;
    communities.splice(idx, 1);
    saveCommunitiesToStorage();
    // remove DOM card
    const container = document.querySelector(".events-container");
    const card = container && container.querySelector(`.event-card[data-id="${id}"]`);
    if (card) card.remove();

    if (communities.length === 0) {
        const samp = document.getElementById("samp");
        if (samp) samp.style.display = "block";
        let newbutt = document.getElementById("create");
        let newdiv = document.querySelector(".create");
        if (newbutt) newbutt.style.top = "725px";
        if (newdiv) newdiv.style.top = "725px";
    }
}

function startEditingCommunity(id) {
    const comm = communities.find(c => c.id === id);
    if (!comm) return;
    const nameEl = document.getElementById("name");
    const descEl = document.getElementById("desc");
    const form = document.getElementById("form-con");
    if (!nameEl || !descEl || !form) return;

    nameEl.value = comm.Name;
    descEl.value = comm.Desc;
    editingId = id;
    form.style.display = "block";
    setCreateBtnLabel("Update");
}

function cancelEditing() {
    editingId = null;
    const nameEl = document.getElementById("name");
    const descEl = document.getElementById("desc");
    if (nameEl) nameEl.value = "";
    if (descEl) descEl.value = "";
    setCreateBtnLabel("Create");
}

function setCreateBtnLabel(txt) {
    const btn = document.getElementById("submitt");
    if (btn) btn.value = txt;
}

/* ---------------------------
   Storage
   --------------------------- */
function saveCommunitiesToStorage() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(communities));
    } catch (e) {
        console.error("Could not save communities to localStorage:", e);
    }
}

function loadCommunitiesFromStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            communities = [];
            return;
        }
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) communities = parsed;
        else communities = [];
    } catch (e) {
        console.error("Could not read communities from localStorage:", e);
        communities = [];
    }
}

/* ---------------------------
   Utilities
   --------------------------- */
function adjustLayoutAfterAdd() {
    let newbutt = document.getElementById("create");
    let newdiv = document.querySelector(".create");
    if (newbutt) newbutt.style.top = "780px";
    if (newdiv) newdiv.style.top = "905px";
}

function generateId() {
    return "c_" + Date.now().toString(36) + "_" + Math.floor(Math.random() * 10000).toString(36);
}

function escapeHtml(str) {
    if (!str) return "";
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
