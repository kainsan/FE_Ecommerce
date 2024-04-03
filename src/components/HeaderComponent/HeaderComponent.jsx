import React, { useState, useEffect } from "react";
import { Col, Badge, Button, Popover } from "antd";
import {
  WrapperHeader,
  WrapperTextHeader,
  WrapperHeaderAccount,
  WrapperTextHeaderSmall,
} from "./style";
import {
  UserOutlined,
  CaretDownOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import ButtonInputSearch from "../ButtonInputSearch/ButtonInputSearch";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import * as UserService from "../../services/UserService";
import { resetUser } from "../../redux/slides/userSlide";
import Pending from '../PendingComponent/Pending';
import { searchProduct } from '../../redux/slides/productSlide';

const HeaderComponent = ({isHiddenSearch = false ,isHiddenCart = false}) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const order = useSelector((state) => state.order);
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [loading, setLoading] = useState(false);
  const [search,setSearch] = useState('')
  const [isOpenPopup,setIsOpenPopup] = useState(false);
  
  const handleNavigateLogin = () => {
    navigate("/sign-in");
  };
  const handleLogout = async () => {
    setLoading(true);
    localStorage.clear();
    await UserService.logoutUser();
    dispatch(resetUser());
    setLoading(false);
  };

  const handleClickNavigate = (type) => {
    if(type === 'profile') {
      navigate('/profile-user')
    }else if(type === 'admin') {
      navigate('/system/admin')
    }else if(type === 'my-order') {
      navigate('/my-order',{ state : {
          id: user?.id,
          token : user?.access_token
        }
      })
    }else {
      handleLogout()
    }
    setIsOpenPopup(false)
  }
  
  const content = (
    <div>
      <p className="cursor-pointer hover:text-red-600" onClick={handleClickNavigate}>
        Log Out
      </p>
      <p className="cursor-pointer hover:text-red-600" onClick={() => {
          handleClickNavigate('my-order');
        }}>
        My Order Info
      </p>
      <p
        className="cursor-pointer hover:text-red-600"
        onClick={() => {
          handleClickNavigate('profile');
        }}
      >
        Info User
      </p>
      {user?.isAdmin  && (
        <p
        className="cursor-pointer hover:text-red-600"
        onClick={() => {
          handleClickNavigate('admin');
        }}
      >
        Manage System
      </p>
      )}
    </div>
  );

  useEffect(() => {
    setLoading(true);
    setUserName(user?.name);
    setUserAvatar(user?.avatar);
    setLoading(false);
  }, [user?.name, user?.avatar]);

  const onSearch = (e) => {
    setSearch(e.target.value)
    dispatch(searchProduct(e.target.value))
  }

  return (
    <div className="w-full flex justify-center bg-[#1a94ff]">
      <WrapperHeader style={{ justifyContent: isHiddenSearch && isHiddenSearch ? 'space-between' : 'unset' }}>
        <Col span={5}>
          <WrapperTextHeader to="/">SHOP</WrapperTextHeader>
        </Col>
        {!isHiddenSearch && (
        <Col span={13}>
          <WrapperTextHeader>
            <ButtonInputSearch
              size="large"
              placeholder="input search text"
              textutton="Search"
              bordered="false"
              onChange={onSearch}
            />
          </WrapperTextHeader>
        </Col>
        )}
        <Col
          span={6}
          style={{ display: "flex", gap: "54px", alignItems: "center" }}
        >
          <Pending isPending={loading}>
            <WrapperHeaderAccount>
              {userAvatar ? (
                <img className="h-16 w-16 rounded-2xl object-cover" src={userAvatar} alt="userAvatar" />
              ) : (
                <UserOutlined style={{ fontSize: "30px" }} />
              )}

              {user?.access_token ? (
                <>
                  <Popover content={content} trigger="click" open={isOpenPopup}>
                    <div 
                      className="cursor-pointer max-w-24 overflow-hidden text-ellipsis"
                      onClick={()=> setIsOpenPopup((prev) => !prev)}
                      >
                      {userName?.length ? userName : user?.email}
                    </div>
                  </Popover>
                </>
              ) : (
                <div onClick={handleNavigateLogin} className="cursor-pointer">
                  <WrapperTextHeaderSmall>
                    Đăng Nhập/Đăng Kí
                  </WrapperTextHeaderSmall>
                  <div>
                    <WrapperTextHeaderSmall>Tài Khoản</WrapperTextHeaderSmall>
                    <CaretDownOutlined />
                  </div>
                </div>
              )}
            </WrapperHeaderAccount>
          </Pending>
          {!isHiddenCart && (
          <div className="cursor-pointer" onClick={() => navigate('/order')}>
            <Badge count={order?.orderItems?.length} size="small">
              <ShoppingCartOutlined
                style={{ fontSize: "30px", color: "#fff" }}
              />
            </Badge>
            <WrapperTextHeaderSmall>Giỏ Hàng</WrapperTextHeaderSmall>
          </div>
          )}
        </Col>
      </WrapperHeader>
    </div>
  );
};

export default HeaderComponent;
