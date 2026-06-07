package com.javaclimb.service;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.javaclimb.entity.NxSystemFileInfo;
import com.javaclimb.mapper.NxSystemFileInfoMapper;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

/**
 * 文件类别相关的service
 */
@Service
public class NxSystemFileInfoService {
    @Resource
    private NxSystemFileInfoMapper nxSystemFileInfoMapper;


    /**
     * 新增文件类别
     */
    public NxSystemFileInfo add(NxSystemFileInfo nxSystemFileInfo){
        nxSystemFileInfoMapper.insertSelective(nxSystemFileInfo);
        return nxSystemFileInfo;
    }

    /**
     * 修改文件类别
     */
    public void update(NxSystemFileInfo nxSystemFileInfo){
        nxSystemFileInfoMapper.updateByPrimaryKeySelective(nxSystemFileInfo);
    }

    /**
     * 根据id删除文件类别
     */
    public void delete(Long id){
        nxSystemFileInfoMapper.deleteByPrimaryKey(id);
    }

    /**
     * id获取文件类别
     */
    public NxSystemFileInfo findById(Long id) {
        return nxSystemFileInfoMapper.selectByPrimaryKey(id);
    }
}
