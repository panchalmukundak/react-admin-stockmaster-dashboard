import { useContext } from "react";
import { InventoryContext } from "./InventoryContext";

// 9
export const useInventory = () => {
    const context = useContext(InventoryContext);
    return context;
};