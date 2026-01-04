"use client";
import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import "./center-request.css";

function CenterRequestContent() {
  const searchParams = useSearchParams();
  const [centerName, setCenterName] = useState("");
  const [items, setItems] = useState([
    { itemName: "", quantity: "", unit: "" }
  ]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [centers, setCenters] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredCenters, setFilteredCenters] = useState([]);

  useEffect(() => {
    if (searchParams.get("error") === "unauthorized_admin") {
      setMessage({ type: "error", text: "คุณไม่มีสิทธิ์เข้าถึงหน้า Admin Dashboard กรุณาเข้าสู่ระบบด้วยสิทธิ์ผู้ดูแลระบบ" });
    }
    const fetchCenters = async () => {
      try {
        const res = await fetch("/api/operation-centers");
        const data = await res.json();
        if (data.success) {
          setCenters(data.data);
        }
      } catch (error) {
        console.error("Error fetching centers:", error);
      }
    };
    fetchCenters();
  }, [searchParams]);

  const handleCenterChange = (e) => {
    const value = e.target.value;
    setCenterName(value);

    if (value.trim()) {
      const filtered = centers.filter(center =>
        center.name.toLowerCase().includes(value.toLowerCase()) ||
        (center.district && center.district.toLowerCase().includes(value.toLowerCase()))
      );
      setFilteredCenters(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...items];
    newItems[index][name] = value;
    setItems(newItems);
  };

  const addItemRow = () => {
    setItems([...items, { itemName: "", quantity: "", unit: "" }]);
  };

  const removeItemRow = (index) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
    }
  };

  const selectCenter = (name) => {
    setCenterName(name);
    setShowSuggestions(false);
  };

  const submitRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ centerName, items }),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "ส่งคำขอรับบริจาคเรียบร้อยแล้ว แอดมินจะดำเนินการโดยเร็วที่สุด" });
        setItems([{ itemName: "", quantity: "", unit: "" }]);
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.error || "เกิดข้อผิดพลาดในการส่งคำขอ" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center-page-wrapper">
      <Navbar />

      <main className="center-main">
        <div className="request-card">
          <header className="request-header">
            <h1 className="title">ขอรับสินค้าบริจาค</h1>
            <p className="subtitle">กรอกข้อมูลความต้องการของศูนย์ช่วยเหลือเพื่อให้แอดมินจัดสรรสินค้าให้</p>
          </header>

          {message && (
            <div className={`alert-msg ${message.type}`}>
              {message.type === 'success' ? '✅' : '❌'} {message.text}
            </div>
          )}

          <form className="request-form" onSubmit={submitRequest} autoComplete="off">
            <div className="form-group relative">
              <label>ชื่อศูนย์อพยพ / หน่วยงาน</label>
              <input
                name="centerName"
                placeholder="ระบุชื่อศูนย์ของคุณ"
                value={centerName}
                onChange={handleCenterChange}
                onFocus={() => {
                  if (centerName.trim()) setShowSuggestions(true);
                }}
                onBlur={() => {
                  setTimeout(() => setShowSuggestions(false), 200);
                }}
                required
              />
              {showSuggestions && filteredCenters.length > 0 && (
                <ul className="suggestions-list">
                  {filteredCenters.map((center, idx) => (
                    <li key={idx} onClick={() => selectCenter(center.name)}>
                      <div className="suggestion-name">{center.name}</div>
                      <div className="suggestion-location">
                        {center.district && `อ.${center.district}`} {center.subdistrict && `ต.${center.subdistrict}`}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="items-section">
              <div className="section-header">
                <h3>รายการสิ่งของที่ต้องการ</h3>
                <button type="button" onClick={addItemRow} className="add-item-btn">
                  + เพิ่มรายการ
                </button>
              </div>

              {items.map((item, index) => (
                <div key={index} className="item-row-container">
                  <div className="item-row-header">
                    <span>รายการที่ {index + 1}</span>
                    {items.length > 1 && (
                      <button type="button" onClick={() => removeItemRow(index)} className="remove-item-btn">
                        ลบ
                      </button>
                    )}
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>สินค้าที่ต้องการ</label>
                      <input
                        name="itemName"
                        placeholder="เช่น ข้าวสาร, น้ำดื่ม"
                        value={item.itemName}
                        onChange={(e) => handleItemChange(index, e)}
                        required
                      />
                    </div>

                    <div className="form-group q-unit-group">
                      <div className="q-input">
                        <label>จำนวน</label>
                        <input
                          name="quantity"
                          type="number"
                          placeholder="0"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, e)}
                          required
                        />
                      </div>
                      <div className="u-input">
                        <label>หน่วย</label>
                        <input
                          name="unit"
                          placeholder="เช่น ชิ้น, ลัง"
                          value={item.unit}
                          onChange={(e) => handleItemChange(index, e)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button type="submit" className="submit-request-btn" disabled={loading}>
              {loading ? "กำลังส่งคำขอ..." : "ส่งคำขอยืนยันทุกรายการ"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function CenterRequest() {
  return (
    <Suspense fallback={
      <div className="center-page-wrapper">
        <Navbar />
        <main className="center-main">
          <div className="request-card">
            <p style={{ textAlign: "center", padding: "40px" }}>กำลังโหลด...</p>
          </div>
        </main>
      </div>
    }>
      <CenterRequestContent />
    </Suspense>
  );
}
