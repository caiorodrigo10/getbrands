import { Route } from "react-router-dom";
import Checkout from "@/pages/checkout/Checkout";
import Success from "@/pages/checkout/Success";
import { ProtectedRoute } from "./ProtectedRoute";

export const CheckoutRoutes = [
  <Route
    path="/checkout/*"
    element={
      <ProtectedRoute>
        <Checkout />
      </ProtectedRoute>
    }
    key="checkout"
  >
    <Route path="shipping" element={<Checkout />} />
    <Route path="payment" element={<Checkout />} />
    <Route path="confirmation" element={<Checkout />} />
    <Route path="points" element={<Checkout />} />
  </Route>,
  <Route
    path="/checkout/success"
    element={
      <ProtectedRoute>
        <Success />
      </ProtectedRoute>
    }
    key="checkout-success"
  />,
];