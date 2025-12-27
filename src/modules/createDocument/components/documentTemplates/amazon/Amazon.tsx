import { forwardRef } from "react";
import { useDocumentStore } from "@/store/documentStore/useDocumentStore";
import { formatDate } from "@/lib/formatDate/formatDate";
import { type TemplateProps } from "@/types/TemplateProps";
import {
  AddressBlock,
  PaymentDetails,
  Signature,
} from "../../templatesComponents/export";
import { safe } from "../../../helpers/safeValue";
import { getDocumentContext } from "../../../helpers/documentContext";
import { resolveIssuerIdentity } from "../../../helpers/issuerIdentity";
import styles from "./index.module.css";

export const Amazon = forwardRef<HTMLElement, TemplateProps>((_props, ref) => {
  const { form, getFormattedTotals } = useDocumentStore();
  const { userDetails, clientDetails, documentDetails, items, description } =
    form;

  const { subtotal, gst, total } = getFormattedTotals();

  const { documentType, title } = documentDetails;
  const { labels, isReceipt, isCreditNote, isQuote } =
    getDocumentContext(documentType);

  const { title: issuerName, subtitle: legalSubtitle } =
    resolveIssuerIdentity(userDetails);

  return (
    <article ref={ref} className={styles.invoice}>
      {/* ======================================================
          HEADER (TEXT ONLY)
         ====================================================== */}
      <header className={styles.header}>
        <h1 className={styles.docTitle}>{title}</h1>
        <p>(Original for Recipient)</p>
        <p className={styles.disclaimer}>
          Please note that this invoice is not a demand for payment
        </p>
      </header>

      {/* ======================================================
          SELLER BLOCK
         ====================================================== */}
      <section className={styles.block}>
        <strong>{issuerName}</strong>
        {legalSubtitle && <div>{legalSubtitle}</div>}
        <AddressBlock address={userDetails.address} />

        {userDetails.business?.taxId && (
          <div>
            {userDetails.business.taxIdLabel || "Tax ID"}:{" "}
            {userDetails.business.taxId}
          </div>
        )}

        {userDetails.contact.email && (
          <div>Email: {userDetails.contact.email}</div>
        )}
        {userDetails.contact.phone && (
          <div>Phone: {userDetails.contact.phone}</div>
        )}
      </section>

      {/* ======================================================
          META INFORMATION
         ====================================================== */}
      <section className={styles.meta}>
        <p>
          {labels.numberLabel}:{" "}
          <strong>{safe(documentDetails.documentNumber)}</strong>
        </p>
        <p>
          {labels.dateLabel}:{" "}
          <strong>{formatDate(documentDetails.issueDate)}</strong>
        </p>

        {!isReceipt && (
          <p>
            {labels.dueLabel}:{" "}
            <strong>{formatDate(documentDetails.dueDate)}</strong>
          </p>
        )}

        {documentDetails.poNumber && (
          <p>
            PO Number: <strong>{documentDetails.poNumber}</strong>
          </p>
        )}
      </section>

      {/* ======================================================
          BILL TO
         ====================================================== */}
      <section className={styles.block}>
        <strong>Bill To:</strong>
        <div>{clientDetails.companyName || clientDetails.name}</div>
        <AddressBlock address={clientDetails.address} />
        {clientDetails.taxId && <div>Tax ID: {clientDetails.taxId}</div>}
      </section>

      {/* ======================================================
          DESCRIPTION
         ====================================================== */}
      {description && (
        <section className={styles.block}>
          <p>{description}</p>
        </section>
      )}

      {/* ======================================================
          ITEMS TABLE
         ====================================================== */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Sl. No</th>
            <th>Description</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={item.id || idx}>
              <td>{idx + 1}</td>
              <td>{safe(item.description)}</td>
              <td className={styles.center}>{item.quantity}</td>
              <td className={styles.right}>{item.rate}</td>
              <td className={styles.right}>{item.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ======================================================
          TOTALS
         ====================================================== */}
      <section className={styles.totals}>
        <p>Subtotal: {subtotal}</p>
        {gst && <p>Tax: {gst}</p>}
        <p className={styles.grandTotal}>
          {labels.totalLabel}: {total}
        </p>
      </section>

      {/* ======================================================
          FOOTER
         ====================================================== */}
      <section className={styles.footer}>
        <PaymentDetails
          userDetails={userDetails}
          isReceipt={isReceipt}
          isCreditNote={isCreditNote}
        />

        <Signature
          branding={userDetails.branding}
          issuerType={userDetails.issuerType}
          isQuote={isQuote}
          isReceipt={isReceipt}
        />

        <p className={styles.auth}>
          For {issuerName}
          <br />
          Authorized Signatory
        </p>
      </section>
    </article>
  );
});
