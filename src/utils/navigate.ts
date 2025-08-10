// src/utils/navigate.ts

let navigator: ((path: string) => void) | null = null;

/**
 * Asigna el callback de navegación que debe venir de `useNavigate()`.
 * Se debe llamar una vez, idealmente al montar la app.
 */
export const setNavigator = (navFn: (path: string) => void): void => {
  navigator = navFn;
};

/**
 * Navega a una ruta si el `navigator` fue definido.
 * Lanza advertencia si se intenta navegar sin haber llamado `setNavigator`.
 */
export const navigate = (path: string): void => {
  if (navigator) {
    navigator(path);
  } else {
    if (import.meta.env.DEV) {
      console.warn(
        `⚠️ [navigate] Intento de navegación a "${path}" sin haber definido el navegador. Asegúrate de llamar a setNavigator(...) al inicio.`
      );
    }
  }
};
