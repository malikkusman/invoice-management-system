import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from "./components/Home/Home";
import Invoice from "./components/Invoice/Invoice";
import Invoices from "./components/Invoices/Invoices";
import InvoiceDetails from "./components/InvoiceDetails/InvoiceDetails";
import ClientList from "./components/Clients/ClientList";
import NavBar from "./components/NavBar/NavBar";
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Settings from "./components/Settings/Settings";
import Forgot from "./components/Password/Forgot";
import Reset from "./components/Password/Reset";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const user = JSON.parse(localStorage.getItem("profile"));

  return (
    <div>
    
      <BrowserRouter>
      <ToastContainer />

          {user && <NavBar />}
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/invoice" element={<Invoice />} />
            <Route path="/edit/invoice/:id" element={<Invoice />} />
            <Route path="/invoice/:id" element={<InvoiceDetails />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/login" element={<Login />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/dashboard"  element={<Dashboard />} />
            <Route path="/customers"  element={<ClientList />} />
            <Route path="/forgot" element={<Forgot />} />
            <Route path="/reset/:token" element={<Reset />} />

            <Route
              path="/new-invoice"
            
              element={<Navigate to="/invoice" />}
            />
          </Routes>
          <Footer />
    
      </BrowserRouter>
    </div>
  );
}

export default App;
