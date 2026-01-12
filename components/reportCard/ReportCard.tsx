"use client";
import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
import { TransitionStartFunction, useState } from "react";
import { Report } from "@/types/Report";
import { deleteReport } from "@/api/reports";
import { useRouter } from "next/navigation";
import ConfirmModal from "./ConfirmModal";
import Image from "next/image";
import SentComponent from "./reportCardSection/Sent";
import SuccessComponent from "./reportCardSection/Success";
import { StatusMappingToTH } from "@/constants/report_status";
import ReportCardMapComponent from "./Map";

dayjs.extend(buddhistEra);

const StatusMappingENGToTextColor: { [key: string]: string } = {
  PENDING: "text-red-500",
  PROCESS: "text-orange-500",
  SENT: "text-blue-500",
  SUCCESS: "text-green-500",
};

interface Props {
  report: Report;
  startTransition: TransitionStartFunction;
  fetchReports: () => Promise<void>;
  isExpanded: boolean;
  setExpandedCardId: (id: number | undefined) => void;
}

//day.js
function DateTH(dateStr: string) {
  dayjs.locale("th");
  const dt = dayjs(dateStr);
  const date = dt.format("D/MM/BB");
  const time = dt.format("HH:mm");
  return { date, time };
}

function ReportCard({
  report,
  startTransition,
  fetchReports,
  isExpanded,
  setExpandedCardId,
}: Props) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  function handleDelete(id: number) {
    startTransition(async () => {
      await deleteReport(id);
      await fetchReports();
    });
    setShowModal(false);
  }

  function handlecardExpand(id: number) {
    if (isExpanded) {
      setExpandedCardId(undefined);
    } else {
      setExpandedCardId(id);
    }
  }

  function closeModal() {
    setShowModal(false);
  }

  return (
    <>
      <div className="flex flex-row">
        {/*วันเวลาส่งคำขอ*/}
        <div className="flex flex-row">
          <label className="mr-2">{DateTH(report.createdAt).date}</label>
          <label>เวลา {DateTH(report.createdAt).time} น.</label>
        </div>

        {report.reportStatus.status == "PENDING" && (
          <div className="ml-auto flex gap-x-3">
            {/*ปุ่มแก้ไข*/}
            <button onClick={() => router.push(`/form?id=${report.id}`)}>
              <Image
                src="/buttons/edit-button.svg"
                alt="edit"
                width={30}
                height={30}
              />
            </button>
            {/*ปุ่มลบ*/}
            <button onClick={() => setShowModal(true)}>
              <Image
                src="/buttons/bin.png"
                alt="delete"
                width={25}
                height={25}
              />
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-row mb-5">
        <div className="flex flex-row">
          <label className="mr-2">ผู้แจ้ง</label>
          <label>
            {report.firstName} {report.lastName}
          </label>
        </div>
      </div>

      {/*รายละเอียดสถานการณ์*/}
      <div className="flex flex-row mb-3">
        <div>
          <h3 className="mb-3">
            {
              report.reportAssistances.find(
                (assistance) => assistance.quantity > 0
              )?.assistanceType.name
            }
          </h3>
          <label className="ml-3">{report.additionalDetail}</label>
        </div>
      </div>

      {/*รูป และ แผนที่*/}
      <div className="flex flex-row gap-2 justify-start mb-3 overflow-x-auto flex-nowrap scroll-smooth">
        <ReportCardMapComponent report={report} />
        {report.images
          .filter((image) => image.phase === "BEFORE")
          .map((image, index) => {
            return (
              <img
                src={image.url}
                key={index}
                alt="report image"
                className="h-40 rounded-md shadow-lg"
              />
            );
          })}
      </div>

      {isExpanded && (
        <>
          <SentComponent
            report={report}
            fetchReports={fetchReports}
            startTransition={startTransition}
          />

          <SuccessComponent report={report} />
        </>
      )}

      <div className="flex items-center mt-5 pt-2 border-t border-gray-300">
        {report.reportStatus.status === "SENT" && (
          <button
            onClick={() => handlecardExpand(report.id)}
            className={`py-3 px-4 rounded-lg text-base transition text-white
          ${
            isExpanded
              ? "bg-red-400 hover:bg-red-500"
              : "bg-green-500 hover:bg-green-600"
          }
        `}
          >
            {isExpanded ? "ยกเลิก" : "อัพเดต"}
          </button>
        )}
        {report.reportStatus.status === "SUCCESS" && (
          <button
            onClick={() => handlecardExpand(report.id)}
            className="semi-bold text-gray-700 underline"
          >
            {isExpanded ? "ซ่อนรายละเอียด" : "แสดงรายละเอียด"}
          </button>
        )}
        <label
          className={`ml-auto font-semibold ${
            StatusMappingENGToTextColor[report.reportStatus.status]
          }`}
        >
          {StatusMappingToTH[report.reportStatus.status]}
        </label>
      </div>

      {showModal && (
        <ConfirmModal
          id={report.id}
          handleDelete={handleDelete}
          handleCancel={closeModal}
        />
      )}
    </>
  );
}

export default ReportCard;
