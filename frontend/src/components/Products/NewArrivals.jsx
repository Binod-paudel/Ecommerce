import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import axios from 'axios';

const NewArrivals = () => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v2/products/new-arrival`);
        setNewArrivals(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchNewArrivals();
  }, []); // Empty dependency array ensures this effect runs only once when the component mounts

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
