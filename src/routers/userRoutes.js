const router = require('express').Router();
const auth = require('../middleware/auth');
const {createUser, loginUser, logoutUser, logoutAllUser, deleteUser, 
    updateUser, profile, UserByID, uploadAvatar, errorHandler,
    deleteAvatar, getAvatar} = require("../controllers/useController");
const multer = require("multer");

const upload = multer ({
    // dest: "avatars", for letting pass file to callback func
    limits: {
        fileSize: 1000000
    },
    fileFilter (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            cb(new Error("please upload an image"));
        }
        cb(undefined, true);
    }
})
router.route("/users").post(createUser);
router.route("/users/login").post(loginUser, errorHandler);
router.route("/users/me/profile").get(auth, profile);
router.route("/users/:id").get(auth, UserByID);
router.route("/users/me/logout").post(auth, logoutUser);
router.route("/users/me/logoutAll").post(auth, logoutAllUser);
router.route("/users").patch(auth, updateUser);
router.route("/users").delete(auth, deleteUser);
router.route("/users/me/avatar").post(auth, upload.single("avatar"), uploadAvatar, errorHandler);
router.route("/users/:id/avatar").get(getAvatar);
router.route("/avatar").delete(auth, deleteAvatar);


module.exports = router;
// router.route("/upload").post(upload.single("upload"), userAvatar);

// const upload = multer({
//     dest: "images",
//     limits: {
//         fileSize: 1000000
//     },
//     fileFilter(req, file, cb) {

//         if (!file.originalname.match(/\.(doc|docx)$/)) {
//             cb(new Error("please upload a word file"));
//         }
//         cb(undefined, true);

        // if(!file.originalname.endsWith('.pdf')) {
        //     cb(new Error("please upload a pdf"));
        // }    
        //throw new error
        // cb(new Error("please upload a pdf"));
        //accepted
        // cb(undefined, true);
        //rejected
        // cb(undefined, false)
//     }    
// })
