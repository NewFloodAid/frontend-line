"use client";

import ReportFormUI from "./ReportFormUI";
import { useReportForm } from "@/feature/report/form/hooks/useReportForm";
import ReportNotFound from "./ReportNotFound";

export default function ReportFormContainer() {
  const form = useReportForm();

  if (!form.mode) return null;
  if (form.mode === "NOTFOUND") return <ReportNotFound />;

  const { mode, ...rest } = form;

  return <ReportFormUI mode={mode} {...rest} />;
}
