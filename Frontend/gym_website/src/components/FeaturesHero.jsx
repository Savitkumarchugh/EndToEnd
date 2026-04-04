export default function Features() {
  const items = [
    {
      title: "Strength Training",
      desc: "Heavy lifting and expert guidance to build muscle.",
    },
    {
      title: "Personal Training",
      desc: "Customized plans tailored to your fitness goals.",
    },
    {
      title: "Diet Planning",
      desc: "Nutrition plans for weight gain and fat loss.",
    },
  ];

  return (
    <section className="px-6 py-16 bg-gray-900">
      <h2 className="text-3xl font-bold text-center mb-10">Our Services</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((item, i) => (
          <div
            key={i}
            className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:scale-105 transition"
          >
            <h3 className="text-xl font-semibold">{item.title}</h3>
            <p className="text-gray-400 mt-2">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
