import api from "../../../services/api";

export function setInventoryLocalStorage (inventory) {
  localStorage.setItem("i", JSON.stringify(inventory));
}

export function getInventoryLocalStorage () {
  const json = localStorage.getItem("i");
  
  if (!json) {
    return null;
  }

  const inventory = JSON.parse(json);

  return inventory ?? null;
}


export async function getInventoryByUser(inventoryId, headers) {
  try {
    const response = await api.get(`/api/v1/inventories/${inventoryId}`, headers);
    return response;
  } catch (error) {
    return false;
  }
}