import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "../Login/Login";
import Registr from "../Registration/Registr";
import ProtectedRouters from "./ProtectedRouters";
import Acts from "../Acts/Acts";

const Routers: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registr" element={<Registr />} />
        <Route element={<ProtectedRouters />}>
          <Route path="/acts" element={<Acts />} />
        </Route>
      </Routes>
    </Router>
  );
};
export default Routers;
