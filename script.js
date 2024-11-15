fetch('https://acb-api.algoritmika.org/api/transaction').then((res) => {
    return res.json();
}).then((data) => {
    console.log(data)
})