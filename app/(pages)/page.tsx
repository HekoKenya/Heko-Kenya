export default function PagesIndex() {
  return null;
}

import Sidebar from "@/components/ui/sidebar";

export type PagesShellItem = {
  label: string;
  href?: string;
  active?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
};

export function PagesShell({
  items,
  title,
  subtitle,
  children,
}: {
  items: PagesShellItem[];
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-zinc-50">
      <div className="sticky top-0 h-[100dvh] overflow-y-auto shrink-0 border-r bg-white">
        <Sidebar
          items={items}
          header={<div className="text-lg font-semibold">Dashboard</div>}
          className="bg-transparent"
        />
      </div>
      <main className="flex-1 p-6">
        {(title || subtitle) && (
          <div className="mb-6">
            {title ? <h1 className="text-2xl font-semibold text-foreground">{title}</h1> : null}
            {subtitle ? <p className="text-sm text-zinc-600">{subtitle}</p> : null}
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
