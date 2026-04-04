import React from "react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black text-white px-6 py-16">
      
      {/* Heading */}
      <div className="text-center mb-14">
        <h1 className="text-5xl font-extrabold mb-3 tracking-tight">
          Contact Us
        </h1>
        <p className="text-gray-400 text-lg">
          Let’s connect and start your fitness journey 💪
        </p>
      </div>

      {/* Main Section */}
      <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
        
        {/* Contact Info + Call */}
        <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl shadow-xl hover:shadow-green-500/10 transition-all">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Get in Touch
          </h2>

          <div className="space-y-4 text-gray-300 text-center mb-8">
            <p>
              <span className="font-semibold text-white">📍 Address:</span>{" "}
              A1 Fitness Series, Aligarh
            </p>
            <p>
              <span className="font-semibold text-white">📞 Phone:</span>{" "}
              +91 98765 43210
            </p>
            <p>
              <span className="font-semibold text-white">📧 Email:</span>{" "}
              support@a1fitness.com
            </p>
            <p>
              <span className="font-semibold text-white">🕒 Timings:</span>{" "}
              6 AM - 10 PM
            </p>
          </div>

          {/* Call Button */}
          <a
            href="tel:+919876543210"
            className="block text-center bg-green-500 py-3 rounded-xl font-semibold hover:bg-green-600 transition shadow-lg hover:shadow-green-500/40"
          >
            📞 Call Now
          </a>

          {/* Directions Button */}
          <a
            href="https://maps.app.goo.gl/V1tHpGe3FJdf6ySbA"
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-4 text-center bg-gray-800 py-3 rounded-xl hover:bg-gray-700 transition"
          >
            📍 Get Directions
          </a>
        </div>

        {/* Google Map */}
        <div className="rounded-3xl overflow-hidden border border-gray-800 shadow-xl">
          <iframe
            title="Gym Location"
            src="https://www.google.com/maps?q=A1+Fitness+Series+Aligarh&output=embed"
            className="w-full h-[400px]"
            loading="lazy"
          ></iframe>
        </div>

      </div>
    </div>
  );
}