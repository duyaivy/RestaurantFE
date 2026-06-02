Implement the Orders tab for the restaurant admin dashboard.

Context:

* The project already has an existing dashboard UI and table layout similar to the current Food/Dishes management screen.
* Do NOT redesign the whole UI.
* Reuse existing components, table styles, buttons, modals, dropdown actions, pagination, loading states, and form patterns as much as possible.
* The goal is to implement CRUD-like order management quickly and cleanly.

Main requirements:

* Create an Orders management page/tab.
* Use React Query (`useQuery`, `useMutation`) for API calls.
* Use the existing API client/axios setup.
* Keep the UI consistent with the existing dark admin dashboard.
* Include loading, empty, and error states.
* After create/update actions, invalidate/refetch the orders list query.

1. Get Orders List

Endpoint:

```ts
GET /orders/?page=1&limit=10
```

Expected response:

```json
{
  "success": true,
  "message": "Lấy danh sách đơn hàng thành công",
  "data": {
    "count": 2,
    "current": 1,
    "results": [
      {
        "id": 26,
        "guest_id": 25,
        "table_number": 1,
        "order_handler_id": null,
        "status": "COMPLETED",
        "payment_method": "CASH",
        "total_amount": "80000.00",
        "created_at": "2026-04-07T10:31:55.378777+07:00",
        "updated_at": "2026-04-07T10:35:20.815095+07:00"
      }
    ]
  }
}
```

Display these columns:

* ID
* Guest ID
* Table Number
* Handler ID
* Status
* Payment Method
* Total Amount
* Created At
* Actions

Notes:

* `total_amount` is a string, format it as VND.
* `created_at` should be displayed in a readable date/time format.
* `status` should be displayed as a badge.
* `payment_method` should be displayed clearly, for example: CASH, QR_CODE.
* Add pagination using `page` and `limit`.

2. Staff Create Order

Endpoint:

```ts
POST /orders/staff-create/
```

Body:

```json
{
  "table_number_id": 9,
  "guest_id": 12,
  "items": [
    {
      "dish_id": 5,
      "quantity": 1,
      "note": "Thêm bún"
    },
    {
      "dish_id": 3,
      "quantity": 1,
      "note": "khong an cay"
    }
  ]
}
```

Success response:

```json
{
  "success": true,
  "message": "Đơn hàng đã được tạo thành công",
  "data": {
    "id": 27,
    "guest_id": 12,
    "table_number": 9,
    "order_handler_id": 6,
    "status": "PENDING",
    "payment_method": "CASH",
    "total_amount": "90000.00",
    "created_at": "2026-06-02T22:11:20.624915+07:00",
    "updated_at": "2026-06-02T22:11:21.181757+07:00"
  }
}
```

UI:

* Add a button: “Create Order” or “Thêm đơn hàng”.
* Open a modal/form.
* Fields:

  * Table number ID
  * Guest ID
  * Order items list

    * Dish ID
    * Quantity
    * Note
  * Allow adding/removing item rows dynamically.
* Submit using `useMutation`.
* On success, close modal and refetch orders.

3. Update Order Information

Endpoint:

```ts
PATCH /orders/{orderNumber}/update/
```

Body:

```json
{
  "table_number": 3,
  "order_handler_id": 1,
  "status": "PREPARING",
  "payment_method": "QR_CODE"
}
```

Success response:

* The updated order object.

UI:

* In each order row, add an actions dropdown.
* Include action: Edit Order.
* Open modal with existing order data.
* Editable fields:

  * Table number
  * Order handler ID
  * Status
  * Payment method

Status options:

* PENDING
* PREPARING
* COMPLETED
* CANCELLED

Payment method options:

* CASH
* QR_CODE

After updating:

* Show success message/toast if available.
* Refetch orders list.

4. Update Order Items

Endpoint:

```ts
PATCH /orders/{orderNumber}/items/
```

Body:

```json
{
  "add_items": [
    {
      "dish_id": 4,
      "quantity": 2
    }
  ],
  "cancel_item_ids": [],
  "update_items": [
    {
      "order_item_id": 42,
      "quantity": 3,
      "note": "Không bỏ hành",
      "item_status": "COOKING"
    }
  ]
}
```

UI:

* In row actions dropdown, add action: Edit Items.
* Open an order items modal.
* Support three sections:

  1. Add new items
  2. Cancel existing items by item ID
  3. Update existing items

Fields for add items:

* Dish ID
* Quantity
* Note optional if supported

Fields for cancel items:

* Order item ID

Fields for update items:

* Order item ID
* Quantity
* Note
* Item status

Item status options:

* PENDING
* COOKING
* DONE
* CANCELLED

Implementation notes:

* Use dynamic form rows for add_items, cancel_item_ids, and update_items.
* Send only the arrays needed by the user action.
* Empty arrays are allowed.
* After successful update, refetch the orders list.

React Query structure suggestion:

```ts
useQuery({
  queryKey: ["orders", page, limit],
  queryFn: () => getOrders({ page, limit })
});
```

```ts
useMutation({
  mutationFn: createStaffOrder,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["orders"] });
  }
});
```

API functions suggestion:

```ts
getOrders({ page, limit })
createStaffOrder(payload)
updateOrder(orderId, payload)
updateOrderItems(orderId, payload)
```

Important:

* Keep the implementation simple.
* Do not over-engineer.
* Reuse existing UI components and styles from the Food/Dishes tab.
* Match the current dashboard design: dark theme, table layout, action dropdown, modal forms, orange primary button.
* Focus on making the Orders tab functional with the provided APIs.
