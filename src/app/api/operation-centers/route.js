import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import OperationCenter from "@/models/OperationCenter";

// GET: ดึงรายการศูนย์อพยพทั้งหมด
export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search") || "";
        const status = searchParams.get("status") || "";
        const district = searchParams.get("district") || "";
        const capacityStatus = searchParams.get("capacityStatus") || "";
        const shelterType = searchParams.get("shelterType") || "";

        // สร้าง query filter
        let filter = {};

        // Filter by status (active, inactive, closed)
        if (status) {
            filter.status = status;
        } else {
            // Default: แสดงเฉพาะศูนย์ที่ active
            filter.status = "active";
        }

        // Filter by capacityStatus
        if (capacityStatus) {
            filter.capacityStatus = capacityStatus;
        }

        // Filter by district
        if (district) {
            filter.district = { $regex: district, $options: "i" };
        }

        // Filter by shelterType
        if (shelterType) {
            filter.shelterType = shelterType;
        }

        // Search by name or location
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } },
                { district: { $regex: search, $options: "i" } },
                { subdistrict: { $regex: search, $options: "i" } },
            ];
        }

        // ดึงข้อมูลศูนย์อพยพ
        const centers = await OperationCenter.find(filter)
            .sort({ name: 1 })
            .select("name location capacity capacityStatus shelterType phoneNumbers district subdistrict status")
            .lean();

        // คำนวณสถิติ
        const allCenters = await OperationCenter.find({ status: "active" }).lean();
        const stats = {
            total: allCenters.length,
            available: allCenters.filter(c => c.capacityStatus === "รองรับได้").length,
            almostFull: allCenters.filter(c => c.capacityStatus === "ใกล้เต็ม").length,
            full: allCenters.filter(c => c.capacityStatus === "เต็ม").length,
            overflow: allCenters.filter(c => c.capacityStatus === "ล้นศูนย์").length,
            totalCapacity: allCenters.reduce((sum, c) => sum + (c.capacity || 0), 0),
        };

        // ดึง districts ที่ไม่ซ้ำสำหรับ filter dropdown
        const districts = [...new Set(allCenters.map(c => c.district).filter(Boolean))].sort();

        return NextResponse.json({
            success: true,
            data: centers,
            stats,
            districts,
            count: centers.length,
        });
    } catch (error) {
        console.error("Error fetching operation centers:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
