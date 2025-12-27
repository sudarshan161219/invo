import { useDocumentStore } from "@/store/documentStore/useDocumentStore";
import type { DocumentItem } from "@/types/document_types/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useShallow } from "zustand/react/shallow";
import styles from "./index.module.css";

import { v4 as uuid } from "uuid";

export const ItemsTable = () => {
  const { items, updateForm } = useDocumentStore(
    useShallow((state) => ({
      updateForm: state.updateForm,
      items: state.form.items,
    }))
  );

  const updateItem = <K extends keyof DocumentItem>(
    index: number,
    key: K,
    value: DocumentItem[K]
  ) => {
    const updated = [...items];
    const item = updated[index];

    const newItem: DocumentItem = {
      ...item,
      [key]: value,
      // auto-calc amount
      amount:
        key === "quantity"
          ? Number(value) * item.rate
          : key === "rate"
          ? item.quantity * Number(value)
          : item.quantity * item.rate,
    };

    updated[index] = newItem;
    updateForm("items", updated);
  };

  const addItem = () => {
    const newItem: DocumentItem = {
      id: uuid(),
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0,
    };

    updateForm("items", [...items, newItem]);
  };

  const removeItem = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    updateForm("items", updated);
  };

  return (
    <div className={styles.itemsSection}>
      <div className="flex self-center flex-row items-center justify-between mb-2">
        <h3>Invoice Items</h3>
        <button type="button" className={styles.addBtn} onClick={addItem}>
          + Add Item
        </button>
      </div>

      <div className="space-y-4 border">
        {items.map((item, index) => (
          <div key={item.id} className={styles.itemRow}>
            {/* Description */}
            <div className={styles.formItem}>
              <Label htmlFor="desc" className={styles.label}>
                Description
              </Label>

              <Input
                id="desc"
                value={item.description}
                placeholder="Item description"
                onChange={(e) =>
                  updateItem(index, "description", e.target.value)
                }
              />
            </div>

            <div className={styles.threeRow}>
              {/* Qty */}
              <div className={styles.formItem}>
                <Label className={styles.label} htmlFor="qty">
                  Qty
                </Label>

                <Input
                  id="qty"
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(index, "quantity", Number(e.target.value))
                  }
                />
              </div>

              {/* Rate */}
              <div className={styles.formItem}>
                <Label className={styles.label} htmlFor="rate">
                  Unit Price
                </Label>

                <Input
                  id={`rate-${item.id}`}
                  type="number"
                  min={0}
                  // FIX 1: Same here. 0 becomes empty string.
                  value={item.rate === 0 ? "" : item.rate}
                  onChange={(e) => {
                    // FIX 2: same logic
                    const val = e.target.value;
                    updateItem(index, "rate", val === "" ? 0 : Number(val));
                  }}
                />
              </div>

              {/* Amount */}
              <div className={styles.formItem}>
                <Label className={styles.label} htmlFor="amount">
                  Amount
                </Label>

                <Input id="amount" value={item.amount} readOnly />
              </div>
            </div>

            {/* Remove button */}
            {items.length > 1 && (
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => removeItem(item.id)}
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
