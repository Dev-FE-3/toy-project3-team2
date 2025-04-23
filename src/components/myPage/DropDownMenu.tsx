import { useRef } from "react";

import DROP_DOWN_MENU_OPTIONS from "@/constants/dropDownMenuOptions";
import ArrowBottom from "@/assets/icons/arrow-bottom.svg?react";

interface DropDownMenuProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  setSortOption: (option: string) => void;
  selected: { label: string; value: string };
}

const DropDownMenu = ({ isOpen, setIsOpen, setSortOption, selected }: DropDownMenuProps) => {
  const dropdownRef = useRef<HTMLButtonElement>(null);

  const toggleDropDown = () => {
    setIsOpen(!isOpen);
  };

  const selectOption = (option: (typeof DROP_DOWN_MENU_OPTIONS)[number]) => {
    setSortOption(option.value);
    setIsOpen(false);
  };

  return (
    <>
      <button
        ref={dropdownRef}
        className="inline-flex items-center justify-between text-body2"
        onClick={toggleDropDown}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls="dropdown-menu"
      >
        {selected.label}
        <ArrowBottom
          className={`ml-[4px] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <ul
        id="dropdown-menu"
        role="menu"
        className={`fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-[430px] overflow-hidden rounded-t-[10px] bg-background-container transition-transform duration-300 ease-in-out ${isOpen ? "pointer-events-auto translate-y-0" : "pointer-events-none translate-y-full"}`}
        style={{ willChange: "transform" }}
      >
        {DROP_DOWN_MENU_OPTIONS.map((option, index) => (
          <li key={option.value} role="menuitem" className="px-[10px] hover:bg-outline">
            <button
              className={`w-full py-[17px] text-body2 ${
                index !== DROP_DOWN_MENU_OPTIONS.length - 1 ? "border-b border-outline" : ""
              }`}
              onClick={() => selectOption(option)}
            >
              {option.label}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default DropDownMenu;
