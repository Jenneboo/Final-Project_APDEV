"use strict";

const renderStudentPortal = () => {
    const grid = document.getElementById('scholarshipGrid');
    const scholarships = JSON.parse(localStorage.getItem('scholarships')) || [];

    if (!grid) return;
    grid.innerHTML = "";

    if (scholarships.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #888;">No active scholarships available.</p>`;
        return;
    }

    scholarships.forEach(item => {
        const card = document.createElement('div');
        card.className = "scholar-card";
        
        const hasSlots = item.remainingSlots > 0;
        const slotDisplay = hasSlots 
            ? `<span class="slots-available">${item.remainingSlots}/${item.slots}</span>` 
            : `<span class="slots-empty">Not Available</span>`;

        card.innerHTML = `
            <h3>${item.name}</h3>
            <div class="details">
                <p><strong>Schedule:</strong> ${item.schedule || 'TBA'}</p>
                <p><strong>Time:</strong> ${item.time || 'TBA'}</p>
                <p><strong>Venue:</strong> ${item.venue || 'TBA'}</p>
            </div>
            <p class="slots">Slots: ${slotDisplay}</p>
            <p class="status">${item.status || 'Available'}</p>
        `;

        card.addEventListener('click', () => {
            if (hasSlots) {
                window.location.href = `scholarshipDetails.html?id=${item.id}`;
            } else {
                alert("This scholarship is currently full.");
            }
        });

        grid.appendChild(card);
    });
};

const handleSearch = () => {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    searchInput.addEventListener('keyup', () => {
        const term = searchInput.value.toLowerCase();
        document.querySelectorAll('.scholar-card').forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            card.style.display = title.includes(term) ? "block" : "none";
        });
    });
};


const logoutBtn = document.getElementById('btnLogout');
    logoutBtn?.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = "../index.html";
    });

document.addEventListener('DOMContentLoaded', () => {
    renderStudentPortal();
    handleSearch();
});