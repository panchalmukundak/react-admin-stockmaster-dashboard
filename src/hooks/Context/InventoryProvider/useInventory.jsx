import { useContext } from "react";
import { InventoryContext } from "./InventoryContext";

export const useInventory = () => {
    const context = useContext(InventoryContext);
    return context;
};