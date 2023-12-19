import React from 'react';
import { useLocation } from 'react-router-dom';
import Nav from '../components/adventurer/Nav'
import MerchantNav from '../components/merchant/Nav'
import AdminNav from '../components/admin/Nav'

function ConditionalNav() {
  const location = useLocation();

  const isMerchantRoute = location.pathname.includes('/seller');
  const isAdminRoute = location.pathname.includes('/admin')

  return (
    <nav>
      {isMerchantRoute ? <MerchantNav /> : isAdminRoute ? <AdminNav /> : <Nav />}
    </nav>
  );
}

export default ConditionalNav;
