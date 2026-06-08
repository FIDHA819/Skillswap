import {
Users,
Star,
BookOpen,
Video
}
from "lucide-react"

export default function TeacherStats(){

const cards=[

["Students","230"],

["Sessions","810"],

["Rating","4.9"],

["Skills","18"]

]

return(

<div className="td-stats">

{

cards.map(

([title,val])=>(

<div className="td-stat-card"
key={title}
>

<h4>

{title}

</h4>

<h2>

{val}

</h2>

</div>

)

)

}

</div>

)

}