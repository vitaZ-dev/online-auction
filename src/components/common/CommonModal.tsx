import { CommonModalStyle } from "../../styles/CommonStyle";
import CloseIcon from "@mui/icons-material/Close";
import { CommonModalProps } from "../../types/component";

export default function CommonModal({
  isOpen,
  setDisplay,
  modalTitle = "",
  children,
  showFooter = false,
  handleModalOk,
  handleModalCancel,
}: CommonModalProps) {
  // tsx
  return (
    <CommonModalStyle
      className={`${isOpen ? "show" : ""}`}
      onClick={() => setDisplay(false)}
    >
      <div className="modal_wrap">
        <div
          className={`modal_box hide ${isOpen ? "show" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal_title">
            <span className="title">{modalTitle}</span>
            <button onClick={() => setDisplay(false)}>
              <CloseIcon />
            </button>
          </div>

          <div className="modal_contents">{children}</div>

          {showFooter && (
            <div className="modal_footer">
              <button
                className="ok"
                onClick={() => {
                  handleModalOk?.();
                  setDisplay(false);
                }}
              >
                확인
              </button>
              <button
                className="cancel"
                onClick={() => {
                  handleModalCancel?.();
                  setDisplay(false);
                }}
              >
                취소
              </button>
            </div>
          )}
        </div>
      </div>
    </CommonModalStyle>
  );
}
