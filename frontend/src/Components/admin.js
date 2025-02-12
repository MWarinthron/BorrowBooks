import React, { useState, useEffect } from "react";
import { MdAdd, MdDelete, MdLogout } from "react-icons/md";
import Input from "../Components/ui/Input";
import Button from "../Components/ui/Button";
import { useNavigate } from "react-router-dom";

const Admin = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [books, setBooks] = useState([]);
    const [newBook, setNewBook] = useState({ title: "", author: "", image: null });
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!token) {
            navigate("/login");
        } else {
            fetchBooks();
        }
    }, [token, navigate]);

    const fetchBooks = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/book", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error("Failed to fetch books");
            const data = await response.json();
            setBooks(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await fetch("http://localhost:5000/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Failed to upload image");

            const data = await response.json();
            setNewBook({ ...newBook, image: `/Assets/images/${data.filename}` }); 
        } catch (err) {
            console.error("Upload Error:", err.message);
        }
    };


    const handleAddBook = async () => {
        if (!newBook.title || !newBook.author || !newBook.image) {
            alert("กรุณากรอกข้อมูลให้ครบ");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/book/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newBook),
            });

            if (!response.ok) throw new Error("Failed to add book");
            alert("เพิ่มหนังสือสำเร็จ!");
            setNewBook({ title: "", author: "", image: null });
            fetchBooks();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteBook = async (bookId) => {
        if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบหนังสือเล่มนี้?")) return;

        try {
            const response = await fetch(`http://localhost:5000/api/book/delete/${bookId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error("Failed to delete book");
            alert("ลบหนังสือสำเร็จ!");
            fetchBooks();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const goToBorrwedbooks=() =>{
        navigate("/Borrowed");
    }

    return (
        <div className="min-h-screen bg-blue-100 p-6">
            <div className="flex justify-between items-center bg-cyan-300 p-4 shadow-md rounded-lg">
                <h1 className="text-xl font-bold ">Admin</h1>
                <Button variant="destructive" onClick={()=>goToBorrwedbooks()}>Borrowed</Button>
                <Button variant="destructive" onClick={() => handleLogout()}>
                    <MdLogout className="inline-block mr-2 text-xl " />
                    Logout
                </Button>
            </div>

            <div className="mt-6 p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Add New Book</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                        type="text"
                        placeholder="ชื่อหนังสือ"
                        value={newBook.title}
                        onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                    />
                    <Input
                        type="text"
                        placeholder="ชื่อผู้แต่ง"
                        value={newBook.author}
                        onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                    />
                    <Input
                        type="text"
                        placeholder="Category"
                        value={newBook.categories}
                        onChange={(e) => setNewBook({ ...newBook, categories: e.target.value })}
                    />
                    {/* ปุ่มเลือกไฟล์ */}
                    <input type="file" onChange={handleFileUpload} className="border p-2 rounded" />
                    {newBook.image && (
                        <img src={newBook.image} alt="Preview" className="w-20 h-20 rounded-md mt-2" />
                    )}
                    <Button onClick={handleAddBook} className="mt-2 bg-red-600 text-white hover:bg-red-700">
                        <MdAdd className="inline-block mr-2 text-lg" />
                        เพิ่มหนังสือ
                    </Button>
                </div>
            </div>

            <h2 className="text-2xl font-bold my-6 text-gray-700 text-center">รายการหนังสือ</h2>

            {error && <p className="text-red-500 text-center">{error}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {books.length === 0 ? (
                    <p className="text-gray-500 text-center col-span-full">ไม่มีหนังสือในระบบ</p>
                ) : (
                    books.map((book) => (
                        <div key={book.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                            <img
                                src={book.image || "/default-book.jpg"}
                                alt={book.title}
                                className="w-full h-100 object-cover rounded-md mb-4"
                            />
                            <h3 className="text-lg font-semibold text-gray-800">{book.title}</h3>
                            <p className="text-sm text-gray-500 mb-4">{book.author}</p>

                            <Button
                                onClick={() => handleDeleteBook(book.id)}
                                className="mt-auto w-full bg-red-500 hover:bg-red-600 text-white"
                            >
                                <MdDelete className="inline-block mr-2 text-lg" />
                                ลบหนังสือ
                            </Button>
                        </div>

                    ))
                )}
            </div>
        </div>
    );
};

export default Admin;
