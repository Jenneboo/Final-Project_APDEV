"use strict";

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const scholarshipId = params.get('id');
    const currentUser = localStorage.getItem('currentUser');
    
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

    const loadUserData = () => {
        const profileData = JSON.parse(localStorage.getItem(`profile_${currentUser}`)) || {};
        if (document.getElementById('firstName')) document.getElementById('firstName').value = profileData.firstName || "";
        if (document.getElementById('lastName')) document.getElementById('lastName').value = profileData.lastName || "";
        if (document.getElementById('course')) document.getElementById('course').value = profileData.course || "";
    };
    loadUserData();

    if (applicationForm) {
        applicationForm.addEventListener('submit', (e) => {
            e.preventDefault();

            scholarships = getLatestScholarships();
            const scholarshipIndex = scholarships.findIndex(s => s.id == scholarshipId);
            const freshItem = scholarships[scholarshipIndex];
            const allApplications = JSON.parse(localStorage.getItem('applications')) || [];
            
            const hasAlreadyApplied = allApplications.some(app => 
                app.scholarshipId === scholarshipId && app.username === currentUser
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
                appId: Date.now(),
                username: currentUser,
                scholarshipId: scholarshipId,
                scholarshipName: freshItem.name,
                lastName: document.getElementById('lastName').value,
                firstName: document.getElementById('firstName').value,
                middleName: document.getElementById('middleName').value,
                dob: document.getElementById('dob').value,
                gender: document.getElementById('gender').value,
                contact: document.getElementById('contact').value,
                email: document.getElementById('email').value.trim().toLowerCase(),
                school: document.getElementById('school').value,
                course: document.getElementById('course').value,
                yearLevel: document.getElementById('yearLevel').value,
                gwa: document.getElementById('gwa').value,
                appliedDate: new Date().toLocaleDateString(),
                status: "Pending"
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