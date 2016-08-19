package cn.hzong.im.muc.service.impl;

import org.springframework.stereotype.Service;

import cn.hzong.im.muc.service.MucService;

@Service
public class MucServiceImpl implements MucService {

	public String getMucInfo() {
		System.out.println("获取MUC信息成功");
		return null;
	}
	
}
