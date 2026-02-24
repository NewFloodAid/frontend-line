"use client";
import { FormProvider, UseFormReturn } from "react-hook-form";
import { ReportFormData } from "@/types/ReportFormData";
import { AssistanceTypes } from "@/types/AssistanceTypes";
import { Report, ReportImage } from "@/types/Report";
import PersonalSection from "@/feature/form/component/section/PersonalSection";
import AssistancesSection from "@/feature/form/component/section/AssistancesSection";
import AdditionalDetailSection from "@/feature/form/component/section/AdditionalDetailSection";
import ImageSection from "@/feature/form/component/section/ImageSection";
import FormError from "./FormError";
import FormCardLayout from "./FormCardLayout";
import StatusBadge from "@/components/StatusBadge";
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
              <StatusBadge status={existingReport.reportStatus.status} />
            )}
            <PersonalSection mode={mode} />
            <AssistancesSection assistanceTypes={assistanceTypes} />
            <FormError message={errors.reportAssistances?.message as string} />
            <AdditionalDetailSection />
            <ImageSection
              mode={mode}
              onImagesChange={setImages}
              deletedImageIds={deletedImageIds}
              setDeletedImageIds={setDeletedImageIds}
              initialImages={oldImages}
            />
            <FormError message={errors.images?.message as string} />

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
