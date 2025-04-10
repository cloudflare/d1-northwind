interface PaginateProps {
  page: number;
  pages: number;
  setPage: (page: number) => void;
}

export const Paginate = ({ page, pages, setPage }: PaginateProps) => {
  const maxPages = 7;
  const marginPages = 3;

  return (
    <div className="table-pagination">
      <div className="flex items-center justify-between">
        {pages > 1 ? (
          <div className="buttons">
            {/* eslint-disable-next-line array-callback-return */}
            {[...Array(pages)].map((p, index) => {
              const bc = `button${index + 1 == page ? " active" : ""}`;
              if (index == 0) {
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setPage(1)}
                    className={bc}
                  >
                    1
                  </button>
                );
              }
              if (index + 1 >= page - marginPages) {
                if (index + 1 == pages) {
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setPage(pages)}
                      className={bc}
                    >
                      {pages}
                    </button>
                  );
                }
                if (index + 1 < maxPages + page || index + 1 > pages - 2) {
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setPage(index + 1)}
                      className={bc}
                    >
                      {" "}
                      {index + 1}
                    </button>
                  );
                } else {
                  if (index + 1 == pages - 3)
                    return (
                      <button type="button" key={index}>
                        ...
                      </button>
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
