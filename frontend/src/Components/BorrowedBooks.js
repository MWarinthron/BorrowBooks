import React, { useEffect, useState } from 'react'
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Button from "../Components/ui/Button";
import { MdLogout } from "react-icons/md";



const BorrowedBooks = () => {
    const [books, setBooks] = useState([]);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [error, setError] = useState(null);





    useEffect(() => {

        if (token) {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            if (decodedToken.exp < currentTime) {

                localStorage.removeItem("token");
                navigate("/login");
            } else {
                fetchBooks();
            }
        } else {
            navigate("/login");
        }
    }, [token, navigate]);

    const fetchBooks = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/book/borrowed");
            if (!response.ok) {
                throw new Error("Failed to fetch books");
            }
            const data = await response.json();
            console.log(data)
            setBooks(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const goToHome = () => {
        navigate("/admin");
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };


    return (
        <div className="min-h-screen bg-blue-100 p-6">
            <div className="flex justify-between items-center bg-cyan-300 p-4 shadow-md rounded-lg">
                <h1 className="text-xl font-bold ">Admin</h1>
                <Button variant="destructive" onClick={() => goToHome()}>Home</Button>
                <Button variant="destructive" onClick={() => handleLogout()}>
                    <MdLogout className="inline-block mr-2 text-xl " />
                    Logout
                </Button>
            </div>
            <div className="mt-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Borrowed Books</h2>
                <div className="flex flex-wrap gap-6">
                    {books.map((book) => (
                        <div
                            key={book.id}
                            className="bg-white p-6 rounded-lg shadow-lg w-[23%] flex flex-col items-center"
                        >
                            <img
                                src={book.image || "/default-book.jpg"}
                                alt={book.title}
                                className="w-full aspect-[16/20] object-cover rounded-lg mb-4"
                            />
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">{book.title}</h3>
                            <p className="text-sm text-gray-500 mb-4">{book.author}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default BorrowedBooks