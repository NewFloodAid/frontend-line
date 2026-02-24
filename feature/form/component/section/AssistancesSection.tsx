import { useFormContext, useFieldArray } from "react-hook-form";
import type { ReportFormData } from "@/types/ReportFormData";
import { AssistanceTypes } from "@/types/AssistanceTypes";

interface AssistanceSectionProps {
  assistanceTypes: AssistanceTypes[];
}

export default function AssistancesSection({
  assistanceTypes,
}: AssistanceSectionProps) {
  const { control, watch, setValue } = useFormContext<ReportFormData>();

  const { fields } = useFieldArray({
    control,
    name: "reportAssistances",
  });

  const assistances = watch("reportAssistances");

  const handleCheck = (index: number, checked: boolean) => {
    if (checked) {
      assistances.forEach((_, i) => {
        setValue(`reportAssistances.${i}.isActive`, i === index);
        setValue(`reportAssistances.${i}.quantity`, i === index ? 1 : 0);
      });
    } else {
      setValue(`reportAssistances.${index}.isActive`, false);
      setValue(`reportAssistances.${index}.quantity`, 0);
    }
  };

  return (
    <fieldset>
      <div className="flex flex-row">
        <label>เลือกเรื่องที่ต้องการแจ้งเหตุ</label>
        <label className="text-red-500">*</label>
      </div>
      {fields.map((field, index) => (
        <label key={field.id} className="m-3 flex items-center">
          <input
            type="checkbox"
            className="mr-4 w-6 h-6"
            checked={
              assistances[index]?.isActive ||
              assistances[index]?.quantity > 0 ||
              false
            }
            onChange={(e) => handleCheck(index, e.target.checked)}
          />
          {assistanceTypes[index].name}
        </label>
      ))}
    </fieldset>
  );
}
