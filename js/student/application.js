"use strict";

const renderApplicationHistory = () => {
    const grid = document.getElementById('applicationGrid');
    if (!grid) return;

    const allApps = JSON.parse(localStorage.getItem('applications')) || [];
    const currentUser = localStorage.getItem('currentUser'); 
    grid.innerHTML = "";

    // Filter applications to only show those belonging to the current student
    const myApps = allApps.filter(app => app.username === currentUser);

    if (myApps.length === 0) {
        grid.innerHTML = `<p class="no-data" style="grid-column: 1/-1; text-align: center;">No applications found.</p>`;
        return;
    }

    myApps.forEach(app => {
        const card = document.createElement('div');
        card.className = "scholar-card";
        
        // Define the status display
        const status = app.status || 'Pending';
        const isRejected = status === 'Rejected';
        
        card.innerHTML = `
            <h3>${app.scholarshipName}</h3>
            <p class="app-message">Application Date: ${app.appliedDate || 'N/A'}</p>
            
            <div class="status-badge status-${status.toLowerCase()}" 
                 style="font-weight: bold; margin-bottom: 10px; color: ${isRejected ? '#b30000' : (status === 'Accepted' ? '#28a745' : '#f39c12')}">
                ${status}
            </div>

            ${isRejected ? `
                <div class="rejection-box" style="background: #fff5f5; border-left: 4px solid #b30000; padding: 10px; margin-bottom: 15px; font-size: 0.9rem;">
                    <strong>Reason for Rejection:</strong> ${app.adminMessage || "No additional information provided."}
                </div>
            ` : ""}

            <a href="viewApplication.html?appId=${app.appId}" class="view-link">View Full Application Form</a>
        `;

        // Click logic for the card
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