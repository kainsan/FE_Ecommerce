import React from "react";
import { Card } from "antd";
import { StarFilled } from "@ant-design/icons";
import logo from '../../assets/images/logo.png';
import { useNavigate } from 'react-router-dom'
import { convertPrice } from '../../utils'
const CardComponent = (props) => {
    const { countInStock, description, image, name, price, rating, type, discount, selled,id } = props
    const navigate = useNavigate()
    const handleDetailsProduct = (id) => {
        navigate(`/product-details/${id}`)
    }
  return (
    <div>
    <Card
      hoverable
      onClick={() => handleDetailsProduct(id)}
      headStyle={{width:'200px' , height: '200px'}}
      className="p-[10px] w-[200px] relative"
      style={{ width: 200 }}
      bodyStyle={{ padding:'10px'}}
      cover={
        <img
          className="w-[200px] h-[200px]"
          alt="example"
          src={image}
        />
      }
    >
      <img src={logo} alt="logo" className="absolute w-[68px] h-[14px] top-0 left-0"/>
      <div className="font-normal text-xs leading-4 text-gray-500">{name}</div>
      <div className="flex items-center text-[11px] text-[#808089] mt-[6px]">
        <span className="flex items-center mr-1">
          <span>{rating}</span>
          <StarFilled className="text-xs text-yellow-400" />
        </span>
        <span> | Sold {selled || 1000}+</span>
      </div>
      <div className="text-base font-medium text-[#ff424e]">
        <span className="mr-2">{convertPrice(price)}</span>
        <span className="text-xs font-medium text-[#ff424e]">- {discount || 5} %</span>
      </div>
    </Card>
    </div>
  );
};

export default CardComponent;
