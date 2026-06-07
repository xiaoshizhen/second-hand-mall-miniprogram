package com.javaclimb.config;

//全局拦截，对于用户登录

import com.javaclimb.common.Common;
import com.javaclimb.entity.UserInfo;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class MyInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        UserInfo userInfo = (UserInfo) request.getSession().getAttribute(Common.USER_INFO);
        if (userInfo == null) {
            //如果没信息，到登录页
            response.sendRedirect( "/end/page/login.html");
            return false;
        }
        return true;
    }

}
