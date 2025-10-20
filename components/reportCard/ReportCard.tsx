"use client";
import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
import { TransitionStartFunction, useState } from "react";
import { Report } from "@/types/Report";
import { deleteReport } from "@/api/reports";
import { useRouter } from "next/navigation";
import ConfirmModal from "./ConfirmModal";
import Map from "./reportCardSection/Map";
import Image from "next/image";
import SentComponent from "./reportCardSection/Sent";
import SuccessComponent from "./reportCardSection/Success";
import { StatusMappingToTH } from "@/constants/report_status";

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
      <div className="flex flex-row mb-5">
        {/*วันเวลาส่งคำขอ*/}
        <div className="flex flex-row">
          <label className="mr-5">{DateTH(report.createdAt).date}</label>
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
                src="/buttons/delete-button.png"
                alt="delete"
                width={25}
                height={25}
              />
            </button>
          </div>
        )}
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

        {/*รูปแรก*/}
        <img
          src={report.images.find((image) => image.phase == "BEFORE")?.url} // ดึงรูปแรกใน array
          alt="report image"
          className="object-cover w-24 h-24 rounded-md ml-auto"
        />
      </div>

      {isExpanded && (
        <>
          {/*รูปที่เหลือ*/}
          <div className="flex flex-row gap-2 justify-end mb-3">
            {report.images
              .slice(1)
              .filter((image) => image.phase === "BEFORE")
              .map((image, index) => {
                return (
                  <img
                    src={image.url}
                    key={index}
                    alt="report image"
                    className="object-cover w-24 h-24 rounded-md"
                  />
                );
              })}
          </div>

          {/*แผนที่*/}
          <div className="w-full border shadow-sm h-[200px] rounded overflow-hidden">
            <Map report={report} />
          </div>

          <SentComponent
            report={report}
            fetchReports={fetchReports}
            startTransition={startTransition}
          />

          <SuccessComponent report={report} />
        </>
      )}

      <div className="flex mt-5 pt-5 px-3 border-t border-gray-300">
        <button onClick={() => handlecardExpand(report.id)}>
          <Image
            src="/buttons/button-arrow-expand.png"
            alt="expand"
            width={20}
            height={20}
            className={isExpanded ? "scale-y-[-1]" : ""}
          />
        </button>
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
