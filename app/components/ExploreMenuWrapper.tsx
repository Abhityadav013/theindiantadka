

import { Box, Divider, Typography } from "@mui/material";
import { FilteredMenuItem } from "../utils/types/menu_type";
import ExploreMenuCategory from "./ExploreMenuCategory";

export type ExploreMenuProps = {
    menu_list: FilteredMenuItem[];
};

const ExploreMenuWrapper: React.FC<ExploreMenuProps> = ({ menu_list }) => {
  return (
    <Box className="flex flex-col gap-5 mt-5">
    <Typography variant="h4" color="text.primary" fontWeight={500}>
      Explore Our Menu
    </Typography>
    <Typography variant="body1" color="text.secondary" className="max-w-3xl text-base">
      Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise. Our mission is to satisfy your craving and elevate your dining experience, one delicious meal at a time.
    </Typography>
    <ExploreMenuCategory menu_list={menu_list} />
    <Divider sx={{ marginTop: 2 }} />
  </Box>
  )
};

export default ExploreMenuWrapper;
