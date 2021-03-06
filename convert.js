#!/usr/bin/env node
// Converts a accounts.txt to a accounts.cg.json
// it's recommended to use accounts without steamguard
// email probably doesn't match, to manually add your email (username:pass:email) you can simply
// access i.split(":")[2] and set the email field to it.
// NOTE: this needs node.js, use `npm install` to install all dependencies automatically needed before running it.
var fs = require("fs");

// Load accounts
var accounts = JSON.parse("{ \"array\": [], \"used\": 0 }");

// Temporary storage
var accountsStr = [];

// Remove \n\n by replacing it with \n
var array = fs.readFileSync("accounts.txt").toString().replace(/\n\n/g, "\n").split("\n");
array.pop();
for (i in array) {
    accountsStr.push(array[i]);
}
// Keep track of processed accs and their respective database indexes
var processedAccs = 0;
var dbIdx = 0;

// Loop accs and convert to proper format
accountsStr.forEach(function (i, idx, arr) {
    var json = JSON.parse("{\"login\": \"\",\"password\": \"\",\"email\": \"@inboxkitten.com\",\"community\": true,\"privacy\":{\"profile\": 3,\"comments\": 3,\"inventory\": 3,\"gameDetails\": 3},\"avatar\": \"https://i.imgur.com/avatar.png\",\"summary\": \"summary\",\"username\": \"\",\"created\": 1533672324,\"steamID\": \"1234567891234567\"}");
    json.login = i.split(":")[0];
    json.username = json.login;
    json.password = i.split(":")[1].replace(/(\r\n|\n|\r)/gm, "");
    json.email = json.login.toLowerCase() + "@inboxkitten.com";
    accounts["array"].push(json);
    processedAccs++;
    if (processedAccs >= 1000) {
        processedAccs = 0;
        fs.writeFileSync(`accounts${dbIdx}.cg.json`, JSON.stringify(accounts), "utf8");
        dbIdx++;
        accounts = JSON.parse("{ \"array\": [], \"used\": 0 }");
    }
});
// Write last few accs
if (processedAccs) {
    fs.writeFileSync(`accounts${dbIdx}.cg.json`, JSON.stringify(accounts), "utf8");
}
