import {
Calendar,
Clock
}
from "lucide-react"

export default function UpcomingSessions(){

const sessions=[

{
teacher:"Rahul",
skill:"React",
time:"6:00 PM"
},

{
teacher:"Aachi",
skill:"UI UX",
time:"8:30 PM"
}

]

return(

<section className="max-w-7xl mx-auto px-6">

<h2 className="text-4xl font-bold mb-10">

Upcoming Sessions

</h2>

<div className="grid md:grid-cols-2 gap-6">

{

sessions.map((item,index)=>(

<div
key={index}
className="
bg-white/70
backdrop-blur-xl
rounded-3xl
p-8
shadow
"
>

<div className="flex justify-between">

<h3 className="text-xl font-semibold">

{item.skill}

</h3>

<Calendar/>

</div>

<p className="mt-4">

Teacher:
{item.teacher}

</p>

<div
className="
flex
items-center
gap-2
mt-4
text-blue-500
"
>

<Clock/>

{item.time}

</div>

<button
className="
mt-6
px-6
py-3
bg-blue-600
text-white
rounded-full
"
>

Join Session

</button>

</div>

))

}

</div>

</section>

)

}