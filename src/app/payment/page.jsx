"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useApp } from "@/context/AppContext";
import toast from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Sparkles,
  Zap,
} from "lucide-react";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#0f172a",
      fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
      fontSmoothing: "antialiased",
      fontSize: "15px",
      "::placeholder": {
        color: "#94a3b8",
      },
      iconColor: "#f97316",
    },
    invalid: {
      color: "#f43f5e",
      iconColor: "#f43f5e",
    },
  },
  hidePostalCode: true,
};

// Official Stripe Elements Card Form (Runs against live Stripe API)
function RealStripeCardForm({
  classData,
  clientSecret,
  user,
  apiFetch,
  onSuccess,
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [cardName, setCardName] = useState(user?.name || "");
  const [processing, setProcessing] = useState(false);
  const [cardError, setCardError] = useState(null);
  const [cardComplete, setCardComplete] = useState(false);

  const handlePay = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    setProcessing(true);
    setCardError(null);
    const toastId = toast.loading("Authorizing payment with Stripe...");

    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: cardName,
            email: user?.email,
          },
        },
      });

      if (result.error) {
        toast.dismiss(toastId);
        setCardError(result.error.message);
        toast.error(result.error.message || "Payment declined");
        setProcessing(false);
        return;
      }

      if (
        result.paymentIntent &&
        result.paymentIntent.status === "succeeded"
      ) {
        // Record booking in backend
        const bookingRes = await apiFetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            classId: classData._id,
            transactionId: result.paymentIntent.id,
          }),
        });

        const bookingData = await bookingRes.json();
        if (!bookingRes.ok) {
          toast.dismiss(toastId);
          toast.error(bookingData.message || "Booking registration failed");
          setProcessing(false);
          return;
        }

        toast.dismiss(toastId);
        toast.success("Payment confirmed! Class booked successfully.");
        onSuccess();
      }
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err.message || "Payment error");
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handlePay} className="space-y-5">
      {/* Test Card Quick Info Badge */}
      <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <strong>Stripe Live Gateway Active</strong>
        </div>
        <div className="text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-2">
          <span>Test Card: <code className="bg-slate-200 dark:bg-black/40 px-1.5 py-0.5 rounded text-orange-600 dark:text-orange-400 font-mono">4242 4242 4242 4242</code></span>
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
          Cardholder Full Name
        </label>
        <input
          type="text"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          placeholder="e.g. Alex Morgan"
          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.05] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-orange-500 text-sm shadow-sm"
          required
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
          Card Information (Stripe Secure Elements)
        </label>
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.05] border border-slate-300 dark:border-white/10 focus-within:border-orange-500 transition-colors shadow-sm">
          <CardElement
            options={CARD_ELEMENT_OPTIONS}
            onChange={(e) => {
              setCardComplete(e.complete);
              if (e.error) setCardError(e.error.message);
              else setCardError(null);
            }}
          />
        </div>
        {cardError && (
          <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1">
            <span>⚠</span> {cardError}
          </p>
        )}
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={!stripe || processing || !cardComplete}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white font-extrabold text-sm shadow-xl shadow-orange-500/25 hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {processing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Authorizing Payment...
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              Pay ${classData?.price} & Confirm Booking
            </>
          )}
        </button>
      </div>
    </form>
  );
}

