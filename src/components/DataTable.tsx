import React from 'react';

interface Column {
  header: string;
  accessorKey: string;
  cell?: (props: { row: { original: any } }) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  isLoading?: boolean;
}

const DataTable: React.FC<DataTableProps> = ({ columns, data, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-muted rounded-t-lg" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-muted/50 border-b" />
        ))}
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-muted">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-background divide-y divide-border">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className="px-6 py-4 whitespace-nowrap text-sm text-foreground"
                >
                  {column.cell
                    ? column.cell({ row: { original: row } })
                    : row[column.accessorKey]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable; 