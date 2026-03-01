"use client";

import ReportFormUI from "./ReportFormUI";
import { useReportForm } from "@/feature/report/form/hooks/useReportForm";
import ReportNotFound from "./ReportNotFound";
import UpdateReport from "./UpdateReport";

export default function ReportFormContainer() {
  const form = useReportForm();

  if (!form.mode) return null;
  if (form.mode === "NOTFOUND") return <ReportNotFound />;

  const { mode, ...rest } = form;

  if (form.mode === "UPDATE" && form.existingReport)
    return <UpdateReport report={form.existingReport} />;

  return <ReportFormUI mode={mode} {...rest} />;
}
