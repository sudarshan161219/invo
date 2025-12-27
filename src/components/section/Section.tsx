import styles from "./index.module.css";

export const Section = ({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={className}>
    <h2 className={styles.h2}>{title}</h2>
    {children}
  </div>
);
