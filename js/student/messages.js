"use strict";

const MESSAGES_KEY = 'messages';
let currentUser = localStorage.getItem('currentUser');
if (!currentUser) {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('/html/admin/')) { currentUser = 'admin'; localStorage.setItem('currentUser', 'admin'); }
    else { currentUser = 'student'; localStorage.setItem('currentUser', 'student'); }
}

const getMessages = () => JSON.parse(localStorage.getItem(MESSAGES_KEY)) || [];
const saveMessages = (arr) => localStorage.setItem(MESSAGES_KEY, JSON.stringify(arr));

const isVisible = (m, user) => !(m.hiddenFor && Array.isArray(m.hiddenFor) && m.hiddenFor.includes(user));

const el = (id) => document.getElementById(id);
let currentPartner = null;

const renderConvList = () => {
    const list = el('studentList');
    const noConv = el('noMessages');
    if (!list) return;
    list.innerHTML = '';

    const messages = getMessages();
    const partners = new Set();
    messages.forEach(m => {
        if (!isVisible(m, currentUser)) return; // skip messages hidden for this user
        if (m.from === currentUser && m.to !== currentUser) partners.add(m.to);
        if (m.to === currentUser && m.from !== currentUser) partners.add(m.from);
    });

    if (partners.size === 0) { if (noConv) noConv.style.display = 'block'; return; }
    if (noConv) noConv.style.display = 'none';

    [...partners].sort().forEach(name => {
        const li = document.createElement('li');
        li.className = 'student-item';
        const spanName = document.createElement('span');
        spanName.textContent = name;
        li.appendChild(spanName);
      
        const unread = getMessages().filter(m => isVisible(m, currentUser) && m.from === name && m.to === currentUser && !m.read).length;
        if (unread > 0) {
            const badge = document.createElement('span');
            badge.className = 'unread-badge';
            badge.textContent = unread;
            li.appendChild(badge);
        }
        li.addEventListener('click', () => openConversation(name));
        list.appendChild(li);
    });
    populateDatalist([...partners]);
};

const populateDatalist = (names) => {
    const dl = el('studentsDatalist');
    if (!dl) return;
    dl.innerHTML = '';
    const set = new Set(['admin', ...names]);
    Array.from(set).sort().forEach(n => {
        const opt = document.createElement('option'); opt.value = n; dl.appendChild(opt);
    });
};

const openConversation = (partner) => {
    currentPartner = partner;
    const header = el('conversationHeader');
    const body = el('conversationBody');
    const footer = el('conversationFooter');
    if (header) header.textContent = `${partner}`;
    if (!body) return;
    body.innerHTML = '';
    const messages = getMessages().filter(m => isVisible(m, currentUser) && ((m.from === partner && m.to === currentUser) || (m.from === currentUser && m.to === partner)));
    messages.sort((a,b)=>a.ts - b.ts).forEach(m => {
        const msgEl = document.createElement('div');
        msgEl.className = m.from === currentUser ? 'msg admin' : 'msg student';
        msgEl.textContent = m.text;
        body.appendChild(msgEl);
    });
    // mark inbound messages as read for this conversation
    const all = getMessages();
    let changed = false;
    all.forEach(m => {
        if (!isVisible(m, currentUser)) return;
        if (m.from === partner && m.to === currentUser && !m.read) { m.read = true; changed = true; }
    });
    if (changed) saveMessages(all);
    body.scrollTop = body.scrollHeight;
    if (footer) footer.style.display = 'block';
};

document.addEventListener('DOMContentLoaded', () => {
    renderConvList();

    el('btnLogout')?.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = '../index.html';
    });

    el('btnNewMessage')?.addEventListener('click', () => el('newMessageModal').style.display = 'flex');
    el('closeModalBtn')?.addEventListener('click', () => {
        el('newMessageModal').style.display = 'none'; el('toInput').value = ''; el('messageInput').value = '';
    });

    el('sendMessageBtn')?.addEventListener('click', () => {
        const to = el('toInput').value.trim();
        const text = el('messageInput').value.trim();
        if (!to || !text) return alert('Please enter recipient and message');
        const messages = getMessages();
        messages.push({ id: Date.now(), from: currentUser, to, text, ts: Date.now(), read: false, hiddenFor: [] });
        saveMessages(messages);
        el('newMessageModal').style.display = 'none'; el('toInput').value = ''; el('messageInput').value = '';
        renderConvList(); openConversation(to);
    });

    el('sendReplyBtn')?.addEventListener('click', () => {
        if (!currentPartner) return alert('Select a conversation first');
        const text = el('replyInput').value.trim(); if (!text) return;
        const messages = getMessages();
        messages.push({ id: Date.now(), from: currentUser, to: currentPartner, text, ts: Date.now(), read: false, hiddenFor: [] });
        saveMessages(messages);
        el('replyInput').value = '';
        renderConvList(); openConversation(currentPartner);
    });

    el('deleteConvBtn')?.addEventListener('click', () => {
        if (!currentPartner) return alert('No conversation selected');
        if (!confirm(`Delete conversation for YOU with ${currentPartner}? This will only hide messages in your view.`)) return;
        const all = getMessages();
        let changed = false;
        all.forEach(m => {
            if ((m.from === currentPartner && m.to === currentUser) || (m.from === currentUser && m.to === currentPartner)) {
                if (!m.hiddenFor) m.hiddenFor = [];
                if (!m.hiddenFor.includes(currentUser)) { m.hiddenFor.push(currentUser); changed = true; }
            }
        });
        if (changed) saveMessages(all);
        currentPartner = null;
        el('conversationHeader').textContent = 'Select a conversation';
        el('conversationBody').innerHTML = '';
        el('conversationFooter').style.display = 'none';
        renderConvList();
    });
});

const logoutBtn = document.getElementById('btnLogout');
    logoutBtn?.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = "../index.html";
    });