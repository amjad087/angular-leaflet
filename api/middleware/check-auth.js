const jwt = require('jsonwebtoken');

//Check for a valid token
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // token is prefixed with word 'Bearer' and a whitespace
    console.log(token);
    const authToken = jwt.verify(token, 'My_super_large_secret_string'); // jwt will throw an error if token is not valid,
                                                                         //and the execution will go to the catch block.
    //const authToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = {
      email: authToken.email, userId: authToken.userId
    }
    next(); // call next if token is verfied. (no error thrown)
  }
  catch(error) {
    console.log(error);
    res.status(401).json({
      message: 'You are not authenticated!'
    });
  }

};
