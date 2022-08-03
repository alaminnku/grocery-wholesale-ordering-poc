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
    changeProductVariant,
    increaseProductQuantity,
    decreaseProductQuantity,
  } = useProduct();
  const { addVariantToCart } = useCart();

  // Current product
  const currentProduct = findCurrentProduct(product.id);

  // Quantity
  const quantity = currentProduct?.quantity;

  // Price
  const price = currentProduct?.price;

  return (
    <div className={styles.Product}>
      {/* Product title and image */}
      <div className={styles.Image}>
        <Link href={`/products/${formatId(product.id)}`}>
          <a>
            <Image
              src={product.images[0].src}
              height={9}
              width={16}
              layout="responsive"
            />
          </a>
        </Link>
      </div>

      {/* Controller */}
      <div className={styles.Controller}>
        {/* Title and price */}
        <div className={styles.TitleAndPrice}>
          <Link href={`/products/${formatId(product.id)}`}>
            <a>
              <p>{product.title}</p>
              <p>
                AUD $
                {quantity > 0 ? price : parseFloat(product.variants[0].price)}
              </p>
            </a>
          </Link>
        </div>

        {/* Control */}
        <div className={styles.Control}>
          <select
            onChange={(e) => changeProductVariant(product, e.target.value)}
          >
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
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Product;
