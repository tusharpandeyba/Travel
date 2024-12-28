const mongoose =require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,        
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['user','organiser'],
        default:'user',
    },
    cart: [
        {
            tripId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Trip',
                required: true,
            },
            // how many members you want to add
            quantity: {
                type: Number,
                required: true,
                default: 1,
            },
        },
    ],

});

const User= mongoose.model('User',userSchema);
module.exports=User;