"use client";
import { FormProvider, UseFormReturn } from "react-hook-form";
import { ReportFormData } from "@/types/ReportFormData";
import { AssistanceTypes } from "@/types/AssistanceTypes";
import { Report, ReportImage } from "@/types/Report";
import PersonalSection from "@/feature/report/form/section/PersonalSection";
import AssistancesSection from "@/feature/report/form/section/AssistancesSection";
import AdditionalDetailSection from "@/feature/report/form/section/AdditionalDetailSection";
import ImageSection from "@/feature/report/form/section/ImageSection";
import ErrorMessage from "./component/FormErrorMessage";
import FormCardLayout from "./FormCardLayout";
import StatusBadge from "@/feature/report/components/StatusBadge";
import { FormMode } from "@/types/FormMode";
import { SubmitSection } from "./section/SubmitSection";

interface Props {
  mode: FormMode;
  methods: UseFormReturn<any>;
  onSubmit: (data: ReportFormData) => void;
  isPending: boolean;

  assistanceTypes: AssistanceTypes[];
  images: File[];
  setImages: (files: File[]) => void;

  oldImages: ReportImage[];
  deletedImageIds: number[];
  setDeletedImageIds: (ids: number[]) => void;

  confirmChecked: boolean;
  setConfirmChecked: (value: boolean) => void;

  existingReport?: Report;
}

export default function ReportFormUI({
  mode,
  methods,
  onSubmit,
  isPending,
  assistanceTypes,
  images,
  setImages,
  oldImages,
  deletedImageIds,
  setDeletedImageIds,
  confirmChecked,
  setConfirmChecked,
  existingReport,
}: Props) {
  const {
    clearErrors,
    formState: { errors },
  } = methods;

  if (mode === "NOTFOUND") return;

  return (
    <FormCardLayout isPending={isPending}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <fieldset disabled={mode === "VIEW"}>
            {mode == "VIEW" && existingReport && (
              <div className="mb-5 font-semibold flex justify-center">
                <StatusBadge status={existingReport.reportStatus.status} />
              </div>
            )}
            <PersonalSection mode={mode} />
            <AssistancesSection assistanceTypes={assistanceTypes} />
            <ErrorMessage
              message={errors.reportAssistances?.message as string}
            />
            <AdditionalDetailSection />
            <ImageSection
              mode={mode}
              onImagesChange={setImages}
              deletedImageIds={deletedImageIds}
              setDeletedImageIds={setDeletedImageIds}
              initialImages={oldImages}
            />
            <ErrorMessage message={errors.images?.message as string} />

            <SubmitSection
              mode={mode}
              confirmChecked={confirmChecked}
              setConfirmChecked={setConfirmChecked}
              clearErrors={clearErrors}
            />
          </fieldset>
        </form>
      </FormProvider>
    </FormCardLayout>
  );
}
