import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FontSelectProps {
  value: string;
  onChange: (val: string) => void;
}

export const FontDropDown = ({ value, onChange }: FontSelectProps) => {
  const FONT_OPTIONS = [
    { label: "Caveat", value: "Caveat" },
    { label: "Great Vibes", value: "Great Vibes" },
    { label: "Alex Brush", value: "Alex Brush" },
    { label: "Dancing Script", value: "Dancing Script" },
  ];

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full cursor-pointer">
        <SelectValue placeholder="Select font" />
      </SelectTrigger>

      <SelectContent className="w-full cursor-pointer">
        {FONT_OPTIONS.map((f) => (
          <SelectItem
            className="w-full cursor-pointer"
            key={f.value}
            value={f.value}
          >
            {f.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
