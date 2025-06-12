import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const TakeExam = () => {
  const { examId } = useParams(); // Lấy examId từ URL
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  const userId = "665fa001b2e123456789abcd"; // Giả định user đăng nhập sẵn

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await axios.get(`http://localhost:9999/exam/${examId}`);
        setExam(res.data);
      } catch (err) {
        alert("Không tải được đề thi");
      }
    };

    fetchExam();
  }, [examId]);

  const handleChange = (qid, optIdx) => {
    setAnswers({ ...answers, [qid]: optIdx });
  };

  const handleSubmit = async () => {
    const formattedAnswers = Object.entries(answers).map(([questionId, selected]) => ({
      questionId,
      selected
    }));

    try {
      const res = await axios.post("http://localhost:9999/result/submit", {
        userId,
        examId,
        answers: formattedAnswers
      });
      setScore(res.data.score);
    } catch (err) {
      alert("Nộp bài thất bại");
    }
  };

  if (!exam) return <div>Đang tải đề thi...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">📝 {exam.title}</h2>
      <p className="italic text-gray-600 mb-4">⏱️ Thời gian: {exam.timeLimit} phút</p>

      {exam.questions.map((q, i) => (
        <div key={q._id} className="mb-6">
          <p className="font-medium">{i + 1}. {q.content}</p>
          {q.options.map((opt, idx) => (
            <div key={idx} className="ml-4">
              <label>
                <input
                  type="radio"
                  name={q._id}
                  value={idx}
                  checked={answers[q._id] === idx}
                  onChange={() => handleChange(q._id, idx)}
                />
                {" "}{opt}
              </label>
            </div>
          ))}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={score !== null}
      >
        Nộp bài
      </button>

      {score !== null && (
        <div className="mt-4 text-green-600 font-bold">
          ✅ Bạn đã nộp bài. Điểm: {score}
        </div>
      )}
    </div>
  );
};

export default TakeExam;
