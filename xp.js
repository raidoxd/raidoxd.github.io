
const xp = `
query xp($login: String) {
  user(where:{login:{_eq:$login}}){
   progresses(where:{path:{_regex:"div-01/piscine-js-2$|div-01/",_nregex:"/piscine-js-2/|/rust/"}}){
     objectId
   }
   transactions(
       where: {
         type: { _regex: "xp" },
         object: {
           type: { _nregex: "exercise|raid" },
         },  
       },
     limit: 50,
       order_by: { createdAt: asc }
   ){
     objectId
     amount
     createdAt
   }   
 }
 }
 `;

 

const options = {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query:xp, variables }),
};


fetch(API_URL, options)
  .then(response => response.json())
  .then(({ data }) => {
    
    const progresses = data.user[0].progresses.map(p => p.objectId);
    const transactions = data.user[0].transactions;
    let filteredTransactions = transactions.filter(t => progresses.includes(t.objectId));
    let highestAmounts = {};
    for (let i = 0; i < filteredTransactions.length; i++) {
        if (highestAmounts[filteredTransactions[i].objectId] === undefined || filteredTransactions[i].amount > highestAmounts[filteredTransactions[i].objectId]) {
            highestAmounts[filteredTransactions[i].objectId] = filteredTransactions[i].amount;
        }
    }
    filteredTransactions = filteredTransactions.filter(t => t.amount === highestAmounts[t.objectId]);
    
    

///////////////////////////////////////////////
const firstTransaction = new Date(Math.min.apply(null, filteredTransactions.map(t => new Date(t.createdAt))));
    const lastTransaction = new Date(Math.max.apply(null, filteredTransactions.map(t => new Date(t.createdAt))));
    const months = {};
    let currentMonth = new Date(firstTransaction);
    let runningTotal = 0;

    // Loop through all the months between the first and last transaction
    while (currentMonth <= lastTransaction) {
        months[currentMonth.getFullYear() + '-' + (currentMonth.getMonth() + 1)] = 0;
        currentMonth.setMonth(currentMonth.getMonth() + 1);
    }

    // Add the transaction amounts to the corresponding month
    filteredTransactions.forEach(t => {
      const transactionDate = new Date(t.createdAt);
      const month = transactionDate.getFullYear() + '-' + (transactionDate.getMonth() + 1);
      runningTotal += t.amount;
      months[month] = runningTotal;
  });
  let lastMonthAmount = 0;
  Object.keys(months).forEach((key)=>{
      if(months[key] === 0) {
          months[key] = lastMonthAmount;
      }
      lastMonthAmount = months[key];
  });
    
  /////////////////////////////

    // generate
    const svg = d3.select("#xp")
    .append("svg") ;


    const filteredTransactionss = Object.entries(months).map(d => ({ createdAt: new Date(d[0]), amount: d[1] }));

    const xScale = d3.scaleTime()
      .domain(d3.extent(filteredTransactionss, d => d.createdAt))
      .range([50, 600]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(filteredTransactionss, d => d.amount)])
      .range([300, 0]);

      const line = d3.line()
        .x(d => xScale(d.createdAt))
        .y(d => yScale(d.amount));
       
        svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(50,0)")
        .call(d3.axisLeft(yScale)
        .tickSize(-550)
        .tickFormat("")
        )
      
        svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0,300)")
        .call(d3.axisBottom(xScale)
        .tickSize(-550)
        .tickFormat("")
        )
      
        svg.append("path")
        .datum(filteredTransactionss)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 3)
        .attr("d", line);
      
        svg.append("g")
        .attr("transform", "translate(50,0)")
        .call(d3.axisLeft(yScale))
      
        svg.append("g")
        .attr("transform", "translate(0,300)")
        .call(d3.axisBottom(xScale).ticks(d3.timeMonth.every(2)))
        
        svg.append("text")
            .attr("x", (640 / 2))
            .attr("y", 350)
            .attr("text-anchor", "middle")
            .style("font-size", "30px")
            .text("XP over time");
            

  })