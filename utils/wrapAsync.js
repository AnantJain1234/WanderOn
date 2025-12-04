module.exports = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next))
            .catch(err => {
                // Prevent sending headers twice
                if (!res.headersSent) {
                    return next(err);
                }
                console.error("Headers already sent. Error:", err);
            });
    };
};
