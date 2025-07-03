"use client";
import { useEffect, useState } from "react";
import { useUser } from "@/app/providers/userContext";
import PersonalDetails from "@/app/components/form/PersonalDetails";
import Needs from "@/app/components/form/Needs";
import NeedsAlert from "@/app/components/form/NeedsAlert";
import Details from "@/app/components/form/Details";
import FileUpload from "@/app/components/form/FileUpload";
import { createReport, sendReport } from "@/app/api/createReport";
import { getReport, GetReportBody } from "@/app/api/getReport";
import { createUpdateReport, sentUpdateReport } from "@/app/api/updateReport";
import { getAssistanceTypes } from "@/app/api/getAssistanceTypes";
import Loading from "@/app/components/Loading";
import { need, personalDetails, location, image } from "./type";
import { statusMapping } from "@/app/components/status";
import { deleteImageApi } from "@/app/api/deleteImage";
import CustomPopup, { popupType } from "../components/CustomPopup";

const Form = () => {
  const user = useUser();

  // Formdata
  const [personalDetails, setPersonalDetails] = useState<personalDetails>({
    firstName: "",
    lastName: "",
    phone: "",
    alternatePhone: "",
  });
  const [needs, setNeeds] = useState<need[]>([]);
  const [details, setDetails] = useState("");
  const [files, setFiles] = useState<(File | image)[]>([]);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [location, setLocation] = useState<location>({ lat: null, lng: null });
  const [imgId, setImgId] = useState<number[]>([]);

  // Form behavior
  const [showAlert, setShowAlert] = useState(false);
  const [reportStatus, setReportStatus] = useState("");
  const [report, setReport] = useState<GetReportBody>();
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
    setPersonalDetails({
      firstName: report.firstName ?? "",
      lastName: report.lastName ?? "",
      phone: report.mainPhoneNumber ?? "",
      alternatePhone: report.reservePhoneNumber ?? "",
    });
    const updatedNeeds = needs.map((need) => {
      const matchingAssistance = report.reportAssistances?.find(
        (assistance) => assistance.assistanceType.id === need.id
      );
      return matchingAssistance
        ? { ...need, quantity: matchingAssistance.quantity }
        : need;
    });
    setNeeds(updatedNeeds);
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
    setPersonalDetails({
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
      setLocation({ lat, lng });
      fetchUserInfo();
    } else if (id) {
      fetchFormdata(Number(id));
    } else {
      window.location.href = "/";
    }
  };

  // Get all assistance types
  const fetchNeeds = async () => {
    const needList = await getAssistanceTypes();
    setNeeds(needList || []);
  };

  // useEffect
  useEffect(() => {
    fetchNeeds();
    urlParamsCheck();
  }, [user?.uid]);

  // handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isAnyChecked = needs.some((need) => need.quantity > 0); // 1 need require
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
        location,
        personalDetails,
        needs,
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
        personalDetails,
        needs,
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
    return <Loading />;
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
            personalDetails={personalDetails}
            setPersonalDetails={setPersonalDetails}
            reportStatus={reportStatus}
          />
          {/* ความต้องการ */}
          <div className="mb-10">
            <Needs
              needs={needs}
              setNeeds={setNeeds}
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
