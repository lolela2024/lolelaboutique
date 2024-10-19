import prisma from "./db";



// Funcția pentru verificarea stocului produselor din coș
export async function checkCartStock(cartItems: { id: string; quantity: number }[]) {
  const productIds = cartItems.map((item) => item.id);

  // Obținem toate produsele din coș din baza de date
  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
    },
    include: {
      inventory: true, // Includem inventarul pentru a verifica stocul
    },
  });

  const outOfStockItems = [];

  // Verificăm stocul fiecărui produs
  for (const item of cartItems) {
    const product = products.find((p) => p.id === item.id);
    if (product?.inventory) {
      const availableStock = product.inventory.available;
      if (availableStock < item.quantity) {
        outOfStockItems.push({
          productId: product.id,
          productName: product.name,
          availableStock: availableStock,
          requestedQuantity: item.quantity,
        });
      }
    }
  }

  // Returnăm produsele care nu au suficient stoc
  return outOfStockItems;
}
