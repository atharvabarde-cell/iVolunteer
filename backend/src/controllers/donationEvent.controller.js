import * as eventService from "../services/donationEvent.service.js"

export const createEvent = async (req, res) => {
  try {
    const ngoId = req.user._id;
    const eventData = req.body;

    const event = await eventService.createEventService(ngoId, eventData);
    res.status(201).json({ success: true, event });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await eventService.getAllActiveEventsService();
    res.json({ success: true, events });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const event = await eventService.getEventByIdService(eventId);
    res.json({ success: true, event });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
