import { IconAperture, IconBallFootball, IconLayoutDashboard, IconMoodHappy, IconSoccerField, IconTableShare, IconTournament, IconUserPlus, } from "@tabler/icons-react";
import { uniqueId } from "lodash";

const Menuitems = [
  {
    navlabel: true,
    subheader: "Home",
  },

  {
    id: uniqueId(),
    title: "Overview",
    icon: IconLayoutDashboard,
    href: "/",
  },
  {
    navlabel: true,
    subheader: "Predictions",
  },
  {
    id: uniqueId(),
    title: "Matches",
    icon: IconBallFootball,
    href: "/matches",
  },
  {
    id: uniqueId(),
    title: "Group stage",
    icon: IconTableShare,
    href: "/group",
  },
  {
    id: uniqueId(),
    title: "Knockout stage",
    icon: IconTournament,
    href: "/knockout",
  },
  {
    navlabel: true,
    subheader: "Extra",
  },
  {
    id: uniqueId(),
    title: "Custom Match",
    icon: IconSoccerField,
    href: "/custom",
  },
  {
    id: uniqueId(),
    title: "Icons",
    icon: IconMoodHappy,
    href: "/icons",
  },
  {
    id: uniqueId(),
    title: "Sample Page",
    icon: IconAperture,
    href: "/sample-page",
  },
];

export default Menuitems;
