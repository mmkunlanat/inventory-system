import mongoose from "mongoose";

const OperationCenterSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            default: null,
        },
        location: {
            type: String,
            default: null,
        },
        capacity: {
            type: Number,
            default: null,
        },
        capacityStatus: {
            type: String,
            enum: ["รองรับได้", "เต็ม", "ใกล้เต็ม", "ล้นศูนย์"],
            default: "รองรับได้",
        },
        shelterType: {
            type: String,
            enum: ["ศูนย์พักพิงหลัก", "บ้านญาติ", "วัด", "โรงเรียน", "อื่นๆ"],
            default: "อื่นๆ",
        },
        phoneNumbers: {
            type: [String],
            default: [],
        },
        responsible: [
            {
                userId: {
                    type: String,
                    required: true,
                },
                firstName: String,
                lastName: String,
                email: String,
                role: String,
                addedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        status: {
            type: String,
            enum: ["active", "inactive", "closed"],
            default: "active",
        },
        district: {
            type: String,
            default: "",
        },
        subdistrict: {
            type: String,
            default: "",
        },
        createdBy: {
            type: String,
            default: "system",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.OperationCenter ||
    mongoose.model("OperationCenter", OperationCenterSchema);
