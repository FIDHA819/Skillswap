import { motion } from "framer-motion";

export default function SwapPreview() {

return (

<section className="py-28 px-6 md:px-10">

<h2 className="text-4xl font-bold text-center">

Exchange Skills Instantly

</h2>

<p className="text-gray-600 text-center mt-4">

Connect with learners who teach what you want to learn.

</p>


{/* Swap Cards Layout */}

<div className="mt-20 max-w-6xl mx-auto grid lg:grid-cols-3 gap-10 items-center">


{/* LEFT USER */}

<motion.div
initial={{ x:-60, opacity:0 }}
whileInView={{ x:0, opacity:1 }}
transition={{ duration:.7 }}
className="bg-white shadow-xl rounded-3xl p-8 text-center relative"
>

<img
src="https://randomuser.me/api/portraits/men/32.jpg"
className="w-20 h-20 rounded-full mx-auto shadow-md"
/>

<h3 className="mt-4 text-xl font-semibold">

Rahul

</h3>

<p className="text-gray-500 text-sm">

Teaches

</p>

<span className="inline-block mt-2 px-4 py-1 bg-blue-100 text-blue-600 rounded-full">

Photoshop 🎨

</span>

<p className="mt-4 text-gray-500 text-sm">

Wants to learn

</p>

<span className="inline-block mt-2 px-4 py-1 bg-green-100 text-green-600 rounded-full">

React 💻

</span>

</motion.div>


{/* CENTER SWAP ANIMATION */}

<motion.div
animate={{ rotate:[0,180,360] }}
transition={{ duration:4, repeat:Infinity }}
className="text-6xl text-blue-500 text-center"
>

⇄

</motion.div>


{/* RIGHT USER */}

<motion.div
initial={{ x:60, opacity:0 }}
whileInView={{ x:0, opacity:1 }}
transition={{ duration:.7 }}
className="bg-white shadow-xl rounded-3xl p-8 text-center relative"
>

<img
src="https://randomuser.me/api/portraits/women/44.jpg"
className="w-20 h-20 rounded-full mx-auto shadow-md"
/>

<h3 className="mt-4 text-xl font-semibold">

Anita

</h3>

<p className="text-gray-500 text-sm">

Teaches

</p>

<span className="inline-block mt-2 px-4 py-1 bg-green-100 text-green-600 rounded-full">

React 💻

</span>

<p className="mt-4 text-gray-500 text-sm">

Wants to learn

</p>

<span className="inline-block mt-2 px-4 py-1 bg-blue-100 text-blue-600 rounded-full">

Photoshop 🎨

</span>

</motion.div>

</div>


{/* Bottom Trust Message */}

<motion.p
initial={{ opacity:0 }}
whileInView={{ opacity:1 }}
transition={{ delay:.5 }}
className="text-center text-gray-500 mt-12"
>

SkillSwap intelligently connects learners based on matching skills.

</motion.p>

</section>

);

}