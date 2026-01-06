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

     
        const viewBtn = `
            <button class="btn-view" onclick="viewStudentForm(${app.appId})">
                View Form
            </button>`;

    
        if (app.status === "Pending") {
            actionContent = `
                ${viewBtn}
                <button class="btn-accept" onclick="updateStatus(${app.appId}, 'Accepted')">Accept</button>
                <button class="btn-reject" onclick="openRejectModal(${app.appId})">Reject</button>
            `;
        } else if (app.status === "Accepted") {
            
            actionContent = `
                ${viewBtn}
                <span style="color: #28a745; font-weight: bold; margin-left: 10px;">Accepted</span>
            `;
        } else if (app.status === "Rejected") {
           
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


window.viewStudentForm = function (appId) {
    localStorage.setItem("currentViewAppId", appId);
    window.location.href = "viewForm.html";
};


window.updateStatus = function (appId, newStatus, message = "") {
    const apps = JSON.parse(localStorage.getItem("applications")) || [];
    const index = apps.findIndex(app => app.appId === appId);

    if (index !== -1) {
        apps[index].status = newStatus;
        apps[index].adminMessage = message;

        localStorage.setItem("applications", JSON.stringify(apps));
        renderApplications(); 
    }
};


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


document.addEventListener("DOMContentLoaded", () => {
    renderApplications();

    const logoutBtn = document.getElementById('btnLogout');
    logoutBtn?.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = "../index.html";
    });
});