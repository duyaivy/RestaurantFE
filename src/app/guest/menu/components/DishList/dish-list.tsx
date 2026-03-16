import { DishCard } from "@/app/guest/menu/components/DishList/dish-card";
import { DishResType } from "@/schemaValidations/dish.schema";
import { Search } from "lucide-react";
import MenuListSkeleton from "./menu-card-skeleton";

interface Props {
  dishes: DishResType[];
  isLoading: boolean;
}
const DishListGuest = ({ dishes, isLoading }: Props) => {
  return (
    <div className="px-4 flex flex-col gap-4">
      {isLoading ? (
        <MenuListSkeleton count={4} />
      ) : dishes.length > 0 ? (
        dishes.map((dish) => (
          <DishCard
            key={dish.id}
            {...dish}
            name={dish.name?.vi}
            description={dish.description?.vi}
          />
        ))
      ) : (
        <div className="text-center py-20 px-8">
          <div className="w-12 h-12 rounded-2xl bg-[#1c1a16] border border-[#2e2a22] flex items-center justify-center mx-auto mb-4">
            <Search size={18} className="text-neutral-600" strokeWidth={1.5} />
          </div>
          <p className="text-neutral-500 text-sm tracking-widest mb-3">
            Không tìm thấy món ăn nào
          </p>
        </div>
      )}
    </div>
  );
};

export default DishListGuest;
