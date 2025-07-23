import { Canvas } from "@/components/Canvas";

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
    <Canvas roomId={roomId} />
  </div>
    
}