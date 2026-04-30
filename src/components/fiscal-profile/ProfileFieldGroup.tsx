import { ReactNode } from 'react';

interface Props {
  title?: string;
  description?: string;
  children: ReactNode;
}

export const ProfileFieldGroup = ({ title, description, children }: Props) => {
  return (
    <section className="space-y-4">
      {(title || description) && (
        <header className="space-y-1">
          {title && <h3 className="text-sm font-semibold text-foreground">{title}</h3>}
          {description && (
            <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
          )}
        </header>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </section>
  );
};
