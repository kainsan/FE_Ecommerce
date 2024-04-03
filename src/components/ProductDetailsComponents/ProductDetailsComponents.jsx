import React,{useState, useEffect, useMemo} from "react";
import { Row, Col, Image, Rate } from "antd";
import imageProduct from "../../assets/images/phone.png";
import imageProductSmall from "../../assets/images/phonesmall.webp";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import * as ProductService from '../../services/ProductService'
import { useQuery } from '@tanstack/react-query'
import Pending from '../PendingComponent/Pending'
import {
  WrapperStyleImageSmall,
  WrapperStyleColImage,
  WrapperStyleNameProduct,
  WrapperStyleTextSell,
  WrapperPriceProduct,
  WrapperPriceTextProduct,
  WrapperAddressProduct,
  WrapperQuantityProduct,
  WrapperInputNumber,
} from "./style";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from "react-router-dom";
import { addOrderProduct,resetOrder } from '../../redux/slides/orderSlide'
import { convertPrice,initFacebookSDK } from '../../utils'
import * as message from '../Message/Message'
import LikeButtonComponent from '../LikeButtonComponent/LikeButtonComponent'
import CommentComponent from '../CommentComponent/CommentComponent'

const ProductDetailsComponents = ({idProduct}) => {
  const [numProduct, setNumProduct] = useState(1);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const order = useSelector((state) => state.order);
  const location = useLocation();
  const dispatch = useDispatch();
  const [errorLimitOrder,setErrorLimitOrder] = useState(false)
  
  const onChange = (value) => {
    setNumProduct(Number(value));
  }
  const fetchGetDetailsProduct = async (context) => {
  const id = context?.queryKey && context?.queryKey[1]
    if(id) {
        const res = await ProductService.getDetailsProduct(id)
        return res.data
    }
  }

  useEffect(() => {
    initFacebookSDK()
  }, [])


  useEffect(() => {
    const orderRedux = order?.orderItems?.find((item) => item.product === productDetails?._id) 
      if((orderRedux?.amount + numProduct) <= orderRedux?.countInstock || (!orderRedux && productDetails?.countInStock > 0)) {
          setErrorLimitOrder(false)
      } else if(productDetails?.countInStock === 0){
          setErrorLimitOrder(true)
      }
    },[numProduct])

  useEffect(() => {
    if(order?.isSuccessOrder) {
        message.success('Đã thêm vào giỏ hàng')
    }
    return () => {
        dispatch(resetOrder())
    }
}, [order.isSuccessOrder])
    
  const handleChangeCount = (type,limited) => {
    if(type === 'increase') {
      if(!limited) {
          setNumProduct(numProduct + 1)
      }
  }else {
      if(!limited) {
          setNumProduct(numProduct - 1)
      }
  }
  }

  const { isLoading, data: productDetails } = useQuery({ queryKey: ['product-details', idProduct], queryFn: fetchGetDetailsProduct,options: { enabled : !!idProduct}})

  const handleAddOrderProduct = () => {
      if(!user?.id) {
        navigate("/sign-in", {state: location?.pathname});
      }else {
        const orderRedux = order?.orderItems?.find((item) => item.product === productDetails?._id)
        if((orderRedux?.amount + numProduct) <= orderRedux?.countInstock || (!orderRedux && productDetails?.countInStock > 0)) {
          dispatch(addOrderProduct({
            orderItem: {
              name: productDetails?.name,
              amount: numProduct,
              image: productDetails?.image,
              price: productDetails?.price,
              product: productDetails?._id,
              discount: productDetails?.discount,
              countInstock: productDetails?.countInStock
            },
          }))
        } else {
          setErrorLimitOrder(true)
          }
      }
      
  }
  return (
    <div>
    <Pending isPending={isLoading}>
        <Row
          style={{
            padding: "16px",
            background: "#fff",
            borderRadius: "4px",
            height: "100%",
          }}>
          <Col
            span={10}
            style={{ borderRight: "1px solid #e5e5e5", paddingRight: "8px" }}
          >
            <Image style={{ width: "100%", height: "100%" }} src={productDetails?.image} alt="image product" preview={false} />
          </Col>
          <Col span={14} style={{ paddingLeft: "10px" }}>
            <WrapperStyleNameProduct>{productDetails?.name}</WrapperStyleNameProduct>
            <div>
              <Rate allowHalf defaultValue={productDetails?.rating} value={productDetails?.rating}  />
            </div>
            <WrapperStyleTextSell> Selled { productDetails?.selled || 1000} + </WrapperStyleTextSell>
            <WrapperPriceProduct>
              <WrapperPriceTextProduct>{convertPrice(productDetails?.price)}</WrapperPriceTextProduct>
            </WrapperPriceProduct>
            <WrapperAddressProduct>
              <span>Giao đến </span>
              <span className="address">{user?.address}</span> -
              <span className="change-address">Đổi địa chỉ</span>
            </WrapperAddressProduct>
            <LikeButtonComponent datahref={process.env.REACT_APP_IS_LOCAL ? "https://developers.facebook.com/docs/plugins/" : window.location.href}/>
            <div
              style={{
                margin: "10px 0 20px",
                padding: "10px 0",
                borderTop: "1px solid #e5e5e5",
                borderBottom: "1px solid #e5e5e5",
              }}
            >
              <div style={{ marginBottom: "10px" }}>Số lượng</div>
              <WrapperQuantityProduct>
                <button
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                  onClick={() => handleChangeCount('decrease',numProduct === 1)}
                >
                  <MinusOutlined style={{ color: "#000", fontSize: "20px" }} />
                </button>
                <WrapperInputNumber
                  onChange={onChange}
                  max={productDetails?.countInStock} 
                  min={1}
                  value={numProduct}
                  size="small"
                />
                <button
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                  onClick={() => handleChangeCount('increase',  numProduct === productDetails?.countInStock)}
                >
                  <PlusOutlined style={{ color: "#000", fontSize: "20px" }} />
                </button>
              </WrapperQuantityProduct>
            </div>
            <div style={{ display: "flex", aliggItems: "center", gap: "12px" }}>
              <div>
                <ButtonComponent
                  size={40}
                  styleButton={{
                    background: "rgb(255, 57, 69)",
                    height: "48px",
                    width: "220px",
                    border: "none",
                    borderRadius: "4px",
                  }}
                  textbutton={"Chọn mua"}
                  styleTextButton={{
                    color: "#fff",
                    fontSize: "15px",
                    fontWeight: "700",
                  }}
                  onClick={handleAddOrderProduct}
                ></ButtonComponent>
                  {errorLimitOrder && <div style={{color: 'red'}}>Out of Stock</div>}
              </div>
              <ButtonComponent
                size={40}
                styleButton={{
                  background: '#fff',
                  height: "48px",
                  width: "220px",
                  border: "1px solid rgb(13, 92, 182)",
                  borderRadius: "4px",
                }}
                textbutton={"Mua trả sau"}
                styleTextButton={{ color: "black", fontSize: "15px" }}
              ></ButtonComponent>
            </div>
          </Col>
              <CommentComponent className="w-full" />
        </Row>
    </Pending>
    </div>
  );
};

export default ProductDetailsComponents;
