import { useDocumentStore } from "@/store/documentStore/useDocumentStore";
import { useShallow } from "zustand/react/shallow";
import styles from "./index.module.css";

export const Totals = () => {
  const { getTotals, discountType, discount, tax, currency } = useDocumentStore(
    useShallow((state) => ({
      getTotals: state.getTotals,
      discountType: state.form.discountType,
      discount: state.form.discount,
      tax: state.form.tax,
      currency: state.form.documentDetails.currency,
    }))
  );
  const { subtotal, discountAmount, taxableAmount, gst, total } = getTotals();

  const discountLabel =
    discountType === "percentage"
      ? `Discount (${discount}%)`
      : `Discount (${currency} ${discount})`;

  return (
    <div className={styles.totalBox}>
      {/* Subtotal */}
      <div className={styles.subtotal}>
        <p>Subtotal:</p>
        <span>
          {subtotal} {currency}
        </span>
      </div>

      {/* Discount */}
      <div className={styles.discount}>
        <p>{discountLabel}:</p>
        <span>
          −{discountAmount} {currency}
        </span>
      </div>

      {/* Taxable Amount */}
      <div className={styles.taxable}>
        <p>Taxable Amount:</p>
        <span>
          {taxableAmount} {currency}
        </span>
      </div>

      {/* Tax */}
      <div className={styles.tax}>
        <p>{`Tax (${tax}% after discount):`}</p>
        <span>
          {gst} {currency}
        </span>
      </div>

      {/* Total */}
      <div className={styles.total}>
        <p>Total:</p>
        <span className={styles.totalSpan}>
          {total} {currency}
        </span>
      </div>
    </div>
  );
};
