package com.javaclimb.mapper;

import com.javaclimb.entity.AdvertiserInfo;
import com.javaclimb.entity.UserInfo;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;
import tk.mybatis.mapper.common.BaseMapper;

import java.util.List;

@Repository
public interface AdvertiserInfoMapper extends BaseMapper<AdvertiserInfo> {
    //公告标题查询，模糊
    List<AdvertiserInfo> findByName(@Param("name")String name);

}