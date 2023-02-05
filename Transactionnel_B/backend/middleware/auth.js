const jwt = require('jsonwebtoken');
 
module.exports = (req, res, next) => {
	try {
	const token = req.headers.authorization.split(' ')[1];
	const decodedToken = jwt.verify(token, 'RANDOM_TOKEN');
	const userId = decodedToken.userId;
	if (req.body.userId && req.body.userId !== userId)  // le userID doit �tre valid
		throw "Invalid user Id";
	else
	{
		req.auth = { userId: userId };
		next();
	}
	} catch(error) { res.status(401).json({ error }); }
};