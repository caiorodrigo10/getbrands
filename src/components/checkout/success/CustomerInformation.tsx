interface CustomerInformationProps {
  orderDetails: {
    customer: {
      firstName: string;
      lastName: string;
    };
    shippingAddress: {
      address: string;
      city: string;
      state: string;
      zip: string;
    };
  };
}

export const CustomerInformation = ({ orderDetails }: CustomerInformationProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <h4 className="font-medium mb-2">Customer Information</h4>
        <p className="text-sm text-muted-foreground">
          {orderDetails.customer.firstName} {orderDetails.customer.lastName}
        </p>
      </div>
      <div>
        <h4 className="font-medium mb-2">Shipping Address</h4>
        <div className="text-sm text-muted-foreground">
          <p>{orderDetails.shippingAddress.address}</p>
          <p>
            {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state}{" "}
            {orderDetails.shippingAddress.zip}
          </p>
        </div>
      </div>
    </div>
  );
};