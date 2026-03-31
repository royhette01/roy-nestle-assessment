import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { PetName } from "../types";

type Props = {
  names: PetName[];
  activeId: string | null;
  onSelect: (id: string) => void;
};

const ROW = 44;

export function NameListVirtual({ names, activeId, onSelect }: Props) {
  const parentRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: names.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW,
    overscan: 12,
  });

  return (
    <div className="name-list-shell">
      <div className="name-list" ref={parentRef} role="listbox" aria-label="Names">
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {virtualizer.getVirtualItems().map((vi) => {
            const n = names[vi.index]!;
            const selected = n.id === activeId;
            return (
              <button
                key={n.id}
                type="button"
                role="option"
                aria-selected={selected}
                className={`name-row${selected ? " name-row--active" : ""}`}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${vi.size}px`,
                  transform: `translateY(${vi.start}px)`,
                }}
                onClick={() => onSelect(n.id)}
              >
                {n.title}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
