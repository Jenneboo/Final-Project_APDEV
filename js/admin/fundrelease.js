"use strict";

const listContainer = document.getElementById("fund-release-list");
const releaseModal = document.getElementById("releaseModal");
let currentAppId = null;

function renderFundReleaseList() {
    const apps = JSON.parse(localStorage.getItem("applications")) || [];
    listContainer.innerHTML = "";

    const accepted = apps.filter(app =>
        app.status === "Accepted" && app.fundStatus !== "Released"
    );

    if (accepted.length === 0) {
        listContainer.innerHTML = `
            <tr>
                <td colspan="4" class="no-data">
                    No funds pending for release.
                </td>
            </tr>`;
        return;
    }

    accepted.forEach(app => {
        listContainer.innerHTML += `
            <tr>
                <td>${app.firstName} ${app.lastName}</td>
                <td>${app.scholarshipName}</td>
                <td>${app.appliedDate}</td>
                <td>
                    <button class="btn-view" onclick="viewDetails(${app.appId})">
                        View
                    </button>
                    <button class="btn-release" onclick="openReleaseModal(${app.appId})">
                        Release
                    </button>
                </td>
            </tr>`;
    });
}

window.viewDetails = function (id) {
    const apps = JSON.parse(localStorage.getItem("applications")) || [];
    const app = apps.find(a => a.appId === id);

    if (!app) return;

    alert(`
Name: ${app.firstName} ${app.lastName}
Scholarship: ${app.scholarshipName}
Amount: ₱${app.fundAmount || "N/A"}
Status: ${app.status}
    `);
};

window.openReleaseModal = function (id) {
    currentAppId = id;
    releaseModal.style.display = "flex";
};

window.closeReleaseModal = function () {
    releaseModal.style.display = "none";
    document.getElementById("releaseNote").value = "";
};

window.confirmRelease = function () {
    const note = document.getElementById("releaseNote").value;
    const apps = JSON.parse(localStorage.getItem("applications")) || [];

    const index = apps.findIndex(a => a.appId === currentAppId);
    if (index === -1) return;

    apps[index].fundStatus = "Released";
    apps[index].releasedDate = new Date().toLocaleDateString();
    apps[index].releaseNote = note;

    localStorage.setItem("applications", JSON.stringify(apps));

    closeReleaseModal();
    renderFundReleaseList();
};

document.addEventListener("DOMContentLoaded", () => {
    renderFundReleaseList();

    document.getElementById("btnLogout")?.addEventListener("click", () => {
        window.location.href = "../index.html";
    });
});
