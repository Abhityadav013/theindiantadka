import Header from "./components/Header";
import ExploreMenuWrapper from "./components/ExploreMenuWrapper";
import FoodDisplayWrapper from "./components/FoodDisplayWrapper";
import { menu_url } from "./utils/api_url";
import { FilteredMenuItem, FoodItem } from "./utils/types/menu_type";
import { FoodCategory } from "./utils/types/food_category_type";
import NavBarWrapper from "./components/NavBarWrapper";

// ✅ Fetch menu data only once per hour (ISR equivalent)
async function getMenuData() {
  try {
    const [menuResponse, categoryResponse] = await Promise.all([
      fetch(`${menu_url}/menu`, { next: { revalidate: 3600 } }), // Cache for 1 hour
      fetch(`${menu_url}/category`, { next: { revalidate: 3600 } }),
    ]);

    if (!menuResponse.ok || !categoryResponse.ok) {
      throw new Error("Failed to fetch data");
    }

    const foodMenuItems: FoodItem[] = await menuResponse.json();
    const foodCategoryItems: FoodCategory[] = await categoryResponse.json();
    const filteredMenuItem: FoodItem[] = foodMenuItems.filter((cat) => cat.isDelivery);
    const filteredMenuCategoryItems: FilteredMenuItem[] = foodCategoryItems
      .filter((cat) => cat.isDelivery)
      .map((cat) => ({
        menu_name: cat.categoryName,
        menu_image: cat.imageUrl,
      }));

    return { filteredMenuItem, filteredMenuCategoryItems };
  } catch (error) {
    console.error("Error fetching menu data:", error);
    return { filteredMenuItem: [], filteredMenuCategoryItems: [] };
  }
}

export default async function Home() {
  const { filteredMenuItem, filteredMenuCategoryItems } = await getMenuData();

  return (
    <>
      <NavBarWrapper />
      <Header />
      <ExploreMenuWrapper menu_list={filteredMenuCategoryItems} />
      <FoodDisplayWrapper food_list={filteredMenuItem} />
    </>
  );
}
