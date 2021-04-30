package com.kxmall.market.data.dto;

import com.baomidou.mybatisplus.annotations.TableField;
import lombok.Data;

import java.util.List;

/**
 * 为ElementUi适配的树结构
 * Created by admin on 2019/7/12.
 */
@Data
public class CategoryTreeNodeDTO {

    private String label;

    private Long value;

    private String fullName;

    /**
     * parentId
     */
    private Long parent;

    private Integer level;

    private String iconUrl;

    private String picUrl;


    /**
     * 上线 下线 状态，1 表示 【1上架。0下架】
     */
    private Integer status;

    private List<CategoryTreeNodeDTO> children;

}
