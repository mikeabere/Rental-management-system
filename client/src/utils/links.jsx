import React from "react";

import { IoBarChartSharp } from "react-icons/io5";
import { MdQueryStats } from "react-icons/md";
import { FaWpforms } from "react-icons/fa";
import { ImProfile } from "react-icons/im";
import { MdAdminPanelSettings } from "react-icons/md";

const links = [
  { text: "stats", path: ".", icon: <FaWpforms /> },
  { text: "units", path: "units", icon: <MdQueryStats /> },
  { text: "tenants", path: "tenants", icon: <IoBarChartSharp /> },
  { text: "profile", path: "profile", icon: <ImProfile /> }, //profile
  { text: "admin", path: "admin", icon: <MdAdminPanelSettings /> }, //admin
  { text: "reports", path: "reports", icon: <MdAdminPanelSettings /> },
  { text: "messaging", path: "messaging", icon: <MdAdminPanelSettings /> }, 
  { text: "statement", path: "statement", icon: <MdAdminPanelSettings /> }, 
];

export default links;
