import Link from "next/link";
import Image from "next/image";
import { useProduct } from "@contexts/ProductContext";
import { useCart } from "@contexts/CartContext";
import { formatId } from "@utils/formatId";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import styles from "@styles/products/Product.module.css";

const Product = ({ product }) => {
  const {
    findCurrentProduct,
    increaseProductQuantity,
    decreaseProductQuantity,
  } = useProduct();
  const { addVariantToCart } = useCart();

  return (
    <div key={formatId(product.id)} className={styles.Product}>
      {/* Product title and image */}
      <div className={styles.ImageAndTitle}>
        <Link href={`/products/${formatId(product.id)}`}>
          <a>
            <Image
              src={product.images[0].src}
              height={9}
              width={16}
              layout="responsive"
            />

            <div className={styles.TitleAndPrice}>
              <p>{product.title}</p>

              {/* Render cart item price or initial price */}
              <p>
                AUD $
                {findCurrentProduct(product.id)?.price ||
                  parseFloat(product.variants[0].price)}
              </p>
            </div>
          </a>
        </Link>
      </div>

      <div className={styles.VariantsAndControl}>
        {/* Product variant options */}
        <select onChange={(e) => changeProductVariant(product, e.target.value)}>
          {product.variants.map((variant) => (
            <option key={formatId(variant.id)} value={formatId(variant.id)}>
              {variant.title}
            </option>
          ))}
        </select>

        {/* Increase quantity button */}
        <AiOutlinePlus onClick={() => increaseProductQuantity(product)} />

        {/* Quantity */}
        <p className={styles.Quantity}>
          {findCurrentProduct(product.id)?.quantity}
        </p>

        {/* Render the minus button if product quantity is more than 1 */}
        {findCurrentProduct(product.id)?.quantity > 1 && (
          <AiOutlineMinus onClick={() => decreaseProductQuantity(product)} />
        )}
      </div>

      <button onClick={() => addVariantToCart(product.id)}>Add to Cart</button>
    </div>
  );
};

export default Product;
