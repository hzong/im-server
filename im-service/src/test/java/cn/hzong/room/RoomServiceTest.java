package cn.hzong.room;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

import cn.hzong.BaseJunit4Test;
import cn.hzong.im.muc.service.MucService;

public class RoomServiceTest extends BaseJunit4Test {
	@Autowired
	public MucService service;
	
	@Test // 标明是测试方法
	@Transactional // 标明此方法需使用事务
	@Rollback(false) // 标明使用完此方法后事务不回滚,true时为回滚
	public void Resource() {
		service.getMucInfo();
	}
}
