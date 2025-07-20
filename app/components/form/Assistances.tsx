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
  const [check, setCheck] = useState<{ [key: number]: boolean }>({});
  const isEditable = reportStatus === "PENDING" || reportStatus === "";

  useEffect(() => {
    const initialCheck: { [key: number]: boolean } = {};
    assistances.forEach((assistance) => {
      if (assistance.quantity > 0) {
        initialCheck[assistance.id] = true;
      }
    });
    setCheck(initialCheck);
  }, [assistances]);

  function handleCheck(id: number) {
    if (!isEditable) return;

    setCheck((prevCheck) => {
      const nextChecked = !prevCheck[id];
      if (nextChecked) {
        setAssistances((prevAssistances) =>
          prevAssistances.map((assistance) =>
            assistance.id === id ? { ...assistance, quantity: 1 } : assistance
          )
        );
      }

      return {
        ...prevCheck,
        [id]: nextChecked,
      };
    });
  }

  useEffect(() => {
    Object.keys(check).forEach((key) => {
      const id = Number(key);
      if (!check[id]) {
        setAssistances((prevAssistances) =>
          prevAssistances.map((assistance) =>
            assistance.id === id ? { ...assistance, quantity: 0 } : assistance
          )
        );
      }
    });
  }, [check, setAssistances]);

  return (
    <div>
      {assistances.map(({ id, name }) => (
        <div key={id} className="mb-4">
          <div className="flex items-center">
            <input
              disabled={!isEditable}
              type="checkbox"
              id={name}
              checked={check[id] || false}
              onChange={() => handleCheck(id)}
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
