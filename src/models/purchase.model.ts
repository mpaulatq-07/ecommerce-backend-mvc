let purchases: any[] = [];
let idCounter = 1;

export const createPurchase = (purchase: any) => {
  const newPurchase = {
    id: idCounter++,
    ...purchase,
    date: new Date(),
  };

  purchases.push(newPurchase);
  return newPurchase;
};

export const getPurchases = () => purchases;