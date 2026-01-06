"use strict";

const renderApplicationHistory = () => {
    const grid = document.getElementById('applicationGrid');
    if (!grid) return;

    const allApps = JSON.parse(localStorage.getItem('applications')) || [];
    const currentUser = localStorage.getItem('currentUser'); 
    grid.innerHTML = "";

    
    const pendingApps = allApps.filter(app => 
        app.username === currentUser && (!app.status || app.status === 'Pending')
    );

    if (pendingApps.length === 0) {
        grid.innerHTML = `<p class="no-data" style="grid-column: 1/-1; text-align: center; padding: 40px; color: #888;">No active applications pending review.</p>`;
        return;
    }

    pendingApps.forEach(app => {
        const card = document.createElement('div');
        card.className = "scholar-card";
        
        card.innerHTML = `
            <h3>${app.scholarshipName}</h3>
            <p class="app-message">Application Date: ${app.appliedDate || 'N/A'}</p>
            
            <div class="status-badge" style="font-weight: bold; margin-bottom: 10px; color: #f39c12;">
                Status: Pending Review
            </div>

            <a href="viewApplication.html?appId=${app.appId}" class="view-link">View Submitted Form</a>
        `;

        
        card.onclick = (e) => {
            if (e.target.tagName !== 'A') {
                localStorage.setItem("currentViewAppId", app.appId);
                window.location.href = `viewApplication.html?appId=${app.appId}`;
            }
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