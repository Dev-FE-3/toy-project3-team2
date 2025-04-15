import { useState, useRef } from "react";

import ArrowBottom from "../../assets/icons/arrow-bottom.svg?react";

const MENU_OPTIONS = ["업데이트순", "구독순", "좋아요순"];

interface DropDownMenuProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const DropDownMenu = ({ isOpen, setIsOpen }: DropDownMenuProps) => {
  const [selected, setSelected] = useState(MENU_OPTIONS[0]);
  const dropdownRef = useRef<HTMLButtonElement>(null);

  const toggleDropDown = () => {
    setIsOpen(!isOpen);
  };

  const selectOption = (option: string) => {
    setSelected(option);
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
        {selected}
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
        {MENU_OPTIONS.map((option, index) => (
          <li key={option} role="menuitem" className="px-[10px] hover:bg-outline">
            <button
              className={`w-full py-[17px] text-body2 ${
                index !== MENU_OPTIONS.length - 1 ? "border-b border-outline" : ""
              }`}
              onClick={() => selectOption(option)}
            >
              {option}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default DropDownMenu;
