import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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
      <Routes>
        {/* LOGIN PAGE */}
        <Route path="/" element={<LoginDashboard />} />
        <Route path="/contact" element={<ContactDashboard />} />
        <Route path="/membership" element={<MembershipDashboard />} />
        <Route path="/services" element={<ServicesDashboard />} />
        <Route path="/home" element={<HomeDashboard />} />

        

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