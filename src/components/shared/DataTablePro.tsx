import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
//import Badge from "@/components/ui/badge/Badge";

export interface Column<T> {
  key: Extract<keyof T, string> | "acciones";
  header: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProProps<T> {
  title?: string;
  data: T[];
  columns: Column<T>[];
  searchKeys?: (keyof T)[];
  filterBy?: {
    label: string;
    options: { value: string; label: string }[];
    filterFn: (item: T, filter: string) => boolean;
  };
  extraFilters?: React.ReactNode;
  onExportExcel?: () => void;
  onExportPdf?: () => void;
  itemsPerPage?: number;
}

export default function DataTablePro<T>({
  title,
  data,
  columns,
  searchKeys = [],
  filterBy,
  extraFilters,
  onExportExcel,
  onExportPdf,
  itemsPerPage = 10,
}: DataTableProProps<T>) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("todos");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = [...data];

    if (search.trim() && searchKeys.length) {
      result = result.filter((item) =>
        searchKeys.some((key) =>
          String(item[key] ?? "")
            .toLowerCase()
            .includes(search.toLowerCase())
        )
      );
    }

    if (filterBy && filter !== "todos") {
      result = result.filter((item) => filterBy.filterFn(item, filter));
    }

    return result;
  }, [data, search, filter, filterBy, searchKeys]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="p-6">
      {/* Encabezado */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        {title && <h2 className="text-xl font-bold">{title}</h2>}
        <div className="flex flex-wrap gap-2 items-center">
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md"
          />
          {filterBy && (
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setPage(1);
              }}
              className="border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md"
            >
              <option value="todos">Todos</option>
              {filterBy.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}
          {extraFilters}
          {onExportExcel && (
            <button
              onClick={onExportExcel}
              className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Excel
            </button>
          )}
          {onExportPdf && (
            <button
              onClick={onExportPdf}
              className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              PDF
            </button>
          )}
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-white/[0.05] bg-white dark:bg-white/[0.03]">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={String(col.key)} isHeader>
                  {col.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell isHeader={false} className="text-center py-4 text-gray-500" colSpan={columns.length}>
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((item, i) => (
                <TableRow key={i}>
                  {columns.map((col) => (
                   <TableCell key={String(col.key)}>
                    {col.render
                        ? col.render(item)
                        : String((item as Record<string, unknown>)[col.key] ?? "")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="px-2 py-1 text-sm">{`${page} / ${totalPages}`}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
