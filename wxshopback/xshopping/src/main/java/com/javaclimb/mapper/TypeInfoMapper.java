package com.javaclimb.mapper;

import com.javaclimb.entity.TypeInfo;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;
import tk.mybatis.mapper.common.Mapper;

import java.util.List;

@Repository
public interface TypeInfoMapper extends Mapper<TypeInfo> {
    //类别名查询
    List<TypeInfo> findByName(@Param("name")String name);
}