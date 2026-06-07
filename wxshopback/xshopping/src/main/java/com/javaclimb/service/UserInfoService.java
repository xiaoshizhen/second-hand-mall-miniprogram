package com.javaclimb.service;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.crypto.SecureUtil;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.javaclimb.common.ResultCode;
import com.javaclimb.entity.UserInfo;
import com.javaclimb.exception.CustomException;
import com.javaclimb.mapper.UserInfoMapper;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import javax.annotation.Resource;
import java.util.List;

/**
 * 用户相关的service
 */
@Service
public class UserInfoService {
    @Resource
    private UserInfoMapper userInfoMapper;


    /**
     * 登录
     */
    public UserInfo login(String name, String password) {
        //数据库是否存在此用户
        List<UserInfo> list = userInfoMapper.findByName(name);
        if (CollectionUtil.isEmpty(list)) {
            throw new CustomException(ResultCode.USER_NOT_EXIST_ERROR);
        }
        //判断密码是否正确
        if (!SecureUtil.md5(password).equals(list.get(0).getPassword())) {
            throw new CustomException(ResultCode.USER_ACCOUNT_ERROR);
        }
        //判断用户等级是否为1，只有level为1的用户可以登录网页管理系统
        UserInfo user = list.get(0);
        if (user.getLevel() == null || !user.getLevel().equals(1)) {
            throw new CustomException(ResultCode.USER_PERMISSION_ERROR);
        }
        return user;
    }

    /**
     * 重置密码
     */
    public UserInfo resetPassword(String name){
        //判断数据库里是否有该用户
        List<UserInfo> list = userInfoMapper.findByName(name);
        if (CollectionUtils.isEmpty(list)){
            throw new CustomException(ResultCode.USER_NOT_EXIST_ERROR);
        }
        list.get(0).setPassword(SecureUtil.md5("123456"));
        userInfoMapper.updateByPrimaryKeySelective(list.get(0));
        return list.get(0);
    }

    /**
     * 分页查询用户列表
     */
    public PageInfo<UserInfo> findPage(Integer pageNum, Integer pageSize, String name){
        PageHelper.startPage(pageNum,pageSize);
        List<UserInfo> list = userInfoMapper.findByName(name);
        return PageInfo.of(list);
    }

    /**
     * 新增用户
     */
    public UserInfo add(UserInfo userInfo){
        //用户不存在时新加，存在时返回用户
        List<UserInfo> list = userInfoMapper.findByName(userInfo.getName());
        if(CollectionUtil.isNotEmpty(list)){
            UserInfo exist = list.get(0);
            // 用本次请求的昵称、头像等更新已存在用户，避免 nickname 为空
            if (StrUtil.isNotBlank(userInfo.getNickname())) {
                exist.setNickname(userInfo.getNickname());
            }
            if (StrUtil.isNotBlank(userInfo.getCode())) {
                exist.setCode(userInfo.getCode());
            }
            userInfoMapper.updateByPrimaryKeySelective(exist);
            return exist;
        }

        if(StrUtil.isBlank(userInfo.getPassword())){
            // 默认密码123456
            userInfo.setPassword(SecureUtil.md5("123456"));
        } else {
            userInfo.setPassword(SecureUtil.md5(userInfo.getPassword()));
        }
        // 如果前端没有传入等级，则默认设置为买家（等级3）
        if(userInfo.getLevel() == null){
            userInfo.setLevel(3);
        }
        userInfoMapper.insertSelective(userInfo);
        return userInfo;
    }

    /**
     * 修改用户
     */
    public void update(UserInfo userInfo){
        userInfoMapper.updateByPrimaryKeySelective(userInfo);
    }

    /**
     * 根据id删除用户
     */
    public void delete(Long id){
        userInfoMapper.deleteByPrimaryKey(id);
    }

    /**
     * 根据id获取用户
     */
    public UserInfo findById(Long id) {
        return userInfoMapper.selectByPrimaryKey(id);
    }

    /**
     *用户总数
     */
    public Integer count(){
        return userInfoMapper.count();
    }
}
