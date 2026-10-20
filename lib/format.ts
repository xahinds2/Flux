const rupees = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const rupeesWithPaise = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" });

export const formatPrice = (price: number) => (Number.isInteger(price) ? rupees : rupeesWithPaise).format(price);

export function whatsappLink(number: string, title: string, price: number) {
  const text = `Hey, interested in ${title} for ${formatPrice(price)}`;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export function formatAge(purchasedAt: string) {
  const [year, month] = purchasedAt.split("-").map(Number);
  const now = new Date();
  const months = (now.getFullYear() - year) * 12 + now.getMonth() + 1 - month;
  if (months < 1) return "Under 1 month old";
  if (months < 12) return `${months} ${months === 1 ? "month" : "months"} old`;
  const years = Math.floor(months / 12);
  return `${years} ${years === 1 ? "year" : "years"} old`;
}
