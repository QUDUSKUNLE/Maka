export const mockData = {
  SHOW_SERVICE: {
    CreateShow: {
      createShow: {
        createShow: [{ showName: 'Show 1' }, { showName: 'Show 2' }],
      },
    },
    GetShow: {
      findUnique: { showID: 1, showName: 'Show 1' },
    },
    GetShows: {
      findMany: [
        { showID: '1', showName: 'Show 1' },
        { showID: '2', showName: 'Show 2' },
      ],
    },
    BuyItem: {
      GetInventory: { itemID: 1, itemName: 'item 1', quantity: 100 },
      GetShow: { showID: 1, showName: 'show 1' },
      UpdateInventory: { itemID: 1, itemName: 'item 1', quantity: 101 },
      create: { count: 1 },
      soldItemParams: { item_ID: '1', show_ID: '1' },
      soldItemQuantityDto: { quantity: 1 },
      soldItemDto: { quantity: 0 },
      soldItemShowNotFound: { item_ID: '1', show_ID: '1000000' },
    },
    GetSoldItems: {
      GetSoldItem: {
        findMany: [
          {
            id: 1,
            inventoryId: 1,
            showId: 1,
            quantity: 2,
            inventory: { itemID: 1, itemName: 'item1', quantity: 2 },
          },
          {
            id: 2,
            inventoryId: 1,
            showId: 1,
            quantity: 3,
            inventory: { itemID: 1, itemName: 'item1', quantity: 2 },
          },
        ],
        SpyGetSoldItem: { itemID: '1', itemName: 'Show 1', quantity_sold: 3 },
      },
      GetSoldItems: {
        findMany: [
          {
            id: 1,
            inventoryId: 1,
            showId: 1,
            quantity: 2,
            inventory: { itemID: 1, itemName: 'item1', quantity: 2 },
          },
          {
            id: 2,
            inventoryId: 2,
            showId: 1,
            quantity: 3,
            inventory: { itemID: 2, itemName: 'item2', quantity: 4 },
          },
          {
            id: 3,
            inventoryId: 2,
            showId: 1,
            quantity: 4,
            inventory: { itemID: 2, itemName: 'item2', quantity: 5 },
          },
        ],
        SpyGetSoldItems: [
          { item_ID: '1', itemName: 'Show 1', quantity_sold: 3 },
          { item_ID: '2', itemName: 'Show 2', quantity_sold: 3 },
        ],
      },
    },
    SHOW_NOT_FOUND: 'Show not found.',
    ZERO_ORDER_MADE: 'Zero order made.',
    ITEM_OUT_OF_STOCK: 'Item out of stock',
  },
};
