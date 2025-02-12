import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email || !password) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน");
      setLoading(false);
      return;
    }

    if (!isLogin && (password !== confirmPassword || !name)) {
      setError("รหัสผ่านไม่ตรงกัน หรือ กรุณากรอกชื่อ");
      setLoading(false);
      return;
    }

    try {
      const url = "http://localhost:5000/api/auth/register";
      const body = { name, email, password };
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "เกิดข้อผิดพลาด");

      alert("สมัครสมาชิกสำเร็จ!");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-200 to-blue-400">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-blue-600">
          {"สมัครสมาชิก"}
        </h2>

        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}

        <form className="mt-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <label className="block text-gray-700">ชื่อ</label>
              <input
                type="text"
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="กรอกชื่อ"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label className="block text-gray-700">อีเมล</label>
            <input
              type="email"
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="กรอกอีเมล"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-gray-700">รหัสผ่าน</label>
            <input
              type="password"
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {!isLogin && (
            <div className="mt-4">
              <label className="block text-gray-700">ยืนยันรหัสผ่าน</label>
              <input
                type="password"
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-6 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? "กำลังโหลด..." : "สมัครสมาชิก"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          {"มีบัญชีอยู่แล้ว?"}{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-500 underline"
          >
            เข้าสู่ระบบ
          </button>
        </p>
      </div>
    </div>
  );
}
