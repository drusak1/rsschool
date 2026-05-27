import { useAppDispatch, useAppSelector } from '../../store';
import { clearAll } from '../../store/selectedSlice';
import { downloadCSV } from '../../utils/csv';
import styles from './Flyout.module.css';

export function Flyout(): React.JSX.Element | null {
  const items = useAppSelector((state) => state.selected.items);
  const dispatch = useAppDispatch();

  if (items.length === 0) return null;

  function handleUnselectAll(): void {
    dispatch(clearAll());
  }

  function handleDownload(): void {
    downloadCSV(items);
  }

  return (
    <div className={styles.flyout} role="region" aria-label="Selected items">
      <span className={styles.count}>
        {items.length} item{items.length !== 1 ? 's' : ''} selected
      </span>
      <button className={styles.button} onClick={handleUnselectAll}>
        Unselect all
      </button>
      <button className={styles.button} onClick={handleDownload}>
        Download
      </button>
    </div>
  );
}
