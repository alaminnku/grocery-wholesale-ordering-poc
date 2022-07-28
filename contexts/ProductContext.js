import { createContext, useContext, useState } from "react";
import { formatId } from "@utils/formatId";

// Product context
const ProductContext = createContext();

// Use product hook
export const useProduct = () => useContext(ProductContext);

// Product provider
export const ProductProvider = ({ children }) => {
  const [initialProducts, setInitialProducts] = useState([]);

  // Current item
  const currentProduct = (rawId) => {
    const productId = formatId(rawId);

    // Return the product that matches the id
    return initialProducts.find((product) => product.productId === productId);
  };

  //  Change variant
  const changeProductVariant = (product, variantId) => {
    // Product id
    const productId = formatId(product.id);

    // Product variant
    const productVariant = product.variants.find(
      (variant) => formatId(variant.id) === variantId
    );

    // Update the products state
    setInitialProducts((prevItems) => {
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
  const increaseProductQuantity = (product) => {
    // Product id
    const productId = formatId(product.id);

    // Variant id
    const variantId =
      initialProducts.find((item) => item.productId === productId)?.variantId ||
      formatId(product.variants[0].id);

    // Product variant
    const productVariant = product.variants.find(
      (variant) => formatId(variant.id) === variantId
    );

    // Update initialProducts state
    setInitialProducts((prevItems) => {
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
  const decreaseProductQuantity = (product) => {
    // Product id
    const productId = formatId(product.id);

    // Variant id
    const variantId =
      initialProducts.find((item) => item.productId === productId)?.variantId ||
      formatId(product.variants[0].id);

    // Get variant price with variant id
    const variantPrice = product.variants.find(
      (variant) => formatId(variant.id) === variantId
    ).price;

    setInitialProducts((prevItems) => {
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

  return (
    <ProductContext.Provider
      value={{
        currentProduct,
        initialProducts,
        changeProductVariant,
        increaseProductQuantity,
        decreaseProductQuantity,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
