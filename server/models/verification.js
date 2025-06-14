const mongoose = require("mongoose")

const VerificationSchema = new mongoose.Schema ({
    email: { type: String, required: true,unique: true },
    verificationCode: {type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
});

VerificationSchema.index({ createdAt: 1 }, { expires: "1h" })

const Verification = mongoose.model('Verification', VerificationSchema)
module.exports = Verification
