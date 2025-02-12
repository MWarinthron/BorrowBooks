import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Components/Login";
import Register from "./Components/Register"
import Home from "./Components/Home";
import User from "./Components/User";
import Admin from "./Components/admin"; 
import Borrow from "./Components/Borrow"; 
import BorrowedBooks from "./Components/BorrowedBooks";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/User" element={<User />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/Borrow" element={<Borrow />} />
        <Route path="/Borrowed" element={<BorrowedBooks />} />
      </Routes>
    </Router>
  );
}

export default App;
