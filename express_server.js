const express = require("express");
const bodyParser = require("body-parser");

const cookieParser =require("cookie-parser");

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const PORT = 8080; // default port 8080
app.set("view engine", "ejs");

// app.use(
//   cookieSession({
//     name:"session",
//     keys:["tiny"],
//   })
// );

//To return a random string of length 10
function generateRandomString() {
  possibleCombination = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split('');
  let string = "";
  for(let i = 0; i < 6; i++) {
    string += possibleCombination[Math.floor(Math.random()*possibleCombination.length)];
  } 
  return string;
}
//console.log(generateRandomString());



const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


app.get("/u/:shortURL", (req, res) => {
  console.log("The is the URL",req.params);
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});
app.post("/urls/:shortURL/delete", (req, res) => {
  if(urlDatabase[req.params.shortURL]) {
    delete urlDatabase[req.params.shortURL]
    res.redirect('/urls')
  } else {
    res.send('URL does not exist. ERROR!!!!')
  }
  // console.log(req.)
  // res.redirect("/urls")
})
app.post("/login",(req,res) => {
  console.log(req.body);
  
  res.cookie("username", req.body.username);
  res.redirect("/urls");

})
app.post("/logout",(req,res) => {
  console.log(req.body);
  
  res.clearCookie("username")
  res.redirect("/urls");
})


app.post("/urls", (req,res) => {
  const shortRandomURL = generateRandomString()
  urlDatabase[shortRandomURL] = req.body.longURL
  //console.log(req.body);
  res.redirect(`/urls/${shortRandomURL}`);
});

app.post("/urls/:shortURL/edit", (req,res) =>{
  console.log('The is the output of the longURL',req.body.longURL);
  console.log("This is the short url",req.params.shortURL)  

  urlDatabase[req.params.shortURL].longURL = req.body.longURL;
  res.redirect('/urls')

});


app.use(bodyParser.urlencoded({extended: true}));

app.get("/urls/new",(req,res) => {
  res.render("urls_new");
});

app.get("/urls", (req,res) => {
  const id = req.session;
  const templateVars = { urls: urlDatabase,id,
  username:req.cookies["username"] };
  res.render("urls_index", templateVars);
});
app.get("/urls/:shortURL", (req,res) => {
  const templateVars = {shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
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