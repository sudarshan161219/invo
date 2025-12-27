import type { UserDetails, PaymentMethods } from "@/types/document_types/types";

interface PaymentDetailsProps {
  userDetails: UserDetails;
  isReceipt?: boolean;
  isCreditNote?: boolean;

  /** Styling hooks (owned by template) */
  containerClassName?: string;
  fallbackClassName?: string;
  labelClassName?: string;
  emptyClassName?: string;

  paymentContainerClassName?: string;
  paymentBlockClassName?: string;
  paymentTypeClassName?: string;
  paymentDataClassName?: string;
}

export function PaymentDetails({
  userDetails,
  isReceipt,
  isCreditNote,
  containerClassName,
  fallbackClassName,
  labelClassName,
  emptyClassName,
  paymentContainerClassName,
  paymentBlockClassName,
  paymentTypeClassName,
  paymentDataClassName,
}: PaymentDetailsProps) {
  // ------------------------------------------------------------
  // RECEIPT / CREDIT NOTE FALLBACK
  // ------------------------------------------------------------
  if (isReceipt || isCreditNote) {
    return (
      <div className={fallbackClassName}>
        <p className={labelClassName}>Contact Info</p>
        <div>{userDetails.contact.email}</div>
        {userDetails.contact.phone && <div>{userDetails.contact.phone}</div>}
        <div className="mt-1 text-sm opacity-75">
          {userDetails.address.city}, {userDetails.address.country}
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------
  // NO PAYMENT METHODS
  // ------------------------------------------------------------
  if (!userDetails.paymentMethods?.length) {
    return <p className={emptyClassName}>No payment info added</p>;
  }

  // ------------------------------------------------------------
  // PAYMENT METHODS
  // ------------------------------------------------------------
  return (
    <div className={paymentContainerClassName ?? containerClassName}>
      {userDetails.paymentMethods.map(
        (method: PaymentMethods, index: number) => (
          <div key={index} className={paymentBlockClassName}>
            <span className={paymentTypeClassName}>
              {method.label || method.bankName || method.type.toUpperCase()}
            </span>

            <div className={paymentDataClassName}>
              {method.type === "bank" && (
                <>
                  {method.bankName && <span>Bank: {method.bankName}</span>}
                  {method.accountNumber && (
                    <span>A/C: {method.accountNumber}</span>
                  )}
                  {method.bankCode && <span>Code: {method.bankCode}</span>}
                </>
              )}

              {method.type === "upi" && <span>{method.upiId}</span>}

              {method.type === "paypal" && <span>{method.paypalEmail}</span>}

              {method.type === "cashapp" && <span>{method.cashTag}</span>}

              {method.type === "custom" && <span>{method.customValue}</span>}
            </div>
          </div>
        )
      )}
    </div>
  );
}
