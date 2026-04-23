export default function CategoriesGrid(){

return(

<div>

<h2 className="text-xl font-semibold">

Browse Categories

</h2>

<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">

{["React","Photoshop","Excel","Marketing"]
.map(skill=>(
<div className="p-4 shadow rounded-xl">
{skill}
</div>
))}

</div>

</div>

)

}