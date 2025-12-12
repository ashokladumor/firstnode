var jwt = require('jsonwebtoken');

exports.CheckToken = async (req,res,next) => {
    jwt.verify(req.headers.authorization,"cdmi",next);
}
