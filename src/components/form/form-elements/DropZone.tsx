import { useDropzone } from "react-dropzone";

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
}

export default function DropZone({ onFilesSelected }: DropZoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onFilesSelected,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/webp": [],
      "image/svg+xml": [],
    },
  });

  return (
    <div className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-brand-500">
      <div
        {...getRootProps()}
        className={`dropzone rounded-xl border-dashed p-7 lg:p-10 ${
          isDragActive
            ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
            : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 h-[68px] w-[68px] rounded-full bg-gray-200 flex items-center justify-center dark:bg-gray-800">
            📁
          </div>
          <h4 className="font-semibold text-gray-800 dark:text-white">
            {isDragActive ? "Suelta el archivo aquí" : "Arrastra y suelta aquí"}
          </h4>
          <span className="text-sm text-gray-500">
            PNG, JPG, WebP, SVG o selecciona archivo
          </span>
          <span className="mt-1 underline text-sm text-blue-600">
            Buscar archivo
          </span>
        </div>
      </div>
    </div>
  );
}
