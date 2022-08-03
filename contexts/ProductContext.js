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

  // Find the current product
  const findCurrentProduct = (rawId) => {
    const productId = formatId(rawId);

    // Return the product that matches the id
    return products.find((product) => product.productId === productId);
  };

  // Find the product variant
  const findProductVariant = (product, variantId) =>
    product.variants.find((variant) => formatId(variant.id) === variantId);

  // Find the variant id
  const findVariantId = (product, productId) =>
    products.find((variant) => variant.productId === productId)?.variantId ||
    formatId(product.variants[0].id);

  //  Change variant
  const changeProductVariant = (product, variantId) => {
    // Product id
    const productId = formatId(product.id);

    // Product variant
    const productVariant = findProductVariant(product, variantId);

    // Update the products state
    setProducts((prevProducts) => {
      // If there is no product in the cart that
      // matches the provided productId, then create a product
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
        // If there is a product in the cart that
        //matches the provided productId
      } else {
        return prevProducts.map((prevProduct) => {
          // Find and update that product
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
            // Return the other products
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
    const variantId = findVariantId(product, productId);

    // Product variant
    const productVariant = findProductVariant(product, variantId);

    // Update products state
    setProducts((prevProducts) => {
      // If there is no product in the cart that
      // matches the provided productId, then create a product
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

        // If there is a product in the cart that
        //matches the provided productId
      } else {
        return prevProducts.map((prevProduct) => {
          // Find and update that product
          if (prevProduct.productId === productId) {
            return {
              ...prevProduct,
              quantity: prevProduct.quantity + 1,
              price: parseFloat(
                ((prevProduct.quantity + 1) * prevProduct.variantPrice).toFixed(
                  2
                )
              ),
            };
          } else {
            // Return the other products
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
    const variantId = findVariantId(product, productId);

    // Variant price
    const variantPrice = findProductVariant(product, variantId).price;

    // Update the products state
    setProducts((prevProducts) => {
      return prevProducts.map((prevProduct) => {
        // Find and update the product
        if (prevProduct.productId === productId) {
          return {
            ...prevProduct,
            quantity: prevProduct.quantity - 1,
            price: parseFloat(
              ((prevProduct.quantity - 1) * variantPrice).toFixed(2)
            ),
          };
        } else {
          // Return the other products
          return prevProduct;
        }
      });
    });
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        setProducts,
        findCurrentProduct,
        changeProductVariant,
        increaseProductQuantity,
        decreaseProductQuantity,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
