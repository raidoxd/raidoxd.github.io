const API_URL = 'https://01.kood.tech/api/graphql-engine/v1/graphql';
const query = `query ($id: Int!, $offset: Int!){
    user(where: { login: { _eq: "raidoxd" } }) {
      transactions(
          where: {userId: {_eq: $id}, type: {_eq: "xp"}, object: {type: {_nregex: "exercise|raid"}}}
          limit: 50
          offset: $offset
          order_by: {createdAt: asc}
      ) {
        amount
        createdAt
      }
    }
  }`;
  const variables = {id: 1, offset: 0};
  
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  };
  
  fetch(API_URL, options)
    .then(response => response.json())
    .then(({ data }) => {
      const transactions = data.user[0].transactions;
      const amounts = transactions.map(transaction => transaction.amount);
      const createdAt = transactions.map(transaction => transaction.createdAt);
      Highcharts.chart('chart', {
          chart: {
              type: 'line'
          },
          title: {
              text: 'Transaction amount over time'
          },
          xAxis: {
              categories: createdAt
          },
          yAxis: {
              title: {
                  text: 'Amount'
              }
          },
          series: [{
              name: 'Amount',
              data: amounts
          }]
      });
    });