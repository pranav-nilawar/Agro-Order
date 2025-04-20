"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function AdminDashboard() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '' });

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    setRole(storedRole);

    if (storedRole !== 'admin') {
      setIsClient(true); 
    } else {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    const o = await axios.get(`${apiUrl}/orders`);
    const p = await axios.get(`${apiUrl}/products`);
    setOrders(o.data);
    setProducts(p.data);
  };

  const updateStatus = async (id: number, status: string) => {
    await axios.put(`${apiUrl}/orders/${id}`, { status });
    fetchData();
  };

  const addProduct = async () => {
    await axios.post(`${apiUrl}/products`, {
      name: newProduct.name,
      price: parseFloat(newProduct.price),
    });
    setNewProduct({ name: '', price: '' });
    fetchData();
  };

  const editProduct = async (id: number, field: string, value: any) => {
    const updated = products.find(p => p.id === id);
    updated[field] = value;
    await axios.put(`${apiUrl}/products/${id}`, updated);
    fetchData();
  };

  const deleteProduct = async (id: number) => {
    await axios.delete(`${apiUrl}/products/${id}`);
    fetchData();
  };

  if (role !== 'admin') return null;

  return (
    <div className="p-4 border mt-10 space-y-6">
      <h2 className="text-xl font-bold">Admin Dashboard</h2>

      <section>
        <h3 className="font-semibold mb-2">Orders</h3>
        {orders.map(order => (
          <div key={order.id} className="border p-2 mb-2">
            <p><strong>#{order.id}</strong> - {order.buyerName} - {order.status}</p>
            <button onClick={() => updateStatus(order.id, 'In Progress')} className="mr-2 bg-yellow-500 px-2 text-white rounded">
              In Progress
            </button>
            <button onClick={() => updateStatus(order.id, 'Delivered')} className="bg-green-600 px-2 text-white rounded">
              Delivered
            </button>
          </div>
        ))}
      </section>

      <section>
        <h3 className="font-semibold mb-2">Product Management</h3>
        <div className="flex gap-2 mb-2">
          <input
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            placeholder="Product Name"
            className="border p-1"
          />
          <input
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            placeholder="Price"
            className="border p-1"
            type="number"
          />
          <button onClick={addProduct} className="bg-blue-600 text-white px-2 rounded">
            Add
          </button>
        </div>
        {products.map(prod => (
          <div key={prod.id} className="flex items-center gap-2 mb-1">
            <input
              value={prod.name}
              onChange={(e) => editProduct(prod.id, 'name', e.target.value)}
              className="border p-1"
            />
            <input
              value={prod.price}
              type="number"
              onChange={(e) => editProduct(prod.id, 'price', parseFloat(e.target.value))}
              className="border p-1 w-24"
            />
            <button onClick={() => deleteProduct(prod.id)} className="bg-red-600 text-white px-2 rounded">
              Delete
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}
