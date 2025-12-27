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

export const Fun = forwardRef<HTMLElement, TemplateProps>((_props, ref) => {
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
    <article ref={ref} className={styles.invoice}>
      {/* ---------- HEADER ---------- */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          {/* Logo Section */}
          <div className={styles.logoWrapper}>
            <Logo
              branding={userDetails.branding}
              className={styles.logoImg}
              id="fun-logo"
            />
          </div>

          <div className={styles.headerText}>
            <h1 className={styles.mainTitle}>{title}</h1>
            <p className={styles.tagline}>
              {isReceipt
                ? "Proof of payment! 🎉"
                : "Let's make magic happen! ✨"}
            </p>
          </div>
        </div>

        {/* Meta Bubble Bar */}
        <div className={styles.metaBubble}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}># {labels.numberLabel}: </span>
            <span className={styles.metaValue}>
              {safe(documentDetails.documentNumber)}
            </span>
          </div>

          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>📅 {labels.dateLabel}: </span>
            <span className={styles.metaValue}>
              {formatDate(documentDetails.issueDate)}
            </span>
          </div>

          {!isReceipt && documentDetails.paymentTerms !== undefined && (
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>⏱️ {labels.termLabel}: </span>
              <span className={styles.metaValue}>
                {/* 2. specific logic for 0 vs >0 */}
                {documentDetails.paymentTerms === 0
                  ? "Due on Receipt"
                  : `${documentDetails.paymentTerms} Days`}
              </span>
            </div>
          )}

          {!isReceipt && (
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>⏳ {labels.dueLabel}: </span>
              <span className={styles.metaValue}>
                {formatDate(documentDetails.dueDate)}
              </span>
            </div>
          )}

          {/* Smart Logic: PO or Payment Mode */}
          {!isReceipt && documentDetails.poNumber && (
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>📎 PO Ref: </span>
              <span className={styles.metaValue}>
                {safe(documentDetails.poNumber)}
              </span>
            </div>
          )}

          {isReceipt && documentDetails.paymentMethod && (
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>💳 Paid Via:</span>
              <span className={styles.metaValue}>
                {documentDetails.paymentMethod}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* ---------- PARTIES (Cards Layout) ---------- */}
      <section className={styles.partiesGrid}>
        {/* SENDER CARD */}
        <div className={`${styles.card} ${styles.senderCard}`}>
          <h2 className={styles.cardTitle}>🚀 From</h2>
          <div className={styles.cardContent}>
            <strong className={styles.partyName}>{headerTitle}</strong>
            <div className={styles.subtitle}>{legalNameSubtitle}</div>

            {isBusiness && userDetails.business?.taxId && (
              <div className={styles.taxId}>
                {userDetails.business.taxIdLabel || "Tax ID"}:{" "}
                {userDetails.business.taxId}
              </div>
            )}

            <AddressBlock address={userDetails.address} />

            {(userDetails.contact.email || userDetails.contact.phone) && (
              <div className={styles.contactInfo}>
                {userDetails.contact.email && (
                  <div>✉️ {userDetails.contact.email}</div>
                )}
                {userDetails.contact.phone && (
                  <div>📞 {userDetails.contact.phone}</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* CLIENT CARD */}
        <div className={`${styles.card} ${styles.clientCard}`}>
          <h2 className={styles.cardTitle}>🎯 To</h2>
          <div className={styles.cardContent}>
            <strong className={styles.partyName}>
              {clientDetails.companyName || clientDetails.name}
            </strong>
            {clientDetails.companyName && (
              <div className={styles.subtitle}>Attn: {clientDetails.name}</div>
            )}

            {clientDetails.taxId && (
              <div className={styles.taxId}>Tax ID: {clientDetails.taxId}</div>
            )}

            <AddressBlock address={clientDetails.address} />
          </div>
        </div>
      </section>

      {/* SHIPPING (Conditional Bubble) */}
      {shipToDiffrentAddress && clientDetails.shippingAddress && (
        <div className={styles.shippingBubble}>
          <span className={styles.shipIcon}>🚚</span>
          <div className={styles.shipContent}>
            <strong>Ship To:</strong>{" "}
            {clientDetails.shippingAddress.name || clientDetails.name},{" "}
            <AddressBlock address={clientDetails.shippingAddress.address} />
          </div>
        </div>
      )}

      {/* ---------- DESCRIPTION ---------- */}
      {description && (
        <section className={styles.descriptionBox}>
          <h3>📝 Note</h3>
          <p>{description}</p>
        </section>
      )}

      {/* ---------- ITEMS TABLE ---------- */}
      <section className={styles.itemsSection}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.thDesc}>Item / Description</th>
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
      </section>

      {/* ---------- FOOTER AREA ---------- */}
      <div className={styles.footerLayout}>
        {/* LEFT: PAYMENT & SIGNATURE */}
        <div className={styles.footerLeft}>
          <PaymentDetails
            userDetails={userDetails}
            isReceipt={isReceipt}
            isCreditNote={isCreditNote}
            // Fun styling overrides
            paymentContainerClassName={styles.paymentBox}
            paymentTypeClassName={styles.paymentLabel}
            paymentDataClassName={styles.paymentMethod}
            labelClassName={styles.paymentLabel}
          />

          <div className={styles.signatureArea}>
            <Signature
              branding={userDetails.branding}
              issuerType={userDetails.issuerType}
              isQuote={isQuote}
              isReceipt={isReceipt}
              containerClassName={styles.sigContainer}
              textClassName={styles.sigText}
              labelClassName={styles.sigLabel}
            />
          </div>
        </div>

        {/* RIGHT: TOTALS CARD */}
        <div className={styles.summaryCard}>
          <div className={styles.sumRow}>
            <span>Subtotal</span>
            <span>{subtotal}</span>
          </div>

          {Number(discount) > 0 && (
            <div className={`${styles.sumRow} ${styles.discountRow}`}>
              <span>
                Discount
                {/* Only show percentage context if type is percentage */}
                {discountType === "percentage" && ` (${discount}%)`}
              </span>
              <span>- {discountTotal}</span>
            </div>
          )}

          {Number(tax) > 0 && (
            <div className={styles.sumRow}>
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
      </div>

      {/* ---------- FINAL FOOTER ---------- */}
      <footer className={styles.footer}>
        <p>
          🎉 {safe(documentDetails.footerNote, "Thanks for being awesome!")}
        </p>
      </footer>
    </article>
  );
});
