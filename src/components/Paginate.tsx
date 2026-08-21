import { LinkButton, Text } from "@cloudflare/kumo";

interface PaginateProps {
  page: number;
  pages: number;
  base: string;
}

const getPageItems = (page: number, pages: number): (number | "ellipsis")[] => {
  if (pages <= 7) {
    return Array.from({ length: pages }, (_, i) => i + 1);
  }
  const items: (number | "ellipsis")[] = [1];
  if (page > 3) items.push("ellipsis");
  for (let i = Math.max(2, page - 1); i <= Math.min(pages - 1, page + 1); i++) {
    items.push(i);
  }
  if (page < pages - 2) items.push("ellipsis");
  items.push(pages);
  return items;
};

export const Paginate = ({ page, pages, base }: PaginateProps) => {
  const href = (p: number) => `${base}?page=${p}`;
  const items = getPageItems(page, pages);

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3">
      {pages > 1 ? (
        <div className="flex items-center gap-1">
          {items.map((item, index) =>
            item === "ellipsis" ? (
              <span
                key={`e-${index}`}
                className="px-2 text-sm text-kumo-subtle"
              >
                …
              </span>
            ) : (
              <LinkButton
                key={item}
                href={href(item)}
                size="sm"
                variant={item === page ? "secondary" : "ghost"}
              >
                {item}
              </LinkButton>
            ),
          )}
        </div>
      ) : null}
      <Text variant="secondary" size="sm">
        Page {page} of {pages}
      </Text>
    </div>
  );
};

export default Paginate;
