import { createContext, useContext, useState } from "react";
import { formatId } from "@utils/formatId";

// Cart context
const CartContext = createContext();

// useCart hook
export const useCart = () => useContext(CartContext);

// Cart provider
export const CartProvider = ({ children }) => {
  const [initialItems, setInitialItems] = useState([]);
  const [totalItems, setTotalItems] = useState([]);
  const [cartUpdated, setCartUpdated] = useState(false);

  // Calculate total quantity
  const calculateQuantity = (cartItems) => {
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
    // Cart items
    const cartItems = [];

    // Product id
    const productId = formatId(product.id);

    // New item
    const currItem = initialItems.find(
      (initialItem) => initialItem.productId === productId
    );

    // Cart items from local storage
    const prevItems = JSON.parse(localStorage.getItem("cart-items"));

    // Update cart items
    // If there are no previous items
    if (!prevItems) {
      // Add current item to the cart
      cartItems.push(currItem);

      // If there are previous items
    } else {
      // If current item doesn't exist in previous items
      if (
        prevItems.find(
          (prevItem) => prevItem.productId === currItem.productId
        ) == null
      ) {
        // Add current item and previous items to the cart
        cartItems.push(...prevItems, currItem);

        // If the current item exists in previous items
      } else {
        // If current variant doesn't exist in cart
        if (
          prevItems.find(
            (prevItem) => prevItem.variantId === currItem.variantId
          ) == null
        ) {
          // Add current variant to the cart
          cartItems.push(...prevItems, currItem);

          // If current variant exists in the previous items
        } else {
          const updatedItems = prevItems.map((prevItem) => {
            if (
              prevItem.productId === currItem.productId &&
              prevItem.variantId === currItem.variantId
            ) {
              return {
                ...prevItem,
                quantity: currItem.quantity,
                price: (currItem.quantity + 1) * prevItem.price,
              };
            } else {
              return prevItem;
            }
          });

          cartItems.push(...updatedItems);
        }
      }
    }

    // Set cart items to local storage
    localStorage.setItem("cart-items", JSON.stringify(cartItems));

    // Update total items
    setCartUpdated(!cartUpdated);
  };

  // Remove item from cart
  const removeFromCart = (variantId) => {
    setCartItems((prevItems) => {
      // Return all the items which has a different id than the provided id
      return prevItems.filter((item) => item.variantId !== variantId);
    });
  };

  return (
    <CartContext.Provider
      value={{
        initialItems,
        totalItems,
        cartUpdated,
        setCartUpdated,
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
