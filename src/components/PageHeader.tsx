import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="min-w-0 flex-1">
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children && <div className="ml-4">{children}</div>}
    </div>
  );
};

export default PageHeader; 