"use strict";

function loadReleasedFunds() {
    
    const scholarshipGrid = document.getElementById("scholarshipGrid");
    const applications = JSON.parse(localStorage.getItem("applications")) || [];
    
  
    const currentUsername = localStorage.getItem("currentUser");

    if (!scholarshipGrid) return;
    scholarshipGrid.innerHTML = "";

    
    const myReleasedFunds = applications.filter(app => {
        const appUser = String(app.username || "").toLowerCase().trim();
        const loggedInUser = String(currentUsername || "").toLowerCase().trim();
        
   
        return appUser === loggedInUser && app.fundStatus === "Released";
    });

  
    if (myReleasedFunds.length === 0) {
        scholarshipGrid.innerHTML = `
            <div class="no-announcement">
                <h3>No Fund Release Announcement</h3>
                <p>
                    You currently have no fund release announcements. 
                    Please wait for the administrator’s evaluation.
                </p>
            </div>`;
        return;
    }

   
    myReleasedFunds.forEach(app => {
        const card = `
            <div class="announcement">
                <span class="badge">Qualified</span>
                <h3>Scholarship Fund Release</h3>
                <p class="details">
                    Congratulations! You have been <strong>qualified by the administrator</strong>
                    to receive your scholarship fund.
                </p>
                <p class="details">
                    <strong>Scholarship Type:</strong> ${app.scholarshipName} <br>
                    <strong>Amount:</strong> <span class="amount">₱${app.fundAmount || "10,000"}</span>
                </p>
                <div style="background: #f0fdf4; padding: 10px; border-radius: 5px; margin: 10px 0; border: 1px dashed #22c55e; font-size: 0.9rem;">
                    <strong>Admin Note:</strong> ${app.releaseNote || "Your scholarship fund has been processed."}
                </div>
                <p class="details">
                    Please visit the <strong>Accounting Office</strong> and bring a valid ID
                    to claim your fund.
                </p>
                <p class="date">
                    Announcement Date: ${app.releasedDate || new Date().toLocaleDateString()}
                </p>
            </div>`;
        scholarshipGrid.insertAdjacentHTML("beforeend", card);
    });
}


const logoutBtn = document.getElementById('btnLogout');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        
 
        window.location.href = "../index.html";
    });
}


document.addEventListener("DOMContentLoaded", loadReleasedFunds);