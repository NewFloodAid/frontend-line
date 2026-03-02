"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getReports } from "@/api/reports";
import { Report } from "@/types/Report";

interface Params {
  /** userId: ใช้กรองรายงานตามผู้ใช้งาน */
  userId?: string;

  /** reportStatusId: ใช้กรองตามสถานะของรายงาน */
  reportStatusId?: number;

  /** autoRefresh: ดึงข้อมูลทุกๆกี่วินาที */
  autoRefresh?: number;
}

/**
 * useReports
 *
 * Custom Hook สำหรับจัดการการดึงข้อมูลรายงานจากระบบ backend
 * พร้อมจัดการสถานะ loading และรองรับการ refresh อัตโนมัติ
 */
export function useReports(params: Params) {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReports = async () => {
    const uid = localStorage.getItem("uid");

    if (!uid) {
      router.replace("/");
      return;
    }

    setLoading(true);

    const data = await getReports(
      {
        userId: params.userId,
        reportStatusId: params.reportStatusId,
      },
      uid,
    );

    setReports(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();

    if (params.autoRefresh) {
      const interval = setInterval(fetchReports, params.autoRefresh * 1000);
      return () => clearInterval(interval);
    }
  }, [params.reportStatusId, params.autoRefresh]);

  return {
    reports,
    fetchReports,
    loading,
  };
}
