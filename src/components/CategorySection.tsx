import { Link } from 'react-router-dom';
import Image1 from '../img/22.jpg';
import Image2 from '../img/5.jpg';
import Image3 from '../img/29.jpg';
import Image4 from '../img/13.jpg';
import Image5 from '../img/7.jpg';
import Image6 from '../img/23.jpg';
import Image7 from '../img/1.jpg';
import Image8 from '../img/9.jpg';

// Define the TypeScript interface for our category data
interface Category {
  id: string;
  title: string;
  imageUrl: string;
  link: string;
}

// Array of category data for easy mapping and maintainability
const categoryData: Category[] = [
  {
    id: 'cat-1',
    title: 'Style bangla',
    imageUrl: Image1,
    link: '/shop',
  },
  {
    id: 'cat-2',
    title: 'Royal Abaya',
    imageUrl: Image2,
    link: '/shop',
  },
  {
    id: 'cat-3',
    title: 'Paisley Pashmina',
    imageUrl: Image3,
    link: '/shop',
  },
  {
    id: 'cat-4',
    title: 'Noor Burka',
    imageUrl: Image4,
    link: '/borka',
  },
  {
    id: 'cat-5',
    title: 'Modest Grace',
    imageUrl: Image5,
    link: '/shop',
  },
  {
    id: 'cat-6',
    title: 'Hijab',
    imageUrl: Image6,
    link: '/hijab',
  },
  {
    id: 'cat-7',
    title: 'Elegant Veil',
    imageUrl: Image7,
    link: '/hijab',
  },
  {
    id: 'cat-8',
    title: 'Classic Burka',
    imageUrl: Image8,
    link: '/borka',
  },
];

export default function CategorySection() {
  return (
    <div className="bg-[#f4f5f8] font-[inter] antialiased text-gray-900 flex flex-col justify-center my-4 md:my-6 lg:my-8">
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">
        {/* Header Bar */}
        <div className="bg-white rounded-xl shadow-xs p-4 sm:px-6 flex justify-between items-center mb-6 border border-gray-100">
          <h2 className="text-xl md:text-2xl text-gray-900 tracking-tight font-[montserrat]">
            <span className="font-bold">Category</span>{' '}
            <span className="font-serif italic text-gray-700 font-normal ml-1">
              Section
            </span>
          </h2>

          {/* See more Button */}
          <Link
            to="/shop"
            className="hover:bg-[#111827] hover:text-yellow-400 bg-yellow-400 font-semibold py-2 px-6 rounded-lg text-sm transition-colors duration-300 font-[montserrat]"
          >
            See more
          </Link>
        </div>

        {/* Categories Grid (8 columns on desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {categoryData.map((category) => (
            <Link
              key={category.id}
              to={category.link}
              className="bg-white p-2.5 rounded-xl shadow-xs hover:shadow-md transition-all duration-300 group flex flex-col h-full border border-gray-100"
            >
              {/* Image Container with aspect ratio and hover effect */}
              <div className="bg-gray-100 w-full aspect-3/4 mb-3 overflow-hidden relative rounded-lg">
                <img
                  src={category.imageUrl}
                  alt={category.title}
                  className="w-full h-full object-cover object-top mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              {/* Category Title */}
              <h3 className="text-[13px] font-bold text-gray-800 text-center pb-1">
                {category.title}
              </h3>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
