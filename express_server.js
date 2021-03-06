const cookieSession = require("cookie-session");
const express = require("express");
const methodOverride = require('method-override');
const { getUserByEmail, getDate, generateRandomString } = require("./helpers");
const bcrypt = require('bcrypt');
const app = express();
app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
  name: "session",
  keys: ["key1", "key2"]
}));
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");

// An object to keep users information. New users are added here to.
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

// A database to store users url (both short and long urls)
const urlDatabase = {
  "b2xVn2": {
    shortURL: "b2xVn2",
    longURL: "http://www.lighthouselabs.ca",
    userID: "randomString",
    date: "",
    visitCount: 0,
    uniqueVisitCount: 0
  }
};

const urlsForUser = function (id) {
  const userDatabase = {};
  for (let key in urlDatabase) {
    if (urlDatabase[key].userID === id) {
      userDatabase[key] = urlDatabase[key];
    }
  }
  return userDatabase;
};

//Takes care of the GET request to path/u/:shortURL
app.get("/u/:shortURL", (req, res) => {
  const shortURL = urlDatabase[req.params.shortURL];
  if (!shortURL) {
    return res.status(404).send("Not found!");
  }
  else {
    const longURL = urlDatabase[req.params.shortURL].longURL;
    if (!req.session.user_id) {
      req.session.visitID = generateRandomString();
      urlDatabase[req.params.shortURL].uniqueVisitCount += 1;
    }
    urlDatabase[req.params.shortURL].visitCount++;
    res.redirect(longURL);
  }
});

//Registration request
app.get("/register", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: users[req.session.user_id]
  };
  res.render("Urls_register", templateVars);
});

//Checks for valid registration details and maps it to the database to check if the user already created an account before
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user_id = generateRandomString();
  const emailExist = getUserByEmail(email, users);
  if (!email || !password) {
    res.status(400).send("Wrong password or email, try again");
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
  req.session.user_id = user_id;
  res.redirect("/urls");
});

//Takes care of the delete request from the user
app.delete("/urls/:shortURL", (req, res) => {
  if (urlDatabase[req.params.shortURL] && urlDatabase[req.params.shortURL].userID === req.session.user_id) {
    delete urlDatabase[req.params.shortURL];
    res.redirect('/urls');
  } else {
    res.send('URL does not exist. ERROR!!!!');
  }
});

// login request, handles client's login
app.get("/login", (req, res) => {
  const templateVars = {
    user: req.session.user_id
  };
  res.render("url_login", templateVars);
});

// Takes care of the login and gives error message if the user does not give the correct login details
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = getUserByEmail(email, users);
  if (password.length === 0 || email.length === 0) {
    res
      .status(403)
      .send("Invalid email or password");
    return;
  } else if (!user || !bcrypt.compareSync(password, user.password)) {
    res
      .status(403)
      .send("Wrong login details!");
    return;
  }
  req.session.user_id = user.id;
  res.redirect("/urls");
});

// logs out the user and clears the cookie info
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

// Create new short URL for corresponding long URL
app.post("/urls", (req, res) => {
  const shortRandomURL = generateRandomString();
  let date = getDate();
  urlDatabase[shortRandomURL] = {
    longURL: req.body.longURL,
    shortURL: shortRandomURL,
    userID: req.session.user_id,
    date,
    visitCount: "",
    uniqueVisitCount: ""
  };
  res.redirect(`/urls/${shortRandomURL}`);
});

//##############################
//  ---------- UPDATE - Edit url ---------
// #############################
app.put("/urls/:shortURL", (req, res) => {
  if (req.session.user_id === urlDatabase[req.params.shortURL].userID) {
    urlDatabase[req.params.shortURL].longURL = req.body.longURL;
  }
  res.redirect('/urls/');
});

//Takes care of the new request from the user
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

//route for list of URL page
app.get("/urls", (req, res) => {
  const id = req.session.user_id;
  const templateVars = {
    urls: urlsForUser(id),
    user: users[req.session.user_id],
  };
  res.render("urls_index", templateVars);
});

//Takes care of the update request
app.get("/urls/:shortURL", (req, res) => {
  const shortURl = urlDatabase[req.params.shortURL];
  if (!shortURl) {
    return res.status(403).send("Login is required or Not your URL");
  }

  const templateVars = {
    shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL],
    user: users[req.session.user_id],
    date: urlDatabase[req.params.shortURL].date,
    visitCount: urlDatabase[req.params.shortURL].visitCount,
    uniqueVisitCount: urlDatabase[req.params.shortURL].uniqueVisitCount
  };
  if (req.session["user_id"] && users[req.session.user_id].id === urlDatabase[req.params.shortURL].userID) {
    res.render("urls_show", templateVars);
  }
});

// GET to the path/ page
app.get("/", (req, res) => {
  const id = req.session.user_id;
  if (!users[id]) {
    res.redirect("/login");
    return;
  }
  res.redirect('/urls');
});

// Get request for the url database
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// Get request for users
app.get("/users.json", (req, res) => {
  res.json(users);
});

// Get request with hello and other request examples
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

//Server listening/connecting and getting ready
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});