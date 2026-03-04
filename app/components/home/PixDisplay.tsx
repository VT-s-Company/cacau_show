"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import Image from "next/image";

interface PixDisplayProps {
  code: string;
  expiration: string;
}

export default function PixDisplay({ code, expiration }: PixDisplayProps) {
  const [qrImage, setQrImage] = useState<string>("");

  useEffect(() => {
    async function generate() {
      const url = await QRCode.toDataURL(code, {
        width: 256,
        margin: 2,
      });

      setQrImage(url);
    }

    generate();
  }, [code]);

  return (
    <div className="flex flex-col items-center">
      <Image
        src={qrImage}
        alt="QR Code PIX"
        width={200}
        height={200}
        className="w-48 h-48"
      />
    </div>
  );
}
