import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { labelColors } from "@/lib/labelColors/labelColors";

export const ColorDropdown = ({
  selectedColor,
  onChange,
}: {
  selectedColor: string;

  onChange: (color: string) => void;
}) => {
  const selected = labelColors.find((c) => c.hex === selectedColor);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="px-4 w-full   py-1 border rounded-md flex items-center gap-2 hover:cursor-pointer">
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: selected?.hex || "#ccc" }}
        />
        <span>{selected?.name || "Choose Color"}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        {labelColors.map((color) => (
          <DropdownMenuItem
            key={color.hex}
            onClick={() => onChange(color.hex)}
            className="flex items-center gap-2   hover:cursor-pointer"
          >
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: color.hex }}
            />
            <span>{color.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
