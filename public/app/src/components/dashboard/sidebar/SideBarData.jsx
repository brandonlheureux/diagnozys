import React from "react";
import { RiDashboardLine, RiMicroscopeLine } from "react-icons/ri";
import { AiOutlineProfile } from "react-icons/ai";
import { GrDocumentText } from "react-icons/gr";

export const SideBarData = [
  {
    title: "Home",
    path: "/dashboard",
    icon: <RiDashboardLine />,
    subNav: false,
  },
  {
    title: "Diagnosis",
    path: "/dashboard/diagnosis",
    icon: <RiMicroscopeLine />,
    subNav: [
      {
        title: "Skin lesions",
        path: "/skin-lesions",
        subNav: [
          { title: "New", path: "/new" },
          { title: "Current request", path: "/current" },
          { title: "Results", path: "/reports" },
        ],
      },
    ],
  },
  {
    title: "Medical Reports",
    path: "/dashboard/medical-reports",
    icon: <GrDocumentText />,
    subNav: [
      {
        title: "New",
        path: "/new",
      },
      {
        title: "Latest",
        path: "/latest",
      },
      {
        title: "Reports",
        path: "/reports",
      },
    ],
  },
  {
    title: "Profile",
    path: "/dashboard/profile",
    icon: <AiOutlineProfile />,
    subNav: false,
  },
];
