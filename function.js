window.onload = function () {
    if (document.URL.includes("data.html")) {
        const urlParams = new URLSearchParams(window.location.search);
        const stock = urlParams.get('name');
        HistoricalTable(stock);
    }
    else if (document.URL.includes("index.html")) {
        stockTable();
        card();
        setInterval(function () {
            sortTable();
            clearInterval(setInterval)
        }, 100);
    }
    else if (document.URL.includes("twitter.html")) {
        tweetPageGenerator();
    }
    else if (document.URL.includes("reddit.html?rdt=Stocks")) {
        redditStockGenerator();
    }
    else if (document.URL.includes("reddit.html?rdt=wallstreetbets")) {
        redditWSBGenerator();
    }
};

//Index.HTML
function stockTable() {
    //Look for stock_table ID 
    let myTable = document.querySelector('#stock_table');
    //Fetch API URL for JSON data 
    fetch('http://localhost:5000/stockslist').then(result => {
        return result.json();
    })
        .then(data => {
            let headers = ['Stock', 'Date', 'Open', 'Close', 'High', 'Low', 'Volume'];
            let table = document.createElement('table');
            table.className = "stock_table";
            table.id = "stockTable";
            generateSTableHead(table, data, headers);
            myTable.appendChild(table);
        })
}
//Generate Table headers 
function generateSTableHead(table, stock, headers) {
    //Create Table Head
    let thead = table.createTHead();
    thead.className = "stock_head";
    let row = thead.insertRow();
    row.className = "stock_header"
    headers.forEach(headerText => {
        let header = document.createElement('th');
        header.className = "stock_header";
        header.scope = "col";
        header.id = headerText;
        let textNode = document.createTextNode(headerText);
        header.appendChild(textNode);
        row.appendChild(header);
    });
    //Creating Table Body
    let tbody = table.createTBody();
    tbody.className = "stock_body";
    let parsed;
    for (i = 0; i < stock.length; i++) {
        let stockName = stock[i];
        //Fetch API URL for JSON data 
        fetch('http://localhost:5000/stocks/' + stock[i]).then(result => {
            return result.json();
        })
            .then(data => {
                parsed = JSON.parse(data);
                let row = tbody.insertRow();
                row.className = "stock_row";
                //Create Stock Row
                let cell = document.createElement('td');
                cell.className = "stock_data";
                let textNode = document.createTextNode(stockName);
                cell.appendChild(textNode);
                row.appendChild(cell);
                // Loop to the amount of keys that the data have
                for (k = 0; k < 7; k++) {
                    appendRow(parsed, row, headers);
                }
                tbody.appendChild(row);
            })
    }
}
//Append Rows into the Table
function appendRow(data, row, headers) {
    for (j = 0; j < 7; j++) {
        //Compare whether keys and header matches
        if (Object.keys(data[0])[j].localeCompare(headers[k]) == 0) {
            //Check if the key is Date in order to format the date
            if (Object.keys(data[0])[j] == "Date") {
                let cell = document.createElement('td');
                cell.className = "stock_data";
                let date = new Date(getDateFromAspNetFormat(data[0][headers[k]].$date));
                let textNode = document.createTextNode(date);
                cell.appendChild(textNode);
                row.appendChild(cell);
            }
            else {
                //Creates row normally
                let cell = document.createElement('td');
                cell.className = "stock_data";
                let textNode = document.createTextNode(data[0][headers[k]]);
                cell.appendChild(textNode);
                row.appendChild(cell);
            }
        }
    }
}
//Sort Table 
function sortTable() {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById('stockTable');
    switching = true;
    //Make a loop that will continue until no switching has been done:
    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        var rows = table.rows;
        //Loop through all table rows (except the first, which contains table headers):
        for (i = 1; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            //Get the two elements you want to compare, one from current row and one from the next:
            x = rows[i].getElementsByTagName("TD")[6];
            y = rows[i + 1].getElementsByTagName("TD")[6];
            //check if the two rows should switch place:
            if (Number(x.innerHTML) < Number(y.innerHTML)) {
                //if so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            /*If a switch has been marked, make the switch
            and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}
//Generate Card
function card() {
    //Locate the container to contain the card 
    let container = document.querySelector('#card_container');
    let h1 = document.createElement('h1');
    let text = document.createTextNode("Popular Data")
    h1.className = "title";
    h1.appendChild(text);
    container.appendChild(h1);
    //Fetch API URL for JSON data 
    fetch('http://localhost:5000/stockslist').then(result => {
        return result.json();
    })
        .then(data => {
            generateRow(container, data);
        })
}
//For Generating Card Row
function generateRow(container, stock) {
    let data = ["AMZN", "AAPL", "BABA", "FB", "NFLX", "GME", "GOOG", "IBM", "ORCL", "TSLA"];
    var count = 0;
    let row = document.createElement("div");
    row.className = "row_container";
    container.appendChild(row);
    //loop through stocks and create cards
    for (i = 0; i < stock.length; i++) {
        for (k = 0; k < data.length; k++) {
            if (stock[i].localeCompare(data[k]) == 0) {
                let column = document.createElement('div');
                column.className = "column";
                row.appendChild(column);
                let card = document.createElement('div');
                card.className = "card";
                let a = document.createElement('a');
                //href for data.html
                a.href = "http://127.0.0.1:5500/data.html?name=" + stock[i];
                let textNode = document.createTextNode(stock[i]);
                a.appendChild(textNode);
                card.appendChild(a);
                column.appendChild(card);
                container.appendChild(row);
            }
        }
    }
}

//Data.HTML
//Creating HistoricalTable
function HistoricalTable(stock) {
    let menu = document.querySelector('#menu_container');
    //Twitter Menu
    let ul = document.createElement('ul');
    ul.className = "menu_list";
    let li = document.createElement('li');
    li.className = "menu_item";
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get('name');
    let a = document.createElement('a');
    a.href = "http://127.0.0.1:5500/twitter.html?name=" + redirect;
    let textNode = document.createTextNode("Twitter");
    a.appendChild(textNode);
    li.appendChild(a);
    ul.appendChild(li);
    menu.appendChild(ul);

    //Create Table
    let myTable = document.querySelector('#data_table');
    //Fetch API URL for JSON data 
    fetch('http://localhost:5000/stocks/' + stock).then(result => {
        return result.json();
    })
        .then(data => {
            let headers = ['Date', 'Open', 'High', 'Low', 'Close', 'Volume'];
            let table = document.createElement('table');
            table.className = "data_table";
            generateHTableHead(table, JSON.parse(data), headers);
            myTable.appendChild(table);
        })
}
//Generate Headers
function generateHTableHead(table, data, headers) {
    //Creating Table Header
    let thead = table.createTHead();
    thead.className = "data_head";
    let row = thead.insertRow();
    row.className = "data_header"
    headers.forEach(headerText => {
        let header = document.createElement('th');
        header.className = "data_header";
        header.scope = "col";
        let textNode = document.createTextNode(headerText);
        header.appendChild(textNode);
        row.appendChild(header);
    });
    //Creating Table Body
    let tbody = table.createTBody();
    tbody.className = "data_body";
    for (i = 0; i < data.length; i++) {  //For Loop for Row
        let row = tbody.insertRow();
        row.className = "data_row";
        for (k = 0; k < Object.keys(data[i]).length; k++) {  // Loop to create Column
            appendHRow(data, row, headers);
        }
        table.appendChild(row);
    }
}
//Append Rows
function appendHRow(data, row, headers) {
    //Loop through the length of data Keys 
    for (j = 0; j < Object.keys(data[i]).length; j++) {
        //Compare and check whether key and header matches 
        if (Object.keys(data[i])[j].localeCompare(headers[k]) == 0) {
            //If Key is equal to Date, Convert Date Format
            if (Object.keys(data[i])[j] == "Date") {
                let cell = document.createElement('td');
                cell.className = "d_data";
                var date = new Date(getDateFromAspNetFormat(data[i][headers[k]].$date));
                let textNode = document.createTextNode(date);
                cell.appendChild(textNode);
                row.appendChild(cell);
            }
            else {
                let cell = document.createElement('td');
                cell.className = "d_data";
                let textNode = document.createTextNode(data[i][headers[k]]);
                cell.appendChild(textNode);
                row.appendChild(cell);
            }
        }
    }
}
//Covert Date format
function getDateFromAspNetFormat(date) {
    const re = /-?\d+/;
    const m = re.exec(date);
    return parseInt(m[0], 10);
}
//Get Labels for Plotting Graph
function getLabel() {
    //Get Parameter from URL
    const urlParams = new URLSearchParams(window.location.search);
    const stock = urlParams.get('name');
    const label = [];
    //Fetch API URL for JSON data 
    fetch('http://localhost:5000/stocks/' + stock).then(result => {
        return result.json();
    })
        .then(data => {
            parsed = JSON.parse(data);
            for (i = parsed.length; i > 0; i--) {
                let date = new Date(getDateFromAspNetFormat(parsed[i - 1].Date.$date));
                //Change Date format to custom format
                var today = date;
                var dd = today.getDate();
                var mm = today.getMonth() + 1;
                if (dd < 10) {
                    dd = '0' + dd;
                }
                if (mm < 10) {
                    mm = '0' + mm;
                }
                today = dd + '/' + mm;
                label.push(today);
            }
        })
    return label;
}

//Twitter.html
function tweetPageGenerator() {
    //Get URL Parameter 
    const urlParams = new URLSearchParams(window.location.search);
    const stock = urlParams.get('name');
    document.getElementById('tweet_title').innerHTML = "Tweets on " + stock;
    let menu = document.querySelector('#menu_container');
    //Twitter Menu
    let ul = document.createElement('ul');
    ul.className = "menu_list";
    let li = document.createElement('li');
    li.className = "menu_item";
    let a = document.createElement('a');
    a.href = "http://127.0.0.1:5500/data.html?name=" + stock;
    let textNode = document.createTextNode("Data");
    a.appendChild(textNode);
    li.appendChild(a);
    ul.appendChild(li);
    menu.appendChild(ul);

    let box = document.querySelector('#tweet_box'); //append last
    //Fetch Data from URL generated by API
    fetch('http://localhost:5000/twitter/' + stock).then(result => {
        return result.json();
    })
        .then(data => {
            parsed = JSON.parse(data)
            GenerateTweet(box, parsed);
        })
}

function GenerateTweet(box, data) {
    //Loop and Generate tweets 
    for (i = 0; i < 50; i++) {
        let entry = document.createElement('div');
        entry.className = "tweetEntry";
        entry.id = "tweetEntry";
        box.appendChild(entry);
        let a = document.createElement('a');
        a.className = "tweetEntry-account-group";
        let time = document.createElement('span');
        time.className = "tweetEntry-timestamp";
        var date = new Date(getDateFromAspNetFormat(data[i].tweet_created.$date));
        time.innerHTML = date;
        a.appendChild(time);
        entry.appendChild(a);
        let text = document.createElement('div');
        text.className = "tweetEntry-text-container";
        text.innerHTML = data[i].tweet_text;
        entry.appendChild(text);
    }
}


//reddit.html
function redditStockGenerator() {
    //Get URL Parameter 
    const urlParams = new URLSearchParams(window.location.search);
    const reddit = urlParams.get('rdt');
    document.getElementById('reddit_title').innerHTML = "Subreddit: " + reddit;
    let box = document.querySelector('#reddit_box'); //append last
    //Fetch Data from URL generated by API
    fetch('http://localhost:5000/reddit/reddit.Stocks').then(result => {
        return result.json();
    })
        .then(data => {
            parsed = JSON.parse(data)
            //Loops through the data to create elements 
            for (i = 0; i < data.length; i++) {
                let entry = document.createElement('div');
                entry.className = "redditEntry";
                entry.id = "redditEntry";
                entry.href=parsed[i].Url;
                box.appendChild(entry);
                let a = document.createElement('a');
                a.className = "redditEntry-URL";
                a.href = parsed[i].Url;
                let strong = document.createElement('strong');
                strong.className = "redditEntry-post";
                strong.innerHTML = parsed[i].Post;
                a.appendChild(strong);
                let time = document.createElement('span');
                time.className = "redditEntry-timestamp";
                time.innerHTML = parsed[i].Date;
                a.appendChild(time);
                entry.appendChild(a);
            }
        })
}

function redditWSBGenerator() {
    //Get URL Parameter 
    const urlParams = new URLSearchParams(window.location.search);
    const reddit = urlParams.get('rdt');
    document.getElementById('reddit_title').innerHTML = "Subreddit: " + reddit;
    let box = document.querySelector('#reddit_box'); //append last
    //Fetch Data from URL generated by API
    fetch('http://localhost:5000/reddit/reddit.wallstreetbets').then(result => {
        return result.json();
    })
        .then(data => {
            parsed = JSON.parse(data)
            //Loops through the data to create elements 
            for (i = 0; i < data.length; i++) {
                let entry = document.createElement('div');
                entry.className = "redditEntry";
                entry.id = "redditEntry";
                entry.href=parsed[i].Url;
                box.appendChild(entry);
                let a = document.createElement('a');
                a.className = "redditEntry-URL";
                a.href = parsed[i].Url;
                let strong = document.createElement('strong');
                strong.className = "redditEntry-post";
                strong.innerHTML = parsed[i].Post;
                a.appendChild(strong);
                let time = document.createElement('span');
                time.className = "redditEntry-timestamp";
                time.innerHTML = parsed[i].Date;
                a.appendChild(time);
                entry.appendChild(a);
            }
        })
}
