import React from "react";
import styles from "./index.module.css";
import { InputGroup } from "@/components/inputgroup/InputGroup";
import { useDocumentStore } from "@/store/documentStore/useDocumentStore";
import { useShallow } from "zustand/react/shallow";

export const ClientDetailsSection: React.FC = () => {
  const { updateClientDetails, updateClientAddress, clientDetails } =
    useDocumentStore(
      useShallow((state) => ({
        updateClientDetails: state.updateClientDetails,
        updateClientAddress: state.updateClientAddress,
        clientDetails: state.form.clientDetails,
      }))
    );

  const id = "client";
  const makeId = (suffix: string) => (id ? `${id}-${suffix}` : undefined);

  return (
    <div className={styles.clientContainer}>
      <h3 className="font-semibold text-muted-foreground mb-3">
        Client Details
      </h3>

      <div className={styles.formGrid}>
        {/* 1. NAME & TAX ID */}
        <InputGroup
          id={makeId("clientName")}
          label="Client Name / Business"
          value={clientDetails.name}
          onChange={(v) => updateClientDetails({ name: v })}
          placeholder="e.g. Acme Corp"
        />
        <InputGroup
          id={makeId("clientTaxId")}
          label="Client Tax ID"
          value={clientDetails.taxId || ""}
          onChange={(v) => updateClientDetails({ taxId: v })}
          placeholder="GSTIN / VAT / EIN"
        />

        {/* 2. CONTACT */}
        <InputGroup
          id={makeId("clientEmail")}
          label="Client Email"
          type="email"
          value={clientDetails.email}
          onChange={(v) => updateClientDetails({ email: v })}
          placeholder="billing@acme.com"
        />
        <InputGroup
          id={makeId("clientPhone")}
          label="Phone"
          placeholder="+91 98765 43210"
          value={clientDetails.phone || ""}
          onChange={(v) => updateClientDetails({ phone: v })}
        />

        {/* 3. BILLING ADDRESS */}
        <InputGroup
          id={makeId("clientAddress1")}
          label="Street Address (line 1)"
          placeholder="House no, Street name"
          value={clientDetails.address.line1}
          onChange={(v) => updateClientAddress({ line1: v })}
        />
        <InputGroup
          id={makeId("clientAddress2")}
          label="Street Address (line 2)"
          placeholder="Apartment, Suite, Landmark"
          value={clientDetails.address.line2 ?? ""}
          onChange={(v) => updateClientAddress({ line2: v })}
        />
        <InputGroup
          id={makeId("clientCity")}
          label="City"
          placeholder="City"
          value={clientDetails.address.city}
          onChange={(v) => updateClientAddress({ city: v })}
        />
        <InputGroup
          id={makeId("clientState")}
          label="State / Province"
          value={clientDetails.address.state}
          placeholder="State"
          onChange={(v) => updateClientAddress({ state: v })}
        />
        <InputGroup
          id={makeId("clientPincode")}
          label="Zip / Postal Code"
          placeholder="123456"
          value={clientDetails.address.postalCode}
          onChange={(v) => updateClientAddress({ postalCode: v })}
        />
        <InputGroup
          id={makeId("clientCountry")}
          label="Country"
          className={styles.fullWidth}
          placeholder="Country"
          value={clientDetails.address.country ?? ""}
          onChange={(v) => updateClientAddress({ country: v })}
        />
      </div>
    </div>
  );
};
