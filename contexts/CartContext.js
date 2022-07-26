import { createContext, useContext, useState } from "react";
import { formatId } from "@utils/formatId";

// Cart context
const CartContext = createContext();

// useCart hook
export const useCart = () => useContext(CartContext);

// Cart provider
export const CartProvider = ({ children }) => {
  const [initialItems, setInitialItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  // Get cart items local storage
  const getCartItems = () => {
    // Get items from local storage
    const items = JSON.parse(localStorage.getItem("cartItems"));

    // Update cartItems state
    setCartItems((prevItems) => items || prevItems);
  };

  // Calculate total quantity
  const calculateQuantity = () => {
    return cartItems.reduce(
      (quantity, currItem) => quantity + currItem.quantity,
      0
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

    // Update the initialItems state
    setInitialItems((prevItems) => {
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
      initialItems.find((item) => item.productId === productId)?.variantId ||
      formatId(product.variants[0].id);

    // Product variant
    const productVariant = product.variants.find(
      (variant) => formatId(variant.id) === variantId
    );

    // Update initialItems state
    setInitialItems((prevItems) => {
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
      initialItems.find((item) => item.productId === productId)?.variantId ||
      formatId(product.variants[0].id);

    // Get variant price with variant id
    const variantPrice = product.variants.find(
      (variant) => formatId(variant.id) === variantId
    ).price;

    setInitialItems((prevItems) => {
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
  const addToCart = (product) => {
    const productId = formatId(product.id);

    // Item to add to cart
    const newItem = initialItems.find(
      (initialItem) => initialItem.productId === productId
    );

    // Add and update items in cartItems
    setCartItems((prevItems) => {
      // Add the newItem to cart if the variant doesn't exist
      if (
        prevItems.find(
          (cartItem) => cartItem.variantId === newItem.variantId
        ) == null
      ) {
        return [...prevItems, newItem];
      } else {
        // Update the item
        return prevItems.map((prevItem) => {
          // Update the quantity and price if the product and variant match
          if (
            prevItem.productId === productId &&
            prevItem.variantId == newItem.variantId
          ) {
            return {
              ...prevItem,
              quantity: newItem.quantity,
              price: (newItem.quantity + 1) * prevItem.price,
            };
          } else {
            // Return the item as it is if the product and variant don't match
            return prevItem;
          }
        });
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (variantId) => {
    setCartItems((prevItems) => {
      // Return all the items which has a different id than the provided it
      return prevItems.filter((item) => item.variantId !== variantId);
    });
  };

  return (
    <CartContext.Provider
      value={{
        initialItems,
        cartItems,
        getCartItems,
        calculateQuantity,
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
