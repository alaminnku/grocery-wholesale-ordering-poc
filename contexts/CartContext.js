import { createContext, useContext, useState } from "react";
import { formatId } from "@utils/formatId";

// Cart context
const CartContext = createContext();

// useCart hook
export const useCart = () => useContext(CartContext);

// Cart provider
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Open and close cart
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  // Total quantity
  const cartQuantity = cartItems.reduce(
    (quantity, currentItem) => quantity + currentItem.quantity,
    0
  );

  // Get the quantity
  const getItemQuantity = (id) => {
    // Find the item with id in cart items and return the quantity. Return 0 if there is no quantity
    return cartItems.find((item) => item.id === id)?.quantity || 0;
  };

  //  Change variant
  const changeVariant = (product, variantId) => {
    // Get the product id
    const productId = formatId(product.id);

    // Get variant price with variant id
    const variantPrice = product.variants.find(
      (variant) => formatId(variant.id) === variantId
    ).price;

    // Update the items in cart
    setCartItems((prevItems) => {
      // If there is no item in the cart with the product id then create an item
      if (prevItems.find((item) => item.productId === productId) == null) {
        return [
          ...prevItems,
          {
            productId,
            name: product.title,
            variantId,
            quantity: 1,
            price: variantPrice,
          },
        ];
      } else {
        // If there is an item in the cart with the product id then update the item
        return prevItems.map((item) => {
          if (item.productId === productId) {
            return {
              ...item,
              variantId,
              price: variantPrice * item.quantity,
            };
          } else {
            return item;
          }
        });
      }
    });
  };

  // Increase quantity
  const increaseQuantity = (product) => {
    // Get product id
    const productId = formatId(product.id);

    // Get either variant id from cart of initial variant id
    const variantId =
      cartItems.find((item) => item.productId === productId)?.variantId ||
      formatId(product.variants[0].id);

    // Get variant price with variant id
    const variantPrice = product.variants.find(
      (variant) => formatId(variant.id) === variantId
    ).price;

    setCartItems((prevItems) => {
      // If there is no item in the cart with the product id then create an item
      if (prevItems.find((item) => item.productId === productId) == null) {
        return [
          ...prevItems,
          {
            productId,
            name: product.title,
            variantId,
            quantity: 1,
            price: variantPrice,
          },
        ];
      } else {
        // If there is an item in the cart with the product id then update the cart
        return prevItems.map((item) => {
          if (item.productId === productId) {
            return {
              ...item,
              quantity: item.quantity + 1,
              price: (item.quantity + 1) * variantPrice,
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
        cartQuantity,
        setCartItems,
        changeVariant,
        getItemQuantity,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
