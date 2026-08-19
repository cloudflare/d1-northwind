interface PaginateProps {
  page: number;
  pages: number;
  base: string;
}

export const Paginate = ({ page, pages, base }: PaginateProps) => {
  const maxPages = 7;
  const marginPages = 3;
  const href = (p: number) => `${base}?page=${p}`;

  return (
    <div className="table-pagination">
      <div className="flex items-center justify-between">
        {pages > 1 ? (
          <div className="buttons">
            {/* eslint-disable-next-line array-callback-return */}
            {[...Array(pages)].map((_p, index) => {
              const cls = `button${index + 1 == page ? " active" : ""}`;
              if (index == 0) {
                return (
                  <a key={index} href={href(1)} className={cls}>
                    1
                  </a>
                );
              }
              if (index + 1 >= page - marginPages) {
                if (index + 1 == pages) {
                  return (
                    <a key={index} href={href(pages)} className={cls}>
                      {pages}
                    </a>
                  );
                }
                if (index + 1 < maxPages + page || index + 1 > pages - 2) {
                  return (
                    <a
                      key={index}
                      href={href(index + 1)}
                      className={cls}
                    >
                      {index + 1}
                    </a>
                  );
                } else {
                  if (index + 1 == pages - 3)
                    return (
                      <span className="button" key={index}>
                        ...
                      </span>
                    );
                }
              }
            })}
          </div>
        ) : null}
        <small>
          Page {page} of {pages}
        </small>
      </div>
    </div>
  );
};

export default Paginate;
