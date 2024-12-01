import { Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import CartReview from "@/pages/checkout/CartReview";
import Shipping from "@/pages/checkout/Shipping";
import Payment from "@/pages/checkout/Payment";
import Success from "@/pages/checkout/Success";

export const CheckoutRoutes = [
  <Route
    key="checkout"
    path="/checkout"
    element={
      <ProtectedRoute>
        <CartReview />
      </ProtectedRoute>
    }
  />,
  <Route
    key="checkout-shipping"
    path="/checkout/shipping"
    element={
      <ProtectedRoute>
        <Shipping />
      </ProtectedRoute>
    }
  />,
  <Route
    key="checkout-payment"
    path="/checkout/payment"
    element={
      <ProtectedRoute>
        <Payment />
      </ProtectedRoute>
    }
  />,
  <Route
    key="checkout-success"
    path="/checkout/success"
    element={
      <ProtectedRoute>
        <Success />
      </ProtectedRoute>
    }
  />
];