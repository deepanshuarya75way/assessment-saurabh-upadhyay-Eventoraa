const express = require('express');
const router = express.Router();
const {getEventQRCode}=require('../controllers/eventController');
const{protect}=require('../middleware/auth');
const { getEvents, getEventById, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');
const { protect, admin } = require('../middleware/auth');

router.get('/', getEvents);
router.get('/:id/qrcode',protect,getEventQRCode);
router.get('/:id', getEventById);
router.post('/', protect, admin, createEvent);
router.put('/:id', protect, admin, updateEvent);
router.delete('/:id', protect, admin, deleteEvent);

module.exports = router;
