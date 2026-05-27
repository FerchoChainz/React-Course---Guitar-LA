import { useEffect, useState, useMemo } from 'react';
import {db} from '../data/db';

const useCart = () => {

    const initialCart = () => {
        const localStorageCart = localStorage.getItem('cart');
        return localStorageCart ? JSON.parse(localStorageCart) : [];
    }
    
    const [data] = useState(db);
    const [cart, setCart] = useState(initialCart);

    const MAX_ITEMS = 10;
    const MIN_ITEMS = 1;

    // useEfect cuando detecta un cambio en el carrito, lo guarda en el localStorage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart])

    function addToCart(item){
        const itemExist = cart.findIndex((guitar)=> 
            guitar.id === item.id)

            if(itemExist >= 0){ // if exist add quantity
                const upgradedCart = [...cart];
                upgradedCart[itemExist].quantity ++;
                setCart(upgradedCart);
            } else {
                
                item.quantity = 1;
                setCart([...cart, item])
            }


    }

    function removeFromCart(id){
        setCart((prevCart) => prevCart.filter(guitar => guitar.id !== id));
    }

    function increaseQuantity(id){
        const updatedCart = cart.map((item) => {
            if (item.id === id && item.quantity < MAX_ITEMS){
                return {...item, 
                    quantity: item.quantity + 1}
            }
            return item;
        })
        setCart(updatedCart);
    }

    function decreaseQuantity(id){
        const uptdatedCart = cart.map((item) => {
            if (item.id === id && item.quantity > MIN_ITEMS){
                return {...item, 
                    quantity: item.quantity - 1}
                }
                return item;
            })
            setCart(uptdatedCart);
    }

    function clearCart(){
        setCart([]);
    }

    // state derivado para mostrar mensaje carrito vacio o con productos
  const isEmpty = useMemo(() => cart.length === 0, [cart]);

  // state derivado para calcular el total a pagar
  const cartTotal = useMemo(
    () => cart.reduce((total, item) => total + item.price * item.quantity, 0),
    [cart],
  );

    return {
        data,
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        isEmpty,
        cartTotal
    }
}

export default useCart;