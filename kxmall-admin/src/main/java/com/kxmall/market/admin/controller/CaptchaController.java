package com.kxmall.market.admin.controller;


import com.kxmall.market.admin.util.Base64;
import com.kxmall.market.admin.util.IdUtils;
import com.kxmall.market.admin.util.VerifyCodeUtils;
import com.kxmall.market.data.component.CacheComponent;
import com.kxmall.market.data.util.Constants;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * 验证码操作处理
 *
 * @author ruoyi
 */
@RestController
public class CaptchaController {
    @Resource
    private CacheComponent cacheComponent;

    /**
     * 生成验证码
     */
    @GetMapping("/captchaImage")
    public Object getCode(HttpServletResponse response) throws IOException {
        // 生成随机字串
        String verifyCode = VerifyCodeUtils.generateVerifyCode(4);
        // 唯一标识
        String uuid = IdUtils.simpleUUID();
        String verifyKey = Constants.CAPTCHA_CODE_KEY + uuid;
        cacheComponent.putRaw(verifyKey, verifyCode, 120);
        // 生成图片
        int w = 111, h = 36;
        ByteArrayOutputStream stream = new ByteArrayOutputStream();
        VerifyCodeUtils.outputImage(w, h, stream, verifyCode);
        Map<String, Object> data = new HashMap<>(4);
        try {
            data.put("uuid", uuid);
            data.put("img", Base64.encode(stream.toByteArray()));
            data.put("errno", 200);
            data.put("errmsg", "成功");
            return data;
        } catch (Exception e) {
            data.put("errno", 404);
            data.put("errmsg", "失败");
            return data;
        } finally {
            stream.close();
        }
    }
}
