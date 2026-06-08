import {
Search,
Star,
Users
} from "lucide-react"

type Teacher={

name:string

skill:string

rating:number

students:number

avatar:string

color:string

}

const TEACHERS:Teacher[]=[

{
name:"Sarah Wilson",
skill:"UI/UX",
rating:4.9,
students:3400,
avatar:"SW",
color:"#6366F1"
},

{
name:"David John",
skill:"React",
rating:4.8,
students:2800,
avatar:"DJ",
color:"#3B82F6"
},

{
name:"Anika",
skill:"Figma",
rating:5,
students:1700,
avatar:"AN",
color:"#EC4899"
}

]

const TOP=Array(3)
.fill(null)
.map((_,i)=>({

name:[
"Kathy Sullivan",
"Emily Carter",
"Alex"
][i],

skill:
"UI/UX",

rating:
4.9,

students:
2100,

avatar:
["KS","EC","AX"][i],

color:
[
"#8B5CF6",
"#3B82F6",
"#14B8A6"
][i]

}))

function Avatar({

initials,

color

}:{

initials:string

color:string

}){

return(

<div
className="
w-16
h-16
rounded-2xl
flex
items-center
justify-center
text-white
font-bold
text-lg
"
style={{
background:
`linear-gradient(
135deg,
${color},
#0f172a
)`
}}
>

{initials}

</div>

)

}

export default function RecommendedTeachers(){

return(

<section
className="
py-32
border-y
border-white/5
bg-gradient-to-b
from-[#08111f]
via-[#0c1428]
to-[#08111f]
"
>

<div
className="
max-w-7xl
mx-auto
px-6
"
>

<div
className="
grid
lg:grid-cols-[380px_1fr]
gap-20
"
>

{/* LEFT */}

<div
className="
sticky
top-28
self-start
"
>

<div
className="
inline-flex
gap-2
rounded-full
bg-blue-500/10
border
border-blue-500/20
px-5
py-2
text-blue-300
mb-8
"
>

<Star size={14}/>

Top Teachers

</div>

<h2
className="
text-5xl
font-black
leading-tight
mb-5
text-white
"
>

Learn from

<span
className="
bg-gradient-to-r
from-blue-400
to-violet-500
bg-clip-text
text-transparent
ml-2
"
>

the best

</span>

</h2>

<p
className="
text-slate-400
leading-8
mb-10
"
>

All teachers are verified
and matched to your goals.

</p>

<div
className="
rounded-3xl
border
border-white/10
bg-white/5
p-5
space-y-4
"
>

<div
className="
flex
items-center
gap-3
rounded-xl
bg-black/20
border
border-white/10
px-4
py-3
"
>

<Search
size={15}
className="text-slate-400"
/>

<input

placeholder="Search skill"

className="
bg-transparent
outline-none
text-white
flex-1
"
/>

</div>

<select
className="
w-full
rounded-xl
bg-black/20
border
border-white/10
p-3
text-slate-300
"
>

<option>
All Types
</option>

<option>
Free
</option>

<option>
Paid
</option>

</select>

</div>

</div>

{/* RIGHT */}

<div>

{/* Recommended */}

<div
className="
space-y-5
mb-24
"
>

<h3
className="
text-3xl
font-bold
text-white
mb-10
"
>

Recommended Teachers

</h3>

{

TEACHERS.map(

(

t,

i

)=>(

<div

key={i}

className="
group
rounded-[28px]
border
border-white/10
bg-white/[0.03]
p-8
flex
items-center
gap-6
hover:border-blue-500/30
duration-300
hover:-translate-y-2
"
>

<Avatar

initials={t.avatar}

color={t.color}

/>

<div
className="flex-1"
>

<div
className="
flex
gap-3
items-center
mb-3
"
>

<h4
className="
text-white
font-bold
text-xl
"
>

{t.name}

</h4>

<div
className="
rounded-full
px-3
py-1
text-xs
bg-blue-500/10
text-blue-300
"
>

{t.skill}

</div>

</div>

<div
className="
flex
gap-8
text-slate-400
"
>

<div
className="
flex
items-center
gap-2
"
>

<Star
size={14}
fill="#FBBF24"
color="#FBBF24"
/>

{t.rating}

</div>

<div
className="
flex
items-center
gap-2
"
>

<Users
size={14}
/>

{t.students}

</div>

</div>

</div>

<button
className="
rounded-full
px-7
py-3
bg-gradient-to-r
from-blue-600
to-violet-600
text-white
"
>

Connect

</button>

</div>

)

)

}

</div>

{/* TOP TEACHERS */}

<div>

<h3
className="
text-4xl
font-black
text-white
mb-10
"
>

Top Rated Teachers

</h3>

<div
className="
grid
md:grid-cols-3
gap-8
"
>

{

TOP.map(

(

t,

i

)=>(

<div

key={i}

className="
rounded-[30px]
border
border-white/10
bg-gradient-to-b
from-white/[0.03]
to-white/[0.01]
p-8
text-center
hover:-translate-y-3
duration-300
"
>

<Avatar

initials={t.avatar}

color={t.color}

/>

<h4
className="
text-white
font-bold
mt-5
mb-2
"
>

{t.name}

</h4>

<p
className="
text-blue-300
mb-3
"
>

{t.skill}

</p>

<div
className="
text-yellow-400
mb-6
"
>

★ {t.rating}

</div>

<button
className="
w-full
rounded-full
py-3
bg-indigo-600
text-white
"
>

Connect

</button>

</div>

)

)

}

</div>

</div>

</div>

</div>

</div>

</section>

)

}