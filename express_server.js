const cookieSession = require("cookie-session");
const express = require("express");
const bodyParser = require("body-parser");
const { getUserByEmail } = require("./helpers");


//const cookieParser = require("cookie-parser");
const bcrypt = require('bcrypt');



const app = express();
//app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
  name:"session",
  keys: ["key1","key2"]
}));



const PORT = 8080; // default port 8080
app.set("view engine", "ejs");

//To return a random string of length 10
function generateRandomString() {
  possibleCombination = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split('');
  let string = "";
  for (let i = 0; i < 6; i++) {
    string += possibleCombination[Math.floor(Math.random() * possibleCombination.length)];
  }
  return string;
}

const urlsForUser = function(id) {
  const userDatabase = {};
  for (let key in urlDatabase){
    if (userDatabase[key].userID === id){
    userDatabase[key] = urlDatabase[key];
  }
}
return userDatabase;
};




const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }

};



const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


app.get("/u/:shortURL", (req, res) => {
  console.log("The is the URL", req.params);
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/register", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: users[req.session.user_id]
  };


  res.render("Urls_register", templateVars);
});

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user_id = generateRandomString();
  //console.log("this is req.body", req.body);

  const emailExist = getUserByEmail(email, users);
  //const {email,passwd} = req.body;
  if (!email || !password) {
    res.status(400);
    res.send("Wrong password or email, try again");
    return;
  }
  if (emailExist) {
    res
      .status(400)
      .send("Email already exists");
    return;

  }
  if (!emailExist) {
    users[user_id] = {
      id: user_id,
      email,
      password: bcrypt.hashSync(password, 10),
    };

  }

  //res.cookie("user_id", user_id);
  req.session.user_id = user_id;
  res.redirect("/urls");
});

//console.log(users);


// app.post("/login", (req,res) => {
//   res.cookies("password", password);
//   res.cookies("username", username);

//   res.redirect("/urls");
// })


app.post("/urls/:shortURL/delete", (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    delete urlDatabase[req.params.shortURL];
    res.redirect('/urls');
  } else {
    res.send('URL does not exist. ERROR!!!!');
  }

});
// console.log(req.)
// res.redirect("/urls")

app.get("/login", (req, res) => {
  const templateVars = {

    user : req.session.user_id
  };
  res.render("url_login", templateVars);
  //res.send('ok');
});


app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = getUserByEmail(email,users);
  if (password.length === 0 || email.length === 0) {
    res
      .status(403)
      .send("Invalid email or password");
    return;
  } else if (!user || !bcrypt.compareSync(password, user.password )) {
    res
      .status(403)
      .send("Wrong login details!");
    return;

  }
  //password.length === 0 || email.length === 0    "Invalid email or password"
  //res.cookie("user_id", user.id);
  req.session.user_id = user.id;
  res.redirect("/urls");



});

app.post("/logout", (req, res) => {


  req.session = null;
  res.redirect("/urls");
});


app.post("/urls", (req, res) => {
  const shortRandomURL = generateRandomString();
  urlDatabase[shortRandomURL] = req.body.longURL;
  //console.log(req.body);
  res.redirect(`/urls/${shortRandomURL}`);
});

app.post("/urls/:id", (req, res) => {
  //console.log('The is the output of the longURL', req.body.longURL);
  //console.log("This is the short url", req.params.id)

  urlDatabase[req.params.id].longURL = req.body.longURL;
  res.redirect('/urls/');

});


app.use(bodyParser.urlencoded({ extended: true }));

app.get("/urls/new", (req, res) => {
  const id = req.session.user_id;
  if (!users[id]) {
    res.redirect("/login");
    return;
  }
  const templateVars = { user: users[req.session.user_id] };

  res.render("urls_new", templateVars
  );
});

app.get("/urls", (req, res) => {
  const id = req.session["user_id"];
  const templateVars = {
    urls: urlDatabase,
    user: users[req.session.user_id],
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL],
    user: users[req.session.user_id]
  };
  res.render("urls_show", templateVars);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/users.json", (req, res) => {
  res.json(users);
});


app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
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