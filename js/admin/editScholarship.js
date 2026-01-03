"use strict";

const scholarshipForm = document.getElementById('scholarshipForm');
const urlParameters = new URLSearchParams(window.location.search);
const editId = urlParameters.get('id');


const loadExistingData = () => {
    if (!editId) return;

    document.getElementById('formTitle').textContent = "Edit Scholarship";
    const scholarshipData = JSON.parse(localStorage.getItem('scholarships')) || [];
    const selectedItem = scholarshipData.find(item => item.id == editId);

    if (selectedItem) {
        document.getElementById('name').value = selectedItem.name;
        document.getElementById('description').value = selectedItem.description || "";
        document.getElementById('eligibility').value = selectedItem.eligibility || "";
        document.getElementById('schedule').value = selectedItem.schedule;
        document.getElementById('venue').value = selectedItem.venue;
        document.getElementById('time').value = selectedItem.time || "";
        document.getElementById('requirements').value = selectedItem.requirements || "";

        if(document.getElementById('slots')) {
            document.getElementById('slots').value = selectedItem.slots || "";
        }
    }
};


scholarshipForm.addEventListener('submit', (event) => {
    event.preventDefault(); 
    
    const scholarshipData = JSON.parse(localStorage.getItem('scholarships')) || [];
    const inputSlots = parseInt(document.getElementById('slots').value) || 0;

    
    const existingItem = scholarshipData.find(item => item.id == editId);

    const scholarshipEntry = {
        id: editId ? parseInt(editId) : Date.now(),
        name: document.getElementById('name').value,
        description: document.getElementById('description').value,
        eligibility: document.getElementById('eligibility').value,
        schedule: document.getElementById('schedule').value,
        venue: document.getElementById('venue').value,
        time: document.getElementById('time').value,
        requirements: document.getElementById('requirements').value,
        slots: inputSlots,
  
        remainingSlots: editId ? (existingItem.remainingSlots ?? inputSlots) : inputSlots,
        status: inputSlots > 0 ? "Available" : "Not Available"
    };

    if (editId) {
        const index = scholarshipData.findIndex(item => item.id == editId);
        if (index !== -1) scholarshipData[index] = scholarshipEntry;
    } else {
        scholarshipData.push(scholarshipEntry);
    }

    localStorage.setItem('scholarships', JSON.stringify(scholarshipData));
    window.location.href = "admin.html";
});

document.addEventListener('DOMContentLoaded', loadExistingData);