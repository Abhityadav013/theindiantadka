import { Box, Divider, Typography } from "@mui/material";
import { FilteredMenuItem } from "../utils/types/menu_type";
import ExploreMenuCategory from "./ExploreMenuCategory";

export type ExploreMenuProps = {
  menu_list: FilteredMenuItem[];
};

const ExploreMenuWrapper: React.FC<ExploreMenuProps> = ({ menu_list }) => {
  return (
    <Box className="flex flex-col gap-5 mt-5 px-4 sm:px-6 md:px-10 max-w-screen-xl mx-auto">
      {/* Heading */}
      <Typography
        variant="h4"
        color="text.primary"
        fontWeight={600}
        className="text-2xl sm:text-3xl md:text-4xl font-semibold"
      >
        Explore Our Menu
      </Typography>

      {/* Subheading */}
      <Typography
        variant="body1"
        color="text.secondary"
        className="text-sm sm:text-base md:text-lg max-w-3xl leading-relaxed"
      >
        Choose from a diverse menu featuring a delectable array of dishes
        crafted with the finest ingredients and culinary expertise. Our mission
        is to satisfy your craving and elevate your dining experience, one
        delicious meal at a time.
      </Typography>

      {/* Menu Categories */}
      <ExploreMenuCategory menu_list={menu_list} />

      {/* Divider */}
      <Divider sx={{ marginTop: 2 }} />
    </Box>
  );
};

export default ExploreMenuWrapper;
