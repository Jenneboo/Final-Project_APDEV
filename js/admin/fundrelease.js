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
                <td colspan="4" class="no-data" style="text-align:center; padding: 20px;">
                    No funds pending for release.
                </td>
            </tr>`;
        return;
    }

    accepted.forEach(app => {
        const row = `
            <tr>
                <td>${app.firstName} ${app.lastName}</td>
                <td>${app.scholarshipName}</td>
                <td>${app.appliedDate}</td>
                <td>
                    <button class="btn-view" onclick="viewDetails(${app.appId})">
                        View Form
                    </button>
                    <button class="btn-release" onclick="openReleaseModal(${app.appId})">
                        Release
                    </button>
                </td>
            </tr>`;
        listContainer.insertAdjacentHTML("beforeend", row);
    });
}


window.viewDetails = function (id) {
    localStorage.setItem("currentViewAppId", id);
    window.location.href = "viewForm.html";
};

window.openReleaseModal = function (id) {
    currentAppId = id;
    if (releaseModal) releaseModal.style.display = "flex";
};

window.closeReleaseModal = function () {
    if (releaseModal) releaseModal.style.display = "none";
    const noteInput = document.getElementById("releaseNote");
    if (noteInput) noteInput.value = "";
};

window.confirmRelease = function () {
    const noteInput = document.getElementById("releaseNote");
   
    const amountInput = document.getElementById("releaseAmount"); 
    
    const note = noteInput ? noteInput.value.trim() : "";
    const amount = (amountInput && amountInput.value) ? amountInput.value : "10,000"; 
    
    const apps = JSON.parse(localStorage.getItem("applications")) || [];
    const index = apps.findIndex(a => a.appId === currentAppId);

    if (index !== -1) {
      
        apps[index].fundStatus = "Released";
        
       
        apps[index].releasedDate = new Date().toLocaleDateString("en-US", {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        apps[index].releaseNote = note || "Your scholarship fund has been processed.";
        apps[index].fundAmount = amount; 

     
        console.log("Releasing for user:", apps[index].username);

       
        localStorage.setItem("applications", JSON.stringify(apps));

        alert(`Funds successfully released for ${apps[index].firstName}!`);
        
        closeReleaseModal();
        renderFundReleaseList(); 
    } else {
        alert("Error: Application not found.");
    }
};


document.addEventListener("DOMContentLoaded", () => {
    renderFundReleaseList();

    const logoutBtn = document.getElementById("btnLogout");
    logoutBtn?.addEventListener("click", () => {
        localStorage.removeItem("currentUser");
        window.location.href = "../index.html";
    });
});