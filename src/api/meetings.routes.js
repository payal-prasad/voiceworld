const express = require('express');
const router = express.Router();
const meetingController = require('../controllers/meeting.controller');

/**
 * @swagger
 * /api/meetings:
 *   post:
 *     summary: Create a new meeting
 *     tags: [Meetings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Team Sync Meeting
 *               start_time:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-09-20T10:00:00Z
 *               end_time:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-09-20T11:00:00Z
 *     responses:
 *       201:
 *         description: Meeting created successfully
 */

router.post('/create', meetingController.createMeeting);

module.exports = router;
