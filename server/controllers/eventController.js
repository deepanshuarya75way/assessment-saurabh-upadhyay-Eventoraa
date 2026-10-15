const Event = require('../models/Event');
const QrCode=require('qrcode');


exports.getEventQRCode=async(req,res)=>{
    try{
        const{id}=req.params;
        const event=await Event.findById(id);
        
        if(!event){
            return res.status(404).json({message:'Event not found'});
        }
        if(event.qrCode){
            return res.status(200).json({
                success:true,
                qrCode:event.qrCode,
                eventUrl:`${process.env.Client_URL || 'http://localhost:5173'}/events/${event._id}`

            });
        }
        const clientBaseUrl=process.env.Client_URL||'http://localhost:5173';
        const eventUrl=`${clientBaseUrl}/events/${event._id}`;

        const qrcodeDataUrl=await QRCode.toDataURL(eventUrl,{
            errorCorrectionLevel:'H',
            margin: 2,
            width:320,
            color:{
                dark:'#000000',
                light:'#ffffff'
            }
        });
        event.qrCode=qrCodeDataUrl;
        await event.save();

        return res.status(200).json({
            success:true,
            qrCode:qrCodeDataUrl,
            eventUrl
        });
    }catch(error){
        console.error('Error generating QR code :',error);
        return res.status(500).json({message:'Server error generating QR code '});
    }
}
exports.getEvents = async (req, res) => {
    try {
        const filters = {};
        if (req.query.category) filters.category = req.query.category;
        if (req.query.search) filters.title = { $regex: req.query.search, $options: 'i' };

        const events = await Event.find(filters).populate('createdBy', 'name email');
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('createdBy', 'name email');
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.createEvent = async (req, res) => {
    try {
        const { title, description, date, location, category, totalSeats, ticketPrice, image } = req.body;
        const event = await Event.create({
            title,
            description,
            date,
            location,
            category,
            totalSeats,
            availableSeats: totalSeats,
            ticketPrice: ticketPrice || 0,
            image: image || '',
            createdBy: req.user.id
        });
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
