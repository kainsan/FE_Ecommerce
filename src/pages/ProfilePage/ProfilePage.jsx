import React, { useState, useEffect } from "react";
import * as UserService from "../../services/UserService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import Pending from "../../components/PendingComponent/Pending";
import InputForm from "../../components/InputForm/InputForm";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useSelector, useDispatch } from "react-redux";
import * as message from "../../components/Message/Message";
import { updateUser } from "../../redux/slides/userSlide";
import { Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { getBase64 } from "../../utils";
import { WrapperUploadFile } from "./style";
const ProfilePage = () => {
  const user = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState("");
  const dispatch = useDispatch();

  const mutation = useMutationHooks((data) => {
    const { id, access_token, ...rests } = data;
    UserService.updateUser(id, rests, access_token);
  });
  const { data, isPending, isSuccess, isError } = mutation;

  useEffect(() => {
    setEmail(user?.email);
    setName(user?.name);
    setPhone(user?.phone);
    setAddress(user?.address);
    setAvatar(user?.avatar);
  }, [user]);

  useEffect(() => {
    if (isSuccess) {
      message.success();
      handleGetDetailsUser(user?.id, user?.access_token);
    } else if (isError) {
      message.error();
    }
  }, [isSuccess, isError]);

  const handleUpdate = () => {
    mutation.mutate({
      id: user?.id,
      email,
      name,
      phone,
      address,
      avatar,
      access_token: user?.access_token,
    });
  };
  const handleOnChangeEmail = (value) => {
    setEmail(value);
  };
  const handleOnchangeName = (value) => {
    setName(value);
  };
  const handleOnchangePhone = (value) => {
    setPhone(value);
  };
  const handleOnchangeAddress = (value) => {
    setAddress(value);
  };
  const handleOnchangeAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setAvatar(file.preview);
  };

  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token);
    dispatch(updateUser({ ...res?.data, access_token: token }));
  };
  return (
    <>
      <div className="w-[1270px] mx-auto">
        <h1 className="font-semibold text-xl my-2">Profile User</h1>
        <Pending isPending={isPending}>
          <div className="flex flex-col border w-[800px] mx-auto p-[30px] rounded-xl gap-[20px]">
            <div className="flex items-center gap-[20px]">
              <div
                className="w-16 text-xs leading-8 font-medium text-left"
                htmlFor="name"
              >
                Name
              </div>
              <InputForm
                id="name"
                style={{ marginBottom: "10px", marginTop: "10px" }}
                placeholder="abc@gmail.com"
                value={name}
                onChange={handleOnchangeName}
              />
              <ButtonComponent
                onClick={handleUpdate}
                size={40}
                styleButton={{
                  height: "30px",
                  width: "fit-content",
                  borderRadius: "4px",
                  padding: "2px 6px 6px",
                }}
                textbutton={"Cập nhật"}
                styleTextButton={{
                  color: "black",
                  fontSize: "15px",
                  fontWeight: "700",
                }}
              ></ButtonComponent>
            </div>
            <div className="flex items-center gap-[20px]">
              <div
                className="w-16 text-xs leading-8 font-medium text-left"
                htmlFor="email"
              >
                Email
              </div>
              <InputForm
                id="email"
                style={{ marginBottom: "10px", marginTop: "10px" }}
                placeholder="abc@gmail.com"
                value={email}
                onChange={handleOnChangeEmail}
              />
              <ButtonComponent
                onClick={handleUpdate}
                size={40}
                styleButton={{
                  height: "30px",
                  width: "fit-content",
                  borderRadius: "4px",
                  padding: "2px 6px 6px",
                }}
                textbutton={"Cập nhật"}
                styleTextButton={{
                  color: "black",
                  fontSize: "15px",
                  fontWeight: "700",
                }}
              ></ButtonComponent>
            </div>
            <div className="flex items-center gap-[20px]">
              <div
                className="w-16 text-xs leading-8 font-medium text-left"
                htmlFor="phone"
              >
                Phone
              </div>
              <InputForm
                id="phone"
                style={{ marginBottom: "10px", marginTop: "10px" }}
                placeholder="abc@gmail.com"
                value={phone}
                onChange={handleOnchangePhone}
              />
              <ButtonComponent
                onClick={handleUpdate}
                size={40}
                styleButton={{
                  height: "30px",
                  width: "fit-content",
                  borderRadius: "4px",
                  padding: "2px 6px 6px",
                }}
                textbutton={"Cập nhật"}
                styleTextButton={{
                  color: "black",
                  fontSize: "15px",
                  fontWeight: "700",
                }}
              ></ButtonComponent>
            </div>
            <div className="flex items-center gap-[20px]">
              <div
                className="w-16 text-xs leading-8 font-medium text-left"
                htmlFor="address"
              >
                Address
              </div>
              <InputForm
                id="address"
                style={{ marginBottom: "10px", marginTop: "10px" }}
                placeholder="abc@gmail.com"
                value={address}
                onChange={handleOnchangeAddress}
              />
              <ButtonComponent
                onClick={handleUpdate}
                size={40}
                styleButton={{
                  height: "30px",
                  width: "fit-content",
                  borderRadius: "4px",
                  padding: "2px 6px 6px",
                }}
                textbutton={"Cập nhật"}
                styleTextButton={{
                  color: "black",
                  fontSize: "15px",
                  fontWeight: "700",
                }}
              ></ButtonComponent>
            </div>
            <div className="flex items-center gap-[20px]">
              <div
                className="w-16 text-xs leading-8 font-medium text-left"
                htmlFor="avatar"
              >
                Avatar
              </div>
              <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
                <Button icon={<UploadOutlined />}>Select File</Button>
              </WrapperUploadFile>
              {user.avatar && (
                <img
                  src={avatar}
                  className="h-16 w-16 rounded-2xl object-cover"
                  alt="avatar"
                />
              )}
              <ButtonComponent
                onClick={handleUpdate}
                size={40}
                styleButton={{
                  height: "30px",
                  width: "fit-content",
                  borderRadius: "4px",
                  padding: "2px 6px 6px",
                }}
                textbutton={"Cập nhật"}
                styleTextButton={{
                  color: "black",
                  fontSize: "15px",
                  fontWeight: "700",
                }}
              ></ButtonComponent>
            </div>
            <div className="flex items-center gap-[20px]">
              <div
                className="w-16 text-xs leading-8 font-medium text-left"
                htmlFor="address"
              >
                Address
              </div>
              <InputForm
                style={{ width: "300px" }}
                id="address"
                value={address}
                onChange={handleOnchangeAddress}
              />
              <ButtonComponent
                onClick={handleUpdate}
                size={40}
                styleButton={{
                  height: "30px",
                  width: "fit-content",
                  borderRadius: "4px",
                  padding: "2px 6px 6px",
                }}
                textbutton={"Cập nhật"}
                styleTextButton={{
                  color: "black",
                  fontSize: "15px",
                  fontWeight: "700",
                }}
              ></ButtonComponent>
            </div>
          </div>
        </Pending>
      </div>
    </>
  );
};

export default ProfilePage;
