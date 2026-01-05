"use strict";

const scholarshipGrid = document.getElementById("scholarshipGrid");
const searchInput = document.getElementById("appSearch"); // Using search ID from your HTML
const logoutBtn = document.getElementById("btnLogout");

function loadReleasedFunds() {
    const applications = JSON.parse(localStorage.getItem("applications")) || [];
    const currentUser = localStorage.getItem("currentUser");

    scholarshipGrid.innerHTML = "";

    // Filter: Only show items where funds were officially released to THIS student
    const myReleasedFunds = applications.filter(app => 
        app.username === currentUser && app.fundStatus === "Released"
    );

    if (myReleasedFunds.length === 0) {
        scholarshipGrid.innerHTML = `
            <p class="no-data" style="grid-column: 1/-1; text-align: center; margin-top: 50px;">
                No fund release history found.
            </p>
        `;
        return;
    }

    myReleasedFunds.forEach(app => {
        const card = `
            <div class="scholarship-card" style="border-left: 5px solid #28a745;">
                <h3 style="color: #28a745;">Fund Released</h3>
                <p><strong>Scholarship:</strong> ${app.scholarshipName}</p>
                <p><strong>Amount Received:</strong> ₱${app.fundAmount || "N/A"}</p>
                <p><strong>Date Disbursed:</strong> ${app.releasedDate || "N/A"}</p>
                <div style="background: #f9f9f9; padding: 10px; margin-top: 10px; border-radius: 4px; font-size: 0.85rem; border: 1px dashed #ccc;">
                    <strong>Admin Note:</strong> ${app.releaseNote || "Your scholarship fund has been processed."}
                </div>
            </div>
        `;
        scholarshipGrid.insertAdjacentHTML("beforeend", card);
    });
}

// Search functionality for release history
searchInput?.addEventListener("input", function () {
    const keyword = this.value.toLowerCase();
    const cards = document.querySelectorAll(".scholarship-card");

    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(keyword) ? "block" : "none";
    });
});

logoutBtn?.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "../index.html";
});

document.addEventListener("DOMContentLoaded", loadReleasedFunds);