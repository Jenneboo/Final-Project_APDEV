"use strict";


const renderApplicationHistory = () => {
    const grid = document.getElementById('applicationGrid');
    const apps = JSON.parse(localStorage.getItem('applications')) || [];

    if (!grid) return;
    grid.innerHTML = "";

    if (apps.length === 0) {
        grid.innerHTML = `<p class="no-data">No applications found.</p>`;
        return;
    }

    apps.forEach(app => {
        const card = document.createElement('div');
        card.className = "scholar-card";
        
        card.innerHTML = `
            <h3>${app.scholarshipName}</h3>
            <p class="app-message">Your application to ${app.scholarshipName} has been successfully submitted. Kindly check for updates regularly.</p>
            <div class="status-badge status-${(app.status || 'pending').toLowerCase()}">
                ${app.status || 'Pending'}
            </div>
            <a href="viewApplication.html?appId=${app.appId}" class="view-link">View Full Application Form</a>
        `;

        card.addEventListener('click', (e) => {
            if (e.target.tagName !== 'A') {
                window.location.href = `viewApplication.html?appId=${app.appId}`;
            }
        });

        grid.appendChild(card);
    });
};


const handleAppSearch = () => {
    const searchInput = document.getElementById('appSearch');
    if (!searchInput) return;

    searchInput.addEventListener('keyup', () => {
        const term = searchInput.value.toLowerCase();
        const cards = document.querySelectorAll('.scholar-card');
        
        cards.forEach(card => {
            const name = card.querySelector('h3').textContent.toLowerCase();
            card.style.display = name.includes(term) ? "block" : "none";
        });
    });
};

const logoutBtn = document.getElementById('btnLogout');
    logoutBtn?.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = "../index.html";
    });

    

document.addEventListener('DOMContentLoaded', () => {
    renderApplicationHistory();
    handleAppSearch();
});