import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { createUser, getUserById, updateUser } from "@/services/userService";
import { getAllRoles } from "@/services/roleService";
import ToggleSwitch from "@/components/form/form-elements/ToggleSwitch";
import DropZone from "@/components/form/form-elements/DropZone";
import type { Role } from "@/types/Role";
import type { UserFormData } from "@/types/UserFormData";

const generarPassword = (dni: string, firstName: string, lastName: string): string => {
  const getInitials = (txt: string) =>
    txt.trim().split(" ").map((w) => w[0]?.toUpperCase()).join("");
  return `${dni}/${getInitials(firstName)}${getInitials(lastName)}`;
};

export default function UsuarioForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [form, setForm] = useState<UserFormData>({
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

  const [roles, setRoles] = useState<Role[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof UserFormData, string>>>({});

  // Generar contraseña automáticamente
  useEffect(() => {
    if (!isEditMode && form.dni && form.firstName && form.lastName) {
      const autoPass = generarPassword(form.dni, form.firstName, form.lastName);
      setForm((prev) => ({ ...prev, password: autoPass }));
    }
  }, [form.dni, form.firstName, form.lastName, isEditMode]);

  // Cargar roles y usuario
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await getAllRoles();
        setRoles(data);
      } catch {
        toast.error("Error al cargar roles");
      }
    };

    const fetchUser = async () => {
      try {
        if (isEditMode && id) {
          const user = await getUserById(id);
          setForm({
            username: user.username ?? "",
            email: user.email ?? "",
            password: "",
            firstName: user.firstName ?? "",
            lastName: user.lastName ?? "",
            dni: user.dni ?? "",
            phone: user.phone ?? "",
            isActive: user.isActive ?? true,
            role: user.roles?.[0]?.name ?? "invitado",
          });
          if (user.profileImage) {
            setPreview(user.profileImage);
          }
        }
      } catch {
        toast.error("Error al cargar usuario");
      }
    };

    fetchRoles();
    if (isEditMode) fetchUser();
  }, [id, isEditMode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleToggle = (value: boolean) => {
    setForm((prev) => ({ ...prev, isActive: value }));
  };

  const handleFileChange = (files: File[]) => {
    const selected = files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof UserFormData, string>> = {};
    if (!form.firstName) newErrors.firstName = "Nombres requeridos";
    if (!form.lastName) newErrors.lastName = "Apellidos requeridos";
    if (!form.username) newErrors.username = "Usuario requerido";
    if (!form.email) newErrors.email = "Correo requerido";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Correo inválido";
    if (!form.dni) newErrors.dni = "C.I. requerido";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => {
      if (key === "isActive") {
        formData.append("isActive", val ? "true" : "false");
      } else {
        formData.append(key, String(val ?? ""));
      }
    });

    if (file) {
      formData.append("profileImage", file);
    }

    try {
      if (isEditMode && id) {
        await updateUser(id, formData);
        toast.success("Usuario actualizado");
      } else {
        await createUser(formData);
        toast.success("Usuario creado");
      }
      navigate("/usuarios");
    } catch (err) {
      toast.error("Error al guardar usuario");
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? "Editar Usuario" : "Crear Usuario"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          {([
            ["firstName", "Nombres"],
            ["lastName", "Apellidos"],
            ["username", "Usuario"],
            ["email", "Correo"],
            ["dni", "C.I."],
            ["phone", "Teléfono"],
          ] as [keyof UserFormData, string][]).map(([field, label]) => (
            <div key={field}>
             <input
                name={field}
                type={field === "email" ? "email" : "text"}
                placeholder={label}
                value={String(form[field] ?? "")} // ✅ Esta línea soluciona el error
                onChange={handleChange}
                className={`w-full p-2 border rounded ${errors[field] ? "border-red-500" : ""}`}
              />

              {errors[field] && (
                <p className="text-red-500 text-sm">{errors[field]}</p>
              )}
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Rol asignado</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            {roles.map((r) => (
              <option key={r.id} value={r.name}>
                {r.name.charAt(0).toUpperCase() + r.name.slice(1)}
              </option>
            ))}
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
          <ToggleSwitch enabled={form.isActive} setEnabled={handleToggle} />
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
          {isEditMode ? "Actualizar Usuario" : "Guardar Usuario"}
        </button>
      </form>
    </div>
  );
}
