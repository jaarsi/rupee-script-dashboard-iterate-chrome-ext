"use strict"

const PARALEGAL_TYPES = ["all", "0", "1", "2", "3", "4"];
const NEXT_PAGE_DELAY = PARALEGAL_TYPES.length * 10 * 1000; // 10s de exibicao para cada status;

function update_dashboard_data(type) {
    console.log(`[rupee-bot] Loading "${type}" card type data;`);

    fetch(
        `https://app.rupee.com.br/dashboard_cnds/set_chart_data?company_id=all&status=all&type=${type}`,
    ).then(response => response.json().then(json => {
        const data = json['data']
        const pagination_results = json['pagination_results']
        const legends = json['legends']
        const states = json['states']

        // Gera legendas
        $('.legends .total').html('');
        $('.legends .total').append("<span> Total: " + data.all + " Documentos</span>");
        $('.legends .types').html('');

        if (data.all > 0) {
            $('.legends .types').append("<div> Status </div>")
        }

        $.each( legends, function( key, value ) {
            if (data[value] > 0 && key != 'all') {
                $('.legends .types').append(
                    "<div class=" + value + ">" +
                        "<span class='box'> </span>" +
                        "<span class='text'>" + key + ": " + data[value] + "</span>" +
                    "</div>"
                );
            }
        });

        if (data.attention > 0 || data.overdue > 0){
            $('.legends .types').append("<div class='states'> Estado </div>")
        }

        $.each( states, function( key, value ) {
            if (data[value] > 0 && key != 'all') {
                $('.legends .types').append(
                    "<div class=" + value + ">" +
                        "<span class='box'> </span>" +
                        "<span class='text'>" + key + ": " + data[value] + "</span>" +
                    "</div>"
                );
            }
        });

        // Gera o gráfico
        $('.no-filter').html('')
        $('.chart').html('')
        $('.chart').prepend('<canvas id="chart"><canvas>');
        const ctx = document.getElementById('chart').getContext('2d');
        const cnds_chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ["Positiva", "Negativa", "Efeito Negativo", "Não aplicável", "Em atenção", "Vencidos"],
                datasets: [{
                    data: [data['positive'], data['negative'], data['negative-effect'], data['not-applicable'], data['attention'], data['overdue']],
                    backgroundColor: ['#069e99', '#751D63', '#24823a', '#0b3b67', '#d1bf0e', '#D0021B']
                }]
            },
            options: {
                legend: { display: false },
                scales: {
                    yAxes: [{
                        ticks: { beginAtZero: true }
                    }]
                }
            }
        });

        // Gera listagem de cards
        $('.cards').empty()
        $('.cards').html(pagination_results)    }));
}

let status_index = 0;

update_dashboard_data(PARALEGAL_TYPES[status_index])

const update_dashboard_interval = setInterval(() => {
    status_index = (status_index+1) % PARALEGAL_TYPES.length;
    update_dashboard_data(PARALEGAL_TYPES[status_index]);
}, NEXT_PAGE_DELAY/PARALEGAL_TYPES.length);

iterator.next(NEXT_PAGE_DELAY);