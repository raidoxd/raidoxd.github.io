document.addEventListener('DOMContentLoaded', () => {


const user1 = `
    query xp($login: String) {
        user(where:{login:{_eq:$login}}){
        id
        login
        transactions(where:{type:{_eq:"level"},path:{_regex:"div-01", _nregex:"rust/|piscine-js-2/"}}, order_by: {amount: desc}, limit: 1){
          amount
        }
       }
    }
     `;

const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: user1, variables }),
};


fetch(API_URL, options)


    .then(response => response.json())
    .then(data => {
       
        document.getElementById("id").innerHTML = data.data.user[0].id;
        document.getElementById("username").innerHTML = data.data.user[0].login;
        document.getElementById("level1").innerHTML= data.data.user[0].transactions[0].amount;
    });
})
