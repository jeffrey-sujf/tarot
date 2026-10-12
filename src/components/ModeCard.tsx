import { cx } from "../utils/classNames";
import styles from "./ModeCard.module.css";

interface Props {
  title: string;
  description: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export function ModeCard({ title, description, active, disabled, onClick }: Props) {
  return (
    <button type="button" className={cx(styles.card, active && styles.active)} onClick={onClick} disabled={disabled}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
    </button>
  );
}
