// "use client";

// import React, { useContext } from "react";
// import Image from "next/image";
// import { StoreContext } from "@/context/StoreContext";
// import { FoodItemType } from "@/types";

// interface FoodItemProps {
//   item: FoodItemType;
// }

// const FoodItem: React.FC<FoodItemProps> = ({ item }) => {
//   const { addToCart, removeFromCart, cartItems } = useContext(StoreContext);

//   return (
//     <div className="w-full max-w-sm rounded-2xl shadow-lg transition duration-300 hover:shadow-xl animate-fadeIn">
//       {/* Food Image */}
//       <div className="relative">
//         <Image
//           src={item.imageURL}
//           alt={item.itemName}
//           width={300}
//           height={220}
//           className="w-full h-[220px] rounded-t-2xl object-cover"
//         />

//         {/* Add/Remove Buttons */}
//         {!cartItems[item.id] ? (
//           <Image
//             src="https://testing.indiantadka.eu/assets/add_icon_white.png"
//             alt="Add to cart"
//             width={35}
//             height={35}
//             className="absolute bottom-4 right-4 cursor-pointer rounded-full"
//             onClick={() => addToCart(item.id)}
//           />
//         ) : (
//           <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-white p-2 rounded-full">
//             <Image
//               src="https://testing.indiantadka.eu/assets/remove_icon_red.png"
//               alt="Remove from cart"
//               width={30}
//               height={30}
//               className="cursor-pointer"
//               onClick={() => removeFromCart(item.id)}
//             />
//             <p className="text-sm font-bold">{cartItems[item.id]}</p>
//             <Image
//               src="https://testing.indiantadka.eu/assets/add_icon_green.png"
//               alt="Add more"
//               width={30}
//               height={30}
//               className="cursor-pointer"
//               onClick={() => addToCart(item.id)}
//             />
//           </div>
//         )}
//       </div>

//       {/* Food Info */}
//       <div className="p-4">
//         <div className="flex items-center justify-between">
//           <p className="text-lg font-semibold">{item.itemName}</p>
//           <Image
//             src="https://testing.indiantadka.eu/assets/rating_starts.png"
//             alt="Rating"
//             width={70}
//             height={14}
//             className="h-4"
//           />
//         </div>

//         {item.description && (
//           <p className="text-gray-500 text-sm mt-2">{item.description}</p>
//         )}

//         <p className="text-red-500 text-lg font-semibold mt-2">€ {item.price}</p>

//         {/* Tags */}
//         {item.tags && item.tags.length > 0 && (
//           <div className="mt-2 flex flex-wrap gap-2">
//             {item.tags.map((tag, index) => (
//               <span key={index} className="bg-gray-100 text-green-600 text-xs px-2 py-1 rounded-full">
//                 {tag}
//               </span>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FoodItem;
