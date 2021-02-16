const getMetricSum = (key) => {
  $.ajax({
    url: `http://localhost:8082/metric/${key}/sum`,
    method: 'GET'
  })
  .done(data => {
    $(`#${key} > .value`).html(data.value);
  })
  .fail((error) => {
    console.error(error);
  });
}

$(document).ready(() => {
  setInterval(() => {
    getMetricSum('cpu');
    getMetricSum('mem');
    getMetricSum('processes');
    getMetricSum('threads');
  }, 2000);
});
