import React from "react";
import { Dumbbell, HeartPulse, Users, Flame, Activity, Apple, ShieldCheck, Zap } from "lucide-react";

export default function Services() {
  const services = [
    {
      title: "Strength Training",
      icon: <Dumbbell size={40} />,
      desc: "Build muscle and increase strength with expert guidance and modern equipment.",
    },
    {
      title: "Cardio Training",
      icon: <HeartPulse size={40} />,
      desc: "Improve stamina and heart health with our advanced cardio machines.",
    },
    {
      title: "Personal Training",
      icon: <Users size={40} />,
      desc: "Get customized workout plans and one-on-one coaching from trainers.",
    },
    {
      title: "Fat Loss Programs",
      icon: <Flame size={40} />,
      desc: "Specialized programs designed to help you burn fat effectively.",
    },
    {
      title: "Functional Training",
      icon: <Activity size={40} />,
      desc: "Enhance mobility, balance, and real-life strength with functional workouts.",
    },
    {
      title: "Nutrition Guidance",
      icon: <Apple size={40} />,
      desc: "Get diet plans and nutrition tips to support your fitness goals.",
    },
    {
      title: "Body Transformation",
      icon: <Zap size={40} />,
      desc: "Complete programs to transform your physique and lifestyle.",
    },
    {
      title: "Injury Prevention",
      icon: <ShieldCheck size={40} />,
      desc: "Train safely with guided exercises focused on injury prevention.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black text-white px-6 py-16">
      
      {/* Heading */}
      <div className="text-center mb-14">
        <h1 className="text-5xl font-extrabold mb-3 tracking-tight">
          Our Services
        </h1>
        <p className="text-gray-400 text-lg">
          Everything you need to transform your body 💪
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid md:grid-cols-4 gap-10 max-w-7xl mx-auto">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-gray-900 border border-gray-800 p-7 rounded-3xl 
                       hover:scale-105 transition-all duration-300 
                       hover:border-green-400 hover:shadow-green-500/10 shadow-xl"
          >
            {/* Icon */}
            <div className="flex justify-center mb-4 text-green-400">
              {service.icon}
            </div>

            {/* Title */}
            <h2 className="text-2xl font-semibold text-center mb-3">
              {service.title}
            </h2>

            {/* Description */}
            <p className="text-gray-400 text-center">
              {service.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}