
const level = `
query xp($login: String) {
    user(where:{login:{_eq:$login}}){
    transactions(where:{type:{_eq:"level"},path:{_regex:"div-01", _nregex:"rust/|piscine-js-2/"}}){
      amount
      path
      createdAt
    }
   }
   }
 `;


const optionss = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: level, variables }),
};


fetch(API_URL, optionss)
    .then(response => response.json())
    .then(({ data }) => {
        
        /////////////////////////////  

        const pathAmounts = {};
        data.user[0].transactions.forEach(transaction => {
            const { path, amount, createdAt } = transaction;
            if (!pathAmounts[path] || pathAmounts[path].amount < amount) {
                pathAmounts[path] = { amount, createdAt };
            }
        });

        const filteredTransactions = Object.values(pathAmounts);

       
        /////////////////////////////
        const firstTransaction = new Date(Math.min.apply(null, filteredTransactions.map(t => new Date(t.createdAt))));
        const lastTransaction = new Date(Math.max.apply(null, filteredTransactions.map(t => new Date(t.createdAt))));
        const months = {};
        let currentMonth = new Date(firstTransaction);

        // Loop through all the months between the first and last transaction
        while (currentMonth <= lastTransaction) {
            months[currentMonth.getFullYear() + '-' + (currentMonth.getMonth() + 1)] = 0;
            currentMonth.setMonth(currentMonth.getMonth() + 1);
        }

        // Add the transaction amounts to the corresponding month
        filteredTransactions.forEach(t => {
            const transactionDate = new Date(t.createdAt);
            const month = transactionDate.getFullYear() + '-' + (transactionDate.getMonth() + 1);
            months[month] = t.amount;
        });
        let lastMonthAmount = 0;
        Object.keys(months).forEach((key) => {
            if (months[key] === 0) {
                months[key] = lastMonthAmount;
            }
            lastMonthAmount = months[key];
        });

       

        /////////////////////////////

        // generate
        const svg = d3.select("#level")
            .append("svg");

        const filteredTransactionsss = Object.entries(months).map(d => ({ createdAt: new Date(d[0]), amount: d[1] }));


        const xScale = d3.scaleTime()
            .domain(d3.extent(filteredTransactionsss, d => d.createdAt))
            .range([50, 600]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(filteredTransactionsss, d => d.amount)])
            .range([300, 0]);

        const step = d3.line()
            .x(d => xScale(d.createdAt))
            .y(d => yScale(d.amount))
            .curve(d3.curveStep);

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
            .datum(filteredTransactionsss)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 3)
            .attr("d", step);

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
            .text("Level");
            
    })