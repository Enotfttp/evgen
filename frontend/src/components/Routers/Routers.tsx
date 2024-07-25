import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Users from "../Employees/Users";
import Kindergartens from "../Kindergartens/Kindergartens";
import Login from "../Login/Login";
import Materials from "../Materials/Materials";
import Orders from "../Orders/Orders";
import Registr from "../Registration/Registr";
import ProtectedRouters from "./ProtectedRouters";

const Routers: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registr" element={<Registr />} />
        <Route element={<ProtectedRouters />}>
          <Route path="/users" element={<Users />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/kindergartens" element={<Kindergartens />} />
        </Route>
      </Routes>
    </Router>
  );
};
export default Routers;
