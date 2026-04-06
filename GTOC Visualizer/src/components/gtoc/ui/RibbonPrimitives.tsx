import React from "react";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function RibbonRoot({ children }: { children: React.ReactNode }) {
  return <div className="pointer-events-auto fixed inset-x-0 top-0 z-[1000] select-none">{children}</div>;
}

export function RibbonShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-b border-black/45 bg-[rgba(18,22,28,0.96)] shadow-[0_8px_22px_rgba(0,0,0,0.22)] backdrop-blur-xl">
      {children}
    </div>
  );
}

export function RibbonHeader({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-9 items-center justify-between gap-4 border-b border-white/8 px-4">{children}</div>;
}

export function RibbonBrand({
  logoSrc,
  logoAlt,
  sectionName,
}: {
  logoSrc: string;
  logoAlt: string;
  sectionName: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <img src={logoSrc} alt={logoAlt} className="h-7 w-auto object-contain" />
      <div className="hidden h-4 w-px bg-white/10 sm:block" />
      <div className="hidden truncate text-[11px] text-white/45 sm:block">{sectionName}</div>
    </div>
  );
}

export function RibbonTabs({ children }: { children: React.ReactNode }) {
  return <div className="flex items-stretch gap-0.5">{children}</div>;
}

export function RibbonTab({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative h-9 px-4 text-[12px] font-medium transition-colors",
        active ? "text-white" : "text-white/55 hover:text-white"
      )}
    >
      {label}
      <span
        className={cn(
          "absolute inset-x-2 bottom-0 h-0.5 rounded-full transition-opacity",
          active ? "bg-[#7fb4ff] opacity-100" : "bg-transparent opacity-0"
        )}
      />
    </button>
  );
}

export function RibbonChip({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="hidden items-center gap-2 rounded border border-white/8 bg-white/[0.03] px-2 py-0.5 text-[11px] text-white/70 xl:flex">
      <span className="text-white/38">{label}</span>
      <span className="font-medium text-white/90">{value}</span>
    </div>
  );
}

export function RibbonCollapseButton({
  collapsed,
  onClick,
}: {
  collapsed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex h-7 w-7 items-center justify-center rounded border border-transparent text-white/45 transition-colors hover:border-white/8 hover:bg-white/[0.04] hover:text-white"
      title={collapsed ? "Expand ribbon" : "Collapse ribbon"}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cn("transition-transform", collapsed && "rotate-180")}>
        <path d="m18 15-6-6-6 6" />
      </svg>
    </button>
  );
}

export function RibbonContent({
  collapsed,
  children,
}: {
  collapsed: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden transition-all duration-200",
        collapsed ? "max-h-0 opacity-0" : "max-h-[180px] opacity-100"
      )}
    >
      {children}
    </div>
  );
}

export function RibbonStrip({ children }: { children: React.ReactNode }) {
  return <div className="flex h-[96px] min-h-[96px] items-stretch gap-0 overflow-x-auto px-3 pt-1.5 pb-3">{children}</div>;
}

export function RibbonGroup({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("flex shrink-0 flex-col justify-between border-r border-white/8 px-3 first:pl-1 last:border-r-0 last:pr-1", className)}>
      <div className="flex h-[66px] min-h-[66px] flex-1 items-center">{children}</div>
      <div className="pt-1 pb-2 text-center text-[10px] text-white/38">{title}</div>
    </section>
  );
}

export function RibbonLargeButton({
  label,
  meta,
  icon,
  onClick,
  disabled = false,
  active = false,
  asLabel = false,
  title,
  children,
}: {
  label: string;
  meta?: string;
  icon: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  asLabel?: boolean;
  title?: string;
  children?: React.ReactNode;
}) {
  const className = cn(
    "flex h-[66px] w-[74px] flex-col items-center justify-start overflow-hidden rounded border px-1.5 py-1.5 text-center transition-colors",
    disabled
      ? "cursor-not-allowed border-white/6 bg-white/[0.02] text-white/20"
      : active
        ? "border-[#7fb4ff]/35 bg-[#7fb4ff]/10 text-white"
        : "border-transparent bg-transparent text-white/75 hover:border-white/8 hover:bg-white/[0.04] hover:text-white"
  );

  const content = (
    <>
      <div className="mb-1.5 flex h-6 w-6 items-center justify-center text-inherit">{icon}</div>
      <div className="w-full text-[10px] leading-[1.15] break-words">{label}</div>
      {meta ? <div className="mt-0.5 w-full text-[8px] leading-[1.05] text-white/38 break-words">{meta}</div> : null}
      {children}
    </>
  );

  if (asLabel) {
    return (
      <label className={className} title={title}>
        {content}
      </label>
    );
  }

  return (
    <button onClick={onClick} disabled={disabled} className={className} title={title}>
      {content}
    </button>
  );
}

export function RibbonTwoRow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("grid h-[66px] grid-cols-2 gap-1", className)}>{children}</div>;
}

export function RibbonSmallButton({
  children,
  onClick,
  disabled = false,
  active = false,
  danger = false,
  title,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  danger?: boolean;
  title?: string;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "inline-flex h-7 items-center justify-center rounded border px-2 text-[11px] transition-colors",
        disabled
          ? "cursor-not-allowed border-white/6 bg-white/[0.02] text-white/20"
          : danger
            ? "border-transparent text-rose-200 hover:border-rose-400/20 hover:bg-rose-400/10"
            : active
              ? "border-[#7fb4ff]/35 bg-[#7fb4ff]/10 text-white"
              : "border-white/8 bg-white/[0.03] text-white/70 hover:bg-white/[0.06] hover:text-white",
        className
      )}
    >
      {children}
    </button>
  );
}

export function RibbonField({
  label,
  value,
  children,
  className = "",
}: {
  label: string;
  value?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-[210px] flex-col justify-center gap-1 rounded border border-white/8 bg-white/[0.03] px-3 py-1.5", className)}>
      <div className="flex items-center justify-between gap-4">
        <div className="text-[10px] uppercase tracking-[0.08em] text-white/38">{label}</div>
        {value !== undefined ? <div className="font-mono text-[11px] text-white/72">{value}</div> : null}
      </div>
      {children}
    </div>
  );
}

export function RibbonStack({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex flex-col gap-1.5", className)}>{children}</div>;
}

export function RibbonInline({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex items-center gap-1.5", className)}>{children}</div>;
}

export function RibbonList({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("grid max-h-[66px] min-w-[410px] grid-cols-1 gap-1 overflow-y-auto", className)}>{children}</div>;
}

export function RibbonListItem({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("flex min-h-0 items-center gap-2 rounded border border-white/8 bg-white/[0.03] px-2 py-1", className)}>{children}</div>;
}
