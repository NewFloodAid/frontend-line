interface Props {
  id: number;
  handleDelete: (id: number) => void;
  handleCancel: () => void;
}

function ConfirmModal({ id, handleDelete, handleCancel }: Props) {
  return (
    <>
      <div className="fixed inset-0 bg-white/50 flex justify-center items-center z-[9999]">
        <div className="bg-white/95 p-10 w-full">
          <h2 className="text-red-600 text-center">
            คำร้องขอกำลังดำเนินการ!!!
          </h2>
          <h1 className="my-5 text-center">ยกเลิกคำร้องขอ</h1>
          <div className="flex flex-row justify-center gap-20">
            <button
              onClick={() => handleDelete(id)}
              className="confirm-button w-20"
            >
              ใช่
            </button>
            <button onClick={handleCancel} className="cancel-button w-20">
              ไม่
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ConfirmModal;
