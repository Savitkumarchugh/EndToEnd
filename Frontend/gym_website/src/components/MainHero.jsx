import { motion } from "framer-motion";



export default function Hero() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-6 py-16">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl"
      >
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Transform Your Body
        </h1>
        <p className="mt-4 text-gray-400">
          Join A1 Fitness Series and achieve your dream physique with expert
          trainers and modern equipment.
        </p>
        <button className="mt-6 bg-green-500 px-6 py-3 rounded-xl text-lg hover:bg-green-600">
          Get Started
        </button>
      </motion.div>

      <motion.img
        // src="https://images.unsplash.com/photo-1554284126-aa88f22d8b74"
        src="/gym_images/hero_first.jpg"
        alt="gym"
        className="rounded-2xl mt-10 md:mt-0 w-full md:w-1/2"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
      />
    </section>
  );
}