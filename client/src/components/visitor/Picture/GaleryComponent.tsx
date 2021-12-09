type IAppProps = {
  photos: any;
  openPicture: Function;
};


export default function GaleryComponent({ photos, openPicture }: IAppProps) {
  return (
    <div className="flex flex-wrap justify-center items-center">
      {photos.map((photo: any, index: number) => {
        return (
          <div
            onClick={() => {
              openPicture(index);
            }}
          >
            <div className="h-24 w-24 m-1 object-cover" key={photo.uuid}>
              <div className="">
                <img
                  key={photo.uuid}
                  className="h-24 w-24 m-1 object-cover"
                  src={photo.source}
                  alt={photo.uuid ? photo.uuid : "illustration of gallery"}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
