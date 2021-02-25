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
    let stock = [
        { stock: 'NIO', name: '04/01/2016', age: 3918.50, country: 3918.50, names: 3918.50, ages: 3918.50, countrys: '3918.50' },
        { stock: 'NIO', name: '04/01/2016', age: 3918.50, country: 3918.50, names: 3918.50, ages: 3918.50, countrys: '3918.50' },
        { stock: 'NIO', name: '04/01/2016', age: 3918.50, country: 3918.50, names: 3918.50, ages: 3918.50, countrys: '3918.50' },
        { stock: 'NIO', name: '04/01/2016', age: 3918.50, country: 3918.50, names: 3918.50, ages: 3918.50, countrys: '3918.50' },
        { stock: 'NIO', name: '04/01/2016', age: 3918.50, country: 3918.50, names: 3918.50, ages: 3918.50, countrys: '3918.50' }
    ]
    let headers = ['Stock', 'Date', 'Open', 'Close', 'High', 'Low', 'Volume'];
    let table = document.createElement('table');
    table.className = "stock_table";

    generateSTableHead(table, headers);
    generateSTable(table, stock);

    myTable.appendChild(table);
}

function generateSTableHead(table, data) {
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

function generateSTable(table, employees) {
    console.log("GenerateStable")
    let tbody = table.createTBody();
    tbody.className = "stock_body";

    employees.forEach(emp => {
        let row = tbody.insertRow();
        row.className = "stock_row";

        Object.values(emp).forEach(text => {
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
    let stock = [
        { name: 'Nio', age: 3918.50 },
        { name: 'GME', age: 3918.50 },
        { name: 'Nio', age: 3918.50 },
        { name: 'Nio', age: 3918.50 },
        { name: 'Nio', age: 3918.50 },
        { name: 'Nio', age: 3918.50 },
        { name: 'Nio', age: 3918.50 },
        { name: 'Nio', age: 3918.50 },
        { name: 'Nio', age: 3918.50 },
        { name: 'Nio', age: 3918.50 }
    ]
    let container = document.querySelector('#card_container');
    let h1 = document.createElement('h1');
    let text = document.createTextNode("Popular Data")
    h1.className = "title";
    h1.appendChild(text);
    container.appendChild(h1);

    generateRow(container, stock);
    // generateCard(container, stock);

    console.log("Card is functioning");

}

function generateRow(container, stock) {
    var count = 0;
    // for (i = count; i < stock.length; count++) {
    //     if (i % 5 == 0) {
    let row = document.createElement("div");
    row.className = "row_container";
    container.appendChild(row);
    console.log("Row Created");

    stock.forEach(stock => {
        let column = document.createElement('div');
        column.className = "column";
        row.appendChild(column);
        let card = document.createElement('div');
        card.className = "card";

        Object.values(stock).forEach(text => {
            let div = document.createElement('div');
            //div.className="card";
            let textNode = document.createTextNode(text);
            div.appendChild(textNode);
            card.appendChild(div);
            column.appendChild(card);
        })


        container.appendChild(row);
    });
    // }
}
    // generateCard(container,stock);
function generateCard(container, stock) {

    stock.forEach(stock => {
        let column = document.createElement('div');
        column.className = "column";
        container.appendChild(column);
        let card = document.createElement('div');
        card.className = "card";

        Object.values(stock).forEach(text => {
            let div = document.createElement('div');
            //div.className="card";
            let textNode = document.createTextNode(text);
            div.appendChild(textNode);
            card.appendChild(div);
            column.appendChild(card);
        })


        container.appendChild(column);
    });
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
    });

}
