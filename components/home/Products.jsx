import Link from "next/link";
import Image from "next/image";
import { useProduct } from "@contexts/ProductContext";
import { useCart } from "@contexts/CartContext";
import { formatId } from "@utils/formatId";
import { AiOutlinePlus } from "react-icons/ai";
import styles from "@styles/home/Products.module.css";

const Products = ({ products }) => {
  const {
    findCurrentProduct,
    increaseProductQuantity,
    decreaseProductQuantity,
  } = useProduct();
  const { addVariantToCart } = useCart();

  return (
    <div>
      {products.map((product) => (
        <div key={formatId(product.id)} className={styles.Product}>
          {/* Product title and image */}
          <Link href={`/products/${formatId(product.id)}`}>
            <a>
              <h3>{product.title}</h3>
              <Image
                src={product.images[0].src}
                height={9}
                width={16}
                layout="responsive"
              />
            </a>
          </Link>

          {/* Product variant options */}
          <select
            onChange={(e) => changeProductVariant(product, e.target.value)}
          >
            {product.variants.map((variant) => (
              <option key={formatId(variant.id)} value={formatId(variant.id)}>
                {variant.title}
              </option>
            ))}
          </select>

          {/* Increase quantity button */}
          <AiOutlinePlus onClick={() => increaseProductQuantity(product)} />

          {/* Quantity */}
          <span>{findCurrentProduct(product.id)?.quantity}</span>

          {/* Render the minus button if product quantity is more than 1 */}
          {findCurrentProduct(product.id)?.quantity > 1 && (
            <AiOutlineMinus onClick={() => decreaseProductQuantity(product)} />
          )}

          {/* Render cart item price or initial price */}
          <p>
            AUD $
            {findCurrentProduct(product.id)?.price ||
              parseFloat(product.variants[0].price)}
          </p>

          <button onClick={() => addVariantToCart(product.id)}>
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
};

export default Products;
