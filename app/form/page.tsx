"use client";
import { useEffect, useState } from "react";
import { useUser } from "@/app/providers/userContext";
import PersonalDetails from "@/app/components/form/PersonalDetails";
import Assistances from "@/app/components/form/Assistances";
import NeedsAlert from "@/app/components/form/NeedsAlert";
import Details from "@/app/components/form/Details";
import FileUpload from "@/app/components/form/FileUpload";
import { createReport, createUpdateReport } from "./createReport";
import { sendReport, getReport, sentUpdateReport } from "@/app/api/reports";
import { getAssistanceTypes } from "@/app/api/getAssistanceTypes";
import * as Types from "@/app/types";
import { statusMapping } from "@/app/status";
import { deleteImageApi } from "@/app/api/images";
import CustomPopup, { popupType } from "../components/CustomPopup";

const Form = () => {
  const user = useUser();

  // Formdata
  const [userDetails, setUserDetails] = useState<Types.UserDetails>({
    firstName: "",
    lastName: "",
    phone: "",
    alternatePhone: "",
  });
  const [assistances, setAssistances] = useState<Types.AssistanceItem[]>([]);
  const [details, setDetails] = useState("");
  const [files, setFiles] = useState<(File | Types.ReportImage)[]>([]);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [coordinates, setCoordinates] = useState<Types.Coordinates>({
    lat: null,
    lng: null,
  });
  const [imgId, setImgId] = useState<number[]>([]);

  // Form behavior
  const [showAlert, setShowAlert] = useState(false);
  const [reportStatus, setReportStatus] = useState("");
  const [report, setReport] = useState<Types.GetReportBody>();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const popupConfirm = () => {
    window.location.href = "/history";
  };

  // Set report info from report id
  const fetchFormdata = async (id: number) => {
    if (!user?.uid) return;
    const data = await getReport(user.uid);
    const report = data.find((report) => report.id === id);
    setReport(report);
    if (!report) return;
    setReportStatus(report.reportStatus.status);
    setUserDetails({
      firstName: report.firstName ?? "",
      lastName: report.lastName ?? "",
      phone: report.mainPhoneNumber ?? "",
      alternatePhone: report.reservePhoneNumber ?? "",
    });
    const updatedAssistances = assistances.map((assistance) => {
      const matchingAssistance = report.reportAssistances?.find(
        (assistance) => assistance.assistanceType.id === assistance.id
      );
      return matchingAssistance
        ? { ...assistance, quantity: matchingAssistance.quantity }
        : assistance;
    });
    setAssistances(updatedAssistances);
    setDetails(report.additionalDetail ?? "");
    if (report.images) {
      setFiles(report.images);
    } else {
      setFiles([]);
    }
  };

  // Set user detail
  const fetchUserInfo = async () => {
    if (!user?.uid) return;
    const data = await getReport(user.uid);
    if (!data || (Array.isArray(data) && data.length === 0)) return;
    const report = data[0];
    setUserDetails({
      firstName: report.firstName ?? "",
      lastName: report.lastName ?? "",
      phone: report.mainPhoneNumber ?? "",
      alternatePhone: report.reservePhoneNumber ?? "",
    });
  };

  // Check urlParams
  const urlParamsCheck = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const lat = urlParams.get("lat");
    const lng = urlParams.get("lng");
    const id = urlParams.get("id");
    if (lat && lng) {
      setCoordinates({ lat, lng });
      fetchUserInfo();
    } else if (id) {
      fetchFormdata(Number(id));
    } else {
      window.location.href = "/";
    }
  };

  // Get all assistance types
  const fetchAssistances = async () => {
    const assistanceList = await getAssistanceTypes();
    setAssistances(assistanceList || []);
  };

  // useEffect
  useEffect(() => {
    fetchAssistances();
    urlParamsCheck();
  }, [user?.uid]);

  // handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isAnyChecked = assistances.some(
      (assistance) => assistance.quantity > 0
    ); // 1 need require
    if (!isAnyChecked) {
      setShowAlert(true);
      return;
    }
    setShowAlert(false);
    if (!user?.uid) return;
    // Create report if report has no status
    if (reportStatus == "") {
      const report = await createReport(
        user.uid,
        coordinates,
        userDetails,
        assistances,
        details
      );
      try {
        const image = files.filter((file) => file instanceof File);
        await sendReport(report, image);
        window.location.href = "/success";
      } catch (error) {
        console.error("Error sending report:", error);
      }
      // Update report if report's status is PENDING
    } else if (reportStatus == "PENDING") {
      if (!report) return;
      // console.log(report);
      for (const id of imgId) {
        // console.log(`Deleting image with id: ${id}`);
        await deleteImageApi(id, report);
      }
      const data = await getReport(report.userId);
      const updatedReport = data.find((item) => item.id === report?.id);
      if (!updatedReport) {
        setIsPopupOpen(true);
        return;
      }
      const newReport = await createUpdateReport(
        updatedReport,
        userDetails,
        assistances,
        details
      );
      try {
        const image = files.filter((file) => file instanceof File);
        const result = await sentUpdateReport(newReport, image);
        if (!result) {
          alert("อัพเดตไม่สำเร็จ คำขอกำลังดำเนินการณ์");
          return;
        } else {
          window.location.href = "/success";
        }
      } catch (error) {
        console.error("Error sending report:", error);
      }
    }
  };

  if (!user?.uid) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <CustomPopup
        isOpen={isPopupOpen}
        onConfirm={popupConfirm}
        onCancel={() => {}}
        type={popupType.NOTFOUND}
      />
      <div className="w-full max-w-2xl bg-white p-8 shadow-md rounded-lg">
        <form onSubmit={handleSubmit}>
          {/* ข้อมูลผู้ใช้ */}
          <PersonalDetails
            userDetails={userDetails}
            setUserDetails={setUserDetails}
            reportStatus={reportStatus}
          />
          {/* ความต้องการ */}
          <div className="mb-10">
            <Assistances
              assistances={assistances}
              setAssistances={setAssistances}
              reportStatus={reportStatus}
            />
            {showAlert && <NeedsAlert />}
          </div>
          {/* รายละเอียดเพิ่มเติม */}
          <Details
            details={details}
            setDetails={setDetails}
            reportStatus={reportStatus}
          />
          {/* อัปโหลดรูปภาพ */}
          <FileUpload
            files={files}
            setFiles={setFiles}
            id={imgId}
            setId={setImgId}
            reportStatus={reportStatus}
          />
          {/* ยืนยันข้อมูล */}
          {(reportStatus === "" || reportStatus === "PENDING") && (
            <div className="mt-4 mb-2 flex items-center justify-center">
              <input
                type="checkbox"
                id="confirm"
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
                className="mr-4 w-6 h-6 transform scale-100"
              />
              <label htmlFor="confirm" className="text-red-600 text-base">
                ยืนยันการส่งข้อมูล
              </label>
            </div>
          )}
          {/* ปุ่มส่งคำร้อง */}
          {(reportStatus === "" || reportStatus === "PENDING") && (
            <div className="flex justify-center w-full mt-4">
              <button
                type="submit"
                disabled={!isConfirmed}
                className={`mt-4 w-100 py-3 px-4 rounded-lg text-base transition ${
                  isConfirmed
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {reportStatus === "" ? "ขอความช่วยเหลือ" : "อัปเดตข้อมูล"}
              </button>
            </div>
          )}
          {/* แสดง Status ของ report ที่แก้ไขไม่ได้ */}
          {reportStatus !== "" && reportStatus !== "PENDING" && (
            <p
              className={`text-lg font-medium text-center flex justify-center ${
                statusMapping(reportStatus).color
              }`}
            >
              {statusMapping(reportStatus).label}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Form;
