// import {
//   type ForwardRefExoticComponent,
//   type RefAttributes,
//   forwardRef,
// } from "react";
// import { type TemplateProps } from "@/types/TemplateProps";
// import {
//   Minimal,
//   Fun,
//   Compact,
//   Corporate,
//   Modern,
// } from "@/modules/createDocument/components/export";
// import { useUIStore, type ThemeKey } from "@/store/documentStore/useUIStore";

// type TemplateComponent = ForwardRefExoticComponent<
//   TemplateProps & RefAttributes<HTMLElement>
// >;

// const templates: Record<ThemeKey, TemplateComponent> = {
//   modern: Modern,
//   minimal: Minimal,
//   corporate: Corporate,
//   fun: Fun,
//   compact: Compact,
// };

// // ref-forwarding wrapper
// export const ActiveTemplate = forwardRef<HTMLElement, TemplateProps>(
//   (_props, ref) => {
//     const { theme } = useUIStore();
//     const Template = templates[theme];
//     return <Template ref={ref} />;
//   }
// );

import {
  type ForwardRefExoticComponent,
  type RefAttributes,
  forwardRef,
} from "react";
import { type TemplateProps } from "@/types/TemplateProps";
import {
  Minimal,
  Fun,
  Compact,
  Corporate,
  Modern,
} from "@/modules/createDocument/components/export";
import { useUIStore, type ThemeKey } from "@/store/documentStore/useUIStore";

type TemplateComponent = ForwardRefExoticComponent<
  TemplateProps & RefAttributes<HTMLElement>
>;

const templates: Record<ThemeKey, TemplateComponent> = {
  modern: Modern,
  minimal: Minimal,
  corporate: Corporate,
  fun: Fun,
  compact: Compact,
};

// Change the ref type to HTMLDivElement since we are wrapping it in a div
export const ActiveTemplate = forwardRef<HTMLElement, TemplateProps>(
  (props, ref) => {
    const { theme } = useUIStore();
    const Template = templates[theme];

    return (
      /** * WRAPPER STRATEGY:
       * 1. ref={ref}: 'react-to-print' will grab this entire div.
       * 2. id="print-target": Your Global CSS (Ctrl+P) will target this ID.
       * 3. width-fit: Ensures the div doesn't expand unnecessarily.
       */
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        id="print-target"
        className="w-fit mx-auto bg-white"
      >
        <Template {...props} />
      </div>
    );
  }
);
