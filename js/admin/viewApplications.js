"use strict";

const listContainer = document.getElementById("application-list");
const rejectModal = document.getElementById("rejectModal");
let currentAppId = null;

function renderApplications() {
    const allApplications = JSON.parse(localStorage.getItem("applications")) || [];
    listContainer.innerHTML = "";

    if (allApplications.length === 0) {
        listContainer.innerHTML =
            "<tr><td colspan='4' style='text-align:center;'>No applications found.</td></tr>";
        return;
    }

    allApplications.forEach(app => {
        let actionContent = "";

        // 1. Always include the View Form button
        const viewBtn = `
            <button class="btn-view" onclick="viewStudentForm(${app.appId})">
                View Form
            </button>`;

        // 2. Determine what goes next to the View Form button
        if (app.status === "Pending") {
            actionContent = `
                ${viewBtn}
                <button class="btn-accept" onclick="updateStatus(${app.appId}, 'Accepted')">Accept</button>
                <button class="btn-reject" onclick="openRejectModal(${app.appId})">Reject</button>
            `;
        } else if (app.status === "Accepted") {
            // FIXED: Now shows the green Accepted label next to View Form
            actionContent = `
                ${viewBtn}
                <span style="color: #28a745; font-weight: bold; margin-left: 10px;">Accepted</span>
            `;
        } else if (app.status === "Rejected") {
            // View Form stays, but show the word "Rejected" instead of buttons
            actionContent = `
                ${viewBtn}
                <span style="color: #b30000; font-weight: bold; margin-left: 10px;">Rejected</span>
            `;
        }

        const row = `
            <tr>
                <td>${app.firstName} ${app.lastName}</td>
                <td>${app.scholarshipName}</td>
                <td>${app.appliedDate}</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        ${actionContent}
                    </div>
                </td>
            </tr>
        `;
        listContainer.insertAdjacentHTML("beforeend", row);
    });
}

/* --- REDIRECT TO VIEW FORM --- */
window.viewStudentForm = function (appId) {
    localStorage.setItem("currentViewAppId", appId);
    window.location.href = "viewForm.html";
};

/* UPDATE STATUS */
window.updateStatus = function (appId, newStatus, message = "") {
    const apps = JSON.parse(localStorage.getItem("applications")) || [];
    const index = apps.findIndex(app => app.appId === appId);

    if (index !== -1) {
        apps[index].status = newStatus;
        apps[index].adminMessage = message;

        localStorage.setItem("applications", JSON.stringify(apps));
        renderApplications(); // This refreshes the table instantly
    }
};

/* REJECT MODAL LOGIC */
window.openRejectModal = function (appId) {
    currentAppId = appId;
    rejectModal.style.display = "flex";
};

window.closeModal = function () {
    rejectModal.style.display = "none";
    const reasonInput = document.getElementById("rejectReason");
    if(reasonInput) reasonInput.value = "";
};

window.confirmReject = function () {
    const reason = document.getElementById("rejectReason").value;
    if (currentAppId) {
        updateStatus(currentAppId, "Rejected", reason);
        closeModal();
    }
};

/* INIT & LOGOUT */
document.addEventListener("DOMContentLoaded", () => {
    renderApplications();

    const logoutBtn = document.getElementById('btnLogout');
    logoutBtn?.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = "../index.html";
    });
});