"use strict";


const scholarshipGrid = document.getElementById("scholarshipGrid");
const searchInput = document.getElementById("searchInput");
const logoutBtn = document.getElementById("btnLogout");

function loadScholarships() {
    const scholarships =
        JSON.parse(localStorage.getItem("scholarships")) || [];

    scholarshipGrid.innerHTML = "";

    if (scholarships.length === 0) {
        scholarshipGrid.innerHTML = `
            <p class="no-data">No scholarship programs available.</p>
        `;
        return;
    }

    scholarships.forEach(sch => {
        const card = `
            <div class="scholarship-card">
                <h3>${sch.name}</h3>
                <p><strong>Provider:</strong> ${sch.provider || "N/A"}</p>
                <p><strong>Amount:</strong> ₱${sch.amount?.toLocaleString() || "N/A"}</p>
                <p><strong>Slots:</strong> ${sch.slots || "N/A"}</p>
                <button class="btn-apply" onclick="viewScholarship(${sch.id})">
                    View Details
                </button>
            </div>
        `;
        scholarshipGrid.insertAdjacentHTML("beforeend", card);
    });
}

window.viewScholarship = function (id) {
    localStorage.setItem("selectedScholarshipId", id);
    window.location.href = "applications.html";
};

searchInput.addEventListener("input", function () {
    const keyword = this.value.toLowerCase();
    const cards = document.querySelectorAll(".scholarship-card");

    cards.forEach(card => {
        const title = card.querySelector("h3").textContent.toLowerCase();
        card.style.display = title.includes(keyword) ? "block" : "none";
    });
});

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("loggedInStudentEmail");
    window.location.href = "../index.html";
});

document.addEventListener("DOMContentLoaded", loadScholarships);
