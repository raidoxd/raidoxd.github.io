const API_URL = 'https://01.kood.tech/api/graphql-engine/v1/graphql';
const query = `{
  user(where: { login: { _eq: "raidoxd" } }) {
    id
    login
  }
}`;

const options = {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query }),
};

fetch(API_URL, options)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    // use the data here to create the chart
  });