import React from "react";
import { Button } from "@/components/ui/button";

const Pagination = ({ page, setPage, hasMore }) => {
  return (
    <div className="flex justify-center gap-2 mt-4">
      <Button
        disabled={page === 1}
        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
      >
        Previous
      </Button>
      <span className="px-4 py-2 text-sm">Page {page}</span>
      <Button disabled={!hasMore} onClick={() => setPage((prev) => prev + 1)}>
        Next
      </Button>
    </div>
  );
};

export default Pagination;
