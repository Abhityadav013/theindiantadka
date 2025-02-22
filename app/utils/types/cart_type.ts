export interface Cart {
    itemId:string,
    itemName:string,
    quantity:number
}

export interface CartItem{
    cart:CartItem[]
}