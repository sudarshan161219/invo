import { forwardRef } from "react";
import { useDocumentStore } from "@/store/documentStore/useDocumentStore";
import { type TemplateProps } from "@/types/TemplateProps";
import { formatDate } from "@/lib/formatDate/formatDate";
import {
  AddressBlock,
  PaymentDetails,
  Logo,
  Signature,
} from "../../templatesComponents/export";
import { safe } from "../../../helpers/safeValue";
import { getDocumentContext } from "../../../helpers/documentContext";
import { resolveIssuerIdentity } from "../../../helpers/issuerIdentity";
import styles from "./index.module.css";

export const Modern = forwardRef<HTMLElement, TemplateProps>((_props, ref) => {
  const { form, getFormattedTotals, shipToDiffrentAddress } =
    useDocumentStore();
  const {
    userDetails,
    clientDetails,
    documentDetails,
    items,
    tax,
    discount,
    taxType,
  } = form;

  const {
    subtotal,
    gst,
    discount: discountTotal,
    total,
  } = getFormattedTotals();

  // 1. Context & Identity Resolution (Replaces manual isQuote/labels logic)
  const { documentType } = documentDetails;
  const { labels, isQuote, isReceipt, isCreditNote } =
    getDocumentContext(documentType);

  // Resolves whether to show Trade Name or Legal Name based on identity
  const { title: issuerName } = resolveIssuerIdentity(userDetails);
  const isBusiness = userDetails.issuerType === "business";
  const business = userDetails.business;

  return (
    <article ref={ref} className={styles.invoice}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.branding}>
          <div className={styles.logoBox}>
            {/* Replaces renderLogo() */}
            {userDetails.branding.logo ? (
              <Logo
                branding={userDetails.branding}
                className={styles.logoImg}
                id="invoice-logo"
              />
            ) : (
              <div className={styles.logoPlaceholder}>Logo</div>
            )}
          </div>
          <h1 className={styles.title}>{documentDetails.title}</h1>
        </div>

        <dl className={styles.meta}>
          <div className={styles.metaRow}>
            <dt>{labels.numberLabel}</dt>
            <dd>{safe(documentDetails.documentNumber)}</dd>
          </div>
          <div className={styles.metaRow}>
            <dt>{labels.dateLabel}</dt>
            <dd>{formatDate(documentDetails.issueDate)}</dd>
          </div>
          {/* 1. Use explicit check for undefined/null so '0' is allowed */}
          {!isReceipt && documentDetails.paymentTerms !== undefined && (
            <div className={styles.metaRow}>
              <dt>{labels.termLabel}</dt>
              <dd>
                {/* 2. specific logic for 0 vs >0 */}
                {documentDetails.paymentTerms === 0
                  ? "Due on Receipt"
                  : `${documentDetails.paymentTerms} Days`}
              </dd>
            </div>
          )}
          {!isReceipt && (
            <div className={styles.metaRow}>
              <dt>{labels.dueLabel}</dt>
              <dd>{formatDate(documentDetails.dueDate)}</dd>
            </div>
          )}
          {!isReceipt && documentDetails.poNumber && (
            <div className={styles.metaRow}>
              <dt className={styles.metaLabel}>PO Number</dt>
              <dd className={styles.metaValue}>
                {safe(documentDetails.poNumber)}
              </dd>
            </div>
          )}
        </dl>
      </header>

      {/* PARTIES (Split Cards) */}
      <section className={styles.parties}>
        {/* LEFT CARD: BILL TO */}
        <div className={styles.partyCard}>
          <h2 className={styles.cardTitle}>{labels.toLabel}</h2>
          <div className={styles.partyContent}>
            {/* Logic adapted from Compact to handle Company vs Person */}
            {clientDetails.companyName ? (
              <>
                <strong>{clientDetails.companyName}</strong>
                <div className="text-sm opacity-75">{clientDetails.name}</div>
              </>
            ) : (
              <strong>{clientDetails.name}</strong>
            )}
            {isBusiness && business?.taxId && (
              <p className={styles.taxLine}>
                {business.taxIdLabel || "Tax ID"}: {business.taxId}
              </p>
            )}

            {/* Replaces manual address mapping */}
            <div className="mt-1">
              <AddressBlock address={clientDetails.address} />
            </div>
          </div>
        </div>

        {shipToDiffrentAddress && clientDetails.shippingAddress && (
          <div className={styles.partyCard}>
            <h2 className={styles.cardTitle}>
              {labels.shipLabel || "Ship To"}
            </h2>
            <div className={styles.addressBlock}>
              {/* 1. Name (Fallback to Client Name if Shipping Name is empty) */}
              <strong className="block text-sm">
                {clientDetails.shippingAddress.name || clientDetails.name}
              </strong>

              {/* 2. Address */}
              <div className={styles.addrText}>
                <AddressBlock address={clientDetails.shippingAddress.address} />
              </div>

              {/* 3. Contact Details (Phone is priority for delivery) */}
              {(clientDetails.phone || clientDetails.email) && (
                <div className="mt-2 text-[10px] opacity-75 leading-tight">
                  {clientDetails.phone && (
                    <div className="font-medium mb-0.5">
                      {clientDetails.phone}
                    </div>
                  )}
                  {clientDetails.email && <div>{clientDetails.email}</div>}
                </div>
              )}
            </div>
          </div>
        )}

        {/* RIGHT CARD: PAY TO (OR ISSUED BY) */}
        <div className={styles.partyCard}>
          <h2 className={styles.cardTitle}>
            {isReceipt || isCreditNote ? labels.fromLabel : "Payment Details"}
          </h2>
          <div className={styles.partyContent}>
            {/* Replaces renderPaymentCardContent() */}
            <PaymentDetails
              userDetails={userDetails}
              isReceipt={isReceipt}
              isCreditNote={isCreditNote}
              paymentContainerClassName={styles.paymentList}
              paymentTypeClassName={styles.paymentLabel}
              paymentBlockClassName={styles.paymentItem}
              labelClassName={styles.paymentLabel}
              paymentDataClassName={styles.paymentDetails}
              emptyClassName={styles.emptyNote}
              fallbackClassName={styles.sellerFallback}
            />
          </div>
        </div>
      </section>

      {/* ITEMS TABLE */}
      <section className={styles.itemsSection}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.colDesc}>Description</th>
              <th className={styles.colQty}>Qty</th>
              <th className={styles.colRate}>Rate</th>
              <th className={styles.colAmount}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id}>
                <td className={styles.colDesc}>{safe(it.description)}</td>
                <td className={styles.colQty}>{it.quantity}</td>
                <td className={styles.colRate}>{it.rate}</td>
                <td className={styles.colAmount}>{it.amount}</td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={4} className={styles.emptyTable}>
                  No items added
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* SUMMARY */}
      <section className={styles.summaryContainer}>
        <div className={styles.summaryBlock}>
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>{subtotal}</span>
          </div>

          {Number(discount) > 0 && (
            <div className={styles.summaryRow}>
              <span>Discount</span>
              <span>- {discountTotal}</span>
            </div>
          )}

          {Number(tax) > 0 && (
            <div className={styles.summaryRow}>
              <span>
                {userDetails.business?.taxIdLabel || "Tax"}

                {taxType === "percentage" && ` (${tax}%)`}
              </span>
              <span>{gst}</span>
            </div>
          )}

          <div className={styles.totalRow}>
            <span>{labels.totalLabel}</span>
            <span>{total}</span>
          </div>
        </div>
      </section>

      {/* FOOTER REGION */}
      <div className={styles.footerRegion}>
        <section className={styles.signatureSection}>
          {/* Replaces renderSignature() */}
          <Signature
            branding={userDetails.branding}
            issuerType={userDetails.issuerType}
            isQuote={isQuote}
            isReceipt={isReceipt}
            containerClassName={styles.signatureBlock}
            textClassName={styles.signatureText}
            imageClassName={styles.signatureImg}
            labelClassName={styles.signatureLabel}
          />
        </section>

        {/* Modern Style: Seller Address Centered/Bottom */}
        {/* We keep the layout manually here as AddressBlock is usually vertical */}
        <address className={styles.bottomAddress}>
          <span className={styles.sellerName}>{issuerName}</span>
          <span className={styles.separator}>•</span>
          <span>{userDetails.address.line1}</span>
          <span className={styles.separator}>•</span>
          <span>{userDetails.address.city}</span>

          {userDetails.business?.taxId && (
            <>
              <span className={styles.separator}>•</span>
              <span>
                {userDetails.business.taxIdLabel || "ID"}:{" "}
                {userDetails.business.taxId}
              </span>
            </>
          )}
        </address>

        <footer className={styles.footer}>
          <p>
            {safe(
              documentDetails.footerNote || userDetails.paymentFooterText,
              "Thank you for your business!"
            )}
          </p>
        </footer>
      </div>
    </article>
  );
});
