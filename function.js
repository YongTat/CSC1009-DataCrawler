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
    else if (document.URL.includes("reddit.html")) {
        redditPageGenerator();
    }
    sortTable();
};


//Index.HTML
function stockTable() {
    let myTable = document.querySelector('#stock_table');
    fetch('http://localhost:5000/stockslist').then(result => {
        return result.json();
    })
        .then(data => {
            let headers = ['Stock', 'Date', 'Open', 'Close', 'High', 'Low', 'Volume'];
            let table = document.createElement('table');
            table.className = "stock_table";
            table.id = "stockTable";
            table.onload = "sortTable()";
            generateSTableHead(table, data, headers);
            myTable.appendChild(table);
        })
}
//Generate Table headers 
function generateSTableHead(table, stock, headers) {
    let selected = [];
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

    let tbody = table.createTBody();
    tbody.className = "stock_body";
    let parsed;
    for (i = 0; i < stock.length; i++) {
        let stockName = stock[i];
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

                for (k = 0; k < Object.keys(parsed[i]).length; k++) {  // Loop to create Column
                    appendRow(parsed, row, headers);
                }
                table.appendChild(row);
            })
    }
}
//Append Rows into the Table
function appendRow(data, row, headers) {
    for (j = 0; j < Object.keys(data[i]).length; j++) {
        if (Object.keys(data[0])[j].localeCompare(headers[k]) == 0) {
            if (Object.keys(data[0])[j] == "Date") {
                let cell = document.createElement('td');
                cell.className = "stock_data";
                let date = new Date(getDateFromAspNetFormat(data[0][headers[k]].$date));
                let textNode = document.createTextNode(date);
                cell.appendChild(textNode);
                row.appendChild(cell);
            }
            else {
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
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        var rows = table.rows;
        /*Loop through all table rows (except the
        first, which contains table headers):*/
        for (i = 1; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            /*Get the two elements you want to compare,
            one from current row and one from the next:*/
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
    let container = document.querySelector('#card_container');
    let h1 = document.createElement('h1');
    let text = document.createTextNode("Popular Data")
    h1.className = "title";
    h1.appendChild(text);
    container.appendChild(h1);
    fetch('http://localhost:5000/stockslist').then(result => {
        return result.json();
    })
        .then(data => {
            generateRow(container, data);
        })
}
//For Generating Card Row
function generateRow(container, stock) {
    var count = 0;
    let row = document.createElement("div");
    row.className = "row_container";
    container.appendChild(row);
    for (i = 0; i < stock.length; i++) {
        let column = document.createElement('div');
        column.className = "column";
        row.appendChild(column);
        let card = document.createElement('div');
        card.className = "card";
        let a = document.createElement('a');
        a.href = "http://127.0.0.1:5500/data.html?name=" + stock[i];
        let textNode = document.createTextNode(stock[i]);
        a.appendChild(textNode);
        card.appendChild(a);
        column.appendChild(card);
        container.appendChild(row);
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
    a.href = "http://127.0.0.1:5500/twitter.html?name=" + redirect ;
    let textNode = document.createTextNode("Twitter");
    a.appendChild(textNode);
    li.appendChild(a);
    ul.appendChild(li);

    //Reddit Menu
    let li1 = document.createElement('li');
    li1.className = "menu_item";
    let a1 = document.createElement('a');
    a1.href = "http://127.0.0.1:5500/reddit.html?name=" + redirect ;
    let textNode1 = document.createTextNode("Reddit");
    a1.appendChild(textNode1);
    li1.appendChild(a1);
    ul.appendChild(li1);
    menu.appendChild(ul);

    //Create Table
    let myTable = document.querySelector('#data_table');
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
    for (j = 0; j < Object.keys(data[i]).length; j++) {
        if (Object.keys(data[i])[j].localeCompare(headers[k]) == 0) {
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
    const urlParams = new URLSearchParams(window.location.search);
    const stock = urlParams.get('name');
    const label = [];
    fetch('http://localhost:5000/stocks/' + stock).then(result => {
        return result.json();
    })
        .then(data => {
            parsed = JSON.parse(data);
            for (i = parsed.length; i > 0; i--) {
                let date = new Date(getDateFromAspNetFormat(parsed[i - 1].Date.$date));
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
    console.log(label);
    return label;

}

//Twitter.html
function tweetPageGenerator() {
    document.getElementById('tweet_title').innerHTML = "Tweets on + Insert Name of Stock";
    let box = document.querySelector('#tweet_box'); //append last
    fetch('http://localhost:3000/twitter').then(result => {
        return result.json();
    })
        .then(data => {
            GenerateTweet(box, data);
        })
}

function GenerateTweet(box, data) {
    for (i = 0; i < data.length; i++) {
        let entry = document.createElement('div');
        entry.className = "tweetEntry";
        entry.id = "tweetEntry";
        box.appendChild(entry);
        let a = document.createElement('a');
        a.className = "tweetEntry-account-group";
        let time = document.createElement('span');
        time.className = "tweetEntry-timestamp";
        time.innerHTML = data[i].timestamp;
        a.appendChild(time);
        entry.appendChild(a);
        let text = document.createElement('div');
        text.className = "tweetEntry-text-container";
        text.innerHTML = data[i].content;
        entry.appendChild(text);
    }
}

//reddit.html

function redditPageGenerator() {
    console.log("function");
    document.getElementById('reddit_title').innerHTML = "Post related to + Insert Name of reddit";
    let tweet = [
        { username: 'u/Janelle', name: 'Jan', timestamp: '9hr', content: '3918.503918.503918.503918.503918.503918.503918.503918.503918.503918.503918.503918.503918.503918.503918.503918.503918.503918.50' },
        { username: 'u/Janelle', name: 'Jan', timestamp: '9hr', content: ' 3918.503918.503918.503918.503918.503918.503918.503918.503918.503918.503918.503918.503918.503918.503918.503918.503918.503918.503918.503918.50' },
        { username: 'u/Janelle', name: 'Jan', timestamp: '9hr', content: '33918.503918.503918.503918.50918.50' },
        { username: 'u/Janelle', name: 'Jan', timestamp: '9hr', content: '393918.503918.503918.503918.503918.503918.503918.503918.5018.50' }
    ]
    let box = document.querySelector('#reddit_box'); //append last
    
    for (i = 0; i < tweet.length; i++) {
        let entry = document.createElement('div');
        entry.className = "redditEntry";
        entry.id = "redditEntry";
        box.appendChild(entry);
        let a = document.createElement('a');
        a.className = "redditEntry-account-group";
        a.href = "";
        let strong = document.createElement('strong');
        strong.className = "redditEntry-fullname";
        strong.innerHTML = tweet[i].name;
        a.appendChild(strong);
        let span = document.createElement('span');
        span.className = "redditEntry-username";
        span.innerHTML = "   &#183 Posted by: " + tweet[i].username + "    &#183";
        a.appendChild(span);
        let time = document.createElement('span');
        time.className = "redditEntry-timestamp";
        time.innerHTML = tweet[i].timestamp;
        a.appendChild(time);
        entry.appendChild(a);
        let text = document.createElement('div');
        text.className = "redditEntry-text-container";
        text.innerHTML = tweet[i].content;
        entry.appendChild(text);
    }

}