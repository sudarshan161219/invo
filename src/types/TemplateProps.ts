export interface TemplateProps {
  /** Root class override (used for print / preview variants) */
  className?: string;

  /** Whether the template is rendered for PDF / print */
  isPrint?: boolean;

  /** Optional scale factor for preview mode */
  scale?: number;
}
