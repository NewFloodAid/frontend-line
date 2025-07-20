import React, { useEffect, useState } from "react";
import { AssistanceItem } from "@/app/types";

interface AssistancesProps {
  assistances: AssistanceItem[];
  setAssistances: React.Dispatch<React.SetStateAction<AssistanceItem[]>>;
  reportStatus: string;
}

const AssistancesComponent: React.FC<AssistancesProps> = ({
  assistances,
  setAssistances,
  reportStatus,
}) => {
  const [check, setCheck] = useState<boolean[]>([]);
  const isEditable = reportStatus === "PENDING" || reportStatus === "";

  useEffect(() => {
    const initialCheck: boolean[] = [];
    assistances.forEach((assistance) => {
      // console.log(JSON.stringify(assistance));
      if (assistance.quantity > 0) {
        initialCheck.push(true);
      } else {
        initialCheck.push(false);
      }
    });
    setCheck(initialCheck);
  }, [assistances]);

  function handleCheck(index: number) {
    if (!isEditable) return;

    const newChecked = !check[index]; // toggle ที่ต้องการ
    setCheck((prev) => {
      const updated = [...prev];
      updated[index] = newChecked;
      return updated;
    });

    setAssistances((prevAssistances) =>
      prevAssistances.map((item, i) =>
        i === index ? { ...item, quantity: newChecked ? 1 : 0 } : item
      )
    );
  }

  return (
    <div>
      {assistances.map(({ id, name }) => (
        <div key={id} className="mb-4">
          <div className="flex items-center">
            <input
              disabled={!isEditable || (check.includes(true) && !check[id - 1])}
              type="checkbox"
              id={name}
              checked={check[id - 1] || false}
              onChange={() => handleCheck(id - 1)}
              className="mr-4 w-6 h-6 transform scale-60"
            />
            <label
              htmlFor={name}
              className="mr-2 capitalize text-gray-700 text-base"
            >
              {name}
            </label>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AssistancesComponent;
