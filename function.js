window.onload = function () {
    if (document.URL.includes("data.html")) {
        HistoricalTable();
    }
    else if (document.URL.includes("index.html")) {
        stockTable();
        card();
    }
    else if (document.URL.includes("twitter.html")) {
        tweetPageGenerator();
    }
    else if (document.URL.includes("reddit.html")) {
        redditPageGenerator();
    }

};

//Index.HTML
function stockTable() {
    console.log("stockTable activate");
    let myTable = document.querySelector('#stock_table');
    fetch('http://localhost:3000/stock').then(result => {
        return result.json();
    })
        .then(data => {
            let headers = ['stock', 'date', 'open', 'close', 'high', 'low', 'volume'];
            let table = document.createElement('table');
            table.className = "stock_table";
            generateSTableHead(table, data, headers);
            myTable.appendChild(table);
        })
}

function generateSTableHead(table, data, headers) {
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
    for (i = 0; i < data.length; i++) {  //For Loop for Row
        let row = tbody.insertRow();
        row.className = "stock_row";
        for (k = 1; k < Object.keys(data[i]).length; k++) {  // Loop to create Column
            appendRow(data, row, headers);
        }
        table.appendChild(row);
    }
}

function appendRow(data, row, headers) {
    if ((Object.keys(data[i])[k + 1]) == headers[k]) {
        let cell = document.createElement('td');
        cell.className = "stock_data";
        let textNode = document.createTextNode(data[i][headers[k - 1]]);
        cell.appendChild(textNode);
        row.appendChild(cell);
    }
}

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
        a.href = "http://localhost:5000/stocks/" + stock[i];
        let textNode = document.createTextNode(stock[i]);
        a.appendChild(textNode);
        card.appendChild(a);
        column.appendChild(card);
        container.appendChild(row);
    }

}

//Data.HTML
function HistoricalTable() {
    let myTable = document.querySelector('#data_table');
    fetch('http://localhost:5000/stocks/GME').then(result => {
        // console.log(result.json);
        return result.json();
    })
        .then(data => {
            console.log(JSON.parse(data));
            let headers = ['Date', 'Open', 'High', 'Low', 'Close', 'Volume'];
            let table = document.createElement('table');
            table.className = "data_table";
            generateHTableHead(table, JSON.parse(data), headers);
            myTable.appendChild(table);
            console.log("Done Appending");
        })
}

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
        // console.log(Object.keys(data[i]).length);
        for (k = 0; k < Object.keys(data[i]).length; k++) {  // Loop to create Column
            appendHRow(data, row, headers);
        }
        table.appendChild(row);
    }
}

function appendHRow(data, row, headers) {
    for(j=0; j<Object.keys(data[i]).length; j++){
        if (Object.keys(data[i])[j].localeCompare(headers[k]) == 0) {
            if(Object.keys(data[i])[j] == "Date"){
                console.log(Object.keys(data[i])[k]);
                let cell = document.createElement('td');
                cell.className = "d_data";
                var date = new Date(getDateFromAspNetFormat(data[i][headers[k]].$date));
                let textNode = document.createTextNode(date);
                cell.appendChild(textNode);
                row.appendChild(cell);
                console.log("Row Appended");
            }
            else{
                console.log(Object.keys(data[i])[k]);
                let cell = document.createElement('td');
                cell.className = "d_data";
                let textNode = document.createTextNode(data[i][headers[k]]);
                cell.appendChild(textNode);
                row.appendChild(cell);
                console.log("Row Appended");
            }
        }
    }
}

function getDateFromAspNetFormat(date){
    const re = /-?\d+/;
    const m = re.exec(date);
    return parseInt(m[0], 10);
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

            myTable.appendChild(table);
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
        // a.href = "";
        // let strong = document.createElement('strong');
        // strong.className = "tweetEntry-fullname";
        // strong.innerHTML = data[i].name;
        // a.appendChild(strong);
        // let span = document.createElement('span');
        // span.className = "tweetEntry-username";
        // span.innerHTML = data[i].username + "    &#183";
        // a.appendChild(span);
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