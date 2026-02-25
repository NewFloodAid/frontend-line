import { useFormContext } from "react-hook-form";
import type { ReportFormData } from "@/types/ReportFormData";

export default function AdditionalDetailSection() {
  const { register } = useFormContext<ReportFormData>();

  return (
    <fieldset className="my-3">
      <label>แจ้งรายละเอียดสถานการณ์</label>
      <textarea
        {...register("additionalDetail")}
        className="additional"
        placeholder="อธิบายรายละเอียด ณ จุดที่เกิดปัญหา และจุดที่ตั้งคร่าว ๆ"
      />
    </fieldset>
  );
}
