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
        if (app.status === "Pending" || app.status === "Accepted") {
            const row = `
                <tr>
                    <td>${app.firstName} ${app.lastName}</td>
                    <td>${app.scholarshipName}</td>
                    <td>${app.appliedDate}</td>
                    <td>
                        <button class="btn-view"
                            onclick="viewStudentForm(${app.appId})">
                            View Form
                        </button>

                        ${app.status === "Pending" ? `
                            <button class="btn-accept"
                                onclick="updateStatus(${app.appId}, 'Accepted')">
                                Accept
                            </button>
                            <button class="btn-reject"
                                onclick="openRejectModal(${app.appId})">
                                Reject
                            </button>
                        ` : ""}

                        ${app.status === "Accepted" ? `
                            <button class="btn-release"
                                onclick="releaseFund(${app.appId})">
                                Release Fund
                            </button>
                        ` : ""}
                    </td>
                </tr>
            `;
            listContainer.insertAdjacentHTML("beforeend", row);
        }
    });
}


window.viewStudentForm = function (appId) {
    const apps = JSON.parse(localStorage.getItem("applications")) || [];
    const student = apps.find(a => a.appId === appId);

    if (!student) return;

    alert(`
FULL NAME: ${student.firstName} ${student.middleName || ""} ${student.lastName}
COURSE: ${student.course || "N/A"}
YEAR LEVEL: ${student.yearLevel || "N/A"}
GWA: ${student.gwa || "N/A"}
SCHOOL: ${student.school || "N/A"}
EMAIL: ${student.email || "N/A"}
CONTACT: ${student.contact || "N/A"}
    `);
};


window.updateStatus = function (appId, newStatus, message = "") {
    const apps = JSON.parse(localStorage.getItem("applications")) || [];
    const index = apps.findIndex(app => app.appId === appId);

    if (index !== -1) {
        const app = apps[index];

        
        if (newStatus === "Accepted" && app.status !== "Accepted") {
            let scholarships = JSON.parse(localStorage.getItem("scholarships")) || [];
            const schIndex = scholarships.findIndex(s => s.name === app.scholarshipName);

            if (schIndex !== -1) {
               
                if (scholarships[schIndex].remainingSlots > 0) {
                    scholarships[schIndex].remainingSlots -= 1;
                    localStorage.setItem("scholarships", JSON.stringify(scholarships));
                } else {
                    alert("No slots available for this scholarship!");
                    return; 
                }
            }
        }

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
    document.getElementById("rejectReason").value = "";
};

window.confirmReject = function () {
    const reason = document.getElementById("rejectReason").value;
    if (currentAppId) {
        updateStatus(currentAppId, "Rejected", reason);
        closeModal();
    }
};


window.releaseFund = function (appId) {
    const apps = JSON.parse(localStorage.getItem("applications")) || [];
    const index = apps.findIndex(app => app.appId === appId);

    if (index !== -1) {
        apps[index].fundStatus = "Released";
        localStorage.setItem("applications", JSON.stringify(apps));
        alert("Fund released successfully");
        renderApplications();
    }
};


document.addEventListener("DOMContentLoaded", () => {
    renderApplications();

    document.getElementById("btnLogout")?.addEventListener("click", () => {
        window.location.href = "../index.html";
    });
});
const logoutBtn = document.getElementById('btnLogout');
    logoutBtn?.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = "../index.html";
    });
