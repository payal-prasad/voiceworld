const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Send a message
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message_text:
 *                 type: string
 *                 example: Hello everyone!
 *     responses:
 *       201:
 *         description: Message sent successfully
 */

router.post('/send', messageController.sendMessage);

module.exports = router;
