const StatusMappingToTH: { [key: string]: string } = {
  PENDING: "ยังไม่ได้รับเรื่อง",
  PROCESS: "รวบรวมข้อมูล",
  SENT: "ส่งเรื่องไปแล้ว",
  SUCCESS: "เสร็จสิ้น",
};

const StatusMappingENGToTextColor: { [key: string]: string } = {
  PENDING: "text-red-500",
  PROCESS: "text-orange-500",
  SENT: "text-blue-500",
  SUCCESS: "text-green-500",
};

const StatusMappingENGToPinColor: { [key: string]: string } = {
  PENDING: "red",
  PROCESS: "yellow",
  SENT: "blue",
  SUCCESS: "green",
};

const StatusMappingToENG: { [key: string]: string } = {
  ยังไม่ได้รับเรื่อง: "PENDING",
  รวบรวมข้อมูล: "PROCESS",
  ส่งเรื่องไปแล้ว: "SENT",
  เสร็จสิ้น: "SUCCESS",
};

export {
  StatusMappingToTH,
  StatusMappingToENG,
  StatusMappingENGToTextColor,
  StatusMappingENGToPinColor,
};
