const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const Task = require('./taskModel');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        validate(value) {
            if (value < 0) {
                throw new Error('Wrong age entered')
            }
        }
    },
    email: {
        type: String, 
        unique: true,
        reqired: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email format invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        // trim: true,
        validate(value) {
            if (value.includes('password')) {
                console.log('Password cannot contain "password')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            reqired: true
        }
    }],
    avatar: {
        type: Buffer
    }
});

userSchema.virtual('task', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
});
 
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

    return userObject;
}

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() },  process.env.JWT_SECRET);
    
    user.tokens = user.tokens.concat({token});
    await user.save();

    return token;    
}

userSchema.statics.findByCredentials = async function (email, password) {

    const user = await User.findOne({email});
    // console.log(email)
    // console.log(password)
    // console.log(user.password)
    if (!user) {
        throw new Error('unable to login');
    }
    const isMatch = await bcrypt.compare(password, user.password);  

    if (!isMatch) {
        throw new Error('unable to login');
    }
    
    return user;
}

userSchema.pre('save',  async function (next) {
    const user = this;
    // console.log(user.password)
    if (user.isModified('password')) {
        
        user.password =  await bcrypt.hash(user.password, 8);
    }
    next();
})

userSchema.pre('remove', async function (next) {
    // console.log('before deleting')
    const user = this;
    // console.log(user)
    await Task.deleteMany({owner: user._id});
    next();
})
const User = mongoose.model('User', userSchema);


module.exports = User;