const API_URL = 'https://01.kood.tech/api/graphql-engine/v1/graphql';
const query = `
    query transactionsByLogin($login: String!) {
        user(where: { login: { _eq: $login } }) {
          transactions(
              where: {type: {_eq: "xp"}, object: {type: {_nregex: "exercise|raid"}}}
              limit: 50
              order_by: {createdAt: asc}
          ) {
            amount
            createdAt
          }
        }
    }
`;
const variables = {
    login: "raidoxd"
};

const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
};

fetch(API_URL, options)
    .then(response => response.json())
    .then(({ data }) => {
        const transactions = data.user[0].transactions;
        let runningTotal = 0;
        const dataPoints = transactions.reduce((acc, cur) => {
            runningTotal += cur.amount;
            const date = new Date(cur.createdAt);
            const formattedDate = date.toLocaleDateString();
            acc.push({date: formattedDate, amount: runningTotal});
            return acc;
        }, []);

        const xScale = d3.scaleBand()
            .domain(dataPoints.map(d => d.date))
            .range([0, 750])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(dataPoints, d => d.amount)])
            .range([450, 50]);

        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        d3.select('#chart')
            .append('g')
            .attr('transform', 'translate(50, 0)')
            .call(yAxis);

        d3.select('#chart')
            .append('g')
            .attr('transform', 'translate(50, 450)')
            .call(xAxis);

        d3.select('#chart')
            .append("path")
            .datum(dataPoints)
            .attr("fill", "none")
            .attr("stroke", "blue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
            .x(d => xScale(d.date))
            .y(d => yScale(d.amount))
            );
    });
