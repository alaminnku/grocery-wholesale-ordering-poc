import { createContext, useContext, useState } from "react";
import { formatId } from "@utils/formatId";

// Product context
const ProductContext = createContext();

// Use product hook
export const useProduct = () => useContext(ProductContext);

// Product provider
export const ProductProvider = ({ children }) => {
  // Variants array
  const [products, setProducts] = useState([]);

  // Current item
  const currentVariant = (rawId) => {
    const productId = formatId(rawId);

    // Return the product that matches the id
    return products.find((product) => product.productId === productId);
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
    setProducts((prevProducts) => {
      // If there is no item in the cart with the product id then create an item
      if (
        !prevProducts.some((prevProduct) => prevProduct.productId === productId)
      ) {
        return [
          ...prevProducts,
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
        return prevProducts.map((prevProduct) => {
          if (prevProduct.productId === productId) {
            return {
              ...prevProduct,
              quantity: 1,
              variantId,
              variantName: productVariant.title,
              variantPrice: parseFloat(productVariant.price),
              variantImage: productVariant.image.src,
              price: parseFloat(productVariant.price),
            };
          } else {
            return prevProduct;
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
      products.find((variant) => variant.productId === productId)?.variantId ||
      formatId(product.variants[0].id);

    // Product variant
    const productVariant = product.variants.find(
      (variant) => formatId(variant.id) === variantId
    );

    // Update variants state
    setProducts((prevProducts) => {
      // If there is no variant in the cart with the product id then create an item
      if (
        !prevProducts.some((prevProduct) => prevProduct.productId === productId)
      ) {
        return [
          ...prevProducts,
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
        return prevProducts.map((prevProduct) => {
          if (prevProduct.productId === productId) {
            return {
              ...prevProduct,
              quantity: prevProduct.quantity + 1,
              price:
                (prevProduct.quantity + 1) * parseFloat(productVariant.price),
            };
          } else {
            // If the provided id doesn't match with the item id then return the item
            return prevProduct;
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
      products.find((variant) => variant.productId === productId)?.variantId ||
      formatId(product.variants[0].id);

    // Get variant price with variant id
    const variantPrice = product.variants.find(
      (variant) => formatId(variant.id) === variantId
    ).price;

    setProducts((prevProducts) => {
      return prevProducts.map((prevProduct) => {
        // If the prevProduct the prevProduct id matches with the provided id then update the price and quantity
        if (prevProduct.productId === productId) {
          return {
            ...prevProduct,
            quantity: prevProduct.quantity - 1,
            price: (prevProduct.quantity - 1) * variantPrice,
          };
        } else {
          // If the provided id don't match with the prevProduct id then return the prevProduct
          return prevProduct;
        }
      });
    });
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        currentVariant,
        changeProductVariant,
        increaseProductQuantity,
        decreaseProductQuantity,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
