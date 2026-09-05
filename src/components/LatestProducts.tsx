import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { latestProducts } from '../data/productData';

export default function LatestProducts() {
  return (
    <div className="bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white px-6 py-4 rounded-xl shadow-xs border border-gray-100 mb-6 flex justify-between items-center">
          <h3 className="text-xl md:text-2xl text-gray-900 tracking-tight font-[montserrat]">
            <span className="font-bold">Latest</span>{' '}
            <span className="font-serif italic font-normal text-gray-700">
              Products
            </span>
          </h3>
          <Link
            to="/shop"
            className="bg-[#FFD700] hover:bg-[#e6c200] text-black px-5 py-2 rounded-lg font-medium text-sm transition-colors font-[montserrat]"
          >
            See more
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
          {latestProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
