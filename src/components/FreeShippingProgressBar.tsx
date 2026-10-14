import { Link } from 'react-router-dom';
import { FiTruck, FiCheckCircle, FiArrowRight, FiPackage } from 'react-icons/fi';
import { formatCurrency } from '../utilities/formatCurrency';
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE } from '../data/coupons';

export type FreeShippingProgressBarProps = {
  subtotal: number;
  threshold?: number;
  standardFee?: number;
  hasFreeShippingCoupon?: boolean;
  onBrowseStore?: () => void;
};

export function FreeShippingProgressBar({
  subtotal,
  threshold = FREE_SHIPPING_THRESHOLD,
  standardFee = STANDARD_SHIPPING_FEE,
  hasFreeShippingCoupon = false,
  onBrowseStore,
}: FreeShippingProgressBarProps) {
  const isUnlocked = subtotal >= threshold || hasFreeShippingCoupon;
  const amountNeeded = Math.max(0, threshold - subtotal);
  const percentage = isUnlocked
    ? 100
    : Math.min(100, Math.max(0, Math.round((subtotal / threshold) * 100)));

  return (
    <div
      className={`free-shipping-card mb-3 ${isUnlocked ? 'unlocked' : 'in-progress'}`}
      role="region"
      aria-label="Free Shipping Progress"
    >
      <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
        <div className="d-flex align-items-center gap-2">
          <div className={`free-shipping-icon-bubble ${isUnlocked ? 'unlocked' : 'in-progress'}`}>
            {isUnlocked ? (
              <FiCheckCircle size={17} className="text-success" />
            ) : (
              <FiTruck size={17} className="text-primary shipping-truck-icon" />
            )}
          </div>
          <div>
            {isUnlocked ? (
              <div>
                <div className="free-shipping-headline unlocked fw-bold">
                  🎉 FREE Express Delivery Unlocked!
                </div>
                <div className="free-shipping-subtext">
                  {hasFreeShippingCoupon
                    ? `FREESHIP coupon applied — ${formatCurrency(standardFee)} shipping is free!`
                    : `You saved ${formatCurrency(standardFee)} on priority 2-day delivery.`}
                </div>
              </div>
            ) : (
              <div>
                <div className="free-shipping-headline in-progress">
                  Add{' '}
                  <span className="free-shipping-amount-needed fw-bold">
                    {formatCurrency(amountNeeded)}
                  </span>{' '}
                  more for <strong>FREE Delivery</strong>!
                </div>
                <div className="free-shipping-subtext">
                  Unlock free express shipping on orders over {formatCurrency(threshold)}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 text-end">
          <span className={`free-shipping-pct-pill ${isUnlocked ? 'unlocked' : 'in-progress'}`}>
            {isUnlocked ? 'FREE ✓' : `${percentage}%`}
          </span>
        </div>
      </div>

      {/* Progress Bar Track */}
      <div
        className="free-shipping-track"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progress towards free express delivery"
      >
        <div
          className={`free-shipping-fill ${isUnlocked ? 'unlocked' : 'in-progress'}`}
          style={{ width: `${percentage}%` }}
        >
          <div className="free-shipping-shimmer-stripe" />
        </div>
      </div>

      {/* Milestones / Hints */}
      <div className="free-shipping-milestones mt-1 d-flex align-items-center justify-content-between">
        <span className="milestone-label start">$0</span>
        {!isUnlocked ? (
          <div className="d-flex align-items-center gap-1">
            <span className="milestone-hint">
              Save {formatCurrency(standardFee)}
            </span>
            {onBrowseStore && (
              <>
                <span className="text-muted opacity-50">•</span>
                <Link
                  to="/store"
                  onClick={onBrowseStore}
                  className="free-shipping-quick-add-link d-inline-flex align-items-center gap-1"
                >
                  <span>Add items</span>
                  <FiArrowRight size={11} />
                </Link>
              </>
            )}
          </div>
        ) : (
          <span className="milestone-hint unlocked">
            All items in cart ship for free 🚀
          </span>
        )}
        <span className="milestone-label end d-inline-flex align-items-center gap-1">
          <FiPackage size={11} />
          <span>{formatCurrency(threshold)}</span>
        </span>
      </div>
    </div>
  );
}

