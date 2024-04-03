import React,  { useState , useEffect }  from 'react';
import {Image} from 'antd';
import { WrapperContainerLeft,WrapperTextLight,WrapperContainerRight } from "./style";
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import imageLogo from '../../assets/images/logo-login.webp'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Pending from '../../components/PendingComponent/Pending'
import * as message from '../../components/Message/Message'

const SignUpPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const navigate = useNavigate()

  const mutation = useMutationHooks(
    data => UserService.signupUser(data)
   )
   const { data, isPending, isSuccess, isError} = mutation

  const handleNavigateLogin = () =>{
    navigate('/sign-in')
  }

  const handleOnchangeEmail = (value) => {
     setEmail(value)
  }

  const handleOnchangePassword = (value) => {
    setPassword(value)
  }

  const handleOnchangeConfirmPassword = (value) => {
    setConfirmPassword(value)
  }
  
  const handleSignUp = () => {
    mutation.mutate({
      email,
      password,
      confirmPassword,
    })
  }

  useEffect(() => {
    if (isSuccess) {
      message.success()
      handleNavigateLogin()
    } else if (isError) {
      message.error()
    }
  }, [isSuccess, isError])


  return (
    <div>
      <div className="h-screen flex items-center justify-center bg-[#00000087]" >
      <div className="w-[800px] h-[445px] flex rounded-md bg-[#fff]">
        <WrapperContainerLeft>
          <h1 className="font-semibold text-4xl">Welcome</h1>
          <p className="font-semibold text-xl">Register Account</p>
          <InputForm style={{marginTop: '10px' }} placeholder="abc@gmail.com" value={email} onChange={handleOnchangeEmail} />
          <div style={{ position: 'relative' }}>
            <span
              onClick={() => setIsShowPassword(!isShowPassword)}
              style={{
                zIndex: 10,
                position: 'absolute',
                top: '12px',
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
              style={{ marginTop: '10px'}}
              value={password} onChange={handleOnchangePassword}
            />
          </div>
          <div style={{ position: 'relative' }}>
            <span
              onClick={() => setIsShowPassword(!confirmPassword)}
              style={{
                zIndex: 10,
                position: 'absolute',
                top: '12px',
                right: '8px'
              }}
            >{
              setConfirmPassword ? (
                  <EyeFilled />
                ) : (
                  <EyeInvisibleFilled />
                )
              }
            </span>
            <InputForm
              placeholder="confirm password"
              type={isShowPassword ? "text" : "password"}
              style={{ marginTop: '10px'}}
              value={confirmPassword} onChange={handleOnchangeConfirmPassword}
            />
          </div>
          {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
          <Pending isPending={isPending}>
          <ButtonComponent
              onClick={handleSignUp}
              size={40}
              disabled={!email.length || !password.length || !confirmPassword.length}
              bordered="false"
              styleButton={{
                background: "rgb(255, 57, 69)",
                height: "48px",
                width: "100%",
                border: "none",
                borderRadius: "4px",
                margin: '26px 0 10px'
              }}
              textbutton={"Sign Up"}
              styleTextButton={{
                color: "#fff",
                fontSize: "15px",
                fontWeight: "700",
              }}
            ></ButtonComponent>
            </Pending>
          <p className="mt-3"><WrapperTextLight>Forgot PassWord?</WrapperTextLight></p>
          <p className="mt-1">Have An Account? <WrapperTextLight onClick={handleNavigateLogin}>Login</WrapperTextLight></p>
        </WrapperContainerLeft>
        <WrapperContainerRight>
          <Image src={imageLogo} preview={false} alt="image-logo" height="203px" width="203px" />
          <h4>Mua sắm tại LTTD</h4>
        </WrapperContainerRight>
      </div>
    </div >
    </div>
  )
}

export default SignUpPage
