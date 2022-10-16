const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dbConnect = require('./db/dbConnect');
const User = require('./db/userModel');
const auth = require('./auth');


dbConnect();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// body parser configuration
app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res, next) => {
  res.json({ message: "Hey! This is your server response!" });
  next();
});

app.post('/register', (req, res) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hashedPassword) => {
      const user = new User({
        email: req.body.email, 
        password: hashedPassword,
      });
      user.save()
      .then(result => {
        res.status(201).send({
          message: "User created successfully.",
          result,
        })
      })
      .catch(error => {
        res.status(500).send({
          message: "Error creating user.",
          error,
        })
      })
    })
    .catch(error => {
      res.status(500).send({
        message: "Password was not hashed successfully.",
        error,
      });
    })
});

app.get('/free-endpoint', (req, res) => {
  res.json({ message: "You are free to access me anytime." })
});

app.get('/auth-endpoint', auth, (req, res) => {
  res.json({ message: "You are authorized to access me." });
});

app.post('/login', (req, res) => {
  User
    .findOne({ email: req.body.email })
    .then(user => {
      bcrypt.compare(req.body.password, user.password)
      .then(result => {
        if (!result) {
          return res.status(400).send({
            message: "Password is incorrect!",
            error,
          })
        }

      const token = jwt.sign(
        {
          userId: user._id,
          userEmail: user.email,
        },
        "RANDOM-TOKEN",
        { expiresIn: "24h"}
      )

      res.status(200).send({
        message: "Login Successful",
        email: user.email,
        token,
      })

      })
      .catch(error => {
        res.status(400).send({
          message: "Password is incorrect.",
          error,
        })
      });
    })
    .catch(error => {
      res.status(404).send({
        message: "Email was not found.",
        error,
      });
    })
});

// app.post('/login', (req, res) => {
//   User
//     .findOne({ email: req.body.email })
//     .then()
//     .catch(error => {
//       res.status(400).send({
//         message: "Email was not found.",
//         error,
//       });
//     })
//     .then(user => {
//       bcrypt.compare(req.body.password, user.password)
//       .then(result => {
//         result ?
//           res.status(200).send({
//             message: "Password is correct!",
//             result,
//           }) :
//           res.status(200).send({
//             message: "Password is incorrect.",
//             result,
//           });
//       })
//       .catch(error => {
//         res.status(400).send({
//           message: "Password is incorrect.",
//           error,
//         })
//       })
//     })
//     .catch(error => {
//       res.status(500).send({
//         message: "Server error.",
//         error,
//       });
//     });
// });

module.exports = app;
