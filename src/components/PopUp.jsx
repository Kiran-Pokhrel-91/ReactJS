const PopUp = ({ showPopup, popupMessage }) => {
  if (!showPopup) return null;
  const popupStyle = {
    position: "fixed",
    top: "20px",
    left: "50%",
    transform: showPopup
      ? "translateX(-50%) translateY(0)"
      : "translateX(-50%) translateY(-20px)",
    background: "#21a6d7",
    color: "white",
    padding: "12px 20px",
    borderRadius: "6px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    zIndex: 9999,
    opacity: showPopup ? 1 : 0,
    pointerEvents: showPopup ? "auto" : "none",
    transition: "opacity 0.5s ease, transform 0.5s ease",
  };

  return <section style={popupStyle}>{popupMessage}</section>;
};

export default PopUp;
