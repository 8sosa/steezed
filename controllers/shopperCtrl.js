const Shopper = require('../models/shopperModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const multer  = require('multer')

const Storage = multer.diskStorage({
  destination: function(req, file, cb) {
    return cb(null, "./Avatar")
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}_${file.originalname}`)
  }
})

const upload = multer({storage: Storage}).single('file')

const shopperCtrl = {
  getShoppers: async (req, res) => {
    try {
      const shoppers = await Shopper.find();
      res.json(shoppers);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  registerShopper: async (req, res) => {
    try {
      upload(req, res, async(err) => {
        if (err) {
          return res.json(err)
        } 
        else {
          const { firstName, lastName, userName, email, password, phoneNumber, address } = req.body;

          // Check if the email already exists
          const existingShopper = await Shopper.findOne({ email });

          if (existingShopper) {
            return res.status(400).json({ msg: 'Email already in use, another Adventurer beat you to it it seems...' });
          }
          let image = {};
          if (req.file) {
            image = {
              data: req.file.filename,
              contentType: 'image/png'
            };
          }
  
          // Register a new shopper
          const passwordHash = await bcrypt.hash(password, 15);
          const newShopper = new Shopper({
            firstName,
            lastName,
            userName,
            image,
            imageName: req.file ? req.file.filename : '', // handle the case when no file is uploaded
            email,
            password: passwordHash,
            phoneNumber,
            address
          });

          // Save the new shopper to the database
          await newShopper.save();

          res.json({ msg:  `Welcome adventurer ${newShopper.userName}, may the loot god bless your hands...` });
        }
      })
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  updateShopper: async (req, res) => {
    try {
      upload(req, res, async (err) => {
        if (err) {
          return res.json(err);
        } else {
          const { firstName, lastName, userName, email, password, phoneNumber, address } = req.body;
          const shopperId = req.params.id; // Assuming you pass the shopper's ID in the URL parameters
  
          // Check if the shopper with the given ID exists
          const existingShopper = await Shopper.findById(shopperId);
  
          if (!existingShopper) {
            return res.status(404).json({ msg: 'Shopper not found.' });
          }

          // Update shopper details
          existingShopper.firstName = firstName;
          existingShopper.lastName = lastName;
          existingShopper.userName = userName;
          existingShopper.email = email;
          existingShopper.phoneNumber = phoneNumber;
          existingShopper.address = address;
  
          // Check if the password is provided and update it if necessary
          if (password) {
            const passwordHash = await bcrypt.hash(password, 15);
            existingShopper.password = password || passwordHash;
          }
  
          // Check if an image is uploaded and update it if necessary
          if (req.file) {
            existingShopper.image = {
              data: req.file.filename,
              contentType: 'image/png'
            };
            existingShopper.imageName = req.file.filename;
          }
  
          // Save the updated shopper to the database
          await existingShopper.save();
  
          res.json(existingShopper);
        }
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getShopper: async (req, res) => {
      try {
        const shopper = await Shopper.findById(req.params.id);
        res.json(shopper);
      } catch (err) {
        return res.status(500).json({ msg: err.message });
      }
    },
    
  deleteShopper: async (req, res) => {
    try {
      await Shopper.findByIdAndDelete(req.params.id);
      res.json({ msg: 'Adventurer deleted successfully' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  loginShopper: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Check if the shopper exists
      const shopper = await Shopper.findOne({ email: email });
      if (!shopper) {
        return res.status(400).json({ msg: 'Adventurer does not exist...' });
      }

      // Check if the password is correct
      const isMatch = await bcrypt.compare(password, shopper.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Incorrect password, is it really you?' });
      }

      // Generate a JWT token
      const payload = {id: shopper.id, name: shopper.userName}
      const token = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: "1d" });

      res.json({
        Token: token,
        shopper: {
          id: shopper.id,
          name: shopper.userName,
          email: shopper.email,
        },
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  verifyShopperToken: (req, res) => {
    try {
      // Extract the token from the request headers
      const token = req.header('Authorization');

       // Check if the token is extracted
      if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
      }

      // Verify the token
      jwt.verify(token, process.env.TOKEN_SECRET, async (err, verified) => {
        if (err) {
          return res.status(401).json({ msg: 'Token is not valid' });
        }

        // if token is valid
        const shopper = await Shopper.findById(verified.id)
        
        // check if shopper exists
        if(!shopper) {
            return res.status(403).json({msg: 'Unauthorized access'})
        }
        return res.json({ id: shopper.id, username: shopper.userName });
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = shopperCtrl;
