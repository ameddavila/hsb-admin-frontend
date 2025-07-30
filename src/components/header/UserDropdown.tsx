import { useState } from "react";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();

    // 🧹 Limpia localStorage (opcional)
    localStorage.clear();

    // 🔁 Redirige al login
    navigate("/signin");
  };

  const fullName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();
  const avatar = user?.profileImage || "/images/user/owner.jpg";

  // console.log("🧑 Usuario:", user);
  // console.log("🧾 Nombre completo:", fullName);
  // console.log("📧 Email:", user?.email);
  // console.log("📞 Teléfono:", user?.phone);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-gray-700 dropdown-toggle dark:text-gray-400"
      >
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
          <img
            src={avatar}
            alt="Usuario"
            className="object-cover w-full h-full"
          />
        </span>
        <span className="block mr-1 font-medium text-theme-sm">
          {user?.username ?? "Usuario"}
        </span>
        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <div>
          {fullName && (
            <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
              {fullName}
            </span>
          )}
          <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
            {user?.email}
          </span>
          {user?.phone && (
            <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
              📞 {user.phone}
            </span>
          )}
        </div>

        <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
          <li>
            <DropdownItem
              onItemClick={() => setIsOpen(false)}
              tag="a"
              to="/perfil"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 dark:hover:bg-white/5"
            >
              <i className="fas fa-user-cog w-5 text-gray-500"></i>
              Editar perfil
            </DropdownItem>
          </li>
        </ul>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 dark:hover:bg-white/5 w-full text-left"
        >
          <i className="fas fa-sign-out-alt w-5 text-gray-500"></i>
          Cerrar sesión
        </button>
      </Dropdown>
    </div>
  );
}
