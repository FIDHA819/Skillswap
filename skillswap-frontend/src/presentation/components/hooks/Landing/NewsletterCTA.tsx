import { motion } from "framer-motion";

export default function Newsletter() {

return (

<section className="py-32 px-6 md:px-10 relative overflow-hidden">


{/* Background Glow */}

<div className="absolute inset-0 flex justify-center items-center -z-10">

<div className="w-[500px] h-[500px] bg-blue-200 blur-[160px] rounded-full opacity-40"></div>

</div>


{/* CTA Card */}

<motion.div
initial={{ opacity: 0, scale: 0.9 }}
whileInView={{ opacity: 1, scale: 1 }}
transition={{ duration: 0.6 }}
className="max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl p-12 text-center relative"
>


<h2 className="text-4xl font-bold">

Your next skill exchange is waiting 

</h2>


<p className="text-gray-600 mt-4">

Join SkillSwap today and start learning from real people — not just videos.

</p>


{/* Input Row */}

<div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">


<input
placeholder="Enter your email address"
className="px-6 py-4 rounded-xl border border-gray-300 w-full md:w-80 focus:ring-2 focus:ring-blue-500 outline-none"
/>


<button className="px-8 py-4 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition">

Join Now

</button>


</div>


{/* Trust Line */}

<p className="text-sm text-gray-500 mt-6">

No spam. No payments. Just real skill exchange 🤝

</p>


</motion.div>

</section>

);
}