import React, { useEffect, useState } from "react";

interface NeedsItem {
  id: number;
  name: string;
  unit: string;
  quantity: number;
}

interface NeedsProps {
  needs: NeedsItem[];
  setNeeds: React.Dispatch<React.SetStateAction<NeedsItem[]>>;
  reportStatus: string;
}

const NeedsComponent: React.FC<NeedsProps> = ({
  needs,
  setNeeds,
  reportStatus,
}) => {
  const [check, setCheck] = useState<{ [key: string]: boolean }>({});
  const isEditable = reportStatus === "PENDING" || reportStatus === "";

  useEffect(() => {
    const initialCheck: { [key: string]: boolean } = {};
    needs.forEach((need) => {
      if (need.quantity > 0) {
        initialCheck[need.name] = true;
      }
    });
    setCheck(initialCheck);
  }, [needs]);

  const handleNeedsChange = (id: number, value: number) => {
    if (!isEditable) return;
    setNeeds((prevNeeds) =>
      prevNeeds.map((need) =>
        need.id === id ? { ...need, quantity: value } : need
      )
    );
    // console.log(value);
  };

  const handleCheck = (name: string) => {
    if (!isEditable) return;
    setCheck((prevCheck) => ({
      ...prevCheck,
      [name]: !prevCheck[name], // Toggle checkbox state
    }));
  };

  useEffect(() => {
    Object.keys(check).forEach((key) => {
      if (!check[key]) {
        setNeeds((prevNeeds) =>
          prevNeeds.map((need) =>
            need.name === key ? { ...need, quantity: 0 } : need
          )
        );
      }
    });
  }, [check, setNeeds]);

  return (
    <div>
      <p className="font-medium text-gray-700 mb-3 text-base">ความต้องการ</p>
      {needs.map(({ id, name, unit, quantity }) => (
        <div key={id} className="mb-4">
          <div className="flex items-center">
            <input
              disabled={!isEditable}
              type="checkbox"
              id={name}
              checked={check[name] || false}
              onChange={() => handleCheck(name)}
              className="mr-4 w-6 h-6 transform scale-60"
            />
            <label
              htmlFor={name}
              className="mr-2 capitalize text-gray-700 text-base"
            >
              {name}
            </label>
          </div>

          {/* แสดงกล่องข้อความ (input) เฉพาะเมื่อ checkbox ถูกเลือก */}
          {check[name] && (
            <div>
              <label
                htmlFor={`${name}-input`}
                className="mr-2 capitalize text-gray-700 text-base"
              >
                จำนวน
              </label>
              <input
                disabled={!isEditable}
                id={`${name}-input`}
                type="text"
                inputMode="numeric"
                min={0}
                value={quantity === 0 ? "" : quantity}
                onChange={(e) => {
                  const newValue = Math.max(parseInt(e.target.value) || 0, 0);
                  handleNeedsChange(id, newValue);
                }}
                onInput={(e) => {
                  const input = e.target as HTMLInputElement;
                  input.value = input.value.replace(/[^0-9]/g, ""); // ลบค่าที่ไม่ใช่ตัวเลข
                }}
                className="w-20 px-2 py-1 border rounded-lg text-gray-700 text-base mt-2"
                required={check[name]}
              />
              <label
                htmlFor={name}
                className="ml-2 capitalize text-gray-700 text-base"
              >
                {unit}
              </label>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default NeedsComponent;
