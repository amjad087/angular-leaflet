const jwt = require('jsonwebtoken');

//Check for a valid token
module.exports = (req, res, nex) => {
  try {
    const token = req.headers.Authorization.split(' ')[1]; // token is prefixed with word 'Bearer' and a whitespace
    jwt.verify(token, 'My_super_large_secret_string'); // jwt will throw an error if token is not valid,
                                                       //and the execution will go to the catch block
    next(); // call next if token is verfied. (no error thrown)
  }
  catch(error) {
    res.status(401).json({
      message: 'You are not authenticated!'
    });
  }

};
