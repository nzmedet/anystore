import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode
} from "react";

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonAsButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: undefined;
  variant?: ButtonVariant;
};

type ButtonAsLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: ButtonVariant;
};

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

export function Button(props: ButtonProps) {
  const { variant = "primary", className, children } = props;
  const classes = cn("anystore-button", `anystore-button-${variant}`, className);

  if ("href" in props && props.href) {
    const { href, variant: _variant, className: _className, children: _children, ...linkProps } = props;
    return (
      <a href={href} className={classes} {...(linkProps as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }

  const { variant: _variant, className: _className, children: _children, ...buttonProps } = props;
  return (
    <button className={classes} {...(buttonProps as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: "neutral" | "success" | "warning" | "danger" | "accent";
};

export function Badge({ tone = "neutral", className, children, ...props }: BadgeProps) {
  return (
    <span className={cn("anystore-badge", `anystore-badge-${tone}`, className)} {...props}>
      {children}
    </span>
  );
}

type CardProps = HTMLAttributes<HTMLElement> & {
  title?: string;
  eyebrow?: string;
  description?: string;
  actions?: ReactNode;
  as?: "section" | "article" | "div";
};

export function Card({ title, eyebrow, description, actions, as: Component = "section", className, children, ...props }: CardProps) {
  return (
    <Component className={cn("anystore-card", className)} {...props}>
      {(title || eyebrow || description || actions) && (
        <div className="anystore-card-header">
          <div>
            {eyebrow ? <p className="anystore-eyebrow">{eyebrow}</p> : null}
            {title ? <h2 className="anystore-card-title">{title}</h2> : null}
            {description ? <p className="anystore-card-description">{description}</p> : null}
          </div>
          {actions ? <div className="anystore-card-actions">{actions}</div> : null}
        </div>
      )}
      {children}
    </Component>
  );
}

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function SectionHeader({ eyebrow, title, description, actions }: SectionHeaderProps) {
  return (
    <div className="anystore-section-header">
      <div>
        {eyebrow ? <p className="anystore-eyebrow">{eyebrow}</p> : null}
        <h2 className="anystore-section-title">{title}</h2>
        {description ? <p className="anystore-section-description">{description}</p> : null}
      </div>
      {actions ? <div className="anystore-section-actions">{actions}</div> : null}
    </div>
  );
}

type MetricCardProps = {
  label: string;
  value: string;
  detail?: string;
  tone?: "neutral" | "success" | "warning" | "accent";
};

export function MetricCard({ label, value, detail, tone = "neutral" }: MetricCardProps) {
  return (
    <div className={cn("anystore-metric", `anystore-metric-${tone}`)}>
      <p className="anystore-metric-label">{label}</p>
      <p className="anystore-metric-value">{value}</p>
      {detail ? <p className="anystore-metric-detail">{detail}</p> : null}
    </div>
  );
}

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="anystore-empty-state">
      <h3>{title}</h3>
      <p>{description}</p>
      {action ? <div className="anystore-empty-state-action">{action}</div> : null}
    </div>
  );
}
