export default function HowItWorks() {
  const steps = [
    {
      title: "Create Profile",
      desc: "Set up your profile and list your skills."
    },
    {
      title: "Offer a Skill",
      desc: "Share what you can teach others."
    },
    {
      title: "Learn from Others",
      desc: "Exchange knowledge and grow together."
    }
  ];

  return (
    <section className="py-28 px-10">

      <h2 className="text-3xl text-shadow-black font-bold text-center mb-16">
        How SkillSwap Works
      </h2>

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

        {steps.map((step) => (
          <div
            key={step.title}
            className="p-8 rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-lg text-center"
          >
            <h3 className="text-xl font-semibold mb-3">
              {step.title}
            </h3>

            <p className="text-gray-600">
              {step.desc}
            </p>

          </div>
        ))}

      </div>
    </section>
  );
}