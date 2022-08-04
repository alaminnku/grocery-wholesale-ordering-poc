import { useProduct } from "@contexts/ProductContext";
import { useCart } from "@contexts/CartContext";
import { formatId } from "@utils/formatId";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import styles from "@styles/products/Controller.module.css";

const Controller = ({ product }) => {
  const {
    findCurrentProduct,
    changeProductVariant,
    increaseProductQuantity,
    decreaseProductQuantity,
  } = useProduct();
  const { addVariantToCart } = useCart();

  // Current product
  const currentProduct = findCurrentProduct(product.id);

  // Quantity
  const quantity = currentProduct?.quantity;

  return (
    <>
      <div className={styles.Controller}>
        <select onChange={(e) => changeProductVariant(product, e.target.value)}>
          {product.variants.map((variant) => (
            <option key={formatId(variant.id)} value={formatId(variant.id)}>
              {variant.title}
            </option>
          ))}
        </select>

        <AiOutlinePlus
          className={quantity > 0 && styles.Active}
          onClick={() => increaseProductQuantity(product)}
        />

        <p className={quantity > 0 ? styles.Quantity : null}>
          {quantity > 0 && quantity}
        </p>

        {quantity > 0 && (
          <AiOutlineMinus
            className={styles.Active}
            onClick={() => decreaseProductQuantity(product)}
          />
        )}
      </div>

      <button
        className={`${styles.AddToCart} ${quantity > 0 && styles.Active}`}
        onClick={() => addVariantToCart(product.id)}
      >
        Add to cart
      </button>
    </>
  );
};

export default Controller;
