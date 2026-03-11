/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import appLogo from "../assets/p4i.png";
import mobileLogo from "../assets/p41-mobile.png";
import { ChevronDownIcon, HorizontaLDots } from "../icons";
import { useSidebar } from "../context/SidebarContext";
import {
  BarChart3,
  Bell,
  Building2,
  Calendar,
  Contact2,
  FileText,
  LayoutDashboard,
  ListCheck,
  MapPin,
  ShieldCheck,
  User,
  UserCog,
  Users,
} from "lucide-react";
import { useAppSelector } from "../hooks";
import { usePermissions } from "../hooks/usePermissions";

// ─── Types ────────────────────────────────────────────────────────────────────

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
  permissions?: string[] | "*";
};

// ─── Nav definitions ──────────────────────────────────────────────────────────

const NAV_MAIN: NavItem[] = [
  {
    icon: <LayoutDashboard />,
    name: "Dashboard",
    path: "/dashboard",
    permissions: "*",
  },
  {
    icon: <Building2 />,
    name: "Properties",
    permissions: ["property.view"],
    subItems: [
      { name: "Properties", path: "/property" },
      { name: "Property types", path: "/property-types" },
    ],
  },
  {
    icon: <MapPin />,
    name: "Cities",
    permissions: ["location.view"],
    subItems: [
      { name: "Cities", path: "/cities" },
      { name: "Localities", path: "/localities" },
    ],
  },
  {
    icon: <ListCheck />,
    name: "Amenities",
    path: "/amenities",
    permissions: ["amenity.view"],
  },
  {
    icon: <Contact2 />,
    name: "Leads",
    permissions: ["lead.view"],
    subItems: [
      { name: "All Leads", path: "/crm/leads" },
      { name: "Pipeline (Kanban)", path: "/crm/pipeline" },
    ],
  },
  {
    icon: <Users />,
    name: "Agents",
    path: "/agents",
    permissions: ["agent.view"],
  },
  {
    icon: <Calendar />,
    name: "Calendar",
    path: "/calendar",
    permissions: ["appointment.view"],
  },
  {
    icon: <FileText />,
    name: "CMS",
    permissions: ["cms.view"],
    subItems: [
      { name: "View CMS", path: "/cms" },
      { name: "Add CMS", path: "/cms/create" },
      { name: "Categories", path: "/cms/categories" },
    ],
  },
  {
    icon: <BarChart3 />,
    name: "Analytics",
    permissions: ["analytics.view"],
    subItems: [
      { name: "Properties Analytics", path: "/properties/analytics" },
      { name: "Leads Analytics", path: "/leads/analytics" },
      { name: "Performance Analytics", path: "/performance/analytics" },
    ],
  },
  { icon: <User />, name: "User Profile", path: "/profile", permissions: "*" },
  {
    icon: <ShieldCheck />,
    name: "RBAC",
    path: "/rbac",
    permissions: ["role.view", "permission.view", "role.add", "role.edit"],
  },
];

