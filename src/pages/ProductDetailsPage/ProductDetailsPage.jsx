import React from "react"
import { useNavigate, useParams } from 'react-router-dom'
import ProductDetailsComponents from "../../components/ProductDetailsComponents/ProductDetailsComponents";
const ProductDetailsPage = () => {
  const {id} = useParams()
  const navigate = useNavigate()  
  return (
    <div className="h-[1000px] px-[120px] bg-[#efefef]">
      <div className="w-[1270px] h-full mx-auto">
        <h5><span className="cursor-pointer font-bold" onClick={() => {navigate('/')}}>Trang chủ</span> - Chi tiết sản phẩm</h5>
        <ProductDetailsComponents idProduct={id} />
      </div>
    </div>
  );
};

export default ProductDetailsPage;
