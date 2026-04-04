import React from "react";

export default function Membership() {
  const plans = [
    { duration: "1 Month", price: "₹1,500" },
    { duration: "3 Months", price: "₹3,500" , popular: true},
    { duration: "6 Months", price: "₹6,500" },
    { duration: "1 Year", price: "₹10,000" },
  ];

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

            {/* Popular Badge */}
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-black text-xs px-3 py-1 rounded-full font-semibold">
                MOST POPULAR
              </div>
            )}

            {/* Plan Name */}
            <h2 className="text-2xl font-semibold text-center mb-4">
              {plan.duration}
            </h2>

            {/* Price */}
            <p className="text-4xl font-extrabold text-center mb-6 text-green-400">
              {plan.price}
            </p>

            {/* Features */}
            <ul className="text-gray-300 space-y-3 mb-8 text-center">
              <li>✔ Unlimited Gym Access</li>
              <li>✔ Cardio & Strength Zones</li>
              <li>✔ Personal Trainer Guidance</li>
              <li>✔ Locker Facility</li>
            </ul>

            {/* Button */}
            <button className="w-full py-3 rounded-xl font-semibold 
              bg-green-500 hover:bg-green-600 transition-all duration-300
              shadow-lg hover:shadow-green-500/40">
              Join Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}