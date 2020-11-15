"use strict"

const iterator = {
    URLS: [
        "https://app.rupee.com.br/dashboard_mundo?locale=pt-BR&status=regular",    
        "https://app.rupee.com.br/dashboard_mundo?locale=pt-BR&status=attention",
        "https://app.rupee.com.br/dashboard_mundo?locale=pt-BR&status=delayed",
        "https://app.rupee.com.br/dashboard_italia?locale=pt-BR",
        "https://app.rupee.com.br/dashboard_cnds?locale=pt-BR",
    ],
    DEFAULT_DELAY: 60000,
    next: function(delay=null) {
        delay = delay || this.DEFAULT_DELAY;        
        chrome.storage.local.get({next_url_index: -1}, storage => {
            let next_url_index = (storage.next_url_index + 1) % this.URLS.length;       
            console.log(`[rupee-bot] Going to ${this.URLS[next_url_index]} in ${delay/1000} seconds;`);
            chrome.storage.local.set({next_url_index: next_url_index});
            setTimeout(() => window.location.href = this.URLS[next_url_index], delay);
        });        
    }
}

