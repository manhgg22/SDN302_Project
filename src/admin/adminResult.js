import React, { useState } from "react";
import axios from "axios";

const AdminResults = () => {
  const [code, setCode] = useState("");
  const [results, setResults] = useState([]);
  const [examTitle, setExamTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchResults = async () => {
    if (!code.trim()) return alert("Vui lòng nhập mã đề");

    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:9999/admin/results?code=${code}`);
      setResults(res.data.results);
      setExamTitle(res.data.examTitle);
    } catch (err) {
      alert("Không tìm thấy kết quả cho mã đề này");
      setResults([]);
      setExamTitle("");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📊 Thống kê kết quả bài thi</h1>

      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          className="border px-3 py-2 rounded w-full"
          placeholder="Nhập mã đề (ví dụ: REACT-MID)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button
          onClick={fetchResults}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Xem
        </button>
      </div>

      {loading && <p className="text-gray-600">Đang tải dữ liệu...</p>}

      {results.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Đề: {examTitle}</h2>
          <table className="w-full border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border px-4 py-2">#</th>
                <th className="border px-4 py-2">Tên học sinh</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Điểm</th>
                <th className="border px-4 py-2">Thời gian nộp</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, idx) => (
                <tr key={idx}>
                  <td className="border px-4 py-2">{idx + 1}</td>
                  <td className="border px-4 py-2">{r.username}</td>
                  <td className="border px-4 py-2">{r.email}</td>
                  <td className="border px-4 py-2">{r.score}</td>
                  <td className="border px-4 py-2">{new Date(r.submittedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {results.length === 0 && !loading && examTitle && (
        <p className="text-red-500 mt-4">Không có học sinh nào làm đề này.</p>
      )}
    </div>
  );
};

export default AdminResults;
