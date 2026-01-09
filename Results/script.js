const eventList = document.getElementById("event-list");

// Simulated events
let events = [
    { id: 1, name: "Opening Ceremony", time: "10:00 AM" },
    { id: 2, name: "Tech Talk", time: "12:00 PM" }
];

// Function to render events
function renderEvents() {
    eventList.innerHTML = "";
    events.forEach(event => {
        const li = document.createElement("li");
        li.textContent = `${event.name} - ${event.time}`;
        eventList.appendChild(li);
    });
}

// Function to simulate adding a new event
function addEvent() {
    const newEvent = {
        id: events.length + 1,
        name: `New Event ${events.length + 1}`,
        time: `${10 + events.length}:00 AM`
    };
    events.push(newEvent);
    renderEvents();
}

// Initial rendering
renderEvents();

// Simulate real-time updates (e.g., from a server)
setInterval(() => {
    fetchNewEvents();
}, 5000);

// Function to fetch new events (Simulated API Call)
function fetchNewEvents() {
    // Simulated new event added from backend
    if (Math.random() > 0.7) { // Simulating random new event additions
        addEvent();
    }
}
