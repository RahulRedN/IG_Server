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
        }
    },
    { timeStamps: true }
);

QuerySchema.set("timestamps", true);

module.exports = mongoose.model("Testimonial", TestimonialSchema);
