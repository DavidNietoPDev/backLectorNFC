const router = require('express').Router();
const checkToken = require('../utils/middelwares');

router.use('/users', require('./api/users'));
router.use('/nfc', require('./api/nfc'));

module.exports = router;