const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

const User = require('../../models/User');

module.exports.test = (req, res) => {
    return res.status(200).json({ msg: 'User route works' });
}

module.exports.register = (req, res) => {

    //Check validation
    const { errors, isValid } = validateRegisterInput(req.body);
    if (!isValid) { return res.status(400).json({ success: false, msg: errors }); }

    // Check if an User with this email exists
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) {
            return res.status(400).json({ success: false, msg: 'Database error: unable to find user' });
        } else if (user) {
            return res.status(400).json({ success: true, msg: 'Email already registered' });
        }

        // If User doesn't exist, create one
        const newUser = new User({
            email: req.body.email,
            name: req.body.name,
        });

        // Hash password
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                return res.status(400).json({ success: false, msg: 'Salt failed' });
            }

            bcrypt.hash(req.body.password, salt, (err, hash) => {
                if (err) {
                    return res.status(400).json({ success: false, msg: 'password hashing failed' });
                }
                newUser.password = hash;

                // Save user
                newUser.save((err) => {
                    if (err) {
                        return res.status(422).json({ success: false, msg: 'Database error, registration failed' });
                    }
                    return res.status(200).json({ success: true, user: newUser });
                });
            });
        });


    });
}

module.exports.login = (req, res) => {

    //Check validation
    const { errors, isValid } = validateLoginInput(req.body);
    if (!isValid) { return res.status(400).json({ success: false, msg: errors }); }


    //Find User by email
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) {
            return res.status(400).json({ success: false, msg: 'Database error: unable to find user, please retry' });
        } else if (!user) {
            return res.status(400).json({ success: false, msg: 'Email not registered' });
        } else {
            //Check password
            bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
                if (err) {
                    return res.status(400).json({ success: false, msg: 'Password comparison failed' });
                } else if (!isMatch) {
                    return res.status(400).json({ success: false, msg: 'Password incorrect' });
                } else {
                    // User matched
                    const payload = { id: user._id, name: user.name }; //Create JWT payload

                    // Sign Token
                    jwt.sign(payload, process.env.secretOrKey, { expiresIn: '10d' }, (err, token) => {
                        if (err) {
                            return res.status(400).json({ success: false, msg: 'Token signing failed' });
                        }
                        return res.status(200).status(200).json({ success: true, token: 'Bearer ' + token });
                    });
                }
            });
        }
    });

}

module.exports.profile = (req, res) => {
    return res.status(200).json({
        success: true,
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
        }
    });
}
