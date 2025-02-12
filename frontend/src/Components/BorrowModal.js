import React, { useState } from "react";


const BorrowModal = ({ book}) => {
  const [hover, setHover] = useState(false);

  return (
    <div
      className="relative group "
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <img
        src={book.image}
        alt={book.title}
        className={`w-full h-100 object-cover rounded-md mb-4 transition-transform duration-300 transform ${hover ? "translate-x-4" : "translate-x-0"
          }`}
      />
      <h3 className="text-lg font-semibold">{book.title}</h3>
      <p className="text-sm text-gray-600">by {book.author}</p>
    </div>
  );
};

export default BorrowModal;
