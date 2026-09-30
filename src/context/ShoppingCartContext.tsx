import {createContext, ReactNode, useContext, useState} from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

type ShoppingCartProviderProps={
    children:ReactNode
}

type CartItem={
    id:number
    quantity:number
}

function isCartItems(value: unknown): value is CartItem[] {
    return Array.isArray(value) && value.every(item => (
        typeof item === 'object' &&
        item !== null &&
        typeof item.id === 'number' &&
        Number.isInteger(item.id) &&
        typeof item.quantity === 'number' &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0
    ))
}

type ShoppingCartContext={
    clearCart:()=>void
    openCart:()=>void
    closeCart:()=>void
    isCartOpen:boolean
    getItemQuantity:(id:number)=>number
    increaseItemQuantity:(id:number)=>void
    decreaseItemQuantity:(id:number)=>void
    removeFromCart:(id:number)=>void
    cartQuantity:number
    cartItems:CartItem[]
}

const ShoppingCartContext=createContext<ShoppingCartContext | null>(null)

// eslint-disable-next-line react-refresh/only-export-components
export function useShoppingCart()
{
    const context = useContext(ShoppingCartContext)
    if (context === null) {
        throw new Error('useShoppingCart must be used within ShoppingCartProvider')
    }
    return context
}


export function ShoppingCartProvider({children}:ShoppingCartProviderProps)
{
    const [isOpen,setIsOpen]=useState(false)
    const [cartItems,setCartItems]=useLocalStorage<CartItem[]>("shopping-cart",[], isCartItems)

    const cartQuantity=cartItems.reduce((quantity,item)=>item.quantity+quantity,0)

    const openCart=()=>setIsOpen(true)
    const closeCart=()=>setIsOpen(false)

    function getItemQuantity(id:number){
        return cartItems.find(item=>item.id===id)?.quantity ||0
    }

    function increaseItemQuantity(id:number){
        setCartItems(currItems=>{
            if(currItems.find(item=>item.id===id)==null){
                return [...currItems, {id,quantity:1}]
            }
            else
            {
                return currItems.map(item=>{
                    if(item.id==id){
                        return {...item, quantity:item.quantity+1}
                    }
                    else
                    {
                        return item
                    }
                })
            }
        })
    }

    function decreaseItemQuantity(id:number){
        setCartItems(currItems=>{
            const currentItem = currItems.find(item => item.id === id)
            if (currentItem === undefined) return currItems
            if(currentItem.quantity <= 1){
                return currItems.filter(item=>item.id!==id)
            }
            else
            {
                return currItems.map(item=>{
                    if(item.id===id){
                        return {...item, quantity:item.quantity-1}
                    }
                    else
                    {
                        return item
                    }
                })
            }
        })
    }

    function removeFromCart(id:number){
        setCartItems(currItems=>{
            return currItems.filter(item=>item.id!==id)
        })
    }

    function clearCart()
    {
        setCartItems([])
    }

    return (
    <ShoppingCartContext.Provider value={{getItemQuantity,increaseItemQuantity, decreaseItemQuantity, removeFromCart,openCart, closeCart, isCartOpen: isOpen, cartItems,cartQuantity, clearCart}}>
        {children}
    </ShoppingCartContext.Provider>)
}