"use strict";

document.addEventListener('DOMContentLoaded', () => {
    const loginSection = document.getElementById('loginSection');
    const registerSection = document.getElementById('registerSection');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');

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
                window.location.href = "admin/admin.html";
                return;
            }

           
            const students = JSON.parse(localStorage.getItem('eskuela_students')) || [];
            const validStudent = students.find(s => s.username === user && s.password === pass);

            if (validStudent || (user === "student" && pass === "student123")) {
                localStorage.setItem('currentUser', user);
                window.location.href = "student/student.html";
            } else {
                alert("Invalid credentials!");
            }
        });
    }

   
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = document.getElementById('regUser').value.trim();
            const pass = document.getElementById('regPass').value;
            let students = JSON.parse(localStorage.getItem('eskuela_students')) || [];

            if (students.find(s => s.username === user)) {
                alert("Username already exists!");
                return;
            }

            students.push({ username: user, password: pass });
            localStorage.setItem('eskuela_students', JSON.stringify(students));
            alert("Registration Successful! Please login.");
            registerSection.style.display = 'none';
            loginSection.style.display = 'block';
        });
    }
});