const express = require('express');
const router = express.Router();
const bfhlController = require('../controllers/bfhlController');

router.post('/', bfhlController.processBfhl);

// Added a GET route so clicking the link doesn't result in an error
router.get('/', (req, res) => {
    // A standard response often requested for this endpoint on GET
    res.status(200).json({
        operation_code: 1
    });
});

module.exports = router;
