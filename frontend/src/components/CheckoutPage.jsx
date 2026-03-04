import React, { useState, useEffect } from 'react';
import { ArrowLeft, Truck, Zap, Clock, Store, CreditCard, Check, ShieldCheck } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { apiService } from '../services/api';

const SHIPPING_ICONS = { standard: Truck, express: Zap, overnight: Clock, pickup: Store };

const CheckoutPage = ({ onBack }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { cart, fetchCart } = useCart();
  const isDark = theme === 'dark';
  const [step, setStep] = useState(1);
  const [shippingMethods, setShippingMethods] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState('standard');
  const [address, setAddress] = useState({ name: user?.name || '', street: '', city: '', state: '', zip: '', phone: '' });
  const [processing, setProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [razorpayConfigured, setRazorpayConfigured] = useState(false);

  const bg = isDark ? 'bg-[#0a0a0a]' : 'bg-[#faf9f6]';
  const cardBg = isDark ? 'bg-[#111]' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-[#1a1a1a]';
  const mutedText = isDark ? 'text-white/40' : 'text-black/40';
  const borderColor = isDark ? 'border-white/[0.08]' : 'border-black/[0.08]';
  const inputClass = `w-full bg-transparent border text-sm px-4 py-3 focus:outline-none transition-colors ${isDark ? 'border-white/10 text-white focus:border-white/30 placeholder:text-white/20' : 'border-black/10 text-black focus:border-black/30 placeholder:text-black/20'}`;

  useEffect(() => {
    apiService.getShippingMethods().then(d => setShippingMethods(d.methods)).catch(() => {});
    apiService.getRazorpayConfig().then(d => setRazorpayConfigured(d.configured)).catch(() => {});
  }, []);

  const shipping = shippingMethods.find(m => m.id === selectedShipping) || { price: 4.99 };
  const shippingCost = shipping.free_above && cart.total >= shipping.free_above ? 0 : shipping.price;
  const total = cart.total + shippingCost;

  const handleAddressChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value });

  const handlePlaceOrder = async () => {
    setProcessing(true);
    try {
      const res = await apiService.createOrder(selectedShipping, address);
      const order = res.order;
      setOrderId(order.id);

      if (order.razorpay_key && order.razorpay_order_id) {
        // Use real Razorpay
        const options = {
          key: order.razorpay_key,
          amount: Math.round(order.total * 100),
          currency: order.currency,
          name: 'Trendora',
          description: `Order ${order.id}`,
          order_id: order.razorpay_order_id,
          handler: async (response) => {
            await apiService.verifyPayment(response.razorpay_order_id, response.razorpay_payment_id, response.razorpay_signature);
            setOrderComplete(true);
            await fetchCart();
          },
          prefill: { name: user?.name, email: user?.email },
          theme: { color: isDark ? '#1a1a1a' : '#faf9f6' }
        };
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', () => { setProcessing(false); });
        rzp.open();
      } else {
        // Demo payment
        await apiService.demoPayment();
        setOrderComplete(true);
        await fetchCart();
      }
    } catch (err) {
      console.error('Order failed:', err);
    }
    setProcessing(false);
  };

  if (orderComplete) {
    return (
      <div className={`fixed inset-0 z-[80] ${bg} flex items-center justify-center`}>
        <div className="text-center max-w-md px-8" role="alert" aria-live="polite">
          <div className={`w-16 h-16 mx-auto mb-6 rounded-full border-2 flex items-center justify-center ${isDark ? 'border-green-400/30' : 'border-green-600/30'}`}>
            <Check size={28} className={isDark ? 'text-green-400' : 'text-green-600'} />
          </div>
          <h2 className={`${textColor} text-4xl mb-3`} style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Order Confirmed!</h2>
          <p className={`${mutedText} text-sm mb-2`}>Order #{orderId}</p>
          <p className={`${mutedText} text-xs mb-8`}>
            {razorpayConfigured ? 'Payment processed via Razorpay' : 'Demo payment — configure Razorpay keys in backend/.env for real payments'}
          </p>
          <button onClick={onBack} className={`border text-xs tracking-[0.3em] uppercase px-8 py-3 transition-colors ${isDark ? 'border-white/20 text-white hover:bg-white/5' : 'border-black/20 text-black hover:bg-black/5'}`}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 z-[80] ${bg} overflow-y-auto`}>
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <button onClick={onBack} className={`flex items-center gap-2 ${mutedText} text-xs tracking-[0.2em] uppercase hover:${textColor} transition-colors`} aria-label="Back to shopping">
            <ArrowLeft size={14} /> Back
          </button>
          <h1 className={`${textColor} text-3xl`} style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Checkout</h1>
          <div className={`${mutedText} text-[10px] tracking-wider`}>Step {step}/2</div>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center gap-4 mb-10">
          {['Shipping', 'Payment'].map((s, i) => (
            <React.Fragment key={s}>
              <button onClick={() => i === 0 && setStep(1)} className="flex items-center gap-2" aria-current={step === i + 1 ? 'step' : undefined}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] border transition-colors ${
                  step > i + 1 ? (isDark ? 'bg-white/10 border-white/20 text-white' : 'bg-black/10 border-black/20 text-black') :
                  step === i + 1 ? (isDark ? 'border-white/40 text-white' : 'border-black/40 text-black') :
                  isDark ? 'border-white/10 text-white/20' : 'border-black/10 text-black/20'
                }`}>{step > i + 1 ? <Check size={10} /> : i + 1}</div>
                <span className={`text-[10px] tracking-[0.2em] uppercase ${
                  step >= i + 1 ? textColor : mutedText
                }`}>{s}</span>
              </button>
              {i < 1 && <div className={`flex-1 h-[1px] ${isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]'}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="space-y-8">
                {/* Shipping Address */}
                <section aria-label="Shipping address">
                  <h3 className={`${textColor} text-xl mb-4`} style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Shipping Address</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input name="name" placeholder="Full name" value={address.name} onChange={handleAddressChange} className={inputClass} required aria-label="Full name" />
                    <input name="phone" placeholder="Phone number" value={address.phone} onChange={handleAddressChange} className={inputClass} required aria-label="Phone number" />
                    <div className="sm:col-span-2">
                      <input name="street" placeholder="Street address" value={address.street} onChange={handleAddressChange} className={inputClass} required aria-label="Street address" />
                    </div>
                    <input name="city" placeholder="City" value={address.city} onChange={handleAddressChange} className={inputClass} required aria-label="City" />
                    <input name="state" placeholder="State" value={address.state} onChange={handleAddressChange} className={inputClass} required aria-label="State" />
                    <input name="zip" placeholder="ZIP Code" value={address.zip} onChange={handleAddressChange} className={inputClass} required aria-label="ZIP code" />
                  </div>
                </section>

                {/* Shipping Methods */}
                <section aria-label="Shipping method">
                  <h3 className={`${textColor} text-xl mb-4`} style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Shipping Method</h3>
                  <div className="space-y-2" role="radiogroup" aria-label="Select shipping method">
                    {shippingMethods.map(m => {
                      const Icon = SHIPPING_ICONS[m.id] || Truck;
                      const isFree = m.free_above && cart.total >= m.free_above;
                      return (
                        <button
                          key={m.id}
                          onClick={() => setSelectedShipping(m.id)}
                          className={`w-full flex items-center gap-4 p-4 border transition-all text-left ${
                            selectedShipping === m.id
                              ? isDark ? 'border-white/30 bg-white/[0.03]' : 'border-black/30 bg-black/[0.02]'
                              : isDark ? 'border-white/[0.06] hover:border-white/15' : 'border-black/[0.06] hover:border-black/15'
                          }`}
                          role="radio"
                          aria-checked={selectedShipping === m.id}
                        >
                          <Icon size={18} className={mutedText} />
                          <div className="flex-1">
                            <p className={`${textColor} text-sm`}>{m.name}</p>
                            <p className={`${mutedText} text-[10px] tracking-wider`}>{m.description}</p>
                          </div>
                          <span className={`${textColor} text-sm`}>
                            {isFree ? <span className="text-green-500 text-xs">FREE</span> : m.price === 0 ? 'Free' : `$${m.price.toFixed(2)}`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>

                <button
                  onClick={() => setStep(2)}
                  disabled={!address.street || !address.city}
                  className={`w-full border text-xs tracking-[0.3em] uppercase py-4 transition-colors flex items-center justify-center gap-2 ${isDark ? 'border-white/20 text-white hover:bg-white/5 disabled:opacity-30' : 'border-black/20 text-black hover:bg-black/5 disabled:opacity-30'}`}
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <section aria-label="Payment">
                  <h3 className={`${textColor} text-xl mb-4`} style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Payment</h3>
                  <div className={`p-6 border ${borderColor} ${cardBg}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <CreditCard size={20} className={mutedText} />
                      <span className={`${textColor} text-sm`}>
                        {razorpayConfigured ? 'Razorpay Secure Payment' : 'Demo Payment Mode'}
                      </span>
                      <ShieldCheck size={14} className="text-green-500/60 ml-auto" />
                    </div>
                    {!razorpayConfigured && (
                      <p className={`${mutedText} text-[10px] leading-relaxed mb-4 p-3 border ${borderColor}`}>
                        Razorpay is in demo mode. To enable real payments, add your Razorpay API keys in <code className="opacity-70">backend/.env</code> and restart the server.
                      </p>
                    )}
                    <p className={`${mutedText} text-xs`}>
                      {razorpayConfigured
                        ? 'You\'ll be redirected to Razorpay\'s secure checkout to complete payment via UPI, cards, net banking, or wallets.'
                        : 'Click below to simulate a successful payment for testing purposes.'}
                    </p>
                  </div>
                </section>

                <button
                  onClick={handlePlaceOrder}
                  disabled={processing}
                  className={`w-full border text-xs tracking-[0.3em] uppercase py-4 transition-colors flex items-center justify-center gap-2 ${isDark ? 'border-white/20 text-white hover:bg-white/5' : 'border-black/20 text-black hover:bg-black/5'} ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {processing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
                </button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <aside className="lg:col-span-1" aria-label="Order summary">
            <div className={`p-6 border ${borderColor} ${cardBg} sticky top-8`}>
              <h3 className={`${textColor} text-lg mb-4`} style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Order Summary</h3>
              <div className="space-y-3 mb-4">
                {cart.items.map(item => (
                  <div key={item.product_id} className="flex gap-3">
                    <div className="w-12 h-14 flex-shrink-0 overflow-hidden">
                      <img src={item.product?.image} alt={item.product?.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`${textColor} text-xs truncate`}>{item.product?.name}</p>
                      <p className={`${mutedText} text-[10px]`}>Qty: {item.quantity}</p>
                    </div>
                    <span className={`${textColor} text-xs`}>${(item.product?.sale_price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className={`border-t ${borderColor} pt-3 space-y-2`}>
                <div className="flex justify-between">
                  <span className={`${mutedText} text-xs`}>Subtotal</span>
                  <span className={`${textColor} text-xs`}>${cart.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className={`${mutedText} text-xs`}>Shipping</span>
                  <span className={`${textColor} text-xs`}>{shippingCost === 0 ? <span className="text-green-500">Free</span> : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className={`flex justify-between pt-2 border-t ${borderColor}`}>
                  <span className={`${textColor} text-sm font-medium`}>Total</span>
                  <span className={`${textColor} text-sm font-medium`}>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
