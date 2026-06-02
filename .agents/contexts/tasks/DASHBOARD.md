Build the dashboard data fetching logic using React Query (`useQuery`).

Requirements:

- The dashboard UI is already completed.
- DO NOT redesign the interface.
- Only update the logic to fetch and bind real API data.
- Use `useParams` from `react-router-dom` to get `from` and `to` values from the URL.
- `from` and `to` are ISO date strings.

API:
`GET /analists/?from=<from>&to=<to>`

Example:
`/analists/?from=2026-04-01T00:00:00.000Z&to=2026-06-02T00:00:00.000Z`

Use:

- `@tanstack/react-query`
- axios or existing API client

Implementation details:

- Create a query key using both `from` and `to`
- Refetch automatically when params change
- Handle loading and error states minimally
- Keep code clean and simple
- Reuse existing components and styles

Expected response shape:

```json
{
  "success": true,
  "message": "Lấy dữ liệu phân tích thành công",
  "data": {
    "stats": {
      "revenue": 245000,
      "guest": 3,
      "tables_reserving": 7,
      "total_tables": 8,
      "orders": 3
    },
    "top_dishes": [
      {
        "dish_id": 1,
        "dish_name": "{\"en\":\"Spring rolls\",\"vi\":\"Gỏi cuốn\"}",
        "total_quantity": 4
      }
    ],
    "revenue_chart": [
      {
        "date": "06-04",
        "revenue": 165000
      }
    ]
  }
}
```

Data mapping:

- `stats.revenue` → total revenue card
- `stats.guest` → guest count
- `stats.tables_reserving` → reserved tables
- `stats.total_tables` → total tables
- `stats.orders` → total orders
- `top_dishes` → top dishes section
- `revenue_chart` → revenue chart component

Important:

- `dish_name` is a JSON string.
- Parse it before rendering.

Example:

```ts
const parsedDishName = JSON.parse(dish.dish_name);
const displayName = parsedDishName.vi;
```

For charts:

- Use `revenue_chart` directly.
- `date` is already formatted as `DD-MM`.
- `revenue` is numeric.

Expected behavior:

- When URL params change, dashboard data updates automatically.
- Keep existing UI components unchanged.
- Only connect real backend data into the current dashboard.
- Avoid unnecessary abstractions or over-engineering.
