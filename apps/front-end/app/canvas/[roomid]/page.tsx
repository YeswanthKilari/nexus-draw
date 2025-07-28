import {  Roomcanvas } from "@/components/Roomcanvas";

export default async function canvaspage({params} :
  {
    params: {
      roomid : string
    }
  }
) {
  const roomId = (await params).roomid;
  console.log(roomId)
  return <div>
    <Roomcanvas roomId={roomId} />
  </div>
    
}