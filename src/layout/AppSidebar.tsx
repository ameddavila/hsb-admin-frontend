import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import { useMenuStore } from "@/store/menuStore";
import type { MenuNode } from "@/types/Menu";

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const menus = useMenuStore((state) => state.menus);

  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const submenuRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [subMenuHeight, setSubMenuHeight] = useState<Record<number, number>>({});

  const isActive = (path?: string) => location.pathname === path;

  // 👉 Abre automáticamente el menú padre si el submenú está activo
  useEffect(() => {
    menus.forEach((menu) => {
      if (menu.children?.some((child) => isActive(child.path))) {
        setOpenMenuId(menu.id);
      }
    });
  }, [location.pathname, menus]);

  // 📏 Calcula la altura del submenú dinámicamente
  useEffect(() => {
    if (openMenuId && submenuRefs.current[openMenuId]) {
      setSubMenuHeight((prev) => ({
        ...prev,
        [openMenuId]: submenuRefs.current[openMenuId]?.scrollHeight || 0,
      }));
    }
  }, [openMenuId]);

  // 📂 Agrupa menús por `menu.group` (ej. ADMINISTRACION, RRHH)
  const groupedMenus = menus.reduce<Record<string, MenuNode[]>>((acc, menu) => {
    const group = menu.group || "Otros";
    if (!acc[group]) acc[group] = [];
    acc[group].push(menu);
    return acc;
  }, {});

  return (
    <aside
      className={`fixed top-0 left-0 h-screen px-5 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-800 z-50 transition-all duration-300
        ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 🚀 Logo */}
      <div className={`py-6 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img src="/images/logo/logo.svg" alt="Logo" className="dark:hidden" width={150} />
              <img src="/images/logo/logo-dark.svg" alt="Logo" className="hidden dark:block" width={150} />
            </>
          ) : (
            <img src="/images/logo/logo-icon.svg" alt="Logo" width={32} />
          )}
        </Link>
      </div>

      {/* 📋 Menú */}
      <div className="flex flex-col overflow-y-auto no-scrollbar">
        <nav className="mb-6">
          <h2 className={`mb-4 text-xs uppercase text-gray-400 tracking-wider ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
            {isExpanded || isHovered || isMobileOpen ? "MENÚ" : ""}
          </h2>

          {/* 🔁 Recorre cada grupo de menús */}
          {Object.entries(groupedMenus).map(([group, items]) => (
            <div key={group} className="mb-6">
              <ul className="flex flex-col gap-2">
                {items.map((menu) => (
                  <li key={menu.id}>
                    {/* 🔽 Menú con submenús */}
                    {menu.children?.length ? (
                      <>
                        <button
                          onClick={() => setOpenMenuId((prev) => (prev === menu.id ? null : menu.id))}
                          className={`menu-item group cursor-pointer ${
                            openMenuId === menu.id ? "menu-item-active" : "menu-item-inactive"
                          } ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"}`}
                        >
                          <span className="menu-item-icon-size">
                            <i className={menu.icon}></i>
                          </span>
                          {(isExpanded || isHovered || isMobileOpen) && (
                            <span className="menu-item-text">{menu.name}</span>
                          )}
                          {/* Flecha de desplegar */}
                          {(isExpanded || isHovered || isMobileOpen) && (
                            <svg
                              className={`ml-auto w-4 h-4 transform transition-transform ${
                                openMenuId === menu.id ? "rotate-180 text-blue-600" : ""
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          )}
                        </button>

                        {/* Submenús animados */}
                        <div
                          ref={(el) => {
                            submenuRefs.current[menu.id] = el;
                          }}
                          className="overflow-hidden transition-all duration-300"
                          style={{
                            height: openMenuId === menu.id ? `${subMenuHeight[menu.id]}px` : "0px",
                          }}
                        >
                          <ul className="mt-2 space-y-1 ml-9">
                            {menu.children.map((subItem) => (
                              <li key={subItem.id}>
                                <Link
                                  to={subItem.path}
                                  className={`menu-dropdown-item ${
                                    isActive(subItem.path)
                                      ? "menu-dropdown-item-active"
                                      : "menu-dropdown-item-inactive"
                                  }`}
                                >
                                  <i className={`${subItem.icon} mr-2`}></i>
                                  {subItem.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    ) : (
                      // 🔹 Menú simple sin hijos
                      <Link
                        to={menu.path!}
                        className={`menu-item group ${
                          isActive(menu.path) ? "menu-item-active" : "menu-item-inactive"
                        } ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"}`}
                      >
                        <span className="menu-item-icon-size">
                          <i className={menu.icon}></i>
                        </span>
                        {(isExpanded || isHovered || isMobileOpen) && (
                          <span className="menu-item-text">{menu.name}</span>
                        )}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;

