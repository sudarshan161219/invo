import { useState } from "react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/button/Button";
import { ChevronDownIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import "react-day-picker/style.css";
import styles from "./index.module.css";

interface Props {
  label: string;
  id: string;
  htmlFor: string;
  date?: Date;
  onSelect: (date?: Date) => void;
}

export const DatePicker: React.FC<Props> = ({
  label,
  date,
  id,
  htmlFor,
  onSelect,
}) => {
  const [open, setOpen] = useState(false);
  const defaults = getDefaultClassNames();

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <Label htmlFor={htmlFor} className={styles.label}>
        {label}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger id={id} asChild>
          <Button
            variant="outline"
            className="w-full justify-between font-normal"
          >
            {date ? date.toLocaleDateString() : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <DayPicker
            mode="single"
            selected={date}
            onSelect={(d) => {
              onSelect(d);
              setOpen(false);
            }}
            classNames={{
              ...defaults,
              root: `${defaults.root}, ${styles.root}`,
              day: styles.day,
              selected: styles.selected,
              today: styles.today,
              disabled: defaults.disabled,
              chevron: styles.chevron,
              day_button: styles.day_button,
              button_next: styles.button_next,
              button_previous: styles.button_previous,
              nav: styles.nav,
              months: styles.months,
              month_caption: styles.month_caption,
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
