const User = require("../models/userModel");
const sharp = require("sharp");
const {sendWelcomeEmail, sendCancelationEmail} = require("../email/account");

module.exports.createUser = async (req, res) => {
    const user = new User(req.body);
    try {
        const token = await user.generateAuthToken();
        await user.save();
        sendWelcomeEmail(user.email, user.name);
        res.status(201).send({user, token});
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}


module.exports.loginUser = async (req, res) => {
    try {

        const user = await User.findByCredentials(req.body.email, req.body.password);

        const token = await user.generateAuthToken();
        // console.log(token)
        // console.log(user)
        res.send({user, token});
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}


module.exports.logoutUser = async (req, res) => {
     // console.log('logout auth')
     try {
        const requestUser = req.user;
        // console.log("helo",  requestUser.tokens)
        requestUser.tokens = requestUser.tokens.filter((token) => {
            // console.log( "hello", token.token,  req.token, token.token !== req.token)
            return token.token !== req.token;
        });
        // console.log({requestUser})
        // console.log('after filtering logout auth')
        await requestUser.save();
        res.status(200).send('User Logged out');
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}


module.exports.logoutAllUser = async (req, res) => {
    try {
        const user = req.user;
        // console.log(user.tokens)
        user.tokens = [];
        // console.log(user)
        await user.save();
        res.status(200).send('all users logged out')
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}


module.exports.UserByID = async (req, res) => {
    const _id = req.params.id;

    try {
        const user = await User.findById(_id);

        if (!user) {
            res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(500).send({ error: error.message});
    }
}

module.exports.deleteUser = async (req, res) => {
    try{
        // console.log(req.user)
        await req.user.remove();
        sendCancelationEmail(req.user.email, req.user.name);
         res.send(req.user);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}


module.exports.updateUser = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedupdates = ['name', 'age', 'email', 'password'];
    const isValidOperation = updates.every((update) => allowedupdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send("error: invalid updates");
    }    

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save();    
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        // if (req.user.password) {
        //     res.send('New Password set')
        // } else {
        //     res.send(req.user)
        // }
        res.send(req.user);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

module.exports.profile = async (req, res) => {
    res.send(req.user);
}

module.exports.uploadAvatar = async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250 }).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
}

module.exports.getAvatar = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || !user.avatar) {
            throw new Error(" error ");
        }
        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}

module.exports.deleteAvatar = async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
}

module.exports.errorHandler = (error, req, res, next) => {
    res.status(400).send({ error: error.message});
}