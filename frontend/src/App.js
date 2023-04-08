import {BrowserRouter, Routes, Route} from "react-router-dom"
import Login from "./components/Login";
import Register from "./components/Register";
import UserList from "./components/UserList";
import AddUser from "./components/AddUser";
import EditUser from "./components/EditUser";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}></Route>
        <Route path="register" element={<Register/>}></Route>
        <Route path="dashboard" element={[<Navbar/>, <Dashboard/>]}></Route>
        <Route path="home" element={<UserList/>}/>
        <Route path="add" element={<AddUser/>}/>
        <Route path="edit/:id" element={<EditUser/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
