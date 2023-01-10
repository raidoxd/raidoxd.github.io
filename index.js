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
      var svg = d3.select("#chart").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
      var x = d3.scaleBand()
          .rangeRound([0, width])
          .padding(0.1)
          .domain(transactions.map(function(d) { return d.amount; }));
  
      var y = d3.scaleLinear()
          .rangeRound([height, 0])
          .domain([0, d3.max(transactions, function(d) { return d.amount; })]);
  
      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));
  
      svg.append("g")
          .attr("class", "y axis")
          .call(d3.axisLeft(y).ticks(10))
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", "0.71em")
          .attr("text-anchor", "end")
          .text("Amount");
  
      svg.selectAll(".bar")
          .data(transactions)
        .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.amount); })
        .attr("y", function(d) { return y(d.amount); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.amount); });
    });
  