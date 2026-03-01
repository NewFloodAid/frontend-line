import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  isPending?: boolean;
}

export default function FormCardLayout({ children, isPending }: Props) {
  return (
    <div className={isPending ? "pointer-events-none opacity-50" : ""}>
      <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
        <div className="w-full max-w-2xl bg-white p-5 shadow-md rounded-lg">
          {children}
        </div>
      </div>
    </div>
  );
}
