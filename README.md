# Maka Home Test

## Local set up
## clone the app & run 
```bash
git clone git@github.com:QUDUSKUNLE/Maka.git && cd Maka
```

## Installation

```bash
npm install
```

## Running the app
```bash
npm start
```

## Populate with some test data using the following endpoints

- Create batch of inventories
> POST /inventories
   ```Body
     {
       "createInventory":[
        {   "itemID"?: 1, // This is optional
            "itemName": "Fancy Dress",
            "quantity": 50
        }
      ]
     }
   ```
- Create batches of shows
> POST /shows
   ```Body
    {
      "createShow":[
        {   
          "showID"?: 2, // This is optional
          "showName": "Show 3"
        }
      ]
    }
   ```
- Buy an item from a show
> POST /shows/:show_ID/buy_items/:item_ID
  ```Body
    {
      "quantity": 1 // Quantity of item to be bought
    }
  ```
- View list of items sold by a show or amount of items sold by a show
> GET /shows/:show_ID/sold_items

- View count of an item sold by a show
> GET /shows/:show_ID/sold_items/:item_ID

## Constraints
```bash
- The batchQueries could optimized and more cleaner
```

## Support

## License
