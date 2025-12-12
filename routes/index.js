var express = require('express');
var router = express.Router();
const user = require('../controller/usercontroller')
const auth = require('../middleware/Auth')
const upload = require('../middleware/upload');

router.post('/insert',upload.single('image'),user.Insert);
router.post('/login',user.Login);
router.post('/product',user.addProduct);
router.get('/product',user.GetProduct);
router.put('/:id',user.Update);
router.delete('/:id',user.Delete);
router.get('/user', auth.CheckToken, user.GetData);
router.get('/', user.data);

// 'image' is the form-data field name for the file
router.post('/upload', upload.single('image'), user.uploadImage);


module.exports = router;
