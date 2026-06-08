import {
useState
}
from "react"

import {
useNavigate,
useLocation
}
from "react-router-dom"

import axios from "axios"

import {
Mail,
ShieldCheck,
ArrowLeft,
Sparkles
}
from "lucide-react"

import {
toast
}
from "react-toastify"
import { userService } from "../../../services/userService"

export default function VerifyEmailPage(){

const navigate=
useNavigate()

const location=
useLocation()

const email=

location.state
?.newEmail

||

location.state
?.email

||

""

const [

otp,

setOtp

]=useState("")

const [

loading,

setLoading

]=useState(false)

const [

error,

setError

]=useState("")

const verify=
async()=>{

try{

setLoading(true)

setError("")

await axios.post(

"http://localhost:5000/profile/verify-email",

{

email,

otp

},

{

headers:{

Authorization:

`Bearer ${
localStorage.getItem(
"token"
)

}`

}

}

)

/*
REMOVE ALERT
*/
await userService.getProfile()

toast.success(
"Email changed ✨"
)

setTimeout(()=>{

window.location.href=
"/profile"

},1200)

}

catch(err:any){

const msg=

err.response
?.data
?.message

||

"Invalid verification code"

setError(msg)

toast.error(msg)

}

finally{

setLoading(false)

}

}

return(

<div className="verify-root">

<div className="blur"/>

<div className="verify-card">

<button

className="back"

onClick={()=>

navigate(-1)

}

>

<ArrowLeft size={18}/>

</button>

<div className="icon-wrap">

<div className="mail-circle">

<Mail size={32}/>

</div>

<Sparkles
size={18}
className="spark"
/>

</div>

<h1>

Verify Email

</h1>

<p>

We've sent a verification code to

</p>

<h4>

{email}

</h4>

<input

maxLength={6}

value={otp}

onChange={(e)=>

setOtp(

e.target.value

)

}

placeholder="Enter 6 digit OTP"

/>

{

error && (

<div className="error">

{error}

</div>

)

}

<button

className="verify-btn"

onClick={verify}

disabled={loading}

>

{

loading

?

"Verifying..."

:

<>

<ShieldCheck
size={18}
/>

Verify Email

</>

}

</button>

<div className="footer">

Didn't receive?

<span>

Resend Code

</span>

</div>

</div>

<style>

{`

*{

box-sizing:border-box;

}

.verify-root{

min-height:100vh;

display:flex;

justify-content:center;

align-items:center;

background:

radial-gradient(
circle at top,
#16275d,
#030712
);

overflow:hidden;

position:relative;

}

.blur{

position:absolute;

width:500px;

height:500px;

border-radius:50%;

background:

rgba(
99,
102,
241,
0.18
);

filter:blur(140px);

}

.verify-card{

position:relative;

width:470px;

padding:55px;

border-radius:34px;

background:

rgba(
17,
24,
39,
0.72
);

backdrop-filter:

blur(30px);

border:

1px solid rgba(
255,
255,
255,
0.08
);

text-align:center;

color:white;

box-shadow:

0 0 80px rgba(
99,
102,
241,
0.18
);

}

.back{

position:absolute;

left:25px;

top:25px;

background:none;

border:none;

color:#94a3b8;

cursor:pointer;

}

.icon-wrap{

position:relative;

display:flex;

justify-content:center;

margin-bottom:22px;

}

.mail-circle{

width:90px;

height:90px;

border-radius:50%;

background:

linear-gradient(
135deg,
#2563eb,
#7c3aed
);

display:flex;

justify-content:center;

align-items:center;

}

.spark{

position:absolute;

right:120px;

top:-4px;

color:#60a5fa;

}

.verify-card h1{

font-size:34px;

margin-bottom:12px;

}

.verify-card p{

color:#94a3b8;

margin:0;

}

.verify-card h4{

margin-top:10px;

font-size:18px;

color:#60a5fa;

}

.verify-card input{

width:100%;

margin-top:35px;

padding:18px;

font-size:20px;

text-align:center;

letter-spacing:6px;

border-radius:18px;

background:

rgba(
255,
255,
255,
0.05
);

border:

1px solid rgba(
255,
255,
255,
0.08
);

color:white;

outline:none;

}

.verify-btn{

margin-top:25px;

width:100%;

padding:18px;

border:none;

border-radius:18px;

background:

linear-gradient(
90deg,
#2563eb,
#6366f1
);

color:white;

font-weight:700;

cursor:pointer;

display:flex;

justify-content:center;

gap:10px;

transition:.3s;

}

.verify-btn:hover{

transform:

translateY(-2px);

}

.error{

margin-top:15px;

color:#ef4444;

}

.footer{

margin-top:26px;

color:#94a3b8;

}

.footer span{

margin-left:6px;

color:#60a5fa;

cursor:pointer;

}

`}

</style>

</div>

)

}