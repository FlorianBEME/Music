type PropsFooter = {
  footerItem: [{}];
  footerCopyright: String;
};
export default function Footer({ footerItem, footerCopyright }: PropsFooter) {
  return (
    <footer className="bg-white dark:bg-gray-700">
      {footerItem !== undefined ? (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            {footerItem.map((item: any) => (
              <a
                target="_blank"
                rel="noreferrer"
                key={item.name}
                href={item.path_to}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">{item.name}</span>
                <img src={item.filePath} className="h-6 w-6" alt={item.name} />
                {/* <item.icon className="h-6 w-6" aria-hidden="true" /> */}
              </a>
            ))}
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base text-gray-400">
              {footerCopyright.length > 0 ? footerCopyright : "Copyright"}
            </p>
          </div>
        </div>
      ) : null}
    </footer>
  );
}
