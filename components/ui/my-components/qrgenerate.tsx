import QrCode from "react-qr-code"
export default function QrGenerate({
  id,
  className,
  size
  }:{
    id:string,
    className?:string,
    size?:number
    }) {
  return (
    <div className={`${className}`}>
        <QrCode
            value={id}
            size={size || 256}
            bgColor="#ffffff"
            fgColor="#000000"
        />
    </div>
  )
}
