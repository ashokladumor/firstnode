const user = require('../model/usermodel');
const product = require('../model/productmodel');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
let nodemailer = require('nodemailer');

// Nodemailer configuration
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ashokladumor.cdmi@gmail.com',
        pass: 'srtj ados qwvi zpsj' // 16-char password from Google
    }
});

exports.Insert = async (req, res) => {
        
    try {

        // Multer puts uploaded file info in req.file
        if (!req.file) {
            return res.status(400).json({ error: 'Image file is required' });
        }
        
        var b_pass = await bcrypt.hash(req.body.password, 10);
        req.body.password = b_pass;
        req.body.image = req.file.filename;
        var data = await user.create(req.body);

        let mailOptions = {
            from: 'ashokladumor.cdmi@gmail.com',
            to: 'ashokladumor.cdmi@gmail.com',
            subject: 'Sending Email using Node.js',
            text: 'That was easy! 5566'
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                res.status(201).json({
                    message: 'User created successfully',
                    data
                });
            }
        });
    } catch (error) {

        if (error.code === 11000 && error.keyPattern.email) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        res.status(400).json({
            message: error.message
        })
    }
};

exports.addProduct = async (req, res) => {

    try {
        var data = await product.create(req.body);
        res.status(201).json({
            message: 'Product created successfully',
            data
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
};

exports.GetProduct = async (req, res) => {
    try {
        var data = await product.find().populate('user_id');
        return res.status(200).json({
            message: 'Data successfully',
            data
        });
    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(400).json({ message: error.message });
    }
};


exports.data = async (req, res) => {
    try {
        return res.status(200).json({
            message: 'Data successfully',
        });
    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(400).json({ message: error.message });
    }
};


exports.Login = async (req, res) => {
    try {
        var data = await user.find({ email: req.body.email });

        if (data.length == 1) {
            bcrypt.compare(req.body.password, data[0].password, async function (err, result) {

                if (result == true) {

                    const token = await jwt.sign({ id: data[0].id }, "cdmi", { expiresIn: "60s" });
                    return res.status(200).json({
                        message: 'Login successfully',
                        token
                    });
                }
                else {
                    return res.status(200).json({
                        message: 'Mail id and password is wrong.',
                    });
                }
            });
        } else {
            return res.status(200).json({
                message: 'Mail id is wrong.',
            });
        }
    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(400).json({ message: error.message });
    }
};

exports.Update = async (req, res) => {
    try {
        const userId = req.params.id;
        const updateData = req.body;

        const updatedUser = await user.findByIdAndUpdate(userId, updateData, {
            new: true,              // return the updated document
            runValidators: true     // run model validators
        });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { password, ...safeData } = updatedUser.toObject();

        return res.status(200).json({
            message: 'User updated successfully',
            data: safeData
        });
    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(400).json({ message: error.message });
    }
};

exports.Delete = async (req, res) => {
    try {
        const userId = req.params.id;

        const deletedUser = await user.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({
            message: 'User deleted successfully',
        });
    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(400).json({ message: error.message });
    }
};

exports.GetData = async (req, res) => {
    try {
        // const data = await user.find();
        // const data = await user.findById('6835a377a929f9c541587bff');
        // const data = await user.find({'email':'admin2@gmail.com'});
        // const data = await user.find().select('name email');
        // const data = await user.find().select('name email').sort({ name: 1 });
        // const data = await user.find().limit(5);
        // const data = await user.find().skip(2);
        // const data = await user.find().sort('name',1); 
        // const data = await user.find().sort({ name: -1 });
        // const data = await user.countDocuments();

        //pagination
        const page_no = req.query.page_no || 1;
        var limit = 4;
        var skip = (page_no - 1) * limit;
        var data = await user.find().skip(skip).limit(limit);


        return res.status(200).json({
            message: 'Data successfully',
            data,
            page_no
        });
    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(400).json({ message: error.message });
    }
};

exports.uploadImage = (req, res) => {
  // Multer puts uploaded file info in req.file
  if (!req.file) {
    return res.status(400).json({ error: 'Image file is required' });
  }

  // Other form fields are available on req.body
  
  const { title, description } = req.body;

  // For demonstration, just send them back:
  res.json({
    message: 'Upload successful',
    file: req.file,
    fields: { title, description }
  });
};