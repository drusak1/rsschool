import styles from './Pagination.module.css';

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: Props): React.JSX.Element | null {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visible = pages.filter(
    (p) => Math.abs(p - currentPage) <= 2 || p === 1 || p === totalPages,
  );

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <button
        className={styles.btn}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous page"
      >
        ←
      </button>
      {visible.map((page, index) => {
        const prev = visible[index - 1];
        const showEllipsis = prev !== undefined && page - prev > 1;
        return (
          <span key={page} className={styles.pageGroup}>
            {showEllipsis && <span className={styles.ellipsis}>…</span>}
            <button
              className={`${styles.btn} ${page === currentPage ? styles.active : ''}`}
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          </span>
        );
      })}
      <button
        className={styles.btn}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next page"
      >
        →
      </button>
    </nav>
  );
}
