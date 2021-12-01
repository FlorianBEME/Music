type props={
    changeComponent : Function
}

export default function Gallery({changeComponent}:props) {
  return (
    <div>
      <button onClick={()=>changeComponent("menu")} className="bg-red-600">back</button>
    </div>
  );
}
