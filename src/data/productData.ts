import type { Product } from '../types/Product';

import img1 from '../img/product1.jpg';
import img2 from '../img/product2.png';
import img3 from '../img/product3.jpg';
import img4 from '../img/product4.jpg';
import img5 from '../img/product5.jpg';
import img6 from '../img/product6.png';
import img7 from '../img/product7.jpg';
import img8 from '../img/product8.jpg';
import img9 from '../img/product9.jpg';
import img10 from '../img/product10.png';
import img11 from '../img/product11.png';
import img12 from '../img/product12.jpg';
import img13 from '../img/product13.jpg';
import img14 from '../img/product14.jpg';
import img15 from '../img/product15.jpg';

import Kameez1 from '../img/kameez1.jpg';
import Kameez2 from '../img/kameez2.jpg';
import Kameez3 from '../img/kameez3.jpg';
import Kameez4 from '../img/kameez4.png';
import Kameez5 from '../img/kameez5.png';

export const latestProducts: Product[] = [
  {
    id: 'prod-0',
    name: 'The best Ash Blue Half-silk Saree',
    price: 2291,
    originalPrice: 3490,
    imageUrl: img1,
    category: 'Saree',
    description:
      'An exquisite Ash Blue Half-silk Saree that blends timeless tradition with contemporary elegance. Crafted from premium half-silk fabric, this saree features a luxurious drape and soft sheen that catches the light beautifully. Perfect for festive occasions, weddings, and special celebrations.',
  },
  {
    id: 'prod-1',
    name: 'Orange Color Abaya with Lace & Stone Work',
    price: 4667,
    originalPrice: 5490,
    saveAmount: 823,
    imageUrl: img2,
    category: 'Abaya',
    description:
      'A stunning Orange Abaya adorned with intricate lace patterns and delicate stone work. This piece combines modesty with high fashion, featuring meticulous hand-embellished details that make it a true work of art. Ideal for formal gatherings and special events.',
  },
  {
    id: 'prod-2',
    name: 'Pink Half-silk Saree with Zari Border',
    price: 3690,
    originalPrice: 5490,
    imageUrl: img3,
    category: 'Saree',
    description:
      'A gorgeous Pink Half-silk Saree with a stunning Zari border that adds a regal touch. The rich pink hue and shimmering zari work create an ensemble that is both classic and contemporary. Lightweight and comfortable for all-day wear.',
  },
  {
    id: 'prod-3',
    name: 'Pink Rayon Blended Long Shrug',
    price: 1791,
    originalPrice: 5490,
    imageUrl: img4,
    category: 'Shrug',
    description:
      'A versatile Pink Rayon Blended Long Shrug that adds a layer of sophistication to any outfit. The soft rayon blend ensures comfort while the flowing silhouette creates an effortlessly chic look. Perfect for layering over kurtas and casual wear.',
  },
  {
    id: 'prod-4',
    name: 'Printed Georgette Cape with Stone Work',
    price: 1752,
    originalPrice: 5490,
    imageUrl: img5,
    category: 'Cape',
    description:
      'An elegant Printed Georgette Cape featuring exquisite stone work embellishments. The lightweight georgette fabric flows gracefully while the printed pattern adds visual interest. A statement piece that elevates any ensemble.',
  },
  {
    id: 'prod-5',
    name: 'Black Color Borka Design with Embroidery & Stone Work',
    price: 4667,
    originalPrice: 5490,
    imageUrl: img6,
    category: 'Borka',
    description:
      'A sophisticated Black Borka featuring intricate embroidery and stone work. The classic black colour is elevated with detailed hand-crafted embellishments. A perfect choice for daily wear and special occasions alike.',
  },
  {
    id: 'prod-6',
    name: 'Purple Crepe Straight Salwar Kameez',
    price: 4999,
    originalPrice: 5490,
    imageUrl: img7,
    category: 'Kameez',
    description:
      'A refined Purple Crepe Straight Salwar Kameez that combines comfort with elegance. The premium crepe fabric offers a beautiful drape and the straight-cut silhouette provides a modern, flattering look. Suitable for both office wear and casual outings.',
  },
  {
    id: 'prod-7',
    name: 'Beige Georgette A-line Salwar Kameez',
    price: 5690,
    originalPrice: 6490,
    imageUrl: img8,
    category: 'Kameez',
    description:
      'An enchanting Beige Georgette A-line Salwar Kameez with a flattering silhouette. The A-line cut and premium georgette fabric create an effortlessly elegant look. The neutral beige tone makes it incredibly versatile for all occasions.',
  },
  {
    id: 'prod-8',
    name: 'Aqua Green Half-silk Saree with Zari Border',
    price: 3490,
    originalPrice: 4150,
    imageUrl: img9,
    category: 'Saree',
    description:
      'A mesmerising Aqua Green Half-silk Saree with a beautiful Zari border. The refreshing aqua green shade is perfect for spring and summer events. The zari border adds a touch of grandeur to this elegantly crafted saree.',
  },
  {
    id: 'prod-9',
    name: 'Cream Color Borka Design with Lace & Stone Work',
    price: 4660,
    originalPrice: 5200,
    imageUrl: img10,
    category: 'Borka',
    description:
      'A graceful Cream Borka design featuring delicate lace and sparkling stone work. The soft cream colour exudes understated elegance while the embellishments add a luxurious touch. Perfect for both daily and festive wear.',
  },
  {
    id: 'prod-10',
    name: 'Gorgeous Printed Abaya with Lace & Embroidery Work',
    price: 4667,
    originalPrice: 5200,
    imageUrl: img11,
    category: 'Abaya',
    description:
      'A breathtaking Printed Abaya enhanced with lace and embroidery work. The unique print pattern combined with hand-finished details creates a truly one-of-a-kind piece. Designed for the fashion-forward modest dresser.',
  },
  {
    id: 'prod-11',
    name: 'Green Georgette A-line Kameez with Stone Work',
    price: 3651,
    originalPrice: 4130,
    imageUrl: img12,
    category: 'Kameez',
    description:
      'A beautiful Green Georgette A-line Kameez adorned with stone work. The flowing georgette fabric and A-line cut create a flattering silhouette, while the stone work adds a sparkle of glamour. Perfect for festive occasions.',
  },
  {
    id: 'prod-12',
    name: 'White Long Abaya-style Shrug with Lace & Stone Work',
    price: 3190,
    originalPrice: 4100,
    imageUrl: img13,
    category: 'Shrug',
    description:
      'A stunning White Long Abaya-style Shrug featuring lace and stone work details. This versatile piece can be styled over multiple outfits, adding an instant touch of elegance. The white colour makes it a wardrobe essential.',
  },
  {
    id: 'prod-13',
    name: 'Orange A-line Tunic With Shrug & Lace Work',
    price: 5290,
    originalPrice: 6000,
    imageUrl: img14,
    category: 'Shrug',
    description:
      'A vibrant Orange A-line Tunic paired with a coordinating Shrug, both featuring exquisite lace work. This two-piece set offers versatile styling options and a contemporary ethnic look. The warm orange tone is perfect for festive seasons.',
  },
  {
    id: 'prod-14',
    name: 'Black Viscose Short Shrug with Lace & Stone Work',
    price: 1450,
    originalPrice: 2000,
    imageUrl: img15,
    category: 'Shrug',
    description:
      'A chic Black Viscose Short Shrug with lace and stone work. The short length makes it perfect for pairing with both traditional and western outfits. The viscose fabric ensures comfort and the embellishments add a touch of glamour.',
  },
];

