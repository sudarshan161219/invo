// import type { Address } from "@/types/document_types/types";

// export function AddressBlock({ address }: { address: Address | undefined }) {
//   return (
//     <>
//       {address?.line1}
//       {address?.line2 && (
//         <>
//           <br />
//           {address?.line2}
//         </>
//       )}
//       <br />
//       {address?.city}, {address?.state} {address?.postalCode}
//       {address?.country && (
//         <>
//           <br />
//           {address?.country}
//         </>
//       )}
//     </>
//   );
// }

import type { Address } from "@/types/document_types/types";

export function AddressBlock({ address }: { address?: Address }) {
  if (!address) return null;

  const cityLine = [address.city, address.state, address.postalCode]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      {address.line1}

      {address.line2 && (
        <>
          <br />
          {address.line2}
        </>
      )}

      {cityLine && (
        <>
          <br />
          {cityLine}
        </>
      )}

      {address.country && (
        <>
          <br />
          {address.country}
        </>
      )}
    </>
  );
}
