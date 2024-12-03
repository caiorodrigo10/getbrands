interface CustomerInformationProps {
  orderDetails: {
    first_name: string;
    last_name: string;
    shipping_address: string;
    shipping_city: string;
    shipping_state: string;
    shipping_zip: string;
  };
}

export const CustomerInformation = ({ orderDetails }: CustomerInformationProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <h4 className="font-medium mb-2">Customer Information</h4>
        <p className="text-sm text-muted-foreground">
          {orderDetails.first_name} {orderDetails.last_name}
        </p>
      </div>
      <div>
        <h4 className="font-medium mb-2">Shipping Address</h4>
        <div className="text-sm text-muted-foreground">
          <p>{orderDetails.shipping_address}</p>
          <p>
            {orderDetails.shipping_city}, {orderDetails.shipping_state}{" "}
            {orderDetails.shipping_zip}
          </p>
        </div>
      </div>
    </div>
  );
};