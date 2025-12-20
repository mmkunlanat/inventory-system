"use client"
import { useEffect, useState } from "react";

export default function CentersPage() {
  const [centers, setCenters] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    fetch("/api/centers")
      .then(res => res.json())
      .then(setCenters);
  }, []);

  const addCenter = async () => {
    await fetch("/api/centers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        location: "ไม่ระบุ",
        contact: "-"
      })
    });
    location.reload();
  };

  return (
    <div className="container mt-5">
      <h3>จัดการศูนย์อพยพ</h3>

      <input className="form-control mb-2"
        placeholder="ชื่อศูนย์"
        onChange={e => setName(e.target.value)}
      />
      <button className="btn btn-primary mb-3" onClick={addCenter}>
        เพิ่มศูนย์
      </button>

      <ul className="list-group">
        {centers.map(c => (
          <li className="list-group-item" key={c._id}>
            {c.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
