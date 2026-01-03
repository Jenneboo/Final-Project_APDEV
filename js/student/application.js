"use strict";

const renderApplicationHistory = () => {
    const grid = document.getElementById('applicationGrid');
    if (!grid) return;

    const allApps = JSON.parse(localStorage.getItem('applications')) || [];
    const currentUser = localStorage.getItem('currentUser'); 
    grid.innerHTML = "";

    const myApps = allApps.filter(app => app.username === currentUser);

    if (myApps.length === 0) {
        grid.innerHTML = `<p class="no-data">No applications found.</p>`;
        return;
    }

    myApps.forEach(app => {
        const card = document.createElement('div');
        card.className = "scholar-card";
        card.innerHTML = `
            <h3>${app.scholarshipName}</h3>
            <p class="app-message">Your application has been successfully submitted.</p>
            <div class="status-badge status-${(app.status || 'pending').toLowerCase()}">
                ${app.status || 'Pending'}
            </div>
            <a href="viewApplication.html?appId=${app.appId}" class="view-link">View Full Application Form</a>
        `;

        card.onclick = (e) => {
            if (e.target.tagName !== 'A') window.location.href = `viewApplication.html?appId=${app.appId}`;
        };
        grid.appendChild(card);
    });
};

const handleAppSearch = () => {
    const searchInput = document.getElementById('appSearch');
    if (!searchInput) return;

    searchInput.onkeyup = () => {
        const term = searchInput.value.toLowerCase();
        document.querySelectorAll('.scholar-card').forEach(card => {
            const name = card.querySelector('h3').textContent.toLowerCase();
            card.style.display = name.includes(term) ? "block" : "none";
        });
    };
};

document.addEventListener('DOMContentLoaded', () => {
    renderApplicationHistory();
    handleAppSearch();
    
    document.getElementById('btnLogout')?.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = "../index.html";
    });
});