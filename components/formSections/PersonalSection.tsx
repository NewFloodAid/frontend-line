import React from "react";
import { useFormContext } from "react-hook-form";
import type { ReportFormData } from "@/types/ReportFormData";

export default function PersonalSection() {
  const { register } = useFormContext<ReportFormData>();

  return (
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
        {...register("mainPhoneNumber", { required: "กรุณากรอกเบอร์โทรศัพท์" })}
        className="input mb-4"
      />
      <label>เบอร์สำรอง</label>
      <input {...register("reservePhoneNumber")} className="input mb-4" />
    </fieldset>
  );
}
