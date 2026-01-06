"use strict";

const scholarshipGrid = document.getElementById("scholarshipGrid");
const searchInput = document.getElementById("appSearch"); // Using search ID from your HTML
const logoutBtn = document.getElementById("btnLogout");

function loadReleasedFunds() {
    const applications = JSON.parse(localStorage.getItem("applications")) || [];
    const storedUser = localStorage.getItem("currentUser");

    // FIX: Extract the username safely whether it's an object or a string
    let currentUsername = "";
    try {
        const userObj = JSON.parse(storedUser);
        currentUsername = userObj.username || storedUser;
    } catch (e) {
        currentUsername = storedUser;
    }

    scholarshipGrid.innerHTML = "";

    // Filter: Uses the cleaned 'currentUsername' to find released funds
   const myReleasedFunds = applications.filter(app => {
        // We convert both to lowercase and trim spaces to ensure a perfect match
        const appUsername = String(app.username || "").toLowerCase().trim();
        const loggedUser = String(currentUsername || "").toLowerCase().trim();
        
        return appUsername === loggedUser && app.fundStatus === "Released";
    });

    if (myReleasedFunds.length === 0) {
        scholarshipGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; margin-top: 50px; color: #888;">
                <p>No fund release history found.</p>
            </div>
        `;
        return;
    }

    myReleasedFunds.forEach(app => {
        // Updated fallback values to match your Admin side defaults
        const card = `
            <div class="scholarship-card" style="border-left: 5px solid #28a745; background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); margin-bottom: 20px;">
                <h3 style="color: #28a745; margin-top: 0;">Fund Released</h3>
                <p><strong>Scholarship:</strong> ${app.scholarshipName}</p>
                <p><strong>Amount Received:</strong> ₱${app.fundAmount || "10,000"}</p>
                <p><strong>Date Disbursed:</strong> ${app.releasedDate || "N/A"}</p>
                <div style="background: #f9f9f9; padding: 15px; margin-top: 15px; border-radius: 4px; font-size: 0.9rem; border: 1px dashed #ccc; color: #444;">
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