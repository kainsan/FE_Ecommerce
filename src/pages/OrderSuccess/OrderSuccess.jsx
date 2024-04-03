import React from 'react'
import { WrapperInfo, WrapperContainer, WrapperValue, WrapperCountOrder, WrapperItemOrder, WrapperItemOrderInfo } from './style';
import Pending from '../../components/PendingComponent/Pending';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { orderContant } from '../../contant';
import { convertPrice } from '../../utils';

const OrderSuccess = () => {
  const order = useSelector((state) => state.order)
  const location = useLocation()
  const {state} = location

  return (
    <div style={{ background: "#f5f5fa", with: "100%", height: "100vh" }}>
      <Pending isPending={false}>
        <div style={{ height: "100%", width: "1270px", margin: "0 auto" }}>
          <h3 className="font-bold text-xs">Đơn hàng đặt thành công</h3>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <WrapperContainer>
              <WrapperInfo>
                <div>
                  <div className="font-bold text-xs">Phương thức giao hàng</div>
                  <WrapperValue>
                    <span style={{ color: "#ea8500", fontWeight: "bold" }}>
                      {orderContant.delivery[state?.delivery]}
                    </span>{" "}
                    Giao hàng tiết kiệm
                  </WrapperValue>
                </div>
              </WrapperInfo>
              <WrapperInfo>
                <div>
                  <div className="font-bold text-xs">Phương thức thanh toán</div>
                  <WrapperValue>
                    {orderContant.payment[state?.payment]}
                  </WrapperValue>
                </div>
              </WrapperInfo>
              <WrapperItemOrderInfo>
                {state?.orders?.map((order) => {
                  return (
                    <WrapperItemOrder key={order?.name}>
                      <div
                        style={{
                          width: "500px",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <img
                          src={order.image}
                          style={{
                            width: "77px",
                            height: "79px",
                            objectFit: "cover",
                          }}
                        />
                        <div
                          style={{
                            width: 260,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {order?.name}
                        </div>
                      </div>
                      <div
                        style={{
                          flex: 1,
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <span>
                          <span style={{ fontSize: "13px", color: "#242424" }}>
                            Giá tiền: {convertPrice(order?.price)}
                          </span>
                        </span>
                        <span>
                          <span style={{ fontSize: "13px", color: "#242424" }}>
                            Số lượng: {order?.amount}
                          </span>
                        </span>
                      </div>
                    </WrapperItemOrder>
                  );
                })}
              </WrapperItemOrderInfo>
              <div>
                <span style={{ fontSize: "16px", color: "red" }}>
                  Tổng tiền: {convertPrice(state?.totalPriceMemo)}
                </span>
              </div>
            </WrapperContainer>
          </div>
        </div>
      </Pending>
    </div>
  );
};

export default OrderSuccess;
