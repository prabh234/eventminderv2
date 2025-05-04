import FaceAndQrRecognizer from "@/components/assets/faceandqr";


export default function Start({params}:{params:{event:string}}) {
  return (
    <main className="p-10 flex flex-1 gap-5">
        <h1 className="text-4xl">{params.event}</h1>
        <FaceAndQrRecognizer eventid={params.event}/>
    </main>
  )
}
