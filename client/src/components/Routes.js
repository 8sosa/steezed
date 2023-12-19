import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import React from 'react'
import ConditionalNav from './ConditionalNav.js'
import ConditionalFooter from './ConditionalFooter.js'
import Home from '../components/adventurer/Home.js'
import MerchantHome from '../components/merchant/Home.js'
import AdminHome from '../components/admin/Home.js'
import SignUp from '../components/adventurer/SignUp.js'
import SignIn from '../components/adventurer/SignIn.js'
import Category from '../components/adventurer/Category.js'
import Loot from '../components/adventurer/Loot.js'
import Cart from '../components/adventurer/Cart.js'
import Checkout from '../components/adventurer/Checkout.js'
import Profile from '../components/adventurer/Profile.js'
import MerchantSignUp from '../components/merchant/SignUp.js'
import MerchantSignIn from '../components/merchant/SignIn.js'
import Shop from '../components/adventurer/Shop.js'
import Pay from './adventurer/Pay.js'

export default function SteezedRouter() {
  return (
    <Router>
            <ConditionalNav />
              <Routes>
                  <Route path = "/" element={<Home/>} exact/>
                  <Route path='/seller/:_id/shop' element={<MerchantHome />} exact/>
                  <Route path='/seller/:_id/' element={<Shop />} exact/>
                  <Route path='/admin' element={<AdminHome />} exact/>
                  <Route path='/register' element={<SignUp/>} exact/>
                  <Route path='/login' element={<SignIn/>} exact/>
                  <Route path='/merchant/register' element={<MerchantSignUp />} exact/>
                  <Route path='/merchant/login' element={<MerchantSignIn/>} exact/>
                  <Route path='/shopper/:_id' element={<Profile/>} exact/>
                  <Route path='/category/:id/products' element={<Category/>} exact/>
                  <Route path='/api/products/:_id' element={<Loot/>} exact/>
                  <Route path='/cart' element={<Cart/>} exact/>
                  <Route path='/checkout' element={<Checkout/>} exact/>
                  <Route path='/pay/:orderid' element={<Pay/>} exact/>
              </Routes>
            <ConditionalFooter />
    </Router>
  )
}
