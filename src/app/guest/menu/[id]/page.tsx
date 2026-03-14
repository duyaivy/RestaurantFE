"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useGetDishQuery } from "@/queries/useDish";
import { ShoppingCart, Check } from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();

  const dishId = Number(params.id);

  const { data, isLoading } = useGetDishQuery({
    id: dishId,
    enabled: !!dishId,
  });

  const product = data?.payload.data;

  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [isAdded, setIsAdded] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Không tìm thấy sản phẩm
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        note: note || undefined,
      });
    }

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        note: note || undefined,
      });
    }

    router.push("/store/cart");
  };

  return (
    <div className="min-h-screen bg-background pb-44">
      {/* Product Header */}
      <div className="p-4 max-w-screen-sm mx-auto">
        <div className="flex gap-4 items-start">
          <div className="w-32 h-32 bg-secondary rounded-xl overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1">
            <h1 className="text-lg font-bold mb-2">{product.name}</h1>

            <p className="text-xl font-bold text-primary">
              {product.price.toLocaleString()} VND
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="p-4 max-w-screen-sm mx-auto space-y-4">
        <div className="bg-card rounded-xl p-4 border">
          <h3 className="font-semibold mb-2">Mô tả</h3>
          <p>{product.description}</p>
        </div>

        <div className="bg-card rounded-xl p-4 border">
          <label className="font-semibold mb-2 block">Ghi chú</label>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        {/* Quantity */}
        <div className="bg-card rounded-xl p-4 border flex justify-between items-center">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 bg-secondary rounded-full"
          >
            -
          </button>

          <span className="text-xl font-bold">{quantity}</span>

          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 bg-primary text-white rounded-full"
          >
            +
          </button>
        </div>
      </div>

      {/* Bottom */}
      <div className="fixed bottom-16 left-0 right-0 bg-card border-t p-4">
        <div className="max-w-screen-sm mx-auto flex gap-3">
          <Button
            onClick={handleAddToCart}
            variant="outline"
            className="flex-1"
          >
            {isAdded ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                Đã thêm
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5 mr-2" />
                Thêm giỏ
              </>
            )}
          </Button>

          <Button onClick={handleBuyNow} className="flex-1">
            Mua ngay
          </Button>
        </div>
      </div>
    </div>
  );
}
