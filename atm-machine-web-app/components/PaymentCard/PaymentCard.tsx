import { useState } from "react";
import styles from "./PaymentCard.module.css";

export default function PaymentCard({ cardType }: { cardType: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={styles.container}>
      <p
        className={`${styles.cardLabel} ${!isHovered ? styles.cardLabelHidden : styles.cardLabelVisible}`}
      >
        Current Card Selected:{" "}
        {isHovered
          ? cardType === "visa"
            ? "Visa Debit ****5555"
            : "MasterCard Debit ****1234"
          : ""}
      </p>
      <div className={styles.cardWrapper}>
        {cardType === "visa" ? (
          <div
            className={`${styles.card} ${styles.visaCard}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className={styles.glowOverlay}></div>
            <div className={styles.cardContent}>
              <div className={styles.topRow}>
                <span className={styles.debitLabel}>Debit</span>
                <span className={styles.cardBrand}>VISA</span>
              </div>

              <div className={styles.chip}></div>

              <div className={styles.cardNumber}>4567&nbsp;****&nbsp;****&nbsp;5555</div>

              <div className={styles.bottomRow}>
                <div className={styles.cardInfo}>
                  <p className={styles.infoLabel}>Card Holder</p>
                  <p className={styles.infoValue}>RISHAV C.</p>
                </div>
                <div className={`${styles.cardInfo} ${styles.cardInfoRight}`}>
                  <p className={styles.infoLabel}>Valid Thru</p>
                  <p className={styles.infoValue}>12/29</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`${styles.card} ${styles.mastercardCard}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className={styles.glowOverlay}></div>
            <div className={styles.cardContent}>
              <div className={styles.topRow}>
                <span className={styles.debitLabel}>Debit</span>
                <span className={styles.cardBrand}>MasterCard</span>
              </div>

              <div className={styles.chip}></div>

              <div className={styles.cardNumber}>4567&nbsp;****&nbsp;****&nbsp;1234</div>

              <div className={styles.bottomRow}>
                <div className={styles.cardInfo}>
                  <p className={styles.infoLabel}>Card Holder</p>
                  <p className={styles.infoValue}>TODD H.</p>
                </div>
                <div className={`${styles.cardInfo} ${styles.cardInfoRight}`}>
                  <p className={styles.infoLabel}>Valid Thru</p>
                  <p className={styles.infoValue}>09/27</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
