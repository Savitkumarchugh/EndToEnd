import { BrowserRouter, Routes, Route, Navigate,useLocation } from "react-router-dom";
import { useEffect } from "react";

import Navbar from "./Navbar";
import Hero from "./MainHero";
import Features from "./FeaturesHero";
import MembersHero from "./MembersPanelHero";
import TrainersHero from "./TrainersPanelHero";
import Footer from "./Footer";
import LogIn from "./LogIn";
import Contact from "./Common/Contact";
import Membership from "./Common/Membership";
import Services from "./Common/Services";
import Home from "./Common/Home";
import Products from "./Products";



function ThemeColorHandler() {
  const location = useLocation();

  useEffect(() => {
    let color = "#111827"; // default dark

    switch (location.pathname) {
      case "/home":
        color = "#111827"; // dark
        break;
      case "/membership":
        color = "#111827"; // slightly different dark
        break;
      case "/payment":
        color = "#111827"; // black
        break;
      case "/services":
        color = "#111827"; // gray
        break;
      case "/contact":
        color = "#111827"; // slightly different dark
        break;
      case "/owner":
        color = "#7f1d1d"; // strong green
        break;
      case "/products":
        color = "#22c55e"; // strong green
        break;
      default:
        color = "#111827";
    }

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", color);
    }
  }, [location]);

  return null;
}

// ---------------- DASHBOARDS ----------------

// OWNER
function OwnerDashboard() {
  return (
    <>
      <Navbar />
      {/* <Hero /> */}
      <MembersHero />
      <Features />
      <Footer />
    </>
  );
}

function ProductsDashboard() {
  return (
    <>
      <Navbar />
      {/* <Hero /> */}
      <Products />
      <Features />
      <Footer />
    </>
  );
}


function ContactDashboard() {
  return (
    <>
      <Navbar />
      {/* <Hero /> */}
      <Contact />
      <Features />
      <Footer />
    </>
  );
}

function MembershipDashboard() {
  return (
    <>
      <Navbar />
      <Membership />
      <Features />
      <Footer />
    </>
  );
}

function ServicesDashboard() {
  return (
    <>
      <Navbar />
      <Services />
      <Features />
      <Footer />
    </>
  );
}

function LoginDashboard() {
  return (
    <>
      <Navbar />
      <LogIn />
      {/* <Hero /> */}
      <Features />
      <Footer />
    </>
  );
}

function HomeDashboard() {
  return (
    <>
      <Navbar />
      <Home />
      <Features />
      <Footer />
    </>
  );
}


// TRAINER
function TrainerDashboard() {
  return (
    <>
      <Navbar />
      <Hero />
      <TrainersHero />
      <Features />
      <Footer />
    </>
  );
}

// USER
function UserDashboard() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <Footer />
    </>
  );
}

// PROTECTED ROUTE
function ProtectedRoute({ children, role }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <Navigate to="/home" />;

  if (role && user.role !== role) return <Navigate to="/home" />;

  return children;
}

export default function Index() {
  return (
    <BrowserRouter>
    <ThemeColorHandler /> 
      <Routes>
        {/* LOGIN PAGE */}
        <Route path="/" element={<LoginDashboard />} />
        <Route path="/contact" element={<ContactDashboard />} />
        <Route path="/membership" element={<MembershipDashboard />} />
        <Route path="/services" element={<ServicesDashboard />} />
        <Route path="/home" element={<HomeDashboard />} />  
        <Route path="/products" element={<ProductsDashboard />} />

        {/* DASHBOARDS */}
        <Route
          path="/owner"
          element={
            <ProtectedRoute role="owner">
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />
        

        <Route
          path="/trainer"
          element={
            <ProtectedRoute role="trainer">
              <TrainerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user"
          element={
            <ProtectedRoute role="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}