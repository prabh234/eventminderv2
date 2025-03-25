export default async function DynamicTest({ params }:{params:{id:string}}) {
  const {id} = await params;

  return <div>Dynamic ID: {id}</div>;
}
