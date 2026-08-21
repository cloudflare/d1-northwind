import { useState } from "react";
import { Button, Input, Select } from "@cloudflare/kumo";

interface SearchFormProps {
  initialQ: string;
  initialTable: string;
}

export default function SearchForm({
  initialQ,
  initialTable,
}: SearchFormProps) {
  const [q, setQ] = useState(initialQ);
  const [table, setTable] = useState(initialTable);

  const submit = () => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    params.set("table", table);
    window.location.href = `/search?${params.toString()}`;
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="space-y-4"
    >
      <Input
        label="Search Database"
        placeholder="Enter keyword..."
        value={q}
        onValueChange={setQ}
      />
      <Select
        label="Tables"
        className="w-full max-w-xs"
        value={table}
        onValueChange={(v) => setTable(v ?? "products")}
        items={{ products: "Products", customers: "Customers" }}
      />
      <Button type="submit" variant="primary">
        Search
      </Button>
    </form>
  );
}
