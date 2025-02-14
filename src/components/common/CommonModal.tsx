import { CommonModalStyle } from "../../styles/CommonStyle";
import CloseIcon from "@mui/icons-material/Close";

export interface CommonModalProps {
  setDisplay: React.Dispatch<React.SetStateAction<boolean>>;
  modalTitle: string;
  children?: React.ReactNode;
  showFooter?: boolean;
  handleModalOk?: () => void;
  handleModalCancel?: () => void;
}

export default function CommonModal({
  setDisplay,
  modalTitle = "Modal Title",
  children,
  showFooter = false,
  handleModalOk,
  handleModalCancel,
}: CommonModalProps) {
  // tsx
  return (
    <CommonModalStyle onClick={() => setDisplay(false)}>
      <div className="modal_wrap">
        <div className="modal_box" onClick={(e) => e.stopPropagation()}>
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
                onClick={() => {
                  handleModalOk?.();
                  setDisplay(false);
                }}
              >
                확인
              </button>
              <button
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
