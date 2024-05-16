import { createContext, useEffect, useState } from 'react'
import PropTypes from "prop-types";
import { getInventoryByUser, getInventoryLocalStorage, setInventoryLocalStorage } from './util';

export const InventoryContext = createContext({});


export const InventoryProvider = ({ children }) => {

    const [inventory, setInventory] = useState(null);

    useEffect(() => {
        const inventory = getInventoryLocalStorage();

        if(inventory) {
            setInventory(inventory);
        }

    }, []);

    async function getInventory(inventoryId, headers) {
        try {
            const response = await getInventoryByUser(inventoryId, headers);
            console.log(response.data);
            const payload = { 
                id: response.data.id, 
                name: response.data.name, 
                description: response.data.description
            };

            setInventory(payload);
            setInventoryLocalStorage(payload);
        } catch (error) {
            console.error('Inventory Context failed:', error);
            throw error;
        }
    }

    return (
        <InventoryContext.Provider value={{...inventory, getInventory }}>
            {children}
        </InventoryContext.Provider>
    );
}

InventoryProvider.propTypes = {
    children: PropTypes.node.isRequired,
};