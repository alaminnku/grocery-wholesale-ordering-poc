import { formatId } from "@utils/formatId";
import { createContext, useContext, useState } from "react";

// Cart context
const CartContext = createContext();

// useCart hook
export const useCart = () => useContext(CartContext);

// Cart provider
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Open and close cart
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  // Total quantity
  // const cartQuantity = cartItem.reduce(
  //   (quantity, currentItem) => quantity + currentItem.quantity,
  //   0
  // );

  // Get the quantity
  const getItemQuantity = (id) => {
    // Find the item with id in cart items and return the quantity. Return 0 if there is no quantity
    return cartItems.find((item) => item.id === id)?.quantity || 0;
  };

  // Increase quantity
  const increaseQuantity = (product, variantId) => {
    console.log(variantId);
    const productId = formatId(product.id);
    const variant = product.variants[0].title;
    const genericPrice = parseFloat(product.variants[0].price);
    const variantPrice = product.variants.find(
      (variant) => formatId(variant.id) === variantId
    )?.price;
    const price = variantId ? variantPrice : genericPrice;

    setCartItems((currItems) => {
      // If there is no item in the cart with the product id then create an item
      if (currItems.find((item) => item.id === productId) == null) {
        return [
          ...currItems,
          {
            id: productId,
            name: product.title,
            quantity: 1,
            variant,
            price,
          },
        ];
      } else {
        // If there is an item in the cart with the product id then update the cart
        return currItems.map((item) => {
          if (item.id === productId) {
            return {
              ...item,
              quantity: item.quantity + 1,
              price: (item.quantity + 1) * price,
            };
          } else {
            // If the provided id doesn't match with the item id then return the item
            return item;
          }
        });
      }
    });
  };

  // Increase quantity
  const decreaseQuantity = (product) => {
    const productId = formatId(product.id);
    const genericPrice = parseFloat(product.variants[0].price);
    const variantPrice = product.variants.find(
      (variant) => formatId(variant.id) === variantId
    )?.price;
    const price = variantId ? variantPrice : genericPrice;

    setCartItems((currItems) => {
      // If the item quantity is 1 and the item id matches with provided id then remove the item from cart
      if (currItems.find((item) => item.id === productId)?.quantity === 1) {
        return currItems.filter((item) => item.id !== productId);
      } else {
        return currItems.map((item) => {
          // If the item quantity is more than one and the item id matches with the provided id then decrease the quantity by one
          if (item.id === productId) {
            return {
              ...item,
              quantity: item.quantity - 1,
              price: (item.quantity - 1) * price,
            };
          } else {
            // If the provided id don't match with the item id then return the item
            return item;
          }
        });
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    setCartItems((currItems) => {
      // Return all the items which has a different id than the provided it
      return currItems.filter((item) => item.id !== id);
    });
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        getItemQuantity,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
