import { motion } from "framer-motion";

const steps = [
  {
    title: "Create Profile",
    desc: "Set up your learning identity in seconds.",
    icon: "👤"
  },
  {
    title: "Add Your Skills",
    desc: "Share what you can teach others.",
    icon: "🎯"
  },
  {
    title: "Match With Learners",
    desc: "Find people who want your skills.",
    icon: "🤝"
  },
  {
    title: "Start Skill Exchange",
    desc: "Learn together through real interaction.",
    icon: "🚀"
  }
];

export default function Timeline() {
  return (
    <section className="py-28 px-6 md:px-10 bg-gradient-to-b from-blue-50 to-white">

      {/* Section Title */}

      <h2 className="text-4xl font-bold text-center">
        How SkillSwap Works
      </h2>

      <p className="text-gray-600 text-center mt-4">
        Start exchanging skills in just a few simple steps
      </p>


      {/* Timeline Container */}

      <div className="relative mt-20 max-w-6xl mx-auto">

        {/* Horizontal line (desktop) */}

        <div className="hidden md:block absolute top-12 left-0 w-full h-[2px] bg-blue-200" />


        {/* Steps Grid */}

        <div className="grid md:grid-cols-4 gap-12 relative">

          {steps.map((step, index) => (

            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="text-center relative"
            >

              {/* Step Circle */}

              <div className="w-16 h-16 flex items-center justify-center mx-auto rounded-full bg-blue-600 text-white text-2xl shadow-lg relative z-10">

                {step.icon}

              </div>


              {/* Step Title */}

              <h3 className="mt-6 text-lg font-semibold">

                {step.title}

              </h3>


              {/* Step Description */}

              <p className="mt-2 text-gray-500 text-sm">

                {step.desc}

              </p>

            </motion.div>

          ))}

        </div>

      </div>

    </section>
  );
}