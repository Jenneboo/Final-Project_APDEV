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

        const nameEl = document.getElementById('d-name');
        if (nameEl) nameEl.textContent = data.firstName ? `${data.firstName} ${data.lastName}` : "No Name Set";

        const courseEl = document.getElementById('d-course');
        if (courseEl) courseEl.textContent = data.course || "No Course Set";

        const yearEl = document.getElementById('d-year');
        if (yearEl) yearEl.textContent = data.year || "No Year Set";

        const addressEl = document.getElementById('d-address');
        if (addressEl) addressEl.textContent = data.address || "No Address Set";
    };


    const editBtn = document.getElementById('btnEditProfile');
    const profileForm = document.getElementById('profileForm');
    const profileDisplay = document.getElementById('profileDisplay');
    const cancelBtn = document.getElementById('btnCancel');

    editBtn?.addEventListener('click', () => {
        profileDisplay.style.display = 'none';
        profileForm.style.display = 'block';
        editBtn.style.display = 'none';
    });

    cancelBtn?.addEventListener('click', () => {
        profileDisplay.style.display = 'block';
        profileForm.style.display = 'none';
        editBtn.style.display = 'block';
    });

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
        
        loadProfile();
        profileDisplay.style.display = 'block';
        profileForm.style.display = 'none';
        if(editBtn) editBtn.style.display = 'block';
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