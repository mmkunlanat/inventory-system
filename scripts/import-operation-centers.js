/**
 * Script สำหรับนำเข้าข้อมูล Operation Centers จากไฟล์ JSON เข้าสู่ MongoDB
 * Usage: node scripts/import-operation-centers.js
 */

import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import model
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

const OperationCenter =
    mongoose.models.OperationCenter ||
    mongoose.model("OperationCenter", OperationCenterSchema);

async function importOperationCenters() {
    try {
        // เชื่อมต่อ MongoDB
        const MONGODB_URI = process.env.MONGODB_URI;

        if (!MONGODB_URI) {
            throw new Error("กรุณาตั้งค่า MONGODB_URI ใน .env.local");
        }

        console.log("🔄 กำลังเชื่อมต่อ MongoDB...");
        await mongoose.connect(MONGODB_URI);
        console.log("✅ เชื่อมต่อ MongoDB สำเร็จ");

        // อ่านไฟล์ JSON
        const jsonFilePath = path.join(
            __dirname,
            "..",
            "OperationCenters_2025-12-19_14-48-11.json"
        );

        console.log(`📖 กำลังอ่านไฟล์: ${jsonFilePath}`);
        const fileContent = fs.readFileSync(jsonFilePath, "utf-8");
        const jsonData = JSON.parse(fileContent);

        const centers = jsonData.data;
        console.log(`📊 พบข้อมูล ${centers.length} รายการ`);

        // ลบข้อมูลเดิมทั้งหมด (ถ้าต้องการ)
        console.log("🗑️  กำลังลบข้อมูลเดิม...");
        await OperationCenter.deleteMany({});
        console.log("✅ ลบข้อมูลเดิมเรียบร้อย");

        // นำเข้าข้อมูล
        console.log("📥 กำลังนำเข้าข้อมูล...");
        let successCount = 0;
        let errorCount = 0;

        for (const center of centers) {
            try {
                // ลบ _id เดิมออก ให้ MongoDB สร้างใหม่
                const { _id, ...centerData } = center;

                await OperationCenter.create(centerData);
                successCount++;

                // แสดงความคืบหน้าทุก 100 รายการ
                if (successCount % 100 === 0) {
                    console.log(`   📌 นำเข้าแล้ว ${successCount} รายการ...`);
                }
            } catch (error) {
                errorCount++;
                console.error(`   ❌ Error importing ${center.name}:`, error.message);
            }
        }

        console.log("\n📊 สรุปผลการนำเข้า:");
        console.log(`   ✅ สำเร็จ: ${successCount} รายการ`);
        console.log(`   ❌ ล้มเหลว: ${errorCount} รายการ`);
        console.log(`   📈 รวมทั้งหมด: ${centers.length} รายการ`);

        // แสดงสถิติข้อมูล
        const stats = await OperationCenter.aggregate([
            {
                $group: {
                    _id: "$shelterType",
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { count: -1 },
            },
        ]);

        console.log("\n📈 สถิติตามประเภทศูนย์:");
        stats.forEach((stat) => {
            console.log(`   - ${stat._id}: ${stat.count} แห่ง`);
        });

    } catch (error) {
        console.error("❌ เกิดข้อผิดพลาด:", error);
    } finally {
        // ปิดการเชื่อมต่อ
        await mongoose.connection.close();
        console.log("\n👋 ปิดการเชื่อมต่อ MongoDB แล้ว");
        process.exit(0);
    }
}

// รันสคริปต์
importOperationCenters();
