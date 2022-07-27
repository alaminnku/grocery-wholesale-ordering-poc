import { useEffect, useState } from "react";
import Image from "next/image";
import { useCart } from "@contexts/CartContext";
import { IoCloseOutline } from "react-icons/io5";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { RiDeleteBin5Line } from "react-icons/ri";
import styles from "@styles/layout/Cart.module.css";

const Cart = ({ isOpen, setIsOpen }) => {
  const [cartItems, setCartItems] = useState([]);
  const { cartUpdated, setCartUpdated, calculateQuantity } = useCart();
  const cartQuantity = calculateQuantity(cartItems);

  // Get items from local storage when total items changes
  useEffect(() => {
    setCartItems(JSON.parse(localStorage.getItem("cart-items")) || []);
  }, [cartUpdated]);

  // Remove cart item
  const removeCartItem = (variantId) => {
    // Filter the items by variant id
    const filteredItems = cartItems.filter(
      (item) => item.variantId !== variantId
    );

    // Set updated items to local storage
    localStorage.setItem("cart-items", JSON.stringify(filteredItems));

    // Update cartUpdated state
    setCartUpdated(!cartUpdated);
  };

  return (
    <>
      <div
        className={`${styles.Overlay} ${isOpen && styles.Open}`}
        onClick={() => setIsOpen(false)}
      ></div>

      <div className={`${styles.Cart} ${isOpen && styles.Open}`}>
        <div className={styles.CartHeader}>
          <h3>
            Your cart <span>({cartQuantity})</span>
          </h3>
          <IoCloseOutline onClick={() => setIsOpen(false)} />
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
                  onClick={() => removeCartItem(item.variantId)}
                />
              </div>
            </div>
          ))}
        </div>
        <button>Checkout</button>
      </div>
    </>
  );
};

export default Cart;
