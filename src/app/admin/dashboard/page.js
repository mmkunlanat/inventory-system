import Navbar from "@/components/Navbar";

export default function AdminDashboard() {
  return (
    <>
      <Navbar />

      <div className="container mt-5">

        <h2 className="mb-4 fw-bold">Dashboard ผู้ดูแลระบบ</h2>

        <div className="row g-4">

          {/* สินค้าบริจาค */}
          <div className="col-md-3">
            <div className="card text-bg-primary shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title">สินค้าบริจาค</h5>
                <p className="card-text fs-4">120</p>
                <a href="/admin/items" className="btn btn-light btn-sm">
                  จัดการสินค้า
                </a>
              </div>
            </div>
          </div>

          {/* ศูนย์อพยพ */}
          <div className="col-md-3">
            <div className="card text-bg-success shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title">ศูนย์อพยพ</h5>
                <p className="card-text fs-4">8</p>
                <a href="/admin/centers" className="btn btn-light btn-sm">
                  ดูศูนย์
                </a>
              </div>
            </div>
          </div>

          {/* คำขอรับบริจาค */}
          <div className="col-md-3">
            <div className="card text-bg-warning shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title">คำขอรับบริจาค</h5>
                <p className="card-text fs-4">15</p>
                <a href="/admin/requests" className="btn btn-dark btn-sm">
                  ตรวจสอบ
                </a>
              </div>
            </div>
          </div>

          {/* รายการรออนุมัติ */}
          <div className="col-md-3">
            <div className="card text-bg-danger shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title">รออนุมัติ</h5>
                <p className="card-text fs-4">5</p>
                <a href="/admin/requests" className="btn btn-light btn-sm">
                  ดำเนินการ
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* ตารางสรุป */}
        <div className="card mt-5 shadow-sm">
          <div className="card-header fw-bold">
            สรุปการจัดสรรล่าสุด
          </div>
          <div className="card-body p-0">
            <table className="table mb-0">
              <thead className="table-light">
                <tr>
                  <th>ศูนย์อพยพ</th>
                  <th>สินค้า</th>
                  <th>จำนวน</th>
                  <th>สถานะ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>ศูนย์ A</td>
                  <td>ข้าวสาร</td>
                  <td>50 ถุง</td>
                  <td>
                    <span className="badge bg-success">
                      อนุมัติแล้ว
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>ศูนย์ B</td>
                  <td>น้ำดื่ม</td>
                  <td>100 แพ็ค</td>
                  <td>
                    <span className="badge bg-warning text-dark">
                      รอดำเนินการ
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </>
  );
}
