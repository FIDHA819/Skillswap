type OtpRecord={

otp:string

email:string

expires:number

}

export class EmailOtpStore{

private static store=
new Map<
string,
OtpRecord
>()

static save(

userId:string,

email:string,

otp:string

){

this.store.set(

userId,

{

email,

otp,

expires:

Date.now()

+

5*60*1000

}

)

}

static get(
userId:string
){

return this.store.get(
userId
)

}

static clear(
userId:string
){

this.store.delete(
userId
)

}

}