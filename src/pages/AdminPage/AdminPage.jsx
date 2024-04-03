import { Menu } from 'antd'
import React, { useEffect, useState } from 'react'
import { getItem } from '../../utils';
import { UserOutlined, AppstoreOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';
import AdminUser from '../../components/AdminUserComponent/AdminUserComponent';
import AdminProduct from '../../components/AdminProductComponent/AdminProductComponent';
import OrderAdmin from '../../components/OrderAdminComponent/OrderAdminComponent';
import * as OrderService from '../../services/OrderService'
import * as ProductService from '../../services/ProductService'
import * as UserService from '../../services/UserService'

import CustomizedContent from './component/CustomizedContent';
import { useSelector } from 'react-redux';
import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';
import Pending from '../../components/PendingComponent/Pending';
const AdminPage = () => {
  const user = useSelector((state) => state?.user)
  const items = [
    getItem('Người dùng', 'users', <UserOutlined />),
    getItem('Sản phẩm', 'products', <AppstoreOutlined />),
    getItem('Đơn hàng', 'orders', <ShoppingCartOutlined />),
  ];

  const [keySelected, setKeySelected] = useState('');

  const getAllOrder = async () => {
    const res = await OrderService.getAllOrder(user?.access_token)
    return {data: res?.data, key: 'orders'}
  }

  const getAllProducts = async () => {
    const res = await ProductService.getAllProduct()
    return {data: res?.data, key: 'products'}
  }

  const getAllUsers = async () => {
    const res = await UserService.getAllUser(user?.access_token)
    return {data: res?.data, key: 'users'}
  }

  const queries = useQueries({
    queries: [
      {queryKey: ['products'], queryFn: getAllProducts, staleTime: 1000 * 60},
      {queryKey: ['users'], queryFn: getAllUsers, staleTime: 1000 * 60},
      {queryKey: ['orders'], queryFn: getAllOrder, staleTime: 1000 * 60},
    ]
  })
  const memoCount = useMemo(() => {
    const result = {}
    try {
      if(queries) {
        queries.forEach((query) => {
          result[query?.data?.key] = query?.data?.data?.length
        })
      }
    return result
    } catch (error) {
      return result
    }
  },[queries])

  const COLORS = {
   users: ['#e66465', '#9198e5'],
   products: ['#a8c0ff', '#3f2b96'],
   orders: ['#11998e', '#38ef7d'],
  };

  const renderPage = (key) => {
    switch (key) {
      case 'users':
        return (
          <AdminUser />
        )
      case 'products':
        return (
          <AdminProduct />
        )
      case 'orders':
        return (
          <OrderAdmin />
        )
      default:
        return <></>
    }
  }

  const handleOnCLick = ({ key }) => {
    setKeySelected(key)
  } 
  return (
    <>
    <HeaderComponent isHiddenSearch isHiddenCart/>
    <div className="flex overflow-x-hidden">
      <Menu
        mode="inline"
        style={{
          width: 256,
          boxShadow: '1px 1px 2px #ccc',
          height: '100vh'
        }}
        items={items}
        onClick={handleOnCLick}
      />
      <div className="flex-1 py-4 pl-4">
         {/* <Pending isPending={memoCount && Object.keys(memoCount) &&  Object.keys(memoCount).length !== 3}> */}
          {!keySelected && (
            <CustomizedContent data={memoCount} colors={COLORS} setKeySelected={setKeySelected} />
          )} 
        {/* </Pending> */}
         {renderPage(keySelected)}
      </div>
    </div>
  </>
  )
}

export default AdminPage
