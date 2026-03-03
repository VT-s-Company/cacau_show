"use client";

import { useState } from "react";
import Image from "next/image";
import type { Product } from "./storeTypes";
import { ChevronLeft } from "lucide-react";
import {
  getProductReviews,
  getAverageRating,
  getReviewCount,
} from "./reviewsData";
import StarRating from "./StarRating";
import TabletesSelect from "./TabletesSelect";

interface ProductDetailsProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (selectedTablets: boolean[]) => void;
}

export default function ProductDetails({
  product,
  onBack,
  onAddToCart,
}: Readonly<ProductDetailsProps>) {
  const [selectedTablets, setSelectedTablets] = useState<boolean[]>([
    false,
    false,
    false,
  ]);

  const reviews = getProductReviews(product.id);
  const averageRating = getAverageRating(product.id);
  const reviewCount = getReviewCount(product.id);

  const tabletsCount = selectedTablets.filter(Boolean).length;
  const tabletsPrice = tabletsCount * 10;
  const totalPrice = product.discountPrice + tabletsPrice;

  const handleTabletChange = (index: number) => {
    const newSelectedTablets = [...selectedTablets];
    newSelectedTablets[index] = !newSelectedTablets[index];
    setSelectedTablets(newSelectedTablets);
  };

  const getAvatarColor = (initial: string) => {
    const colors = [
      "rgb(90, 56, 37)",
      "rgb(212, 160, 74)",
      "rgb(138, 114, 98)",
      "rgb(229, 57, 53)",
      "rgb(45, 155, 58)",
    ];
    const index = (initial.codePointAt(0) || 0) % colors.length;
    return colors[index];
  };

  return (
    <div className="w-full max-w-6xl px-4 pb-10">
      <nav className="mb-6 text-sm text-muted-foreground mt-4 cursor-default">
        <button
          type="button"
          onClick={onBack}
          className="text-primary font-medium transition-colors cursor-pointer"
        >
          <ChevronLeft className="inline-block mr-1" size={16} />
          Home
        </button>
        <span className="mx-2 cursor-default">/</span>
        <button
          type="button"
          onClick={onBack}
          className="hover:text-foreground transition-colors cursor-pointer"
        >
          PASCOA
        </button>
        <span className="mx-2 cursor-default">/</span>{" "}
        <span className="hover:text-foreground transition-colors cursor-default uppercase">
          {product.name}
        </span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="bg-card border-2 border-border rounded-2xl p-6">
          <Image
            src={`/assets${product.image}`}
            alt={product.name}
            width={520}
            height={520}
            className="w-full h-auto max-h-115 object-contain"
            priority
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            {product.name}
          </h2>
          <p className="text-muted-foreground">{product.description}</p>

          <div className="inline-flex rounded-full bg-accent/15 px-3 py-1 text-accent text-sm font-semibold">
            {product.weight}
          </div>

          <div className="">
            <TabletesSelect
              selectedTablets={selectedTablets}
              onTabletChange={handleTabletChange}
            />
          </div>

          <div className="rounded-2xl border-2 border-dashed border-accent p-5">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm text-muted-foreground line-through">
                R$ {product.originalPrice.toFixed(2)}
              </span>
              <span className="text-xs bg-red-500 text-white font-bold px-2 py-0.5 rounded">
                -90%
              </span>
            </div>
            <p className="text-4xl font-black text-accent">
              R$ {totalPrice.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {tabletsCount > 0 && (
                <span>
                  +R$ {tabletsPrice.toFixed(2)} ({tabletsCount}{" "}
                  {tabletsCount === 1 ? "tablete" : "tabletes"}) |{" "}
                </span>
              )}
              Cupom PASCOA90 aplicado
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={onBack}
              className="w-full sm:w-auto px-5 py-3 rounded-xl border-2 border-border text-foreground font-semibold hover:bg-muted transition-colors"
            >
              Voltar para a loja
            </button>
            <button
              type="button"
              onClick={() => onAddToCart(selectedTablets)}
              className="w-full sm:flex-1 px-5 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors"
            >
              Adicionar ao carrinho
            </button>
          </div>
        </div>

        <div className="mt-10 md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl sm:text-2xl font-serif italic text-foreground">
              Avaliações
            </h2>
            <div className="flex items-center gap-1.5">
              <StarRating rating={averageRating} size={16} />
              <span className="text-sm font-semibold text-foreground">
                {averageRating.toFixed(1)} de 5
              </span>
              <span className="text-xs text-muted-foreground">
                ({reviewCount} {reviewCount === 1 ? "avaliação" : "avaliações"})
              </span>
            </div>
          </div>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-card border border-border rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                      style={{ backgroundColor: getAvatarColor(review.avatar) }}
                    >
                      {review.avatar}
                    </div>
                    <span className="font-semibold text-sm text-foreground">
                      {review.author}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {review.date}
                  </span>
                </div>
                <div className="mb-2">
                  <StarRating rating={review.rating} />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