// Interactive Stripe Sandbox Form (Fallback when keys are loading or mock)
function SandboxStripeForm({
  classData,
  user,
  apiFetch,
  onSuccess,
}) {
  const [cardName, setCardName] = useState(user?.name || "");
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("888");
  const [processing, setProcessing] = useState(false);

  const fillTestCard = () => {
    setCardNumber("4242 4242 4242 4242");
    setCardExpiry("12/28");
    setCardCvc("888");
    toast.success("Standard Stripe test card auto-filled!");
  };

  const handlePay = async (e) => {
    e.preventDefault();
    setProcessing(true);
    const toastId = toast.loading("Processing secure payment transaction...");

    try {
      await new Promise((r) => setTimeout(r, 1000));
      const transactionId = `tx_stripe_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

      const bookingRes = await apiFetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classId: classData._id,
          transactionId,
        }),
      });

      const bookingData = await bookingRes.json();
      if (!bookingRes.ok) {
        toast.dismiss(toastId);
        toast.error(bookingData.message || "Booking failed");
        setProcessing(false);
        return;
      }

      toast.dismiss(toastId);
      toast.success("Payment completed! Class successfully booked.");
      onSuccess();
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Payment network error");
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handlePay} className="space-y-4">
      <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-orange-500 shrink-0" />
          <span className="text-xs text-orange-600 dark:text-orange-400">
            <strong>Stripe Test Mode</strong>
          </span>
        </div>
        <button
          type="button"
          onClick={fillTestCard}
          className="text-xs font-bold text-orange-500 hover:text-orange-600 dark:hover:text-orange-300 underline"
        >
          Fill Test Card
        </button>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
          Cardholder Full Name
        </label>
        <input
          type="text"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          placeholder="e.g. Alex Morgan"
          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.05] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-orange-500 text-sm shadow-sm"
          required
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
          Card Number
        </label>
        <div className="relative">
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            placeholder="4242 4242 4242 4242"
            maxLength={19}
            className="w-full px-4 py-2.5 pl-10 rounded-xl bg-slate-50 dark:bg-white/[0.05] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-orange-500 text-sm font-mono shadow-sm"
            required
          />
          <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
            Expiration Date
          </label>
          <input
            type="text"
            value={cardExpiry}
            onChange={(e) => setCardExpiry(e.target.value)}
            placeholder="MM/YY"
            maxLength={5}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.05] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-orange-500 text-sm font-mono text-center shadow-sm"
            required
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
            CVC / CVV
          </label>
          <div className="relative">
            <input
              type="text"
              value={cardCvc}
              onChange={(e) => setCardCvc(e.target.value)}
              placeholder="CVC"
              maxLength={4}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.05] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-orange-500 text-sm font-mono text-center shadow-sm"
              required
            />
            <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={processing}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white font-extrabold text-sm shadow-xl shadow-orange-500/25 hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {processing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Authorizing Payment...
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              Pay ${classData?.price} & Confirm Booking
            </>
          )}
        </button>
      </div>
    </form>
  );
}

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const classId = searchParams.get("classId");
  const { user, loading: authLoading, BACKEND_URL, apiFetch } = useApp();

  const [classData, setClassData] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [isRealStripe, setIsRealStripe] = useState(false);
  const [stripePromise, setStripePromise] = useState(null);
  const [alreadyBooked, setAlreadyBooked] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize Stripe Promise dynamically from .env or backend config
  useEffect(() => {
    let pubKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
    if (pubKey && pubKey.startsWith("pk_") && !pubKey.includes("Mock")) {
      setStripePromise(loadStripe(pubKey));
    } else {
      fetch(`${BACKEND_URL}/api/stripe/config`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (
            data?.publishableKey &&
            data.publishableKey.startsWith("pk_") &&
            !data.publishableKey.includes("Mock")
          ) {
            setStripePromise(loadStripe(data.publishableKey));
          }
        })
        .catch(() => {});
    }
  }, [BACKEND_URL]);

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please login to proceed with checkout");
      router.push(`/login?redirect=/payment?classId=${classId}`);
      return;
    }

    if (!classId) {
      toast.error("No class selected for payment");
      router.push("/classes");
      return;
    }

    // 1. Fetch class details
    fetch(`${BACKEND_URL}/api/classes/${classId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Class not found");
        return res.json();
      })
      .then((data) => {
        setClassData(data);
        return data;
      })
      .then(async (cls) => {
        // 2. Initialize Payment Intent
        if (user) {
          try {
            const intentRes = await apiFetch("/api/create-payment-intent", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ classId: cls._id }),
            });
            const intentData = await intentRes.json();
            if (intentRes.ok) {
              setClientSecret(intentData.clientSecret);
              setIsRealStripe(Boolean(intentData.isRealStripe));
            } else {
              if (intentData.message?.toLowerCase().includes("already booked")) {
                setAlreadyBooked(true);
              }
            }
          } catch (e) {
            console.warn("Payment intent initialization:", e);
          }
        }
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load class information");
        router.push("/classes");
      });
  }, [authLoading, user, classId, BACKEND_URL, apiFetch, router]);

  if (loading || authLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const useLiveElements = Boolean(stripePromise && isRealStripe && clientSecret);

  return (
    <main className="flex-1 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href={`/classes/${classId}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-orange-500 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Cancel & Return to Class Details
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Order Summary */}
          <div className="md:col-span-5 p-6 rounded-3xl bg-white dark:bg-[#0f1422] border border-slate-200/80 dark:border-white/[0.08] shadow-sm dark:shadow-xl space-y-6">
            <div>
              <span className="text-[10px] uppercase font-bold text-orange-600 dark:text-orange-400 tracking-wider">
                Order Summary
              </span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                {classData?.name}
              </h2>
            </div>

            <div className="relative h-44 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/5">
              <img
                src={classData?.image}
                alt={classData?.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/90 dark:bg-[#090d16]/80 text-orange-600 dark:text-orange-400 border border-slate-200 dark:border-white/10 shadow-sm">
                {classData?.category}
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-white/5">
                <span className="text-slate-500 dark:text-slate-400">Master Trainer</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {classData?.trainerName}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-white/5">
                <span className="text-slate-500 dark:text-slate-400">Duration</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {classData?.duration}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-white/5">
                <span className="text-slate-500 dark:text-slate-400">Schedule</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {classData?.schedule}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-white/10 flex items-baseline justify-between">
              <span className="text-sm font-semibold text-slate-900 dark:text-white">Total Due</span>
              <span className="text-3xl font-black text-orange-600 dark:text-orange-400">
                ${classData?.price}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-xs text-orange-600 dark:text-orange-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0 text-orange-500" />
              <span>Full locker amenities & sports recovery included.</span>
            </div>
          </div>

          {/* Right Column: Stripe Checkout Card Form */}
          <div className="md:col-span-7 p-8 rounded-3xl bg-white dark:bg-[#0f1422] border border-slate-200/80 dark:border-white/[0.08] shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-orange-500" />
                  Stripe Payment
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Secure 256-bit SSL encrypted checkout
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-orange-600 dark:text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20 font-semibold">
                <ShieldCheck className="w-4 h-4" /> PCI-DSS Compliant
              </div>
            </div>

            {/* Already Booked Status vs Real Stripe Elements Form vs Sandbox Form */}
            {alreadyBooked ? (
              <div className="p-8 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-orange-500/20 text-orange-500 flex items-center justify-center mx-auto shadow-lg shadow-orange-500/10">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-900 dark:text-white">Class Already Booked!</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 max-w-sm mx-auto">
                    You have already successfully paid and enrolled in this session. Your spot is secured.
                  </p>
                </div>
                <div className="pt-3 flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/dashboard/booked-classes"
                    className="py-3 px-6 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 text-white font-extrabold text-xs shadow-lg shadow-orange-500/25 hover:scale-105 active:scale-95 transition-all"
                  >
                    View in Booked Classes
                  </Link>
                  <Link
                    href="/classes"
                    className="py-3 px-6 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white font-bold text-xs hover:bg-slate-200 dark:hover:bg-white/[0.1] transition-all"
                  >
                    Browse Other Classes
                  </Link>
                </div>
              </div>
            ) : useLiveElements ? (
              <Elements
                stripe={stripePromise}
                options={{ clientSecret }}
              >
                <RealStripeCardForm
                  classData={classData}
                  clientSecret={clientSecret}
                  user={user}
                  apiFetch={apiFetch}
                  onSuccess={() => router.push("/dashboard/booked-classes")}
                />
              </Elements>
            ) : (
              <SandboxStripeForm
                classData={classData}
                user={user}
                apiFetch={apiFetch}
                onSuccess={() => router.push("/dashboard/booked-classes")}
              />
            )}

            <div className="pt-2 border-t border-slate-100 dark:border-white/5 space-y-2">
              <p className="text-[11px] text-center text-slate-500 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-500" />
                Payments are securely processed via Stripe. Instant digital receipt generated.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function PaymentPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#07090e] text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center py-24">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <PaymentContent />
      </Suspense>
      <Footer />
    </div>
  );
}
