
import React from "react";
import BorrowModal from "../Components/BorrowModal";
import { useState } from "react";

const HotBooks = ({ books }) => {
  const hotBooks = books.filter(book => book.categories === "recommend");
  const [currentIndex, setCurrentIndex] = useState(0);

 
  const currentBook = hotBooks.length > 0 ? hotBooks[currentIndex] : null;

  const nextBook = () => {
    if (currentIndex < hotBooks.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevBook = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (!currentBook) {
    return <div>No hot books available.</div>; 
  }

  return (
    <div className="relative w-5/6 mx-auto h-[calc(75vh+16px)] bg-blue-100">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2">
        <h2 className="text-xl font-bold mb-4 text-center">Recommend Books</h2>
        <div className="flex justify-center">
          <div className="w-64 h-100">  
            <BorrowModal
              key={currentBook.id}
              book={currentBook}
            />
          </div>
        </div>

      </div>
      <div className="absolute top-1/2 left-0 transform -translate-y-1/2">
        <button
          onClick={prevBook}
          className="bg-gray-500 text-white p-2 rounded-full"
          disabled={currentIndex === 0}
        >
          &#10094;
        </button>
      </div>
      <div className="absolute top-1/2 right-0 transform -translate-y-1/2">
        <button
          onClick={nextBook}
          className="bg-gray-500 text-white p-2 rounded-full"
          disabled={currentIndex === hotBooks.length - 1}
        >
          &#10095;
        </button>
      </div>
    </div>
  );
};

export default HotBooks;
