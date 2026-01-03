"use strict";

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const scholarshipId = params.get('id');
    const titleDisplay = document.getElementById('scholarship-title-display');
    const applicationForm = document.getElementById('applicationForm');
    
    const successModal = document.getElementById('successModal');
    const closeSuccessBtn = document.getElementById('closeSuccessBtn');

    const getLatestScholarships = () => JSON.parse(localStorage.getItem('scholarships')) || [];
    let scholarships = getLatestScholarships();
    let currentItem = scholarships.find(s => s.id == scholarshipId);

    if (currentItem && titleDisplay) {
        titleDisplay.textContent = currentItem.name;
    }

    if (applicationForm) {
        applicationForm.addEventListener('submit', (e) => {
            e.preventDefault();

            scholarships = getLatestScholarships();
            const scholarshipIndex = scholarships.findIndex(s => s.id == scholarshipId);
            const freshItem = scholarships[scholarshipIndex];

            const userEmail = document.getElementById('email').value.trim().toLowerCase();
            const allApplications = JSON.parse(localStorage.getItem('applications')) || [];
            
           
            const hasAlreadyApplied = allApplications.some(app => 
                app.scholarshipId === scholarshipId && app.email.toLowerCase() === userEmail
            );

            if (hasAlreadyApplied) {
                alert("You have already submitted an application for this scholarship.");
                window.location.href = "student.html";
                return;
            }

            if (!freshItem || freshItem.remainingSlots <= 0) {
                alert("Sorry, slots just ran out for this scholarship.");
                window.location.href = "student.html";
                return;
            }

            const formData = {
                appId: Date.now(), // ADDED: Unique ID to view the specific form later
                scholarshipId: scholarshipId,
                scholarshipName: freshItem.name,
                lastName: document.getElementById('lastName').value,
                firstName: document.getElementById('firstName').value,
                middleName: document.getElementById('middleName').value,
                dob: document.getElementById('dob').value,
                gender: document.getElementById('gender').value,
                contact: document.getElementById('contact').value,
                email: userEmail,
                school: document.getElementById('school').value,
                course: document.getElementById('course').value,
                yearLevel: document.getElementById('yearLevel').value,
                gwa: document.getElementById('gwa').value,
                appliedDate: new Date().toLocaleDateString(),
                status: "Pending" // ADDED: Default status
            };

            scholarships[scholarshipIndex].remainingSlots -= 1;
            
            if (scholarships[scholarshipIndex].remainingSlots === 0) {
                scholarships[scholarshipIndex].status = "Not Available";
            }
            
            localStorage.setItem('scholarships', JSON.stringify(scholarships));
            allApplications.push(formData);
            localStorage.setItem('applications', JSON.stringify(allApplications));

            if (successModal) {
                document.getElementById('successMessage').textContent = `Your application for ${freshItem.name} has been submitted.`;
                successModal.style.display = 'flex';
                
                // ADDED: Logic for "View in Application" if button exists
                const viewAppBtn = document.getElementById('viewInAppBtn');
                if(viewAppBtn) {
                    viewAppBtn.onclick = () => window.location.href = "applications.html";
                }
            }
        });
    }

    closeSuccessBtn?.addEventListener('click', () => {
        window.location.href = "student.html";
    });
});