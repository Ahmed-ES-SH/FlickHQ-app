// //////////////////////////////////////////////////////////////////////////////
// ///////// BenefitItem — checkmark + text line for plan features /////////////
// //////////////////////////////////////////////////////////////////////////////

import { IoCheckmarkCircle } from "react-icons/io5";

interface BenefitItemProps {
  text: string;
}

export default function BenefitItem({ text }: BenefitItemProps) {
  return (
    <div className="flex items-center gap-2 text-[13px] text-gray-200">
      <IoCheckmarkCircle className="size-4 text-accent shrink-0" />
      {text}
    </div>
  );
}
