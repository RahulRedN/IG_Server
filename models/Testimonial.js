const mongoose = require("mongoose");

const TestimonialSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Jobseeker",
            required: true,
        },
        fav: {
            type: Boolean,
            required: true,
            default: false,
        }
    },
    { timeStamps: true }
);

TestimonialSchema.set("timestamps", true);

module.exports = mongoose.model("Testimonial", TestimonialSchema);
