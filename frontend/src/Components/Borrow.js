import React, { useState, useEffect  } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "./ui/Button";
import { jwtDecode } from "jwt-decode";

const BorrowPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookId } = location.state || {}; // รับ bookId จากหน้า Home
  
  const [borrowDate, setBorrowDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [book, setBook] = useState([]); 
  const token = localStorage.getItem("token");
  const pricePerDay = 5;

   useEffect(() => {
  
      if (token) {
        const decodedToken = jwtDecode(token); // ถอดรหัส token
        const currentTime = Date.now() / 1000; // เวลาในวินาที
  
        if (decodedToken.exp < currentTime) {
          // ถ้า token หมดอายุ
          localStorage.removeItem("token"); // ลบ token ออกจาก localStorage
          navigate("/login"); // นำทางไปหน้า login
        } else {
            if (bookId) {
                fetchBookDetails();
            }
        }
      } else {
        navigate("/login"); // ถ้าไม่มี token นำทางไปหน้า login
      }
    }, [token, navigate, bookId]);
  

  const fetchBookDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/book/${bookId}`);
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      setBook(result[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirmBorrow = async () => {
    if (!borrowDate || !returnDate) {
      alert("กรุณาเลือกวันยืมและวันคืน");
      return;
    }

    const borrowDateObj = new Date(borrowDate);
    const returnDateObj = new Date(returnDate);
    const days = Math.ceil((returnDateObj - borrowDateObj) / (1000 * 3600 * 24));

    if (days <= 0) {
      alert("วันคืนต้องมากกว่าวันยืม");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("คุณต้องเข้าสู่ระบบก่อนทำการยืมหนังสือ");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/borrow/${bookId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          borrow_date: borrowDate,
          return_date: returnDate,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      alert(result.message);
      navigate("/"); // กลับไปหน้า Home หลังยืนยันสำเร็จ
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-400p-4">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
      {book ? (
          <div className="mb-4 text-center">
            <img src={book.image} alt={book.title} className="w-32 h-48 object-cover mx-auto mb-4" />
            <h2 className="text-xl font-bold">{book.title}</h2>
          </div>
        ) : (
          <div className="text-center text-gray-500">Loading book details...</div>
        )}
        <h2 className="text-xl font-bold mb-4">เลือกวันยืมและคืน</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-600 mb-2">Borrow Date:</label>
          <DatePicker selected={borrowDate} onChange={setBorrowDate} dateFormat="yyyy/MM/dd" className="w-full p-2 border rounded-md" />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-600 mb-2">Return Date:</label>
          <DatePicker selected={returnDate} onChange={setReturnDate} dateFormat="yyyy/MM/dd" className="w-full p-2 border rounded-md" />
        </div>

        <Button onClick={handleConfirmBorrow} className="w-full py-2 bg-red-600 text-white font-semibold rounded-lg">ยืนยันการยืม</Button>
      </div>
    </div>
  );
};

export default BorrowPage;
