import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "@/services/userService";
import ToggleSwitch from "@/components/form/form-elements/ToggleSwitch";
import DropZone from "@/components/form/form-elements/DropZone";

const generarPassword = (dni: string, firstName: string, lastName: string): string => {
  const getInitials = (texto: string) =>
    texto
      .trim()
      .split(" ")
      .map((word) => word[0]?.toUpperCase())
      .join("");

  const iniciales = `${getInitials(firstName)}${getInitials(lastName)}`;
  return `${dni}/${iniciales}`;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function UsuarioForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    dni: "",
    phone: "",
    isActive: true,
    role: "invitado",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (form.dni && form.firstName && form.lastName) {
      const autoPassword = generarPassword(form.dni, form.firstName, form.lastName);
      setForm((prev) => ({ ...prev, password: autoPassword }));
    }
  }, [form.dni, form.firstName, form.lastName]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // limpia errores al escribir
  };

  const handleToggle = (val: boolean) => {
    setForm((prev) => ({ ...prev, isActive: val }));
  };

  const handleFileChange = (files: File[]) => {
    const selected = files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.firstName) newErrors.firstName = "Nombres requeridos";
    if (!form.lastName) newErrors.lastName = "Apellidos requeridos";
    if (!form.username) newErrors.username = "Usuario requerido";
    if (!form.email) newErrors.email = "Correo requerido";
    else if (!emailRegex.test(form.email)) newErrors.email = "Correo inválido";
    if (!form.dni) newErrors.dni = "C.I. requerido";

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("📝 [UsuarioForm] Enviando formulario:", form);
    console.log("📎 [UsuarioForm] Archivo seleccionado:", file);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      console.warn("❌ [UsuarioForm] Errores de validación:", validationErrors);
      setErrors(validationErrors);
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      console.log(`📦 Añadiendo al FormData: ${key} = ${value}`);
      formData.append(key, String(value));
    });

    if (file) {
      formData.append("profileImage", file);
      console.log("📷 Imagen de perfil añadida al FormData");
    }

    try {
      await createUser(formData);
      console.log("✅ [UsuarioForm] Usuario creado con éxito");
      navigate("/usuarios");
    } catch (err) {
      console.error("❌ [UsuarioForm] Error al crear usuario:", err);
    }
  };


  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Crear Usuario</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <input
              name="firstName"
              placeholder="Nombres"
              value={form.firstName}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.firstName ? "border-red-500" : ""}`}
            />
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
          </div>

          <div>
            <input
              name="lastName"
              placeholder="Apellidos"
              value={form.lastName}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.lastName ? "border-red-500" : ""}`}
            />
            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
          </div>

          <div>
            <input
              name="username"
              placeholder="Usuario"
              value={form.username}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.username ? "border-red-500" : ""}`}
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
          </div>

          <div>
            <input
              name="email"
              type="email"
              placeholder="Correo"
              value={form.email}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.email ? "border-red-500" : ""}`}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div>
            <input
              name="dni"
              placeholder="Carnet de Identidad (C.I.)"
              value={form.dni}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.dni ? "border-red-500" : ""}`}
            />
            {errors.dni && <p className="text-red-500 text-sm">{errors.dni}</p>}
          </div>

          <div>
            <input
              name="phone"
              placeholder="Teléfono / Celular"
              value={form.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Rol asignado</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-white dark:bg-gray-800"
          >
            <option value="invitado">Invitado</option>
            <option value="administrador">Administrador</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Contraseña generada</label>
          <input
            name="password"
            type="text"
            value={form.password}
            readOnly
            className="w-full p-2 border rounded bg-gray-100 text-gray-700"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="font-medium text-sm">Estado:</label>
          <ToggleSwitch
            enabled={form.isActive}
            setEnabled={handleToggle}
          />
        </div>

        <div>
          <label className="block font-medium mb-1 text-sm">Foto de perfil</label>
          <DropZone onFilesSelected={handleFileChange} />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-2 w-20 h-20 rounded-full object-cover border"
            />
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Guardar Usuario
        </button>
      </form>
    </div>
  );
}
