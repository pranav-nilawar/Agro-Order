"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import RequireAuth from '../components/RequireAuth';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

// Validation schema using Zod
const schema = z.object({
  buyerName: z.string().min(1, "Name is required"),
  buyerContact: z.string().min(1, "Contact is required"),
  deliveryAddress: z.string().min(1, "Delivery address is required"),
  items: z
    .array(
      z.object({
        productId: z.number().min(1, "Product is required"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
      })
    )
    .refine((arr) => arr.length > 0, {
      message: "At least one item is required",
    }),
});

export default function Order() {
  type Product = {
    id: number;
    name: string;
    price: number;
  };

  const [products, setProducts] = useState<Product[]>([]);
  const [orderId, setOrderId] = useState<number | null>(null); // State to store the order ID

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      buyerName: "",
      buyerContact: "",
      deliveryAddress: "",
      items: [{ productId: 0, quantity: 1 }], // Default value for items array
    },
  });

  const { fields, append } = useFieldArray({ control, name: "items" });

  useEffect(() => {
    axios.get(`${apiUrl}/products`).then((res) => setProducts(res.data));
  }, []);

  const onSubmit = async (data: any) => {
    console.log("onSubmit triggered", data);
    try {
      const orderData = {
        ...data,
        items: data.items.map((item: any) => ({
          ...item,
          product: products.find((p: any) => p.id === item.productId),
        })),
      };

      const response = await axios.post(`${apiUrl}/orders`, orderData);
      setOrderId(response.data.id); // Set the order ID from the response
      alert("Order placed successfully!");
      reset(); // Clear the form after successful submission
    } catch (error) {
      console.error("Order failed:", error);
      alert("Failed to place order. Check the console for details.");
    }
  };

  const onError = (errors: any) => {
    console.log("Validation errors", errors);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit, onError)} className="p-4 border rounded space-y-4">
        <h2 className="text-xl font-bold">Place Order</h2>

        {/* Name Field */}
        <input
          {...register("buyerName")}
          placeholder="Name"
          className="border p-2 w-full"
        />
        {errors.buyerName && <p className="text-red-500 text-sm">{errors.buyerName.message}</p>}

        {/* Contact Field */}
        <input
          {...register("buyerContact")}
          placeholder="Contact"
          className="border p-2 w-full"
        />
        {errors.buyerContact && <p className="text-red-500 text-sm">{errors.buyerContact.message}</p>}

        {/* Delivery Address Field */}
        <textarea
          {...register("deliveryAddress")}
          placeholder="Address"
          className="border p-2 w-full"
        />
        {errors.deliveryAddress && <p className="text-red-500 text-sm">{errors.deliveryAddress.message}</p>}

        {/* Products Section */}
        <h3 className="font-semibold">Products</h3>
        <button
          type="button"
          onClick={() => append({ productId: products[0]?.id || 0, quantity: 1 })}
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          + Add Item
        </button>

        {fields.map((field, index) => (
          <div key={field.id} className="flex space-x-2 mt-2">
            {/* Product Selection */}
            <select
              {...register(`items.${index}.productId`, { valueAsNumber: true })} // Convert to number
              className="border p-2"
            >
              {products.map((p: any) => (
                <option value={p.id} key={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            {errors.items?.[index]?.productId && (
              <p className="text-red-500 text-sm">
                {errors.items[index]?.productId?.message}
              </p>
            )}

            {/* Quantity Input */}
            <input
              type="number"
              {...register(`items.${index}.quantity`, { valueAsNumber: true })}
              className="border p-2 w-20"
            />
            {errors.items?.[index]?.quantity && (
              <p className="text-red-500 text-sm">
                {errors.items[index]?.quantity?.message}
              </p>
            )}
          </div>
        ))}

        {/* Submit Button */}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Submit Order
        </button>
      </form>

      {/* Display Order ID after successful submission */}
      {orderId && (
        <div className="mt-4 p-4 bg-green-200 text-green-800 rounded">
          <h3 className="font-semibold">Order Successfully Placed!</h3>
          <p>Your Order ID is: <strong>{orderId}</strong></p>
        </div>
      )}
    </div>
  );
}
