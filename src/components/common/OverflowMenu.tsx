import { useState, useEffect } from "react";

import MenuDotsVertical from "@/assets/icons/menu-dots-vertical.svg?react";

interface OverflowMenuOption {
  label: string;
  action: () => void;
  dataTestId?: string;
}

interface OverflowMenuProps {
  options: OverflowMenuOption[];
  iconSize?: number;
}

const OverflowMenu = ({ options, iconSize = 16 }: OverflowMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // 페이지 이동 시 메뉴 닫기
  useEffect(() => {
    const handleClick = () => {
      setIsOpen(false);
    };

    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [setIsOpen]);

  return (
    <nav className="relative inline-block align-middle leading-none">
      <button
        type="button"
        className="align-middle leading-none"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls="overflow-menu"
      >
        <MenuDotsVertical width={iconSize} height={iconSize} />
      </button>

      {isOpen && (
        <ul
          id="overflow-menu"
          role="menu"
          className="absolute right-0 z-10 w-max min-w-[90px] rounded-[4px] border border-outline bg-background-container text-center"
          style={{ top: "calc(100% + 7px)" }}
        >
          {options.map((option) => (
            <li
              key={option.label}
              role="menuitem"
              className="first:pt-[6px] last:pb-[6px] hover:bg-outline"
            >
              <button
                type="button"
                className="w-full p-[10px] text-body2 text-font-primary"
                onClick={() => {
                  option.action();
                  setIsOpen(false);
                }}
                data-testid={option.dataTestId}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

export default OverflowMenu;
