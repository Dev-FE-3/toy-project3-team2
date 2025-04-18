import { Button } from "./Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ModalDelete = ({ isOpen, onClose, onConfirm }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="flex h-40 w-[90%] max-w-[360px] flex-col items-center justify-center gap-2 rounded-md border-outline bg-background-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 헤더 */}
        <div className="mb-4 text-center">
          <h2 className="text-body1-bold text-font-primary">플레이리스트를 삭제하시겠습니까?</h2>
          <p className="mt-1.5 text-sub text-font-second">선택한 플레이리스트가 삭제됩니다</p>
        </div>

        {/* 모달 바디 */}

        <div className="flex justify-center gap-3">
          {/* 취소 버튼 */}
          <Button type="button" variant="secondary" onClick={onClose} className="w-24">
            닫기
          </Button>
          {/* 삭제 버튼 */}
          <Button type="button" onClick={onConfirm} className="w-24">
            삭제
          </Button>
        </div>
      </div>
    </div>
  );
};
