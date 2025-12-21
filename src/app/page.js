import Navbar from "@/components/Navbar";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <div className="container mt-5">
        <div className="text-center mb-5">
          <h1 className="fw-bold">
            ระบบจัดสรรสินค้าบริจาค
          </h1>
          <p className="text-muted">
            ระบบบริหารจัดการสินค้าเพื่อช่วยเหลือศูนย์อพยพอย่างมีประสิทธิภาพ
          </p>
        </div>

        <div className="row g-4">

          {/* การ์ด Admin */}
          <div className="col-md-4">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title">ผู้ดูแลระบบ (Admin)</h5>
                <p className="card-text">
                  จัดการสินค้า ศูนย์อพยพ และอนุมัติคำขอรับบริจาค
                </p>
                <a href="/admin/dashboard" className="btn btn-primary">
                  เข้าสู่ระบบ Admin
                </a>
              </div>
            </div>
          </div>

          {/* การ์ด Center */}
          <div className="col-md-4">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title">ศูนย์อพยพ</h5>
                <p className="card-text">
                  ส่งคำขอรับสินค้าบริจาคตามความต้องการ
                </p>
                <a href="/center/request" className="btn btn-success">
                  ขอรับบริจาค
                </a>
              </div>
            </div>
          </div>

          {/* การ์ด Login */}
          <div className="col-md-4">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title">เข้าสู่ระบบ</h5>
                <p className="card-text">
                  สำหรับผู้ดูแลระบบและศูนย์อพยพ
                </p>
                <a href="/login" className="btn btn-outline-dark">
                  Login
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
