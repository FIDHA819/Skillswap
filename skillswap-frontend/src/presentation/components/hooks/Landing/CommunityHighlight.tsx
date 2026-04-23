import { motion } from "framer-motion";

const users = [
  {
    name: "Rahul",
    teaches: "Photoshop",
    learns: "React",
    swaps: 12,
    rating: 4.8,
    img: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    name: "Anita",
    teaches: "React",
    learns: "Figma",
    swaps: 18,
    rating: 4.9,
    img: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    name: "Fidha",
    teaches: "Excel",
    learns: "UI Design",
    swaps: 9,
    rating: 4.7,
    img: "https://randomuser.me/api/portraits/women/68.jpg"
  }
];

export default function CommunityHighlights() {

return (

<section className="py-28 px-6 md:px-10">

<h2 className="text-4xl font-bold text-center">

Meet Our Active Skill Swappers 🌍

</h2>

<p className="text-gray-600 text-center mt-4">

Real learners exchanging real skills every day

</p>


<div className="grid md:grid-cols-3 gap-10 mt-16 max-w-6xl mx-auto">


{users.map((user, index) => (

<motion.div
key={index}
initial={{ y: 40, opacity: 0 }}
whileInView={{ y: 0, opacity: 1 }}
whileHover={{ scale: 1.05 }}
transition={{ duration: 0.5 }}
className="bg-white shadow-xl rounded-3xl p-8 text-center relative"
>


{/* Verified Badge */}

<span className="absolute top-4 right-4 text-green-500 text-lg">

✔

</span>


{/* Avatar */}

<img
src={user.img}
className="w-20 h-20 rounded-full mx-auto shadow-md"
/>


{/* Name */}

<h3 className="mt-4 text-xl font-semibold">

{user.name}

</h3>


{/* Skills */}

<p className="text-gray-500 text-sm mt-2">

Teaches

</p>

<span className="inline-block mt-1 px-4 py-1 bg-blue-100 text-blue-600 rounded-full">

{user.teaches}

</span>


<p className="text-gray-500 text-sm mt-4">

Learning

</p>

<span className="inline-block mt-1 px-4 py-1 bg-green-100 text-green-600 rounded-full">

{user.learns}

</span>


{/* Stats */}

<div className="flex justify-center gap-6 mt-6 text-sm text-gray-600">

<span>⭐ {user.rating}</span>

<span>🔁 {user.swaps} swaps</span>

</div>

</motion.div>

))}


</div>


{/* Bottom Trust Line */}

<motion.p
initial={{ opacity: 0 }}
whileInView={{ opacity: 1 }}
transition={{ delay: 0.4 }}
className="text-center text-gray-500 mt-14"
>

Join hundreds of learners already exchanging skills on SkillSwap

</motion.p>

</section>

);
}