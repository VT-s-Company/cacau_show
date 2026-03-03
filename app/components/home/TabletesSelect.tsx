"use client";

import Image from "next/image";

export interface TabletesSelectProps {
  selectedTablets: boolean[];
  onTabletChange: (index: number) => void;
}

const tabletOptions = [
  {
    name: "Tablete laCreme de Chocolate Branco com Pistache 100g",
    image: "/assets/images/tabletes/pistache.png",
  },
  {
    name: "Tablete de Chocolate ao Leite Morango 100g",
    image: "/assets/images/tabletes/morango.png",
  },
  {
    name: "Tablete laCreme de Chocolate ao Leite 100g",
    image: "/assets/images/tabletes/chltleite.png",
  },
];

export default function TabletesSelect({
  selectedTablets,
  onTabletChange,
}: Readonly<TabletesSelectProps>) {
  return (
    <div className="">
      <div className="bg-primary text-primary-foreground rounded-t-xl px-4 py-3 mt-6">
        <p className="text-xs sm:text-sm font-bold uppercase text-center leading-snug">
          APROVEITE! ADICIONE TABLETES POR APENAS +R$10,00 CADA
        </p>
      </div>
      <div className="border border-border border-t-0 rounded-b-xl divide-y divide-border">
        {tabletOptions.map((tablet, index) => (
          <label
            key={index}
            className="flex items-center gap-3 p-3 cursor-pointer hover:bg-card transition-colors"
          >
            <input
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary shrink-0"
              type="checkbox"
              checked={selectedTablets[index]}
              onChange={() => onTabletChange(index)}
            />
            <div className="w-10 h-10 rounded-md overflow-hidden bg-card shrink-0">
              <Image
                alt={tablet.name}
                loading="lazy"
                width="40"
                height="40"
                decoding="async"
                className="object-cover w-full h-full"
                src={tablet.image}
                style={{ color: "transparent" }}
              />
            </div>
            <span className="text-sm text-foreground truncate">
              {tablet.name}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
