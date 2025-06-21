import React from 'react';

interface PaginatedTableProps<T> {
  data: T[];
  columns: {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
    className?: string;
  }[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  className?: string;
}

export function PaginatedTable<T>({
  data,
  columns,
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage = 10,
  className = ''
}: PaginatedTableProps<T>) {
  return (
    <div className={`overflow-x-auto rounded-lg border border-border bg-card ${className}`}>
      <table className="min-w-full divide-y divide-border">
        <thead>
          <tr className="bg-muted">
            {columns.map((column, index) => (
              <th
                key={index}
                className={`px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider ${column.className || ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-card divide-y divide-border">
          {data.map((item, rowIndex) => (
            <tr 
              key={rowIndex} 
              className="hover:bg-accent/50 transition-colors duration-200"
            >
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className={`px-6 py-4 whitespace-nowrap text-sm text-card-foreground ${column.className || ''}`}
                >
                  {typeof column.accessor === 'function'
                    ? column.accessor(item)
                    : String(item[column.accessor])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="px-6 py-4 flex items-center justify-between border-t border-border bg-muted/50">
        <div className="text-sm text-muted-foreground">
          Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, data.length)} de {data.length} resultados
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md border border-border bg-background text-foreground 
              hover:bg-accent hover:text-accent-foreground transition-colors duration-200
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-background"
          >
            Anterior
          </button>
          <span className="px-3 py-1 text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md border border-border bg-background text-foreground 
              hover:bg-accent hover:text-accent-foreground transition-colors duration-200
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-background"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
} 