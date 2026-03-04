import React from 'react';
import { X, Plus, Minus, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useTheme } from '../contexts/ThemeContext';

const CartDrawer = ({ onCheckout }) => {
  const { cart, isOpen, setIsOpen, updateQuantity, removeItem } = useCart();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  const bg = isDark ? 'bg-[#111]' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-[#1a1a1a]';
  const mutedText = isDark ? 'text-white/40' : 'text-black/40';
  const borderColor = isDark ? 'border-white/[0.08]' : 'border-black/[0.08]';

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
        role="presentation"
        aria-hidden="true"
      />
      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md ${bg} z-[70] flex flex-col shadow-2xl`}
        role="dialog"
        aria-label="Shopping cart"
        aria-modal="true"
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${borderColor}`}>
          <div className="flex items-center gap-3">
            <ShoppingBag size={18} className={mutedText} />
            <h2 className={`${textColor} text-sm tracking-[0.2em] uppercase`} style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem' }}>Your Cart</h2>
            <span className={`${mutedText} text-[10px] tracking-wider`}>({cart.item_count} items)</span>
          </div>
          <button onClick={() => setIsOpen(false)} className={`${mutedText} hover:${textColor} transition-colors p-1`} aria-label="Close cart">
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <ShoppingBag size={40} className={`${mutedText} mb-4`} />
              <p className={`${mutedText} text-sm tracking-wider`}>Your cart is empty</p>
            </div>
          ) : (
            cart.items.map((item) => (
              <div key={item.product_id} className={`flex gap-4 pb-4 border-b ${borderColor}`}>
                <div className="w-20 h-24 flex-shrink-0 overflow-hidden">
                  <img src={item.product?.image} alt={item.product?.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`${isDark ? 'text-white/30' : 'text-black/30'} text-[9px] tracking-[0.2em] uppercase mb-0.5`}>{item.product?.brand}</p>
                  <p className={`${textColor} text-sm truncate mb-1`}>{item.product?.name}</p>
                  <p className={`${mutedText} text-[10px] mb-2`}>{item.size} / {item.color}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                        className={`w-6 h-6 flex items-center justify-center border ${borderColor} ${mutedText} hover:${textColor} transition-colors`}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={10} />
                      </button>
                      <span className={`${textColor} text-xs w-6 text-center`}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                        className={`w-6 h-6 flex items-center justify-center border ${borderColor} ${mutedText} hover:${textColor} transition-colors`}
                        aria-label="Increase quantity"
                      >
                        <Plus size={10} />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`${textColor} text-sm font-medium`}>${(item.product?.sale_price * item.quantity).toFixed(2)}</span>
                      <button onClick={() => removeItem(item.product_id)} className="text-red-400/60 hover:text-red-400 transition-colors" aria-label="Remove item">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.items.length > 0 && (
          <div className={`p-6 border-t ${borderColor}`}>
            <div className="flex items-center justify-between mb-4">
              <span className={`${mutedText} text-xs tracking-[0.2em] uppercase`}>Subtotal</span>
              <span className={`${textColor} text-lg font-medium`}>${cart.total.toFixed(2)}</span>
            </div>
            <button
              onClick={() => { setIsOpen(false); onCheckout(); }}
              className={`w-full border text-xs tracking-[0.3em] uppercase py-4 transition-colors duration-300 flex items-center justify-center gap-2 ${
                isDark ? 'border-white/20 text-white hover:bg-white/5' : 'border-black/20 text-black hover:bg-black/5'
              }`}
              aria-label="Proceed to checkout"
            >
              Checkout
              <ArrowRight size={12} />
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;
