// Configurações do dashboard mundo
const DASHBOARD_MUNDI = {
    url_root: `https://app.rupee.com.br/dashboard_mundo?locale=pt-BR`,
    query_params: '&status={}',
    status: ['regular', 'attention', 'delayed']};

// Configurações do dashboard italia
const DASHBOARD_ITALY = {
    url_root: 'https://app.rupee.com.br/dashboard_italia?locale=pt-BR',
    query_params: '&duty=all&type=all&company=all&status={}&per_page=20',
    status: ['waiting', 'delayed', 'delivered_file', 'external_repo', 'non_applicable', 'attention']};

// Ritmo entre as transições de pagina;
// Se quiser aumentar o tempo que a pagina fica aberta,
// só aumentar aqui.
// Obs.: representado em milisegundos... 
// ex.: 3000    = 3 segundos 
//      10000   = 10 segundos
//      60000   = 1 minuto      (padrão)
//      300000  = 5 minutos
//      600000  = 10 minutos
const CHANGE_PAGE_RATE = 60000;

// Função principal, a que de fato o loop pelos dashboards;
var main = loop_over_pages(CHANGE_PAGE_RATE);


// Considerando a estrutura de urls atual dos dashboards, 
// esta função monta as urls que apontam para os o dashboard
// e para os filtros de status q ele pode apresentar;
function get_dashboard_routes(dbd) {
    var routes = [dbd.url_root];
    dbd.status.forEach(
        status => routes.push(dbd.url_root.concat(dbd.query_params.replace('{}', status))));
    return routes;
}


// Uma função utilitária que retorna as rotas dos 
// dashboards MUNDI e ITALIA;
function get_routes() {
    var mundi_routes = get_dashboard_routes(DASHBOARD_MUNDI);
    var italy_routes = get_dashboard_routes(DASHBOARD_ITALY);
    return mundi_routes.concat(italy_routes);
}


// Closure que retorna uma função que, após o tempo definido, redireciona para
// a proxima url da fila.
// qdo a fila se esgota, ela é preenchida novamente, fechando um loop infinito;
function loop_over_pages(change_page_rate) {
    var routes = [];
    closu = tabId => {
        if (routes.length == 0)
            routes = get_routes();
        let next_url = routes.shift();    
        let command = `setTimeout(() => {window.location.href = '${next_url}'}, ${change_page_rate})`;
        console.log({
            'next_url': next_url,
            'command': command,
            'remaining_urls': routes});
        chrome.tabs.executeScript(tabId, {code: command});
    }
    return closu;
}


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status != 'complete')
        return;
    main(tabId);
});