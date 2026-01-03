interface Props {
  info: string;
  close: () => void;
}

export default function InfoPopup({ info, close }: Props) {
  return (
    <>
      <div className="fixed inset-0 bg-white/50 flex justify-center items-center z-[9999]">
        <div className="bg-white/95 p-10 w-full">
          <div className="flex justify-center mb-4">
            <img
              src="/icons/info.png"
              alt="info"
              className="w-14 h-14 mx-auto mb-4"
            />
          </div>
          <p className="text-gray-800 text-center">{info}</p>
          <div className="flex flex-row justify-center gap-20">
            <button onClick={close} className="confirm-button w-20">
              ตกลง
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
