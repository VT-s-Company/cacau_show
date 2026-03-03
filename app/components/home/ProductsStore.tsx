"use client";

import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import ProductDetails from "./ProductDetails";
import PixCheckout from "./PixCheckout";
import type { Product } from "./storeTypes";

export const products: Product[] = [
  {
    id: 1,
    name: "Ovo de Pascoa de Colher Duo Do Chef",
    image: "/images/products/ovo-colher-chef.png",
    originalPrice: 239.9,
    discountPrice: 26.47,
    weight: "300g",
    description: "Ovo de colher Duo do Chef com chocolate ao leite cremoso.",
  },
  {
    id: 2,
    name: "Ovo de Pascoa Estojo Scooby-Doo",
    image: "/images/products/ovo-scooby-doo.webp",
    originalPrice: 119.99,
    discountPrice: 28.73,
    weight: "170g",
    description: "Ovo ao leite com embalagem temática Scooby-Doo.",
  },
  {
    id: 3,
    name: "Ovo ao Leite Pelucia Zangadinho Ursinhos Carinhosos",
    image: "/images/products/ovo-ursinhos-carinhosos.webp",
    originalPrice: 159.9,
    discountPrice: 25.12,
    weight: "170g",
    description: "Ovo ao leite com pelúcia Zangadinho e LED.",
  },
  {
    id: 4,
    name: "Ovo ao Leite Chocomonstros Ludovico",
    image: "/images/products/ovo-chocomonstros.webp",
    originalPrice: 139.9,
    discountPrice: 25.67,
    weight: "170g",
    description: "Ovo ao leite Chocomonstros com bolha de sabão.",
  },
  {
    id: 5,
    name: "Ovo Brasil Copa do Mundo CBF",
    image: "/images/products/ovo-copa.jpg",
    originalPrice: 249.9,
    discountPrice: 26.37,
    weight: "170g",
    description: "Edição especial Copa do Mundo CBF com bola temática.",
  },
  {
    id: 6,
    name: "Ovo ao Leite Pelucia Snoopy",
    image: "/images/products/ovo-snoopy.jpg",
    originalPrice: 169.9,
    discountPrice: 25.39,
    weight: "170g",
    description: "Ovo ao leite com pelúcia oficial Snoopy.",
  },
  {
    id: 7,
    name: "Ovo ao Leite Meninas Superpoderosas Florzinha",
    image: "/images/products/ovo-ppg-1.jpg",
    originalPrice: 149.9,
    discountPrice: 26.82,
    weight: "150g",
    description: "Ovo ao leite com temática Florzinha.",
  },
  {
    id: 8,
    name: "Ovo ao Leite Meninas Superpoderosas Lindinha",
    image: "/images/products/ovo-ppg-2.jpg",
    originalPrice: 159.9,
    discountPrice: 25.41,
    weight: "150g",
    description: "Ovo ao leite com temática Lindinha.",
  },
  {
    id: 9,
    name: "Ovo ao Leite Meninas Superpoderosas Docinho",
    image: "/images/products/ovo-ppg-3.jpg",
    originalPrice: 139.9,
    discountPrice: 26.15,
    weight: "150g",
    description: "Ovo ao leite com temática Docinho.",
  },
  {
    id: 10,
    name: "Ovo Classicos ao Leite com Bombons Sortidos",
    image: "/images/products/ovo-classico.jpg",
    originalPrice: 179.9,
    discountPrice: 25.03,
    weight: "250g",
    description: "Ovo clássico ao leite com bombons sortidos.",
  },
  {
    id: 11,
    name: "Ovo Dreams Merengue de Morango",
    image: "/images/products/ovo-dreams.jpg",
    originalPrice: 199.9,
    discountPrice: 26.58,
    weight: "200g",
    description: "Ovo Dreams com merengue de morango.",
  },
  {
    id: 12,
    name: "Ovo laCreme ao Leite Zero Adicao de Acucares",
    image: "/images/products/ovo-lacreme.jpg",
    originalPrice: 169.9,
    discountPrice: 25.21,
    weight: "160g",
    description: "Ovo laCreme ao leite zero adição de açúcares.",
  },
  {
    id: 13,
    name: "Ovo Classicos laCreme ao Leite com Bombons",
    image: "/images/products/ovo-lacreme-classico.jpg",
    originalPrice: 200.9,
    discountPrice: 25.53,
    weight: "220g",
    description: "Ovo laCreme ao leite com bombons clássicos.",
  },
];

const banners = [
  "/assets/images/banners/p1.jpg",
  "/assets/images/banners/p2.jpg",
  "/assets/images/banners/p3.jpg",
];

type ViewMode = "list" | "detail" | "checkout";

