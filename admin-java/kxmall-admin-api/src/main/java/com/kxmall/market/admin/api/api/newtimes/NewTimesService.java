package com.kxmall.market.admin.api.api.newtimes;

import com.kxmall.market.core.annotation.HttpMethod;
import com.kxmall.market.core.annotation.HttpOpenApi;
import com.kxmall.market.core.annotation.HttpParam;
import com.kxmall.market.core.annotation.HttpParamType;
import com.kxmall.market.core.annotation.param.NotNull;
import com.kxmall.market.core.exception.ServiceException;
import com.kxmall.market.data.domain.NewTimesDO;
import com.kxmall.market.data.domain.StorageDO;

import java.util.List;

/**
 * 新鲜时报
 * @author kaixin
 */
@HttpOpenApi(group = "promote.newtimes",description = "新鲜时报")
public interface NewTimesService {
    @HttpMethod(description = "模糊查询所有仓库的名称", permission = "promote:newtimes:storagAllName", permissionParentName = "系统管理", permissionName = "新鲜时报")
    public List<StorageDO> storagAllName(
            @NotNull @HttpParam(name = "name", type = HttpParamType.COMMON, description = "配皮仓库名")String name,
            @HttpParam(name = "adminId", type = HttpParamType.ADMIN_ID, description = "管理员ID") Long adminId) throws ServiceException;

    @HttpMethod(description = "查询仓库的新鲜时报", permission = "promote:newtimes:getNewTimes", permissionParentName = "系统管理", permissionName = "新鲜时报")
    public NewTimesDO getNewTimes(
            @NotNull @HttpParam(name = "storage_id", type = HttpParamType.COMMON, description = "仓库id")Integer storageId,
            @HttpParam(name = "adminId", type = HttpParamType.ADMIN_ID, description = "管理员ID") Long adminId) throws ServiceException;


    @HttpMethod(description = "添加或者更新新鲜时报", permission = "promote:newtimes:updageOrAdd", permissionParentName = "系统管理", permissionName = "新鲜时报")
    public NewTimesDO updageOrAdd(
            @NotNull @HttpParam(name = "newTimesDO", type = HttpParamType.COMMON, description = "新鲜时报对象")NewTimesDO newTimesDO,
            @HttpParam(name = "adminId", type = HttpParamType.ADMIN_ID, description = "管理员ID") Long adminId) throws ServiceException;

}
