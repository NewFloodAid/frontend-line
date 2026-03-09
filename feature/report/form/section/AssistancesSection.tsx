import { useFieldArray, useFormContext } from "react-hook-form";
import type { ReportFormData } from "@/types/ReportFormData";
import { AssistanceTypes } from "@/types/AssistanceTypes";

interface AssistanceSectionProps {
  assistanceTypes: AssistanceTypes[];
}

function normalizeText(value?: string | null): string {
  return value?.trim() ?? "";
}

export default function AssistancesSection({ assistanceTypes }: AssistanceSectionProps) {
  const { control, watch, setValue } = useFormContext<ReportFormData>();

  const { fields } = useFieldArray({
    control,
    name: "reportAssistances",
  });

  const assistances = watch("reportAssistances") ?? [];

  const handleCheck = (index: number, checked: boolean) => {
    setValue(`reportAssistances.${index}.isActive`, checked, {
      shouldDirty: true,
      shouldValidate: true,
    });

    setValue(`reportAssistances.${index}.quantity`, checked ? 1 : 0, {
      shouldDirty: true,
      shouldValidate: true,
    });

    if (!checked) {
      setValue(`reportAssistances.${index}.extraDetail`, "", {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  return (
    <fieldset>
      <div className="flex flex-row">
        <label>เลือกเรื่องที่ต้องการแจ้งเหตุ</label>
        <label className="text-red-500">*</label>
      </div>

      {fields.map((field, index) => {
        const assistance = assistances[index];
        const assistanceTypeId = assistance?.assistanceType?.id;
        const assistanceType =
          assistanceTypes.find((type) => type.id === assistanceTypeId) ?? assistanceTypes[index];

        const isSelected = Boolean(assistance?.isActive) || (assistance?.quantity ?? 0) > 0;

        const extraFieldLabel = normalizeText(assistanceType?.extraFieldLabel);
        const extraFieldPlaceholder = normalizeText(assistanceType?.extraFieldPlaceholder);
        const isExtraRequired = Boolean(assistanceType?.extraFieldRequired);

        return (
          <div key={field.id} className="my-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-4 h-6 w-6"
                checked={isSelected}
                onChange={(e) => handleCheck(index, e.target.checked)}
              />
              {assistanceType?.name}
            </label>

            {isSelected && extraFieldLabel && (
              <div className="ml-10 mt-2">
                <div className="mb-1 flex items-center text-[15px] font-semibold text-[#24314f]">
                  <span>{extraFieldLabel}</span>
                  {isExtraRequired && <span className="ml-1 text-red-500">*</span>}
                </div>
                <input
                  type="text"
                  value={assistances[index]?.extraDetail ?? ""}
                  onChange={(e) => {
                    setValue(`reportAssistances.${index}.extraDetail`, e.target.value, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }}
                  placeholder={extraFieldPlaceholder || "กรอกข้อมูลเพิ่มเติม"}
                  className="w-full rounded-xl border border-[#CED4DA] px-4 py-3 text-[15px]"
                />
              </div>
            )}
          </div>
        );
      })}
    </fieldset>
  );
}
