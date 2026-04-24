const bfhlService = require('../services/bfhlService');

const processBfhl = (req, res) => {
    try {
        const { data } = req.body;
        
        if (!data || !Array.isArray(data)) {
            return res.status(400).json({
                is_success: false,
                message: "Invalid input. Expected 'data' to be an array."
            });
        }

        const result = bfhlService.processData(data);
        
        // Add user info
        const finalResponse = {
            is_success: true,
            user_id: "john_doe_17091999", // Replace with intended dynamic or static string per requirements
            email_id: "john@xyz.com",
            college_roll_number: "ABCD123",
            ...result
        };

        res.status(200).json(finalResponse);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            is_success: false,
            message: "Internal server error"
        });
    }
};

module.exports = {
    processBfhl
};
