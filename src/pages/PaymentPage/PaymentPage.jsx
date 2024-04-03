import {Form, Radio } from 'antd'
import React, { useEffect, useState,useMemo } from "react";
import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import { Lable, WrapperInfo, WrapperLeft, WrapperRadio, WrapperRight, WrapperTotal } from './style';
import { convertPrice } from '../../utils';
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import InputComponent from "../../components/InputComponent/InputComponent";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserService from "../../services/UserService";
import Pending from "../../components/PendingComponent/Pending";
import * as message from "../../components/Message/Message";
import { updateUser } from "../../redux/slides/userSlide";
import { useNavigate } from "react-router-dom";
import { removeAllOrderProduct } from '../../redux/slides/orderSlide';
import * as OrderService from '../../services/OrderService';
import { PayPalButton } from "react-paypal-button-v2";
import * as PaymentService from '../../services/PaymentService'

const PaymentPage = ({ count = 1 }) => {
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);
  const [listChecked, setListChecked] = useState([]);
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
  const [sdkReady , setSdkReady] = useState(false);
  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });

  const [delivery, setDelivery] = useState('fast')
  const [payment, setPayment] = useState('later_money')
  
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    form.setFieldsValue(stateUserDetails)
  }, [form, stateUserDetails])

  useEffect(() => {
    if(isOpenModalUpdateInfo) {
      setStateUserDetails({
        city: user?.city,
        name: user?.name,
        address: user?.address,
        phone: user?.phone
      })
    }
  }, [isOpenModalUpdateInfo])

  const handleChangeAddress = () => {
    setIsOpenModalUpdateInfo(true)
  }

  const priceMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce((total, cur) => {
      return total + ((cur.price * cur.amount))
    },0)
    return result
  },[order])

  const priceDiscountMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce((total, cur) => {
      const totalDiscount = cur.discount ? cur.discount : 0
      return total + (priceMemo * (totalDiscount  * cur.amount) / 100)
    },0)
    if(Number(result)){
      return result
    }
    return 0
  },[order])

  const deliveryPriceMemo = useMemo(() => {
    if(priceMemo >= 1000 && priceMemo < 5000){
      return 50
    }else if(( priceMemo > 0 && priceMemo < 1000) || order?.orderItemsSelected?.length !== 0) {
      return 10
    } else {
      return 0
    }
  },[priceMemo])

  const totalPriceMemo = useMemo(() => {
    return Number(priceMemo) - Number(priceDiscountMemo) + Number(deliveryPriceMemo)
  },[priceMemo,priceDiscountMemo, deliveryPriceMemo])

  const handleRemoveAllOrder = () => {
    if(listChecked?.length > 1){
      dispatch(removeAllOrderProduct({listChecked}))
    }
  }

  const handleAddOrder = () => {
    if(user?.access_token && order?.orderItemsSelected && user?.name && user?.address && user?.phone && user?.city && priceMemo && user?.id) {
        mutationAddOrder.mutate({ 
            token: user?.access_token, 
            orderItems: order?.orderItemsSelected, 
            fullName: user?.name,
            address:user?.address, 
            phone:user?.phone,
            city: user?.city,
            paymentMethod: payment,
            itemsPrice: priceMemo,
            shippingPrice: deliveryPriceMemo,
            totalPrice: totalPriceMemo,
            user: user?.id,
            email: user?.email 
        })
    }
  }
  const mutationUpdate = useMutationHooks(
    (data) => {
      const { id,
        token,
        ...rests } = data
      const res = UserService.updateUser(
        id,
        { ...rests }, token)
      return res
    },
  )

  const mutationAddOrder = useMutationHooks(
    (data) => {
      const {
        token,
        ...rests } = data
      const res = OrderService.createOrder(
        { ...rests }, token)
      return res
    },
  )

  const {isPending, data} = mutationUpdate
  const {data: dataAdd, isPending:isLoadingAddOrder, isSuccess, isError} = mutationAddOrder

  useEffect(() => {
    if (isSuccess && dataAdd?.status === 'OK') {
        const arrayOrdered = []
      order?.orderItemsSelected?.forEach(element => {
        arrayOrdered.push(element.product)
      });
      dispatch(removeAllOrderProduct({listChecked: arrayOrdered}))
      message.success('Đặt hàng thành công')
      navigate('/orderSuccess', {
        state: {
          delivery,
          payment,
          orders: order?.orderItemsSelected,
          totalPriceMemo: totalPriceMemo
        }
      })
    } else if (isError) {
      message.error()
    }
  }, [isSuccess,isError])

  const handleCancleUpdate = () => {
    setStateUserDetails({
      name: '',
      email: '',
      phone: '',
      city:'',
    })
    form.resetFields()
    setIsOpenModalUpdateInfo(false)
  }

  const handleUpdateInforUser = () => {
    const {name, address , city, phone} = stateUserDetails
    if(name && address && city && phone){
      mutationUpdate.mutate({ id: user?.id, token: user?.access_token, ...stateUserDetails }, {
        onSuccess: () => {
          dispatch(updateUser({name, address,city, phone}))
          setIsOpenModalUpdateInfo(false)
        }
      })
    }
  }

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value
    }) 
  }

  const handleDelivery = (e) => {
    setDelivery(e.target.value)
  }

  const handlePayment = (e) => {
    setPayment(e.target.value)
  }

  const onSuccessPaypal = (details, data) => {
    mutationAddOrder.mutate(
      { 
        token: user?.access_token, 
        orderItems: order?.orderItemsSelected, 
        fullName: user?.name,
        address:user?.address, 
        phone:user?.phone,
        city: user?.city,
        paymentMethod: payment,
        itemsPrice: priceMemo,
        shippingPrice: deliveryPriceMemo,
        totalPrice: totalPriceMemo,
        user: user?.id,
        isPaid :true,
        paidAt: details.update_time, 
        email: user?.email
      }
    )
  }

  const addPaypalScript = async () => {
    const {data} = await PaymentService.getConfig()
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = `https://www.paypal.com/sdk/js?client-id=${data}`
    script.async = true;
    script.onload = () => {
      setSdkReady(true)
    }
    document.body.appendChild(script)
  }
  
  useEffect(() => {
    if(!window.paypal) {
      addPaypalScript()
    }else {
      setSdkReady(true)
    }
  }, [])

  return (
     <div style={{background: '#f5f5fa', with: '100%', height: '100vh'}}>
        <Pending isPending={isLoadingAddOrder}>
            <div style={{height: '100%', width: '1270px', margin: '0 auto'}}>
                <h3 style={{fontWeight: 'bold'}}>Choose payment method</h3>
                <div style={{ display: 'flex', justifyContent: 'center'}}>
                <WrapperLeft>
                <WrapperInfo>
                        <div>
                        <label className="font-bold text-xs">Chọn phương thức giao hàng</label>
                        <WrapperRadio onChange={handleDelivery} value={delivery}> 
                            <Radio  value="fast"><span style={{color: '#ea8500', fontWeight: 'bold'}}>FAST</span> Giao hàng tiết kiệm</Radio>
                            <Radio  value="gojek"><span style={{color: '#ea8500', fontWeight: 'bold'}}>GO_JEK</span> Giao hàng tiết kiệm</Radio>
                        </WrapperRadio>
                        </div>
                    </WrapperInfo>
                    <WrapperInfo>
                        <div>
                        <label className="font-bold text-xs">Chọn phương thức thanh toán</label>
                        <WrapperRadio onChange={handlePayment} value={payment}> 
                            <Radio value="later_money"> Thanh toán tiền mặt khi nhận hàng</Radio>
                            <Radio value="paypal"> Thanh toán tiền bằng paypal</Radio>
                        </WrapperRadio>
                        </div>
                    </WrapperInfo>
                </WrapperLeft>
                <WrapperRight>
                    <div style={{width: '100%'}}>
                    <WrapperInfo>
                        <div>
                        <span>Địa chỉ: </span>
                        <span style={{fontWeight: 'bold'}}>{ `${user?.address} ${user?.city}`} </span>
                        <span onClick={handleChangeAddress} style={{color: '#9255FD', cursor:'pointer'}}>Thay đổi</span>
                        </div>
                    </WrapperInfo>
                    <WrapperInfo>
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <span>Tạm tính</span>
                        <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>{convertPrice(priceMemo)}</span>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <span>Giảm giá</span>
                        <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>{convertPrice(priceDiscountMemo)}</span>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <span>Phí giao hàng</span>
                        <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>{convertPrice(deliveryPriceMemo)}</span>
                        </div>
                    </WrapperInfo>
                    <WrapperTotal>
                        <span>Tổng tiền</span>
                        <span style={{display:'flex', flexDirection: 'column'}}>
                        <span style={{color: 'rgb(254, 56, 52)', fontSize: '24px', fontWeight: 'bold'}}>{convertPrice(totalPriceMemo)}</span>
                        <span style={{color: '#000', fontSize: '11px'}}>(Đã bao gồm VAT nếu có)</span>
                        </span>
                    </WrapperTotal>
                    </div>
                    {payment === 'paypal' && sdkReady? (
                    <div style={{width: '320px'}}>
                      <PayPalButton
                        amount={Math.round(totalPriceMemo)}
                        // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                        onSuccess={onSuccessPaypal}
                        onError={() => {
                          alert("ERR")
                        }}
                      />
                    </div>
                    ) : (
                    <ButtonComponent
                    onClick={handleAddOrder}
                    size={40}
                    styleButton={{
                        background: 'rgb(255, 57, 69)',
                        height: '48px',
                        width: '320px',
                        border: 'none',
                        borderRadius: '4px'
                    }}
                    textbutton={'ORDER'}
                    styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                ></ButtonComponent>
                )}
                </WrapperRight>
                </div>
            </div>
            <ModalComponent title="Cập nhật thông tin giao hàng" open={isOpenModalUpdateInfo} onCancel={handleCancleUpdate} onOk={handleUpdateInforUser}>
                <Pending isPending={isPending}>
                <Form
                    name="basic"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                    autoComplete="on"
                    form={form}
                >
                    <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input your name!' }]}
                    >
                    <InputComponent value={stateUserDetails['name']} onChange={handleOnchangeDetails} name="name" />
                    </Form.Item>
                    <Form.Item
                    label="City"
                    name="city"
                    rules={[{ required: true, message: 'Please input your city!' }]}
                    >
                    <InputComponent value={stateUserDetails['city']} onChange={handleOnchangeDetails} name="city" />
                    </Form.Item>
                    <Form.Item
                    label="Phone"
                    name="phone"
                    rules={[{ required: true, message: 'Please input your  phone!' }]}
                    >
                    <InputComponent value={stateUserDetails.phone} onChange={handleOnchangeDetails} name="phone" />
                    </Form.Item>

                    <Form.Item
                    label="Adresss"
                    name="address"
                    rules={[{ required: true, message: 'Please input your  address!' }]}
                    >
                    <InputComponent value={stateUserDetails.address} onChange={handleOnchangeDetails} name="address" />
                    </Form.Item>
                </Form>
                </Pending>
            </ModalComponent>
        </Pending>
    </div>
  );
};

export default PaymentPage;
