import axios from "axios"

const API =
"http://localhost:5000"

export const profileService={

async updateProfile(
data:FormData
){

const token=

localStorage.getItem(
"token"
)

const res=

await axios.patch(

"http://localhost:5000/profile/update",

data,

{

headers:{

Authorization:
`Bearer ${token}`

}

}

)

return res.data

},

async requestEmailOtp(

email:string

){

const token=
localStorage.getItem(
"token"
)

return axios.post(

`${API}/profile/change-email`,

{

email

},

{

headers:{

Authorization:
`Bearer ${token}`

}

}

)

}

}