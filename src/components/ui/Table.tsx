import React from 'react';

interface Column {
  header: string;
  accessor: string;
  cell?: (value: any, row: any) => React.ReactNode;
}

interface TableProps {
  columns: Column[];
  data: any[];
  keyExtractor: (row: any) => string;
  customActions?: (row: any) => React.ReactNode;
  tableClassName?: string;
  theadClassName?: string;
  thClassName?: string;
  trClassName?: string;
  tdClassName?: string;
}

const Table: React.FC<TableProps> = ({ 
  columns, 
  data, 
  keyExtractor,
  customActions,
  tableClassName,
  theadClassName,
  thClassName,
  trClassName,
  tdClassName
}) => {
  return (
    <div className="overflow-x-auto">
      <table className={tableClassName || "min-w-full divide-y divide-gray-200"}>
        <thead className={theadClassName || "bg-gray-50"}>
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className={thClassName || "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"}
              >
                {column.header}
              </th>
            ))}
            {customActions && (
              <th className={thClassName || "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"}>
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row) => (
            <tr key={keyExtractor(row)} className={trClassName}>
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className={tdClassName || "px-6 py-4 whitespace-nowrap text-sm text-gray-500"}
                >
                  {column.cell ? column.cell(row[column.accessor], row) : row[column.accessor]}
                </td>
              ))}
              {customActions && (
                <td className={tdClassName || "px-6 py-4 whitespace-nowrap text-right text-sm font-medium"}>
                  {customActions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table; 