const NAV_MANAGE: NavItem[] = [
  {
    icon: <UserCog />,
    name: "Manage Users",
    permissions: ["user.view", "user.add", "user.edit"],
    subItems: [
      { path: "/management", name: "Management" },
      { path: "/users", name: "Users" },
    ],
  },
  {
    icon: <Bell />,
    name: "Notifications",
    permissions: "*",
    path: "/notifications",
  },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const AppSidebar: React.FC = () => {
  const navigate = useNavigate();
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const user = useAppSelector((s) => s.auth.user);
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const [hasRedirected, setHasRedirected] = useState(false);
  const { can, canAny, isSuperAdmin } = usePermissions();

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

  // Auth redirect
  useEffect(() => {
    if (hasRedirected) return;
    if (!isAuthenticated && user === null) {
      setHasRedirected(true);
      navigate("/signin", { replace: true });
    }
  }, [user, isAuthenticated, navigate, hasRedirected]);

  // Auto-open submenu on route match
  useEffect(() => {
    let matched = false;
    (["main", "others"] as const).forEach((menuType) => {
      (menuType === "main" ? NAV_MAIN : NAV_MANAGE).forEach((nav, index) => {
        if (nav.subItems?.some((sub) => isActive(sub.path))) {
          setOpenSubmenu({ type: menuType, index });
          matched = true;
        }
      });
    });
    if (!matched) setOpenSubmenu(null);
  }, [location, isActive]);

  // Measure submenu heights
  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") =>
    setOpenSubmenu((prev) =>
      prev?.type === menuType && prev?.index === index
        ? null
        : { type: menuType, index },
    );

  const isItemVisible = (item: NavItem) =>
    !item.permissions ||
    item.permissions === "*" ||
    isSuperAdmin ||
    canAny(item.permissions as string[]);

  const visibleItems = (items: NavItem[]) => items.filter(isItemVisible);

  // Loading guard
  if (user === null && !hasRedirected)
    return (
      <aside className="fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 w-[90px] h-screen border-r border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-center h-20">
          <div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </aside>
    );
  if (user === null) return null;

  const showLabels = isExpanded || isHovered || isMobileOpen;

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-1">
      {visibleItems(items).map((nav, index) => {
        const key = `${menuType}-${index}`;
        const isOpen =
          openSubmenu?.type === menuType && openSubmenu?.index === index;
        const isLeafActive = nav.path ? isActive(nav.path) : false;
        const isChildActive =
          nav.subItems?.some((s) => isActive(s.path)) ?? false;
        const anyActive = isLeafActive || isChildActive;

        return (
          <li key={nav.name}>
            {nav.subItems ? (
              <button
                onClick={() => handleSubmenuToggle(index, menuType)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 group
                  ${
                    anyActive || isOpen
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }
                  ${!showLabels ? "lg:justify-center" : ""}`}
              >
                <span
                  className={`w-5 h-5 flex-shrink-0 ${anyActive || isOpen ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}`}
                >
                  {nav.icon}
                </span>
                {showLabels && (
                  <span className="flex-1 text-left">{nav.name}</span>
                )}
                {showLabels && (
                  <ChevronDownIcon
                    className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-blue-500" : "text-gray-400"}`}
                  />
                )}
              </button>
            ) : (
              nav.path && (
                <Link
                  to={nav.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 group
                    ${isLeafActive ? "bg-blue-600 text-white shadow-sm shadow-blue-200" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}
                    ${!showLabels ? "lg:justify-center" : ""}`}
                >
                  <span
                    className={`w-5 h-5 flex-shrink-0 ${isLeafActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"}`}
                  >
                    {nav.icon}
                  </span>
                  {showLabels && <span>{nav.name}</span>}
                </Link>
              )
            )}

            {/* Submenu */}
            {nav.subItems && showLabels && (
              <div
                ref={(el) => {
                  subMenuRefs.current[key] = el;
                }}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height: isOpen ? `${subMenuHeight[key] || 0}px` : "0px",
                }}
              >
                <ul className="mt-1 ml-8 space-y-0.5 pb-1">
                  {nav.subItems.map((sub) => (
                    <li key={sub.name}>
                      <Link
                        to={sub.path}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150
                          ${
                            isActive(sub.path)
                              ? "bg-blue-100 text-blue-700 font-semibold"
                              : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                          }`}
                      >
                        <span>{sub.name}</span>
                        <span className="flex items-center gap-1">
                          {sub.new && (
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive(sub.path) ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-600"}`}
                            >
                              new
                            </span>
                          )}
                          {sub.pro && (
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive(sub.path) ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}
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
        );
      })}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-100
        ${isExpanded || isMobileOpen ? "w-[260px]" : isHovered ? "w-[260px]" : "w-[72px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Logo ──────────────────────────────────────────────────────────── */}
      <div
        className={`flex items-center h-16 border-b border-gray-100 px-4 flex-shrink-0 ${!showLabels ? "lg:justify-center" : "justify-start"}`}
      >
        <Link to="/dashboard" className="flex items-center gap-2.5 min-w-0">
          {showLabels ? (
            /* Expanded: full p4i logo */
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={appLogo}
                alt="p4i"
                className="h-8 w-auto object-contain flex-shrink-0"
              />
            </div>
          ) : (
            /* Collapsed: just the favicon / icon */
            <img
              src={mobileLogo}
              alt="p4i"
              className="h-8 w-8 object-contain"
            />
          )}
        </Link>
      </div>

      {/* ── Nav ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-3 py-4 no-scrollbar">
        <nav className="flex flex-col gap-6">
          {/* Main */}
          <div>
            <p
              className={`mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 px-3 ${!showLabels ? "lg:hidden" : ""}`}
            >
              Menu
            </p>
            {!showLabels && (
              <div className="flex justify-center mb-2">
                <HorizontaLDots className="w-5 h-5 text-gray-300" />
              </div>
            )}
            {renderMenuItems(NAV_MAIN, "main")}
          </div>

          {/* Others */}
          <div>
            <p
              className={`mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 px-3 ${!showLabels ? "lg:hidden" : ""}`}
            >
              Others
            </p>
            {!showLabels && (
              <div className="flex justify-center mb-2">
                <HorizontaLDots className="w-5 h-5 text-gray-300" />
              </div>
            )}
            {renderMenuItems(NAV_MANAGE, "others")}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
