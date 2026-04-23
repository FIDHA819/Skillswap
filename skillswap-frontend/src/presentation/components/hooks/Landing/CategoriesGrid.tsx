const categories=[

"Business",
"UI/UX",
"Graphic Design",
"Marketing",
"Product Design",
"Photography"

];

export default function Categories(){

return(

<section className="py-24">

<h2 className="text-3xl font-bold text-center">

Explore Skill Categories

</h2>

<div className="grid md:grid-cols-3 gap-8 mt-12 max-w-6xl mx-auto">

{categories.map(cat=>(

<div

className="p-6 rounded-2xl shadow-lg hover:shadow-xl transition"

>

{cat}

</div>

))}

</div>

</section>

);
}