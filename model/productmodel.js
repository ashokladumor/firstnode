const mongoose = require('mongoose');


const productschema = new mongoose.Schema({
    p_name: {type:String,require:true},
    p_price: {type:String,require:true},
    user_id: {type:mongoose.Schema.Types.ObjectId,ref:'User'},
})


module.exports = mongoose.model("Product",productschema);