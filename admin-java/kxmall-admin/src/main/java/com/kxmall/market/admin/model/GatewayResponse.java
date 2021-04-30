package com.kxmall.market.admin.model;

import lombok.Data;

/**
 *
 * Description:
 * User: admin
 * Date: 2018-08-12
 * Time: 上午10:35
 * @author Administrator
 */
@Data
public class GatewayResponse {
    private int errno;
    private String errmsg;
    private Object data;
    private long timestamp;


    public int getErrno() {
        return errno;
    }

    public void setErrno(int errno) {
        this.errno = errno;
    }

    public String getErrmsg() {
        return errmsg;
    }

    public void setErrmsg(String errmsg) {
        this.errmsg = errmsg;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }
}
