const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");

//To return a random string of length 10

function generateRandomString() {
  possibleCombination = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split('');
  let string = "";
  for(let i = 0; i < 6; i++) {
    string += possibleCombination[Math.floor(Math.random()*possibleCombination.length)];
  } 
  return string;
}
console.log(generateRandomString());



const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/u/:shortURL", (req, res) => {
  const longURl = "http://www.lighthouselabs.ca";
  res.redirect(longURL);
});

app.post("/urls", (req,res) => {
  console.log(req.body);
  res.send("Ok");
});

app.use(bodyParser.urlencoded({extended: true}));

app.get("/urls/new",(req,res) => {
  res.render("urls_new");
});

app.get("/urls", (req,res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});
app.get("/urls/:shortURL", (req,res) => {
  const templateVars = {shortURL: req.params.shortURL, longURL: urlDatabase};
  res.render("urls_show", templateVars);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/hello",(req,res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n")
});
app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
});
app.get("/fetch", (req, res) => {
  res.send(`a = {a}`);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});