import "./css/textScrollingBanner.css";

export interface IAppProps {
  text: String;
}

export function TextScrollingBanner({ text }: IAppProps) {
  return (
    <div className=" w-12/12">
      <div className="marquee-rtl mx-4 ">
        <div className="dark:text-white">{text}</div>
      </div>
    </div>
  );
}
