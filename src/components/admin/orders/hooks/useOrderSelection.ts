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

  const handleSelectAll = (checked: boolean, currentPageOrders: any[]) => {
    if (checked) {
      if (selectAllPages) {
        setExcludedOrders([]);
      } else {
        const currentPageOrderIds = currentPageOrders.map(order => order.id);
        setSelectedOrders(currentPageOrderIds);
      }
    } else {
      if (selectAllPages) {
        const currentPageOrderIds = currentPageOrders.map(order => order.id);
        setExcludedOrders([...excludedOrders, ...currentPageOrderIds]);
      } else {
        setSelectedOrders([]);
      }
    }
  };

  const handleSelectAllPages = (checked: boolean) => {
    setSelectAllPages(checked);
    if (checked) {
      setSelectedOrders([]);
      setExcludedOrders([]);
    } else {
      setSelectedOrders([]);
      setExcludedOrders([]);
    }
  };

  const getSelectedCount = () => {
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
    selectAllPages,
    handleSelectOrder,
    handleSelectAll,
    handleSelectAllPages,
    getSelectedCount,
    isOrderSelected,
    selectedOrders,
    excludedOrders
  };
};