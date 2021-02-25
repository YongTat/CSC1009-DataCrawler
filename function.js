window.onload = function () {
    if (document.URL.includes("data.html")) {
        HistoricalTable();
    }
    else if (document.URL.includes("index.html")) {
        stockTable();
        card();
    }

};

function stockTable() {
    console.log("stockTable activate");
    let myTable = document.querySelector('#stock_table');
    fetch('http://localhost:3000/stock').then(result => {
        return result.json();
    })
        .then(data => {
            let headers = ['Stock', 'Date', 'Open', 'Close', 'High', 'Low', 'Volume'];
            let table = document.createElement('table');
            table.className = "stock_table";
            generateSTableHead(table, headers);
            generateSTable(table, data);
            myTable.appendChild(table);
        })
}

function generateSTableHead(table, data) {
    // Javascript Array
    console.log("Generatetablehead")
    let thead = table.createTHead();
    thead.className = "stock_head";
    let row = thead.insertRow();
    row.className = "stock_header"

    data.forEach(headerText => {
        let header = document.createElement('th');
        header.className = "stock_header";
        header.scope = "col";
        let textNode = document.createTextNode(headerText);
        header.appendChild(textNode);
        row.appendChild(header);
    });
}

function generateSTable(table, data) {
    console.log("GenerateStable")
    let tbody = table.createTBody();
    tbody.className = "stock_body";

    data.forEach(value => {
        let row = tbody.insertRow();
        row.className = "stock_row";
        Object.values(value).forEach(text => {
            let cell = document.createElement('td');
            cell.className = "stock_data";
            let textNode = document.createTextNode(text);
            cell.appendChild(textNode);
            row.appendChild(cell);
        })
        table.appendChild(row);
    });

}


function card() {
    let container = document.querySelector('#card_container');
    let h1 = document.createElement('h1');
    let text = document.createTextNode("Popular Data")
    h1.className = "title";
    h1.appendChild(text);
    container.appendChild(h1);

    fetch('http://localhost:3000/stock').then(result => {
        return result.json();
    })
        .then(data => {

            generateRow(container, data);
        })

    console.log("Card is functioning");

}

function generateRow(container, stock) {
    var count = 0;
    let row = document.createElement("div");
    row.className = "row_container";
    container.appendChild(row);
    console.log("Row Created");


    for(i=0;i<stock.length;i++){
        let column = document.createElement('div');
        column.className = "column";
        row.appendChild(column);
        let card = document.createElement('div');
        card.className = "card";

        if(stock[i].hasOwnProperty("stock")){
            for(k=0;k<Object.keys(stock[i]).length;k++){
                if((Object.keys(stock[i])[k]) == "stock"){
                    console.log("Found");
                    let a = document.createElement('a');
                    let textNode = document.createTextNode(stock[i]['stock']);
                    a.appendChild(textNode);
                    a.title = "link";
                    a.href = "/data.html";
                    card.appendChild(a);
                    column.appendChild(card);
                }
            }
        }

        if(stock[i].hasOwnProperty("date")){
            for(k=0;k<Object.keys(stock[i]).length;k++){
                if((Object.keys(stock[i])[k]) == "date"){
                    console.log("Found");
                    let div = document.createElement('div');
                    let textNode = document.createTextNode(stock[i]['date']);
                    div.appendChild(textNode);
                    card.appendChild(div);
                    column.appendChild(card);
                }
            }
        }
        container.appendChild(row);
    }

}


function HistoricalTable() {
    console.log("Function activate");
    let myTable = document.querySelector('#data_table');
    let employees = [
        { name: '04/01/2016', age: 3918.50, country: 3918.50, names: 3918.50, ages: 3918.50, countrys: '3918.50' },
        { name: '04/01/2016', age: 3918.50, country: 3918.50, names: 3918.50, ages: 3918.50, countrys: '3918.50' },
        { name: '04/01/2016', age: 3918.50, country: 3918.50, names: 3918.50, ages: 3918.50, countrys: '3918.50' },
        { name: '04/01/2016', age: 3918.50, country: 3918.50, names: 3918.50, ages: 3918.50, countrys: '3918.50' }
    ]
    let headers = ['Date', 'Open', 'Close', 'High', 'Low', 'Volume'];
    let table = document.createElement('table');
    table.className = "data_table";

    generateHTableHead(table, headers);
    generateHTable(table, employees);

    myTable.appendChild(table);
}

function generateHTableHead(table, data) {
    let thead = table.createTHead();
    thead.className = "data_head";
    let row = thead.insertRow();
    row.className = "data_header"

    data.forEach(headerText => {
        let header = document.createElement('th');
        header.className = "data_header";
        header.scope = "col";
        let textNode = document.createTextNode(headerText);
        header.appendChild(textNode);
        row.appendChild(header);
    });
}

function generateHTable(table, employees) {
    let tbody = table.createTBody();
    tbody.className = "data_body";

    employees.forEach(emp => {
        let row = tbody.insertRow();
        row.className = "data_row";

        Object.values(emp).forEach(text => {
            let cell = document.createElement('td');
            cell.className = "d_data";
            let textNode = document.createTextNode(text);
            cell.appendChild(textNode);
            row.appendChild(cell);
        })

        table.appendChild(row);
    })
}