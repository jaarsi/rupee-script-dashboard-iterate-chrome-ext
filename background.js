function get_routes() {
    // URLs do dashboard Mundo;
    var mundi_url_root = `https://app.rupee.com.br/dashboard_mundo?locale=pt-BR`;
    var mundi_url_status = mundi_url_root + '&status={}';
    var mundi_status = ['regular', 'attention', 'delayed'];
    var routes = [mundi_url_root];
    mundi_status.forEach(
        status => routes.push(mundi_url_status.replace('{}', status)));

    // URLs do dashboard italia;
    var italia_url_root = 'https://app.rupee.com.br/dashboard_italia?locale=pt-BR';
    var italia_url_status = italia_url_root + '&duty=all&type=all&company=all&status={}&per_page=20';
    var italia_status = ['waiting', 'delayed', 'delivered_file', 'external_repo', 'non_applicable', 'attention'];
    routes.push(italia_url_root);
    italia_status.forEach(
        status => routes.push(italia_url_status.replace('{}', status)));

    return routes
}

function loop_over_pages(change_page_rate) {
    var routes = [];
    closu = tabId => {
        if (routes.length == 0)
            routes = get_routes();
        let next_url = routes.shift();    
        let command = `setTimeout(() => {window.location.href = '${next_url}'}, ${change_page_rate})`;
        // let command = 'setTimeout(() => {window.location.href = "{0}"}, {1}})'.replace('{0}', next_url).replace('{1}', change_page_rate);
        console.log({
            'next_url': next_url,
            'command': command,
            'remaining_urls': routes});
        chrome.tabs.executeScript(tabId, {code: command});
    }
    return closu;
}

// Ritmo entre as transições de pagina;
const CHANGE_PAGE_RATE = 3000

var main = loop_over_pages(CHANGE_PAGE_RATE)

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status != 'complete')
        return;
    main(tabId);
});
