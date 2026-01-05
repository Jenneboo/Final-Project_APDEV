"use strict";

function renderStatusUpdates() {
    const updatesList = document.getElementById('updatesList');
    if (!updatesList) return;

    const storedUser = localStorage.getItem('currentUser');
    let currentUsername = "";
    
    try {
        const userObj = JSON.parse(storedUser);
        currentUsername = userObj?.username || storedUser;
    } catch (e) {
        currentUsername = storedUser;
    }

    const allApplications = JSON.parse(localStorage.getItem('applications')) || [];

    const processedApps = allApplications.filter(app => 
        app.username === currentUsername && (app.status === "Accepted" || app.status === "Rejected")
    );

    if (processedApps.length === 0) {
        updatesList.innerHTML = `<p style="text-align:center; padding: 40px; font-family: Arial;">No official updates found.</p>`;
        return;
    }

    processedApps.reverse();

    updatesList.innerHTML = processedApps.map(app => `
        <div class="update-entry">
            <div class="update-title">
                ${app.scholarshipName}
                <span class="status-badge ${app.status === 'Accepted' ? 'status-accepted' : 'status-rejected'}">
                    ${app.status.toUpperCase()}
                </span>
            </div>
            <div class="update-body">
                <p><strong>Official Status:</strong> Application ${app.status.toLowerCase()}.</p>
                <p><strong>Admin Remarks:</strong> ${app.adminMessage || 'Your application has been processed.'}</p>
                <p class="update-date">Date Processed: ${app.processedDate || new Date().toLocaleDateString()}</p>
                
                <button onclick="viewHistoryForm('${app.appId}')" class="btn-view-submission">
                    View My Submitted Form
                </button>
            </div>
        </div>
    `).join('');
}

// FIXED: Now sends appId through the URL and LocalStorage
window.viewHistoryForm = function(appId) {
    if (!appId || appId === "undefined") {
        console.error("Error: appId is missing");
        return;
    }
    
    // 1. Save to localStorage (as a backup)
    localStorage.setItem("currentViewAppId", appId);
    
    // 2. Redirect with URL Parameter (This usually fixes the "No reference found" error)
    window.location.href = `viewApplication.html?appId=${appId}`;
};

document.addEventListener('DOMContentLoaded', renderStatusUpdates);