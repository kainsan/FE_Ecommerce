import React, { Fragment, useEffect, useState } from "react";
import NavBarComponent from "../../components/NavBarComponent/NavBarComponent";
import CardComponent from "../../components/CardComponent/CardComponent";
import { Row, Col, Pagination } from "antd";
import { WrapperNavbar, WrapperProducts } from "./style";
import { useLocation } from "react-router-dom";
import * as ProductService from "../../services/ProductService";
import Pending from "../../components/PendingComponent/Pending";
import { useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";
const TypeProductPage = () => {
  const { state } = useLocation();
  const searchProduct = useSelector((state) => state?.product?.search);
  const searchDebounce = useDebounce(searchProduct, 500);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginate, setPaginate] = useState({ page: 0, limit: 10, total: 1 });
  const fetchProductType = async (type, page, limit) => {
    setLoading(true);
    const res = await ProductService.getProductType(type, page, limit);
    if (res?.status === "OK") {
      setLoading(false);
      setProducts(res?.data);
      setPaginate({ ...paginate, total: res?.totalPage });
    } else {
      setLoading(false);
    }
    return res;
  };

  useEffect(() => {
    if (state) {
      fetchProductType(state, paginate.page, paginate.limit);
    }
  }, [state, paginate.page, paginate.limit]);

  const onChange = (current, pageSize) => {
    setPaginate({ ...paginate, page: current - 1, limit: pageSize });
  };

  return (
    <Pending isPending={loading}>
      <div
        style={{
          width: "100%",
          background: "#efefef",
          height: "calc(100vh - 64px)",
        }}
      >
        <div style={{ width: "1270px", margin: "0 auto" }}>
          <Row style={{ flexWrap: "nowrap", paddingTop: "10px" }}>
            <WrapperNavbar span={4}>
              <NavBarComponent />
            </WrapperNavbar>
            <Col
              span={20}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <WrapperProducts>
                {products?.filter((pro) => {
                    if (searchDebounce === "") {
                      return pro
                    } else if (pro?.name?.toLowerCase()?.includes(searchDebounce?.toLowerCase())) {
                      return pro
                    }})?.map((product) => (
                    <CardComponent
                      key={product._id}
                      countInStock={product.countInStock}
                      description={product.description}
                      image={product.image}
                      name={product.name}
                      price={product.price}
                      rating={product.rating}
                      type={product.type}
                      selled={product.selled}
                      discount={product.discount}
                      id={product._id}
                    />
                  ))}
              </WrapperProducts>
            </Col>
          </Row>
        </div>
        <Pagination
          defaultCurrent={paginate.page + 1}
          total={paginate?.total}
          onChange={onChange}
          style={{ textAlign: "center", marginTop: "10px" }}
        />
      </div>
    </Pending>
  );
};

export default TypeProductPage;
