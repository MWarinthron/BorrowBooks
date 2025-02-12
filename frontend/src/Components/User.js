import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../Components/ui/Input";
import Button from "./ui/Button";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { MdHome, MdPerson, MdLogout, MdOutlineReplay } from "react-icons/md";
const User = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [searchQuery, setSearchQuery] = useState("");
    const [user, setUser] = useState(null);
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (token) {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            if (decodedToken.exp < currentTime) {
                localStorage.removeItem("token");
                navigate("/login");
            } else {
                fetchUserData();
                fetchBorrowedBooks();
            }
        } else {
            navigate("/login");
        }
    }, [token, navigate]);

    const fetchUserData = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/auth/me", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) throw new Error("Failed to fetch user data");
            const data = await response.json();
            console.log(data)
            setUser(data);
        } catch (err) {
            if (error.response && error.response.status === 401) {
                
                localStorage.removeItem("token"); 
                navigate("/login") 
            } else {
              
                console.error(error);
            }
        }
    };


    const fetchBorrowedBooks = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/auth/my-books", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) throw new Error("Failed to fetch borrowed books");

            const data = await response.json();
            setBorrowedBooks(data);
        } catch (err) {
            if (error.response && error.response.status === 401) {
               
                localStorage.removeItem("token");
                navigate("/login") 
            } else {
               
                console.error(error);
            }
        }
    };




    const handleReturnBook = async (bookId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/borrow/return/${bookId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) throw new Error("ไม่สามารถคืนหนังสือได้");

            const data = await response.json();
            alert(data.message);

            setBorrowedBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
        } catch (err) {
            if (error.response && error.response.status === 401) {
              
                localStorage.removeItem("token"); 
                navigate("/login") 
            } else {
                
                alert("ไม่สามารถคืนหนังสือได้: " + err.message);
            }
        }
    };

    const getReturnAlert = (returnDate) => {
        const today = new Date();
        const returnDateObj = new Date(returnDate);
        const diffTime = returnDateObj - today;
        const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));

        if (diffDays <= 3 && diffDays >= 0) {
            return `Return in ${diffDays} day(s)!`;
        }

        return null;
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value.toLowerCase());
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const filteredBooks = borrowedBooks.filter((book) =>
        book.title.toLowerCase().includes(searchQuery) ||
        book.author.toLowerCase().includes(searchQuery)
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-400 p-6">
            
            <div className="flex justify-between items-center bg-white p-4 shadow-md rounded-lg">
                <div className="flex items-center gap-4">
                    <Link to="/">
                        <Button variant="outline">
                            <MdHome className="inline-block mr-2 text-xl" />
                            Home
                        </Button>
                    </Link>
                    <div className="relative">
                        <Input
                            type="text"
                            className="pl-10 p-2 border rounded"
                            placeholder="Search books..."
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/user">
                        <Button variant="outline">
                            <MdPerson className="inline-block mr-2 text-xl" />
                            Profile
                        </Button>
                    </Link>
                    <Button variant="destructive" onClick={handleLogout}>
                        <MdLogout className="inline-block mr-2 text-xl" />
                        Logout
                    </Button>
                </div>
            </div>

            <div className="mt-8 p-6 bg-white rounded-lg shadow-md text-center">
                {error && <p className="text-red-500">{error}</p>}
                {user && (
                    <h2 className="text-2xl font-bold text-gray-700">
                        Welcome, <span className="text-indigo-500">{user.name}</span>
                    </h2>
                )}
            </div>

            <h2 className="text-2xl font-bold my-6 text-gray-700 text-center"> Borrowed Books</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredBooks.length === 0 ? (
                    <p className="text-gray-500 text-center col-span-full">No borrowed books yet!</p>
                ) : (
                    filteredBooks.map((book) => (
                        <div key={book.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
                            <img
                                src={book.image || "/default-book.jpg"}
                                alt={book.title}
                                className="w-full aspect-[16/20] object-cover rounded-lg mb-4"
                            />
                            <h3 className="text-lg font-semibold text-gray-800">{book.title}</h3>
                            <p className="text-sm text-gray-500">{book.author}</p>
                            <p className="text-sm text-gray-500">
                                Return by: <span className="font-semibold">{new Date(book.return_date).toLocaleDateString()}</span>
                            </p>

                            {getReturnAlert(book.return_date) && (
                                <p className="text-red-500 text-sm">{getReturnAlert(book.return_date)}</p>
                            )}

                            <Button
                                onClick={() => handleReturnBook(book.id)}
                                className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white"
                            >
                                <MdOutlineReplay className="inline-block mr-2 text-lg" />
                                Return Book
                            </Button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default User;