export default function ProductsStore() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedTablets, setSelectedTablets] = useState<boolean[]>([
    false,
    false,
    false,
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm]);

  const openDetails = (product: Product) => {
    setSelectedProduct(product);
    setViewMode("detail");
  };

  const openCheckout = (tablets: boolean[]) => {
    setSelectedTablets(tablets);
    setViewMode("checkout");
  };

  if (viewMode === "detail" && selectedProduct) {
    return (
      <ProductDetails
        product={selectedProduct}
        onBack={() => setViewMode("list")}
        onAddToCart={(tablets) => openCheckout(tablets)}
      />
    );
  }

  if (viewMode === "checkout" && selectedProduct) {
    return (
      <PixCheckout
        product={selectedProduct}
        onBack={() => setViewMode("detail")}
        initialSelectedTablets={selectedTablets}
      />
    );
  }

  return (
    <div className="flex flex-col items-center pb-8 px-4 w-full">
      <div className="text-center mb-8 mt-4">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          🐰 Loja de Páscoa
        </h1>
        <p className="text-muted-foreground">
          Aproveite seu cupom{" "}
          <span className="font-bold text-accent">PASCOA90</span> com 90% de
          desconto!
        </p>
        <div className="mt-4 inline-block bg-accent/10 border-2 border-accent rounded-full px-6 py-2">
          <p className="text-sm font-bold text-accent">
            ✨ Desconto aplicado automaticamente
          </p>
        </div>
      </div>

      <div className="w-full max-w-6xl mb-8 relative group">
        <div className="relative overflow-hidden rounded-2xl aspect-21/9 md:aspect-21/9 bg-card border-2 border-border">
          {banners.map((banner, index) => (
            <div
              key={banner}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentBannerIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={banner}
                alt={`Banner ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              setCurrentBannerIndex(
                (prev) => (prev - 1 + banners.length) % banners.length,
              )
            }
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 md:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
            aria-label="Banner anterior"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            type="button"
            onClick={() =>
              setCurrentBannerIndex((prev) => (prev + 1) % banners.length)
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 md:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
            aria-label="Próximo banner"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((banner, index) => (
              <button
                key={banner}
                type="button"
                onClick={() => setCurrentBannerIndex(index)}
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                  index === currentBannerIndex
                    ? "bg-white w-6 md:w-8"
                    : "bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Ir para banner ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="w-full max-w-6xl mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar produtos... (ex: ovo, morango, chocolate)"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full px-4 md:px-6 py-3 md:py-4 pl-12 md:pl-14 pr-4 rounded-xl border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all duration-300"
          />
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Limpar busca"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
        {searchTerm && (
          <p className="mt-2 text-sm text-muted-foreground">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1
              ? "produto encontrado"
              : "produtos encontrados"}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <article
              key={product.id}
              className="group bg-card border-2 border-border flex flex-col rounded-2xl p-6 hover:border-accent transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <button
                type="button"
                onClick={() => openDetails(product)}
                className="text-left"
              >
                <Image
                  src={`/assets${product.image}`}
                  alt={product.name}
                  width={192}
                  height={192}
                  className="w-full h-48 object-contain rounded-lg mb-4 group-hover:scale-110 transition-transform duration-300"
                />
                <h3 className="font-bold text-lg text-foreground mb-2 text-center">
                  {product.name}
                </h3>
              </button>

              <p className="text-xs text-muted-foreground text-center mb-3">
                {product.description}
              </p>

              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="text-xs bg-accent/20 text-accent font-semibold px-2 py-1 rounded">
                  {product.weight}
                </span>
              </div>

              <div className="mb-4 flex-1">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="text-sm text-muted-foreground line-through">
                    R$ {product.originalPrice.toFixed(2)}
                  </span>
                  <span className="text-xs bg-red-500 text-white font-bold px-2 py-0.5 rounded">
                    -90%
                  </span>
                </div>
                <p className="text-3xl font-black text-accent text-center">
                  R$ {product.discountPrice.toFixed(2)}{" "}
                  <span className="text-sm text-neutral-500 font-medium">
                    /un
                  </span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => openDetails(product)}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-xl transition-all duration-300 hover:shadow-md"
              >
                <span className="flex items-center justify-center gap-2">
                  <ShoppingCart className="h-5 w-5" /> Ver detalhes
                </span>
              </button>
            </article>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-2xl mb-2">🔍</p>
            <p className="text-lg font-semibold text-foreground mb-1">
              Nenhum produto encontrado
            </p>
            <p className="text-sm text-muted-foreground">
              Tente buscar por outro termo ou{" "}
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="text-accent font-semibold hover:underline"
              >
                limpe a busca
              </button>
            </p>
          </div>
        )}
      </div>

      <div className="mt-12 text-center max-w-2xl">
        <p className="text-sm text-muted-foreground">
          🚚 Frete grátis para compras acima de R$ 50,00 | 🔒 Compra 100% segura
        </p>
      </div>
    </div>
  );
}
