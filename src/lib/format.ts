/**
 * src/lib/format.ts
 * Deterministic currency helpers (no Intl) so server-rendered HTML and
 * client hydration always produce byte-identical strings.
 */

/** "$118.00" style USD reference price. */
export function fmtUSD(value: number): string {
  return `$${value.toFixed(2)}`;
}

/** "Bs. 31.683,00" style bolívar reference (es-VE grouping: . thousands, , decimals). */
export function fmtBs(value: number): string {
  const [intPart, decPart] = value.toFixed(2).split('.');
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `Bs. ${grouped},${decPart}`;
}

/**
 * Builds the wa.me deep link with a professionally formatted order inquiry:
 * greeting → itemized list (qty + unit price) → USD total → delivery/payment question.
 */
export function buildWhatsAppOrderUrl(params: {
  phone: string;
  storeName: string;
  items: { qty: number; name: string; priceUSD: number }[];
  totalUSD: number;
  bsReference: string;
}): string {
  const { phone, storeName, items, totalUSD, bsReference } = params;

  const lines: string[] = [
    `Hola ${storeName}, saludos. Quisiera cotizar el siguiente pedido:`,
    '',
    ...items.map(
      (item) => `- ${item.qty}x ${item.name} — $${item.priceUSD.toFixed(2)} c/u`,
    ),
    '',
    `Total referencial: $${totalUSD.toFixed(2)} (Bs. ${bsReference})`,
    '',
    '¿Me confirman disponibilidad, el método de entrega (envío o retiro) y las formas de pago? Gracias.',
  ];

  return `https://wa.me/${phone}?text=${encodeURIComponent(lines.join('\n'))}`;
}
