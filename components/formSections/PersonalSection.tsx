import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import type { ReportFormData } from "@/types/ReportFormData";
import InfoPopup from "@/components/InfoPopup";

interface Props {
  mode: "CREATE" | "EDIT" | "VIEW" | undefined;
}

export default function PersonalSection({ mode }: Props) {
  const { register, watch } = useFormContext<ReportFormData>();

  // checkbox and popup behavior
  const [popup, setPopup] = useState(false);
  const isAnonymous = watch("isAnonymous");
  const info =
    "ชื่อของคุณจะถูกซ่อนจากผู้ใช้อื่น และจะแสดงเฉพาะผู้รับเรื่องเท่านั้น";

  useEffect(() => {
    if (mode === "VIEW") return;

    if (isAnonymous) {
      setPopup(true);
    }
  }, [isAnonymous]);

  return (
    <>
      {popup && <InfoPopup info={info} close={() => setPopup(false)} />}
      <fieldset>
        <label className="mb-4 flex justify-end ">
          <input
            type="checkbox"
            {...register("isAnonymous")}
            className="mr-4 w-6 h-6"
          />
          ไม่ระบุตัวตน
        </label>

        <div className="flex flex-row">
          <label>ชื่อ</label>
          <label className="text-red-500">*</label>
        </div>
        <input
          {...register("firstName", { required: "กรุณากรอกชื่อ" })}
          className="input mb-4"
        />

        <div className="flex flex-row">
          <label>นามสกุล</label>
          <label className="text-red-500">*</label>
        </div>

        <input
          {...register("lastName", { required: "กรุณากรอกนามสกุล" })}
          className="input mb-4"
        />

        <div className="flex flex-row">
          <label>เบอร์โทรศัพท์</label>
          <label className="text-red-500">*</label>
        </div>
        <input
          {...register("mainPhoneNumber", {
            required: "กรุณากรอกเบอร์โทรศัพท์",
          })}
          className="input mb-4"
        />
        <label>เบอร์สำรอง</label>
        <input {...register("reservePhoneNumber")} className="input mb-4" />
      </fieldset>
    </>
  );
}
