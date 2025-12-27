import React from "react";
import styles from "../index.module.css";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { NavLink } from "react-router-dom";
import { ImageAdjuster } from "@/components/ImageAdjuster/ImageAdjuster";
import { useShallow } from "zustand/react/shallow";
import { toast } from "sonner";
import { useDocumentStore } from "@/store/documentStore/useDocumentStore";

export const BrandingOptionsSection: React.FC = () => {
  const { setUserLogoEnabled, setUserSignatureEnabled, userDetails } =
    useDocumentStore(
      useShallow((state) => ({
        setUserLogoEnabled: state.setUserLogoEnabled,
        setUserSignatureEnabled: state.setUserSignatureEnabled,
        userDetails: state.form.userDetails,
      }))
    );

  const toggleLogo = (v: boolean) => {
    if (v === true && !userDetails.branding.logo) {
      toast.warning(
        <>
          <NavLink
            to="/user-details"
            className={({ isActive }) =>
              isActive ? styles.activeLink : styles.link
            }
          >
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              No logo added yet — add one in User Details to show it on
              invoices.
            </span>
          </NavLink>
        </>
      );
      setUserLogoEnabled(false);
      return;
    }
    setUserLogoEnabled(v);
  };

  const toggleSignature = (v: boolean) => {
    if (v === true && !userDetails.branding.signature) {
      toast.warning(
        <>
          <NavLink
            to="/user-details"
            className={({ isActive }) =>
              isActive ? styles.activeLink : styles.link
            }
          >
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              No signature added yet — add one in User Details to show it on
              invoices.
            </span>
          </NavLink>
        </>
      );

      setUserSignatureEnabled(false);
      return;
    }
    setUserSignatureEnabled(v);
  };

  return (
    <div className={styles.brandingContainer}>
      <h3>Branding Options</h3>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <Label className="cursor-pointer" htmlFor="logo">
              Show Logo
            </Label>
            <Switch
              className="cursor-pointer"
              id="logo"
              checked={userDetails.branding.logoEnabled}
              onCheckedChange={(v) => toggleLogo(v)}
            />
          </div>

          {userDetails.branding.logoEnabled && <ImageAdjuster />}
        </div>

        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <Label className="cursor-pointer" htmlFor="signature">
              Show Signature
            </Label>
            <Switch
              className="cursor-pointer"
              id="signature"
              checked={userDetails.branding.signatureEnabled}
              onCheckedChange={(v) => toggleSignature(v)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
