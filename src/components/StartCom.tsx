import { Chip } from "@nextui-org/react";
import { BiTime } from "react-icons/bi";
import { GrView } from "react-icons/gr";
import { BiSolidUserCircle } from "react-icons/bi";
import { AiOutlineDollarCircle } from "react-icons/ai";
import { FaPercentage } from "react-icons/fa";
interface arg {
  view: string;
  time: string;
  creator: string;
  commerical: string;
  derv: string;
}
function StartCom(arg: arg) {
  return (
    <div className="flex flex-col space-y-3">
      <div className="flex flex-row space-x-2">
        <Chip color="warning" startContent={<BiTime />}>
          {new Date(Number(arg.time) * 1000).toLocaleString()}
        </Chip>
        <Chip color="secondary" startContent={<GrView />} radius="sm">
          {arg.view}{" "}
        </Chip>
        <Chip color="danger" startContent={<BiSolidUserCircle />}>
          {arg.creator}
        </Chip>
      </div>
      <div className="flex flex-row space-x-2">
        <Chip color="primary" startContent={<AiOutlineDollarCircle />}>
          Commerical-Use: {arg.commerical}
        </Chip>
        <Chip color="success" startContent={<FaPercentage />}>
          Derivation: {arg.derv}
        </Chip>
      </div>
    </div>
  );
}
export default StartCom;
