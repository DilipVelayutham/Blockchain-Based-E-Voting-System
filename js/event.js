const EVENTS_KEY = "pollbooth_events_v1";
const VOTE_KEY = "pollbooth_votes_v1";

const params = new URLSearchParams(window.location.search);
const eventId = params.get("event");
const commId = params.get("comm");

const titleEl = document.getElementById("event-title");
const descEl = document.getElementById("event-desc");
const imgEl = document.getElementById("event-img");
const endEl = document.getElementById("event-end");

const voteForm = document.getElementById("vote-form");
const voteBtn = document.getElementById("vote-btn");
const voteArea = document.getElementById("vote-area");
const resultArea = document.getElementById("result-area");
const resultsEl = document.getElementById("results");

let eventObj;
let votes = loadVotes();

init();

function init(){
  const events = JSON.parse(localStorage.getItem(EVENTS_KEY) || "{}");
  eventObj = (events[commId] || []).find(e => e.id === eventId);

  if(!eventObj){
    alert("Event not found");
    return;
  }

  titleEl.textContent = eventObj.title;
  descEl.textContent = eventObj.desc || "";
  imgEl.src = eventObj.image || "assets/images/event.jpg";
  endEl.textContent = "Ends: " + (eventObj.endDate ? new Date(eventObj.endDate).toDateString() : "—");

  renderOptions();

  if(hasVoted()){
    showResults();
  }
}

function renderOptions(){
  eventObj.options.forEach((opt, i)=>{
    const label = document.createElement("label");
    label.className = "option";
    label.innerHTML = `
      <input type="radio" name="vote" value="${i}" />
      ${opt}
    `;
    voteForm.appendChild(label);
  });
}

voteBtn.addEventListener("click", ()=>{
  const selected = voteForm.querySelector("input[name=vote]:checked");
  if(!selected){
    alert("Please select an option");
    return;
  }

  if(!votes[eventId]){
    votes[eventId] = Array(eventObj.options.length).fill(0);
  }

  votes[eventId][selected.value]++;
  votes["_voted_"+eventId] = true;

  saveVotes(votes);
  showResults();
});

function showResults(){
  voteArea.classList.add("hidden");
  resultArea.classList.remove("hidden");

  const counts = votes[eventId] || [];
  const total = counts.reduce((a,b)=>a+b,0) || 1;

  resultsEl.innerHTML = "";

  eventObj.options.forEach((opt, i)=>{
    const percent = Math.round((counts[i] || 0) * 100 / total);
    resultsEl.innerHTML += `
      <div class="result-bar">
        <strong>${opt} (${percent}%)</strong>
        <div class="bar">
          <div class="fill" style="width:${percent}%"></div>
        </div>
      </div>
    `;
  });
}

function hasVoted(){
  return votes["_voted_"+eventId];
}

function loadVotes(){
  return JSON.parse(localStorage.getItem(VOTE_KEY) || "{}");
}

function saveVotes(v){
  localStorage.setItem(VOTE_KEY, JSON.stringify(v));
}
