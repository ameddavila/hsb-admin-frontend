import { useState } from "react";
import { createUser } from "@/services/userService";
import { useNavigate } from "react-router-dom";

export default function UsuarioForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    dni: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) =>
      formData.append(key, value)
    );
    if (file) {
      formData.append("profileImage", file);
    }
    try {
      await createUser(formData);
      navigate("/usuarios");
    } catch (err) {
      console.error("❌ Error al crear usuario:", err);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Crear Usuario</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="username"
          placeholder="Usuario"
          value={form.username}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          name="email"
          type="email"
          placeholder="Correo"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          name="firstName"
          placeholder="Nombre"
          value={form.firstName}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="lastName"
          placeholder="Apellido"
          value={form.lastName}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="dni"
          placeholder="DNI"
          value={form.dni}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input type="file" onChange={handleFileChange} />
        {preview && <img src={preview} className="w-20 h-20 rounded-full" />}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Guardar
        </button>
      </form>
    </div>
  );
}
