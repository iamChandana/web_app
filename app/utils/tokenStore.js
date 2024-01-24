export const storeItem = (itemName, Item) => sessionStorage.setItem(itemName, Item);
export const clearItem = (itemName) => sessionStorage.removeItem(itemName);
export const getItem = (itemName) => sessionStorage.getItem(itemName);
