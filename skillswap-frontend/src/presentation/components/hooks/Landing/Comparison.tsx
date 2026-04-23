import { motion } from "framer-motion";

export default function Comparison() {

const features = [
  {
    title: "Learn by Teaching Others",
    skillSwap: true,
    traditional: false
  },
  {
    title: "Real Community Interaction",
    skillSwap: true,
    traditional: false
  },
  {
    title: "Skill-for-Skill Exchange",
    skillSwap: true,
    traditional: false
  },
  {
    title: "Expensive Course Purchases",
    skillSwap: false,
    traditional: true
  },
  {
    title: "Passive Video Watching",
    skillSwap: false,
    traditional: true
  }
];

return (

<section className="py-28 px-6 md:px-10">

<h2 className="text-4xl font-bold text-center">

Why SkillSwap is Different ✨

</h2>

<p className="text-gray-600 text-center mt-4">

Traditional platforms teach you.  
SkillSwap connects you.

</p>


<div className="max-w-6xl mx-auto mt-16 grid md:grid-cols-2 gap-8">


{/* SkillSwap Column */}

<motion.div
initial={{ y: 40, opacity: 0 }}
whileInView={{ y: 0, opacity: 1 }}
transition={{ duration: .6 }}
className="rounded-3xl shadow-xl bg-blue-400 text-white p-10 relative"
>

<span className="absolute top-4 right-4 bg-white text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">

Best Choice

</span>

<h3 className="text-2xl font-bold mb-6">

SkillSwap 🚀

</h3>

<ul className="space-y-4">

{features.map((item, index) => (

<li key={index} className="flex items-center gap-3">

<span className="text-xl">

{item.skillSwap ? "✅" : "❌"}

</span>

<span>{item.title}</span>

</li>

))}

</ul>

</motion.div>


{/* Traditional Platforms Column */}

<motion.div
initial={{ y: 40, opacity: 0 }}
whileInView={{ y: 0, opacity: 1 }}
transition={{ duration: .6, delay: .2 }}
className="rounded-3xl shadow-lg bg-white p-10"
>

<h3 className="text-2xl font-bold mb-6 text-gray-800">

Traditional Learning Platforms

</h3>

<ul className="space-y-4">

{features.map((item, index) => (

<li key={index} className="flex items-center gap-3">

<span className="text-xl">

{item.traditional ? "✅" : "❌"}

</span>

<span className="text-gray-600">

{item.title}

</span>

</li>

))}

</ul>

</motion.div>

</div>


{/* Bottom Conversion Line */}

<motion.p
initial={{ opacity: 0 }}
whileInView={{ opacity: 1 }}
transition={{ delay: .4 }}
className="text-center text-gray-500 mt-12 text-lg"
>

SkillSwap turns learners into teachers and teachers into learners 🤝

</motion.p>

</section>

);

}