export class SwapRequest {

constructor(
public id: string,
public senderId: string,
public receiverId: string,
public skillRequested: string,
public status: "pending" | "accepted" | "rejected"
){}

}