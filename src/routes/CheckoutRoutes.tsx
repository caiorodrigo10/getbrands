import { Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import Checkout from "@/pages/checkout/Checkout";
import Success from "@/pages/checkout/Success";

export const CheckoutRoutes = [
  <Route
    key="checkout"
    path="/checkout/*"
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
  />
];