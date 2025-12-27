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

export const Compact = forwardRef<HTMLElement, TemplateProps>((_props, ref) => {
  const { form, getFormattedTotals, shipToDiffrentAddress } =
    useDocumentStore();
  const {
    userDetails,
    clientDetails,
    documentDetails,
    description,
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

  const { documentType, title } = documentDetails;
  const { labels, isQuote, isReceipt, isCreditNote } =
    getDocumentContext(documentType);
  const { title: headerTitle, subtitle: legalNameSubtitle } =
    resolveIssuerIdentity(userDetails);
  const isBusiness = userDetails.issuerType === "business";
  const business = userDetails.business;

  return (
    <article ref={ref} className={styles.invoice}>
      {/* LEFT ACCENT STRIPE */}
      <div className={styles.leftStripe} />

      <div className={styles.content}>
        {/* HEADER */}
        <header className={styles.header}>
          {/* Brand Column */}
          <div className={styles.brandCol}>
            {userDetails.branding.logo ? (
              <Logo
                branding={userDetails.branding}
                className={styles.logoImg}
                id="invoice-logo"
              />
            ) : (
              <div className={styles.logoPlaceholder}>LOGO HERE</div>
            )}

            {/* MAIN TITLE (Trade Name OR Legal Name OR Contact Name) */}
            <h1 className={styles.companyName}>{headerTitle}</h1>

            {/* SUBTITLE: Legal Name (Only if Trade Name is the main title) */}
            {legalNameSubtitle && (
              <p className="text-[0.65rem] font-medium opacity-75 leading-tight mb-1">
                {legalNameSubtitle}
              </p>
            )}

            {/* Show Tax ID if Business Mode */}
            {isBusiness && business?.taxId && (
              <p className={styles.taxLine}>
                {business.taxIdLabel || "Tax ID"}: {business.taxId}
              </p>
            )}

            <AddressBlock address={userDetails.address} />
          </div>

          {/* Meta Column */}
          <div className={styles.metaCol}>
            <h2 className={styles.docTitle}>{title}</h2>
            <div className={styles.metaGrid}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>{labels.numberLabel}</span>
                <span className={styles.metaValue}>
                  {safe(documentDetails.documentNumber)}
                </span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>{labels.dateLabel}</span>
                <span className={styles.metaValue}>
                  {formatDate(documentDetails.issueDate)}
                </span>
              </div>
              {!isReceipt && documentDetails.paymentTerms !== undefined && (
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>{labels.termLabel}</span>
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
                  <span className={styles.metaLabel}>{labels.dueLabel}</span>
                  <span className={styles.metaValue}>
                    {formatDate(documentDetails.dueDate)}
                  </span>
                </div>
              )}
              {isReceipt && documentDetails.paymentMethod && (
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Paid Via:</span>
                  <span className={styles.metaValue}>
                    {documentDetails.paymentMethod}
                  </span>
                </div>
              )}
              {!isReceipt && documentDetails.poNumber && (
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>PO Number</span>
                  <span className={styles.metaValue}>
                    {safe(documentDetails.poNumber)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* INFO SECTION (Addresses + Payment) */}
        <section className={styles.infoSection}>
          {/* COL 1: BILL TO (Now always clientDetails) */}
          <div className={styles.infoCol}>
            <h3 className={styles.colTitle}>{labels.toLabel}</h3>
            <div className={styles.addressBlock}>
              {/* 1. Name & Company Logic */}
              {clientDetails.companyName ? (
                <>
                  <strong className="block text-sm">
                    {clientDetails.companyName}
                  </strong>
                  <div className="text-xs opacity-80 mb-1">
                    Attn: {clientDetails.name}
                  </div>
                </>
              ) : (
                <strong className="block text-sm">{clientDetails.name}</strong>
              )}

              {/* 2. Tax ID */}
              {clientDetails.taxId && (
                <div className="text-[10px] font-medium mt-0.5 mb-1 opacity-90">
                  Tax ID: {clientDetails.taxId}
                </div>
              )}

              {/* 3. Address */}
              <div className={styles.addrText}>
                <AddressBlock address={clientDetails.address} />
              </div>

              {/* 4. CONTACT DETAILS (New) */}
              {(clientDetails.email || clientDetails.phone) && (
                <div className="mt-2 text-[10px] opacity-75 leading-tight">
                  {clientDetails.email && (
                    <div className="mb-0.5">{clientDetails.email}</div>
                  )}
                  {clientDetails.phone && <div>{clientDetails.phone}</div>}
                </div>
              )}
            </div>
          </div>

          {/* COL 2: SHIP TO (Now always clientDetails) */}
          {/* Render only if NOT same as billing AND shipping address exists */}
          {shipToDiffrentAddress && clientDetails.shippingAddress && (
            <div className={styles.infoCol}>
              <h3 className={styles.colTitle}>
                {labels.shipLabel || "Ship To"}
              </h3>

              <div className={styles.addressBlock}>
                {/* 1. Name (Fallback to Client Name if Shipping Name is empty) */}
                <strong className="block text-sm">
                  {clientDetails.shippingAddress.name || clientDetails.name}
                </strong>

                {/* 2. Address */}
                <div className={styles.addrText}>
                  <AddressBlock
                    address={clientDetails.shippingAddress.address}
                  />
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

          {/* COL 2: PAYMENT / ISSUER */}
          <div className={styles.infoCol}>
            <h3 className={styles.colTitle}>
              {isReceipt ? labels.fromLabel : "Payment Info"}
            </h3>
            {/* {renderPaymentDetails()} */}

            <PaymentDetails
              userDetails={userDetails}
              isReceipt={isReceipt}
              isCreditNote={isCreditNote}
              fallbackClassName={styles.sellerFallback}
              labelClassName={styles.label}
              emptyClassName={styles.emptyNote}
              paymentContainerClassName={styles.paymentContainer}
              paymentBlockClassName={styles.paymentBlock}
              paymentTypeClassName={styles.paymentType}
              paymentDataClassName={styles.paymentData}
            />
          </div>
        </section>

        {description && (
          <section className={styles.descriptionSection}>
            <p className={styles.descriptionText}>{description}</p>
          </section>
        )}

        {/* ITEMS */}
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
            </tbody>
          </table>
        </section>

        {/* BOTTOM SECTION (Signature + Totals) */}
        <div className={styles.bottomContainer}>
          {/* Left: Signature */}
          <div className={styles.bottomLeft}>
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
          </div>

          {/* Right: Totals */}
          <div className={styles.summary}>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>{subtotal}</span>
            </div>

            {/* Only show Discount if > 0 */}
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
        </div>

        {/* FOOTER */}
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