export const kameezProducts: Product[] = [
  {
    id: 'kameez-1',
    name: 'Ash Blue Half-silk Saree',
    price: 2291,
    imageUrl: Kameez1,
    category: 'Saree',
    description:
      'A beautifully crafted Ash Blue Half-silk Saree with a delicate texture and rich colour. The half-silk fabric provides a luxurious drape and subtle sheen. An ideal choice for celebrations and formal events.',
  },
  {
    id: 'kameez-2',
    name: 'Brown Georgette Straight Salwar Kameez',
    price: 8642,
    imageUrl: Kameez2,
    category: 'Kameez',
    description:
      'A premium Brown Georgette Straight Salwar Kameez that epitomises understated luxury. The rich brown tone and straight-cut silhouette offer a modern, sophisticated look. Crafted from the finest georgette for an exceptional drape.',
  },
  {
    id: 'kameez-3',
    name: 'Pink Rayon Blended Long Shrug',
    price: 1791,
    imageUrl: Kameez3,
    category: 'Shrug',
    description:
      'A flowing Pink Rayon Blended Long Shrug that adds effortless elegance to any outfit. The soft, breathable rayon blend ensures all-day comfort. A versatile layering piece for every wardrobe.',
  },
  {
    id: 'kameez-4',
    name: 'Cream Color Borka Design with Lace & Stone Work',
    price: 4667,
    originalPrice: 5490,
    saveAmount: 823,
    imageUrl: Kameez4,
    category: 'Borka',
    description:
      'An elegant Cream Borka featuring delicate lace trim and sparkling stone work accents. The cream tone offers timeless appeal while the embellishments add a luxurious finish. Perfect for special occasions.',
  },
  {
    id: 'kameez-5',
    name: 'Black Color Borka Design with Embroidery & Stone Work',
    price: 4667,
    originalPrice: 5490,
    saveAmount: 823,
    imageUrl: Kameez5,
    category: 'Borka',
    description:
      'A sophisticated Black Borka with exquisite embroidery and stone work. The deep black colour serves as the perfect canvas for the intricate hand-crafted details. A statement piece for the modern, modest woman.',
  },
];

export const allProducts: Product[] = [...latestProducts, ...kameezProducts];

export function getProductById(id: string): Product | undefined {
  return allProducts.find((p) => p.id === id);
}

export function getRelatedProducts(product: Product, count = 5): Product[] {
  // Get products from the same category first, then fill with others
  const sameCategory = allProducts.filter(
    (p) => p.id !== product.id && p.category === product.category,
  );
  const others = allProducts.filter(
    (p) => p.id !== product.id && p.category !== product.category,
  );
  return [...sameCategory, ...others].slice(0, count);
}

export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return allProducts.filter((p) => {
    const inName = p.name.toLowerCase().includes(q);
    const inCategory = p.category?.toLowerCase().includes(q);
    const inDescription = p.description?.toLowerCase().includes(q);
    const isHijabSearch =
      q.includes('hijab') && (p.category === 'Borka' || p.category === 'Abaya');
    return inName || inCategory || inDescription || isHijabSearch;
  });
}
