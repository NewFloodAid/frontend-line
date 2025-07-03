import React from "react";

type DetailsProps = {
  details: string;
  setDetails: React.Dispatch<React.SetStateAction<DetailsProps["details"]>>;
  reportStatus: string;
};

const Detail: React.FC<DetailsProps> = ({
  details,
  setDetails,
  reportStatus,
}) => {
  const isEditable = reportStatus === "PENDING" || reportStatus === "";
  const handleDetailsChange = (input: string) => {
    if (!isEditable) return;
    setDetails(input);
  };
  return (
    <div className="mb-4">
      <label className="mb-2 block font-medium text-gray-700 text-base">
        แจ้งรายละเอียดสถานการณ์
      </label>
      <textarea
        disabled={!isEditable}
        name="additionalDetails"
        value={details}
        onChange={(e) => handleDetailsChange(e.target.value)}
        className="w-full h-40 md:h-52 mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-700 text-base"
        rows={10}
      />
    </div>
  );
};

export default Detail;
