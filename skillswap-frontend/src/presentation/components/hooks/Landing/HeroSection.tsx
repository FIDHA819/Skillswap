import { motion } from "framer-motion";

export default function Hero() {

const skills=[
"React","Photoshop","Excel",
"Figma","Marketing","Photography"
];

return(

<section className="px-6 md:px-10 py-24 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

<div>

<h1 className="text-4xl md:text-6xl font-bold leading-tight">

Swap Skills. Learn Together. Grow Faster.

</h1>

<p className="mt-6 text-gray-600 text-lg">

Teach what you know. Learn what you need.  
Join the fastest growing peer-learning community.

</p>

<div className="mt-8 flex gap-4 flex-wrap">

<button className="px-8 py-3 bg-blue-600 text-white rounded-xl shadow-lg">

Join Now

</button>

<button className="px-8 py-3 border rounded-xl">

Explore Skills

</button>

</div>

<div className="flex gap-3 mt-10 flex-wrap">

{skills.map(skill=>(

<motion.span

key={skill}

animate={{y:[0,-8,0]}}

transition={{repeat:Infinity,duration:4}}

className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm"

>

{skill}

</motion.span>

))}

</div>

</div>

<img src="/assets/community-learning.png" className="rounded-3xl shadow-xl"/>

</section>

);
}