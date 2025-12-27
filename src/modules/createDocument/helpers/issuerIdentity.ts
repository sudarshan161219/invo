import type { UserDetails } from "@/types/document_types/types";

export function resolveIssuerIdentity(userDetails: UserDetails) {
  const { issuerType, business, contact } = userDetails;

  // 1. GUARD CLAUSE: If it is NOT a business, return contact info immediately.
  // This ensures we ignore any business data that might accidentally exist in the state.
  if (issuerType === "individual") {
    return {
      title: contact.name,
      subtitle: null,
    };
  }

  // 2. Handle Business Logic (We know it is 'business' at this point)
  if (issuerType === "business") {
    if (business?.tradeName) {
      return {
        title: business.tradeName,
        subtitle: business.legalName ?? null,
      };
    }

    if (business?.legalName) {
      return {
        title: business.legalName,
        subtitle: null,
      };
    }
  }

  // 3. Fallback: User selected "Business" but hasn't entered business names yet
  return {
    title: contact.name,
    subtitle: null,
  };
}
