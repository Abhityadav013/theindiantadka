import React from "react";
import CartNavigate from "./CartNavigate";

interface ViewCartProps{
    itmesCount:number
}
const ViewCart: React.FC<ViewCartProps> = ({itmesCount}) => {
  return (
    <div className="fixed left-1/2 bottom-0 w-[60%] transform -translate-x-1/2 bg-green-600 text-white p-4 flex justify-between items-center shadow-lg z-50">
      <span className="ml-4 text-lg font-semibold">{itmesCount} item added</span>
      <CartNavigate />
    </div>
  );
};

export default ViewCart;
