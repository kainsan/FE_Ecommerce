import React, {useState,useEffect,useRef} from "react";
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import SliderComponent from "../../components/SliderComponent/SliderComponent";
import CardComponent from "../../components/CardComponent/CardComponent";
import NavBarComponent from "../../components/NavBarComponent/NavBarComponent";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { WrapperButtonMore} from './style'
import { useQuery } from '@tanstack/react-query'
import * as ProductService from '../../services/ProductService'
import { useSelector } from 'react-redux'
import Pending from '../../components/PendingComponent/Pending'
import { useDebounce } from '../../hooks/useDebounce'


const HomePage = () => { 
  const searchProduct = useSelector((state) => state?.product?.search)
  const [limit, setLimit] = useState(1)
  const searchDebounce = useDebounce(searchProduct, 1000)
  const refSearch= useRef()
  const [typeProducts, setTypeProducts] = useState([])

  const fetchProductAll = async (context) => {
    const limit = context?.queryKey && context?.queryKey[1]
    const search = context?.queryKey && context?.queryKey[2]
    const res = await ProductService.getAllProduct(search, limit)
    return res
  }

  const {isPending, data : products, isPreviousData } = useQuery({
    queryKey: ['products',limit, searchDebounce],
    queryFn: fetchProductAll,
    options: { retry: 3, retryDelay: 1000, keepPreviousData: true }
  })

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct()
    if(res?.status === 'OK'){
      setTypeProducts(res?.data)
    }
  }

  useEffect(() => {
    fetchAllTypeProduct()
  }, [])



  return (
    <Pending isPending={isPending}>
      <div className="w-[1300px] mx-auto">
        <div className="h-11 flex justify-start items-center gap-6">
          {typeProducts?.map((item) => {
            return <TypeProduct key={item} name={item} />;
          })}
        </div>
      </div>
      <div className="w-full bg-[#efefef]">
      <div id="container" className="w-[1270px] h-auto bg-[#efefef] mx-auto">
        <SliderComponent />
        <div className="flex gap-[14px] mt-5 flex-wrap">
        {products?.data?.map((product) => 
               (
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
              )
            )}
        </div>
        <div className="flex w-full justify-center mt-[10px]">
            <WrapperButtonMore 
            textbutton={isPreviousData ? 'Load more' : "Xem thêm"} type="outline" styleButton={{
              border: `1px solid ${products?.total === products?.data?.length ? '#f5f5f5' : '#9255FD'}`, color: `${products?.total === products?.data?.length ? '#f5f5f5' : '#9255FD'}`,
              width: '240px', height: '38px', borderRadius: '4px'
            }}
            disabled={products?.total === products?.data?.length || products?.totalPage === 1}
            styleTextButton={{ fontWeight: 500, color: products?.total === products?.data?.length && '#fff' }}
            onClick={() => setLimit((prev) => prev + 6)}
             />
        </div>
      </div>
      </div>
    </Pending>
  );
};

export default HomePage;
