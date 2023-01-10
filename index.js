const API_URL = 'https://01.kood.tech/api/graphql-engine/v1/graphql';
const query = `query={user(where:{login:{_eq:"raidoxd"}}){id login}}`;

const options = {
  method: 'GET',
};

fetch(`${API_URL}?${query}`, options)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    // use the data here to create the chart
    const userData = data.data.user;
    // extract the labels and data values for the chart
    const labels = userData.map(user => user.login);
    const values = userData.map(user => user.id);
    // create the chart
    var ctx = document.getElementById('chart').getContext('2d');
    var chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Value',
                data: values,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
  });