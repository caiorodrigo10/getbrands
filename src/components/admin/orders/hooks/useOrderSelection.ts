import { useState } from "react";

export const useOrderSelection = (totalOrders: number) => {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectAllPages, setSelectAllPages] = useState(false);
  const [excludedOrders, setExcludedOrders] = useState<string[]>([]);

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (selectAllPages) {
      if (!checked) {
        setExcludedOrders([...excludedOrders, orderId]);
      } else {
        setExcludedOrders(excludedOrders.filter(id => id !== orderId));
      }
    } else {
      if (checked) {
        setSelectedOrders([...selectedOrders, orderId]);
      } else {
        setSelectedOrders(selectedOrders.filter(id => id !== orderId));
      }
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(orders => orders);
    } else {
      setSelectedOrders([]);
      setSelectAllPages(false);
      setExcludedOrders([]);
    }
  };

  const handleSelectAllPages = (checked: boolean) => {
    setSelectAllPages(checked);
    if (checked) {
      setExcludedOrders([]);
    } else {
      setSelectedOrders([]);
      setExcludedOrders([]);
    }
  };

  const getSelectedCount = (ordersInCurrentPage: any[]) => {
    if (selectAllPages) {
      return totalOrders - excludedOrders.length;
    }
    return selectedOrders.length;
  };

  const isOrderSelected = (orderId: string) => {
    if (selectAllPages) {
      return !excludedOrders.includes(orderId);
    }
    return selectedOrders.includes(orderId);
  };

  return {
    selectedOrders,
    selectAllPages,
    excludedOrders,
    handleSelectOrder,
    handleSelectAll,
    handleSelectAllPages,
    getSelectedCount,
    isOrderSelected,
  };
};