package com.javaclimb.exception;

import com.javaclimb.common.ResultCode;

/**
 * 自定义前端返回用户异常
 */
public class CustomException extends  RuntimeException {
    private String code;
    private String msg;

    public CustomException( String code,String msg) {
        this.code = code;
        this.msg = msg;
    }

    public CustomException(ResultCode resultCode) {
        this.code = resultCode.code;
        this.msg = resultCode.msg;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
