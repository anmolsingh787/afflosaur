import { ExternalLink } from 'lucide-react';

interface DealCardProps {
  product: {
    id: string;
    title: string;
    brand: string;
    price: number;
    old_price: number;
    affiliate_url: string;
    image_url: string;
    is_trending: boolean;
  };
}

export default function DealCard({ product }: DealCardProps) {
  return (
    <div className="border rounded-xl p-4 shadow-sm hover:shadow-md transition">
      <img src={product.image_url} alt={product.title} className="w-full h-48 object-contain" />
      <h3 className="font-bold mt-2 truncate">{product.title}</h3>
      <p className="text-sm text-gray-600">{product.brand}</p>
      <div className="flex gap-2 items-center mt-2">
        <span className="text-orange-600 font-bold">₹{product.price}</span>
        <span className="text-gray-400 line-through text-sm">₹{product.old_price}</span>
        {product.is_trending && (
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">Trending</span>
        )}
      </div>
      <a
        href={product.affiliate_url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex items-center justify-center gap-2 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
      >
        View Deal <ExternalLink size={16} />
      </a>
    </div>
  );
}