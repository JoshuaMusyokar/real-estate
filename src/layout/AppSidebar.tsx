/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import appLogo from "../assets/logomin.png";
import mobileLogo from "../assets/favicon.png";

// Assume these icons are imported from an icon library
import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import SidebarWidget from "./SidebarWidget";
import {
  BarChart2,
  BarChart3,
  Bell,
  Briefcase,
  Building2,
  Calendar,
  Contact2,
  Factory,
  FileText,
  LayoutDashboard,
  ListCheck,
  Map,
  MapPin,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  TowerControl,
  User,
  UserCog,
  Users,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useAppSelector } from "../hooks";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
  roles?: string[];
};

const navItems: NavItem[] = [
  // ----------------------------
  // PRIMARY SECTION
  // ----------------------------
  {
    icon: <LayoutDashboard />,
    name: "Dashboard",
    path: "/dashboard",
    roles: ["*"],
  },

  // ----------------------------
  // PROPERTY MANAGEMENT
  // ----------------------------
  {
    icon: <Building2 />,
    name: "Properties",
    subItems: [
      { name: "Properties", path: "/property" },
      { name: "Property types", path: "/property-types" },
    ],
    roles: ["*"],
  },
  {
    icon: <MapPin />,
    name: "Cities",
    roles: ["ADMIN", "SUPER_ADMIN"],
    subItems: [
      { name: "Cities", path: "/cities" },
      { name: "Localities", path: "/localities" },
    ],
  },
  // {
  //   icon: <Factory />,
  //   name: "Property types",
  //   path: "/property-types",
  //   roles: ["ADMIN", "SUPER_ADMIN"],
  // },
  // {
  //   icon: <Map />,
  //   name: "Localities",
  //   path: "/localities",
  //   roles: ["ADMIN", "SUPER_ADMIN"],
  // },
  {
    icon: <ListCheck />,
    name: "Amenities",
    path: "/amenities",
    roles: ["*"],
  },

  // ----------------------------
  // LEADS / CRM
  // ----------------------------
  {
    icon: <Contact2 />,
    name: "Leads",
    subItems: [
      { name: "All Leads", path: "/crm/leads" },
      { name: "Pipeline (Kanban)", path: "/crm/pipeline" },
    ],
    roles: ["*"],
  },
  {
    icon: <Users />,
    name: "Agents",
    path: "/agents",
    roles: ["ADMIN", "SUPER_ADMIN"],
  },

  // ----------------------------
  // PRODUCTIVITY & ANALYTICS
  // ----------------------------
  {
    icon: <Calendar />,
    name: "Calendar",
    path: "/calendar",
    roles: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    icon: <FileText />,
    name: "CMS",
    subItems: [
      { name: "View cms", path: "/cms" },
      { name: "Add cms", path: "/cms/create" },
      { name: "Categories", path: "/cms/categories" },
    ],
    roles: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    icon: <BarChart3 />,
    name: "Analytics",
    roles: ["ADMIN", "SUPER_ADMIN", "SALES_MANAGER"],
    subItems: [
      { name: "Properties Analytics", path: "/properties/analytics" },
      { name: "Leads Analytics", path: "/leads/analytics" },
      { name: "Performance Analytics", path: "/performance/analytics" },
      // { name: "Revenue Analytics", path: "/revenue/analytics" },
    ],
  },

  // ----------------------------
  // PROFILE
  // ----------------------------
  {
    icon: <User />,
    name: "User Profile",
    path: "/profile",
    roles: ["*"],
  },

  // ----------------------------
  // SYSTEM / SECURITY
  // ----------------------------
  {
    icon: <ShieldCheck />,
    name: "RBAC",
    path: "/rbac",
    roles: ["ADMIN", "SUPER_ADMIN"],
  },
];

const manage: NavItem[] = [
  {
    icon: <UserCog />,
    name: "Manage Users",
    roles: ["ADMIN", "SUPER_ADMIN"],
    subItems: [{ name: "Users", path: "/users" }],
  },
  {
    icon: <Bell />,
    name: "Notifications",
    roles: ["*"],
    path: "/notifications",
  },
  // {
  //   icon: <Settings2 />,
  //   name: "Settings",
  //   roles: ["ADMIN", "SUPER_ADMIN"],
  //   subItems: [{ name: "Landing Page", path: "/landing" }],
  // },
];

const AppSidebar: React.FC = () => {
  const navigate = useNavigate();
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [hasRedirected, setHasRedirected] = useState(false);

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {},
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname],
  );

  // Debug effect - remove this in production
  useEffect(() => {
    console.log("Auth state in sidebar:", { user, isAuthenticated });
  }, [user, isAuthenticated]);

  // Handle redirect only once when auth state is confirmed
  useEffect(() => {
    // If we've already redirected, don't do anything
    if (hasRedirected) return;

    // Only redirect if we're definitely not authenticated and not loading
    if (!isAuthenticated && user === null) {
      console.log("No user found, redirecting to signin");
      setHasRedirected(true);
      navigate("/signin", { replace: true });
    }
  }, [user, isAuthenticated, navigate, hasRedirected]);

  // Your existing submenu effects...
  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : manage;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const filterNavItemsByRole = (
    items: NavItem[],
    userRole: string,
  ): NavItem[] => {
    return items.filter((item) => {
      if (!item.roles || item.roles.includes("*")) {
        return true;
      }
      return item.roles.includes(userRole);
    });
  };

  // Show loading state while auth is being determined
  if (user === null && !hasRedirected) {
    return (
      <aside className="fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 w-[90px] h-screen border-r border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-center h-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
        </div>
      </aside>
    );
  }

  // Don't render if we're redirecting
  if (user === null) {
    return null;
  }

  // Rest of your component remains the same...
  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={`menu-item-icon-size  ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
              ? "w-[290px]"
              : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-0 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/dashboard" className="flex items-center gap-2">
          {isExpanded || isHovered || isMobileOpen ? (
            <img src={appLogo} alt="Property4India" className="h-42 w-58 object-contain" />
          ) : (
            <img src={mobileLogo} alt="P4I" className="h-8" />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {user.roleId &&
                renderMenuItems(
                  filterNavItemsByRole(navItems, user.role.name),
                  "main",
                )}
            </div>
            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Others"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {user.roleId &&
                renderMenuItems(
                  filterNavItemsByRole(manage, user.role.name),
                  "others",
                )}
            </div>
          </div>
        </nav>
        {/* {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null} */}
      </div>
    </aside>
  );
};

export default AppSidebar;
