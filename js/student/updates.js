"use strict";

function renderStatusUpdates() {
    const updatesList = document.getElementById('updatesList');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const allApplications = JSON.parse(localStorage.getItem('applications')) || [];

    const processedApps = allApplications.filter(app => 
        app.username === currentUser.username && app.status !== "Pending"
    );


    if (processedApps.length === 0) {
        updatesList.innerHTML = `
            <div style="text-align:center; padding: 50px; font-family: Arial; color: #888;">
                <p>No official updates found. Your applications are currently being reviewed by the committee.</p>
            </div>`;
        return;
    }


    processedApps.reverse();


    updatesList.innerHTML = processedApps.map(app => `
        <div class="update-entry">
            <div class="update-title">
                ${app.scholarshipName}
                <span class="status-badge ${app.status === 'Accepted' ? 'status-accepted' : 'status-rejected'}">
                    ${app.status}
                </span>
            </div>
            <div class="update-body">
                <p><strong>Official Status:</strong> Your application has been <strong>${app.status.toLowerCase()}</strong>.</p>
                <p><strong>Admin Message:</strong> ${app.adminMessage || 'No additional remarks provided.'}</p>
                <p class="update-date">Date Processed: ${app.processedDate || new Date().toLocaleDateString()}</p>
            </div>
        </div>
    `).join('');
}


const logoutBtn = document.getElementById('btnLogout');
    logoutBtn?.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = "../index.html";
    });

document.addEventListener('DOMContentLoaded', () => {
    renderStatusUpdates();
    handleLogout();
});