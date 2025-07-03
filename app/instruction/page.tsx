import Image from "next/image";

const Instruction = () => {
  return (
    <div className="w-screen max-w-[500px] mx-auto">
      {Array.from({ length: 7 }, (_, i) => (
        <Image
          key={i}
          src={`/${i + 1}.jpg`}
          alt={`Inst_${i + 1}`}
          width={800}
          height={600}
          className="w-full h-auto"
        />
      ))}
    </div>
  );
};

export default Instruction;
