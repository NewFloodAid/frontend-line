interface Props {
  value: number;
  onChange: (value: number) => void;
}

export default function StatusFilter({ value, onChange }: Props) {
  return (
    <div className="sticky top-[78px] bg-[#505050] py-3 z-40">
      <div className="flex justify-center gap-4">
        {/* หน่วยงานรับเรื่องแล้ว */}
        <button
          onClick={() => onChange(1)}
          className={`px-4 py-2 rounded-full font-medium transition
            ${
              value === 1
                ? "bg-blue-500 text-white shadow-md"
                : "border border-blue-500 text-blue-500 hover:bg-blue-50"
            }`}
        >
          หน่วยงานรับเรื่องแล้ว
        </button>

        {/* คำขอได้รับการแก้ไข */}
        <button
          onClick={() => onChange(4)}
          className={`px-4 py-2 rounded-full font-medium transition
            ${
              value === 4
                ? "bg-green-500 text-white shadow-md"
                : "border border-green-500 text-green-500 hover:bg-green-50"
            }`}
        >
          คำขอได้รับการแก้ไข
        </button>
      </div>
    </div>
  );
}
