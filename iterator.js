"use strict"

const URLS = [
    "https://app.rupee.com.br/dashboard_mundo?locale=pt-BR&status=regular",    
    "https://app.rupee.com.br/dashboard_mundo?locale=pt-BR&status=attention",
    "https://app.rupee.com.br/dashboard_mundo?locale=pt-BR&status=delayed",
    "https://app.rupee.com.br/dashboard_italia?locale=pt-BR",
];

setTimeout(() => {
    chrome.storage.local.get({next_url_index: 0}, settings => {
        chrome.storage.local.set({next_url_index: (settings.next_url_index + 1) % URLS.length});
        window.location.href = URLS[settings.next_url_index % URLS.length];
    });
}, DEFAULT_CHANGE_RATE);
