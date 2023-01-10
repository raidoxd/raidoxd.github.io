const API_URL = 'https://01.kood.tech/api/graphql-engine/v1/graphql';
const query = `{
    user(where: { login: { _eq: "raidoxd" } }) {
      transactions(
          where: {type: {_eq: "xp"}, object: {type: {_nregex: "exercise|raid"}}}
          limit: 50
          order_by: {createdAt: asc}
      ) {
        amount
        createdAt
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
      const dataPoints = transactions.map(transaction => [new Date(transaction.createdAt), transaction.amount]);
      Highcharts.chart('chart', {
          chart: {
              type: 'line'
          },
          title: {
              text: 'Transaction amount over time'
          },
          xAxis: {
              type: 'datetime',
              dateTimeLabelFormats: {
                  month: '%e. %b',
                  year: '%b'
              },
              title: {
                  text: 'Date'
              }
          },
          yAxis: {
              title: {
                  text: 'Amount'
              }
          },
          series: [{
              name: 'Amount',
              data: dataPoints
          }]
      });
    });