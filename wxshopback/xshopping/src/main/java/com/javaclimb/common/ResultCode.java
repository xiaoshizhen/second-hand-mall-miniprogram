package com.javaclimb.common;


/**
 * 统一返回码
 */
public enum ResultCode {
    SUCCESS("0","成功"),//调用参数，成功之后得到json的一个返回结果
    ERROR("-1","系统异常"),
    PARAM_ERROR("1001","参数异常"),
    USER_EXIST_ERROR("2001","用户名已存在"),
    USER_ACCOUNT_ERROR("2002","账户或密码错误"),
    SYSTEM_ERROR("2222","系统异常"),
    USER_NOT_EXIST_ERROR("2003","未找到用户"),
    USER_PERMISSION_ERROR("2004","用户权限不足"),
    ORDER_PAY_ERROR("3001", "库存不足，下单失败");;

    public String code;
    public String msg;

    ResultCode(String code, String msg) {
        this.code = code;
        this.msg = msg;
    }
}
