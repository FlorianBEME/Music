import "./css/textScrollingBanner.css";

export interface IAppProps {
  text: String;
}

export function TextScrollingBanner({ text }: IAppProps) {
  return (
    <div className="flex justify-center items-center">
      <div className="marquee-rtl mx-4 md:w-11/12">
        <div className="dark:text-white">{text}</div>
      </div>
    </div>
  );
}
