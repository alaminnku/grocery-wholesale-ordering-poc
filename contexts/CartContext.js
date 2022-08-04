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
  const { products, setProducts } = useProduct();

  // On app reload, get items from local storage
  // and update the cartItems state
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
    (price, currItem) => parseFloat((price + currItem.price).toFixed(2)),
    0
  );

  // Add items to cart
  const addVariantToCart = (rawId) => {
    // Updated items
    let updatedItems = [];

    // Product id
    const productId = formatId(rawId);

    // Current item
    const newItem = products.find((variant) => variant.productId === productId);

    // Set the updatedItems
    // If the current variant isn't in the cart
    if (
      !cartItems.some((cartItem) => cartItem.variantId === newItem.variantId)
    ) {
      // Add the current variant with
      // any previous variants to the updatedItems
      updatedItems = [...cartItems, newItem];

      // If the current variant is in the cart
    } else {
      updatedItems = cartItems.map((cartItem) => {
        // Find and update the item
        if (cartItem.variantId === newItem.variantId) {
          return {
            ...cartItem,
            quantity: newItem.quantity,
            price: newItem.price,
          };
        } else {
          // Return the other items
          return cartItem;
        }
      });
    }

    // Update cartItems with updatedItems
    setCartItems(updatedItems);

    // Set updatedItems to local storage
    localStorage.setItem("cart-items", JSON.stringify(updatedItems));

    // Update the products
    setProducts((prevProducts) =>
      prevProducts.map((prevProduct) => {
        // Find and update the item
        if (prevProduct.productId === productId) {
          return {
            ...prevProduct,
            quantity: 0,
            price: prevProduct.variantPrice,
          };
        } else {
          // Return other items
          return prevProduct;
        }
      })
    );
  };

  // Increase variant quantity in cart
  const increaseVariantQuantity = (variantId) => {
    const updatedItems = cartItems.map((cartItem) => {
      // Find and update the variant
      if (cartItem.variantId === variantId) {
        return {
          ...cartItem,
          quantity: cartItem.quantity + 1,
          price: parseFloat(
            ((cartItem.quantity + 1) * cartItem.variantPrice).toFixed(2)
          ),
        };
      } else {
        // Return other items
        return cartItem;
      }
    });

    // Set updated items to cart
    setCartItems(updatedItems);

    // Set updated items to local storage
    localStorage.setItem("cart-items", JSON.stringify(updatedItems));
  };

  // Decrease variant quantity in cart
  const decreaseVariantQuantity = (variantId) => {
    const updatedItems = cartItems.map((cartItem) => {
      // Find and update the variant
      if (cartItem.variantId === variantId) {
        return {
          ...cartItem,
          quantity: cartItem.quantity - 1,
          price: parseFloat(
            ((cartItem.quantity - 1) * cartItem.variantPrice).toFixed(2)
          ),
        };
      } else {
        // Return the other items
        return cartItem;
      }
    });

    // Set updated items to cart
    setCartItems(updatedItems);

    // Set updated items to local storage
    localStorage.setItem("cart-items", JSON.stringify(updatedItems));
  };

  // Remove cart item
  const removeVariantFromCart = (variantId) => {
    // Filter the items by variant id
    const filteredItems = cartItems.filter(
      (cartItem) => cartItem.variantId !== variantId
    );

    // Set updated items to cart
    setCartItems(filteredItems);

    // Set updated items to local storage
    localStorage.setItem("cart-items", JSON.stringify(filteredItems));
  };

  // Checkout the cart
  const checkoutCart = async () => {
    // Create a checkout
    const createCheckout = await shopifyClient.checkout.create();

    // Checkout Id
    const checkoutId = createCheckout.id;

    // Line items / variants
    const lineItemsToAdd = cartItems.map((cartItem) => ({
      variantId: `gid://shopify/ProductVariant/${cartItem.variantId}`,
      quantity: cartItem.quantity,
    }));

    // Add variants to check out
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
        isOpen,
        openCart,
        closeCart,
        totalCartQuantity,
        totalCartPrice,
        addVariantToCart,
        increaseVariantQuantity,
        decreaseVariantQuantity,
        removeVariantFromCart,
        checkoutCart,
      }}
    >
      {children}
      <Cart isOpen={isOpen} />
    </CartContext.Provider>
  );
};
