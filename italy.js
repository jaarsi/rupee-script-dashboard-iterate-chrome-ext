"use strict"

const ITALY_STATUSES = [
    "waiting", 
    "delayed", 
    "delivered_file", 
    "external_repo", 
    "non_applicable", 
    "attention"
];

function update_dashboard_data(status) {
    fetch(
        `https://app.rupee.com.br/dashboard_italia/filter_and_update_italy?
        company_id=all&duty_type=all&status=${status}&duty_name=all`, 
    ).then(response => response.json().then(json => {
        let total = json['total']
        $('#number-of-duties').text(total)
  
        if (total > 0) {
          let duties_list = json['duties_list']
          let labels_partial = json['labels_partial']
          let graph_labels = json['graph_labels']
          let data = json['data']
          let visible_types = json['visible_types']
          let pagination_results = json['pagination_results']
  
          $('#select-duties').empty()
          $('#select-duties').append('<option value="all">' + "Todas as obrigações" + '</option>')
          for(let i = 0; i < duties_list.length; i++) {
            $('#select-duties').append('<option value="' + duties_list[i] + '">' + duties_list[i] + '</option>')
          }
  
          $('#duty-type-labels').html(labels_partial)
          $('.cards').html(pagination_results)
  
          $('.pie-chart').empty()
          $('.pie-chart').prepend('<canvas id="duties-pie-chart"><canvas>');
          let chart = new DutiesPieChart('duties-pie-chart',  data, graph_labels)
        } else {
          $('.cards').empty()
          $('.pie-chart').empty()
          $('#duty-type-labels').empty()
          $('.pie-chart').append("<h3 class='text-center'>Sua pesquisa não retornou nenhum resultado</h3>")
        }          
    }));
}

let status_index = -1;

let update_dashboard_interval = setInterval(() => {
    status_index = (status_index+1) % ITALY_STATUSES.length;
    update_dashboard_data(ITALY_STATUSES[status_index]);
}, iterator.DEFAULT_DELAY/ITALY_STATUSES.length);

iterator.next();