const User = require('../models/User');

const admin = async (req, res, next) => {
    try {
        // req.user.id is attached by the auth middleware that runs before this
        const user = await User.findById(req.user.id);

        if (user && user.role === 'admin') {
            next(); // User is an admin, proceed to the next function (the route handler)
        } else {
            // User is not an admin, send a 'Forbidden' error
            res.status(403).json({ msg: 'Access denied. Admins only.' });
        }
    } catch (err) {
        console.error('Something went wrong with the admin middleware');
        res.status(500).send('Server Error');
    }
};

module.exports = admin;