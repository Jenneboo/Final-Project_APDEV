"use strict";

document.addEventListener("DOMContentLoaded", () => {
    renderSlotTable();

   
    const logoutBtn = document.getElementById('btnLogout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            window.location.href = "../index.html";
        });
    }
});

function renderSlotTable() {
    const tableBody = document.getElementById("slot-table-body");
    const scholarships = JSON.parse(localStorage.getItem("scholarships")) || [];
    
    let totalSlots = 0;

    tableBody.innerHTML = "";

    if (scholarships.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='4' style='text-align:center;'>No scholarships found.</td></tr>";
    }

    scholarships.forEach(sch => {
        const total = sch.slots || 0;
        const remaining = sch.remainingSlots ?? total;
        const percentage = total > 0 ? (remaining / total) * 100 : 0;
        
        totalSlots += remaining;

        
        let barColor = "#10b981"; 
        if (percentage < 20) barColor = "#ef4444"; 
        else if (percentage < 50) barColor = "#f59e0b"; 

        const isFull = remaining <= 0;

        const row = `
            <tr>
                <td><strong>${sch.name}</strong></td>
                <td>${total}</td>
                <td>
                    <div style="display:flex; justify-content: space-between; font-size: 0.85rem;">
                        <span>${remaining} left</span>
                        <span>${Math.round(percentage)}%</span>
                    </div>
                    <div class="progress-container">
                        <div class="progress-bar" style="width: ${percentage}%; background-color: ${barColor};"></div>
                    </div>
                </td>
                <td>
                    <span class="status-tag ${isFull ? 'status-rejected' : 'status-accepted'}">
                        ${isFull ? "FULL" : "ACTIVE"}
                    </span>
                </td>
            </tr>
        `;
        tableBody.insertAdjacentHTML("beforeend", row);
    });

    
    const totalSchEl = document.getElementById("total-scholarships");
    const totalSlotsEl = document.getElementById("total-slots");

    if (totalSchEl) totalSchEl.textContent = scholarships.length;
    if (totalSlotsEl) totalSlotsEl.textContent = totalSlots;
}