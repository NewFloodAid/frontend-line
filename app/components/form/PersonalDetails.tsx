import React from "react";
import { UserDetails } from "@/app/types";
import { StatusEnum } from "@/app/status";

interface PersonalDetailsProps {
  userDetails: UserDetails;
  setUserDetails: React.Dispatch<
    React.SetStateAction<PersonalDetailsProps["userDetails"]>
  >;
  reportStatus: StatusEnum | undefined;
}

const fields = [
  { label: "ชื่อ", name: "firstName", required: true },
  { label: "นามสกุล", name: "lastName", required: true },
  { label: "เบอร์โทรศัพท์", name: "phone", required: true },
  { label: "เบอร์สำรอง", name: "alternatePhone", required: false },
];

const PersonalDetails: React.FC<PersonalDetailsProps> = ({
  userDetails,
  setUserDetails,
  reportStatus,
}) => {
  // console.log(reportStatus);
  const isEditable = reportStatus === StatusEnum.PENDING || !reportStatus;

  function handlePersonalDetailsChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    if (!isEditable) return;

    const { name, value } = e.target;

    if (name === "phone" || name === "alternatePhone") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;
    }

    setUserDetails((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div className="flex flex-col gap-4 mb-10">
      {/* ฟอร์มชื่อ นามสกุล และเบอร์โทร */}
      {fields.map(({ label, name, required }) => (
        <div key={name}>
          <label
            htmlFor={name}
            className="block font-medium text-gray-700 text-base"
          >
            {label}
          </label>
          <input
            disabled={!isEditable}
            id={name}
            type="text"
            name={name}
            value={userDetails[name as keyof typeof userDetails] as string}
            onChange={handlePersonalDetailsChange}
            className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-700 text-base"
            required={required}
            pattern={
              name === "phone" || name === "alternatePhone"
                ? "\\d{10}"
                : undefined
            }
            title="กรุณากรอกเบอร์โทรศัพท์ 10 หลัก"
            inputMode={
              name === "phone" || name === "alternatePhone"
                ? "numeric"
                : undefined
            }
          />
        </div>
      ))}
    </div>
  );
};

export default PersonalDetails;
