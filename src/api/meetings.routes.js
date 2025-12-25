const express = require('express');
const router = express.Router();
const meetingController = require('../controllers/meeting.controller');

router.post('/create', meetingController.createMeeting);

module.exports = router;
