import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { kameezProducts } from '../data/productData';

export default function BestKameez() {
  return (
    <div className="bg-[#f4f5f8] font-[inter] antialiased text-gray-900 flex flex-col justify-center my-4 md:my-6 lg:my-8">
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">
        <div className="mb-6 flex items-center justify-between rounded-xl bg-white p-4 shadow-xs border border-gray-100 sm:px-6">
          <h2 className="text-xl md:text-2xl text-gray-900 tracking-tight font-[montserrat]">
            <span className="font-bold">Best</span>
            <span className="font-serif italic text-gray-800 font-normal ml-1">
              Kameez
            </span>
          </h2>
          <Link
            to="/shop"
            className="rounded-lg bg-[#FFD700] px-5 py-2 text-sm font-semibold text-gray-900 transition-colors duration-300 hover:bg-[#111827] hover:text-yellow-400 font-[montserrat]"
          >
            See more
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3 lg:grid-cols-5 lg:gap-4">
          {kameezProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
