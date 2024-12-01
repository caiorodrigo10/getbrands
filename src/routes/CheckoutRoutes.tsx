import { Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import Checkout from "@/pages/checkout/Checkout";
import Success from "@/pages/checkout/Success";

export const CheckoutRoutes = [
  <Route
    key="checkout-confirmation"
    path="/checkout/confirmation"
    element={
      <ProtectedRoute>
        <Checkout />
      </ProtectedRoute>
    }
  />,
  <Route
    key="checkout-shipping"
    path="/checkout/shipping"
    element={
      <ProtectedRoute>
        <Checkout />
      </ProtectedRoute>
    }
  />,
  <Route
    key="checkout-payment"
    path="/checkout/payment"
    element={
      <ProtectedRoute>
        <Checkout />
      </ProtectedRoute>
    }
  />,
  <Route
    key="checkout-points"
    path="/checkout/points"
    element={
      <ProtectedRoute>
        <Checkout />
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
  />,
];