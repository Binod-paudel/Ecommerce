import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const NewArrivals = () => {
  // const scrollRef = useRef(null);
  // const [canScrollLeft, setCanScrollLeft] = useState(false);
  // const [canScrollRight, setCanScrollRight] = useState(true);

  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight]= useState(true);

  const newArrivals = [
    { _id: '1', name: 'Stylish Jacket', price: 120, images: [{ url: 'https://picsum.photos/500/500?random=1', altText: 'Stylish Jacket' }] },
    { _id: '2', name: 'Casual Hoodie', price: 100, images: [{ url: 'https://picsum.photos/500/500?random=2', altText: 'Casual Hoodie' }] },
    { _id: '3', name: 'Elegant Coat', price: 150, images: [{ url: 'https://picsum.photos/500/500?random=3', altText: 'Elegant Coat' }] },
    { _id: '4', name: 'Denim Jacket', price: 130, images: [{ url: 'https://picsum.photos/500/500?random=4', altText: 'Denim Jacket' }] },
    { _id: '5', name: 'Trendy Sweater', price: 110, images: [{ url: 'https://picsum.photos/500/500?random=5', altText: 'Trendy Sweater' }] },
    { _id: '6', name: 'Winter Coat', price: 170, images: [{ url: 'https://picsum.photos/500/500?random=6', altText: 'Winter Coat' }] },
    { _id: '7', name: 'Leather Jacket', price: 200, images: [{ url: 'https://picsum.photos/500/500?random=7', altText: 'Leather Jacket' }] },
    { _id: '8', name: 'Casual Shirt', price: 90, images: [{ url: 'https://picsum.photos/500/500?random=8', altText: 'Casual Shirt' }] },
  ];

  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
    }
  };



  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener('scroll', updateScrollButtons);
      updateScrollButtons();
    }
    return () => container?.removeEventListener('scroll', updateScrollButtons);
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative">
      <div className='container mx-auto text-center mb-10'>
        <h2 className='text-3xl font-bold mb-4'>Explore New Arrivals</h2>
        <p className='text-lg text-gray-600 mb-8'>
          Discover the latest styles straight off the runway, freshly added to keep your wardrobe trendy.
        </p>
      </div>

      {/* Scrollable Content */}
      <div className='relative container mx-auto flex items-center'>
        {/* Scroll Buttons */}
        {canScrollLeft && (
          <button onClick={() => scroll('left')} className='absolute left-0 z-10 p-2 bg-white shadow-md rounded-full'>
            <FiChevronLeft className='text-2xl' />
          </button>
        )}

        <div ref={scrollRef} className='overflow-x-scroll flex space-x-6 scrollbar-hide scroll-smooth w-full px-10'>
          {newArrivals.map((product) => (
            <div key={product._id} className='min-w-[250px] relative group'>
              <img 
                src={product.images[0]?.url} 
                alt={product.images[0]?.altText || product.name} 
                className='w-full h-[300px] object-cover rounded-lg'
              />
              {/* Overlay */}
              <div className='absolute bottom-0 left-0 w-full bg-gray-800 bg-opacity-75 text-white p-4'>
                <Link to={`/product/${product._id}`} className='block'>
                  <h4 className='text-lg font-semibold'>{product.name}</h4>
                  <p className='text-md mt-1'>${product.price}</p>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {canScrollRight && (
          <button onClick={() => scroll('right')} className='absolute right-0 z-10 p-2 bg-white shadow-md rounded-full'>
            <FiChevronRight className='text-2xl' />
          </button>
        )}
      </div>
    </section>
  );
};

export default NewArrivals;