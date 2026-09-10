const form = document.getElementById("applicationForm");
const applicationList = document.getElementById("applicationList");
const searchInput = document.getElementById("searchInput");
const filterStatus = document.getElementById("filterStatus");

const totalCount = document.getElementById("totalCount");
const interviewCount = document.getElementById("interviewCount");
const offerCount = document.getElementById("offerCount");

let applications =
    JSON.parse(localStorage.getItem("applications")) || [];


function saveApplications() {
    localStorage.setItem(
        "applications",
        JSON.stringify(applications)
    );
}


function updateStats() {
    totalCount.textContent = applications.length;

    interviewCount.textContent = applications.filter(
        application => application.status === "Interview"
    ).length;

    offerCount.textContent = applications.filter(
        application => application.status === "Offer"
    ).length;
}


function renderApplications() {
    applicationList.innerHTML = "";

    const searchTerm = searchInput.value.toLowerCase();
    const selectedStatus = filterStatus.value;

    const filteredApplications = applications.filter(application => {
        const matchesSearch =
            application.company.toLowerCase().includes(searchTerm) ||
            application.position.toLowerCase().includes(searchTerm);

        const matchesStatus =
            selectedStatus === "All" ||
            application.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    if (filteredApplications.length === 0) {
        applicationList.innerHTML =
            '<p class="empty-message">No applications found.</p>';

        updateStats();
        return;
    }

    filteredApplications.forEach(application => {
        const card = document.createElement("div");
        card.className = "application-card";

        card.innerHTML = `
            <p class="company-name">${application.company}</p>
            <p>${application.position}</p>

            <select
                class="status-select"
                data-id="${application.id}"
            >
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
            </select>

            <p>${application.date}</p>

            <button
                class="delete-button"
                data-id="${application.id}"
            >
                Delete
            </button>
        `;

        const statusSelect = card.querySelector(".status-select");
        statusSelect.value = application.status;

        applicationList.appendChild(card);
    });

    updateStats();
}


function addApplication(event) {
    event.preventDefault();

    const company =
        document.getElementById("company").value.trim();

    const position =
        document.getElementById("position").value.trim();

    const status =
        document.getElementById("status").value;

    const date =
        document.getElementById("date").value;

    const application = {
        id: Date.now(),
        company,
        position,
        status,
        date
    };

    applications.push(application);

    saveApplications();
    renderApplications();

    form.reset();
}


function deleteApplication(id) {
    applications = applications.filter(
        application => application.id !== id
    );

    saveApplications();
    renderApplications();
}


function updateApplicationStatus(id, newStatus) {
    const application = applications.find(
        application => application.id === id
    );

    if (application) {
        application.status = newStatus;
        saveApplications();
        renderApplications();
    }
}


form.addEventListener("submit", addApplication);

searchInput.addEventListener("input", renderApplications);

filterStatus.addEventListener("change", renderApplications);


applicationList.addEventListener("click", event => {
    if (event.target.classList.contains("delete-button")) {
        const id = Number(event.target.dataset.id);
        deleteApplication(id);
    }
});


applicationList.addEventListener("change", event => {
    if (event.target.classList.contains("status-select")) {
        const id = Number(event.target.dataset.id);

        updateApplicationStatus(
            id,
            event.target.value
        );
    }
});


renderApplications();