const ApiError = require('../error/ApiError');

/**
 * Middleware to limit the number of requests within a specified time window.
 *
 * @param {number} windowMs - Time window in milliseconds.
 * @param {string[]} roles - Array of roles for which rate limit is applied.
 * @param {function} cb - Callback function to determine max requests based on user roles.
 * @returns {function} Middleware function to limit requests.
 */
const rateLimit = (windowMs, roles, cb) => {
    let requestCounts = {};

    return async(req, res, next) => {
        try{
            const ip = req.ip;
            let maxRequests = cb(req.user.roles, roles);


            if (!requestCounts[ip]) {
                requestCounts[ip] = { count: 1, firstRequestTime: Date.now() };
            } else {
                const timeElapsed = Date.now() - requestCounts[ip].firstRequestTime;

                if (timeElapsed > windowMs) {
                    // Reset count if window has passed
                    requestCounts[ip] = { count: 1, firstRequestTime: Date.now() };
                } else {
                    requestCounts[ip].count++;
                }
            }

            if (requestCounts[ip].count > maxRequests) {
                throw new ApiError(429, "Too many requests, please try again later.");
            }
            else{
                next();
            }
        }catch (e){
            next(e)
        }

    };
};

module.exports = rateLimit