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
  });