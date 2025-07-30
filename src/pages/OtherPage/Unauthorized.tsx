export default function Unauthorized() {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold text-red-600">⛔ Acceso no autorizado</h1>
      <p className="mt-2 text-gray-600">No tienes permisos para ver esta página.</p>
    </div>
  );
}
