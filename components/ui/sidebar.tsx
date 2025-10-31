import Link from "next/link";
import { ReactNode } from "react";

type SidebarItem = {
  label: string;
  href?: string;
  icon?: ReactNode;
  active?: boolean;
  onClick?: () => void;
  key?: string;
};

type SidebarProps = {
  items: SidebarItem[];
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export default function Sidebar({ items, header, footer, className }: SidebarProps) {
  return (
    <aside className={`flex h-screen w-64 flex-col border-r bg-background ${className ?? ""}`}>
      {header ? <div className="p-4">{header}</div> : null}

      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {items.map((item, idx) => {
            const base = "flex items-center gap-3 rounded-sm px-3 py-2 text-sm transition-colors";
            const state = item.active ? "bg-primary text-white" : "text-foreground hover:bg-black/5";

            const content = (
              <>
                {item.icon ? <span className="shrink-0">{item.icon}</span> : null}
                <span className="truncate">{item.label}</span>
              </>
            );

            return (
              <li key={item.key ?? String(idx)}>
                {item.href ? (
                  <Link href={item.href} className={`${base} ${state}`}>
                    {content}
                  </Link>
                ) : (
                  <button type="button" onClick={item.onClick} className={`${base} ${state} w-full text-left`}>
                    {content}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {footer ? <div className="p-4">{footer}</div> : null}
    </aside>
  );
}

