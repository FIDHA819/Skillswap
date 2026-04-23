import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    name: "Rahul",
    role: "UI Designer",
    text: "SkillSwap helped me learn React while teaching Photoshop. Best learning experience I've had!",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5
  },
  {
    name: "Anita",
    role: "Frontend Developer",
    text: "Much better than traditional platforms. Real interaction makes learning faster and fun.",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5
  },
  {
    name: "Fidha",
    role: "Marketing Student",
    text: "I exchanged Excel skills for UI Design knowledge. Amazing community experience!",
    img: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 4
  }
];

export default function Testimonials() {

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const user = testimonials[index];

  return (

    <section className="py-28 px-6 md:px-10 bg-gradient-to-b from-blue-50 to-white">

      <h2 className="text-4xl font-bold text-center">
        What Learners Are Saying 💬
      </h2>

      <p className="text-gray-600 text-center mt-4">
        Real feedback from real skill exchangers
      </p>


      {/* Slider Card */}

      <div className="max-w-3xl mx-auto mt-16">

        <AnimatePresence mode="wait">

          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-xl rounded-3xl p-10 text-center relative"
          >

            {/* Avatar */}

            <img
              src={user.img}
              className="w-20 h-20 rounded-full mx-auto shadow-md"
            />

            {/* Name */}

            <h3 className="mt-4 text-xl font-semibold">
              {user.name}
            </h3>

            {/* Role */}

            <p className="text-sm text-gray-500">
              {user.role}
            </p>

            {/* Rating */}

            <div className="mt-2 text-yellow-500 text-lg">
              {"⭐".repeat(user.rating)}
            </div>

            {/* Quote */}

            <p className="mt-6 text-gray-600 text-lg italic">
              "{user.text}"
            </p>

          </motion.div>

        </AnimatePresence>


        {/* Navigation dots */}

        <div className="flex justify-center gap-3 mt-6">

          {testimonials.map((_, i) => (

            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full transition ${
                i === index
                  ? "bg-blue-600"
                  : "bg-gray-300"
              }`}
            />

          ))}

        </div>

      </div>


      {/* Trust Footer Line */}

      <p className="text-center text-gray-500 mt-14">
        Join hundreds of learners already exchanging skills on SkillSwap 🤝
      </p>

    </section>

  );
}