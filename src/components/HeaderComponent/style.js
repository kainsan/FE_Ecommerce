import {Row} from 'antd';
import { Link } from "react-router-dom";
import styled from 'styled-components';
export const WrapperHeader = styled(Row)`
    background-color: var(--primary-color);
    align-items: center;
    gap: 16px;
    flex-wrap: nowrap;
    width: 1270px;
    padding: 10px 0;
`
export const WrapperTextHeader = styled(Link)`
    font-size: 18px;
    color: #fff;
    font-weight: bold;
    text-align: left;
    &:hover {
        font-size: 18px;
        color: #fff;
    }
`
export const WrapperHeaderAccount= styled.div`
    display: flex;
    align-items: center;
    color:#fff;
    gap: 10px;
`
export const WrapperTextHeaderSmall= styled.span`
    color:#fff;
    font-size: 12px;
    white-space: nowrap; 
`
