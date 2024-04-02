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
    href: "/utilities/typography",
  },
  {
    id: uniqueId(),
    title: "Group stage",
    icon: IconTableShare,
    href: "/utilities/shadow",
  },
  {
    id: uniqueId(),
    title: "Knockout stage",
    icon: IconTournament,
    href: "/utilities/shadow",
  },
  {
    navlabel: true,
    subheader: "Extra",
  },
  {
    id: uniqueId(),
    title: "Custom Match",
    icon: IconSoccerField,
    href: "/authentication/login",
  },
  {
    id: uniqueId(),
    title: "Register",
    icon: IconUserPlus,
    href: "/authentication/register",
  },
  {
    navlabel: true,
    subheader: "Extra",
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
