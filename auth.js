const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    const token = await req.headers.authorization.split(' ')[1];
    console.log(token, "token");
    console.log(req.headers.authorization.split(' ')[1], "split");
    const decodedToken = await jwt.verify(
      token,
      "RANDOM-TOKEN"
    );
    const user = await decodedToken;
    req.user = user;
    next()
  } catch (error) {
    res.status(400).json({
      error: new Error('Invalid request!')
    });
  }
}