"use strict";

const loadScholarshipDetails = () => {
    const params = new URLSearchParams(window.location.search);
    const scholarshipId = params.get('id');
    const applyBtn = document.getElementById('applyBtn');
    if (!scholarshipId) return;

    const data = JSON.parse(localStorage.getItem('scholarships')) || [];
    const item = data.find(s => s.id == scholarshipId);

    if (item) {
        document.getElementById('view-name').textContent = item.name;
        document.getElementById('view-description').textContent = item.description || "No description provided.";
        document.getElementById('view-schedule').textContent = item.schedule || "TBA";
        document.getElementById('view-venue').textContent = item.venue || "TBA";
        document.getElementById('view-time').textContent = item.time || "TBA";

        const setBullets = (text, elementId) => {
            const container = document.getElementById(elementId);
            container.innerHTML = ""; 
            if (!text || text.trim() === "N/A") {
                container.innerHTML = "<li>Information not provided.</li>";
                return;
            }
            text.split('\n').filter(line => line.trim() !== "").forEach(line => {
                const li = document.createElement('li');
                li.textContent = line.trim();
                container.appendChild(li);
            });
        };

        setBullets(item.eligibility, 'view-eligibility');
        setBullets(item.requirements, 'view-requirements');

        if (applyBtn) {
            const allApplications = JSON.parse(localStorage.getItem('applications')) || [];
            const hasAlreadyApplied = allApplications.some(app => app.scholarshipId == scholarshipId);

            if (hasAlreadyApplied) {
                applyBtn.textContent = "Already Applied";
                applyBtn.disabled = true;
                applyBtn.style.background = "#888";
                applyBtn.style.cursor = "not-allowed";
            } else if (item.remainingSlots <= 0) {
                applyBtn.textContent = "Slots Full";
                applyBtn.disabled = true;
                applyBtn.classList.add('disabled');
            } else {
                applyBtn.addEventListener('click', () => {
                    window.location.href = `apply.html?id=${scholarshipId}`;
                });
            }
        }
    }
};

document.addEventListener('DOMContentLoaded', loadScholarshipDetails);

