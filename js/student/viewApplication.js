"use strict";

const loadApplicationSummary = () => {
    const params = new URLSearchParams(window.location.search);
    const appId = params.get('appId');
    
    if (!appId) {
        console.error("No appId found in URL.");
        alert("No application reference found.");
        window.location.href = "applications.html";
        return;
    }

    const apps = JSON.parse(localStorage.getItem('applications')) || [];
    
    const app = apps.find(a => String(a.appId) === String(appId));

    if (app) {

        const titleElem = document.getElementById('v-title');
        if (titleElem) titleElem.textContent = app.scholarshipName || "Scholarship Program";

   
        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.value = val || "N/A";
        };


        setVal('v-name', `${app.firstName || ''} ${app.lastName || ''}`.trim());
        setVal('v-email', app.email);
        setVal('v-contact', app.contact || app.contactNumber);
        setVal('v-gender', app.gender);


        setVal('v-school', app.school || app.schoolName);
        setVal('v-course', app.course);
        setVal('v-year', app.yearLevel);
        setVal('v-gwa', app.gwa);
        
    } else {
        console.warn("Application with ID " + appId + " not found in localStorage.");
        alert("Application details could not be found.");
        window.location.href = "applications.html";
    }
};


document.addEventListener('DOMContentLoaded', loadApplicationSummary);