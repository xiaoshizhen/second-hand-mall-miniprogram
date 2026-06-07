package com.javaclimb.mapper;

import com.javaclimb.entity.UserInfo;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;
import tk.mybatis.mapper.common.Mapper;

import java.util.List;

@Repository
//因为继承了UerInfo,所以这里的修改可以没有
public interface UserInfoMapper extends Mapper<UserInfo> {
    //用户名精确查询
    List<UserInfo> findByName(@Param("name")String name);

    //用户唯一性判断
    int checkRepeat(@Param("column")String column,@Param("value")String value);

    //用户总数
    @Select("select count(*) from user_info")
    Integer count();

}