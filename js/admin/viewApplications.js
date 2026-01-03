"use strict";

const listContainer = document.getElementById('application-list');
const rejectModal = document.getElementById('rejectModal');
let currentAppId = null;


function renderApplications() {
    const allApplications = JSON.parse(localStorage.getItem('applications')) || [];
    listContainer.innerHTML = ""; 

    if (allApplications.length === 0) {
        listContainer.innerHTML = "<tr><td colspan='4' style='text-align:center;'>No applications found.</td></tr>";
        return;
    }

    allApplications.forEach(app => {

        if (app.status === "Pending") {
            const row = `
                <tr>
                    <td>${app.firstName} ${app.lastName}</td>
                    <td>${app.scholarshipName}</td>
                    <td>${app.appliedDate}</td>
                    <td>
                        <button class="btn-view" onclick="viewStudentForm(${app.appId})">View Form</button>
                        <button class="btn-accept" onclick="updateStatus(${app.appId}, 'Accepted')">Accept</button>
                        <button class="btn-reject" onclick="openRejectModal(${app.appId})">Reject</button>
                    </td>
                </tr>
            `;
            listContainer.insertAdjacentHTML('beforeend', row);
        }
    });
}


window.viewStudentForm = function(appId) {
    const allApplications = JSON.parse(localStorage.getItem('applications')) || [];
    const student = allApplications.find(a => a.appId === appId);

    if (student) {
        const details = `
            FULL NAME: ${student.firstName} ${student.middleName} ${student.lastName}
            COURSE: ${student.course}
            YEAR LEVEL: ${student.yearLevel}
            GWA: ${student.gwa}
            SCHOOL: ${student.school}
            EMAIL: ${student.email}
            CONTACT: ${student.contact}
        `;
        alert("APPLICATION FORM DATA:\n\n" + details);
    }
};


window.updateStatus = function(appId, newStatus, message = "") {
    let allApplications = JSON.parse(localStorage.getItem('applications')) || [];
    const index = allApplications.findIndex(app => app.appId === appId);
    
    if (index !== -1) {
        allApplications[index].status = newStatus;
        allApplications[index].adminMessage = message; 
        
        localStorage.setItem('applications', JSON.stringify(allApplications));
        alert(`Application for ${allApplications[index].firstName} has been ${newStatus}`);
        renderApplications(); 
    }
};


window.openRejectModal = function(appId) {
    currentAppId = appId;
    rejectModal.style.display = 'flex';
};

window.closeModal = function() {
    rejectModal.style.display = 'none';
    document.getElementById('rejectReason').value = "";
};

window.confirmReject = function() {
    const reason = document.getElementById('rejectReason').value;
    if (currentAppId) {
        updateStatus(currentAppId, 'Rejected', reason);
        closeModal();
    }
};


document.addEventListener('DOMContentLoaded', () => {
    renderApplications();
    
    const logoutBtn = document.getElementById('btnLogout');
    logoutBtn?.addEventListener('click', () => {
        window.location.href = "../index.html";
    });
});