import { FormMode } from "@/types/FormMode";

interface Props {
  mode: FormMode;
  confirmChecked: boolean;
  setConfirmChecked: (value: boolean) => void;
  clearErrors: () => void;
}

export function SubmitSection({
  mode,
  confirmChecked,
  setConfirmChecked,
  clearErrors,
}: Props) {
  if (mode === "VIEW") return null;

  return (
    <>
      <label className="m-3 mt-10 text-red-500 flex items-center justify-center">
        <input
          type="checkbox"
          className="mr-4 w-6 h-6"
          checked={confirmChecked}
          onChange={(e) => setConfirmChecked(e.target.checked)}
        />
        ยืนยันการส่งข้อมูล
      </label>

      <div className="flex justify-center">
        <button
          type="submit"
          className={`w-full ${
            !confirmChecked ? "disable-button" : "confirm-button"
          }`}
          disabled={!confirmChecked}
          onClick={() => clearErrors()}
        >
          {mode === "EDIT" ? "แก้ไขการแจ้งเรื่อง" : "แจ้งเรื่อง"}
        </button>
      </div>
    </>
  );
}
