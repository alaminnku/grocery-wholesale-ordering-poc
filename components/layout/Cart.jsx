import { useRouter } from "next/router";
import Image from "next/image";
import { useCart } from "@contexts/CartContext";
import { shopifyClient } from "@utils/shopify";
import { IoCloseOutline } from "react-icons/io5";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { RiDeleteBin5Line } from "react-icons/ri";
import styles from "@styles/layout/Cart.module.css";

const Cart = ({ isOpen }) => {
  // Hooks
  const router = useRouter();
  const {
    closeCart,
    cartItems,
    cartQuantity,
    increaseVariantQuantity,
    decreaseVariantQuantity,
    removeItemFromCart,
  } = useCart();

  // Handle checkout
  const handleCheckout = async () => {
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
    <>
      <div
        className={`${styles.Overlay} ${isOpen && styles.Open}`}
        onClick={closeCart}
      ></div>

      <div className={`${styles.Cart} ${isOpen && styles.Open}`}>
        <div className={styles.CartHeader}>
          <h3>
            Your cart <span>({cartQuantity})</span>
          </h3>
          <IoCloseOutline onClick={closeCart} />
        </div>

        <div>{!cartQuantity && <p>Your cart is empty</p>}</div>

        <div>
          {cartItems.map((item) => (
            <div key={item.variantId} className={styles.Item}>
              <div className={styles.Image}>
                <Image
                  src={item.variantImage}
                  width={16}
                  height={10}
                  layout="responsive"
                />
              </div>
              <div className={styles.Content}>
                <div>
                  <p>{item.name}</p>
                  <small>Variant: {item.variantName}</small>
                  <small>{item.quantity}</small>
                </div>
                <div>
                  <p>${item.price}</p>
                </div>
              </div>
              <div>
                <RiDeleteBin5Line
                  onClick={() => removeItemFromCart(item.variantId)}
                />
              </div>

              {item.quantity > 1 && (
                <AiOutlineMinus
                  onClick={() => decreaseVariantQuantity(item.variantId)}
                />
              )}

              <AiOutlinePlus
                onClick={() => increaseVariantQuantity(item.variantId)}
              />
            </div>
          ))}
        </div>
        <button onClick={handleCheckout}>Checkout</button>
      </div>
    </>
  );
};

export default Cart;
