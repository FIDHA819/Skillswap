export default function TopTeachers(){

const teachers=[1,2,3]

return(

<section className="max-w-7xl mx-auto px-8">

<h2 className="text-center text-4xl font-bold">

Top Rated Teachers

</h2>

<div className="grid grid-cols-3 gap-8 mt-12">

{

teachers.map((x)=>(

<div
key={x}
className="
bg-white
rounded-3xl
shadow-xl
p-8
text-center
"
>

<img
src="/assets/user.png"
className="
w-28
h-28
mx-auto
rounded-full
"
/>

<h3 className="mt-5">

Teacher {x}

</h3>

<p>UI/UX • Figma</p>

</div>

))

}

</div>

</section>

)

}