import React from 'react';
import { useLocation } from 'react-router-dom';
import Footer from '../components/adventurer/Footer'
import MerchantFooter from '../components/merchant/Footer'
import AdminFooter from '../components/admin/Footer'

function ConditionalFooter() {
  const location = useLocation();

  const isMerchantRoute = location.pathname.includes('/merchant')
  const isAdminRoute = location.pathname.includes('/admin')

  return (
    <nav>
      {isMerchantRoute ? <MerchantFooter /> : isAdminRoute ? <AdminFooter /> : <Footer />}
    </nav>
  );
}

export default ConditionalFooter;
