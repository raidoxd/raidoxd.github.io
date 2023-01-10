const API_URL = 'https://01.kood.tech/api/graphql-engine/v1/graphql';
const query = `{
    user(where: { login: { _eq: "raidoxd" } }) {
      login
      transactions{
          amount
      }
    }
  }`;
  
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  };
  
  fetch(API_URL, options)
    .then(response => response.json())
    .then(({ data }) => {
      const transactions = data.user[0].transactions;
      var ctx = document.getElementById('chart').getContext('2d');
      var chart = new Chart(ctx, {
          type: 'bar',
          data: {
              labels: transactions.map(d => d.amount),
              datasets: [{
                  label: 'Transactions',
                  data: transactions.map(d => d.amount),
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
  