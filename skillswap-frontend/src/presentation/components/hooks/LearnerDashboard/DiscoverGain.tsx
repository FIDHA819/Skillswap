import {
Sparkles,
ArrowRight,
BookOpen,
GraduationCap
} from "lucide-react"

export default function DiscoverGain() {

return (

<section className="py-32 px-6">

<div
className="
max-w-7xl
mx-auto
relative
overflow-hidden
rounded-[40px]
border
border-white/10
bg-gradient-to-br
from-[#08111f]
via-[#101933]
to-[#070d18]
p-10
lg:p-20
"
>

{/* glow */}

<div
className="
absolute
left-1/2
top-1/2
h-[500px]
w-[700px]
-translate-x-1/2
-translate-y-1/2
bg-indigo-600/10
blur-[180px]
"
/>

<div className="relative z-10">

<div
className="
inline-flex
items-center
gap-2
rounded-full
border
border-violet-400/20
bg-violet-500/10
px-5
py-2
text-sm
text-violet-300
mb-8
"
>

<Sparkles size={14}/>

Choose Your Career

</div>

<h2
className="
text-center
text-5xl
lg:text-6xl
font-black
leading-tight
mb-6
text-white
"
>

Ready to

<span
className="
bg-gradient-to-r
from-blue-400
to-violet-500
bg-clip-text
text-transparent
ml-3
"
>
discover
</span>

your

<span
className="
bg-gradient-to-r
from-yellow-400
to-orange-500
bg-clip-text
text-transparent
ml-3
"
>
gain?
</span>

</h2>

<p
className="
text-center
text-slate-400
max-w-2xl
mx-auto
mb-16
text-lg
"
>

Learn from experts or become one.
Build your profile and unlock personalized
skill recommendations.

</p>

{/* cards */}

<div
className="
grid
lg:grid-cols-2
gap-10
"
>

{/* LEFT */}

<div
className="
group
relative
overflow-hidden
rounded-[32px]
border
border-indigo-500/20
bg-gradient-to-br
from-indigo-700/80
to-violet-700
p-10
hover:scale-[1.03]
duration-500
"
>

<div
className="
absolute
right-[-60px]
top-[-60px]
h-52
w-52
rounded-full
bg-white/10
"
/>

<div className="relative z-10">

<div
className="
w-16
h-16
rounded-2xl
bg-white/15
flex
items-center
justify-center
mb-8
"
>

<BookOpen
size={28}
/>

</div>

<h3
className="
text-3xl
font-bold
text-white
mb-5
"
>

Join & Build
Your Skills

</h3>

<p
className="
text-indigo-100
leading-8
mb-10
"
>

Connect with learners,
attend sessions,
watch recommendations
and improve continuously.

</p>

<button
className="
flex
items-center
gap-3
rounded-full
bg-white
text-black
px-8
py-4
font-semibold
hover:gap-5
duration-300
"
>

Join Now

<ArrowRight size={18}/>

</button>

</div>

</div>

{/* RIGHT */}

<div
className="
group
relative
overflow-hidden
rounded-[32px]
border
border-yellow-400/20
bg-gradient-to-br
from-yellow-400
to-orange-500
p-10
hover:scale-[1.03]
duration-500
"
>

<div
className="
absolute
left-[-60px]
bottom-[-60px]
h-52
w-52
rounded-full
bg-white/10
"
/>

<div className="relative z-10">

<div
className="
w-16
h-16
rounded-2xl
bg-white/20
flex
items-center
justify-center
mb-8
"
>

<GraduationCap
size={28}
/>

</div>

<h3
className="
text-3xl
font-bold
text-slate-900
mb-5
"
>

Teach &
Earn

</h3>

<p
className="
text-slate-800
leading-8
mb-10
"
>

Become a mentor,
share knowledge,
build reputation
and earn opportunities.

</p>

<button
className="
flex
items-center
gap-3
rounded-full
bg-black
text-white
px-8
py-4
font-semibold
hover:gap-5
duration-300
"
>

Become Teacher

<ArrowRight size={18}/>

</button>

</div>

</div>

</div>

</div>

</div>

</section>

)

}