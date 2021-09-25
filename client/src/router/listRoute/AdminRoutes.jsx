import MusicLayout from "../../components/admin/MusicLayout";
import EventLayout from "../../components/admin/EventLayout";
import PictureLayout from "../../components/admin/PictureLayout";
import VisitorLayout from "../../components/admin/VisitorLayout";

export var AdminRoutes = [
  {
    id: 1,
    path: "/dashboard/music",
    name: "Musique",
    icon: "mdi mdi-pencil-circle",
    redirect: false,
    component: MusicLayout,
  },
  {
    id: 2,
    path: "/dashboard/picture",
    name: "Photo",
    icon: "mdi mdi-pencil-circle",
    redirect: false,
    component: PictureLayout,
  },
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
  {
    id: 4,
    path: "/dashboard",
    pathTo: "/dashboard/music",
    name: "Dashboard",
    redirect: true,
  },
];

export default AdminRoutes;
