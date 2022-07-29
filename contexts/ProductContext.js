import { createContext, useContext, useState } from "react";
import { formatId } from "@utils/formatId";

// Product context
const ProductContext = createContext();

// Use product hook
export const useProduct = () => useContext(ProductContext);

// Product provider
export const ProductProvider = ({ children }) => {
  // Variants array
  const [variants, setVariants] = useState([]);

  // Current item
  const currentVariant = (rawId) => {
    const productId = formatId(rawId);

    // Return the product that matches the id
    return variants.find((product) => product.productId === productId);
  };

  //  Change variant
  const changeVariant = (product, variantId) => {
    // Product id
    const productId = formatId(product.id);

    // Product variant
    const productVariant = product.variants.find(
      (variant) => formatId(variant.id) === variantId
    );

    // Update the products state
    setVariants((prevVariants) => {
      // If there is no item in the cart with the product id then create an item
      if (
        !prevVariants.some((prevVariant) => prevVariant.productId === productId)
      ) {
        return [
          ...prevVariants,
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
        // If there is an variant in the cart with the product id then update the variant
        return prevVariants.map((prevVariant) => {
          if (prevVariant.productId === productId) {
            return {
              ...prevVariant,
              quantity: 1,
              variantId,
              variantName: productVariant.title,
              variantPrice: parseFloat(productVariant.price),
              variantImage: productVariant.image.src,
              price: parseFloat(productVariant.price),
            };
          } else {
            return prevVariant;
          }
        });
      }
    });
  };

  // Increase quantity
  const increaseVariantQuantity = (product) => {
    // Product id
    const productId = formatId(product.id);

    // Variant id
    const variantId =
      variants.find((variant) => variant.productId === productId)?.variantId ||
      formatId(product.variants[0].id);

    // Product variant
    const productVariant = product.variants.find(
      (variant) => formatId(variant.id) === variantId
    );

    // Update variants state
    setVariants((prevVariants) => {
      // If there is no variant in the cart with the product id then create an item
      if (
        !prevVariants.some((prevVariant) => prevVariant.productId === productId)
      ) {
        return [
          ...prevVariants,
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
        return prevVariants.map((prevVariant) => {
          if (prevVariant.productId === productId) {
            return {
              ...prevVariant,
              quantity: prevVariant.quantity + 1,
              price:
                (prevVariant.quantity + 1) * parseFloat(productVariant.price),
            };
          } else {
            // If the provided id doesn't match with the item id then return the item
            return prevVariant;
          }
        });
      }
    });
  };

  // Decrease quantity
  const decreaseVariantQuantity = (product) => {
    // Product id
    const productId = formatId(product.id);

    // Variant id
    const variantId =
      variants.find((variant) => variant.productId === productId)?.variantId ||
      formatId(product.variants[0].id);

    // Get variant price with variant id
    const variantPrice = product.variants.find(
      (variant) => formatId(variant.id) === variantId
    ).price;

    setVariants((prevVariants) => {
      return prevVariants.map((prevVariant) => {
        // If the prevVariant the prevVariant id matches with the provided id then update the price and quantity
        if (prevVariant.productId === productId) {
          return {
            ...prevVariant,
            quantity: prevVariant.quantity - 1,
            price: (prevVariant.quantity - 1) * variantPrice,
          };
        } else {
          // If the provided id don't match with the prevVariant id then return the prevVariant
          return prevVariant;
        }
      });
    });
  };

  return (
    <ProductContext.Provider
      value={{
        variants,
        currentVariant,
        changeVariant,
        increaseVariantQuantity,
        decreaseVariantQuantity,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
