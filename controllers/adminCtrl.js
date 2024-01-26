const Admin = require('../models/adminModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const adminCtrl = {
    getAdmins: async (req, res) => {
        try {
            const admins = await Admin.find();
            res.json(admins);
        } catch (err) {
            return res.status(500).json({ error: err.message})
        }
    },
    getAdmin: async (req, res) => {
        try {
            const admin = await Admin.findById(req.params.id)
            res.json(admin)
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    },
    registerAdmin: async (req, res) => {
        try {
            const {userName, email, password, phoneNumber } = req.body;

            const usedEmail = await Admin.findOne({email})
            if (usedEmail) {
                return res.status(400).json({ error: 'Email taken.'})
            }

            const passwordHash = await bcrypt.hash(password, 16)
            const newAdmin = new Admin({
                userName: userName,
                email: email,
                password: passwordHash,
                phoneNumber: phoneNumber
            });

            await newAdmin.save();

            res.json({ msg: `Administrator ${newAdmin.userName} registered.`})
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    },
    loginAdmin: async (req, res) => {
        try {
            const { email, password } = req.body;

            const admin = await Admin.findOne({ email: email});
            if (!admin) {
                return res.status(400).json({ error: "Admin does not exist..."});
            }

            const isMatch = await bcrypt.compare(password, admin.password)
            if (!isMatch) {
                return res.status(400).json({ error: "Incorrect password."})
            }

            const payload = {id: admin.id, name: admin.userName}
            const token = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: "1d"});

            return res.json({
                Token: token,
                admin: {
                    id: admin.id,
                    name: admin.userName,
                    email: admin.email
                }
            })
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    },
    verifyAdminToken: async (req, res) => {
        try {
            const token = req.header('Authorization');

            if (!token) {
                return res.status(401).json({ error: 'No token, Authorization denied.' });
            }

            jwt.verify(token, process.env.TOKEN_SECRET, async (err, verified) => {
                if (err) {
                    return res.status(401).json({ error: 'Token is not valid'});
                }

                const admin = await Admin.findById(verified.id)

                if (!admin) {
                    return res.status(403).json({ error: 'Unauthorized access' })
                }
                return res.json({ id: admin.id, userName: admin.userName});
            })
        } catch (err) {
            return res.status(500).json({ error: err.message})
        }
    }
};

module.exports = adminCtrl;