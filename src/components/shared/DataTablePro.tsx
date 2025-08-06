import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useIsMobile } from "@/hooks/useIsMobile";

export interface Column<T> {
  key: Extract<keyof T, string> | "acciones";
  header: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProProps<T> {
  title?: string;
  data: T[];
  columns: Column<T>[];
  cardRender?: (item: T) => React.ReactNode;
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
  cardRender,
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

  const isMobile = useIsMobile(640);

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
    <div className="p-4 sm:p-6">
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
            className="border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md text-sm"
          />
          {filterBy && (
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setPage(1);
              }}
              className="border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md text-sm"
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
              className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
            >
              Excel
            </button>
          )}
          {onExportPdf && (
            <button
              onClick={onExportPdf}
              className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
            >
              PDF
            </button>
          )}
        </div>
      </div>

      {/* Tabla o tarjetas */}
      {isMobile && cardRender ? (
        <div className="flex flex-col gap-4">
          {paginated.map((item, i) => (
            <div
              key={i}
              className="rounded-lg border border-gray-200 p-4 shadow-sm bg-white dark:bg-gray-800"
            >
              {cardRender(item)}
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-white/[0.05] bg-white dark:bg-white/[0.03]">
          <Table className="min-w-[800px] text-sm">
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-800">
                {columns.map((col) => (
                  <TableCell
                    key={String(col.key)}
                    isHeader
                    className="px-4 py-2 font-semibold text-gray-700 whitespace-nowrap"
                  >
                    {col.header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell
                    isHeader={false}
                    colSpan={columns.length}
                    className="text-center py-4 text-gray-500"
                  >
                    No se encontraron resultados.
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((item, i) => (
                  <TableRow
                    key={i}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    {columns.map((col) => (
                      <TableCell
                        key={String(col.key)}
                        className="px-4 py-2 whitespace-nowrap"
                      >
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
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded text-sm disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="px-2 py-1 text-sm">{`${page} / ${totalPages}`}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded text-sm disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
