import React from 'react'
import Topbar from '../Layout/Topbar'
import Navbar from './Navbar'
import CartDrawer from '../Layout/CartDrawer'

const Header = () => {
  return (
    <div>
     {/* Topbar */}
     <Topbar />
     {/* navbar */}
     <Navbar />
     {/* Cart Drawer */}
     <CartDrawer />
    </div>
  )
}

export default Header
