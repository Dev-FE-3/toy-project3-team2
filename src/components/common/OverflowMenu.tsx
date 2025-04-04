import { useState } from "react"
import IconMenu from '../../assets/icons/menu-dots-vertical.svg?react'

interface OverflowMenuOption {
  label: string;
  action: () => void;
}

interface OverflowMenuProps {
  options: OverflowMenuOption[];
  iconSize?: number;
}

const OverflowMenu = ({ options, iconSize = 16 }: OverflowMenuProps) => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="inline-block relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="overflow-menu"
      >
        <IconMenu width={iconSize} height={iconSize} />
      </button>

      {open && (
        <ul
          id="overflow-menu"
          role="menu"
          className="absolute top-full right-0 w-max min-w-[90px] text-center border border-outline rounded-[4px] bg-background-container"
        >
          {options.map((option) => (
            <li
              key={option.label}
              role="menuitem"
              className="first:pt-[6px] last:pb-[6px] hover:bg-outline"
            >
              <button
                type="button"
                className="w-full p-[10px] text-font-primary"
                onClick={() => {
                  option.action();
                  setOpen(false);
                }}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </nav>
  )
}

export default OverflowMenu