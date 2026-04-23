export default function StatsStrip(){

const stats=[
["2000+","Skill Swaps"],
["500+","Active Learners"],
["120+","Skills Shared"],
["4.8★","Community Rating"]
];

return(

<section className="bg-white py-16">

<div className="grid grid-cols-2 md:grid-cols-4 max-w-6xl mx-auto text-center gap-8">

{stats.map(([num,label])=>(

<div>

<h2 className="text-3xl font-bold text-blue-600">{num}</h2>

<p className="text-gray-500">{label}</p>

</div>

))}

</div>

</section>

);
}