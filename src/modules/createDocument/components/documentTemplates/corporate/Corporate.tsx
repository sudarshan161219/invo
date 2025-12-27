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

export const Corporate = forwardRef<HTMLElement, TemplateProps>(
  (_props, ref) => {
    const { form, getFormattedTotals, shipToDiffrentAddress } =
      useDocumentStore();

    // 1. Destructure Data
    const {
      userDetails,
      clientDetails,
      documentDetails,
      items,
      tax,
      discount,
      taxType,
    } = form;

    // 2. Destructure Totals with Aliasing (matches Compact pattern)
    const {
      subtotal,
      gst,
      discount: discountTotal,
      total,
    } = getFormattedTotals();

    // 3. Resolve Identity & Context
    const { documentType, title } = documentDetails;
    const { labels, isQuote, isReceipt, isCreditNote } =
      getDocumentContext(documentType);

    // Resolve Issuer (Sender) Info
    // We use specific resolved titles, but Corporate layout has a specific spot for them
    const { title: headerTitle } = resolveIssuerIdentity(userDetails);

    return (
      <article ref={ref} className={styles.invoice}>
        {/* Top Stripe Accent */}
        <div className={styles.topStripe}></div>

        {/* HEADER */}
        <header className={styles.header}>
          <div className={styles.branding}>
            <div className={styles.logoBox}>
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

            {/* Document Title (Invoice, Quote, etc.) */}
            <h1 className={styles.title}>{title}</h1>

            {/* ISSUER ADDRESS SECTION */}
            {/* Kept specific structure to preserve Corporate Layout */}
            <div className={styles.issuerDetails}>
              <h1 className={styles.companyName}>{headerTitle}</h1>
              <div className={styles.issuerAddress}>
                <AddressBlock address={userDetails.address} />

                {/* Business Tax ID */}
                {userDetails.business?.taxId && (
                  <div className="mt-1">
                    <span className={styles.taxId}>
                      {userDetails.business?.taxIdLabel || "Tax ID"}:{" "}
                      {userDetails.business.taxId}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Meta Data (Invoice #, Dates) */}
          <dl className={styles.meta}>
            <div className={styles.metaRow}>
              <dt>{labels.numberLabel}</dt>
              <dd>{safe(documentDetails.documentNumber)}</dd>
            </div>
            <div className={styles.metaRow}>
              <dt>{labels.dateLabel}</dt>
              <dd>{formatDate(documentDetails.issueDate)}</dd>
            </div>

            {/* Added Payment Terms Logic */}
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

            {/* Due Date (Hidden for Receipts) */}
            {!isReceipt && (
              <div className={styles.metaRow}>
                <dt>{labels.dueLabel}</dt>
                <dd>{formatDate(documentDetails.dueDate)}</dd>
              </div>
            )}

            {/* PO Number (Added for parity with Compact) */}
            {!isReceipt && documentDetails.poNumber && (
              <div className={styles.metaRow}>
                <dt>PO Number</dt>
                <dd>{safe(documentDetails.poNumber)}</dd>
              </div>
            )}
          </dl>
        </header>

        {/* PARTIES */}
        <section className={styles.parties}>
          {/* 1. BILL TO */}
          <div className={styles.partyCard}>
            <h2 className={styles.cardTitle}>{labels.toLabel}</h2>
            <div className={styles.partyContent}>
              {/* Logic borrowed from Compact: Prioritize Company Name */}
              {clientDetails.companyName ? (
                <>
                  <strong>{clientDetails.companyName}</strong>
                  <div className="text-sm opacity-90">{clientDetails.name}</div>
                </>
              ) : (
                <strong>{clientDetails.name}</strong>
              )}

              {/* Client Tax ID */}
              {clientDetails.taxId && (
                <div className="text-xs opacity-75 mt-1 mb-1">
                  Tax ID: {clientDetails.taxId}
                </div>
              )}

              {/* Reusable Address Block */}
              <div className="mt-1">
                <AddressBlock address={clientDetails.address} />
              </div>
            </div>
          </div>

          {/* 2. SHIP TO (Conditional) */}
          {shipToDiffrentAddress && clientDetails.shippingAddress && (
            <div className={styles.partyCard}>
              <h2 className={styles.cardTitle}>
                {labels.shipLabel || "Ship To"}
              </h2>
              <div className={styles.partyContent}>
                {/* Name Priority */}
                <strong className="block text-sm">
                  {clientDetails.shippingAddress.name || clientDetails.name}
                </strong>

                {/* Address */}
                <div className="mt-1">
                  <AddressBlock
                    address={clientDetails.shippingAddress.address}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. PAYMENT / FROM */}
          <div className={styles.partyCard}>
            <h2 className={styles.cardTitle}>
              {isReceipt || isCreditNote ? labels.fromLabel : "Payment Details"}
            </h2>
            <div className={styles.partyContent}>
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

        {/* ITEMS (Stripe Theme Table) */}
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
                  <td className={styles.colDesc}>
                    <div className={styles.descText}>
                      {safe(it.description)}
                    </div>
                  </td>
                  <td className={styles.colQty}>{it.quantity}</td>
                  <td className={styles.colRate}>{it.rate}</td>
                  <td className={styles.colAmount}>{it.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* SUMMARY */}
        <section className={styles.summary}>
          <dl>
            <div className={styles.summaryRow}>
              <dt>Subtotal</dt>
              <dd>{subtotal}</dd>
            </div>

            {/* Conditional Discount */}
            {Number(discount) > 0 && (
              <div className={styles.summaryRow}>
                <dt>Discount</dt>
                <dd>- {discountTotal}</dd>
              </div>
            )}

            {/* Conditional Tax */}
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
              <dt>{labels.totalLabel}</dt>
              <dd>{total}</dd>
            </div>
          </dl>
        </section>

        {/* FOOTER AREA */}
        <div className={styles.footerRegion}>
          <section className={styles.signatureSection}>
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
          <footer className={styles.footer}>
            <p>
              {safe(documentDetails.footerNote, "Thank you for your business!")}
            </p>
          </footer>
        </div>
      </article>
    );
  }
);
