import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import React from 'react'
import ConditionalNav from './ConditionalNav.js'
import ConditionalFooter from './ConditionalFooter.js'
import Home from '../components/adventurer/Home.js'
import MerchantHome from '../components/merchant/Home.js'
import AdminHome from '../components/admin/Home.js'
import AdminSignIn from '../components/admin/SignIn.js'
import AdminSignUp from '../components/admin/SignUp.js'
import SignUp from '../components/adventurer/SignUp.js'
import SignIn from '../components/adventurer/SignIn.js'
import Category from '../components/adventurer/Category.js'
import Loot from '../components/adventurer/Loot.js'
import Cart from '../components/adventurer/Cart.js'
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
                  <Route path='/a/secret/admin' element={<AdminHome />} exact/>
                  <Route path='/a/secret/admin/login' element={<AdminSignIn />} exact/>
                  <Route path='/a/secret/admin/register' element={<AdminSignUp />} exact/>
                  <Route path='/m/seller/:_id/shop' element={<MerchantHome />} exact/>
                  <Route path='/m/seller/register' element={<MerchantSignUp />} exact/>
                  <Route path='/m/seller/login' element={<MerchantSignIn/>} exact/>
                  <Route path='/s/login' element={<SignIn/>} exact/>
                  <Route path='/s/register' element={<SignUp/>} exact/>
                  <Route path='/s/shopper/:_id' element={<Profile/>} exact/>
                  <Route path='/s/cart' element={<Cart/>} exact/>
                  <Route path='/s/category/:id/products' element={<Category/>} exact/>
                  <Route path='/s/' element={<Home/>} exact/>
                  <Route path='/s/shop/:_id/' element={<Shop />} exact/>
                  <Route path='/s/api/products/:_id' element={<Loot/>} exact/>
                  <Route path='/s/pay/:orderid' element={<Pay/>} exact/>
              </Routes>
            <ConditionalFooter />
    </Router>
  )
}
