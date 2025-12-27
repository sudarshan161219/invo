import { useDocumentStore } from "@/store/documentStore/useDocumentStore";

export const useUnfinishedData = () => {
  const { form } = useDocumentStore();
  const { userDetails, clientDetails, items } = form;
  // 1. Check if User Profile is started
  const hasUserProfile = Boolean(
    // Basic Info
    userDetails.contact.name?.trim() ||
      userDetails.contact.email?.trim() ||
      userDetails.contact.phone?.trim() ||
      // Address Fields (Added as requested)
      userDetails.address.city?.trim() ||
      userDetails.address.country?.trim() ||
      userDetails.address.state?.trim() ||
      userDetails.address.line1?.trim() ||
      userDetails.address.postalCode?.trim()
  );
  // 2. Check if Client Data is started
  const hasClientData = Boolean(
    clientDetails.name?.trim() || clientDetails.companyName?.trim()
  );

  // 3. Check if Items are added (ignoring the default empty row)
  const hasItems = items.some(
    (item) => item.description?.trim() || item.rate > 0 || item.quantity !== 1
  );

  // Overall: Do we have ANY data?
  const hasUnsavedWork = hasUserProfile || hasClientData || hasItems;

  return { hasUnsavedWork, hasUserProfile };
};
