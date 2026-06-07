package com.javaclimb.mapper;

import com.javaclimb.entity.GoodsInfo;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;
import tk.mybatis.mapper.common.Mapper;

import java.util.List;

@Repository
public interface GoodsInfoMapper extends Mapper<GoodsInfo> {
    //商品名称名查询
    List<GoodsInfo> findByName(@Param("name")String name, @Param("id") Long id);

    //推荐商品
    @Select("select * from goods_info where recommend='是'")
    List<GoodsInfo> findRecommendGoods();

    //热卖商品
    @Select("select * from goods_info order by sales desc ")
    List<GoodsInfo> findHotSalesGoods();

    /*根据类型查询商品列表*/
    @Select("select * from goods_info where typeId = #{typeId}")
    List<GoodsInfo> findByType(@Param("typeId") Integer typeId);
}