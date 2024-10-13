'use client';

import { useCart } from '../CartContext';

export default function CartOverlay() {
  const { isOpen } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
  );
}
