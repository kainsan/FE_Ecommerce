import React,  { useState , useEffect }  from 'react'
import axios from 'axios';
import {Image} from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { WrapperContainerLeft,WrapperTextLight,WrapperContainerRight } from "./style";
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import imageLogo from '../../assets/images/logo-login.webp'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Pending from '../../components/PendingComponent/Pending'
import * as message from '../../components/Message/Message'
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from '../../redux/slides/userSlide'

const SignInPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const user  = useSelector((state) => state.user)

  const mutation = useMutationHooks(
   data => UserService.loginUser(data)
  )
  const { data, isPending, isSuccess } = mutation
  
  const handleNavigateSignUp = () =>{
    navigate('/sign-up')
  }

  const handleOnchangeEmail = (value) => {
    setEmail(value)
  }

  const handleOnchangePassword = (value) => {
   setPassword(value)
  }

  const handleSignIn = () => {
      mutation.mutate({
        email,
        password
      })
  }

  useEffect(() => {
    if (isSuccess) {
      if(location?.state) {
        navigate(location?.state)
      }else {
        navigate('/')
      }
      localStorage.setItem('access_token', JSON.stringify(data?.access_token))
      console.log(data)
      if (data?.access_token) {
        const decoded = jwtDecode(data?.access_token)
        if (decoded?.id) {
          handleGetDetailsUser(decoded?.id, data?.access_token)
        }
      }
    }
  }, [isSuccess])

  const handleGetDetailsUser = async (id ,token) => {
    const res = await UserService.getDetailsUser(id, token)
    dispatch(updateUser({...res?.data, access_token: token}))
  }

  return (
    <div className="h-screen flex items-center justify-center bg-[#00000087]" >
      <div className="w-[800px] h-[445px] flex rounded-md bg-[#fff]">
        <WrapperContainerLeft>
          <h1 className="font-semibold text-4xl">Welcome</h1>
          <p className="font-semibold text-xl">Login</p>
          <InputForm style={{ marginBottom: '10px',marginTop: '10px' }} placeholder="abc@gmail.com" value={email} onChange={handleOnchangeEmail}/>
          <div style={{ position: 'relative' }}>
            <span
              onClick={() => setIsShowPassword(!isShowPassword)}
              style={{
                zIndex: 10,
                position: 'absolute',
                top: '4px',
                right: '8px'
              }}
            >{
                isShowPassword ? (
                  <EyeFilled />
                ) : (
                  <EyeInvisibleFilled />
                )
              }
            </span>
            <InputForm
              placeholder="password"
              type={isShowPassword ? "text" : "password"}
              style={{ marginBottom: '10px'}}
              value={password}
              onChange={handleOnchangePassword}
            />
          </div>
          {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
          <Pending isPending={isPending}>
          <ButtonComponent
              onClick={handleSignIn}
              size={40}
              bordered="false"
              disabled={!email.length || !password.length}
              styleButton={{
                background: "rgb(255, 57, 69)",
                height: "48px",
                width: "100%",
                border: "none",
                borderRadius: "4px",
                margin: '26px 0 10px'
              }}
              textbutton={"Sign In"}
              styleTextButton={{
                color: "#fff",
                fontSize: "15px",
                fontWeight: "700",
              }}
            >
            </ButtonComponent>
            </Pending>
          <p className="mt-3"><WrapperTextLight>Quên mật khẩu?</WrapperTextLight></p>
          <p className="mt-1">Chưa có tài khoản? <WrapperTextLight onClick={handleNavigateSignUp}> Tạo tài khoản</WrapperTextLight></p>
        </WrapperContainerLeft>
        <WrapperContainerRight>
          <Image src={imageLogo} preview={false} alt="image-logo" height="203px" width="203px" />
          <h4>Mua sắm tại LTTD</h4>
        </WrapperContainerRight>
      </div>
    </div >
  )
}

export default SignInPage;
