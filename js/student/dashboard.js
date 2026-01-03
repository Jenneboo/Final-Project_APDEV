"use strict";

document.addEventListener('DOMContentLoaded', () => {
    const user = localStorage.getItem('currentUser') || "student";
    const profileKey = `profile_${user}`;
    

    const sideUser = document.getElementById('display-username');
    const sideName = document.getElementById('display-name');
    const profileDisplay = document.getElementById('profileDisplay');

    const loadData = () => {
        const data = JSON.parse(localStorage.getItem(profileKey)) || {};
        sideUser.textContent = `@${user}`;
        
        if (data.firstName) {
            sideName.textContent = `${data.firstName} ${data.lastName}`;
            document.getElementById('p-firstName').value = data.firstName;
            document.getElementById('p-lastName').value = data.lastName;
            document.getElementById('p-course').value = data.course || "";
            document.getElementById('display-course').textContent = data.course || "Not Set";
            document.getElementById('display-year').textContent = data.year || "Not Set";
        }
        if (data.photo) profileDisplay.src = data.photo;
    };

  
    document.getElementById('profileForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const profileData = {
            firstName: document.getElementById('p-firstName').value,
            lastName: document.getElementById('p-lastName').value,
            course: document.getElementById('p-course').value,
            year: document.getElementById('p-year').value,
            photo: profileDisplay.src
        };
        localStorage.setItem(profileKey, JSON.stringify(profileData));
        alert("Profile Updated!");
        loadData();
    });

  
    document.getElementById('p-upload')?.addEventListener('change', function() {
        const reader = new FileReader();
        reader.onload = (e) => {
            profileDisplay.src = e.target.result;
        };
        reader.readAsDataURL(this.files[0]);
    });


    document.getElementById('btnLogout')?.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = "../../index.html";
    });

    loadData();
});


window.toggleDetails = (id) => {
    const el = document.getElementById(id);
    el.style.display = el.style.display === 'block' ? 'none' : 'block';
};