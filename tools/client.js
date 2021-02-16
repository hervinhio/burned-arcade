const sendRandomMetricsData = (key) => {
  $.ajax({
    url: `http://localhost:8082/metric/${key}`,
    method: 'POST',
    dataType: 'json',
    contentType:"application/json; charset=utf-8",
    data: JSON.stringify({ value: Math.random() * 99 + 1 })
  })
  .fail((error) => {
    console.error(error);
  });
}

const sendData = () => {
  const actionPane = $('.mini-report');
  sendRandomMetricsData('cpu');
  sendRandomMetricsData('mem');
  sendRandomMetricsData('processes');
  sendRandomMetricsData('threads');
  actionPane.fadeIn();
  setTimeout(() => actionPane.fadeOut(), 15000);
}
