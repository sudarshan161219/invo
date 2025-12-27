import { InputGroup } from "@/components/inputgroup/InputGroup";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useShallow } from "zustand/react/shallow";
import { useDocumentStore } from "@/store/documentStore/useDocumentStore";

export const ShippingFieldsSection: React.FC = () => {
  const {
    updateClientShippingAddress,
    updateClientShippingName,
    shipToDiffrentAddress,
    shipToDiffrentAddressToggle,
    clientDetails,
  } = useDocumentStore(
    useShallow((state) => ({
      userDetails: state.form.userDetails,
      clientDetails: state.form.clientDetails,
      issuerMode: state.form.issuerMode,
      updateClientShippingAddress: state.updateClientShippingAddress,
      updateClientShippingName: state.updateClientShippingName,
      shipToDiffrentAddress: state.shipToDiffrentAddress,
      shipToDiffrentAddressToggle: state.shipToDiffrentAddressToggle,
    }))
  );

  const id = "shipping-address";

  const makeId = (suffix: string) => (id ? `${id}-${suffix}` : undefined);

  return (
    <div className="border-border  space-y-8">
      {/* --- SHIPPING TOGGLE --- */}
      <div className="flex items-center gap-2 mb-4 pt-4 border-t mt-4">
        <Switch
          id="shipping-toggle"
          className="cursor-pointer"
          // ✅ FIX 3: Logic Inversion
          // If "Same as Billing" is TRUE, "Different Address" switch should be OFF (unchecked)
          checked={shipToDiffrentAddress}
          onCheckedChange={shipToDiffrentAddressToggle}
        />
        <Label htmlFor="shipping-toggle" className="cursor-pointer">
          Ship to a different address
        </Label>
      </div>

      {/* --- SHIPPING FORM --- */}
      {/* ✅ FIX 4: Only show this if "Same as Billing" is FALSE */}
      {shipToDiffrentAddress && (
        <div className="bg-card p-4 rounded-md border animate-in fade-in slide-in-from-top-2 space-y-4">
          <InputGroup
            id={makeId("RecipientName")}
            label="Recipient Name"
            placeholder="Recipient Name"
            value={clientDetails.shippingAddress?.name || ""}
            onChange={(v) => updateClientShippingName(v)}
          />
          <InputGroup
            id={makeId("line1")}
            label="Address Line"
            value={clientDetails.shippingAddress?.address.line1 ?? ""}
            onChange={(v) => updateClientShippingAddress({ line1: v })}
            placeholder="Street, Suite, Area"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputGroup
              id={makeId("city")}
              label="City"
              placeholder="City"
              value={clientDetails.shippingAddress?.address.city ?? ""}
              onChange={(v) => updateClientShippingAddress({ city: v })}
            />
            <InputGroup
              id={makeId("state")}
              label="State/Province"
              placeholder="State"
              value={clientDetails.shippingAddress?.address.state ?? ""}
              onChange={(v) => updateClientShippingAddress({ state: v })}
            />
            <InputGroup
              id={makeId("postalCode")}
              label="Zip / Code"
              placeholder="Zip"
              value={clientDetails.shippingAddress?.address.postalCode ?? ""}
              onChange={(v) => updateClientShippingAddress({ postalCode: v })}
            />
          </div>
          <InputGroup
            id={makeId("country")}
            label="Country"
            placeholder="Country"
            value={clientDetails.shippingAddress?.address.country ?? ""}
            onChange={(v) => updateClientShippingAddress({ country: v })}
          />
        </div>
      )}
    </div>
  );
};
