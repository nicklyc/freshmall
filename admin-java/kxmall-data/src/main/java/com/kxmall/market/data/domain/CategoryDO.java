package com.kxmall.market.data.domain;

import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableName;
import lombok.Data;

/**
 * Created by admin on 2019/7/2.
 */
@Data
@TableName("kxmall_category")
public class CategoryDO extends SuperDO {

    /**
     * 品类标题名称
     */
    private String title;

    @TableField("parent_id")
    private Long parentId;

    /**
     * 图标
     */
    @TableField("icon_url")
    private String iconUrl;

    /**
     * 分类图片
     */
    @TableField("pic_url")
    private String picUrl;

    /**
     * 目录级别  一级目录  0
     *          二级目录 1
     */
    @TableField("level")
    private Integer level;

    /**
     * 上线 下线 状态，1 表示 【1上架。0下架】
     */
    @TableField("status")
    private Integer status;

}
