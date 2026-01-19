import { createPortal } from "react-dom";

const PopUp = ({ showPopup, popupMessage }) => {
  if (!showPopup) return null;

  return createPortal(
    <div
      className={`
        fixed bottom-5 left-1/2 -translate-x-1/2
        bg-linear-to-r from-indigo-500 to-purple-500
        text-white px-6 py-3 rounded-2xl shadow-2xl
        z-50
        flex items-center gap-3
        transform transition-all duration-500
        ${showPopup ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}
      `}
    >
      {/* Icon */}
      <span className="inline-block w-5 h-5 text-white">
        ✅
      </span>

      {/* Message */}
      <p className="font-medium">{popupMessage}</p>
    </div>,
    document.querySelector("#popup-content")
  );
};

export default PopUp;
