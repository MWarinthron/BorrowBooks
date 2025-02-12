import React, { useState, useEffect } from "react";
import Input from "./ui/Input";
import Button from "./ui/Button"
import { Link } from "react-router-dom";
import HotBooks from "./HotBooks";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { MdHome, MdPerson, MdLogout } from "react-icons/md";


const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");


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
      const response = await fetch("http://localhost:5000/api/book");
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

  const handleSearch = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleBorrowClick = (bookId) => {
    if (token) {
      navigate("/borrow", { state: { bookId } });
    } else {
      navigate("/login");
    }
  };


  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery) ||
    book.author.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-400 p-4">
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
              className="pl-10 p-2 border border-blue-300"
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

  
      <div className="flex overflow-x-auto gap-4">
        <HotBooks books={books} />
      </div>

       <div className="mt-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Available Books</h2>
        <div className="flex flex-wrap gap-6">

          {filteredBooks.map((book) => (
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

              <div className="mt-auto w-full flex justify-center">
                <Button
                  onClick={() => handleBorrowClick(book.id)}
                  className={`w-full py-2 rounded-lg text-white font-semibold ${book.available ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}`}
                  disabled={!book.available}
                >
                  {book.available ? "Borrow" : "Already Borrowed"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Home;