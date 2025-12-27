import { InputGroup } from "@/components/inputgroup/InputGroup";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/button/Button";
import { Section } from "@/components/section/Section";
import { useDocumentStore } from "@/store/documentStore/useDocumentStore";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.css";
import { toast } from "sonner";
import type { PaymentMethods } from "@/types/document_types/types";
import { Switch } from "@/components/ui/switch";

export const UserDetailsPage = () => {
  const {
    form,
    updateUserDetails,
    updateUserContact,
    updateUserAddress,
    updateUserBusiness,
    setUserLogo,
    setUserSignature,
    setUserLogoEnabled,
    setUserSignatureEnabled,
    openSignatureModal,
  } = useDocumentStore();

  const userDetails = form.userDetails;
  const navigate = useNavigate();

  /* ----------------------------------------------------------------
     VALIDATION & SAVE
  ---------------------------------------------------------------- */
  const saveAndContinue = () => {
    const { contact, address, issuerType, business } = userDetails;

    if (!contact.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!contact.email.trim()) {
      toast.error("Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contact.email)) {
      toast.error("Enter a valid email address");
      return;
    }

    if (
      !address.line1 ||
      !address.city ||
      !address.state ||
      !address.postalCode ||
      !address.country
    ) {
      toast.error("Complete address is required");
      return;
    }

    if (issuerType === "business") {
      if (!business?.legalName?.trim()) {
        toast.error("Legal business name is required");
        return;
      }
    }

    navigate("/create");
  };

  /* ----------------------------------------------------------------
     HANDLERS
  ---------------------------------------------------------------- */
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      toast.error("Logo must be under 1MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () =>
      setUserLogo({
        dataUrl: reader.result as string,
        filename: file.name,
        type: file.type,
      });

    reader.readAsDataURL(file);
  };

  const handleRemoveSignature = () => {
    setUserSignature(null);
  };

  // Helper to update specific index in Payment Methods array
  const updatePaymentMethod = <K extends keyof PaymentMethods>(
    index: number,
    field: K,
    value: PaymentMethods[K]
  ) => {
    const updatedList = [...userDetails.paymentMethods];
    updatedList[index] = {
      ...updatedList[index],
      [field]: value,
    };
    updateUserDetails({ paymentMethods: updatedList });
  };

  const removePaymentMethod = (index: number) => {
    const filtered = userDetails.paymentMethods.filter((_, i) => i !== index);
    updateUserDetails({ paymentMethods: filtered });
  };

  const addPaymentMethod = (type: PaymentMethods["type"], label: string) => {
    const next: PaymentMethods = { type, label };
    updateUserDetails({
      paymentMethods: [...userDetails.paymentMethods, next],
    });
  };

  /* ----------------------------------------------------------------
     RENDER
  ---------------------------------------------------------------- */
  return (
    <div className={styles.container}>
      {/* --- ISSUER TYPE --- */}
      <Section className={styles.section} title="Account Type">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
            <div className="flex flex-col">
              <span className="font-medium text-sm">
                {userDetails.issuerType === "business"
                  ? "I am a Registered Business"
                  : "I am a Freelancer / Individual"}
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                {userDetails.issuerType === "business"
                  ? "Invoices will show your Legal Company Name & Tax ID."
                  : "Invoices will show your Personal Name."}
              </span>
            </div>
            <Switch
              className="cursor-pointer"
              checked={userDetails.issuerType === "business"}
              onCheckedChange={(checked) =>
                updateUserDetails({
                  issuerType: checked ? "business" : "individual",
                })
              }
            />
          </div>
        </div>
      </Section>

      {/* --- IDENTITY --- */}
      <Section className={styles.section} title="Identity">
        <InputGroup
          required
          label={
            userDetails.issuerType === "business"
              ? "Contact Person Name"
              : "Your Name"
          }
          id="name"
          placeholder="Full name"
          value={userDetails.contact.name}
          onChange={(v) => updateUserContact({ name: v })}
        />

        <div className={styles.inputGroup}>
          <InputGroup
            required
            label="Email"
            id="email"
            type="email"
            placeholder="name@example.com"
            value={userDetails.contact.email}
            onChange={(v) => updateUserContact({ email: v })}
          />

          <InputGroup
            label="Phone"
            id="phone"
            placeholder="Contact phone number"
            value={userDetails.contact.phone || ""}
            onChange={(v) => updateUserContact({ phone: v })}
          />
        </div>
      </Section>

      {/* --- ADDRESS --- */}
      <Section className={styles.section} title="Address">
        <InputGroup
          required
          label="Street Address (line 1)"
          id="StreetAddress"
          placeholder="Street name and number"
          value={userDetails.address.line1}
          onChange={(v) => updateUserAddress({ line1: v })}
        />

        <InputGroup
          label="Street Address (line 2)"
          id="StreetAddress"
          placeholder="Street name and number"
          value={userDetails.address.line2 ?? ""}
          onChange={(v) => updateUserAddress({ line2: v })}
        />

        <div className={styles.inputGroup}>
          <InputGroup
            required
            label="City"
            id="City"
            placeholder="City"
            value={userDetails.address.city}
            onChange={(v) => updateUserAddress({ city: v })}
          />

          <InputGroup
            required
            label="State / Province"
            id="StateProvince"
            placeholder="State or province"
            value={userDetails.address.state}
            onChange={(v) => updateUserAddress({ state: v })}
          />
        </div>

        <div className={styles.inputGroup}>
          <InputGroup
            required
            label="ZIP / Postal code"
            id="ZIPPostalCode"
            placeholder="ZIP or postal code"
            value={userDetails.address.postalCode}
            onChange={(v) => updateUserAddress({ postalCode: v })}
          />

          <InputGroup
            required
            label="Country"
            id="Country"
            placeholder="Country"
            value={userDetails.address.country || ""}
            onChange={(v) => updateUserAddress({ country: v })}
          />
        </div>
      </Section>

      {/* --- BUSINESS DETAILS (Conditional) --- */}
      {userDetails.issuerType === "business" && (
        <Section className={styles.section} title="Business & Tax Information">
          {/* 1. Legal Name */}
          <InputGroup
            required
            label="Legal Business Name"
            placeholder="e.g. Acme Corp Ltd."
            value={userDetails.business?.legalName || ""}
            onChange={(v) => updateUserBusiness({ legalName: v })}
          />

          {/* 2. Trade Name (New) */}
          <InputGroup
            label="Trade Name / DBA (Optional)"
            placeholder="e.g. Acme Solutions"
            value={userDetails.business?.tradeName || ""}
            onChange={(v) => updateUserBusiness({ tradeName: v })}
          />

          <div className={styles.inputGroup}>
            {/* 3. Tax Label */}
            <InputGroup
              label="Tax Label"
              placeholder="e.g. GSTIN, VAT, or EIN"
              value={userDetails.business?.taxIdLabel || ""}
              onChange={(v) => updateUserBusiness({ taxIdLabel: v })}
            />

            {/* 4. Tax ID */}
            <InputGroup
              label="Tax ID Number"
              placeholder="e.g. 12-3456789"
              value={userDetails.business?.taxId || ""}
              onChange={(v) => updateUserBusiness({ taxId: v })}
            />
          </div>
        </Section>
      )}

      {/* --- BRANDING --- */}
      <Section className={styles.section} title="Branding">
        <div className="space-y-8">
          {/* Logo Toggle */}
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="cursor-pointer" htmlFor="logo">
                  Enable Logo
                </Label>
                <Switch
                  checked={userDetails.branding.logoEnabled}
                  onCheckedChange={setUserLogoEnabled}
                />
              </div>
              {userDetails.branding.logoEnabled && (
                <p className="text-[0.8rem] text-muted-foreground">
                  For best results, use a{" "}
                  <span className="font-medium">transparent PNG</span> or
                  high-quality JPG.
                </p>
              )}
            </div>

            {userDetails.branding.logoEnabled && (
              <div className="mt-3">
                {userDetails.branding.logo ? (
                  <div className="flex flex-col items-start gap-3">
                    <img
                      src={userDetails.branding.logo.dataUrl}
                      className="h-16 w-auto border rounded-md object-contain bg-white"
                      alt="Logo Preview"
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="md"
                        onClick={() =>
                          document.getElementById("userLogoInput")?.click()
                        }
                      >
                        Replace
                      </Button>
                      <Button
                        variant="ghost"
                        size="md"
                        onClick={() => setUserLogo(null)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="h-20 border-2 border-dashed rounded-lg flex items-center justify-center bg-card hover:bg-border cursor-pointer transition"
                    onClick={() =>
                      document.getElementById("userLogoInput")?.click()
                    }
                  >
                    <span className="text-sm text-gray-500 font-medium">
                      + Upload Logo
                    </span>
                  </div>
                )}
                <input
                  id="userLogoInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
              </div>
            )}
          </div>

          {/* Signature Toggle */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="cursor-pointer" htmlFor="signature">
                Enable Signature
              </Label>
              <Switch
                id="signature"
                checked={userDetails.branding.signatureEnabled}
                onCheckedChange={setUserSignatureEnabled}
              />
            </div>

            {userDetails.branding.signatureEnabled && (
              <div className="mt-3">
                {userDetails.branding.signature ? (
                  <div className="flex flex-col items-start gap-3">
                    <div className="p-2 border rounded bg-white">
                      <img
                        src={userDetails.branding.signature.dataUrl}
                        className="h-12 w-auto object-contain"
                        alt="Signature Preview"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="md"
                        onClick={openSignatureModal}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="md"
                        onClick={handleRemoveSignature}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="h-20 border-2 border-dashed rounded-lg flex items-center justify-center bg-card hover:bg-border cursor-pointer transition"
                    onClick={openSignatureModal}
                  >
                    <span className="text-sm text-gray-500 font-medium">
                      + Add Signature
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* --- PAYMENT METHODS --- */}
      <Section
        className={styles.section}
        title="Payment Methods (Multiple Allowed)"
      >
        <div className="space-y-4">
          {userDetails.paymentMethods?.map((pm, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg bg-card flex flex-col gap-3"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-medium">
                  {pm.label || pm.type.toUpperCase()}
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removePaymentMethod(index)}
                >
                  Remove
                </Button>
              </div>

              {/* BANK INPUTS */}
              {pm.type === "bank" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <InputGroup
                    label="Bank Name"
                    value={pm.bankName || ""}
                    placeholder="e.g. Chase"
                    onChange={(v) => updatePaymentMethod(index, "bankName", v)}
                  />
                  <InputGroup
                    label="Account Name"
                    value={pm.accountName || ""}
                    placeholder="Account Holder Name"
                    onChange={(v) =>
                      updatePaymentMethod(index, "accountName", v)
                    }
                  />
                  <InputGroup
                    label="Account Number"
                    value={pm.accountNumber || ""}
                    placeholder="Account No. / IBAN"
                    onChange={(v) =>
                      updatePaymentMethod(index, "accountNumber", v)
                    }
                  />
                  <InputGroup
                    label="Bank Code"
                    value={pm.bankCode || ""}
                    placeholder="IFSC / SWIFT / Routing"
                    onChange={(v) => updatePaymentMethod(index, "bankCode", v)}
                  />
                </div>
              )}

              {/* UPI INPUT */}
              {pm.type === "upi" && (
                <InputGroup
                  label="UPI ID"
                  value={pm.upiId || ""}
                  placeholder="user@bank"
                  onChange={(v) => updatePaymentMethod(index, "upiId", v)}
                />
              )}

              {/* PAYPAL INPUT */}
              {pm.type === "paypal" && (
                <InputGroup
                  label="PayPal Email"
                  type="email"
                  value={pm.paypalEmail || ""}
                  onChange={(v) => updatePaymentMethod(index, "paypalEmail", v)}
                />
              )}

              {/* CASHAPP INPUT */}
              {pm.type === "cashapp" && (
                <InputGroup
                  label="CashTag"
                  value={pm.cashTag || ""}
                  placeholder="$username"
                  onChange={(v) => updatePaymentMethod(index, "cashTag", v)}
                />
              )}

              {/* CUSTOM INPUT */}
              {pm.type === "custom" && (
                <InputGroup
                  label="Payment Link / Info"
                  value={pm.customValue || ""}
                  placeholder="https://..."
                  onChange={(v) => updatePaymentMethod(index, "customValue", v)}
                />
              )}
            </div>
          ))}

          {/* ADD BUTTONS */}
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            <Button
              variant="outline"
              size="md"
              onClick={() => addPaymentMethod("bank", "Bank Transfer")}
            >
              + Bank Transfer
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => addPaymentMethod("upi", "UPI")}
            >
              + UPI
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => addPaymentMethod("paypal", "PayPal")}
            >
              + PayPal
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => addPaymentMethod("cashapp", "Cash App")}
            >
              + Cash App
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => addPaymentMethod("custom", "Custom")}
            >
              + Custom
            </Button>
          </div>
        </div>
      </Section>

      {/* --- SAVE BUTTON --- */}
      <Button className="w-full mt-8" size="lg" onClick={saveAndContinue}>
        Save & Create Invoice
      </Button>
    </div>
  );
};
