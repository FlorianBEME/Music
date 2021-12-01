import { useState } from "react";
import MenuPicture from "../Picture/MenuPicture";
import Gallery from "../Picture/Gallery";


function WallPicture() {
  const [component, setComponent] = useState("menu");

  const componentRender = () => {
    if (component === "menu") {
      return <MenuPicture changeComponent={changeComponent} />;
    } else if (component === "gallery") {
      return <Gallery changeComponent={changeComponent} />;
    }
  };
  const changeComponent = (component: any) => {
    setComponent(component);
  };
  return <div>{componentRender()}</div>;
}

export default WallPicture;
