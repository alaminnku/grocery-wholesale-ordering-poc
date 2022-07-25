import { createContext, useContext, useState } from "react";
import { formatId } from "@utils/formatId";

// Cart context
const CartContext = createContext();

// useCart hook
export const useCart = () => useContext(CartContext);

// Cart provider
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartQuantity, setCartQuantity] = useState(null);

  // Get cart items and quantity from local storage
  const getCartItemsAndQuantity = () => {
    const items = JSON.parse(localStorage.getItem("cartItems"));

    // Update cartItems and cartQuantity state
    setCartItems((prevItems) => items || prevItems);

    setCartQuantity(
      items?.reduce(
        (quantity, currentItem) => quantity + currentItem.quantity,
        0
      )
    );
  };

  //  Change variant
  const changeVariant = (product, variantId) => {
    // Product id
    const productId = formatId(product.id);

    // Product variant
    const productVariant = product.variants.find(
      (variant) => formatId(variant.id) === variantId
    );

    // Update the cartItems state
    setCartItems((prevItems) => {
      // If there is no item in the cart with the product id then create an item
      if (prevItems.find((item) => item.productId === productId) == null) {
        return [
          ...prevItems,
          {
            productId,
            name: product.title,
            quantity: 1,
            variantId,
            variantName: productVariant.title,
            variantPrice: parseFloat(productVariant.price),
            variantImage: productVariant.image.src,
            price: parseFloat(productVariant.price),
          },
        ];
      } else {
        // If there is an item in the cart with the product id then update the item
        return prevItems.map((item) => {
          if (item.productId === productId) {
            return {
              ...item,
              variantId,
              variantName: productVariant.title,
              variantPrice: parseFloat(productVariant.price),
              variantImage: productVariant.image.src,
              price: parseFloat(productVariant.price) * item.quantity,
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
    // Product id
    const productId = formatId(product.id);

    // Variant id
    const variantId =
      cartItems.find((item) => item.productId === productId)?.variantId ||
      formatId(product.variants[0].id);

    // Product variant
    const productVariant = product.variants.find(
      (variant) => formatId(variant.id) === variantId
    );

    // Update cartItems state
    setCartItems((prevItems) => {
      // If there is no item in the cart with the product id then create an item
      if (prevItems.find((item) => item.productId === productId) == null) {
        return [
          ...prevItems,
          {
            productId,
            name: product.title,
            quantity: 1,
            variantId,
            variantName: productVariant.title,
            variantPrice: parseFloat(productVariant.price),
            variantImage: productVariant.image.src,
            price: parseFloat(productVariant.price),
          },
        ];
      } else {
        // If there is an item in the cart with the product id then update the cart
        return prevItems.map((item) => {
          if (item.productId === productId) {
            return {
              ...item,
              quantity: item.quantity + 1,
              price: (item.quantity + 1) * parseFloat(productVariant.price),
            };
          } else {
            // If the provided id doesn't match with the item id then return the item
            return item;
          }
        });
      }
    });
  };

  // Decrease quantity
  const decreaseQuantity = (product) => {
    // Product id
    const productId = formatId(product.id);

    // Variant id
    const variantId =
      cartItems.find((item) => item.productId === productId)?.variantId ||
      formatId(product.variants[0].id);

    // Get variant price with variant id
    const variantPrice = product.variants.find(
      (variant) => formatId(variant.id) === variantId
    ).price;

    setCartItems((prevItems) => {
      return prevItems.map((item) => {
        // If the item the item id matches with the provided id then update the price and quantity
        if (item.productId === productId) {
          return {
            ...item,
            quantity: item.quantity - 1,
            price: (item.quantity - 1) * variantPrice,
          };
        } else {
          // If the provided id don't match with the item id then return the item
          return item;
        }
      });
    });
  };

  // Add items to local storage
  const addToCart = () => {
    // Set cart items to local storage
    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    // Get carItems and cartQuantity and update the states
    getCartItemsAndQuantity();
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    setCartItems((prevItems) => {
      // Return all the items which has a different id than the provided it
      return prevItems.filter((item) => item.id !== id);
    });
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartQuantity,
        getCartItemsAndQuantity,
        changeVariant,
        increaseQuantity,
        decreaseQuantity,
        addToCart,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
