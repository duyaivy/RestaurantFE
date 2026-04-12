export interface DishListConfig {
    page?: number
    limit?: number
    category_id?: number
    search?: string
    max_price?: number
    min_price?: number
}

export interface AccountListConfig {
    page?: number
    limit?: number
    search?: string
}