import VisitorLayout from "../../components/admin/layouts/VisitorLayout";
import EventLayout from "../../components/admin/layouts/EventLayout";
import MusicLayout from "../../components/admin/layouts/MusicLayout";
// import PictureLayout from "../../components/admin/layouts/PictureLayout";
// import PopupLayout from "../../components/admin/layouts/PopupLayout";

export var AdminRoutes = [
  {
    id: 1,
    path: "/dashboard/music",
    name: "Musique",
    icon: "mdi mdi-pencil-circle",
    redirect: false,
    component: MusicLayout,
  },
  // {
  //   id: 2,
  //   path: "/dashboard/picture",
  //   name: "Photo",
  //   icon: "mdi mdi-pencil-circle",
  //   redirect: false,
  //   component: PictureLayout,
  // },
  {
    id: 3,
    path: "/dashboard/event",
    name: "Event",
    icon: "mdi mdi-pencil-circle",
    redirect: false,
    component: EventLayout,
  },
  {
    id: 4,
    path: "/dashboard/visitor",
    name: "Visiteur",
    icon: "mdi mdi-pencil-circle",
    redirect: false,
    component: VisitorLayout,
  },
  // {
  //   id: 5,
  //   path: "/dashboard/pop",
  //   name: "Annonce",
  //   icon: "mdi mdi-pencil-circle",
  //   redirect: false,
  //   component: PopupLayout,
  // },
  {
    id: 6,
    path: "/dashboard",
    pathTo: "/dashboard/music",
    name: "Dashboard",
    redirect: true,
  },
];

export default AdminRoutes;
