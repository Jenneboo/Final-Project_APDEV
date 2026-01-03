"use strict";

const getScholarships = () => JSON.parse(localStorage.getItem('scholarships')) || [];
const saveScholarships = (data) => localStorage.setItem('scholarships', JSON.stringify(data));

let isRemoveMode = false;
let selectedIds = new Set();
const renderScholarships = () => {
    const listContainer = document.getElementById('program-list');
    if (!listContainer) return;

    const scholarships = getScholarships();
    listContainer.innerHTML = ""; 

    scholarships.forEach((item, index) => {
        const card = document.createElement('div');
        const bgColorClass = index % 2 !== 0 ? "bg-red" : "";
        card.className = `program-card ${bgColorClass} ${isRemoveMode ? 'remove-mode' : ''}`;
        

        const checkboxHtml = isRemoveMode 
            ? `<input type="checkbox" class="delete-checkbox" ${selectedIds.has(item.id) ? 'checked' : ''}>` 
            : '';

        card.innerHTML = `${checkboxHtml} <span>${item.name}</span>`;

        card.addEventListener('click', (e) => {
            if (isRemoveMode) {
                if (selectedIds.has(item.id)) {
                    selectedIds.delete(item.id);
                } else {
                    selectedIds.add(item.id);
                }
                renderScholarships(); 
            } else {
                window.location.href = `editScholarship.html?id=${item.id}`;
            }
        });

        listContainer.appendChild(card);
    });
};

document.addEventListener('DOMContentLoaded', () => {
    renderScholarships();

    const addBtn = document.getElementById('addScholarshipBtn');
    const removeBtn = document.getElementById('removeScholarshipBtn');
    const modal = document.getElementById('deleteModal');
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    const cancelBtn = document.getElementById('cancelDeleteBtn');
    

    const logoutBtn = document.getElementById('btnLogout');
    logoutBtn?.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = "../index.html";
    });


    addBtn?.addEventListener('click', () => window.location.href = "editScholarship.html");

    removeBtn?.addEventListener('click', () => {
        if (isRemoveMode) {
            if (selectedIds.size > 0) {
                modal.style.display = "flex"; 
            } else {
                isRemoveMode = false;
                toggleRemoveUI(removeBtn);
            }
        } else {
            isRemoveMode = true;
            toggleRemoveUI(removeBtn);
        }
        renderScholarships();
    });

    confirmBtn?.addEventListener('click', () => {
        const updatedList = getScholarships().filter(s => !selectedIds.has(s.id));
        saveScholarships(updatedList);
        selectedIds.clear();
        isRemoveMode = false;
        modal.style.display = "none";
        toggleRemoveUI(removeBtn);
        renderScholarships();
    });

    cancelBtn?.addEventListener('click', () => {
        modal.style.display = "none";
    });
});


const toggleRemoveUI = (btn) => {
    if (isRemoveMode) {
        btn.textContent = "CONFIRM DELETE";
        btn.style.background = "#000";
    } else {
        btn.textContent = "- Remove";
        btn.style.background = "#b30000";
        selectedIds.clear();
    }
};