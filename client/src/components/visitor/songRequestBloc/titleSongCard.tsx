import "./css/songInCurrentCard.css";

export function TitleSongCard(titleIncurent: any) {
  return (
    <div className="flex items-center space-x-4">
      <div id="bars">
        <div className="bar bg-gradient-to-t dark:from-green-400 dark:to-blue-500 to-pink-500 from-yellow-500"></div>
        <div className="bar bg-gradient-to-t dark:from-green-400 dark:to-blue-500 to-pink-500 from-yellow-500"></div>
        <div className="bar bg-gradient-to-t dark:from-green-400 dark:to-blue-500 to-pink-500 from-yellow-500 "></div>
        <div className="bar bg-gradient-to-t dark:from-green-400 dark:to-blue-500 to-pink-500 from-yellow-500"></div>
        <div className="bar bg-gradient-to-t dark:from-green-400 dark:to-blue-500 to-pink-500 from-yellow-500"></div>
        <div className="bar bg-gradient-to-t dark:from-green-400 dark:to-blue-500 to-pink-500 from-yellow-500"></div>
        <div className="bar bg-gradient-to-t dark:from-green-400 dark:to-blue-500 to-pink-500 from-yellow-500"></div>
        <div className="bar bg-gradient-to-t dark:from-green-400 dark:to-blue-500 to-pink-500 from-yellow-500"></div>
        <div className="bar bg-gradient-to-t dark:from-green-400 dark:to-blue-500 to-pink-500 from-yellow-500"></div>
        <div className="bar bg-gradient-to-t dark:from-green-400 dark:to-blue-500 to-pink-500 from-yellow-500"></div>
      </div>
      <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
        {titleIncurent.titleIncurent}
      </h3>
    </div>
  );
}
