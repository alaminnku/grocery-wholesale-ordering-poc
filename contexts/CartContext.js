import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useProduct } from "./ProductContext";
import { shopifyClient } from "@utils/shopify";
import { formatId } from "@utils/formatId";
import Cart from "@components/layout/Cart";

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
    // Updated items
    let updatedItems = [];

    // Product id
    const productId = formatId(rawId);

    // Current item
    const currItem = initialProducts.find(
      (initialProduct) => initialProduct.productId === productId
    );

    // Set the updatedItems
    // If the current variant isn't in the cart
    if (
      cartItems.find((cartItem) => cartItem.variantId === currItem.variantId) ==
      null
    ) {
      // Add the current variant with
      // any previous variants to the updatedItems
      updatedItems = [...cartItems, currItem];

      // If the current variant is in the cart
    } else {
      // Set the updatedItems with updated cartItems
      updatedItems = cartItems.map((cartItem) => {
        // Update the item in the cart which has
        // the same variantId as the currItem variantId
        if (cartItem.variantId === currItem.variantId) {
          return {
            ...cartItem,
            quantity: currItem.quantity,
            price: currItem.price,
          };
        } else {
          // Return any item as it is which variantId
          // doesn't match with currItem's variantId
          return cartItem;
        }
      });
    }

    // Update the cartItems with updatedItems
    setCartItems(updatedItems);

    // Set updatedItems to local storage
    localStorage.setItem("cart-items", JSON.stringify(updatedItems));
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
