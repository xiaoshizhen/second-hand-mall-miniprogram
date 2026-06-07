package com.javaclimb.controller;


import cn.hutool.core.util.StrUtil;
import cn.hutool.crypto.SecureUtil;
import com.javaclimb.common.Common;
import com.javaclimb.common.Result;
import com.javaclimb.common.ResultCode;
import com.javaclimb.entity.UserInfo;
import com.javaclimb.exception.CustomException;
import com.javaclimb.service.UserInfoService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

/**
 * 登录相关控制信息
 */

//返回json结构数据，类和对象
@RestController
public class AccountController {
    @Resource
    private UserInfoService userInfoService;

    /**
     * 登录
     */
    @PostMapping("/login")
    public Result<UserInfo> login(@RequestBody UserInfo userInfo, HttpServletRequest request) {
        if (StrUtil.isBlank(userInfo.getName())||StrUtil.isBlank(userInfo.getPassword())) {
            throw new CustomException(ResultCode.USER_ACCOUNT_ERROR);
        }
        //匹配数据库核对是否正确
        UserInfo login = userInfoService.login(userInfo.getName(), userInfo.getPassword());
        HttpSession session = request.getSession();
        session.setAttribute(Common.USER_INFO, login);//将user常量化在Common
        session.setMaxInactiveInterval(60 * 60 * 24);
        return Result.success(login);
    }

    /**
     * 重置密码位123456
     */
    @PostMapping("/resetPassword")
    public Result<UserInfo> resetPassword(@RequestBody UserInfo userInfo){
        return Result.success(userInfoService.resetPassword(userInfo.getName()));
    }

    /**
     * 登出
     */
    @GetMapping("/logout")
    public Result logout(HttpServletRequest request){
        request.getSession().setAttribute(Common.USER_INFO, null);
        return Result.success();
    }

    /**
     * 小程序用户注册
     */
    @PostMapping("/register")
    public Result<UserInfo> register(@RequestBody UserInfo userInfo, HttpServletRequest request){
        if (StrUtil.isBlank(userInfo.getName())||StrUtil.isBlank(userInfo.getPassword())) {
            throw new CustomException(ResultCode.PARAM_ERROR);
        }
        UserInfo register =userInfoService.add(userInfo);
        HttpSession session = request.getSession();
        session.setAttribute(Common.USER_INFO, register);//将user常量化在Common
        session.setMaxInactiveInterval(60 * 60 * 24);
        return Result.success(register);
    }

    /**
     * 判断是否登录
     */
    @PostMapping("/auth")
    public Result getAuth(HttpServletRequest request){
        Object user = request.getSession().getAttribute(Common.USER_INFO);
        if(user == null){
            return Result.error("401","未登录");
        }
        return Result.success(user);
    }

    /**
     * 修改密码
     */
    @PutMapping("/updatePassword")
    public Result updatePassword(@RequestBody UserInfo userInfo, HttpServletRequest request){
        Object user1 = request.getSession().getAttribute(Common.USER_INFO);
        if(user1 == null){
            return Result.error("401", "未登录");
        }
        UserInfo user = (UserInfo)user1;
        String oldPassword = SecureUtil.md5(userInfo.getPassword());
        if(!oldPassword.equals(user.getPassword())){
            return Result.error(ResultCode.USER_ACCOUNT_ERROR.code, ResultCode.USER_ACCOUNT_ERROR.msg);
        }
        user.setPassword(SecureUtil.md5(userInfo.getNewPassword()));
        userInfoService.update(user);
        //清空session，重新登陆
        request.getSession().setAttribute(Common.USER_INFO, null);
        return Result.success();
    }
}
