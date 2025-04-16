import { toast, Slide } from "react-toastify";

export const showToast = (type: "success" | "error" | "info", message: string, options = {}) => {
  const baseOptions = {
    className: "toast",
    position: "top-center",
    autoClose: 2000, // 2초 후 자동 닫힘
    hideProgressBar: true, // 진행 바 숨김
    closeButton: false, // 닫힘 버튼 숨김
    icon: false,
    transition: Slide,
    style: {
      width: "100%",
      minHeight: "40px",
      padding: "12px",
      fontSize: "12px",
      color: "#222423",
      backgroundColor: "#E6E0E9",
      borderRadius: "4px",
    },
    ...options,
  } as const;

  toast[type](message, baseOptions);
};
