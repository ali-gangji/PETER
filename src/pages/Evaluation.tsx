import React from 'react';
import Product from '../module/products/core/presentation/Product';
import DefaultLayout from '../ui/layout/DefaultLayout';

function Evaluation() {
  return (
    <DefaultLayout>
      {/* This container centers the content and applies consistent horizontal
        and vertical padding, matching the layout of the About page.
      */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Product />
      </div>
    </DefaultLayout>
  );
}

export default Evaluation;
