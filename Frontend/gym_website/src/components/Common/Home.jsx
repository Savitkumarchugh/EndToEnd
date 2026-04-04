import React from "react";
import { useNavigate } from "react-router-dom";



export default function Home() {
    const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black text-white px-6 py-16">
      
      {/* Heading */}
      <div className="text-center mb-14">
        <h1 className="text-5xl font-extrabold mb-3 tracking-tight">
          Welcome to A1 Fitness Series
        </h1>
        <p className="text-gray-400 text-lg">
          Train hard. Stay consistent. Achieve your goals 💪
        </p>
      </div>

      {/* Main Cards */}
      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">

        {/* Card 1 */}
        <div className="bg-gray-900 border border-gray-800 p-7 rounded-3xl shadow-xl hover:scale-105 hover:border-green-400 transition-all">
          <img
            src="https://images.unsplash.com/photo-1558611848-73f7eb4001a1"
            alt="Gym"
            className="rounded-xl mb-4 h-40 w-full object-cover"
          />
          <h2 className="text-xl font-semibold mb-2 text-center">
            Modern Equipment
          </h2>
          <p className="text-gray-400 text-center">
            Train with advanced machines and world-class equipment.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-gray-900 border border-gray-800 p-7 rounded-3xl shadow-xl hover:scale-105 hover:border-green-400 transition-all">
          <img
            src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f"
            alt="Trainer"
            className="rounded-xl mb-4 h-40 w-full object-cover"
          />
          <h2 className="text-xl font-semibold mb-2 text-center">
            Expert Trainers
          </h2>
          <p className="text-gray-400 text-center">
            Get guided by professionals to maximize your results.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-gray-900 border border-gray-800 p-7 rounded-3xl shadow-xl hover:scale-105 hover:border-green-400 transition-all">
          <img
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438"
            alt="Workout"
            className="rounded-xl mb-4 h-40 w-full object-cover"
          />
          <h2 className="text-xl font-semibold mb-2 text-center">
            Flexible Plans
          </h2>
          <p className="text-gray-400 text-center">
            Choose plans that suit your fitness journey and budget.
          </p>
        </div>

      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-16">
        <h2 className="text-3xl font-bold mb-4">
          Start Your Journey Today 🚀
        </h2>
        {/* <button  onClick={() => navigate("/")} className="bg-green-500 px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition shadow-lg hover:shadow-green-500/40">
          Join Now
        </button> */}
      </div>

    </div>
  );
}