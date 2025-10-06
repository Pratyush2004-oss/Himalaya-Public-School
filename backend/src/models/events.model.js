import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    public: {
        type: Boolean,
        required: true,
        default: false
    }
}, { timestamps: true });

const EventModel = mongoose.model('Event', eventSchema);
export default EventModel;