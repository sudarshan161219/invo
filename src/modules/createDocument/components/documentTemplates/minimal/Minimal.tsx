import { forwardRef } from "react";
import { useDocumentStore } from "@/store/documentStore/useDocumentStore";
import { formatDate } from "@/lib/formatDate/formatDate";
import { type TemplateProps } from "@/types/TemplateProps";
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

export const Minimal = forwardRef<HTMLElement, TemplateProps>((_props, ref) => {
  const { form, getFormattedTotals, shipToDiffrentAddress } =
    useDocumentStore();

  const {
    userDetails,
    clientDetails,
    documentDetails,
    items,
    description,
    tax,
    discount,
    discountType,
    taxType,
  } = form;

  const {
    subtotal,
    gst,
    discount: discountTotal,
    total,
  } = getFormattedTotals();

  // Context Helpers
  const { documentType, title } = documentDetails;
  const { labels, isQuote, isReceipt, isCreditNote } =
    getDocumentContext(documentType);
  const { title: headerTitle, subtitle: legalNameSubtitle } =
    resolveIssuerIdentity(userDetails);
  const isBusiness = userDetails.issuerType === "business";

  return (
    <article ref={ref} className={styles.container}>
      {/* ---------------- HEADER ---------------- */}
      <header className={styles.header}>
        {/* LEFT: BRANDING */}
        <div className={styles.brand}>
          <Logo
            branding={userDetails.branding}
            className={styles.logo}
            // Style managed in CSS now, but inline override if needed:
            style={{ marginBottom: "1rem" }}
          />

          <h1 className={styles.issuerName}>{headerTitle}</h1>

          {legalNameSubtitle && (
            <p className={styles.issuerSubtitle}>{legalNameSubtitle}</p>
          )}

          {isBusiness && userDetails.business?.taxId && (
            <p className={styles.taxId}>
              {userDetails.business.taxIdLabel || "Tax ID"}:{" "}
              {userDetails.business.taxId}
            </p>
          )}

          <div className={styles.issuerAddress}>
            <AddressBlock address={userDetails.address} />

            {/* Contact Info */}
            {(userDetails.contact.email || userDetails.contact.phone) && (
              <div className={styles.contactLine}>
                {userDetails.contact.email}
                {userDetails.contact.email &&
                  userDetails.contact.phone &&
                  " • "}
                {userDetails.contact.phone}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: META DATA */}
        <div className={styles.meta}>
          <h2 className={styles.docTitle}>{title}</h2>

          <div className={styles.metaGrid}>
            <div className={styles.metaItem}>
              <span className={styles.label}># {labels.numberLabel}</span>
              <span className={styles.value}>
                {safe(documentDetails.documentNumber)}
              </span>
            </div>

            <div className={styles.metaItem}>
              <span className={styles.label}>{labels.dateLabel}</span>
              <span className={styles.value}>
                {formatDate(documentDetails.issueDate)}
              </span>
            </div>

            {/* Added Payment Terms Logic */}
            {!isReceipt && documentDetails.paymentTerms !== undefined && (
              <div className={styles.metaItem}>
                <span className={styles.label}>{labels.termLabel}</span>
                <span className={styles.value}>
                  {/* 2. specific logic for 0 vs >0 */}
                  {documentDetails.paymentTerms === 0
                    ? "Due on Receipt"
                    : `${documentDetails.paymentTerms} Days`}
                </span>
              </div>
            )}

            {!isReceipt && (
              <div className={styles.metaItem}>
                <span className={styles.label}>{labels.dueLabel}</span>
                <span className={styles.value}>
                  {formatDate(documentDetails.dueDate)}
                </span>
              </div>
            )}

            {!isReceipt && documentDetails.poNumber && (
              <div className={styles.metaItem}>
                <span className={styles.label}>PO #</span>
                <span className={styles.value}>
                  {safe(documentDetails.poNumber)}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ---------------- CLIENT SECTION ---------------- */}
      <section className={styles.clientSection}>
        {/* Bill To */}
        <div className={styles.clientBlock}>
          <h3 className={styles.label}>{labels.toLabel}</h3>
          <div className={styles.clientContent}>
            <strong className={styles.clientName}>
              {clientDetails.companyName || clientDetails.name}
            </strong>

            {clientDetails.companyName && (
              <div className={styles.attn}>Attn: {clientDetails.name}</div>
            )}

            {clientDetails.taxId && (
              <div className={styles.clientTax}>
                Tax ID: {clientDetails.taxId}
              </div>
            )}

            <AddressBlock address={clientDetails.address} />
          </div>
        </div>

        {/* Ship To (Conditional) */}
        {shipToDiffrentAddress && clientDetails.shippingAddress && (
          <div className={styles.clientBlock}>
            <h3 className={styles.label}>{labels.shipLabel}</h3>
            <div className={styles.clientContent}>
              <strong className={styles.clientName}>
                {clientDetails.shippingAddress.name || clientDetails.name}
              </strong>
              <AddressBlock address={clientDetails.shippingAddress.address} />
            </div>
          </div>
        )}
      </section>

      {/* ---------------- DESCRIPTION ---------------- */}
      {description && (
        <section className={styles.description}>
          <h3 className={styles.label}>
            {isQuote ? "Project Overview" : "Subject"}
          </h3>
          <p>{description}</p>
        </section>
      )}

      {/* ---------------- TABLE ---------------- */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.thDesc}>Description</th>
            <th className={styles.thQty}>Qty</th>
            <th className={styles.thRate}>Rate</th>
            <th className={styles.thTotal}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item.id || index}>
              <td className={styles.tdDesc}>{safe(item.description)}</td>
              <td className={styles.tdQty}>{item.quantity}</td>
              <td className={styles.tdRate}>{item.rate}</td>
              <td className={styles.tdTotal}>{item.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ---------------- FOOTER ---------------- */}
      <div className={styles.footerLayout}>
        {/* LEFT: PAYMENT INFO & SIGNATURE */}
        <div className={styles.footerLeft}>
          <PaymentDetails
            userDetails={userDetails}
            isReceipt={isReceipt}
            isCreditNote={isCreditNote}
            // Passing styles down for specific override
            paymentContainerClassName={styles.paymentContainer}
            labelClassName={styles.paymentLabel}
          />

          <div className={styles.notes}>
            {documentDetails.footerNote && <p>{documentDetails.footerNote}</p>}

            <Signature
              branding={userDetails.branding}
              issuerType={userDetails.issuerType}
              isQuote={isQuote}
              isReceipt={isReceipt}
              containerClassName={styles.signature}
              textClassName={styles.sigText}
              labelClassName={styles.sigLabel}
            />
          </div>
        </div>

        {/* RIGHT: TOTALS SUMMARY */}
        <div className={styles.footerRight}>
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>{subtotal}</span>
          </div>

          {Number(discount) > 0 && (
            <div className={styles.summaryRow}>
              <span>
                Discount
                {discountType === "percentage" && ` (${discount}%)`}
              </span>
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

          <div className={styles.grandTotal}>
            <span>{labels.totalLabel}</span>
            <span>{total}</span>
          </div>
        </div>
      </div>
    </article>
  );
});
