import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { shopifyClient } from "@utils/shopify";
import { formatId } from "@utils/formatId";
import Cart from "@components/layout/Cart";
import { useProduct } from "./ProductContext";

// Cart context
const CartContext = createContext();

// useCart hook
export const useCart = () => useContext(CartContext);

// Cart provider
export const CartProvider = ({ children }) => {
  // Hooks
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { initialProducts } = useProduct();

  // Get items from local storage on app reload
  useEffect(() => {
    setCartItems(JSON.parse(localStorage.getItem("cart-items")) || []);
  }, []);

  // Cart open and close functions
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  // Calculate total quantity
  const totalCartQuantity = cartItems.reduce(
    (quantity, currItem) => quantity + currItem.quantity,
    0
  );

  // Calculate total price
  const totalCartPrice = cartItems.reduce(
    (price, currItem) => price + currItem.price,
    0
  );

  // Add items to cart
  const addItemToCart = (rawId) => {
    // Cart items
    const cartItems = [];

    // Product id
    const productId = formatId(rawId);

    // Current item
    const currItem = initialProducts.find(
      (initialProduct) => initialProduct.productId === productId
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

    // Update cart items
    setCartItems(cartItems);
  };

  // Increase variant quantity in cart
  const increaseVariantQuantity = (variantId) => {
    // Update the quantity and price
    const updatedItems = cartItems.map((cartItem) => {
      if (cartItem.variantId === variantId) {
        return {
          ...cartItem,
          quantity: cartItem.quantity + 1,
          price: (cartItem.quantity + 1) * cartItem.variantPrice,
        };
      } else {
        return cartItem;
      }
    });

    // Set updated items to local storage
    localStorage.setItem("cart-items", JSON.stringify(updatedItems));

    // Set updated items to cart
    setCartItems(updatedItems);
  };

  // Increase variant quantity in cart
  const decreaseVariantQuantity = (variantId) => {
    // Update the quantity and price
    const updatedItems = cartItems.map((cartItem) => {
      if (cartItem.variantId === variantId) {
        return {
          ...cartItem,
          quantity: cartItem.quantity - 1,
          price: (cartItem.quantity - 1) * cartItem.variantPrice,
        };
      } else {
        return cartItem;
      }
    });

    // Set updated items to local storage
    localStorage.setItem("cart-items", JSON.stringify(updatedItems));

    // Set updated items to cart
    setCartItems(updatedItems);
  };

  // Remove cart item
  const removeItemFromCart = (variantId) => {
    // Filter the items by variant id
    const filteredItems = cartItems.filter(
      (item) => item.variantId !== variantId
    );

    // Set updated items to local storage
    localStorage.setItem("cart-items", JSON.stringify(filteredItems));

    // Update cartUpdated state
    setCartItems(filteredItems);
  };

  // Handle checkout
  const checkoutCart = async () => {
    // Create a checkout
    const createCheckout = await shopifyClient.checkout.create();

    // Checkout Id
    const checkoutId = createCheckout.id;

    // Line items / items
    const lineItemsToAdd = cartItems.map((cartItem) => ({
      variantId: `gid://shopify/ProductVariant/${cartItem.variantId}`,
      quantity: cartItem.quantity,
    }));

    // Add items to check out
    const checkout = await shopifyClient.checkout.addLineItems(
      checkoutId,
      lineItemsToAdd
    );

    // Push to shopify checkout page
    router.push(checkout.webUrl);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        openCart,
        closeCart,
        totalCartQuantity,
        totalCartPrice,
        addItemToCart,
        increaseVariantQuantity,
        decreaseVariantQuantity,
        removeItemFromCart,
        checkoutCart,
      }}
    >
      {children}
      <Cart isOpen={isOpen} />
    </CartContext.Provider>
  );
};
