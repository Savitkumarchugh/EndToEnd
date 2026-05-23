import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useNavigate } from "react-router-dom";

export default function Membership() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const isLoggedIn = !!localStorage.getItem("token");

  const plans = [
    { duration: "1 Month", price: "1500" },
    { duration: "3 Months", price: "3500", popular: true },
    { duration: "6 Months", price: "6500" },
    { duration: "1 Year", price: "10000" },
  ];

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor;
    if (/android|iPhone|iPad|iPod/i.test(userAgent)) {
      setIsMobile(true);
    }
  }, []);

  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black text-white px-6 py-16">
      
      {/* Heading */}
      <div className="text-center mb-14">
        <h1 className="text-5xl font-extrabold mb-3 tracking-tight">
          Membership Plans
        </h1>
        <p className="text-gray-400 text-lg">
          Choose your grind. Build your legacy 💪
        </p>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-4 gap-10 max-w-7xl mx-auto">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative p-7 rounded-3xl border transition-all duration-300
              ${plan.popular 
                ? "bg-gradient-to-b from-green-600/20 to-gray-900 border-green-500 scale-105 shadow-2xl" 
                : "bg-gray-900 border-gray-800 hover:border-green-400 hover:shadow-xl hover:scale-105"
              }`}
          >

            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-black text-xs px-3 py-1 rounded-full font-semibold">
                MOST POPULAR
              </div>
            )}

            <h2 className="text-2xl font-semibold text-center mb-4">
              {plan.duration}
            </h2>

            <p className="text-4xl font-extrabold text-center mb-6 text-green-400">
              ₹{plan.price}
            </p>

            <ul className="text-gray-300 space-y-3 mb-8 text-center">
              <li>✔ Unlimited Gym Access</li>
              <li>✔ Cardio & Strength Zones</li>
              <li>✔ Personal Trainer Guidance</li>
              <li>✔ Locker Facility</li>
            </ul>

            {/* 🔥 Pay Button */}
          {isLoggedIn ? (
  <button
    onClick={() => setSelectedPlan(plan)}
    className="w-full py-3 rounded-xl font-semibold 
    bg-green-500 hover:bg-green-600 transition-all duration-300
    shadow-lg hover:shadow-green-500/40"
  >
    Pay Now
  </button>
) : (
  <button
    onClick={() => navigate("/")}   // redirect to login
    className="w-full py-3 rounded-xl font-semibold 
    bg-green-500 hover:bg-green-600 transition-all duration-300
    shadow-lg hover:shadow-green-500/40"
  >
    Join Now
  </button>
)}
          </div>
        ))}
      </div>

      {/* 🔥 PAYMENT MODAL */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 px-4">
          <div className="bg-gray-900 p-8 rounded-2xl text-center max-w-sm w-full">

            <h2 className="text-2xl font-bold mb-4">
              Pay ₹{selectedPlan.price}
            </h2>

            {/* UPI LINK */}
            {(() => {
              const upiLink = `upi://pay?pa=savitkumarchugh-2@okhdfcbank&pn=Savit%20Kumar%20Chugh&am=${selectedPlan.price}&cu=INR`;

              return (
                <>
                  {/* 📱 MOBILE */}
                  {isMobile && (
                    <a
                      href={upiLink}
                      className="flex justify-center items-center gap-3 bg-green-500 px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition mb-6"
                    >
                      Pay via GPay
                    </a>
                  )}

                  {/* 💻 DESKTOP */}
                  {!isMobile && (
                    <div className="flex flex-col items-center mb-6">
                      <QRCodeCanvas value={upiLink} size={200} />
                      <p className="text-gray-400 text-sm mt-3">
                        Scan to pay
                      </p>
                    </div>
                  )}
                </>
              );
            })()}

            {/* Close */}
            <button
              onClick={() => setSelectedPlan(null)}
              className="mt-4 text-gray-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}