import Image from "next/image";
import { useCart } from "@contexts/CartContext";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { IoCloseOutline } from "react-icons/io5";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import styles from "@styles/layout/Cart.module.css";
import { useEffect } from "react";

const Cart = ({ isOpen }) => {
  // Hooks
  const {
    closeCart,
    cartItems,
    totalCartPrice,
    totalCartQuantity,
    increaseVariantQuantity,
    decreaseVariantQuantity,
    removeVariantFromCart,
    checkoutCart,
  } = useCart();

  // Disable and enable body scroll
  useEffect(() => {
    const cart = document.querySelector("#Cart");

    isOpen ? disableBodyScroll(cart) : enableBodyScroll(cart);
  });

  // Format product title
  const productTitle = (name, variantName) => {
    let title = `${name} - ${variantName}`;

    if (title.length > 15) {
      title = title.split("").slice(0, 16).join("");
    }

    return <p>{title}...</p>;
  };

  return (
    <div>
      <div id="Cart" className={`${styles.Cart} ${isOpen && styles.Open}`}>
        {/* Cart top */}
        <div className={styles.CartTop}>
          <p>
            <HiOutlineShoppingBag /> {totalCartQuantity}{" "}
            {totalCartQuantity > 1 ? "items" : "item"}
          </p>
          <IoCloseOutline className={styles.CloseIcon} onClick={closeCart} />
        </div>

        {/* Items and checkout button */}
        <div className={styles.ItemsAndCheckout}>
          {/* Items */}
          <div>
            {cartItems.length === 0 ? (
              <p className={styles.EmptyCart}>Your cart is empty!</p>
            ) : (
              cartItems.map((item) => (
                <div key={item.variantId} className={styles.Item}>
                  {/* Quantity */}
                  <div className={styles.Quantity}>
                    <AiOutlinePlus
                      onClick={() => increaseVariantQuantity(item.variantId)}
                    />
                    <p>{item.quantity}</p>
                    <AiOutlineMinus
                      className={item.quantity > 1 && styles.Enabled}
                      onClick={() =>
                        item.quantity > 1 &&
                        decreaseVariantQuantity(item.variantId)
                      }
                    />
                  </div>

                  {/* Image */}
                  <div className={styles.Image}>
                    <Image
                      src={item.variantImage}
                      width={16}
                      height={10}
                      layout="responsive"
                    />
                  </div>

                  {/* Content */}
                  <div className={styles.Content}>
                    {productTitle(item.name, item.variantName)}
                    <small>
                      ${item.variantPrice} x {item.quantity}
                    </small>
                    <p>${item.price}</p>
                  </div>

                  {/* Delete */}
                  <div className={styles.Delete}>
                    <IoCloseOutline
                      onClick={() => removeVariantFromCart(item.variantId)}
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Checkout button */}
          {cartItems.length > 0 && (
            <button onClick={checkoutCart} className={styles.Checkout}>
              Checkout now (${totalCartPrice})
            </button>
          )}
        </div>
      </div>

      {/* Overlay */}
      <div
        className={`${styles.Overlay} ${isOpen && styles.Open}`}
        onClick={closeCart}
      ></div>
    </div>
  );
};

export default Cart;
