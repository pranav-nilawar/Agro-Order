"use client";

import { useState } from 'react';
import axios from 'axios';

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<any>(null);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/orders/${orderId}`);
      setOrder(res.data);
    } catch {
      alert('Order not found');
      setOrder(null);
    }
  };

  return (
    <div className="p-4 border mt-10">
      <h2 className="text-xl font-bold mb-2">Track Your Order</h2>
      <input
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
        placeholder="Enter Order ID"
        className="border p-2 mr-2"
      />
      <button onClick={fetchOrder} className="bg-indigo-600 text-white px-4 py-1 rounded">
        Track
      </button>

      {order && (
        <div className="mt-4 border-t pt-4">
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Name:</strong> {order.buyerName}</p>
          <p><strong>Contact:</strong> {order.buyerContact}</p>
          <p><strong>Address:</strong> {order.deliveryAddress}</p>
          <h4 className="mt-2 font-semibold">Items:</h4>
          <ul className="list-disc pl-6">
            {order.items.map((item: any, idx: number) => (
              <li key={idx}>
                Product ID: {item.productId}, Quantity: {item.quantity}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
