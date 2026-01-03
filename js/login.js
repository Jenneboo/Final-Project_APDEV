"use strict";

document.addEventListener('DOMContentLoaded', () => {
    const loginSection = document.getElementById('loginSection');
    const registerSection = document.getElementById('registerSection');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');

    const regStep1 = document.getElementById('regStep1');
    const regStep2 = document.getElementById('regStep2');
    const btnNext = document.getElementById('btnNext');
    const btnBack = document.getElementById('btnBack');

    if (showRegister && showLogin) {
        showRegister.onclick = (e) => {
            e.preventDefault();
            loginSection.style.display = 'none';
            registerSection.style.display = 'block';
        };
        showLogin.onclick = (e) => {
            e.preventDefault();
            registerSection.style.display = 'none';
            loginSection.style.display = 'block';
        };
    }

    if (btnNext) {
        btnNext.addEventListener('click', () => {
            const first = document.getElementById('regFirst').value.trim();
            const last = document.getElementById('regLast').value.trim();
            const course = document.getElementById('regCourse').value.trim();

            if (first && last && course) {
                regStep1.style.display = 'none';
                regStep2.style.display = 'block';
            } else {
                alert("Please fill out your personal information first.");
            }
        });
    }

    if (btnBack) {
        btnBack.addEventListener('click', () => {
            regStep2.style.display = 'none';
            regStep1.style.display = 'block';
        });
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = document.getElementById('regUser').value.trim();
            const pass = document.getElementById('regPass').value;
            
            const profileData = {
                firstName: document.getElementById('regFirst').value.trim(),
                lastName: document.getElementById('regLast').value.trim(),
                course: document.getElementById('regCourse').value.trim(),
                year: document.getElementById('regYear').value.trim(),
                address: document.getElementById('regAddress').value.trim()
            };

            let students = JSON.parse(localStorage.getItem('eskuela_students')) || [];

            if (students.find(s => s.username === user)) {
                alert("Username already exists!");
                return;
            }

            students.push({ username: user, password: pass });
            localStorage.setItem('eskuela_students', JSON.stringify(students));
            
            localStorage.setItem(`profile_${user}`, JSON.stringify(profileData));
            
            alert("Registration Successful! Please login.");
            
            registerForm.reset();
            regStep2.style.display = 'none';
            regStep1.style.display = 'block';
            registerSection.style.display = 'none';
            loginSection.style.display = 'block';
        });
    }

    const loginForm = document.getElementById('loginForm');
    if (!localStorage.getItem('eskuela_students')) {
        localStorage.setItem('eskuela_students', JSON.stringify([{ username: "student", password: "student123" }]));
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = document.getElementById('loginUser').value.trim();
            const pass = document.getElementById('loginPass').value;

            if (user === "admin" && pass === "admin123") {
                localStorage.setItem('currentUser', user);
                window.location.href = "admin/admin.html";
                return;
            }

            const students = JSON.parse(localStorage.getItem('eskuela_students')) || [];
            const validStudent = students.find(s => s.username === user && s.password === pass);

            if (validStudent || (user === "student" && pass === "student123")) {
                localStorage.setItem('currentUser', user);
                window.location.href = "student/dashboard.html";
            } else {
                alert("Invalid credentials!");
            }
        });
    }
});