const { decrypt } = require("../utils/encrypt-decrypt");


const tokenDecriptor = async (req, res, next) => {

    try {
      
        const encryptedToken = req.headers.authorization?.split(' ')[1];
        
        req.headers.authorization = `Bearer ${decrypt(encryptedToken)}`;

        req.cookies.refresh_token = decrypt(req.cookies.refresh_token);

        next();
    }
    
    catch (error) {

        next(error);

    }
};

module.exports = tokenDecriptor
