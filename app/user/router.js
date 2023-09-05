var express = require('express');
var router = express.Router();
const { index, userLogin, actionLogin, userRegister, actionRegister, actionLogout } = require("./controller")
const { isAuthenticated } = require("../middleware/auth");
// import { index } from "./controller"

/* GET home page. */
router.get('/', isAuthenticated, index);
router.get('/auth/login', userLogin);
router.post('/auth/login', actionLogin);

router.get('/auth/register', userRegister);
router.post('/auth/register', actionRegister);

router.get('/auth/logout', actionLogout);

module.exports = router;

