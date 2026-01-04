"use strict";

document.addEventListener('DOMContentLoaded', () => {
    const user = localStorage.getItem('currentUser') || "student";
    const profileKey = `profile_${user}`;
    
    const scholarshipGrid = document.getElementById('scholarship-grid');
    const statsTotal = document.getElementById('stat-total');

    const loadProfile = () => {
        const data = JSON.parse(localStorage.getItem(profileKey)) || {};
        ['firstName', 'lastName', 'course', 'year', 'address'].forEach(id => {
            const el = document.getElementById(`p-${id}`);
            if (el) el.value = data[id] || "";
        });
    };

    document.getElementById('profileForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const profileData = {
            firstName: document.getElementById('p-firstName').value,
            lastName: document.getElementById('p-lastName').value,
            course: document.getElementById('p-course').value,
            year: document.getElementById('p-year').value,
            address: document.getElementById('p-address').value
        };
        localStorage.setItem(profileKey, JSON.stringify(profileData));
        alert("Profile updated successfully!");
    });

    const renderScholarships = () => {
        const scholarships = JSON.parse(localStorage.getItem('scholarships')) || [];
        const available = scholarships.filter(s => s.status === "Available");

        const countEl = document.getElementById('available-count');
        if (countEl) countEl.textContent = `${available.length} programs found`;
        
        if (!scholarshipGrid) return;

        scholarshipGrid.innerHTML = available.length ? "" : "<p class='no-data'>No scholarships available.</p>";

        available.forEach(s => {
            const card = document.createElement('div');
            card.className = 'mini-scholarship-card';
            card.innerHTML = `
                <div class="card-details">
                    <h4>${s.name}</h4>
                    <span>${s.remainingSlots} slots remaining</span>
                </div>
            `;
            scholarshipGrid.appendChild(card);
        });
    };

    const allApps = JSON.parse(localStorage.getItem('applications')) || [];
    if (statsTotal) {
        const count = allApps.filter(a => a.username === user).length;
        statsTotal.textContent = count;
    }

   const logoutBtn = document.getElementById('btnLogout');
    logoutBtn?.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = "../index.html";

    });

    loadProfile();
    renderScholarships();
});