import { queryOptions } from "@tanstack/react-query";
import { getMenu, getDashboard, getItemReviews, getAllReviews } from "./menu.functions";
export const menuQuery = queryOptions({ queryKey: ["menu"], queryFn: () => getMenu() });
export const dashboardQuery = queryOptions({ queryKey: ["dashboard"], queryFn: () => getDashboard() });
export const itemReviewsQuery = (itemId: string) => queryOptions({ queryKey: ["reviews", itemId], queryFn: () => getItemReviews({ data: { itemId } }) });
export const allReviewsQuery = queryOptions({ queryKey: ["reviews", "all"], queryFn: () => getAllReviews() });
